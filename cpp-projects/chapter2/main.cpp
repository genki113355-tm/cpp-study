#include <iostream>
#include <windows.h>
#include <conio.h>

#include "Common.h"
#include "Player.h"
#include "Invader.h"
#include "Bullet.h"

void setCursorPosition(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

int main() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    // オブジェクトの生成（グローバル変数ゼロ！）
    Player player(SCREEN_WIDTH / 2 - 1, SCREEN_HEIGHT - 2);
    Bullet bullet;

    const int INVADER_COUNT = 6;
    Invader invaders[INVADER_COUNT] = {
        Invader(4, 2),  Invader(8, 2),  Invader(12, 2),
        Invader(16, 2), Invader(20, 2), Invader(24, 2)
    };

    int invaderDir = 1;
    int moveTimer = 0;
    int score = 0;
    bool isRunning = true;
    bool gameClear = false;

    while (isRunning) {
        // 1. 入力
        if (_kbhit()) {
            char key = _getch();
            if (key == 'a' || key == 'A') player.moveLeft();
            if (key == 'd' || key == 'D') player.moveRight();
            if (key == ' ')               player.shoot(bullet);
            if (key == 'q' || key == 'Q') isRunning = false;
        }

        // 2. 弾の更新
        bullet.update();

        // 3. 敵の移動
        moveTimer++;
        if (moveTimer >= 5) {
            moveTimer = 0;
            bool hitWall = false;
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (!invaders[i].isAlive()) continue;
                if ((invaderDir == 1 && invaders[i].getX() >= SCREEN_WIDTH - 2) ||
                    (invaderDir == -1 && invaders[i].getX() <= 1)) {
                    hitWall = true;
                    break;
                }
            }

            if (hitWall) {
                invaderDir = -invaderDir;
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaders[i].move(0, 1);
                    if (invaders[i].isAlive() && invaders[i].getY() >= player.getY()) {
                        isRunning = false;
                    }
                }
            } else {
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaders[i].move(invaderDir, 0);
                }
            }
        }

        // 4. 当たり判定
        if (bullet.isActive()) {
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (invaders[i].isAlive() &&
                    bullet.getX() == invaders[i].getX() &&
                    bullet.getY() == invaders[i].getY()) {
                    invaders[i].destroy();
                    bullet.deactivate();
                    score += 100;
                    break;
                }
            }
        }

        // クリア判定
        bool hasAliveInvader = false;
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaders[i].isAlive()) { hasAliveInvader = true; break; }
        }
        if (!hasAliveInvader) {
            gameClear = true;
            break;
        }

        // 5. 描画
        char buffer[SCREEN_HEIGHT][SCREEN_WIDTH];
        for (int y = 0; y < SCREEN_HEIGHT; y++) {
            for (int x = 0; x < SCREEN_WIDTH; x++) {
                buffer[y][x] = (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) ? '#' : ' ';
            }
        }

        // 自機
        buffer[player.getY()][player.getX()] = '_';
        buffer[player.getY()][player.getX() + 1] = 'A';
        buffer[player.getY()][player.getX() + 2] = '_';

        // 弾
        if (bullet.isActive() && bullet.getY() > 0 && bullet.getY() < SCREEN_HEIGHT - 1) {
            buffer[bullet.getY()][bullet.getX()] = '|';
        }

        // 敵
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaders[i].isAlive()) {
                buffer[invaders[i].getY()][invaders[i].getX()] = 'V';
            }
        }

        // 出力
        setCursorPosition(0, 0);
        for (int y = 0; y < SCREEN_HEIGHT; y++) {
            for (int x = 0; x < SCREEN_WIDTH; x++) {
                std::cout << buffer[y][x];
            }
            std::cout << "\n";
        }
        std::cout << "SCORE: " << score << "  [第2章: クラス設計版]    \n";

        Sleep(33);
    }

    setCursorPosition(0, SCREEN_HEIGHT + 1);
    std::cout << (gameClear ? "=== VICTORY! GAME CLEAR! ===\n" : "=== GAME OVER ===\n");
    return 0;
}

