#pragma once
#include <vector>
#include <string>
#include "Common.h"

enum class ItemType {
    Power, // 3連射レーザー化 ('P')
    Bit    // 援護ビットドローン追加 ('B')
};

class Item {
private:
    float    m_x;
    float    m_y;
    ItemType m_type;
    bool     m_active;

public:
    Item(float x, float y, ItemType type);
    ~Item() = default;

    void update();
    void draw(std::vector<std::string>& buffer) const;

    float getX() const { return m_x; }
    float getY() const { return m_y; }
    ItemType getType() const { return m_type; }
    bool isActive() const { return m_active; }
    void deactivate() { m_active = false; }
};

