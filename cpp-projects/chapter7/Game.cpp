#include "Game.h"
#include "Systems.h"
#include <iostream>
#include <thread>
#include <chrono>

#ifdef _WIN32
#include <conio.h>
#include <windows.h>
#endif

Game::Game() {
    init();
}

void Game::init() {
    entities.clear();
    nextEntityId = 1;
    score = 0;
    killCount = 0;
    frameCount = 0;

    // 1. 自機エンティティの生成（Transform + Render + Health + Shooter を合成）
    playerEntity = createPlayer();

    // 2. ボス母艦エンティティの生成（巨大HP 12、幅3文字）
    createBoss(13.0f, 2.0f);

    // 3. 護衛エリート敵の生成（HP 3、ウェーブ運動）
    createElite(5.0f, 4.0f);
    createElite(21.0f, 4.0f);

    // 4. 前衛インベーダーの生成（通常HP 1）
    createMinion(9.0f, 6.0f);
    createMinion(13.0f, 6.0f);
    createMinion(17.0f, 6.0f);
}

std::shared_ptr<Entity> Game::createPlayer() {
    auto player = std::make_shared<Entity>(nextEntityId++, "player");
    player->addComponent<TransformComponent>(14.0f, static_cast<float>(SCREEN_HEIGHT - 2));
    player->addComponent<RenderComponent>('A', "\033[36;1m");
    player->addComponent<HealthComponent>(3);
    player->addComponent<ShooterComponent>(3, true); // 3WAYショット可能
    entities.push_back(player);
    return player;
}

std::shared_ptr<Entity> Game::createBoss(float x, float y) {
    auto boss = std::make_shared<Entity>(nextEntityId++, "boss");
    boss->addComponent<TransformComponent>(x, y);
    boss->addComponent<RenderComponent>('B', "\033[31;1m", 3);
    boss->addComponent<HealthComponent>(12); // ボスHP
    boss->addComponent<MovementComponent>(1, 6, false);
    entities.push_back(boss);
    return boss;
}

std::shared_ptr<Entity> Game::createElite(float x, float y) {
    auto elite = std::make_shared<Entity>(nextEntityId++, "elite");
    elite->addComponent<TransformComponent>(x, y);
    elite->addComponent<RenderComponent>('E', "\033[35;1m");
    elite->addComponent<HealthComponent>(3);
    elite->addComponent<MovementComponent>(-1, 3, true); // ウェーブ運動
    entities.push_back(elite);
    return elite;
}

std::shared_ptr<Entity> Game::createMinion(float x, float y) {
    auto minion = std::make_shared<Entity>(nextEntityId++, "minion");
    minion->addComponent<TransformComponent>(x, y);
    minion->addComponent<RenderComponent>('V', "\033[32m");
    minion->addComponent<HealthComponent>(1);
    minion->addComponent<MovementComponent>(1, 4, false);
    entities.push_back(minion);
    return minion;
}

void Game::createBullet(float x, float y, float vx, float vy) {
    auto bullet = std::make_shared<Entity>(nextEntityId++, "bullet");
    bullet->addComponent<TransformComponent>(x, y, vx, vy);
    bullet->addComponent<RenderComponent>('|', "\033[33;1m");
    entities.push_back(bullet);
}

void Game::handleInput(char input) {
    if (!playerEntity || !playerEntity->isAlive()) return;
    auto pos = playerEntity->getComponent<TransformComponent>();
    auto shooter = playerEntity->getComponent<ShooterComponent>();
    if (!pos) return;

    if (input == 'a' || input == 'A') {
        pos->x = std::max(1.0f, pos->x - 1.0f);
    } else if (input == 'd' || input == 'D') {
        pos->x = std::min(static_cast<float>(SCREEN_WIDTH - 2), pos->x + 1.0f);
    } else if (input == ' ') {
        if (shooter && shooter->isTripleShot) {
            // 3WAY 弾幕
            createBullet(pos->x, pos->y - 1.0f, 0.0f, -1.0f);
            createBullet(pos->x - 1.0f, pos->y - 1.0f, -0.2f, -1.0f);
            createBullet(pos->x + 1.0f, pos->y - 1.0f, 0.2f, -1.0f);
        } else {
            createBullet(pos->x, pos->y - 1.0f, 0.0f, -1.0f);
        }
    } else if (input == 'q' || input == 'Q') {
        running = false;
    }
}

void Game::update() {
    frameCount++;
    bool reachedBottom = false;

    // 1. 移動システム更新
    MovementSystem::update(entities, frameCount, reachedBottom);

    // 2. 衝突戦闘システム更新
    CombatSystem::update(entities, score, killCount);

    // 3. 死亡エンティティの回収（クリーンアップ）
    cleanupDeadEntities();

    // 4. ゲームクリア・ゲームオーバー判定
    bool hasHostile = false;
    for (const auto& e : entities) {
        if (e->isAlive() && (e->getTag() == "boss" || e->getTag() == "elite" || e->getTag() == "minion")) {
            hasHostile = true;
            break;
        }
    }

    if (!hasHostile) {
        std::cout << "\n\033[32;1m========================================\n"
                  << "  🏆 VICTORY! ALL ECS HOSTILES CLEARED! 🏆\n"
                  << "========================================\033[0m\n";
        running = false;
    } else if (reachedBottom) {
        std::cout << "\n\033[31;1m========================================\n"
                  << "    💀 DEFENSE LINE BREACHED! GAME OVER! 💀\n"
                  << "========================================\033[0m\n";
        running = false;
    }
}

void Game::cleanupDeadEntities() {
    entities.erase(
        std::remove_if(entities.begin(), entities.end(),
            [](const std::shared_ptr<Entity>& e) {
                return !e || !e->isAlive();
            }),
        entities.end()
    );
}

void Game::run() {
#ifdef _WIN32
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD dwMode = 0;
    GetConsoleMode(hOut, &dwMode);
    dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
    SetConsoleMode(hOut, dwMode);
#endif

    while (running) {
#ifdef _WIN32
        if (_kbhit()) {
            char ch = static_cast<char>(_getch());
            handleInput(ch);
        }
#endif

        update();
        RenderSystem::render(entities, score);

        std::this_thread::sleep_for(std::chrono::milliseconds(40));
    }
}

