@echo off
echo =====================================================================
echo  SchemeConnect AI - Centralized Scheme Intelligence & Convergence
echo  SEG-6 Final Deliverable | Team: Aryan, Abhiraj, Milan, Kamal, Arsalan
echo =====================================================================
echo.
echo [1/2] Initializing SQLite database and loading 25+ verified schemes...
cd /d "%~dp0backend"
start http://localhost:8000
echo [2/2] Launching SchemeConnect AI Platform on http://localhost:8000 ...
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
