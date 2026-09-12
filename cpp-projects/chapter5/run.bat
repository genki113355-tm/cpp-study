@echo off
chcp 65001 > nul
echo ========================================================
echo  第5章：スマートポインタとRAII インベーダーゲーム
echo  コンパイル＆実行中... (C++17)
echo ========================================================

g++ -std=c++17 -O2 main.cpp Game.cpp Player.cpp Item.cpp BitDrone.cpp Bullet.cpp Particle.cpp -o chapter5_game.exe

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] コンパイルに失敗しました。g++ がインストールされているか確認してください。
    pause
    exit /b %ERRORLEVEL%
)

echo [OK] ビルド成功！ゲームを開始します...
chapter5_game.exe
pause

