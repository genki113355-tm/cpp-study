#pragma once
#include "Enemy.h"
#include "Common.h"

// ボーナスUFO：最上段を高速直進し、画面端で自滅する特別敵
class UfoEnemy : public Enemy {
private:
    int m_speed;
    int m_stepCount;

public:
    UfoEnemy(int x, int y)
        : Enemy(x, y, 1), m_speed(1), m_stepCount(0) {}

    // 通常の編隊移動（dirXやmoveDown）を無視し、独自の飛行アルゴリズムを実行！
    void update(int /*dirX*/, bool /*moveDown*/) override {
        if (!m_alive) return;
        m_x += m_speed;
        if (m_x >= SCREEN_WIDTH - 2) {
            m_alive = false; // 画面端で撤退
        }
    }

    char getGlyph() const override {
        return 'U';
    }

    int getScore() const override {
        return 500;
    }
};

