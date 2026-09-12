#include "GameOverState.h"
#include "TitleState.h"
#include "Game.h"
#include <iostream>

void GameOverState::enter(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, isClear ? "Enter Clear Scene" : "Enter GameOver Scene");
}

void GameOverState::update(Game& game) {
    // 演出用タイマー等の処理
}

void GameOverState::render(const Game& game) {
    std::cout << "\033[2J\033[H"; // 画面クリア
    std::cout << "========================================\n";
    if (isClear) {
        std::cout << "          🏆 MISSION ACCOMPLISHED! 🏆   \n";
        std::cout << "      All Invaders Neutralized!         \n";
    } else {
        std::cout << "               💀 GAME OVER 💀          \n";
        std::cout << "       Defense Line Was Breached!       \n";
    }
    std::cout << "========================================\n\n";
    std::cout << "   FINAL SCORE: " << game.getScore() << "\n\n";
    std::cout << "   - Press R or Space to Return to Title\n";
    std::cout << "   - Press Q to Quit Game              \n\n";
    std::cout << "========================================\n";
}

void GameOverState::handleInput(Game& game, char input) {
    if (input == 'r' || input == 'R' || input == ' ' || input == '\r' || input == '\n') {
        game.changeState(std::make_unique<TitleState>());
    } else if (input == 'q' || input == 'Q') {
        game.stop();
    }
}

void GameOverState::exit(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Exit GameOver Scene");
}

