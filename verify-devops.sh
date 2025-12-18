#!/bin/bash

# Verification script for DevOps setup
# This script checks that all infrastructure files are in place

echo "🔍 Verifying LinkFolio DevOps Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        ((FAILED++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        ((FAILED++))
    fi
}

# Check GitHub Actions
echo "📋 Checking CI/CD Configuration..."
check_dir ".github"
check_dir ".github/workflows"
check_file ".github/workflows/ci.yml"
echo ""

# Check Docker files
echo "🐳 Checking Docker Configuration..."
check_file "Dockerfile"
check_file "Dockerfile.dev"
check_file "docker-compose.yml"
check_file "docker-compose.dev.yml"
check_file ".dockerignore"
echo ""

# Check health endpoint
echo "🏥 Checking Health Endpoint..."
check_file "src/app/api/health/route.ts"
echo ""

# Check documentation
echo "📚 Checking Documentation..."
check_file "DOCKER_GUIDE.md"
check_file "DEVOPS_SETUP.md"
echo ""

# Check Next.js configuration
echo "⚙️  Checking Next.js Security Configuration..."
if [ -f "next.config.js" ]; then
    if grep -q "X-Frame-Options" next.config.js; then
        echo -e "${GREEN}✓${NC} Security headers configured"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Security headers not found in next.config.js"
        ((FAILED++))
    fi

    if grep -q "output: 'standalone'" next.config.js; then
        echo -e "${GREEN}✓${NC} Standalone output configured"
        ((PASSED++))
    else
        echo -e "${YELLOW}!${NC} Standalone output not configured (optional for Docker)"
    fi
else
    echo -e "${RED}✗${NC} next.config.js not found"
    ((FAILED++))
fi
echo ""

# Check environment setup
echo "🔐 Checking Environment Configuration..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} .env.example not found"
    ((FAILED++))
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env exists"
    ((PASSED++))
else
    echo -e "${YELLOW}!${NC} .env not found (copy from .env.example)"
fi
echo ""

# Check for required tools
echo "🛠️  Checking Required Tools..."

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓${NC} Docker installed: $DOCKER_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Docker not installed"
    ((FAILED++))
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓${NC} Docker Compose installed: $COMPOSE_VERSION"
    ((PASSED++))
else
    echo -e "${YELLOW}!${NC} Docker Compose not installed (or using 'docker compose' v2)"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node.js not installed"
    ((FAILED++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
else
    echo -e "Failed: $FAILED"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All checks passed! Your DevOps setup is complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env and fill in values"
    echo "2. Run: docker-compose -f docker-compose.dev.yml up"
    echo "3. Visit: http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the output above.${NC}"
    echo ""
    exit 1
fi
