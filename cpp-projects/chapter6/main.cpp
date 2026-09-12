#include "Game.h"
#include "AchievementObserver.h"
#include "ScoreObserver.h"
#include <iostream>
#include <memory>

int main() {
    std::cout << "Starting Space Invaders - Chapter 6 (Design Patterns)..." << std::endl;

    Game game;

    // Observer パターン：実績管理とスコア集計を監視者として登録
    // ゲーム本体（Game クラス）は実績条件を一切知らず、イベントのみを発行する！
    auto achievementSys = std::make_shared<AchievementObserver>();
    auto scoreSys = std::make_shared<ScoreObserver>();

    game.addObserver(achievementSys);
    game.addObserver(scoreSys);

    // ゲームメインループ開始
    game.run();

    std::cout << "\nGame session ended. Thank you for playing!" << std::endl;
    return 0;
}

