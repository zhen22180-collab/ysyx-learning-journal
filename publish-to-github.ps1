param(
  [string]$RepoName = "ysyx-learning-journal",
  [switch]$Private
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI is not installed. Install it first:"
  Write-Host "  winget install --id GitHub.cli"
  exit 1
}

gh auth status | Out-Null

if (-not (Test-Path ".git")) {
  git init
}

git branch -M main
git add index.html README.md assets/app.js assets/styles.css posts/2026-05-12-ysyx-start.md posts/log-template.md .gitignore .nojekyll .github/workflows/pages.yml publish-to-github.ps1

$hasCommit = $true
git rev-parse --verify HEAD *> $null
if ($LASTEXITCODE -ne 0) {
  $hasCommit = $false
}

if ($hasCommit) {
  git commit -m "Prepare YSYX learning journal for GitHub Pages" --allow-empty
} else {
  git commit -m "Prepare YSYX learning journal for GitHub Pages"
}

$visibility = "--public"
if ($Private) {
  $visibility = "--private"
}

if (-not (git remote get-url origin 2>$null)) {
  gh repo create $RepoName $visibility --source . --remote origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "Done. In the GitHub repository, set Settings -> Pages -> Source to GitHub Actions."
