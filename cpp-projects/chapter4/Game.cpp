#include "Game.h"
#include "NormalEnemy.h"
#include "ShieldEnemy.h"
#include "UfoEnemy.h"
#include "Common.h"
#include <iostream>
#include <vector>
#include <memory>
#include <algorithm>
#include <cmath>
#include <windows.h>
#include <conio.h>

static void setCursorPosition(int x, int y) {
    COORD coord = { static_cast<SHORT>(x), static_cast<SHORT>(y) };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

Game::Game()
    : m_player(SCREEN_WIDTH / 2 - 1, SCREEN_HEIGHT - 2),
      m_score(0), m_gameOver(false), m_gameClear(false),
      m_enemyDir(1), m_enemyMoveTimer(0), m_ufoTimer(0) {
    
    // 【ポリモーフィズムの実証】
    // 基底クラス std::unique_ptr<Enemy> のコンテナに、
    // 異なる派生クラス（NormalEnemy, ShieldEnemy）を共存させて追加！
    for (int col = 0; col < 6; col++) {
        int x = 4 + col * 4;
        int y = 2;
        if (col == 2 || col == 3) {
            m_enemies.push_back(std::make_unique<ShieldEnemy>(x, y));
        } else {
            m_enemies.push_back(std::make_unique<NormalEnemy>(x, y));
        }
    }
}

void Game::spawnExplosion(int x, int y, bool isUfo) {
    const char glyphs[] = { '*', '+', '.', 'x', '#' };
    int count = isUfo ? 18 : 10;
    for (int i = 0; i < count; i++) {
        float angle = static_cast<float>(i * (3.1415926 * 2.0 / count));
        float speed = (isUfo ? 0.7f : 0.4f) + static_cast<float>(rand() % 5) * 0.1f;
        float vx = std::cos(angle) * speed * 1.5f;
        float vy = std::sin(angle) * speed * 0.8f;
        int life = 4 + rand() % 5;
        char g = isUfo ? '✦' : glyphs[rand() % 5];

        m_particles.emplace_back(static_cast<float>(x), static_cast<float>(y), vx, vy, life, g);
    }
}

void Game::processInput() {
    if (_kbhit()) {
        char key = _getch();
        if (key == 'a' || key == 'A') m_player.moveLeft();
        if (key == 'd' || key == 'D') m_player.moveRight();
        if (key == ' ') {
            if (m_bullets.size() < 3) {
                m_bullets.emplace_back(m_player.getX() + 1, m_player.getY() - 1);
            }
        }
        if (key == 'q' || key == 'Q') m_gameOver = true;
    }
}

void Game::update() {
    // 1. 弾の移動と消滅
    for (auto& b : m_bullets) {
        b.update();
    }
    m_bullets.erase(
        std::remove_if(m_bullets.begin(), m_bullets.end(),
            [](const Bullet& b) { return !b.isActive(); }),
        m_bullets.end()
    );

    // 2. パーティクルの更新と寿命管理
    for (auto& p : m_particles) {
        p.update();
    }
    m_particles.erase(
        std::remove_if(m_particles.begin(), m_particles.end(),
            [](const Particle& p) { return !p.isAlive(); }),
        m_particles.end()
    );

    // 3. UFOの出現タイマー（第4章）
    m_ufoTimer++;
    if (m_ufoTimer >= 100) {
        bool hasUfo = false;
        for (const auto& e : m_enemies) {
            if (e->isAlive() && dynamic_cast<UfoEnemy*>(e.get()) != nullptr) {
                hasUfo = true;
                break;
            }
        }
        if (!hasUfo) {
            m_ufoTimer = 0;
            m_enemies.push_back(std::make_unique<UfoEnemy>(1, 1));
        }
    }

    // 4. 敵の移動タイマー
    m_enemyMoveTimer++;
    if (m_enemyMoveTimer >= 5) {
        m_enemyMoveTimer = 0;

        bool hitWall = false;
        for (auto& e : m_enemies) {
            if (!e->isAlive()) continue;
            // UFOは壁バウンドを無視
            if (dynamic_cast<UfoEnemy*>(e.get()) != nullptr) continue;

            if ((m_enemyDir == 1 && e->getX() >= SCREEN_WIDTH - 2) ||
                (m_enemyDir == -1 && e->getX() <= 1)) {
                hitWall = true;
                break;
            }
        }

        if (hitWall) {
            m_enemyDir = -m_enemyDir;
        }

        // 【多態的ディスパッチ（Polymorphic Dispatch）】
        // 敵の種類を意識することなく、基底ポインタ経由で update() を呼ぶだけで
        // NormalEnemy、ShieldEnemy、UfoEnemy の各実装が自動的に呼び出される！
        for (auto& e : m_enemies) {
            if (e->isAlive()) {
                e->update(m_enemyDir, hitWall);
                if (e->getY() >= SCREEN_HEIGHT - 2 && dynamic_cast<UfoEnemy*>(e.get()) == nullptr) {
                    m_gameOver = true;
                }
            }
        }
    }

    // 5. 当たり判定（Bullet vs Enemy）
    for (auto& b : m_bullets) {
        if (!b.isActive()) continue;

        for (auto& e : m_enemies) {
            if (!e->isAlive()) continue;

            if (b.getX() == e->getX() && b.getY() == e->getY()) {
                b.deactivate();
                e->hit(); // シールド敵なら耐久減算、通常敵なら即死

                bool isUfo = dynamic_cast<UfoEnemy*>(e.get()) != nullptr;
                if (!e->isAlive()) {
                    m_score += e->getScore();
                    spawnExplosion(e->getX(), e->getY(), isUfo);
                } else {
                    // 耐久残存時も火花を散らす
                    m_score += 50;
                    spawnExplosion(e->getX(), e->getY(), false);
                }
                break;
            }
        }
    }

    // 6. クリア判定（UFO以外の地上インベーダーが全滅）
    bool anyGroundEnemyAlive = false;
    for (const auto& e : m_enemies) {
        if (e->isAlive() && dynamic_cast<UfoEnemy*>(e.get()) == nullptr) {
            anyGroundEnemyAlive = true;
            break;
        }
    }
    if (!anyGroundEnemyAlive) {
        m_gameClear = true;
    }
}

void Game::render() {
    setCursorPosition(0, 0);

    char screen[SCREEN_HEIGHT][SCREEN_WIDTH];
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            if (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) {
                screen[y][x] = '#';
            } else {
                screen[y][x] = ' ';
            }
        }
    }

    // 自機 _A_
    int px = m_player.getX();
    int py = m_player.getY();
    if (py >= 0 && py < SCREEN_HEIGHT) {
        if (px >= 0 && px < SCREEN_WIDTH) screen[py][px] = '_';
        if (px + 1 >= 0 && px + 1 < SCREEN_WIDTH) screen[py][px + 1] = 'A';
        if (px + 2 >= 0 && px + 2 < SCREEN_WIDTH) screen[py][px + 2] = '_';
    }

    // 弾
    for (const auto& b : m_bullets) {
        if (b.isActive()) {
            screen[b.getY()][b.getX()] = '|';
        }
    }

    // 【多態的描画】
    // e->getGlyph() を呼ぶだけで、NormalEnemyは'V'、ShieldEnemyは'S'/'s'、UfoEnemyは'U'を返す！
    for (const auto& e : m_enemies) {
        if (e->isAlive()) {
            screen[e->getY()][e->getX()] = e->getGlyph();
        }
    }

    // パーティクル
    for (const auto& p : m_particles) {
        if (p.isAlive()) {
            int x = p.getX();
            int y = p.getY();
            if (x >= 1 && x < SCREEN_WIDTH - 1 && y >= 1 && y < SCREEN_HEIGHT - 1) {
                screen[y][x] = p.getGlyph();
            }
        }
    }

    // 描画出力
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            std::cout << screen[y][x];
        }
        std::cout << "\n";
    }

    std::cout << "SCORE: " << m_score 
              << " | BULLETS: " << m_bullets.size() << "/3"
              << " | PARTICLES: " << m_particles.size() << "     \n";
    std::cout << "[Controls: A=Left, D=Right, Space=Shoot, Q=Quit] \n";
}

void Game::run() {
    // コンソールカーソルを非表示化
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    system("cls");

    while (!m_gameOver && !m_gameClear) {
        processInput();
        update();
        render();
        Sleep(33);
    }

    system("cls");
    if (m_gameClear) {
        std::cout << "========================================\n";
        std::cout << "     TARGET DESTROYED! MISSION CLEAR!   \n";
        std::cout << "========================================\n";
        std::cout << "FINAL SCORE: " << m_score << "\n";
        std::cout << "Polymorphism architecture verified!\n";
    } else {
        std::cout << "========================================\n";
        std::cout << "               GAME OVER                \n";
        std::cout << "========================================\n";
        std::cout << "FINAL SCORE: " << m_score << "\n";
    }
}

