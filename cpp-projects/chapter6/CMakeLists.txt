cmake_minimum_required(VERSION 3.16)
project(Chapter6_Patterns LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(Chapter6_Patterns
    main.cpp
    Game.cpp
    TitleState.cpp
    PlayState.cpp
    PauseState.cpp
    GameOverState.cpp
    Common.h
    GameState.h
    TitleState.h
    PlayState.h
    PauseState.h
    GameOverState.h
    Observer.h
    AchievementObserver.h
    ScoreObserver.h
    Game.h
)

