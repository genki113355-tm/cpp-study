#include "PlayState.h"
#include "PauseState.h"
#include "GameOverState.h"
#include "Game.h"
#include <iostream>
#include <vector>
#include <cmath>

void PlayState::enter(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Enter Play Scene");
}

void PlayState::update(Game& game) {
    game.incFrameCount();

    // 1. 弾の移動
    auto& bullets = game.getBullets();
    for (auto& b : bullets) {
        if (b.isActive) {
            b.y -= 1.0f;
            if (b.y < 1.0f) {
                b.isActive = false;
            }
        }
    }

    // 2. インベーダーの移動
    auto& enemies = game.getEnemies();
    if (game.getFrameCount() % 4 == 0) {
        bool hitWall = false;
        for (const auto& e : enemies) {
            if (!e.isAlive) continue;
            if ((game.getInvaderDir() == 1 && e.x >= SCREEN_WIDTH - 2) ||
                (game.getInvaderDir() == -1 && e.x <= 1)) {
                hitWall = true;
                break;
            }
        }

        if (hitWall) {
            game.setInvaderDir(-game.getInvaderDir());
            bool reachedBottom = false;
            for (auto& e : enemies) {
                if (!e.isAlive) continue;
                e.y += 1.0f;
                if (e.y >= SCREEN_HEIGHT - 2) {
                    reachedBottom = true;
                }
            }
            if (reachedBottom) {
                game.notify(GameEvent::GAME_OVER, 0, "Invaders reached defense line");
                game.changeState(std::make_unique<GameOverState>(false));
                return;
            }
        } else {
            for (auto& e : enemies) {
                if (e.isAlive) {
                    e.x += game.getInvaderDir();
                }
            }
        }
    }

    // 3. 衝突判定 (Bullets vs Enemies)
    for (auto& b : bullets) {
        if (!b.isActive) continue;

        for (auto& e : enemies) {
            if (!e.isAlive) continue;

            if (std::abs(b.x - e.x) < 1.2f && std::abs(b.y - e.y) < 0.9f) {
                b.isActive = false;
                e.hp--;

                if (e.hp <= 0) {
                    e.isAlive = false;
                    int pts = (e.type == "elite") ? 300 : (e.type == "shield" ? 200 : 100);
                    game.addScore(pts);

                    // Observer に通知！ (Game本体は実績や集計の実装を一切知らない)
                    if (e.type == "elite") {
                        game.notify(GameEvent::ELITE_DEFEATED, pts, "Elite enemy crushed");
                    } else {
                        game.notify(GameEvent::ENEMY_DEFEATED, pts, "Normal enemy defeated");
                    }
                }
                break;
            }
        }
    }

    // 4. クリア判定
    bool anyAlive = false;
    for (const auto& e : enemies) {
        if (e.isAlive) {
            anyAlive = true;
            break;
        }
    }

    if (!anyAlive) {
        game.notify(GameEvent::GAME_CLEAR, 1000, "All invaders defeated");
        game.changeState(std::make_unique<GameOverState>(true));
    }
}

void PlayState::render(const Game& game) {
    std::cout << "\033[2J\033[H"; // 画面クリア

    // 画面バッファ
    char buffer[SCREEN_HEIGHT][SCREEN_WIDTH];
    for (int y = 0; y < SCREEN_HEIGHT; ++y) {
        for (int x = 0; x < SCREEN_WIDTH; ++x) {
            if (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) {
                buffer[y][x] = '#';
            } else {
                buffer[y][x] = ' ';
            }
        }
    }

    // 自機
    int px = game.getPlayerX();
    int py = SCREEN_HEIGHT - 2;
    if (px >= 1 && px + 2 < SCREEN_WIDTH) {
        buffer[py][px] = '_';
        buffer[py][px + 1] = 'A';
        buffer[py][px + 2] = '_';
    }

    // 弾
    for (const auto& b : game.getBullets()) {
        if (b.isActive) {
            int bx = static_cast<int>(std::round(b.x));
            int by = static_cast<int>(std::round(b.y));
            if (by >= 1 && by < SCREEN_HEIGHT - 1 && bx >= 1 && bx < SCREEN_WIDTH - 1) {
                buffer[by][bx] = '|';
            }
        }
    }

    // 敵
    for (const auto& e : game.getEnemies()) {
        if (e.isAlive) {
            int ex = static_cast<int>(std::round(e.x));
            int ey = static_cast<int>(std::round(e.y));
            if (ey >= 1 && ey < SCREEN_HEIGHT - 1 && ex >= 1 && ex < SCREEN_WIDTH - 1) {
                buffer[ey][ex] = e.glyph;
            }
        }
    }

    // 描画出力
    for (int y = 0; y < SCREEN_HEIGHT; ++y) {
        for (int x = 0; x < SCREEN_WIDTH; ++x) {
            std::cout << buffer[y][x];
        }
        std::cout << "\n";
    }

    std::cout << "SCORE: " << game.getScore() 
              << " | STATE: PLAYING | [P: Pause, A/D: Move, Space: Shoot]\n";
}

void PlayState::handleInput(Game& game, char input) {
    if (input == 'a' || input == 'A') {
        game.setPlayerX(std::max(1, game.getPlayerX() - 1));
    } else if (input == 'd' || input == 'D') {
        game.setPlayerX(std::min(SCREEN_WIDTH - 4, game.getPlayerX() + 1));
    } else if (input == ' ') {
        auto& bullets = game.getBullets();
        for (auto& b : bullets) {
            if (!b.isActive) {
                b.x = static_cast<float>(game.getPlayerX() + 1);
                b.y = static_cast<float>(SCREEN_HEIGHT - 3);
                b.isActive = true;
                game.notify(GameEvent::PLAYER_SHOOT, 0, "Player shot bullet");
                break;
            }
        }
    } else if (input == 'p' || input == 'P') {
        // ポーズ状態へ遷移（State パターンの真骨頂：if文によるフラグ管理を排除）
        game.changeState(std::make_unique<PauseState>());
    } else if (input == 'q' || input == 'Q') {
        game.stop();
    }
}

void PlayState::exit(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Exit Play Scene");
}

