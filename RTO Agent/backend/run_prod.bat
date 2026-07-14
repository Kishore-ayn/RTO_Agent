@echo off
REM Production launcher: binds to all network interfaces so other LAN machines
REM can reach the API + built frontend. No --reload (dev-only, hurts stability).
call venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000

echo.
echo Server stopped or crashed. Read any error above.
pause
