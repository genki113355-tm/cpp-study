#pragma once
#include "Component.h"
#include <unordered_map>
#include <typeindex>
#include <memory>
#include <string>
#include <utility>

// ECS エンティティクラス
// 「何であるか（is-a: 継承）」ではなく「何を持っているか（has-a: 合成）」を表現する汎用コンテナ
class Entity {
private:
    int id;
    std::string tag;
    bool alive = true;
    std::unordered_map<std::type_index, std::unique_ptr<Component>> components;

public:
    Entity(int id, const std::string& tag = "default") : id(id), tag(tag) {}
    ~Entity() = default;

    int getId() const { return id; }
    const std::string& getTag() const { return tag; }
    bool isAlive() const { return alive; }
    void destroy() { alive = false; }

    // テンプレートによるコンポーネント追加（可変長引数による完全転送）
    template<typename T, typename... Args>
    T& addComponent(Args&&... args) {
        auto comp = std::make_unique<T>(std::forward<Args>(args)...);
        T& ref = *comp;
        components[std::type_index(typeid(T))] = std::move(comp);
        return ref;
    }

    // テンプレートによる型安全なコンポーネント取得
    template<typename T>
    T* getComponent() {
        auto it = components.find(std::type_index(typeid(T)));
        if (it != components.end()) {
            return static_cast<T*>(it->second.get());
        }
        return nullptr;
    }

    template<typename T>
    const T* getComponent() const {
        auto it = components.find(std::type_index(typeid(T)));
        if (it != components.end()) {
            return static_cast<const T*>(it->second.get());
        }
        return nullptr;
    }

    // コンポーネントを所持しているかの検査
    template<typename T>
    bool hasComponent() const {
        return components.find(std::type_index(typeid(T))) != components.end();
    }
};

