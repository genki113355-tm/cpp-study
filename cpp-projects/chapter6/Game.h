#pragma once
#include "Common.h"
#include "GameState.h"
#include "Observer.h"
#include <memory>
#include <vector>
#include <string>

// 敵データ構造
struct EnemyData {
    float x;
    float y;
    int hp;
    int maxHp;
    char glyph;
    bool isAlive;
    std::string type;
};

// 弾データ構造
struct BulletData {
    float x;
    float y;
    bool isActive;
};

// ゲーム本体クラス（Stateコンテキスト ＆ Observer被監視者 Subject）
class Game {
private:
    std::unique_ptr<GameState> currentState;
    std::vector<std::shared_ptr<IObserver>> observers;

    bool running = true;
    int playerX = 14;
    int score = 0;
    int invaderDir = 1;
    int frameCount = 0;
    std::vector<EnemyData> enemies;
    std::vector<BulletData> bullets;

public:
    Game();
    ~Game() = default;

    // State 管理
    void changeState(std::unique_ptr<GameState> newState);
    GameState* getState() const { return currentState.get(); }

    // Observer 管理（Subject 機能）
    void addObserver(std::shared_ptr<IObserver> observer);
    void notify(GameEvent event, int value = 0, const std::string& message = "");

    // ゲームメインループ制御
    void run();
    void stop() { running = false; }
    bool isRunning() const { return running; }

    // ゲームプレイ用データアクセス
    int getPlayerX() const { return playerX; }
    void setPlayerX(int x) { playerX = x; }
    int getScore() const { return score; }
    void addScore(int pts) { score += pts; }
    void setScore(int pts) { score = pts; }
    
    std::vector<EnemyData>& getEnemies() { return enemies; }
    const std::vector<EnemyData>& getEnemies() const { return enemies; }

    std::vector<BulletData>& getBullets() { return bullets; }
    const std::vector<BulletData>& getBullets() const { return bullets; }

    int getInvaderDir() const { return invaderDir; }
    void setInvaderDir(int dir) { invaderDir = dir; }

    int getFrameCount() const { return frameCount; }
    void incFrameCount() { frameCount++; }

    // 初期化リセット
    void resetGame();
};

