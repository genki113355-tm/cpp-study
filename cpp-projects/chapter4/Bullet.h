#pragma once

class Bullet {
private:
    int m_x;
    int m_y;
    bool m_active;

public:
    Bullet();
    Bullet(int x, int y);

    void spawn(int x, int y);
    void update();
    void deactivate() { m_active = false; }

    bool isActive() const { return m_active; }
    int getX() const { return m_x; }
    int getY() const { return m_y; }
};

