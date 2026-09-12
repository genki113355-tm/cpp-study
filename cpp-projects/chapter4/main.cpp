#include "Game.h"
#include <iostream>

int main() {
    std::cout << "========================================\n";
    std::cout << "  C++ OOP Invader - Chapter 4           \n";
    std::cout << "  Inheritance & Polymorphism Edition    \n";
    std::cout << "========================================\n";
    std::cout << "Starting game in 1 second...\n";
    
    Game game;
    game.run();

    std::cout << "\nPress Enter to exit.\n";
    std::cin.get();
    return 0;
}

