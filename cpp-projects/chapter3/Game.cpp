#include "Game.h"
#include <iostream>
#include <algorithm>
#include <cmath>
#include <windows.h>
#include <conio.h>

void setCursorPosition(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

Game::Game() 
    : m_player(SCREEN_WIDTH / 2 - 1, SCREEN_HEIGHT - 2),
      m_score(0), m_invaderDir(1), m_invaderMoveTimer(0),
      m_isRunning(true), m_gameClear(false) {
    
    for (int col = 0; col < 6; col++) {
        m_invaders.emplace_back(4 + col * 4, 2);
    }
}

void Game::spawnExplosion(int x, int y) {
    const char glyphs[] = { '*', '+', '.', 'x', '#' };
    for (int i = 0; i < 10; i++) {
        float angle = (float)(i * (3.1415926 * 2.0 / 10.0));
        float speed = 0.5f + (float)(rand() % 5) * 0.1f;
        float vx = std::cos(angle) * speed * 1.5f;
        float vy = std::sin(angle) * speed * 0.8f;
        int life = 4 + rand() % 5;
        char g = glyphs[rand() % 5];

        m_particles.emplace_back((float)x, (float)y, vx, vy, life, g);
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
        if (key == 'q' || key == 'Q') m_isRunning = false;
    }
}

void Game::update() {
    // 1. 弾の更新
    for (auto& b : m_bullets) {
        b.update();
    }

    // 2. 敵の更新
    m_invaderMoveTimer++;
    if (m_invaderMoveTimer >= 5) {
        m_invaderMoveTimer = 0;
        bool hitWall = false;
        for (const auto& inv : m_invaders) {
            if ((m_invaderDir == 1 && inv.getX() >= SCREEN_WIDTH - 2) ||
                (m_invaderDir == -1 && inv.getX() <= 1)) {
                hitWall = true;
                break;
            }
        }
        if (hitWall) {
            m_invaderDir = -m_invaderDir;
            for (auto& inv : m_invaders) {
                inv.move(0, 1);
                if (inv.getY() >= m_player.getY()) {
                    m_isRunning = false;
                }
            }
        } else {
            for (auto& inv : m_invaders) {
                inv.move(m_invaderDir, 0);
            }
        }
    }

    // 3. 当たり判定
    for (auto& b : m_bullets) {
        if (!b.isActive()) continue;
        for (auto& inv : m_invaders) {
            if (inv.isAlive() && b.getX() == inv.getX() && b.getY() == inv.getY()) {
                inv.destroy();
                b.deactivate();
                m_score += 100;
                spawnExplosion(inv.getX(), inv.getY());
                break;
            }
        }
    }

    // 4. パーティクルの更新
    for (auto& p : m_particles) {
        p.update();
    }

    // 5. 寿命管理と安全な消去（erase-removeイディオム）
    m_particles.erase(
        std::remove_if(m_particles.begin(), m_particles.end(),
            [](const Particle& p) { return p.isDead(); }),
        m_particles.end()
    );

    m_bullets.erase(
        std::remove_if(m_bullets.begin(), m_bullets.end(),
            [](const Bullet& b) { return !b.isActive(); }),
        m_bullets.end()
    );

    m_invaders.erase(
        std::remove_if(m_invaders.begin(), m_invaders.end(),
            [](const Invader& inv) { return !inv.isAlive(); }),
        m_invaders.end()
    );

    if (m_invaders.empty()) {
        m_gameClear = true;
        m_isRunning = false;
    }
}

void Game::render() {
    char buffer[SCREEN_HEIGHT][SCREEN_WIDTH];
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            buffer[y][x] = (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) ? '#' : ' ';
        }
    }

    // 自機の描画
    buffer[m_player.getY()][m_player.getX()] = '_';
    buffer[m_player.getY()][m_player.getX() + 1] = 'A';
    buffer[m_player.getY()][m_player.getX() + 2] = '_';

    // 弾の描画
    for (const auto& b : m_bullets) {
        if (b.getY() > 0 && b.getY() < SCREEN_HEIGHT - 1) {
            buffer[b.getY()][b.getX()] = '|';
        }
    }

    // 敵の描画
    for (const auto& inv : m_invaders) {
        buffer[inv.getY()][inv.getX()] = 'V';
    }

    // 火花パーティクルの描画
    for (const auto& p : m_particles) {
        int px = p.getX();
        int py = p.getY();
        if (px > 0 && px < SCREEN_WIDTH - 1 && py > 0 && py < SCREEN_HEIGHT - 1) {
            buffer[py][px] = p.getGlyph();
        }
    }

    setCursorPosition(0, 0);
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            std::cout << buffer[y][x];
        }
        std::cout << "\n";
    }
    std::cout << "SCORE: " << m_score 
              << " | PARTICLES: " << m_particles.size() 
              << " | BULLETS: " << m_bullets.size() << "    \n";
}

void Game::run() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    while (m_isRunning) {
        processInput();
        update();
        render();
        Sleep(33);
    }

    setCursorPosition(0, SCREEN_HEIGHT + 2);
    if (m_gameClear) {
        std::cout << "=========================================\n";
        std::cout << " ★★★ VICTORY! ALL INVADERS DESTROYED! ★★★\n";
        std::cout << "=========================================\n";
    } else {
        std::cout << "=========================================\n";
        std::cout << "               GAME OVER                 \n";
        std::cout << "=========================================\n";
    }
}

