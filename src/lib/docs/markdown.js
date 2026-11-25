import { Marked } from 'marked'

const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** Reject scripting/data URLs and protocol-relative links from Markdown content. */
function safeUrl(value, { image = false } = {}) {
  const url = String(value || '').trim()
  if (!url || /[\u0000-\u001f\u007f]/.test(url) || url.startsWith('//')) return ''
  if (url.startsWith('#') || (url.startsWith('/') && !url.startsWith('//'))) return url
  if (/^https?:\/\//i.test(url)) return url
  if (!image && /^mailto:/i.test(url)) return url
  return ''
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z]+;/gi, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'section'
}

function createSlugger() {
  const used = new Map()
  return (text) => {
    const base = slugify(text)
    const count = used.get(base) || 0
    used.set(base, count + 1)
    return count ? `${base}-${count + 1}` : base
  }
}

const methodExtension = {
  name: 'httpMethod',
  level: 'inline',
  start: (source) => source.indexOf('[[METHOD:'),
  tokenizer(source) {
    const result = /^\[\[METHOD:(GET|POST|PUT|PATCH|DELETE)\]\]/.exec(source)
    if (result) return { type: 'httpMethod', raw: result[0], method: result[1] }
    return undefined
  },
  renderer(token) {
    return `<span class="docs-method" data-method="${token.method}">${token.method}</span>`
  },
}

/** Parse trusted, repo-owned Markdown at build time, escaping raw HTML. */
export function renderMarkdown(source, { status = 'published', title = '' } = {}) {
  const getHeadingId = createSlugger()
  const getTocId = createSlugger()
  let parser
  let firstTitleSeen = false

  const calloutExtension = {
    name: 'docsCallout',
    level: 'block',
    start: (input) => input.indexOf(':::'),
    tokenizer(input) {
      const match = /^:::(info|warning|planned)(?:[ \t]+([^\n]*))?\n([\s\S]*?)\n:::(?=\n|$)/.exec(input)
      if (!match) return undefined
      return { type: 'docsCallout', raw: match[0], kind: match[1], title: match[2], body: match[3] }
    },
    renderer(token) {
      const title = escapeHtml(token.title || ({ info: 'Note', warning: 'Important', planned: 'Planned' }[token.kind]))
      return `<aside class="docs-callout" data-tone="${token.kind}" aria-label="${title}"><strong class="docs-callout-title">${title}</strong><div>${parser.parse(token.body)}</div></aside>`
    },
  }

  // Only repository-owned architecture SVGs qualify for the theme-aware
  // full-size diagram layout.  Paths are fixed and cannot be external URLs.
  const diagramExtension = {
    name: 'docsDiagram',
    level: 'block',
    start: (input) => input.indexOf('!['),
    tokenizer(input) {
      const match = /^!\[([^\]\n]{5,250})\]\((\/docs\/diagrams\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.svg)\)(?=\n|$)/.exec(input)
      if (!match) return undefined
      return { type: 'docsDiagram', raw: match[0], alt: match[1], src: match[2] }
    },
    renderer(token) {
      const src = escapeHtml(token.src)
      const darkSrc = escapeHtml(token.src.replace(/\.svg$/, '-dark.svg'))
      const alt = escapeHtml(token.alt)
      return `<figure class="docs-diagram"><a class="docs-diagram-light" href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size diagram: ${alt}"><img src="${src}" alt="${alt}" loading="lazy"><span class="docs-diagram-expand">View full-size diagram</span></a><a class="docs-diagram-dark" href="${darkSrc}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size diagram: ${alt}"><img src="${darkSrc}" alt="${alt}" loading="lazy"><span class="docs-diagram-expand">View full-size diagram</span></a><figcaption>${alt}</figcaption></figure>`
    },
  }

  const proposedExtension = {
    name: 'docsProposed',
    level: 'inline',
    start: (input) => input.indexOf('{{proposed:'),
    tokenizer(input) {
      const match = /^\{\{proposed:([^}\n]+)\}\}/.exec(input)
      if (match) return { type: 'docsProposed', raw: match[0], value: match[1] }
      return undefined
    },
    renderer(token) {
      const value = escapeHtml(token.value)
      return status === 'approved' ? value : `<span class="docs-proposed" title="Proposed, pending management approval">${value}<span class="sr-only"> (proposed, pending management approval)</span></span>`
    },
  }


  /** Show draft-only review guidance or approved wording without client JS. */
  const publicationExtension = {
    name: 'docsPublication',
    level: 'block',
    start: (input) => input.indexOf('::::'),
    tokenizer(input) {
      const match = /^::::(draft|approved)[ \t]*\n([\s\S]*?)\n::::(?=\n|$)/.exec(input)
      if (!match) return undefined
      return { type: 'docsPublication', raw: match[0], mode: match[1], body: match[2] }
    },
    renderer(token) {
      const shouldShow = token.mode === 'approved' ? status === 'approved' : status !== 'approved'
      return shouldShow ? parser.parse(token.body) : ''
    },
  }

  const publicationInlineExtension = {
    name: 'docsPublicationInline',
    level: 'inline',
    start: (input) => input.indexOf('{{'),
    tokenizer(input) {
      const match = /^\{\{(draft|approved):([^}\n]+)\}\}/.exec(input)
      if (!match) return undefined
      return { type: 'docsPublicationInline', raw: match[0], mode: match[1], value: match[2] }
    },
    renderer(token) {
      const shouldShow = token.mode === 'approved' ? status === 'approved' : status !== 'approved'
      return shouldShow ? escapeHtml(token.value) : ''
    },
  }

  const renderer = {
    html(token) {
      return escapeHtml(token.text)
    },
    heading(token) {
      // The document title is already the sole visible H1 in DocsHeader. Keep
      // the matching Markdown H1 for portable source, but avoid a duplicate H1.
      if (token.depth === 1 && !firstTitleSeen && token.text.trim() === title.trim()) {
        firstTitleSeen = true
        return ''
      }
      if (token.depth === 1) firstTitleSeen = true
      const id = getHeadingId(token.text)
      return `<h${token.depth} id="${escapeHtml(id)}">${this.parser.parseInline(token.tokens)}</h${token.depth}>`
    },
    table(token) {
      const header = token.header.map((cell) => `<th${cell.align ? ` style="text-align:${cell.align}"` : ''}>${this.parser.parseInline(cell.tokens)}</th>`).join('')
      const rows = token.rows.map((row) => `<tr>${row.map((cell) => `<td${cell.align ? ` style="text-align:${cell.align}"` : ''}>${this.parser.parseInline(cell.tokens)}</td>`).join('')}</tr>`).join('')
      return `<div class="docs-table-scroll" role="region" tabindex="0" aria-label="Scrollable data table"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`
    },
    code(token) {
      const language = /^[\w+-]{1,32}$/.test(token.lang || '') ? token.lang : 'text'
      return `<div class="docs-code"><div class="docs-code-head"><span>${escapeHtml(language)}</span><button type="button" class="docs-code-copy" aria-label="Copy ${escapeHtml(language)} code">Copy code</button></div><pre><code class="language-${escapeHtml(language)}">${escapeHtml(token.text)}</code></pre></div>`
    },
    link(token) {
      const href = safeUrl(token.href)
      if (!href) return this.parser.parseInline(token.tokens)
      return `<a href="${escapeHtml(href)}">${this.parser.parseInline(token.tokens)}</a>`
    },
    image(token) {
      const src = safeUrl(token.href, { image: true })
      if (!src) return escapeHtml(token.text)
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(token.text)}" loading="lazy" />`
    },
  }

  parser = new Marked({ gfm: true, breaks: false, async: false, renderer, extensions: [methodExtension, calloutExtension, proposedExtension, publicationExtension, publicationInlineExtension, diagramExtension] })
  const tokens = parser.lexer(source)
  // Visible draft/approved blocks may contain headings (e.g. a draft-only
  // sign-off checklist); include them in the TOC without showing hidden ones.
  function visibleHeadings(list) {
    const headings = []
    for (const token of list) {
      if (token.type === 'heading' && (token.depth === 2 || token.depth === 3)) headings.push(token)
      if (token.type === 'docsPublication') {
        const visible = token.mode === 'approved' ? status === 'approved' : status !== 'approved'
        if (visible) headings.push(...visibleHeadings(parser.lexer(token.body)))
      }
    }
    return headings
  }
  const toc = visibleHeadings(tokens)
    .map((token) => ({ id: getTocId(token.text), label: token.text.replace(/[*_`]/g, ''), depth: token.depth }))
  return { html: parser.parser(tokens), toc }
}
