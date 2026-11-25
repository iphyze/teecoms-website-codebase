# Run from the Teecoms Next.js project root after backing up the source.
# Removes only the three explicitly retired public NRS gap-analysis files.
$ErrorActionPreference = 'Stop'
if (-not ((Test-Path -LiteralPath 'package.json') -and (Test-Path -LiteralPath 'src\content\docs\navigation.js'))) {
    throw 'Run this script from the Teecoms website root (contains package.json and src/content/docs/navigation.js).'
}
$files = @(
    'src\app\developers\nrs-alignment\page.js',
    'src\content\docs\nrs-alignment.md',
    'public\docs\digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf'
)
foreach ($file in $files) {
    if (Test-Path -LiteralPath $file) {
        Remove-Item -LiteralPath $file -Force
        Write-Host "Removed retired public asset: $file"
    } else {
        Write-Host "Already absent: $file"
    }
}
$oldDir = 'src\app\developers\nrs-alignment'
if ((Test-Path -LiteralPath $oldDir) -and -not (Get-ChildItem -LiteralPath $oldDir -Force)) {
    Remove-Item -LiteralPath $oldDir -Force
}
Write-Host 'Internal working copy remains at docs/internal/NRS-V1.1-ALIGNMENT-REVIEW.md.'
Write-Host 'Rebuild and delete any already-deployed old route/PDF from the live cPanel web root.'
