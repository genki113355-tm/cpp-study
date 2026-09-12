#pragma once
#include "Observer.h"
#include <iostream>
#include <vector>
#include <string>

// 実績解除システム（Observerパターンでゲームロジックから完全に分離）
class AchievementObserver : public IObserver {
private:
    int totalKills = 0;
    bool ufoHunterUnlocked = false;
    bool veteranUnlocked = false;
    bool clearMasterUnlocked = false;
    std::vector<std::string> unlockedLog;

public:
    void onNotify(GameEvent event, int value, const std::string& message) override {
        switch (event) {
            case GameEvent::ENEMY_DEFEATED:
            case GameEvent::ELITE_DEFEATED:
                totalKills++;
                if (totalKills >= 5 && !veteranUnlocked) {
                    veteranUnlocked = true;
                    unlock("🏆 実績解除: [ベテランソルジャー] - 敵を5体撃破！");
                }
                break;

            case GameEvent::UFO_DEFEATED:
                totalKills++;
                if (!ufoHunterUnlocked) {
                    ufoHunterUnlocked = true;
                    unlock("🏆 実績解除: [UFOハンター] - 未確認飛行物体を撃墜！");
                }
                break;

            case GameEvent::GAME_CLEAR:
                if (!clearMasterUnlocked) {
                    clearMasterUnlocked = true;
                    unlock("🏆 実績解除: [スペースエース] - 全敵侵略部隊を撃退し防衛成功！");
                }
                break;

            default:
                break;
        }
    }

    void unlock(const std::string& title) {
        unlockedLog.push_back(title);
        std::cout << "\n========================================\n"
                  << "  " << title << "\n"
                  << "========================================\n" << std::endl;
    }

    const std::vector<std::string>& getLog() const {
        return unlockedLog;
    }
};

