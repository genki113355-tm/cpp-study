#include "Game.h"
#include "TitleState.h"
#include <iostream>
#include <thread>
#include <chrono>

#ifdef _WIN32
#include <conio.h>
#include <windows.h>
#endif

Game::Game() {
    resetGame();
    // 初期状態は TitleState
    changeState(std::make_unique<TitleState>());
}

void Game::resetGame() {
    playerX = 14;
    score = 0;
    invaderDir = 1;
    frameCount = 0;

    // 弾バッファ初期化
    bullets.clear();
    for (int i = 0; i < MAX_PLAYER_BULLETS; ++i) {
        bullets.push_back({0.0f, 0.0f, false});
    }

    // 敵初期化（通常敵 + シールド敵 + エリート敵）
    enemies.clear();
    for (int i = 0; i < 6; ++i) {
        EnemyData e;
        e.x = static_cast<float>(4 + i * 4);
        e.y = 2.0f;
        e.isAlive = true;

        if (i == 1) {
            e.type = "elite";
            e.hp = 3;
            e.maxHp = 3;
            e.glyph = 'E';
        } else if (i == 2 || i == 3) {
            e.type = "shield";
            e.hp = 2;
            e.maxHp = 2;
            e.glyph = 'S';
        } else {
            e.type = "normal";
            e.hp = 1;
            e.maxHp = 1;
            e.glyph = 'V';
        }
        enemies.push_back(e);
    }
}

void Game::changeState(std::unique_ptr<GameState> newState) {
    if (currentState) {
        currentState->exit(*this);
    }
    currentState = std::move(newState);
    if (currentState) {
        currentState->enter(*this);
    }
}

void Game::addObserver(std::shared_ptr<IObserver> observer) {
    observers.push_back(observer);
}

void Game::notify(GameEvent event, int value, const std::string& message) {
    for (auto& obs : observers) {
        if (obs) {
            obs->onNotify(event, value, message);
        }
    }
}

void Game::run() {
#ifdef _WIN32
    // Windows コンソールで ANSI エスケープシーケンスを有効化
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD dwMode = 0;
    GetConsoleMode(hOut, &dwMode);
    dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
    SetConsoleMode(hOut, dwMode);
#endif

    while (running) {
        // キー入力チェック
#ifdef _WIN32
        if (_kbhit()) {
            char ch = static_cast<char>(_getch());
            if (currentState) {
                currentState->handleInput(*this, ch);
            }
        }
#endif

        // 状態更新
        if (currentState) {
            currentState->update(*this);
            currentState->render(*this);
        }

        // フレームレート制御（約30FPS）
        std::this_thread::sleep_for(std::chrono::milliseconds(33));
    }
}

