#pragma once
#include <vector>
#include <memory>
#include <string>
#include "Common.h"
#include "Bullet.h"
#include "BitDrone.h"

class Player {
private:
    int  m_x;
    int  m_y;
    bool m_hasTripleShot;
    std::vector<std::shared_ptr<BitDrone>> m_drones;

public:
    Player(int startX, int startY);
    ~Player() = default;

    void moveLeft();
    void moveRight();
    void update();
    void draw(std::vector<std::string>& buffer) const;

    // 弾を発射（通常・3WAY・ビット援護弾を Bullet リストに生成）
    void shoot(std::vector<Bullet>& bullets) const;

    // パワーアップ
    void enableTripleShot() { m_hasTripleShot = true; }
    void addDrone(std::shared_ptr<BitDrone> drone);

    int getX() const { return m_x; }
    int getY() const { return m_y; }
    int getDroneCount() const { return static_cast<int>(m_drones.size()); }
    bool hasTripleShot() const { return m_hasTripleShot; }
};

