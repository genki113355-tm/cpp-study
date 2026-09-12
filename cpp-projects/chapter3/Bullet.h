#pragma once
#include "Common.h"

class Bullet {
private:
    int m_x;
    int m_y;
    bool m_active;

public:
    Bullet(int startX, int startY);

    void update();

    bool isActive() const { return m_active; }
    void deactivate() { m_active = false; }
    int getX() const { return m_x; }
    int getY() const { return m_y; }
};

