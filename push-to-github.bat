@echo off
echo Initializing Git repository...
git init

echo.
echo Adding remote repository...
git remote add origin https://github.com/Pratik980/prabin-institute-neb-courses.git

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: NEB Video Courses Platform with modern UI and glassmorphism design"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo Note: You may be prompted for GitHub credentials
git push -u origin main

echo.
echo Done! Check your repository at: https://github.com/Pratik980/prabin-institute-neb-courses
pause

