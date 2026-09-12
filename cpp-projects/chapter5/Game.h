#pragma once
#include <vector>
#include <memory>
#include <string>
#include "Common.h"
#include "Player.h"
#include "Enemy.h"
#include "Item.h"
#include "Bullet.h"
#include "Particle.h"

class Game {
private:
    // 【モダンC++の神髄】生ポインタゼロ！すべての動的オブジェクトをスマートポインタで管理
    std::vector<std::unique_ptr<Enemy>> m_enemies;
    std::vector<std::unique_ptr<Item>>  m_items;
    std::vector<Bullet>                 m_bullets;
    std::vector<Particle>               m_particles;
    Player                              m_player;

    int  m_enemyDir;
    int  m_enemyMoveTimer;
    int  m_ufoTimer;
    int  m_score;
    bool m_gameOver;
    bool m_gameClear;

    void spawnExplosion(float x, float y, bool isUfo = false);

public:
    Game();
    // デストラクタで手動 delete を書く必要はゼロ！
    // vector が破棄されると、内部の unique_ptr が各派生クラスの仮想デストラクタを自動起動する！
    ~Game() = default;

    void init();
    void processInput();
    void update();
    void render();

    bool isGameOver() const { return m_gameOver; }
    bool isGameClear() const { return m_gameClear; }
    int  getScore() const { return m_score; }

    // スマートポインタ稼働数インスペクター（学習確認用）
    size_t getUniqueEnemyCount() const { return m_enemies.size(); }
    size_t getUniqueItemCount() const { return m_items.size(); }
    int    getPlayerDroneCount() const { return m_player.getDroneCount(); }
};

