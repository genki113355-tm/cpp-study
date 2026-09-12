@echo off
chcp 65001 > nul
echo ========================================================
echo  Space Invaders - Chapter 7: ECS & Modern C++ Templates
echo ========================================================

where g++ >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Compiling with g++ (C++17)...
    g++ -std=c++17 -O2 main.cpp Game.cpp -o invader7.exe
    if %ERRORLEVEL% EQU 0 (
        echo Compilation succeeded! Launching ECS Engine...
        invader7.exe
    ) else (
        echo Compilation failed.
        pause
    )
    exit /b
)

echo g++ compiler not found. Please install MinGW or Visual Studio.
pause

