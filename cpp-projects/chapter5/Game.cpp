#include "Game.h"
#include "NormalEnemy.h"
#include "ShieldEnemy.h"
#include "UfoEnemy.h"
#include <iostream>
#include <conio.h>
#include <windows.h>
#include <algorithm>
#include <cmath>

Game::Game()
    : m_player(14, SCREEN_HEIGHT - 2),
      m_enemyDir(1),
      m_enemyMoveTimer(0),
      m_ufoTimer(0),
      m_score(0),
      m_gameOver(false),
      m_gameClear(false) {
    init();
}

void Game::init() {
    m_enemies.clear();
    m_items.clear();
    m_bullets.clear();
    m_particles.clear();
    m_score = 0;
    m_gameOver = false;
    m_gameClear = false;
    m_enemyDir = 1;
    m_enemyMoveTimer = 0;
    m_ufoTimer = 0;

    // 初期敵の生成: std::make_unique で安全にヒープ確保
    // 通常敵4体 + シールド敵2体
    for (int i = 0; i < 6; i++) {
        float x = static_cast<float>(4 + i * 4);
        float y = 2.0f;
        if (i == 2 || i == 3) {
            m_enemies.push_back(std::make_unique<ShieldEnemy>(x, y));
        } else {
            m_enemies.push_back(std::make_unique<NormalEnemy>(x, y));
        }
    }

    // 初期護衛ビットを1機付与（std::make_shared で共有所有権生成）
    m_player.addDrone(std::make_shared<BitDrone>(0.0f));
}

void Game::processInput() {
    if (_kbhit()) {
        int key = _getch();
        if (key == 'a' || key == 'A') {
            m_player.moveLeft();
        } else if (key == 'd' || key == 'D') {
            m_player.moveRight();
        } else if (key == ' ') {
            m_player.shoot(m_bullets);
        } else if (key == 'r' || key == 'R') {
            init();
        } else if (key == 224) {
            // 矢印キー
            key = _getch();
            if (key == 75) m_player.moveLeft();
            else if (key == 77) m_player.moveRight();
        }
    }
}

void Game::spawnExplosion(float x, float y, bool isUfo) {
    int count = isUfo ? 18 : 10;
    for (int i = 0; i < count; i++) {
        float angle = (i * 3.14159f * 2.0f) / count;
        float speed = isUfo ? 0.8f : 0.5f;
        char glyph = isUfo ? '*' : '+';
        m_particles.emplace_back(x, y, std::cos(angle) * speed, std::sin(angle) * speed * 0.6f, 6, glyph);
    }
}

void Game::update() {
    if (m_gameOver || m_gameClear) return;

    // 1. プレイヤーとビット機の更新
    m_player.update();

    // 2. 弾の更新
    for (auto& bullet : m_bullets) {
        bullet.update();
    }
    m_bullets.erase(
        std::remove_if(m_bullets.begin(), m_bullets.end(),
            [](const Bullet& b) { return !b.isActive(); }),
        m_bullets.end()
    );

    // 3. パーティクルの更新
    for (auto& p : m_particles) {
        p.update();
    }
    m_particles.erase(
        std::remove_if(m_particles.begin(), m_particles.end(),
            [](const Particle& p) { return p.isDead(); }),
        m_particles.end()
    );

    // 4. アイテムの更新とプレイヤー拾得判定
    for (auto& item : m_items) {
        item->update();
        if (item->isActive()) {
            float ix = item->getX();
            float iy = item->getY();
            // プレイヤーと接触判定
            if (std::abs(ix - (m_player.getX() + 1)) <= 1.8f && std::abs(iy - (SCREEN_HEIGHT - 2)) <= 1.2f) {
                // アイテム取得！
                item->deactivate();
                if (item->getType() == ItemType::Power) {
                    m_player.enableTripleShot();
                    m_score += 300;
                } else if (item->getType() == ItemType::Bit) {
                    m_player.addDrone(std::make_shared<BitDrone>(3.14159f));
                    m_score += 200;
                }
                spawnExplosion(ix, iy, true);
            }
        }
    }
    // 非アクティブになったアイテムは erase されると unique_ptr により自動破棄！
    m_items.erase(
        std::remove_if(m_items.begin(), m_items.end(),
            [](const std::unique_ptr<Item>& item) { return !item->isActive(); }),
        m_items.end()
    );

    // 5. UFO出現判定
    m_ufoTimer++;
    if (m_ufoTimer >= 150) {
        bool hasUfo = false;
        for (const auto& enemy : m_enemies) {
            if (dynamic_cast<UfoEnemy*>(enemy.get()) != nullptr && enemy->isAlive()) {
                hasUfo = true;
                break;
            }
        }
        if (!hasUfo) {
            m_ufoTimer = 0;
            m_enemies.push_back(std::make_unique<UfoEnemy>(1.0f, 1.0f));
        }
    }

    // 6. 敵の移動
    m_enemyMoveTimer++;
    if (m_enemyMoveTimer >= 6) {
        m_enemyMoveTimer = 0;
        bool hitWall = false;

        for (auto& enemy : m_enemies) {
            if (!enemy->isAlive()) continue;
            // UFO以外の地上敵の壁判定
            if (dynamic_cast<UfoEnemy*>(enemy.get()) == nullptr) {
                if ((m_enemyDir == 1 && enemy->getX() >= SCREEN_WIDTH - 3) ||
                    (m_enemyDir == -1 && enemy->getX() <= 1)) {
                    hitWall = true;
                }
            }
        }

        if (hitWall) {
            m_enemyDir = -m_enemyDir;
            for (auto& enemy : m_enemies) {
                if (dynamic_cast<UfoEnemy*>(enemy.get()) == nullptr) {
                    enemy->setY(enemy->getY() + 1.0f);
                    if (enemy->isAlive() && enemy->getY() >= SCREEN_HEIGHT - 2) {
                        m_gameOver = true;
                    }
                }
            }
        } else {
            for (auto& enemy : m_enemies) {
                enemy->update(m_enemyDir);
            }
        }
    }

    // 7. 当たり判定（Bullet vs Enemy）
    for (auto& bullet : m_bullets) {
        if (!bullet.isActive()) continue;

        for (auto& enemy : m_enemies) {
            if (!enemy->isAlive()) continue;

            if (std::abs(bullet.getX() - enemy->getX()) <= 1.2f &&
                std::abs(bullet.getY() - enemy->getY()) <= 0.8f) {
                bullet.deactivate();

                bool isKilled = enemy->takeDamage(1);
                if (isKilled) {
                    m_score += enemy->getScore();
                    bool isUfo = (dynamic_cast<UfoEnemy*>(enemy.get()) != nullptr);
                    bool isShield = (dynamic_cast<ShieldEnemy*>(enemy.get()) != nullptr);
                    spawnExplosion(enemy->getX(), enemy->getY(), isUfo);

                    // 撃破時にアイテムを動的生成（std::make_unique）
                    if (isUfo) {
                        m_items.push_back(std::make_unique<Item>(enemy->getX(), enemy->getY(), ItemType::Power));
                    } else if (isShield) {
                        m_items.push_back(std::make_unique<Item>(enemy->getX(), enemy->getY(), ItemType::Bit));
                    }
                } else {
                    // シールド敵の多段ヒット
                    m_score += 50;
                    spawnExplosion(enemy->getX(), enemy->getY(), false);
                }
                break;
            }
        }
    }

    // 生死判定によるクリアチェック
    bool anyGroundAlive = false;
    for (const auto& enemy : m_enemies) {
        if (enemy->isAlive() && dynamic_cast<UfoEnemy*>(enemy.get()) == nullptr) {
            anyGroundAlive = true;
            break;
        }
    }
    if (!anyGroundAlive && m_enemies.size() > 0) {
        m_gameClear = true;
    }

    // 死んだ敵を vector から安全に除外
    // 【最重要】erase された瞬間に unique_ptr のデストラクタが走り、ヒープ上の派生インスタンスが即時解放される！
    m_enemies.erase(
        std::remove_if(m_enemies.begin(), m_enemies.end(),
            [](const std::unique_ptr<Enemy>& e) { return !e->isAlive(); }),
        m_enemies.end()
    );
}

void Game::render() {
    std::vector<std::string> buffer(SCREEN_HEIGHT, std::string(SCREEN_WIDTH, ' '));

    // 壁の描画
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            if (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) {
                buffer[y][x] = '#';
            }
        }
    }

    // プレイヤーの描画
    m_player.draw(buffer);

    // 敵の描画（多態的呼び出し）
    for (const auto& enemy : m_enemies) {
        enemy->draw(buffer);
    }

    // アイテムの描画
    for (const auto& item : m_items) {
        item->draw(buffer);
    }

    // 弾の描画
    for (const auto& bullet : m_bullets) {
        bullet.draw(buffer);
    }

    // パーティクルの描画
    for (const auto& particle : m_particles) {
        particle.draw(buffer);
    }

    // コンソールをクリアして全描画
    COORD coord = { 0, 0 };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);

    std::cout << "==============================" << std::endl;
    std::cout << " Ch.5 SMART POINTER INVADER   " << std::endl;
    std::cout << " SCORE: " << m_score << " | RAII LEAK: 0B" << std::endl;
    std::cout << " unique_ptr: " << (m_enemies.size() + m_items.size())
              << " | shared_ptr: " << m_player.getDroneCount() << std::endl;
    std::cout << "==============================" << std::endl;

    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        std::cout << buffer[y] << "\n";
    }

    if (m_gameClear) {
        std::cout << ">> MISSION ACCOMPLISHED! (Press R to Restart) <<" << std::endl;
    } else if (m_gameOver) {
        std::cout << ">> GAME OVER! (Press R to Restart) <<" << std::endl;
    } else {
        std::cout << " [A/D]: Move  [SPACE]: Shoot  [R]: Reset " << std::endl;
    }
}

