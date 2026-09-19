import { Chapter } from '../../types/curriculum';

export const chapterM8: Chapter = {
  id: 20,
  slug: 'chapter-modern-8-modules',
  courseTrack: 'modern',
  courseChapterCode: 'M14',
  title: 'モダン第14章：【C++20】モジュール（Modules）完全移行ガイド',
  subtitle: '#include ヘッダ地獄・マクロ汚染からの脱却と超高速ビルド',
  badge: 'モダンC++ M14【C++20】：モジュール',
  gameVersion: 'v7_ecs_final',
  description: '1970年代のC言語誕生以来、C/C++プログラマは半世紀近くにわたり `#include` プリプロセッサという「単なるテキストコピペ」の仕組みに依存し続けてきました。その結果、ヘッダファイルの二重読み込みを防ぐインクルードガード、コンパイル順序による挙動の激変、Windows.h やサードパーティ製ライブラリが勝手に定義する凶悪なマクロ汚染（`#define min` / `max` など）、そして1行の変更で数十分待たされる巨大ビルド時間といった数々の苦痛を味わってきました。C++20 で導入された【モジュール（Modules）】は、これらすべての問題を根本解決する、C++史上最大の革命です。本章では、`export module` と `import` によるクリーンなモジュール境界設計、マクロの完全隔離、そしてバイナリ中間表現（BMI）による超高速ビルドの仕組みを徹底解説し、最新世代のC++アーキテクチャを完成させます。',
  prevChapterSlug: 'chapter-modern-7-ranges-views',
  nextChapterSlug: undefined,
  sections: [
    {
      id: 'sec-m8-include-hell',
      title: 'M8.1 なぜC++は半世紀もヘッダとマクロに苦しめられてきたのか？',
      leadText: '「#include は単なるテキストのコピペである」という根本的欠陥が、いかに現代の大規模開発を破壊してきたのかを解剖します。',
      dialogueBefore: [
        {
          id: 'dm8-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生……！プロジェクトが大きくなるにつれて、ビルド時間がどんどん長くなり、今や1回のフルビルドに15分もかかっています！しかも `<windows.h>` をインクルードしたら、`std::min` や `std::max` がマクロに破壊されて意味不明なコンパイルエラーが何十個も発生しました……！'
        },
        {
          id: 'dm8-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！それこそが全C++プログラマが50年間呪い続けてきた【#include ヘッダ地獄】と【マクロ汚染（Macro Leakage）】じゃ！`#include` という機能は、50年前に作られた「指定されたファイルの内容をその場に文字列としてベタ貼りする」だけの粗雑なプリプロセッサ命令に過ぎんのじゃ。'
        },
        {
          id: 'dm8-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'えっ！？ベタ貼りなんですか！？ということは、100個の .cpp ファイルが同じ `<vector>` をインクルードしていたら……？'
        },
        {
          id: 'dm8-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'その通りじゃ！何万行もあるヘッダファイルが100回もゼロからパース・構文解析される。これではビルドが終わらないのも当然じゃ。この50年の呪いを完全に断ち切るために誕生したのが、C++20 の【モジュール（Modules）】なのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '古典的 #include（テキスト置換・マクロ漏洩） vs C++20 モジュール（意味論的インポート）',
        cApproach: {
          title: '❌ 古典的設計：#include によるテキスト展開とマクロ汚染',
          code: `// Enemy.h: 悪意なきヘッダファイル
#pragma once
#include <windows.h> // 凶悪な #define max(a,b) が内部で定義される！
#include <vector>

class Enemy {
    int maxHp;
    void update() {
        // ⚠️ windows.h のマクロが std::max を不正にテキスト置換して構文崩壊！
        int val = std::max(10, 20); // コンパイルエラー！
    }
};
// さらに、このヘッダをインクルードしたすべての .cpp ファイルに
// windows.h の全マクロと型が勝手に漏洩して汚染が広がる！`,
          drawbacks: [
            'プリプロセッサによるテキストコピペのため、マクロ定義（#define）がインクルード順序によって他のファイルへ漏洩・汚染する',
            'ヘッダファイルをインクルードする順序が逆になるだけでコンパイル可否が変わる（順序依存性の悪夢）',
            '各 .cpp ファイルが同じヘッダを何百回も重複パースするため、コンパイル時間が破滅的に長くなる'
          ]
        },
        cppApproach: {
          title: '⭕ C++20 モジュール：完全隔離された export / import',
          code: `// 1. モジュール定義ファイル (Enemy.ixx または Enemy.cppm)
export module EnemyModule; // モジュール宣言

import <vector>; // 必要な標準ライブラリをインポート

// export をつけたシンボルだけが外部から見える！
export class Enemy {
public:
    void takeDamage(int dmg);
private:
    int hp_ = 100; // 内部実装は外部から一切隠蔽
};

// 2. 利用側
import EnemyModule; // 瞬時にインポート！

int main() {
    Enemy e;
    e.takeDamage(10);
    // マクロの漏洩は 100% ゼロ！インクルード順序の罠も完全消滅！
}`,
          benefits: [
            'モジュール内部で定義されたマクロや非公開シンボルは、外部に絶対に漏洩しない（完全なカプセル化）',
            'インポートの順序に一切依存しない（import A; import B; と import B; import A; は完全に同一）',
            'モジュールは一度コンパイルされてバイナリ中間表現（BMI）になるため、ビルド時間が最大で5倍〜10倍高速化される'
          ]
        },
        paradigmShiftNotes: '「プリプロセッサによる場当たり的な文字列置換」を完全脱却し、「コンパイラが言語レベルでモジュール境界とシンボルを統括する」本物のモジュール機構への到達です。'
      },
      codeFiles: [
        {
          filename: 'MathEngine.ixx',
          language: 'cpp',
          description: 'C++20 モジュール定義の構文（export module / export class）',
          code: `// C++20 モジュールインターフェース単位
export module MathEngine;

// 外部に公開したいシンボルに 'export' を付与
export struct Vector2D {
    float x;
    float y;

    Vector2D operator+(const Vector2D& other) const noexcept {
        return { x + other.x, y + other.y };
    }
};

export Vector2D makeVector(float x, float y) noexcept {
    return { x, y };
}

// ⚠️ export をつけない関数は「モジュール内部専用」となり、
// 外部から絶対に呼び出せない（真のカプセル化！）
float internalDistanceSquared(const Vector2D& v) noexcept {
    return v.x * v.x + v.y * v.y;
}`
        },
        {
          filename: 'MainApplication.cpp',
          language: 'cpp',
          description: 'C++20 モジュール利用側（import 構文）',
          code: `// メインアプリケーション
import MathEngine;
import <iostream>;

int main() {
    // MathEngine モジュールからエクスポートされた型と関数を利用
    Vector2D pos = makeVector(10.0f, 20.0f);
    Vector2D vel = makeVector(1.0f, 2.0f);
    Vector2D nextPos = pos + vel;

    std::cout << "次フレーム座標: (" << nextPos.x << ", " << nextPos.y << ")\\n";

    // internalDistanceSquared(nextPos); // コンパイルエラー！モジュール非公開シンボルなので呼べない！

    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm8-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: '素晴らしい！`#pragma once` も `#ifndef _HEADER_H_` も不要で、`export` をつけたものだけが綺麗に外から見えるんですね！非公開の関数が外部から絶対に呼べないのも安心感が半端ないです！'
        },
        {
          id: 'dm8-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！ヘッダファイル（.h）と実装ファイル（.cpp）の2重管理からも解放され、1つのモジュールファイルで完潔に宣言と実装を記述できるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m8-bmi-fast-build',
      title: 'M8.2 ビルド時間劇的短縮のメカニズム（BMI: Built Module Interface）',
      leadText: 'なぜモジュールを使うとビルド時間が1/5〜1/10に激減するのか？バイナリ中間表現の仕組みを学びます。',
      dialogueBefore: [
        {
          id: 'dm8-7',
          speaker: 'penguin',
          emotion: 'question',
          text: '先生、モジュールを使うとなぜそんなにコンパイルが速くなるんですか？'
        },
        {
          id: 'dm8-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！従来のヘッダは毎回字句解析と構文解析を行っておったが、モジュールは初回コンパイル時に【BMI（Built Module Interface: .ifc や .pcm）】という構文解析済みバイナリに変換されるのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'ModulePartitionExample.ixx',
          language: 'cpp',
          description: '大規模プロジェクトを分割するモジュールパーティション（Module Partition）',
          code: `// 大規模エンジンを小分けにするモジュールパーティションの構文

// 1. パーティション1: レンダラー (Engine:Render)
export module Engine:Render;
export void renderFrame() { /* 描画 */ }

// 2. パーティション2: 物理 (Engine:Physics)
export module Engine:Physics;
export void updatePhysics(float dt) { /* 物理演算 */ }

// 3. 主モジュールインターフェース: 全パーティションを集約して公開
export module Engine;
export import :Render;
export import :Physics;

// これにより、利用側は "import Engine;" と書くだけで
// 内部が分割された巨大エンジンを瞬時にインポートできる！`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm8-9',
          speaker: 'penguin',
          emotion: 'teaching',
          text: '構文解析結果がバイナリでキャッシュされるから、他のファイルがインポートするときはディスクから一瞬でロードできるんですね！'
        },
        {
          id: 'dm8-10',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通りじゃ！プロジェクトが何十万行に膨れ上がっても、モジュールの依存関係がクリーンに保たれていれば、ビルド時間は驚くほどスケールするのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m8-header-units-migration',
      title: 'M8.3 レガシーヘッダからモジュールへの移行（ヘッダユニット import <header>）',
      leadText: '既存の巨大なレガシーコード資産を一度に書き換えるのは不可能です。段階的にモジュール化する「ヘッダユニット」の活用法を学びます。',
      dialogueBefore: [
        {
          id: 'dm8-11',
          speaker: 'penguin',
          emotion: 'question',
          text: '先生、今ある会社の大規模なレガシーコードには何百個も .h ファイルがあるんですが、一晩で全部モジュールに書き換えるなんて不可能です……！'
        },
        {
          id: 'dm8-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ごもっともじゃ！そこで C++20 には既存のヘッダをそのままモジュールとしてインポートできる【ヘッダユニット（Header Units）】が用意されておるのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'HeaderUnitsMigration.cpp',
          language: 'cpp',
          description: '既存ヘッダを段階的に import するヘッダユニットの利用法',
          code: `// 従来の #include ではなく import <...> で既存ライブラリを取り込む
// これにより、既存ヘッダもモジュール同様に事前コンパイルされ高速化！
import <iostream>;
import <vector>;
import <string>;
import <memory>;

// 自作のレガシーヘッダもヘッダユニットとして安全にインポート可能
// import "LegacyMath.h";

int main() {
    std::vector<std::string> logMessages;
    logMessages.push_back("ヘッダユニットによる超高速コンパイル稼働中");

    for (const auto& msg : logMessages) {
        std::cout << "[System] " << msg << "\\n";
    }
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm8-13',
          speaker: 'penguin',
          emotion: 'happy',
          text: '`#include <vector>` を `import <vector>;` に変えるだけでも、マクロ汚染を防ぎながらビルドを高速化できるんですね！'
        },
        {
          id: 'dm8-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そうじゃ。新機能は段階的に導入するのがプロのエンジニアリングじゃ。まずは標準ライブラリの import から始め、新設モジュールを export していくのが定石じゃな！'
        }
      ]
    },
    {
      id: 'sec-m8-invader-integration',
      title: 'M8.4 インベーダー統合：自作ゲームエンジンのモジュール化と現代C++完結',
      leadText: '第1章の500行スパゲティコードから始まった旅が、C++20モジュールによって商用レベルの現代ゲームエンジンへと昇華します。',
      dialogueBefore: [
        {
          id: 'dm8-15',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ペンギン君、振り返ってみよ！あの第1章のグローバル変数だらけのスパゲティコードから、オブジェクト指向、RAII、デザインパターン、CRTP、独自メモリプール、固定デルタタイム、そしてコルーチン、コンセプト、Ranges、モジュールまで……君はC++の歴史と進化のすべてを踏破したのじゃ！'
        },
        {
          id: 'dm8-16',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'ベン先生、本当にありがとうございました！「なぜこの機能が必要なのか」「古い書き方の何が苦しかったのか」を身をもって体験したからこそ、モダンC++の設計思想が血肉となって身につきました！'
        }
      ],
      codeFiles: [
        {
          filename: 'ModernGameEngineArchitecture.cpp',
          language: 'cpp',
          description: 'C++20 モジュールと現代設計の粋を結集したゲームエンジン完成形アーキテクチャ',
          code: `// C++20 モダンゲームエンジン完成形骨格
// (実際のモジュール環境では export module ShirokumaGame; として定義)

#include <iostream>
#include <vector>
#include <string>
#include <concepts>
#include <ranges>

// コンセプトによる型制約
template <typename T>
concept UpdatableEntity = requires(T a, float dt) {
    a.update(dt);
    { a.isAlive() } -> std::same_as<bool>;
};

// ゲームエンティティ
class SpaceInvader {
public:
    SpaceInvader(std::string name, int hp) : name_(std::move(name)), hp_(hp) {}
    void update(float dt) { (void)dt; }
    bool isAlive() const { return hp_ > 0; }
    const std::string& getName() const { return name_; }
    int getHp() const { return hp_; }
private:
    std::string name_;
    int hp_;
};

// エンジンコア
class ModernInvaderEngine {
public:
    void addEntity(SpaceInvader entity) {
        entities_.push_back(std::move(entity));
    }

    void runFrame(float dt) {
        // C++20 Ranges パイプラインによる生存エンティティの高速フィルタリング
        auto aliveEntities = entities_ 
            | std::views::filter(&SpaceInvader::isAlive);

        for (auto& entity : aliveEntities) {
            entity.update(dt);
        }
    }

    void printStatus() const {
        std::cout << "=== Shirokuma Modern Engine 稼働ステータス ===\\n";
        for (const auto& e : entities_) {
            std::cout << "  機体: " << e.getName() << " (HP: " << e.getHp() << ")\\n";
        }
    }

private:
    std::vector<SpaceInvader> entities_;
};

int main() {
    ModernInvaderEngine engine;
    engine.addEntity(SpaceInvader("迎撃母艦シロクマ号", 1000));
    engine.addEntity(SpaceInvader("突撃ドローンA", 50));
    engine.addEntity(SpaceInvader("突撃ドローンB", 0)); // 撃破済み

    engine.runFrame(1.0f / 60.0f);
    engine.printStatus();

    std::cout << "\\n🎉 [CONGRATULATIONS] モダンC++コース（M1〜M8）全課程修了！\\n";
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '落とし穴1：モジュール内でのマクロのエクスポート不可能性',
          description: '`#define` で定義されたマクロはモジュールから export できません（これはバグではなく、マクロ汚染を防ぐための意図的な仕様です）。定数は `export constexpr`、型操作は `export template` や `concept`、関数は `export inline` を用いて、言語機能で表現してください。'
        },
        {
          title: '落とし穴2：ビルドシステム（CMake / Ninja / Visual Studio）の対応依存',
          description: 'C++20 モジュールはソースファイル間の「依存グラフ」をコンパイル前に走査してビルド順序を動的に決定する必要があります。CMake 3.28+、Ninja 1.11+、MSVC 19.34+ / Clang 16+ など、モジュールの自動スキャンに対応した最新ツールチェーンを使用してください。'
        },
        {
          title: '落とし穴3：循環インポート（Circular Module Dependency）の禁止',
          description: 'モジュールAがモジュールBを import し、モジュールBがモジュールAを import することは言語仕様で禁止されています。循環依存が発生した場合は、共通インターフェースを別のモジュールまたはモジュールパーティションへ切り出してください。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-m8-1',
      question: 'C++20 モジュールにおいて、シンボルをモジュール外部へ公開するために先頭に付与するキーワードはどれですか？',
      options: [
        'export',
        'public',
        'extern',
        'visible'
      ],
      correctIndex: 0,
      explanation: '正解は export です！モジュール宣言 `export module モジュール名;` の中で、外部へ公開したいクラス、関数、変数、コンセプトなどの宣言の先頭に `export` を付与します。export のついていないシンボルはモジュール内部専用として強力にカプセル化されます。'
    },
    {
      id: 'q-m8-2',
      question: '従来の `#include` と比較した、C++20 モジュールの「マクロ（#define）」に関する挙動の違いとして正しいものはどれですか？',
      options: [
        'モジュール内で定義されたマクロは、インポートしたファイルへ自動的にすべて漏洩・伝播する',
        'モジュール内で定義されたマクロは外部へ一切漏洩せず、インポート側を汚染することがない',
        'モジュールを使うと、C++プログラム内でマクロの使用が一切禁止される',
        'マクロは自動的に constexpr 変数へ自動変換される'
      ],
      correctIndex: 1,
      explanation: '正解は「モジュール内で定義されたマクロは外部へ一切漏洩せず、インポート側を汚染することがない」です！従来の #include では windows.h などのマクロが勝手に後続コードを破壊する事故が多発していましたが、モジュールではマクロが境界を越えて漏れることが原理的になくなりました。'
    },
    {
      id: 'q-m8-3',
      question: 'C++20 モジュールにおいて、大規模な単一モジュールを複数のファイルに分割して開発するための機能はどれですか？',
      options: [
        'モジュールパーティション（Module Partition）',
        'モジュールフラグメント（Module Fragment）',
        'マルチスレッドインクルード（Multi-thread Include）',
        'プリコンパイルヘッダ（PCH）'
      ],
      correctIndex: 0,
      explanation: '正解は「モジュールパーティション（Module Partition）」です！`export module Engine:Physics;` のようにコロン `:` を用いてサブ単位を定義し、主モジュールから集約してエクスポートすることで、巨大なモジュールを複数人で並行開発できます。'
    }
  ]
};
