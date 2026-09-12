#include "Game.h"
#include <windows.h>

int main() {
    // コンソールカーソルを非表示
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    // スタック上にゲームインスタンスを配置（main終了で自動破棄）
    Game game;

    // ゲームループ（約30FPS）
    while (true) {
        game.processInput();
        game.update();
        game.render();
        Sleep(33);
    }

    return 0;
}

