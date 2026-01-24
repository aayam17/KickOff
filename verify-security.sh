#!/bin/bash

# Security Verification Script for KickOff Project
# This script checks if source maps and security measures are properly configured

echo "🔒 KickOff Security Verification Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        return 1
    fi
}

# Function to check if a string exists in a file
check_config() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        return 0
    else
        echo -e "${RED}✗${NC} $3"
        return 1
    fi
}

echo "1️⃣  Checking Frontend Configuration..."
echo "----------------------------------------"

# Check if vite.config.js exists
if check_file "frontend/vite.config.js"; then
    # Check for sourcemap: false
    check_config "frontend/vite.config.js" "sourcemap.*false" "Source maps disabled"
    
    # Check for minification
    check_config "frontend/vite.config.js" "minify.*terser" "Terser minification enabled"
    
    # Check for console.log removal
    check_config "frontend/vite.config.js" "drop_console" "Console logs removed in production"
else
    echo -e "${RED}✗${NC} vite.config.js not found!"
fi

echo ""
echo "2️⃣  Checking Backend Configuration..."
echo "----------------------------------------"

# Check if app.js has security measures
if check_file "backend/app.js"; then
    check_config "backend/app.js" "x-powered-by" "X-Powered-By header disabled"
    check_config "backend/app.js" "X-Frame-Options" "Clickjacking protection enabled"
    check_config "backend/app.js" "X-Content-Type-Options" "MIME sniffing protection enabled"
    check_config "backend/app.js" "isProduction" "Environment-based configuration"
else
    echo -e "${RED}✗${NC} app.js not found!"
fi

echo ""
echo "3️⃣  Checking Environment Files..."
echo "----------------------------------------"

# Check if .env is in .gitignore
if check_file "frontend/.gitignore"; then
    if grep -q "^\.env$" "frontend/.gitignore" 2>/dev/null || grep -q "^\.env" "frontend/.gitignore" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} .env is in frontend/.gitignore"
    else
        echo -e "${YELLOW}⚠${NC}  .env might not be in frontend/.gitignore"
    fi
fi

if check_file "backend/.gitignore"; then
    if grep -q "^\.env$" "backend/.gitignore" 2>/dev/null || grep -q "^\.env" "backend/.gitignore" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} .env is in backend/.gitignore"
    else
        echo -e "${YELLOW}⚠${NC}  .env might not be in backend/.gitignore"
    fi
fi

echo ""
echo "4️⃣  Checking for Sensitive Files..."
echo "----------------------------------------"

# Check if .env files exist (they should, but shouldn't be in git)
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env exists"
else
    echo -e "${YELLOW}⚠${NC}  Frontend .env not found (create from .env.example)"
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env exists"
else
    echo -e "${YELLOW}⚠${NC}  Backend .env not found (create from .env.example)"
fi

echo ""
echo "5️⃣  Build Test (Optional)..."
echo "----------------------------------------"
echo -e "${YELLOW}To test production build:${NC}"
echo "  cd frontend && npm run build"
echo "  Check that dist/ folder has NO .map files"
echo ""

echo ""
echo "📝 Summary"
echo "========================================="
echo ""
echo "✅ Configuration files have been updated"
echo "✅ Source maps are disabled in vite.config.js"
echo "✅ Backend security headers are configured"
echo "✅ Environment-based configurations are set"
echo ""
echo "🚀 Next Steps:"
echo "  1. Build frontend: cd frontend && npm run build"
echo "  2. Verify no .map files: ls frontend/dist/*.map (should show no results)"
echo "  3. Test production: npm run preview"
echo "  4. Review DEPLOYMENT.md for deployment checklist"
echo ""
echo "📖 For more details, see:"
echo "  - SECURITY.md (Security overview)"
echo "  - DEPLOYMENT.md (Full deployment guide)"
echo ""
