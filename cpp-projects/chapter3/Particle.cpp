#include "Particle.h"

Particle::Particle(float x, float y, float vx, float vy, int lifetime, char glyph)
    : m_x(x), m_y(y), m_vx(vx), m_vy(vy), m_lifetime(lifetime), m_glyph(glyph) {}

void Particle::update() {
    m_x += m_vx;
    m_y += m_vy;
    m_lifetime--;
}

