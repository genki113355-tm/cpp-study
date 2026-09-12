#include "BitDrone.h"
#include <cmath>

BitDrone::BitDrone(float initialAngle, float orbitRadius)
    : m_angle(initialAngle), m_orbitRadius(orbitRadius), m_currentX(0.0f), m_currentY(0.0f) {}

void BitDrone::update(float playerCenterX, float playerCenterY) {
    m_angle += 0.08f; // 旋回
    m_currentX = playerCenterX + std::cos(m_angle) * m_orbitRadius;
    m_currentY = playerCenterY + std::sin(m_angle) * (m_orbitRadius * 0.5f);
}

void BitDrone::draw(std::vector<std::string>& buffer) const {
    int ix = static_cast<int>(std::round(m_currentX));
    int iy = static_cast<int>(std::round(m_currentY));
    if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
        buffer[iy][ix] = 'b';
    }
}

