#pragma once
#include <vector>
#include <string>

// 敵キャラクターの抽象基底クラス
class Enemy {
protected:
    float m_x;
    float m_y;
    int   m_hp;
    bool  m_alive;

public:
    Enemy(float x, float y, int hp)
        : m_x(x), m_y(y), m_hp(hp), m_alive(true) {}

    // 【絶対鉄則】基底クラスのデストラクタは必ず virtual にする
    // これにより unique_ptr<Enemy> 破棄時に派生クラスのデストラクタが正しく実行される
    virtual ~Enemy() = default;

    // 純粋仮想関数（インターフェース定義）
    virtual void update(int dir) = 0;
    virtual void draw(std::vector<std::string>& buffer) const = 0;
    virtual int  getScore() const = 0;

    // 被弾処理
    virtual bool takeDamage(int dmg) {
        m_hp -= dmg;
        if (m_hp <= 0) {
            m_alive = false;
            return true; // 撃破
        }
        return false;
    }

    // ゲッター
    float getX() const { return m_x; }
    float getY() const { return m_y; }
    void  setY(float y) { m_y = y; }
    bool  isAlive() const { return m_alive; }
    int   getHp() const { return m_hp; }
};

