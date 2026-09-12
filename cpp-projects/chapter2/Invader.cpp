#include "Invader.h"

Invader::Invader(int x, int y) : m_x(x), m_y(y), m_alive(true) {}

void Invader::move(int dx, int dy) {
    if (!m_alive) return;
    m_x += dx;
    m_y += dy;
}

void Invader::destroy() {
    m_alive = false;
}

