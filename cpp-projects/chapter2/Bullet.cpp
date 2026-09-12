#include "Bullet.h"

Bullet::Bullet() : m_x(0), m_y(0), m_active(false) {}

void Bullet::spawn(int startX, int startY) {
    m_x = startX;
    m_y = startY;
    m_active = true;
}

void Bullet::update() {
    if (!m_active) return;

    m_y--;
    if (m_y < 1) {
        m_active = false;
    }
}

