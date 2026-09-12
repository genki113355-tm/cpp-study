#pragma once
#include "Observer.h"
#include <iostream>

// スコア集計オブザーバー（ゲーム本体とは独立してスコア統計・コンボを追跡）
class ScoreObserver : public IObserver {
private:
    int totalScore = 0;
    int combo = 0;

public:
    void onNotify(GameEvent event, int value, const std::string& message) override {
        if (event == GameEvent::ENEMY_DEFEATED || 
            event == GameEvent::UFO_DEFEATED || 
            event == GameEvent::ELITE_DEFEATED) {
            combo++;
            int bonus = (combo > 1) ? (combo * 10) : 0;
            totalScore += value + bonus;
        } else if (event == GameEvent::GAME_OVER) {
            combo = 0;
        }
    }

    int getScore() const { return totalScore; }
    int getCombo() const { return combo; }
    void reset() { totalScore = 0; combo = 0; }
};

