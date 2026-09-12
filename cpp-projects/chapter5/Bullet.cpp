#include "Bullet.h"

Bullet::Bullet(float x, float y, float vx)
    : m_x(x), m_y(y), m_vx(vx), m_active(true) {}

void Bullet::update() {
    if (!m_active) return;
    m_x += m_vx;
    m_y -= 1.0f;
    if (m_y < 1.0f || m_x < 1.0f || m_x >= SCREEN_WIDTH - 1) {
        m_active = false;
    }
}

void Bullet::draw(std::vector<std::string>& buffer) const {
    if (!m_active) return;
    int ix = static_cast<int>(m_x);
    int iy = static_cast<int>(m_y);
    if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
        buffer[iy][ix] = '|';
    }
}

