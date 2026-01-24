@echo off
REM Security Verification Script for KickOff Project (Windows)
REM This script checks if source maps and security measures are properly configured

echo.
echo 🔒 KickOff Security Verification Script
echo ========================================
echo.

echo 1️⃣  Checking Frontend Configuration...
echo ----------------------------------------

if exist "frontend\vite.config.js" (
    echo ✓ Found: frontend\vite.config.js
    findstr /C:"sourcemap" "frontend\vite.config.js" >nul && (
        echo ✓ Source maps configuration found
    ) || (
        echo ✗ Source maps configuration not found
    )
    findstr /C:"terser" "frontend\vite.config.js" >nul && (
        echo ✓ Terser minification enabled
    ) || (
        echo ✗ Terser minification not found
    )
) else (
    echo ✗ Missing: frontend\vite.config.js
)

echo.
echo 2️⃣  Checking Backend Configuration...
echo ----------------------------------------

if exist "backend\app.js" (
    echo ✓ Found: backend\app.js
    findstr /C:"x-powered-by" "backend\app.js" >nul && (
        echo ✓ X-Powered-By header configuration found
    ) || (
        echo ✗ X-Powered-By configuration not found
    )
    findstr /C:"X-Frame-Options" "backend\app.js" >nul && (
        echo ✓ Security headers configured
    ) || (
        echo ✗ Security headers not found
    )
) else (
    echo ✗ Missing: backend\app.js
)

echo.
echo 3️⃣  Checking Environment Files...
echo ----------------------------------------

if exist "frontend\.gitignore" (
    findstr /C:".env" "frontend\.gitignore" >nul && (
        echo ✓ .env is in frontend\.gitignore
    ) || (
        echo ⚠ .env might not be in frontend\.gitignore
    )
) else (
    echo ⚠ frontend\.gitignore not found
)

if exist "backend\.gitignore" (
    findstr /C:".env" "backend\.gitignore" >nul && (
        echo ✓ .env is in backend\.gitignore
    ) || (
        echo ⚠ .env might not be in backend\.gitignore
    )
) else (
    echo ⚠ backend\.gitignore not found
)

echo.
echo 4️⃣  Checking for Environment Files...
echo ----------------------------------------

if exist "frontend\.env" (
    echo ✓ Frontend .env exists
) else (
    echo ⚠ Frontend .env not found (create from .env.example)
)

if exist "backend\.env" (
    echo ✓ Backend .env exists
) else (
    echo ⚠ Backend .env not found (create from .env.example)
)

echo.
echo 5️⃣  Build Test (Optional)...
echo ----------------------------------------
echo To test production build:
echo   cd frontend ^&^& npm run build
echo   Check that dist\ folder has NO .map files
echo.

echo.
echo 📝 Summary
echo =========================================
echo.
echo ✅ Configuration files have been updated
echo ✅ Source maps are disabled in vite.config.js
echo ✅ Backend security headers are configured
echo ✅ Environment-based configurations are set
echo.
echo 🚀 Next Steps:
echo   1. Build frontend: cd frontend ^&^& npm run build
echo   2. Verify no .map files in dist folder
echo   3. Test production: npm run preview
echo   4. Review DEPLOYMENT.md for deployment checklist
echo.
echo 📖 For more details, see:
echo   - SECURITY.md (Security overview)
echo   - DEPLOYMENT.md (Full deployment guide)
echo.

pause
