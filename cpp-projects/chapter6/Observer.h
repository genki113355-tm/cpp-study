#pragma once
#include <string>

// ゲーム内イベント定義
enum class GameEvent {
    ENEMY_DEFEATED,    // 敵撃破 (value: 得点)
    UFO_DEFEATED,      // UFO撃破 (value: 得点)
    ELITE_DEFEATED,    // エリート敵撃破 (value: 得点)
    PLAYER_SHOOT,      // 弾発射
    SCENE_CHANGED,     // シーン遷移
    GAME_CLEAR,        // ゲームクリア
    GAME_OVER          // ゲームオーバー
};

// Observer パターンの監視者インターフェース
class IObserver {
public:
    virtual ~IObserver() = default;
    virtual void onNotify(GameEvent event, int value, const std::string& message) = 0;
};

