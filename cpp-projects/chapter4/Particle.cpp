#include "Particle.h"

Particle::Particle(float x, float y, float vx, float vy, int life, char glyph)
    : m_x(x), m_y(y), m_vx(vx), m_vy(vy), m_life(life), m_glyph(glyph) {}

void Particle::update() {
    if (m_life <= 0) return;
    m_x += m_vx;
    m_y += m_vy;
    m_life--;
}

