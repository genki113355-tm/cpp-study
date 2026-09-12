#pragma once
#include "Enemy.h"

// シールド敵：装甲耐久2。1発当たると外装が壊れて 's' になり、2発目で撃破！
class ShieldEnemy : public Enemy {
public:
    ShieldEnemy(int x, int y) : Enemy(x, y, 2) {}

    void update(int dirX, bool moveDown) override {
        if (!m_alive) return;
        if (moveDown) {
            m_y += 1;
        } else {
            m_x += dirX;
        }
    }

    char getGlyph() const override {
        // 耐久値に応じて見た目が変化（カプセル化された独自表現）
        return (m_hp > 1) ? 'S' : 's';
    }

    int getScore() const override {
        return 200;
    }
};

