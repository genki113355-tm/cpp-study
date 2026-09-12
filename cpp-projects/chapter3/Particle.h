#pragma once
#include "Common.h"

class Particle {
private:
    float m_x;
    float m_y;
    float m_vx;
    float m_vy;
    int m_lifetime;
    char m_glyph;

public:
    Particle(float x, float y, float vx, float vy, int lifetime, char glyph);

    void update();
    bool isDead() const { return m_lifetime <= 0; }

    int getX() const { return (int)m_x; }
    int getY() const { return (int)m_y; }
    char getGlyph() const { return m_glyph; }
};

