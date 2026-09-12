#pragma once
#include "Enemy.h"

// 通常インベーダー：標準的な左右往復移動
class NormalEnemy : public Enemy {
public:
    NormalEnemy(int x, int y) : Enemy(x, y, 1) {}

    void update(int dirX, bool moveDown) override {
        if (!m_alive) return;
        if (moveDown) {
            m_y += 1;
        } else {
            m_x += dirX;
        }
    }

    char getGlyph() const override {
        return 'V';
    }

    int getScore() const override {
        return 100;
    }
};

