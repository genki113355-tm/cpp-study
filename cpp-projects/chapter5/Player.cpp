#include "Player.h"
#include <cmath>

Player::Player(int startX, int startY)
    : m_x(startX), m_y(startY), m_hasTripleShot(false) {}

void Player::moveLeft() {
    if (m_x > 1) {
        m_x--;
    }
}

void Player::moveRight() {
    if (m_x < SCREEN_WIDTH - 4) {
        m_x++;
    }
}

void Player::addDrone(std::shared_ptr<BitDrone> drone) {
    if (m_drones.size() < MAX_DRONES) {
        m_drones.push_back(std::move(drone));
    }
}

void Player::update() {
    // 従属する各ビット機の座標を自機中心で更新
    float centerX = static_cast<float>(m_x + 1);
    float centerY = static_cast<float>(m_y);
    for (auto& drone : m_drones) {
        drone->update(centerX, centerY);
    }
}

void Player::draw(std::vector<std::string>& buffer) const {
    // 自機本体: _A_
    if (m_y >= 0 && m_y < SCREEN_HEIGHT) {
        if (m_x >= 0 && m_x < SCREEN_WIDTH) buffer[m_y][m_x] = '_';
        if (m_x + 1 >= 0 && m_x + 1 < SCREEN_WIDTH) buffer[m_y][m_x + 1] = 'A';
        if (m_x + 2 >= 0 && m_x + 2 < SCREEN_WIDTH) buffer[m_y][m_x + 2] = '_';
    }

    // 護衛ビット機の描画
    for (const auto& drone : m_drones) {
        drone->draw(buffer);
    }
}

void Player::shoot(std::vector<Bullet>& bullets) const {
    if (bullets.size() >= MAX_PLAYER_BULLETS) return;

    if (m_hasTripleShot) {
        // 3WAYレーザーショット（中央・左斜め・右斜め）
        bullets.emplace_back(static_cast<float>(m_x + 1), static_cast<float>(m_y - 1), 0.0f);
        bullets.emplace_back(static_cast<float>(m_x), static_cast<float>(m_y - 1), -0.2f);
        bullets.emplace_back(static_cast<float>(m_x + 2), static_cast<float>(m_y - 1), 0.2f);
    } else {
        // 通常単発ショット
        bullets.emplace_back(static_cast<float>(m_x + 1), static_cast<float>(m_y - 1), 0.0f);
    }

    // ビット機からの連動援護射撃
    for (const auto& drone : m_drones) {
        bullets.emplace_back(drone->getX(), drone->getY() - 1.0f, 0.0f);
    }
}

