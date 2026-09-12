#pragma once
#include <vector>
#include <string>
#include "Common.h"

class Particle {
private:
    float m_x;
    float m_y;
    float m_vx;
    float m_vy;
    int   m_lifetime;
    char  m_glyph;

public:
    Particle(float x, float y, float vx, float vy, int lifetime, char glyph = '*');
    ~Particle() = default;

    void update();
    void draw(std::vector<std::string>& buffer) const;
    bool isDead() const { return m_lifetime <= 0; }
};

