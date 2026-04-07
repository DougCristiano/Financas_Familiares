@echo off
REM OpenMonetis Startup Script (Windows)
REM Runs all necessary commands to start the app

echo.
echo ==========================================
echo   OpenMonetis Startup Script (Windows)
echo ==========================================
echo.

REM 1. Check and install dependencies
echo 📦 Checking dependencies...
if not exist "node_modules" (
  echo Installing dependencies...
  call pnpm install
) else (
  echo ✓ Dependencies already installed
)
echo.

REM 2. Check if .env exists
echo 🔧 Checking environment variables...
if not exist ".env" (
  echo Creating .env from .env.local...
  copy .env.local .env
  echo ✓ .env created
) else (
  echo ✓ .env already exists
)
echo.

REM 3. Check if database is running
echo 🗄️  Checking database...
docker ps | find "openmonetis_postgres" >nul
if %errorlevel% equ 0 (
  echo ✓ Database is running
) else (
  echo Starting PostgreSQL database...
  call pnpm run docker:up:db
  timeout /t 5 /nobreak
  echo ✓ Database started
)
echo.

REM 4. Push database schema
echo 📊 Syncing database schema...
call pnpm run db:push
echo ✓ Schema synced
echo.

REM 5. Generate types
echo 🔨 Generating TypeScript types...
call pnpm exec next typegen
echo ✓ Types generated
echo.

REM 6. Start development server
echo 🚀 Starting development server...
echo ==========================================
echo   App running at http://localhost:3000
echo   Access from phone: http://192.168.0.159:3000
echo ==========================================
echo.
call pnpm run dev
