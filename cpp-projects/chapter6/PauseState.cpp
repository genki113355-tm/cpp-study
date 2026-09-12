#include "PauseState.h"
#include "PlayState.h"
#include "Game.h"
#include <iostream>

void PauseState::enter(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Enter Pause Scene");
}

void PauseState::update(Game& game) {
    // ポーズ中はゲーム内エンティティの更新は一切行わない
}

void PauseState::render(const Game& game) {
    std::cout << "\033[2J\033[H"; // 画面クリア
    std::cout << "========================================\n";
    std::cout << "               PAUSED                   \n";
    std::cout << "========================================\n\n";
    std::cout << "   [ Current State: PAUSE ]            \n";
    std::cout << "   Score so far: " << game.getScore() << "\n\n";
    std::cout << "   - Press P to Resume Playing         \n";
    std::cout << "   - Press Q to Quit Game              \n\n";
    std::cout << " (Stateパターンにより、update()呼出自体を停止)\n";
    std::cout << "========================================\n";
}

void PauseState::handleInput(Game& game, char input) {
    if (input == 'p' || input == 'P') {
        // ゲーム再開（PlayStateへ遷移）
        game.changeState(std::make_unique<PlayState>());
    } else if (input == 'q' || input == 'Q') {
        game.stop();
    }
}

void PauseState::exit(Game& game) {
    game.notify(GameEvent::SCENE_CHANGED, 0, "Exit Pause Scene");
}

