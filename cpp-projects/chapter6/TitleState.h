#pragma once
#include "GameState.h"
#include <iostream>

// タイトル画面ステート
class TitleState : public GameState {
public:
    void enter(Game& game) override;
    void update(Game& game) override;
    void render(const Game& game) override;
    void handleInput(Game& game, char input) override;
    void exit(Game& game) override;

    std::string getName() const override { return "TITLE"; }
};

