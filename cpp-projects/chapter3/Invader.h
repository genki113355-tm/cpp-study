#pragma once

class Invader {
private:
    int m_x;
    int m_y;
    bool m_alive;

public:
    Invader(int x, int y);

    void move(int dx, int dy);
    void destroy();

    int getX() const { return m_x; }
    int getY() const { return m_y; }
    bool isAlive() const { return m_alive; }
};

