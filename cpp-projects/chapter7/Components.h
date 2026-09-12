#pragma once
#include "Component.h"
#include <string>

// 位置・速度データコンポーネント
struct TransformComponent : public Component {
    float x;
    float y;
    float vx;
    float vy;

    TransformComponent(float x = 0.0f, float y = 0.0f, float vx = 0.0f, float vy = 0.0f)
        : x(x), y(y), vx(vx), vy(vy) {}
};

// 描画グリフ・スタイルコンポーネント
struct RenderComponent : public Component {
    char glyph;
    std::string colorCode; // ANSIカラーエスケープ
    int width;             // 複数文字の場合 (ボスなど)

    RenderComponent(char glyph = '?', const std::string& color = "\033[0m", int width = 1)
        : glyph(glyph), colorCode(color), width(width) {}
};

// 体力・耐久値コンポーネント
struct HealthComponent : public Component {
    int hp;
    int maxHp;

    HealthComponent(int hp = 1) : hp(hp), maxHp(hp) {}
    bool isDead() const { return hp <= 0; }
    void takeDamage(int dmg) { hp = (hp > dmg) ? (hp - dmg) : 0; }
};

// 移動挙動コンポーネント
struct MovementComponent : public Component {
    int dir;           // 1: 右, -1: 左
    int stepInterval;  // 移動更新頻度
    bool oscillates;   // 上下ウェーブ運動するかどうか

    MovementComponent(int dir = 1, int interval = 4, bool oscillates = false)
        : dir(dir), stepInterval(interval), oscillates(oscillates) {}
};

// 射撃武装コンポーネント
struct ShooterComponent : public Component {
    int cooldown;
    int maxCooldown;
    bool isTripleShot;

    ShooterComponent(int maxCd = 5, bool triple = false)
        : cooldown(0), maxCooldown(maxCd), isTripleShot(triple) {}
};

