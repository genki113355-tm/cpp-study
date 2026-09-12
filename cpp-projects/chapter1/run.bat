@echo off
chcp 65001 > nul
echo [ビルド中] 第1章：1ファイル・スパゲティインベーダー...
g++ -std=c++17 main.cpp -o invader_ch1.exe
if %ERRORLEVEL% equ 0 (
    echo [実行開始] 終了は 'Q' キーを押してください
    invader_ch1.exe
) else (
    echo [エラー] コンパイルに失敗しました。MinGW (g++) がインストールされているか確認してください。
)
pause

