#pragma once
#include <vector>
#include <string>
#include "Common.h"

class Bullet {
private:
    float m_x;
    float m_y;
    float m_vx;
    bool  m_active;

public:
    Bullet(float x, float y, float vx = 0.0f);
    ~Bullet() = default;

    void update();
    void draw(std::vector<std::string>& buffer) const;

    float getX() const { return m_x; }
    float getY() const { return m_y; }
    bool isActive() const { return m_active; }
    void deactivate() { m_active = false; }
};

