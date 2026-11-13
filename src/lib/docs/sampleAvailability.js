import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { getSamplePaths, SAMPLE_DOCUMENTS, SAMPLE_STATES } from '@/content/docs/sampleManifest'

const PNG_MAGIC = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

/**
 * Build-time check for the exact, repository-owned PDF and PNG sample assets.
 * This is deliberately not a runtime request or proof of genuine NRS evidence.
 */
function hasSignature(publicPath, format) {
  const absolutePath = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
  if (!fs.existsSync(absolutePath)) return false
  const expected = format === 'pdf' ? Buffer.from('%PDF-') : PNG_MAGIC
  const actual = Buffer.alloc(expected.length)
  let fd
  try {
    fd = fs.openSync(absolutePath, 'r')
    return fs.readSync(fd, actual, 0, actual.length, 0) === expected.length && actual.equals(expected)
  } catch {
    return false
  } finally {
    if (fd !== undefined) fs.closeSync(fd)
  }
}

export function getSampleAvailability() {
  const rows = SAMPLE_DOCUMENTS.flatMap((sample) => SAMPLE_STATES.map((state) => {
    const { pdf, preview } = getSamplePaths(sample.key, state.key)
    const ready = hasSignature(pdf, 'pdf') && hasSignature(preview, 'png')
    return { ...sample, state, ready, pdf: ready ? pdf : null, preview: ready ? preview : null }
  }))
  const readyCount = rows.filter(({ ready }) => ready).length
  return { rows, readyCount, totalCount: rows.length, complete: readyCount === rows.length }
}
