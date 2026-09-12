#pragma once
#include <vector>
#include <string>
#include "Common.h"

class BitDrone {
private:
    float m_angle;      // 公転旋回角度
    float m_orbitRadius;// 回転半径
    float m_currentX;
    float m_currentY;

public:
    BitDrone(float initialAngle, float orbitRadius = 3.0f);
    ~BitDrone() = default;

    void update(float playerCenterX, float playerCenterY);
    void draw(std::vector<std::string>& buffer) const;

    float getX() const { return m_currentX; }
    float getY() const { return m_currentY; }
};

