#pragma once
#include "GameState.h"

// ゲームオーバー / クリアステート
class GameOverState : public GameState {
private:
    bool isClear;

public:
    explicit GameOverState(bool clear) : isClear(clear) {}

    void enter(Game& game) override;
    void update(Game& game) override;
    void render(const Game& game) override;
    void handleInput(Game& game, char input) override;
    void exit(Game& game) override;

    std::string getName() const override { return isClear ? "CLEAR" : "GAMEOVER"; }
};

