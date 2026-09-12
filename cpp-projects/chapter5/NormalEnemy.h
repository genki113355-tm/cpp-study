#pragma once
#include "Enemy.h"
#include "Common.h"

// 通常インベーダー (HP: 1, 記号: 'V', スコア: 100)
class NormalEnemy : public Enemy {
public:
    NormalEnemy(float x, float y)
        : Enemy(x, y, 1) {}

    void update(int dir) override {
        m_x += dir;
    }

    void draw(std::vector<std::string>& buffer) const override {
        if (!m_alive) return;
        int ix = static_cast<int>(m_x);
        int iy = static_cast<int>(m_y);
        if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
            buffer[iy][ix] = 'V';
        }
    }

    int getScore() const override {
        return 100;
    }
};

