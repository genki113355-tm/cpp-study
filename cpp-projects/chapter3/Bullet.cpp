#include "Bullet.h"

Bullet::Bullet(int startX, int startY) : m_x(startX), m_y(startY), m_active(true) {}

void Bullet::update() {
    if (!m_active) return;
    m_y--;
    if (m_y < 1) {
        m_active = false;
    }
}

