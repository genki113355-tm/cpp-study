#include "Particle.h"

Particle::Particle(float x, float y, float vx, float vy, int lifetime, char glyph)
    : m_x(x), m_y(y), m_vx(vx), m_vy(vy), m_lifetime(lifetime), m_glyph(glyph) {}

void Particle::update() {
    m_x += m_vx;
    m_y += m_vy;
    m_lifetime--;
}

void Particle::draw(std::vector<std::string>& buffer) const {
    if (m_lifetime <= 0) return;
    int ix = static_cast<int>(m_x);
    int iy = static_cast<int>(m_y);
    if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
        buffer[iy][ix] = m_glyph;
    }
}

