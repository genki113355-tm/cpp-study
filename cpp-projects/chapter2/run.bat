@echo off
chcp 65001 > nul
echo [ビルド中] 第2章：クラス分割版インベーダー (Player, Invader, Bullet)...
g++ -std=c++17 main.cpp Player.cpp Invader.cpp Bullet.cpp -o invader_ch2.exe
if %ERRORLEVEL% equ 0 (
    echo [実行開始] 終了は 'Q' キーを押してください
    invader_ch2.exe
) else (
    echo [エラー] コンパイルに失敗しました。
)
pause

