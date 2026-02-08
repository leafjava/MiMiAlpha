@echo off
echo Testing TypeScript compilation...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo TypeScript compilation failed!
    exit /b 1
)
echo TypeScript compilation successful!
echo.
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    exit /b 1
)
echo Build successful!
