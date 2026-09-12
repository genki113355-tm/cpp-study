#include "Player.h"
#include "Common.h"

Player::Player(int startX, int startY) : m_x(startX), m_y(startY) {}

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

