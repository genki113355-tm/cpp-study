@echo off
chcp 65001 > nul
echo ========================================================
echo  Space Invaders - Chapter 6: Game Patterns
echo ========================================================

where g++ >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Compiling with g++ (C++17)...
    g++ -std=c++17 -O2 main.cpp Game.cpp TitleState.cpp PlayState.cpp PauseState.cpp GameOverState.cpp -o invader6.exe
    if %ERRORLEVEL% EQU 0 (
        echo Compilation succeeded! Launching...
        invader6.exe
    ) else (
        echo Compilation failed.
        pause
    )
    exit /b
)

echo g++ compiler not found. Please install MinGW or Visual Studio.
pause

