#include "TitleState.h"
#include "PlayState.h"
#include "Game.h"
#include <iostream>

void TitleState::enter(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Enter Title Scene");
}

void TitleState::update(Game& game) {
    // タイトル画面のアニメーションや待機処理
}

void TitleState::render(const Game& game) {
    std::cout << "\033[2J\033[H"; // 画面クリア
    std::cout << "========================================\n";
    std::cout << "      SPACE INVADERS: PATTERNS          \n";
    std::cout << "   (C++17 State & Observer Pattern)     \n";
    std::cout << "========================================\n\n";
    std::cout << "      [ Press SPACE to Start Game ]     \n";
    std::cout << "      [ Press Q to Quit           ]     \n\n";
    std::cout << "  - State Pattern: シーン切替を完全分離 \n";
    std::cout << "  - Observer Pattern: 実績通知を疎結合化\n";
    std::cout << "========================================\n";
}

void TitleState::handleInput(Game& game, char input) {
    if (input == ' ' || input == '\r' || input == '\n') {
        game.resetGame();
        game.changeState(std::make_unique<PlayState>());
    } else if (input == 'q' || input == 'Q') {
        game.stop();
    }
}

void TitleState::exit(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Exit Title Scene");
}

