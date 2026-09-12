@echo off
chcp 65001 > nul
echo [ビルド中] 第3章：動的生成 & 爆発パーティクル版インベーダー...
g++ -std=c++17 main.cpp Game.cpp Player.cpp Invader.cpp Bullet.cpp Particle.cpp -o invader_ch3.exe
if %ERRORLEVEL% equ 0 (
    echo [実行開始] 終了は 'Q' キーを押してください
    invader_ch3.exe
) else (
    echo [エラー] コンパイルに失敗しました。
)
pause

