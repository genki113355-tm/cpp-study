cmake_minimum_required(VERSION 3.16)
project(Chapter5_SmartPointers LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(Chapter5_SmartPointers
    main.cpp
    Game.cpp
    Player.cpp
    Item.cpp
    BitDrone.cpp
    Bullet.cpp
    Particle.cpp
    Common.h
    Enemy.h
    NormalEnemy.h
    ShieldEnemy.h
    UfoEnemy.h
    Item.h
    BitDrone.h
    Player.h
    Bullet.h
    Particle.h
    Game.h
)

