#pragma once
#include <vector>
#include <memory>
#include "Player.h"
#include "Enemy.h"
#include "Bullet.h"
#include "Particle.h"

class Game {
private:
    Player m_player;
    // 【重要：基底クラスのポインタを管理するコンテナ】
    // NormalEnemy, ShieldEnemy, UfoEnemy すべてを多態的に一括保持！
    std::vector<std::unique_ptr<Enemy>> m_enemies;
    std::vector<Bullet> m_bullets;
    std::vector<Particle> m_particles;

    int m_score;
    bool m_gameOver;
    bool m_gameClear;
    int m_enemyDir;
    int m_enemyMoveTimer;
    int m_ufoTimer;

    void processInput();
    void update();
    void render();
    void spawnExplosion(int x, int y, bool isUfo = false);

public:
    Game();
    void run();
};

