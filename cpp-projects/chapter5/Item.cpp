#include "Item.h"

Item::Item(float x, float y, ItemType type)
    : m_x(x), m_y(y), m_type(type), m_active(true) {}

void Item::update() {
    if (!m_active) return;
    m_y += 0.25f; // ゆっくりと地上へ落下
    if (m_y >= SCREEN_HEIGHT - 1) {
        m_active = false; // 画面外で消滅（unique_ptrにより安全に破棄）
    }
}

void Item::draw(std::vector<std::string>& buffer) const {
    if (!m_active) return;
    int ix = static_cast<int>(m_x);
    int iy = static_cast<int>(m_y);
    if (iy >= 1 && iy < SCREEN_HEIGHT - 1 && ix >= 1 && ix < SCREEN_WIDTH - 1) {
        buffer[iy][ix] = (m_type == ItemType::Power) ? 'P' : 'B';
    }
}

