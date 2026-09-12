#pragma once
#include "Enemy.h"
#include "Common.h"

// ボーナスUFO (最上段を高速直進, 記号: 'U', スコア: 500, 撃破時パワーアップドロップ)
class UfoEnemy : public Enemy {
private:
    float m_speed;

public:
    UfoEnemy(float x, float y, float speed = 0.5f)
        : Enemy(x, y, 1), m_speed(speed) {}

    void update(int /*dir*/) override {
        // 通常敵の往復方向とは無関係に右へ高速直進
        m_x += m_speed;
        if (m_x >= SCREEN_WIDTH - 2) {
            m_alive = false; // 画面外へ逃走
        }
    }

    void draw(std::vector<std::string>& buffer) const override {
        if (!m_alive) return;
        int ix = static_cast<int>(m_x);
        int iy = static_cast<int>(m_y);
        if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
            buffer[iy][ix] = 'U';
        }
    }

    int getScore() const override {
        return 500;
    }
};

