@echo off
cd /d "C:\Users\Rodrigo\Documents\IAacademy\IANEXUS\05-web"
echo === Running npm run lint ===
call npm run lint
echo.
echo === Running npx tsc --noEmit ===
call npx tsc --noEmit
echo.
echo === Done ===
