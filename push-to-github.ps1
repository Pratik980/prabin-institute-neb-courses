Write-Host "Initializing Git repository..." -ForegroundColor Cyan
git init

Write-Host "`nAdding remote repository..." -ForegroundColor Cyan
git remote add origin https://github.com/Pratik980/prabin-institute-neb-courses.git

Write-Host "`nAdding all files..." -ForegroundColor Cyan
git add .

Write-Host "`nCreating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: NEB Video Courses Platform with modern UI and glassmorphism design"

Write-Host "`nSetting main branch..." -ForegroundColor Cyan
git branch -M main

Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
Write-Host "Note: You may be prompted for GitHub credentials" -ForegroundColor Yellow
git push -u origin main

Write-Host "`nDone! Check your repository at: https://github.com/Pratik980/prabin-institute-neb-courses" -ForegroundColor Green
Read-Host "Press Enter to exit"

