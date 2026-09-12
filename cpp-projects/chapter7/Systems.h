#pragma once
#include "Common.h"
#include "Entity.h"
#include "Components.h"
#include <vector>
#include <iostream>
#include <cmath>
#include <algorithm>

// ECS システム群：特定のコンポーネントを持つエンティティのみをフィルタリングして処理する

// 1. 移動システム
class MovementSystem {
public:
    static void update(std::vector<std::shared_ptr<Entity>>& entities, int frameCount, bool& reachedBottom) {
        // 壁衝突フラグ
        bool hitWall = false;
        int invaderDir = 0;

        for (auto& entity : entities) {
            if (!entity->isAlive()) continue;

            auto transform = entity->getComponent<TransformComponent>();
            auto movement = entity->getComponent<MovementComponent>();

            // 弾丸などの直線移動
            if (transform && !movement) {
                transform->x += transform->vx;
                transform->y += transform->vy;
                if (transform->y < 1.0f || transform->y >= SCREEN_HEIGHT - 1) {
                    entity->destroy();
                }
            }

            // 敵などのグリッド隊列移動
            if (transform && movement) {
                invaderDir = movement->dir;
                if (frameCount % movement->stepInterval == 0) {
                    if ((movement->dir == 1 && transform->x >= SCREEN_WIDTH - 2) ||
                        (movement->dir == -1 && transform->x <= 1)) {
                        hitWall = true;
                    }
                }
            }
        }

        // 壁に当たった場合の折り返しと降下
        if (hitWall) {
            for (auto& entity : entities) {
                if (!entity->isAlive()) continue;
                auto transform = entity->getComponent<TransformComponent>();
                auto movement = entity->getComponent<MovementComponent>();
                if (transform && movement) {
                    movement->dir = -movement->dir;
                    transform->y += 1.0f;
                    if (transform->y >= SCREEN_HEIGHT - 2) {
                        reachedBottom = true;
                    }
                }
            }
        } else {
            for (auto& entity : entities) {
                if (!entity->isAlive()) continue;
                auto transform = entity->getComponent<TransformComponent>();
                auto movement = entity->getComponent<MovementComponent>();
                if (transform && movement && (frameCount % movement->stepInterval == 0)) {
                    transform->x += movement->dir;
                    if (movement->oscillates) {
                        transform->y += (frameCount % (movement->stepInterval * 2) == 0 ? 0.3f : -0.3f);
                    }
                }
            }
        }
    }
};

// 2. 戦闘・衝突判定システム
class CombatSystem {
public:
    static void update(std::vector<std::shared_ptr<Entity>>& entities, int& score, int& killCount) {
        // 弾丸エンティティ
        std::vector<std::shared_ptr<Entity>> bullets;
        // 攻撃対象エンティティ
        std::vector<std::shared_ptr<Entity>> targets;

        for (auto& e : entities) {
            if (!e->isAlive()) continue;
            if (e->getTag() == "bullet") {
                bullets.push_back(e);
            } else if (e->hasComponent<HealthComponent>() && e->getTag() != "player") {
                targets.push_back(e);
            }
        }

        for (auto& bullet : bullets) {
            if (!bullet->isAlive()) continue;
            auto bPos = bullet->getComponent<TransformComponent>();
            if (!bPos) continue;

            for (auto& target : targets) {
                if (!target->isAlive()) continue;
                auto tPos = target->getComponent<TransformComponent>();
                auto tHealth = target->getComponent<HealthComponent>();
                auto tRender = target->getComponent<RenderComponent>();
                if (!tPos || !tHealth) continue;

                float hitWidth = (tRender && tRender->width > 1) ? (tRender->width * 0.8f) : 1.2f;
                if (std::abs(bPos->x - tPos->x) <= hitWidth && std::abs(bPos->y - tPos->y) <= 0.8f) {
                    bullet->destroy();
                    tHealth->takeDamage(1);

                    if (tHealth->isDead()) {
                        target->destroy();
                        killCount++;
                        if (target->getTag() == "boss") {
                            score += 1000;
                        } else if (target->getTag() == "elite") {
                            score += 300;
                        } else {
                            score += 100;
                        }
                    } else {
                        score += 30; // 被弾スコア
                    }
                    break;
                }
            }
        }
    }
};

// 3. 描画システム
class RenderSystem {
public:
    static void render(const std::vector<std::shared_ptr<Entity>>& entities, int score) {
        std::cout << "\033[2J\033[H"; // 画面クリア

        char buffer[SCREEN_HEIGHT][SCREEN_WIDTH];
        std::string colorBuffer[SCREEN_HEIGHT][SCREEN_WIDTH];

        for (int y = 0; y < SCREEN_HEIGHT; ++y) {
            for (int x = 0; x < SCREEN_WIDTH; ++x) {
                if (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) {
                    buffer[y][x] = '#';
                    colorBuffer[y][x] = "\033[36m"; // シアン壁
                } else {
                    buffer[y][x] = ' ';
                    colorBuffer[y][x] = "\033[0m";
                }
            }
        }

        // 各エンティティのレンダリング
        for (const auto& e : entities) {
            if (!e->isAlive()) continue;
            auto pos = e->getComponent<TransformComponent>();
            auto ren = e->getComponent<RenderComponent>();
            if (pos && ren) {
                int cx = static_cast<int>(std::round(pos->x));
                int cy = static_cast<int>(std::round(pos->y));

                if (ren->width == 3) { // ボス等の幅広描画
                    if (cy >= 1 && cy < SCREEN_HEIGHT - 1) {
                        if (cx - 1 >= 1) { buffer[cy][cx - 1] = '['; colorBuffer[cy][cx - 1] = ren->colorCode; }
                        if (cx >= 1 && cx < SCREEN_WIDTH - 1) { buffer[cy][cx] = ren->glyph; colorBuffer[cy][cx] = ren->colorCode; }
                        if (cx + 1 < SCREEN_WIDTH - 1) { buffer[cy][cx + 1] = ']'; colorBuffer[cy][cx + 1] = ren->colorCode; }
                    }
                } else {
                    if (cy >= 1 && cy < SCREEN_HEIGHT - 1 && cx >= 1 && cx < SCREEN_WIDTH - 1) {
                        buffer[cy][cx] = ren->glyph;
                        colorBuffer[cy][cx] = ren->colorCode;
                    }
                }
            }
        }

        // バッファ出力
        for (int y = 0; y < SCREEN_HEIGHT; ++y) {
            for (int x = 0; x < SCREEN_WIDTH; ++x) {
                std::cout << colorBuffer[y][x] << buffer[y][x] << "\033[0m";
            }
            std::cout << "\n";
        }

        std::cout << "SCORE: " << score 
                  << " | ECS ACTIVE ENTITIES: " << entities.size()
                  << " | [A/D: Move, Space: 3Way Shoot, Q: Quit]\n";
    }
};

