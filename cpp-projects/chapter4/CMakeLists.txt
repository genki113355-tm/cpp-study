cmake_minimum_required(VERSION 3.10)
project(InvaderChapter4 CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(invader_ch4
    main.cpp
    Game.cpp
    Player.cpp
    Bullet.cpp
    Particle.cpp
)

