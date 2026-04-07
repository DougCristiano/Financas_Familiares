#!/bin/bash

# OpenMonetis Startup Script
# Runs all necessary commands to start the app

set -e  # Exit on error

echo "=========================================="
echo "  OpenMonetis Startup Script"
echo "=========================================="
echo ""

# 1. Check and install dependencies
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  pnpm install
else
  echo "✓ Dependencies already installed"
fi
echo ""

# 2. Check if .env exists
echo "🔧 Checking environment variables..."
if [ ! -f ".env" ]; then
  echo "Creating .env from .env.local..."
  cp .env.local .env
  echo "✓ .env created"
else
  echo "✓ .env already exists"
fi
echo ""

# 3. Check if database is running
echo "🗄️  Checking database..."
if docker ps | grep -q "openmonetis_postgres"; then
  echo "✓ Database is running"
else
  echo "Starting PostgreSQL database..."
  pnpm run docker:up:db
  sleep 5
  echo "✓ Database started"
fi
echo ""

# 4. Push database schema
echo "📊 Syncing database schema..."
pnpm run db:push
echo "✓ Schema synced"
echo ""

# 5. Generate types
echo "🔨 Generating TypeScript types..."
pnpm exec next typegen
echo "✓ Types generated"
echo ""

# 6. Start development server
echo "🚀 Starting development server..."
echo "=========================================="
echo "  App running at http://localhost:3000"
echo "  Access from phone: http://192.168.0.159:3000"
echo "=========================================="
echo ""
pnpm run dev
