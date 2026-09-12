#include <iostream>
#include <windows.h>
#include <conio.h>

// -------------------------------------------------------------
// 【第1章：スパゲティコード（ビフォー）】
// 画面サイズやゲーム状態がすべてグローバル変数！
// -------------------------------------------------------------
const int WIDTH = 30;
const int HEIGHT = 15;

int playerX = 14;              // 自機のX座標
const int playerY = 13;        // 自機のY座標（固定）

bool bulletActive = false;     // 弾が存在するか
int bulletX = 0;               // 弾のX座標
int bulletY = 0;               // 弾のY座標

const int INVADER_COUNT = 6;
int invaderX[INVADER_COUNT] = { 4, 8, 12, 16, 20, 24 };
int invaderY[INVADER_COUNT] = { 2, 2,  2,  2,  2,  2 };
bool invaderAlive[INVADER_COUNT] = { true, true, true, true, true, true };
int invaderDir = 1;            // 敵の移動方向 (1:右, -1:左)
int invaderMoveTimer = 0;

int score = 0;
bool gameOver = false;
bool gameClear = false;

void setCursorPosition(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

int main() {
    // コンソールカーソルを非表示にする
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    // メインループ（すべてが1箇所で回っている）
    while (!gameOver && !gameClear) {
        // --- 1. 入力処理 ---
        if (_kbhit()) {
            char key = _getch();
            if (key == 'a' || key == 'A') {
                if (playerX > 1) playerX--;
            }
            else if (key == 'd' || key == 'D') {
                if (playerX < WIDTH - 4) playerX++;
            }
            else if (key == ' ' && !bulletActive) {
                bulletActive = true;
                bulletX = playerX + 1;
                bulletY = playerY - 1;
            }
            else if (key == 'q' || key == 'Q') {
                gameOver = true;
            }
        }

        // --- 2. 弾の更新 ---
        if (bulletActive) {
            bulletY--;
            if (bulletY < 1) {
                bulletActive = false;
            }
        }

        // --- 3. 敵の更新 ---
        invaderMoveTimer++;
        if (invaderMoveTimer >= 5) {
            invaderMoveTimer = 0;
            bool hitWall = false;
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (!invaderAlive[i]) continue;
                if ((invaderDir == 1 && invaderX[i] >= WIDTH - 2) ||
                    (invaderDir == -1 && invaderX[i] <= 1)) {
                    hitWall = true;
                    break;
                }
            }
            if (hitWall) {
                invaderDir = -invaderDir;
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaderY[i]++;
                    if (invaderAlive[i] && invaderY[i] >= playerY) {
                        gameOver = true;
                    }
                }
            } else {
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaderX[i] += invaderDir;
                }
            }
        }

        // --- 4. 当たり判定（弾 vs 敵） ---
        if (bulletActive) {
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (invaderAlive[i] && bulletX == invaderX[i] && bulletY == invaderY[i]) {
                    invaderAlive[i] = false;
                    bulletActive = false;
                    score += 100;
                    break;
                }
            }
        }

        // クリア判定
        bool anyAlive = false;
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaderAlive[i]) { anyAlive = true; break; }
        }
        if (!anyAlive) gameClear = true;

        // --- 5. 画面描画 ---
        char screen[HEIGHT][WIDTH];
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                if (y == 0 || y == HEIGHT - 1 || x == 0 || x == WIDTH - 1) {
                    screen[y][x] = '#';
                } else {
                    screen[y][x] = ' ';
                }
            }
        }

        // 自機を描画 (_A_)
        screen[playerY][playerX] = '_';
        screen[playerY][playerX + 1] = 'A';
        screen[playerY][playerX + 2] = '_';

        // 弾を描画 (|)
        if (bulletActive && bulletY > 0 && bulletY < HEIGHT - 1 && bulletX > 0 && bulletX < WIDTH - 1) {
            screen[bulletY][bulletX] = '|';
        }

        // 敵を描画 (V)
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaderAlive[i]) {
                int ix = invaderX[i];
                int iy = invaderY[i];
                if (iy > 0 && iy < HEIGHT - 1 && ix > 0 && ix < WIDTH - 1) {
                    screen[iy][ix] = 'V';
                }
            }
        }

        // 画面出力
        setCursorPosition(0, 0);
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                std::cout << screen[y][x];
            }
            std::cout << "\n";
        }
        std::cout << "SCORE: " << score << "  (A:左 D:右 Space:発射 Q:終了)    \n";

        Sleep(33);
    }

    setCursorPosition(0, HEIGHT + 1);
    if (gameClear) {
        std::cout << "=================================\n";
        std::cout << "  CONGRATULATIONS! GAME CLEAR!   \n";
        std::cout << "=================================\n";
    } else {
        std::cout << "=================================\n";
        std::cout << "           GAME OVER             \n";
        std::cout << "=================================\n";
    }
    return 0;
}

