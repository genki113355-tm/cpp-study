#pragma once
#include "Bullet.h"

class Player {
private:
    int m_x;
    int m_y;

public:
    Player(int startX, int startY);

    void moveLeft();
    void moveRight();
    void shoot(Bullet& bullet);

    int getX() const { return m_x; }
    int getY() const { return m_y; }
};

