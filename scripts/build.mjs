import { spawn } from 'node:child_process'
import {
  access,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { writeMailerEnv } from './write-mailer-env.mjs'

const ROOT = process.cwd()
const BACKUP_DIR = path.join(ROOT, '.image-build-backup')
const IMAGE_ROOTS = [path.join(ROOT, 'src'), path.join(ROOT, 'public')]
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const RETRYABLE_FILE_ERRORS = new Set(['EPERM', 'EACCES', 'EBUSY'])
const FILE_OPERATION_RETRIES = 6

const exists = async (target) => {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const withFileRetry = async (operation, label) => {
  let lastError = null

  for (let attempt = 0; attempt < FILE_OPERATION_RETRIES; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (!RETRYABLE_FILE_ERRORS.has(error?.code)) throw error
      if (attempt === FILE_OPERATION_RETRIES - 1) break

      // Windows, antivirus and file indexers can briefly retain handles after
      // image processing. Give them a moment to release the file and retry.
      await wait(100 * (attempt + 1))
    }
  }

  throw new Error(`${label} failed after ${FILE_OPERATION_RETRIES} attempts.`, {
    cause: lastError,
  })
}

const writeFileSafely = async (filePath, contents) =>
  withFileRetry(
    () => writeFile(filePath, contents),
    `Writing ${path.relative(ROOT, filePath)}`,
  )

const removeSafely = async (target, options = {}) =>
  withFileRetry(
    () => rm(target, options),
    `Removing ${path.relative(ROOT, target) || target}`,
  )

const walk = async (directory) => {
  if (!(await exists(directory))) return []

  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await walk(fullPath))
      continue
    }

    if (entry.isFile()) files.push(fullPath)
  }

  return files
}

const restoreBackups = async () => {
  if (!(await exists(BACKUP_DIR))) return

  const backups = await walk(BACKUP_DIR)

  for (const backupPath of backups) {
    const relativePath = path.relative(BACKUP_DIR, backupPath)
    const sourcePath = path.join(ROOT, relativePath)
    const original = await readFile(backupPath)

    await mkdir(path.dirname(sourcePath), { recursive: true })
    await writeFileSafely(sourcePath, original)
  }

  await removeSafely(BACKUP_DIR, { recursive: true, force: true })
}

const cleanupLegacyTempFiles = async () => {
  const files = (await Promise.all(IMAGE_ROOTS.map(walk))).flat()
  const staleTempFiles = files.filter((filePath) =>
    filePath.endsWith('.image-build-tmp'),
  )

  for (const filePath of staleTempFiles) {
    await removeSafely(filePath, { force: true })
  }
}

const createOptimizedCandidate = async (source, extension) => {
  // Process from the in-memory source buffer so Sharp does not keep a handle
  // open on the image that will be rewritten later in the build.
  const image = sharp(source).keepMetadata()

  if (extension === '.png') {
    return image
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
      })
      .toBuffer()
  }

  if (extension === '.jpg' || extension === '.jpeg') {
    return image
      .jpeg({
        quality: 92,
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
      })
      .toBuffer()
  }

  if (extension === '.webp') {
    return image
      .webp({
        quality: 92,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer()
  }

  return null
}

const optimizeImages = async () => {
  const files = (await Promise.all(IMAGE_ROOTS.map(walk))).flat()
  const images = files.filter((filePath) =>
    IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  )

  let optimizedCount = 0
  let originalBytes = 0
  let optimizedBytes = 0

  for (const filePath of images) {
    const extension = path.extname(filePath).toLowerCase()
    const source = await readFile(filePath)
    const candidate = await createOptimizedCandidate(source, extension)

    if (!candidate || candidate.length >= source.length) continue

    const relativePath = path.relative(ROOT, filePath)
    const backupPath = path.join(BACKUP_DIR, relativePath)

    await mkdir(path.dirname(backupPath), { recursive: true })
    await writeFileSafely(backupPath, source)

    // Write the optimized bytes directly instead of renaming a temp file over
    // the existing image. rename() is prone to EPERM on Windows when another
    // process briefly has the destination file open.
    await writeFileSafely(filePath, candidate)

    optimizedCount += 1
    originalBytes += source.length
    optimizedBytes += candidate.length
  }

  const savedBytes = originalBytes - optimizedBytes
  const savedPercent = originalBytes
    ? ((savedBytes / originalBytes) * 100).toFixed(1)
    : '0.0'

  console.log(
    `[images] Optimized ${optimizedCount} image(s), saving ${savedPercent}% across changed files.`,
  )
}

const runNextBuild = async () => {
  const nextBin = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next')

  if (!(await exists(nextBin))) {
    throw new Error('Next.js is not installed. Run npm install before npm run build.')
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, 'build'], {
      cwd: ROOT,
      env: process.env,
      stdio: 'inherit',
    })

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Next.js build stopped by signal ${signal}.`))
        return
      }

      if (code !== 0) {
        reject(new Error(`Next.js build failed with exit code ${code}.`))
        return
      }

      resolve()
    })
  })
}

let buildError = null

try {
  await restoreBackups()
  await cleanupLegacyTempFiles()
  await optimizeImages()
  await runNextBuild()
  // Contact mailer settings from .env -> out/api/env.php
  await writeMailerEnv()
} catch (error) {
  buildError = error
} finally {
  try {
    await restoreBackups()
  } catch (restoreError) {
    if (!buildError) buildError = restoreError
    else console.error('[images] Failed to restore source images:', restoreError)
  }
}

if (buildError) {
  console.error(buildError)
  process.exitCode = 1
}
