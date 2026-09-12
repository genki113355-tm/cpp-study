#pragma once

// ECS コンポーネント基底クラス
// コンポーネントは「純粋なデータ構造（POD）」として設計し、ロジックを持たない
struct Component {
    virtual ~Component() = default;
};

