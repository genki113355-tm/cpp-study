#pragma once
#include "Enemy.h"
#include "Common.h"

// シールドインベーダー (HP: 2, 記号: 'S'/'s', スコア: 200, 撃破時ビットドロップ)
class ShieldEnemy : public Enemy {
public:
    ShieldEnemy(float x, float y)
        : Enemy(x, y, 2) {}

    void update(int dir) override {
        m_x += dir;
    }

    void draw(std::vector<std::string>& buffer) const override {
        if (!m_alive) return;
        int ix = static_cast<int>(m_x);
        int iy = static_cast<int>(m_y);
        if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
            // HPが2なら大文字 'S'、1なら小文字 's'（シールド破損）
            buffer[iy][ix] = (m_hp > 1) ? 'S' : 's';
        }
    }

    int getScore() const override {
        return 200;
    }
};

