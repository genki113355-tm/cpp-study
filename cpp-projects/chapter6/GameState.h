#pragma once
#include <string>

// 前方宣言
class Game;

// State パターン：ゲーム状態（シーン）の抽象基底クラス
// 巨大な switch-case による画面分岐を完全にクラスへ委譲する
class GameState {
public:
    virtual ~GameState() = default;

    // 状態進入時の初期化
    virtual void enter(Game& game) {}

    // フレームごとの更新ロジック
    virtual void update(Game& game) = 0;

    // 描画ロジック
    virtual void render(const Game& game) = 0;

    // キー入力ハンドリング
    virtual void handleInput(Game& game, char input) = 0;

    // 状態退出時のクリーンアップ
    virtual void exit(Game& game) {}

    // デバッグ・UI用状態名
    virtual std::string getName() const = 0;
};

