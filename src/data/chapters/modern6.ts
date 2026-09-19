import { Chapter } from '../../types/curriculum';

export const chapterM6: Chapter = {
  id: 18,
  slug: 'chapter-modern-6-concepts',
  courseTrack: 'modern',
  courseChapterCode: 'M11',
  title: 'モダン第11章：【C++20】コンセプト（Concepts）と型制約',
  subtitle: 'テンプレートの難解なエラーメッセージを完全駆逐し、意図を表明する',
  badge: 'モダンC++ M11【C++20】：コンセプト',
  gameVersion: 'v7_ecs_final',
  description: 'C++のテンプレートは、静的多態性やゼロオーバーヘッド抽象化を実現する最強の武器です。しかしC++17以前のテンプレートには「型に対する制約を直接表現できない」という致命的な弱点がありました。不適切な型を渡した瞬間、コンパイラは内部の実装深部から数百行〜数千行にも及ぶ「暗号のような難解エラー」を吐き出し、デバッグを極めて困難にしていました。C++20 で導入された【コンセプト（Concepts）】と【requires 節】は、テンプレート引数が満たすべきインターフェースや特性を宣言的に定義する革命的な機能です。本章では、SFINAE（`std::enable_if`）の黒魔術を完全駆逐し、分かりやすいエラーメッセージ、関数オーバーロードの自動選択、そして「自己文書化された美しいジェネリクス」を実現する最先端テクニックを習得します。',
  prevChapterSlug: 'chapter-7-modern-cpp-ecs',
  nextChapterSlug: 'chapter-modern-5-coroutines',
  sections: [
    {
      id: 'sec-m6-template-error-hell',
      title: 'M6.1 テンプレート暗号エラーの恐怖 vs concept による意図表明',
      leadText: '数千行のコンパイルエラーに泣かされる時代は終わりました。型が満たすべき要件をコンパイラに教え込む「concept」の威力を体験します。',
      dialogueBefore: [
        {
          id: 'dm6-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'うわあああ！ベン先生、助けてください！自作の `drawEntity<T>(T& obj)` というテンプレート関数に間違えて `int` 型の変数を渡してしまったら、ターミナルが200行以上の赤文字エラーで埋め尽くされて画面が吹き飛びました……！'
        },
        {
          id: 'dm6-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！古き良きテンプレートの洗礼【暗号エラーの壁】じゃな！テンプレートは「実体化（Instantiation）」するまで型チェックが走らず、関数の深い実装部で `obj.draw()` が見つからないと言って、テンプレートの展開スタックを全部吐き出してしまうのじゃ。'
        },
        {
          id: 'dm6-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'C++17 までは `std::enable_if_t` とか SFINAE（Substitution Failure Is Not An Error）を使って型を縛っていたと聞きましたが、呪文のように複雑でとても書けそうにありません……。'
        },
        {
          id: 'dm6-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '安心するがよい！C++20 からは【concept】という新キーワードによって、英語を喋るように自然かつ宣言的に「この型は draw() を持っていなければならない」と書けるようになったのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'SFINAE（enable_if の黒魔術） vs C++20 コンセプト（直感的制約）',
        cApproach: {
          title: '❌ C++17 以前：SFINAE と enable_if による難解な型制約',
          code: `// C++17: 型 T が draw() メンバ関数を持っているか SFINAE で判定
template <typename T, typename = void>
struct has_draw : std::false_type {};

template <typename T>
struct has_draw<T, std::void_t<decltype(std::declval<T>().draw())>> : std::true_type {};

// 関数側：std::enable_if で条件に合わない型をオーバーロード候補から外す
template <typename T, typename std::enable_if<has_draw<T>::value, int>::type = 0>
void renderEntity(T& entity) {
    entity.draw();
}
// 1箇所間違えるだけで解読不能な数百行のエラーが発生！`,
          drawbacks: [
            'テンプレートメタプログラミング（SFINAE, declval, void_t）の高度な専門知識が必要でコードの可読性が著しく低下する',
            '制約違反時のエラーメッセージが「オーバーロード候補が見つかりません」だけで、なぜ合致しなかったのかが分からない',
            'コンパイル速度が大幅に低下する'
          ]
        },
        cppApproach: {
          title: '⭕ C++20：コンセプトによる明快な自己文書化制約',
          code: `// 1. 求める要件を concept としてシンプルに定義！
template <typename T>
concept Renderable = requires(T obj) {
    obj.draw(); // obj.draw() が呼び出し可能であること
};

// 2. 制約付き関数テンプレート：typename の代わりに concept 名を書くだけ！
void renderEntity(Renderable auto& entity) {
    entity.draw();
}

// 制約に合わない型を渡した場合：
// エラー: 'int' はコンセプト 'Renderable' を満たしていません！
// 理由: 'obj.draw()' が無効な式です。
// たった2行で原因が特定できる！`,
          benefits: [
            '「この型が何をできる必要があるのか」がコードを読んだ瞬間に1秒で伝わる（自己文書化）',
            'エラー発生時に「どの要件を満たさなかったか」をコンパイラが日本語・平易な英語でピンポイント指摘してくれる',
            'コンパイル時評価が最適化されており、SFINAE に比べてビルド時間が劇的に高速化される'
          ]
        },
        paradigmShiftNotes: '「コンパイルエラーを無理やり失敗させて候補から外す（SFINAE）」裏技の時代は終わり、「型が満たすべき契約（Contract）を正面から宣言する（Concepts）」時代へ進化しました。'
      },
      codeFiles: [
        {
          filename: 'ConceptBasicExample.cpp',
          language: 'cpp',
          description: 'C++20 コンセプトの基本宣言と制約付き関数の書き方',
          code: `#include <iostream>
#include <concepts>
#include <string>

// 1. 座標を持つオブジェクトのコンセプト
template <typename T>
concept Positionable = requires(T a) {
    { a.getX() } -> std::convertible_to<float>;
    { a.getY() } -> std::convertible_to<float>;
};

// 2. 描画可能なオブジェクトのコンセプト
template <typename T>
concept Drawable = requires(T a) {
    a.draw();
};

// 3. 2つのコンセプトを合成したゲームエンティティのコンセプト
template <typename T>
concept GameEntity = Positionable<T> && Drawable<T>;

// 適合するクラス
class Player {
private:
    float x_ = 100.0f, y_ = 200.0f;
public:
    float getX() const { return x_; }
    float getY() const { return y_; }
    void draw() const {
        std::cout << "[Player] 座標 (" << x_ << ", " << y_ << ") に自機を描画\\n";
    }
};

// 適合しないクラス（draw() がない）
class InvisibleTrigger {
public:
    float getX() const { return 0.0f; }
    float getY() const { return 0.0f; }
};

// 制約付き関数テンプレート（GameEntity コンセプトを満たす型しか受け付けない）
template <GameEntity T>
void processEntity(const T& entity) {
    std::cout << "エンティティ処理: X=" << entity.getX() << ", Y=" << entity.getY() << "\\n";
    entity.draw();
}

int main() {
    Player p;
    processEntity(p); // OK: Positionable かつ Drawable を満たす

    // InvisibleTrigger t;
    // processEntity(t); // コンパイルエラー！'InvisibleTrigger' は 'Drawable' を満たさないため親切に拒絶される！

    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm6-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'すごい……！`template <GameEntity T>` と書くだけで、要件を満たさない型を渡した時に「どのメンバ関数が足りないか」をコンパイラが一発で教えてくれました！これなら新人プログラマが間違えても絶対に迷いませんね！'
        },
        {
          id: 'dm6-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！インターフェースの仮想関数（virtual）と違って、vtable のコストもゼロじゃ。コンパイル時に完全にインライン展開されながら、仮想関数と同等以上の型安全性を手に入れられるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m6-requires-clause',
      title: 'M6.2 requires 節の4大制約表現（単純制約・型制約・複合制約・入れ子制約）',
      leadText: 'コンセプトの心臓部である「requires 節」を自在に操り、戻り値の型や例外保証まで厳密に定義する技法を学びます。',
      dialogueBefore: [
        {
          id: 'dm6-7',
          speaker: 'penguin',
          emotion: 'question',
          text: '先生、`requires` の中には何が書けるんですか？メンバ関数が存在するかどうか以外にも、演算子（`+` や `==`）が使えるかどうかもチェックできますか？'
        },
        {
          id: 'dm6-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'もちろんじゃ！requires 節には【4つの制約表現】がある。これらを組み合わせれば、C++のあらゆる文法要件をミリ単位で型に課すことができるぞ！'
        }
      ],
      codeFiles: [
        {
          filename: 'RequiresClausesInDepth.cpp',
          language: 'cpp',
          description: 'requires 式の4大制約（単純・型・複合・入れ子）の実践活用',
          code: `#include <iostream>
#include <concepts>
#include <type_traits>

template <typename T>
concept RobustDamageable = requires(T a, int damage) {
    // 1. 単純制約（Simple Requirement）：式が構文として妥当か
    a.takeDamage(damage);

    // 2. 型制約（Type Requirement）：ネストされた型名が存在するか
    typename T::HealthType;

    // 3. 複合制約（Compound Requirement）：戻り値の型と noexcept の検証
    { a.isAlive() } noexcept -> std::same_as<bool>;
    { a.getHealth() } -> std::convertible_to<int>;

    // 4. 入れ子制約（Nested Requirement）：追加の真偽値プロパティを課す
    requires sizeof(T) <= 256; // 巨大すぎるオブジェクトをヒープ外で受け取るのを防ぐ
};

struct Enemy {
    using HealthType = int;
    int hp = 100;

    void takeDamage(int dmg) { hp -= dmg; }
    bool isAlive() const noexcept { return hp > 0; }
    int getHealth() const { return hp; }
};

// 制約付き関数
void hit(RobustDamageable auto& target, int dmg) {
    target.takeDamage(dmg);
    std::cout << "ダメージ適用後HP: " << target.getHealth() 
              << " (生存: " << (target.isAlive() ? "YES" : "NO") << ")\\n";
}

int main() {
    Enemy e;
    hit(e, 30);
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm6-9',
          speaker: 'penguin',
          emotion: 'teaching',
          text: '`{ a.isAlive() } noexcept -> std::same_as<bool>;` のように書けば、「例外を投げず、厳密に bool を返すこと」までコンパイル時に保証できるんですね！'
        },
        {
          id: 'dm6-10',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！関数の設計意図がそのままコンパイラの検査式になる。もはや「コメントで注意書きを書く」必要すらなくなるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m6-concept-overloading',
      title: 'M6.3 コンセプトによるオーバーロード解決とコンパイル時分岐',
      leadText: 'コンセプトは単なる門番ではありません。より制約の厳しい（特化した）関数を自動的に優先選択する「高度なディスパッチ」を学びます。',
      dialogueBefore: [
        {
          id: 'dm6-11',
          speaker: 'penguin',
          emotion: 'question',
          text: '同じ関数名で、「普通の敵」と「空を飛ぶ敵（飛行可能）」で処理を分けたい場合、どうすればいいですか？'
        },
        {
          id: 'dm6-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！C++20 コンパイラは、複数のコンセプトがある場合【より制約の多い（包摂関係にある）オーバーロードを賢く自動選択】してくれるのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'ConceptOverloading.cpp',
          language: 'cpp',
          description: '制約の包摂関係（Subsumption）によるオーバーロードの優先選択',
          code: `#include <iostream>
#include <concepts>

// 基底コンセプト：一般的な敵
template <typename T>
concept EnemyUnit = requires(T e) {
    e.updateAI();
};

// より厳しいコンセプト：飛行能力を持つ敵
template <typename T>
concept FlyingEnemyUnit = EnemyUnit<T> && requires(T e) {
    e.flyAltitude();
};

// 1. 一般的な敵向けの更新処理
template <EnemyUnit T>
void updateBehavior(T& enemy) {
    std::cout << "[地上アルゴリズム] 地形コリジョンと歩行更新を実行\\n";
    enemy.updateAI();
}

// 2. 飛行ユニット向けの特化更新処理（FlyingEnemyUnit は EnemyUnit を包摂するため優先される！）
template <FlyingEnemyUnit T>
void updateBehavior(T& enemy) {
    std::cout << "[飛行アルゴリズム] 3D高度計算と空中旋回更新を実行\\n";
    enemy.updateAI();
}

struct Slime {
    void updateAI() { std::cout << "  スライムが前進\\n"; }
};

struct Wyvern {
    void updateAI() { std::cout << "  ワイバーンが滑空\\n"; }
    float flyAltitude() { return 50.0f; }
};

int main() {
    Slime s;
    Wyvern w;

    updateBehavior(s); // 1 が自動選択される
    updateBehavior(w); // より具体的な 2 が自動選択される！

    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm6-13',
          speaker: 'penguin',
          emotion: 'happy',
          text: '仮想関数テーブル（vtable）のオーバーヘッドなしに、コンパイル時に完全に最適なアルゴリズムが選択されました！'
        },
        {
          id: 'dm6-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これがC++20の力じゃ。実行時コストゼロで、OOPのポリモーフィズム以上の柔軟性を手に入れられるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m6-invader-integration',
      title: 'M6.4 インベーダー統合：型安全なジェネリック衝突判定＆空間ディスパッチャ',
      leadText: '自機・敵・弾・障害物など、異なる型が混在するインベーダーゲームの衝突判定を、コンセプトで堅牢に統括します。',
      dialogueBefore: [
        {
          id: 'dm6-15',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '第4章で学んだ動的ポリモーフィズムと、この第6章のコンセプト。インベーダーの衝突判定エンジンで両者を完璧に使い分けてみせるぞ！'
        },
        {
          id: 'dm6-16',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'はい！どんなオブジェクト同士でも、バウンディングボックスを持つ型なら100%安全かつ最速で衝突判定できるジェネリック関数を作りましょう！'
        }
      ],
      codeFiles: [
        {
          filename: 'GenericCollisionEngine.cpp',
          language: 'cpp',
          description: 'C++20 コンセプトによるゼロオーバーヘッド衝突判定システム',
          code: `#include <iostream>
#include <concepts>
#include <cmath>

struct AABB {
    float x, y, width, height;
};

// 衝突判定可能なオブジェクトを縛るコンセプト
template <typename T>
concept Collidable = requires(const T& a) {
    { a.getAABB() } -> std::same_as<AABB>;
};

// 2つの Collidable オブジェクト間の AABB 衝突判定（完全インライン化）
template <Collidable T1, Collidable T2>
bool checkOverlap(const T1& a, const T2& b) {
    AABB boxA = a.getAABB();
    AABB boxB = b.getAABB();

    return (boxA.x < boxB.x + boxB.width &&
            boxA.x + boxA.width > boxB.x &&
            boxA.y < boxB.y + boxB.height &&
            boxA.y + boxA.height > boxB.y);
}

// プレイヤー
struct PlayerShip {
    float x = 100.0f, y = 500.0f;
    AABB getAABB() const { return {x, y, 32.0f, 16.0f}; }
};

// 敵エイリアン
struct AlienInvader {
    float x = 110.0f, y = 505.0f;
    AABB getAABB() const { return {x, y, 24.0f, 24.0f}; }
};

// 弾丸
struct PlasmaBullet {
    float x = 200.0f, y = 200.0f;
    AABB getAABB() const { return {x, y, 4.0f, 10.0f}; }
};

int main() {
    PlayerShip player;
    AlienInvader alien;
    PlasmaBullet bullet;

    std::cout << "--- C++20 コンセプト衝突判定テスト ---\\n";

    if (checkOverlap(player, alien)) {
        std::cout << "🚨 [HIT] 自機とエイリアンが衝突！シールド減少！\\n";
    } else {
        std::cout << "安全：衝突なし\\n";
    }

    if (checkOverlap(bullet, alien)) {
        std::cout << "💥 [HIT] 弾丸が敵に直撃！\\n";
    } else {
        std::cout << "弾丸は敵に命中していません\\n";
    }

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '落とし穴1：過剰制約（Over-constraining）による再利用性の低下',
          description: '必要以上に厳しい要件（特定の具象型や不必要なメンバ関数）を要求する concept を作ると、本来使えるはずの軽量構造体が拒絶されてしまいます。インターフェース分離の原則（ISP）に従い、小さく直交したコンセプト（Collidable, Movable 等）を定義して合成するのがベストプラクティスです。'
        },
        {
          title: '落とし穴2：requires 節内での暗黙の型変換の過信',
          description: '`{ a.getHp() } -> std::same_as<int>` は厳密に int を要求します。もし short や double を返す型も許容したい場合は、`std::convertible_to<int>` を使用してください。'
        },
        {
          title: '落とし穴3：コンセプトと仮想関数（virtual）の混同',
          description: 'コンセプトはコンパイル時の静的ポリモーフィズムです。「異種オブジェクトを同じ std::vector<T> に格納したい」という要件には使えません。不均一なコレクションには第4章の仮想関数や第10章の std::variant を使い、単一のアルゴリズムを型安全に共有する箇所でコンセプトを使いましょう。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-m6-1',
      question: 'C++20 コンセプト（Concepts）を導入する最大のメリットとして、最も適切なものはどれですか？',
      options: [
        'ポインタが自動的にすべて nullptr に初期化されるようになる',
        'テンプレート引数が満たすべき要件を明確に宣言でき、制約違反時に簡潔で分かりやすいコンパイルエラーが得られる',
        'すべてのクラステンプレートが実行時に動的リフレクション可能になる',
        'メモリリークをガベージコレクションによって自動回収する'
      ],
      correctIndex: 1,
      explanation: '正解は「テンプレート引数が満たすべき要件を明確に宣言でき、制約違反時に簡潔で分かりやすいコンパイルエラーが得られる」です！従来のテンプレートは何百行もの暗号のようなエラーを発生させていましたが、コンセプトによって要件を自己文書化し、即座にエラー原因を特定できるようになりました。'
    },
    {
      id: 'q-m6-2',
      question: 'C++20 requires 節において、あるメンバ関数の戻り値が特定の型に変換可能であることを指定する構文はどれですか？',
      options: [
        '{ obj.getValue() } -> std::convertible_to<int>;',
        'obj.getValue() == int;',
        'requires type(obj.getValue()) == int;',
        'convert(obj.getValue(), int);'
      ],
      correctIndex: 0,
      explanation: '正解は `{ obj.getValue() } -> std::convertible_to<int>;` です！波括弧 `{ 式 }` の後に `-> コンセプト名` を続ける「複合制約（Compound Requirement）」により、式の戻り値型に対する制約をスマートに指定できます。'
    },
    {
      id: 'q-m6-3',
      question: 'コンセプトにおける「包摂関係（Subsumption）」とオーバーロード解決に関する説明として正しいものはどれですか？',
      options: [
        'すべてのオーバーロードは常に曖昧（Ambiguous）エラーになるため、オーバーロードは禁止されている',
        'より多くの制約（&& で結合された厳しい条件）を持つコンセプトを満たすオーバーロード関数が、コンパイラによって優先的に選択される',
        '最初にソースコード上で宣言された関数が常に優先され、後の関数は無視される',
        '実行時の CPU 負荷が最も低い関数が動的にプロファイリングされて選ばれる'
      ],
      correctIndex: 1,
      explanation: '正解は「より多くの制約を持つコンセプトを満たすオーバーロード関数が、コンパイラによって優先的に選択される」です！たとえば `EnemyUnit` よりも `FlyingEnemyUnit（EnemyUnit && 飛行能力）` の方が制約が厳しいため、飛行能力を持つ型を渡した場合は自動的に特化版関数が選択されます。'
    }
  ]
};
