#include "Bullet.h"

Bullet::Bullet()
    : m_x(0), m_y(0), m_active(false) {}

Bullet::Bullet(int x, int y)
    : m_x(x), m_y(y), m_active(true) {}

void Bullet::spawn(int x, int y) {
    m_x = x;
    m_y = y;
    m_active = true;
}

void Bullet::update() {
    if (!m_active) return;
    m_y--;
    if (m_y < 1) {
        m_active = false;
    }
}

