@echo off
chcp 65001 > nul
echo [C++ OOP Invader - Chapter 4: Polymorphism]
echo Compiling...
g++ -std=c++17 main.cpp Game.cpp Player.cpp Bullet.cpp Particle.cpp -o invader_ch4.exe
if %ERRORLEVEL% EQU 0 (
    echo Compilation successful! Launching game...
    invader_ch4.exe
) else (
    echo [ERROR] Compilation failed. Please make sure g++ (MinGW) is installed and in your PATH.
    pause
)

