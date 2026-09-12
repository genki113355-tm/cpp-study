#pragma once

class Particle {
private:
    float m_x, m_y;
    float m_vx, m_vy;
    int m_life;
    char m_glyph;

public:
    Particle(float x, float y, float vx, float vy, int life, char glyph = '*');

    void update();

    bool isAlive() const { return m_life > 0; }
    int getX() const { return static_cast<int>(m_x); }
    int getY() const { return static_cast<int>(m_y); }
    char getGlyph() const { return m_glyph; }
};

