#pragma once
#include "Common.h"
#include "Entity.h"
#include "Components.h"
#include <vector>
#include <memory>

class Game {
private:
    std::vector<std::shared_ptr<Entity>> entities;
    int nextEntityId = 1;
    bool running = true;
    int score = 0;
    int killCount = 0;
    int frameCount = 0;
    std::shared_ptr<Entity> playerEntity;

public:
    Game();
    ~Game() = default;

    void init();
    void run();

    // エンティティ生成ヘルパー（コンポーネント合成）
    std::shared_ptr<Entity> createPlayer();
    std::shared_ptr<Entity> createBoss(float x, float y);
    std::shared_ptr<Entity> createElite(float x, float y);
    std::shared_ptr<Entity> createMinion(float x, float y);
    void createBullet(float x, float y, float vx, float vy);

    void handleInput(char input);
    void update();
    void cleanupDeadEntities();
};

