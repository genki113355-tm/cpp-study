#pragma once
#include <vector>
#include "Common.h"
#include "Player.h"
#include "Invader.h"
#include "Bullet.h"
#include "Particle.h"

class Game {
private:
    Player m_player;
    std::vector<Bullet> m_bullets;
    std::vector<Invader> m_invaders;
    std::vector<Particle> m_particles;

    int m_score;
    int m_invaderDir;
    int m_invaderMoveTimer;
    bool m_isRunning;
    bool m_gameClear;

    void spawnExplosion(int x, int y);
    void processInput();
    void update();
    void render();

public:
    Game();
    void run();
};

