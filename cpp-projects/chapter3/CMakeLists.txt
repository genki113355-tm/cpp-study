cmake_minimum_required(VERSION 3.10)
project(InvaderChapter3 CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(invader_ch3
    main.cpp
    Game.cpp
    Player.cpp
    Invader.cpp
    Bullet.cpp
    Particle.cpp
)

