@echo off
echo ========================================
echo  Push to GitHub - Prabin Institute
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing Git repository...
    git init
) else (
    echo Git repository already initialized
)

echo.
REM Check if remote exists
git remote show origin >nul 2>&1
if errorlevel 1 (
    echo Adding remote repository...
    git remote add origin https://github.com/Pratik980/prabin-institute-neb-courses.git
) else (
    echo Remote 'origin' already exists
    echo Updating remote URL...
    git remote set-url origin https://github.com/Pratik980/prabin-institute-neb-courses.git
)

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Add modern UI with glassmorphism, deployment configs, and updated course cards"

echo.
echo Setting main branch...
git branch -M main

echo.
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo Note: You may be prompted for GitHub credentials
echo If asked for password, use a Personal Access Token
echo Get token from: https://github.com/settings/tokens
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo You may need to:
    echo 1. Set up authentication with Personal Access Token
    echo 2. Or run: git push -u origin main --force
) else (
    echo.
    echo ========================================
    echo Successfully pushed to GitHub!
    echo ========================================
    echo Repository: https://github.com/Pratik980/prabin-institute-neb-courses
)

echo.
pause

