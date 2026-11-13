// Generates design/comps.html: a static, pixel-accurate design reference for
// every section after the hero. Run: node design/build-comps.mjs
// The real site builds these as React components; this file is the visual spec.
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'

const require = createRequire(import.meta.url)
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const L = require('lucide-react')

const icon = (name, size = 20, stroke = 2) =>
  renderToStaticMarkup(React.createElement(L[name], { size, strokeWidth: stroke, 'aria-hidden': true }))

const eyebrow = (text, tone = '') => `<p class="eyebrow ${tone}">${text}</p>`
const btn = (label, variant = 'primary', arrow = true) =>
  `<a class="btn" data-variant="${variant}" href="#"><span>${label}</span>${arrow ? '<svg viewBox="0 0 16 16"><path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5"/></svg>' : ''}</a>`

/* ---------- Device mockups (shared by DigitalInvoice + CTA) --------------- */
const diDashboard = () => `
<div class="app">
  <aside class="app-side">
    <img src="../public/images/digitalinvoice/digitalinvoice-logo-compact-light.svg" class="on-light" alt="" height="16">
    <img src="../public/images/digitalinvoice/digitalinvoice-logo-compact-dark.svg" class="on-dark" alt="" height="16">
    <nav>
      ${[['LayoutDashboard', 'Dashboard', 1], ['FileText', 'Invoices'], ['Users', 'Customers'], ['BarChart3', 'Reports'], ['Settings', 'Settings']]
        .map(([i, t, a]) => `<span class="${a ? 'on' : ''}">${icon(i, 13)}${t}</span>`).join('')}
    </nav>
  </aside>
  <div class="app-main">
    <div class="app-top"><div><strong>Welcome back</strong><small>Teecoms Integrated Solutions Limited</small></div><span class="app-btn">${icon('Plus', 12, 2.5)}New invoice</span></div>
    <div class="app-kpis">
      <div><small>Total invoices</small><strong class="num">1,245</strong><em class="up">+12% this month</em></div>
      <div><small>Total amount</small><strong class="num">₦24,850,000</strong><em class="up">+8.4%</em></div>
      <div><small>Paid</small><strong class="num">1,102</strong><em>88.5%</em></div>
    </div>
    <div class="app-row">
      <div class="app-chart"><small>Invoice trend</small><div class="bars">${[38, 52, 44, 63, 58, 74, 69, 86].map((h) => `<i style="--h:${h}%"></i>`).join('')}</div></div>
      <div class="app-donut"><small>Invoice status</small><span class="donut"></span><ul><li><i class="g"></i>Paid</li><li><i class="b"></i>Submitted</li><li><i class="y"></i>Pending</li></ul></div>
    </div>
    <div class="app-table">
      ${[['INV-2026-0418', 'Adébáyọ̀ Stores', '₦1,245,000.00', 'Paid'], ['INV-2026-0419', 'Ụgọchukwu Logistics', '₦86,500.00', 'Pending']]
        .map(([id, c, a, s]) => `<div><span class="num">${id}</span><span>${c}</span><strong class="num">${a}</strong><b data-s="${s.toLowerCase()}">${s}</b></div>`).join('')}
    </div>
  </div>
</div>`

const diPhone = () => `
<div class="phone">
  <div class="phone-screen">
    <span class="island"></span>
    <div class="ph-top"><img src="../public/images/digitalinvoice/digitalinvoice-icon.svg" alt="" height="22"><strong>Invoice</strong>${icon('Bell', 14)}</div>
    <div class="ph-amount"><small>Amount due</small><strong class="num">₦1,245,000.00</strong><b data-s="paid">${icon('Check', 11, 3)} Paid</b></div>
    <div class="ph-lines">
      ${[['Network setup', '₦850,000.00'], ['Cloud hosting', '₦300,000.00'], ['VAT 7.5%', '₦95,000.00']].map(([a, b]) => `<div><span>${a}</span><span class="num">${b}</span></div>`).join('')}
    </div>
    <div class="ph-qr">${'1110111010001011101011100010111011101010'.split('').concat('1011101010111001010'.split('')).slice(0, 49).map((b) => `<i class="${b === '1' ? 'on' : ''}"></i>`).join('')}</div>
    <span class="ph-btn">Share invoice</span>
  </div>
</div>`

/* ---------- Sections ------------------------------------------------------ */
const about = `
<section id="about" class="sec">
  <div class="container about">
    <div class="about-copy reveal">
      ${eyebrow('Who we are')}
      <h2>Technology Solutions Built Around Your Business.</h2>
      <p class="lead">Teecoms Integrated Solutions Limited is a Nigerian information and communications technology company providing innovative, secure and cost-effective technology and telecommunications solutions to public and private sector organisations.</p>
      <p>Our expertise spans ICT infrastructure, cloud and hosting, cybersecurity, software and application services, managed IT operations, digital transformation and technology consultancy.</p>
      <p>We understand that organisations need more than technology. They need dependable systems, practical expertise and solutions that respond to evolving business needs.</p>
      <p>At Teecoms, we bring together technology, people and processes to help organisations enhance efficiency, strengthen security and create lasting value.</p>
      ${btn('Discover Our Expertise', 'outline')}
    </div>
    <div class="about-visual reveal">
      <div class="expertise">
        <img class="watermark" src="../public/images/brand/teecoms-mark-dark.webp" alt="">
        <small>Our expertise</small>
        <ul>
          ${[['Server', 'ICT infrastructure'], ['Cloud', 'Cloud & hosting'], ['ShieldCheck', 'Cybersecurity'], ['Code2', 'Software & applications'], ['MonitorCog', 'Managed IT operations'], ['Workflow', 'Digital transformation'], ['Compass', 'Technology consultancy']]
            .map(([i, t]) => `<li>${icon(i, 18)}<span>${t}</span></li>`).join('')}
        </ul>
      </div>
      <div class="sector-chip">${icon('Landmark', 18)}<span><strong>Public &amp; private sector</strong><small>Organisations across Nigeria</small></span></div>
    </div>
  </div>
  <div class="container mv">
    <article class="mv-card reveal"><span class="mv-icon">${icon('Target', 20)}</span><small>Our mission</small><h3>Making Digital Connectivity and Innovation Accessible.</h3><p>To expand Nigeria's digital capacity by delivering resilient, affordable and high-quality technology and telecommunications services. We are committed to bridging connectivity gaps, supporting digital transformation and empowering organisations with practical, reliable solutions.</p></article>
    <article class="mv-card dark reveal"><span class="mv-icon">${icon('Eye', 20)}</span><small>Our vision</small><h3>Building a Smarter, More Connected Tomorrow.</h3><p>To become a trusted leader in innovative, secure and high-quality ICT and telecommunications solutions, enabling a digitally connected society and supporting sustainable socio-economic development across Nigeria and beyond.</p></article>
  </div>
</section>`

const SERVICES = [
  ['Server', 'IT Infrastructure Services', 'Building the Foundation for Reliable Connectivity.', 'We provide ICT infrastructure solutions designed to support communication, connectivity and business operations, built for current needs and future growth.'],
  ['Cloud', 'Cloud & Hosting Services', 'Flexible Infrastructure for Modern Business.', 'Cloud and hosting services that support business applications, data accessibility and the efficient management of digital resources.'],
  ['ShieldCheck', 'Cybersecurity & Compliance', 'Protecting What Matters Most.', 'We help organisations strengthen information security, manage technology risks and support compliance with data protection and regulatory requirements.'],
  ['MonitorCog', 'Managed ICT Services', 'Your Technology. Expertly Supported.', 'Maintenance, monitoring and operational reliability for essential systems, so you can focus on running your business.'],
  ['Code2', 'Software & Application Services', 'Digital Solutions Designed Around Your Needs.', 'Software and application services that support process improvement, workflow automation and efficient digital operations.'],
  ['Workflow', 'Digital Transformation & Advisory', 'Turning Technology into Business Advantage.', 'We evaluate your technology needs, identify opportunities for improvement and develop practical approaches to modernisation.'],
  ['GraduationCap', 'Training & Capacity Building', 'Empowering People Through Technology.', 'Training that helps individuals and teams strengthen their digital capabilities and improve technology adoption.'],
  ['Presentation', 'Corporate Digital Transformation Workshops', "Helping Organisations Prepare for What's Next.", 'Workshops that help teams explore emerging technologies and develop practical ideas for improving performance.'],
]
const services = `
<section id="services" class="sec alt">
  <div class="container">
    <div class="sec-head split reveal">
      <div>${eyebrow('What we do')}<h2>Comprehensive Technology Solutions for a Digital World.</h2></div>
      <p>From building reliable technology infrastructure to developing intelligent software solutions, Teecoms offers services that help organisations operate efficiently, protect their digital assets and adapt to technological change.</p>
    </div>
    <div class="svc-grid">
      ${SERVICES.map(([i, t, s, d], n) => `<article class="svc reveal${n === 2 ? ' is-hover' : ''}" style="--i:${n}"><div class="svc-top"><span class="svc-icon">${icon(i, 22)}</span><span class="svc-num num">0${n + 1}</span></div><h3>${t}</h3><strong>${s}</strong><p>${d}</p></article>`).join('')}
    </div>
    <div class="center reveal">${btn("Let's Build Your Next Solution")}</div>
  </div>
</section>`

const FEATURES = [
  ['FileText', 'Streamlined Digital Invoicing', 'Create, organise and manage business invoices through a more efficient digital workflow.'],
  ['Receipt', 'More Organised Billing Records', 'Reduce dependence on scattered manual records and keep clearer visibility over invoicing.'],
  ['Eye', 'Transaction Visibility', 'Keep track of invoice information and associated transaction activity.'],
  ['BarChart3', 'Business Reporting', 'Billing information and reporting insights that support financial oversight and decisions.'],
]
const digitalinvoice = `
<section id="digitalinvoice" class="sec di">
  <div class="container">
    <div class="di-hero">
      <div class="di-copy reveal">
        <img class="di-logo on-light" src="../public/images/digitalinvoice/digitalinvoice-logo-light.svg" alt="DigitalInvoice" height="60">
        <img class="di-logo on-dark" src="../public/images/digitalinvoice/digitalinvoice-logo-dark.svg" alt="" height="60">
        ${eyebrow('Innovation by Teecoms', 'di')}
        <h2>Introducing DigitalInvoice</h2>
        <p class="di-sub">Simplifying Invoicing. Supporting Business Growth.</p>
        <p>DigitalInvoice is a flagship digital invoicing and billing solution from Teecoms, designed to help businesses streamline invoice management and improve the efficiency of their financial workflows.</p>
        <p>By bringing essential billing activities into a structured digital environment, DigitalInvoice aims to reduce manual processes, improve transaction visibility and make everyday invoicing more convenient.</p>
        <div class="actions">${btn('Discover DigitalInvoice', 'di')}${btn('Request a Product Demo', 'outline')}</div>
      </div>
      <div class="devices reveal">
        <div class="laptop"><div class="lid"><span class="cam"></span><div class="screen">${diDashboard()}</div></div><div class="base"><span></span></div></div>
        ${diPhone()}
        <div class="float-toast">${icon('CircleCheck', 18, 2.4)}<span><strong>Payment received</strong><small class="num">₦1,245,000.00 for INV-2026-0418</small></span></div>
      </div>
    </div>
    <h3 class="di-features-title reveal">What DigitalInvoice Brings to Your Business</h3>
    <div class="di-features">
      ${FEATURES.map(([i, t, d], n) => `<article class="feat reveal" style="--i:${n}"><span class="feat-icon">${icon(i, 20)}</span><h4>${t}</h4><p>${d}</p></article>`).join('')}
    </div>
    <div class="di-close reveal"><div><h3>Built for Businesses Ready to Work Smarter.</h3><p>DigitalInvoice reflects Teecoms' commitment to developing practical technology products that address everyday business challenges.</p></div>${btn('Request a Product Demo', 'di')}</div>
  </div>
</section>`

const VALUES = [
  ['Lightbulb', 'Innovation', 'We embrace modern technologies and forward-thinking ideas to develop solutions that improve efficiency, performance and long-term value.'],
  ['BadgeCheck', 'Reliability', 'We prioritise dependable services and resilient systems that organisations can rely on for their daily operations.'],
  ['Users', 'Customer-Centricity', "We listen, understand and respond to each client's requirements, with solutions shaped around their needs and objectives."],
  ['Scale', 'Integrity', 'We value honesty, accountability and transparency in our partnerships, service delivery and business decisions.'],
  ['Award', 'Excellence', 'We pursue high standards through careful planning, quality controls and continuous improvement.'],
  ['Lock', 'Security & Compliance', 'We protect information and maintain responsible practices aligned with relevant security and regulatory requirements.'],
  ['Handshake', 'Collaboration', 'Meaningful partnerships and teamwork are essential to delivering effective, sustainable technology solutions.'],
  ['Leaf', 'Sustainability', 'We support responsible resource use and technology that contributes to long-term social and economic development.'],
]
const why = `
<section id="why" class="sec">
  <div class="container why">
    <div class="why-head reveal">
      ${eyebrow('The Teecoms advantage')}
      <h2>Technology Expertise. Trusted Relationships. Lasting Value.</h2>
      <p class="lead">We believe the best technology solutions are built on a clear understanding of the people and organisations they serve.</p>
      <p>Our approach combines technical capability, responsible service delivery and a commitment to helping clients make better use of technology.</p>
    </div>
    <div class="values">
      ${VALUES.map(([i, t, d], n) => `<article class="value reveal" style="--i:${n}"><span class="value-icon">${icon(i, 20)}</span><div><h3>${t}</h3><p>${d}</p></div></article>`).join('')}
    </div>
  </div>
</section>`

const TEAM = [
  ['Babalola Oluwatobi Samuel', 'Managing Director', 'Provides overall strategic leadership, corporate direction and governance oversight, guiding business growth, stakeholder relations and the company’s technology initiatives.'],
  ['Azuka Adoh', 'Chief Technical Officer', 'Leads technical direction across software development, systems engineering, network deployment, cybersecurity and ICT infrastructure.'],
  ['Ayotunde Odusanya', 'Operations Manager', 'Coordinates day-to-day operations, project execution, service delivery and operational processes for efficient implementation.'],
  ['Tolulope Babalola', 'Finance & Administration Manager', 'Oversees financial planning, reporting, budgeting, administration and internal controls.'],
  ['Juliet Onyinyechi Ugochukwu', 'Human Resources Manager', 'Supports workforce development, employee relations, organisational administration and people-focused initiatives.'],
]
const initials = (n) => n.split(' ').filter((_, i, a) => i === 0 || i === a.length - 1).map((w) => w[0]).join('')
const team = `
<section id="team" class="sec alt">
  <div class="container">
    <div class="sec-head split reveal">
      <div>${eyebrow('The people behind Teecoms')}<h2>Driven by Expertise. United by Purpose.</h2></div>
      <p>Our management team brings together expertise in business leadership, technology, operations, financial administration and people management, guiding our commitment to reliable ICT solutions, sound corporate governance and lasting client relationships.</p>
    </div>
    <div class="team-grid">
      ${TEAM.map(([n, r, d], i) => `<article class="person reveal" style="--i:${i}"><div class="photo" data-i="${i}"><span>${initials(n)}</span></div><div class="person-body"><h3>${n}</h3><strong>${r}</strong><p>${d}</p></div></article>`).join('')}
    </div>
  </div>
</section>`

const commitments = `
<section id="commitments" class="sec band">
  <div class="container">
    <div class="sec-head split reveal">
      <div>${eyebrow('Responsibility at every level', 'light')}<h2>Built on Quality, Safety and Trust.</h2></div>
      <p>At Teecoms, responsible service delivery is central to the way we operate. Our corporate policies reflect our commitment to maintaining professional standards, protecting information and providing a safe environment for employees, clients and stakeholders.</p>
    </div>
    <div class="commit-grid">
      ${[['ClipboardCheck', 'Quality Assurance', 'Delivering with Care and Consistency.', 'We apply quality control, documentation review and compliance checks as part of our commitment to consistent service delivery and project excellence.'],
        ['HardHat', 'Health, Safety & Environment', "Safety is Everyone's Responsibility.", 'We promote safe working practices, preventive measures and environmental responsibility to help safeguard our people, clients and project environments.'],
        ['FileLock2', 'Data Protection & Regulatory Compliance', 'Protecting Information. Building Confidence.', 'We are committed to the responsible handling of personal and corporate information, guided by applicable Nigerian data protection requirements and relevant industry regulations.']]
        .map(([i, t, s, d], n) => `<article class="commit reveal" style="--i:${n}"><span class="commit-icon">${icon(i, 22)}</span><h3>${t}</h3><strong>${s}</strong><p>${d}</p></article>`).join('')}
    </div>
  </div>
</section>`

const cta = `
<section id="cta" class="sec cta-sec">
  <div class="container">
    <div class="cta reveal">
      <div class="cta-copy">
        ${eyebrow("Let's create something meaningful", 'light')}
        <h2>Your Next Digital Opportunity Starts Here.</h2>
        <p>Whether you are strengthening your ICT infrastructure, modernising business operations, improving cybersecurity or exploring new digital solutions, Teecoms is ready to discuss your technology needs.</p>
        <div class="actions">${btn('Start a Conversation')}${btn('Explore Our Services', 'glass')}</div>
      </div>
      <div class="cta-phone">${diPhone()}</div>
    </div>
  </div>
</section>`

const field = (label, type = 'text', ph = '') => `<label class="field"><span>${label}</span><input type="${type}" placeholder="${ph}"></label>`
const contact = `
<section id="contact" class="sec">
  <div class="container contact">
    <div class="contact-copy reveal">
      ${eyebrow('Get in touch')}
      <h2>Let's Talk About Your Next Project.</h2>
      <p class="lead">Have a technology challenge, a business idea or a project in mind? Our team would be pleased to discuss your requirements and explore how Teecoms can support your organisation.</p>
      <ul class="contact-list">
        <li><span>${icon('Building2', 18)}</span><div><small>Company</small><strong>Teecoms Integrated Solutions Limited</strong></div></li>
        <li><span>${icon('Mail', 18)}</span><div><small>Email</small><strong class="tbc">Verified company email</strong></div></li>
        <li><span>${icon('Phone', 18)}</span><div><small>Telephone</small><strong class="tbc">Verified telephone number</strong></div></li>
        <li><span>${icon('MapPin', 18)}</span><div><small>Office location</small><strong class="tbc">Verified corporate address</strong></div></li>
      </ul>
    </div>
    <form class="form reveal" onsubmit="return false">
      <div class="form-row">${field('Full name', 'text', 'Adaeze Okafor')}${field('Company / Organisation', 'text', 'Your organisation')}</div>
      <div class="form-row">${field('Business email', 'email', 'name@company.com')}${field('Phone number', 'tel', '+234 800 000 0000')}</div>
      <label class="field"><span>Service of interest</span><span class="select">Cloud &amp; Hosting Services${icon('ChevronDown', 16)}</span></label>
      <label class="field"><span>Your message</span><textarea rows="4" placeholder="Tell us about your project, timeline and goals"></textarea></label>
      <button class="btn wide" data-variant="primary" type="submit"><span>Send Your Enquiry</span>${icon('Send', 15)}</button>
    </form>
  </div>
</section>`

const footer = `
<footer class="footer" id="footer">
  <div class="container">
    <div class="foot-top">
      <div class="foot-brand">
        <img src="../public/images/brand/teecoms-logo-dark.webp" alt="Teecoms" height="40">
        <p class="foot-tag">Connecting People. Securing Systems. Transforming Businesses.</p>
        <p>Innovative ICT, telecommunications and digital transformation solutions for a connected future.</p>
      </div>
      <div><h4>Quick links</h4><ul>${['Home', 'About Us', 'Our Services', 'DigitalInvoice', 'Our Team', 'Contact'].map((t) => `<li><a href="#">${t}</a></li>`).join('')}</ul></div>
      <div><h4>Our services</h4><ul>${['IT Infrastructure', 'Cloud & Hosting', 'Cybersecurity', 'Managed ICT', 'Software Solutions', 'Digital Transformation'].map((t) => `<li><a href="#">${t.replace('&', '&amp;')}</a></li>`).join('')}</ul></div>
      <div class="foot-product"><h4>Flagship product</h4><img src="../public/images/digitalinvoice/digitalinvoice-logo-compact-dark.svg" alt="DigitalInvoice" height="26"><p>Digital invoicing and billing solutions by Teecoms.</p>${btn('Explore DigitalInvoice', 'glass')}</div>
    </div>
    <div class="foot-bottom"><span>© 2026 Teecoms Integrated Solutions Limited. All rights reserved.</span><a href="#" class="to-top">Back to top ${icon('ArrowUp', 14)}</a></div>
  </div>
</footer>`

const html = `<!doctype html>
<html lang="en-NG" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Teecoms: section design comps</title>
<link rel="stylesheet" href="../src/styles/tokens.css">
<link rel="stylesheet" href="./comps.css">
</head>
<body>
<!-- Static design reference. Sections after the hero, in page order. -->
<main>
${about}
${services}
${digitalinvoice}
${why}
${team}
${commitments}
${cta}
${contact}
</main>
${footer}
</body>
</html>`

writeFileSync(new URL('./comps.html', import.meta.url), html)
console.log('design/comps.html written')
