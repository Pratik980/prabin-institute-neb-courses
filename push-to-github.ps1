# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
} else {
    Write-Host "Git repository already initialized" -ForegroundColor Green
}

# Check if remote exists, if not add it
$remoteExists = git remote | Select-String -Pattern "origin"
if (-not $remoteExists) {
    Write-Host "`nAdding remote repository..." -ForegroundColor Cyan
    git remote add origin https://github.com/Pratik980/prabin-institute-neb-courses.git
} else {
    Write-Host "`nRemote 'origin' already exists" -ForegroundColor Green
    Write-Host "Updating remote URL..." -ForegroundColor Cyan
    git remote set-url origin https://github.com/Pratik980/prabin-institute-neb-courses.git
}

Write-Host "`nAdding all files..." -ForegroundColor Cyan
git add .

Write-Host "`nCreating commit..." -ForegroundColor Cyan
$commitMessage = "Add modern UI with glassmorphism, deployment configs, and updated course cards"
git commit -m $commitMessage

Write-Host "`nSetting main branch..." -ForegroundColor Cyan
git branch -M main

Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
Write-Host "Note: You may be prompted for GitHub credentials" -ForegroundColor Yellow
Write-Host "If asked for password, use a Personal Access Token (not your GitHub password)" -ForegroundColor Yellow
Write-Host "Get token from: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/Pratik980/prabin-institute-neb-courses" -ForegroundColor Cyan
} catch {
    Write-Host "`n❌ Push failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Set up authentication (Personal Access Token)" -ForegroundColor Yellow
    Write-Host "2. Or use: git push -u origin main --force (if you need to overwrite)" -ForegroundColor Yellow
}

Write-Host "`nPress Enter to exit..."
Read-Host

