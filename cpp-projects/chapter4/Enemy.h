#pragma once

// 【第4章：抽象基底クラス Enemy】
// ポリモーフィズム（多態性）の根幹となるインターフェース定義
class Enemy {
protected:
    int m_x;
    int m_y;
    int m_hp;
    bool m_alive;

public:
    Enemy(int x, int y, int hp = 1)
        : m_x(x), m_y(y), m_hp(hp), m_alive(true) {}

    // 【重要：仮想デストラクタ】
    // 基底クラスのポインタで delete された際、
    // 派生クラスのデストラクタが正しく呼ばれるよう virtual が必須！
    virtual ~Enemy() = default;

    // 【純粋仮想関数（Pure Virtual Functions）】
    // 派生クラスごとに固有の振る舞いを強制する
    virtual void update(int dirX, bool moveDown) = 0;
    virtual char getGlyph() const = 0;
    virtual int getScore() const = 0;

    // 共通インターフェース
    virtual bool hit() {
        if (!m_alive) return false;
        m_hp--;
        if (m_hp <= 0) {
            m_alive = false;
        }
        return true;
    }

    bool isAlive() const { return m_alive; }
    int getX() const { return m_x; }
    int getY() const { return m_y; }
    int getHp() const { return m_hp; }
};

