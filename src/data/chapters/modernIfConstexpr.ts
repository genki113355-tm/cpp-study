import { Chapter } from '../../types/curriculum';

export const chapterModernIfConstexpr: Chapter = {
  id: 35,
  slug: 'chapter-modern-8-if-constexpr',
  courseTrack: 'modern',
  courseChapterCode: 'M8',
  title: 'モダン第8章：【C++17】テンプレート革命：if constexpr と構造化束縛',
  subtitle: 'SFINAE（enable_if）の魔術を葬り去るコンパイル時分岐とタプル展開・フォールド式',
  badge: 'モダンC++ M8【C++17】：if constexpr・構造化束縛',
  gameVersion: 'v5_smart_pointers',
  description: 'C++14までのテンプレートメタプログラミングにおいて、型の種類（整数型・ポインタ型・浮動小数点数など）に応じて処理を分岐させるには、SFINAE（Substitution Failure Is Not An Error）の原理を利用した std::enable_if を何重にも書き連ねる必要がありました。そのコードは解読困難で、コンパイルエラーが出れば画面を覆い尽くす暗号のようなエラーログに開発者は絶望していました。C++17で導入された【if constexpr】は、コンパイル時に条件が偽のブランチを完全に捨て去る（コード生成すらしない）ことで、普通の if 文と同じ直感的な書き方で型分岐を実現する歴史的転換点となりました。さらに、構造体やペアを1行で分解代入する【構造化束縛（Structured Bindings）】、可変引数テンプレートの展開を1行で記述する【フォールド式（Fold Expressions）】、そしてスコープ汚染を防ぐ【初期化文付き if】を組み合わせ、C++のメタプログラミングとデータ走査は劇的なエレガンスを手に入れました。',
  prevChapterSlug: 'chapter-modern-4-modern-type-system',
  nextChapterSlug: 'chapter-modern-9-filesystem',
  sections: [
    {
      id: 'sec-m8-sfinae-hell',
      title: 'M8.1 SFINAE（std::enable_if）の悪夢とコンパイル時 if の夜明け',
      leadText: '難解を極めたC++11/14のテンプレート型分岐手法と、if constexpr がもたらした革命的シンプルさを比較します。',
      dialogueBefore: [
        {
          id: 'dm8-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！「整数型ならビットシフトで高速化し、ポインタ型なら中身を逆参照し、浮動小数点なら通常計算する」という汎用関数を書こうとしたんですが、std::enable_if の構文が難しすぎてコンパイルが通りません……！エラーが100行出ました！'
        },
        {
          id: 'dm8-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！SFINAE（置換失敗はエラーにあらず）の黒魔術じゃな！オーバーロードの解決順序やテンプレート特殊化を駆使して、コンパイラを騙すように書く技法じゃ。世界中のプロがこれで何千時間も浪費してきたのじゃ。'
        },
        {
          id: 'dm8-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '「普通の if 文」で「もし T が整数ならこれ、そうでないならこれ」と書くことはできないんですか？'
        },
        {
          id: 'dm8-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それこそが C++17 で導入された【if constexpr】じゃ！条件式がコンパイル時に評価され、合致しない方のブランチはコンパイラが綺麗サッパリ消滅させてくれる。普通の if 文と同じ感覚でメタプログラミングができるのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'C++14 SFINAE (enable_if) vs C++17 if constexpr',
        cApproach: {
          title: '❌ C++11/14 SFINAE（std::enable_if_t による難解なオーバーロード）',
          code: `#include <type_traits>

// 整数型向けのオーバーロード
template <typename T, std::enable_if_t<std::is_integral_v<T>, int> = 0>
void processValue(T val) {
    // 整数特化処理
}

// 浮動小数点型向けのオーバーロード
template <typename T, std::enable_if_t<std::is_floating_point_v<T>, int> = 0>
void processValue(T val) {
    // 浮動小数点特化処理
}

// ポインタ型向けのオーバーロード
template <typename T, std::enable_if_t<std::is_pointer_v<T>, int> = 0>
void processValue(T val) {
    // ポインタ特化処理
}`,
          drawbacks: [
            '関数シグネチャが std::enable_if の奇怪な型パズルで埋め尽くされ、可読性が皆無',
            '分岐を1つ増やすたびに新しいテンプレート関数のオーバーロードを定義しなければならない',
            '条件の重複や抜けがあると、長大で難解なコンパイルエラーが発生してデバッグ不能に'
          ]
        },
        cppApproach: {
          title: '✨ C++17 if constexpr （1つの関数内に直感的に記述）',
          code: `#include <type_traits>

template <typename T>
void processValue(T val) {
    if constexpr (std::is_integral_v<T>) {
        // 整数型の場合のみコンパイル（ポインタ演算コードは構文検査のみで破棄）
    } else if constexpr (std::is_floating_point_v<T>) {
        // 浮動小数点型の場合のみコンパイル
    } else if constexpr (std::is_pointer_v<T>) {
        // ポインタ型の場合のみコンパイル
    } else {
        // それ以外の型
    }
}`,
          benefits: [
            '関数はたった1つ！通常の if-else 文と同じ見通しの良さで型分岐を記述可能',
            '偽となったブランチはコンパイル対象から完全に除外されるため、型不適合コードがあってもエラーにならない',
            'メタプログラミングの学習コストと保守コストが劇的に低下'
          ]
        },
        paradigmShiftNotes: 'if constexpr により、不適合ブランチは破棄された文（Discarded Statement）となり、コンパイラはコード生成を行いません。普通のif文と同じ直感性でメタプログラミングが書けます。'
      }
    },
    {
      id: 'sec-m8-structured-bindings',
      title: 'M8.2 構造化束縛（Structured Bindings）：タプル・構造体・ペアの分解代入',
      leadText: 'auto [a, b, c] による直感的な複数値受け取りと、マップ走査の劇的な簡素化をマスターします。',
      dialogueBefore: [
        {
          id: 'dm8-5',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'std::map で敵のリストをループするとき、いつも「it->first」とか「it->second」って書くのが直感的じゃなくて大嫌いでした。「敵ID」と「敵データ」って名前で直接受け取りたいです！'
        },
        {
          id: 'dm8-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉ！C++17の【構造化束縛（Structured Bindings）】を使えば、`for (const auto& [id, enemy] : enemyMap)` と書くだけで一発解決じゃ！'
        },
        {
          id: 'dm8-7',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'おおっ！JavaScript や Python の分割代入（Destructuring）みたいですね！'
        },
        {
          id: 'dm8-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そうじゃ！しかもC++の構造化束縛は、値コピーだけでなく【参照（auto&）】でも受け取れるから、重いオブジェクトのコピーもゼロじゃぞ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '値受け取り：auto [x, y]',
          description: 'タプルや構造体の各メンバをコピーして新しいローカル変数を作ります。基本型（int, float）に最適です。',
          impact: '座標やフラグなどの軽量値の受け取り'
        },
        {
          stepNumber: 2,
          title: '参照受け取り：auto& [x, y]',
          description: '元のオブジェクトのメンバへの別名（エイリアス）を作成します。ループ内で中身を直接書き換えたい場合に必須です。',
          impact: 'ゲームエンティティの更新ループ'
        },
        {
          stepNumber: 3,
          title: 'const参照受け取り：const auto& [x, y]',
          description: 'コピーを発生させず、読み取り専用でアクセスする最も安全なデフォルトの選択肢です。',
          impact: '巨大マップやコンテナのゼロコピー安全走査'
        }
      ]
    },
    {
      id: 'sec-m8-if-with-initializer-and-fold',
      title: 'M8.3 実務の隠れた主役：初期化文付き if とフォールド式（Fold Expressions）',
      leadText: 'スコープ汚染を完全防止する if with initializer と、可変引数テンプレートを1行に凝縮するフォールド式を学びます。',
      dialogueBefore: [
        {
          id: 'dm8-9',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '先生！マップから要素を探すとき、「auto it = map.find(key); if (it != map.end())」って書くと、if 文の外側にも it 変数が生き残ってスコープが汚れるのが嫌でした。'
        },
        {
          id: 'dm8-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！そこで【初期化文付き if (if with initializer)】の出番じゃ！`if (auto it = map.find(key); it != map.end())` と書けば、it の寿命は if ブロックの中だけに限定される！'
        },
        {
          id: 'dm8-11',
          speaker: 'penguin',
          emotion: 'question',
          text: '第4章（M4）で習った可変引数テンプレート（Args...）の展開も、もっと簡単に書けるようになったと聞きました！'
        },
        {
          id: 'dm8-12',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それがC++17の【フォールド式（Fold Expressions）】じゃ！M4では再帰関数やダミー配列トリックを使って展開しておったが、C++17なら `(... + args)` と書くだけで全引数の合計や出力が1行で書けるのじゃ！'
        }
      ],
      takeaways: [
        {
          title: '初期化文付き if / switch',
          description: '`if (auto it = map.find(key); it != map.end())` のように条件判定直前に変数をスコープ限定宣言し、スコープ汚染を防止。'
        },
        {
          title: 'フォールド式（Fold Expressions）',
          description: '`(... + args)` や `((std::cout << args << " "), ...)` のように、可変引数パラメータパックを再帰なしで1行で展開可能。'
        }
      ]
    },
    {
      id: 'sec-m8-game-event-dispatcher',
      title: 'M8.4 実戦：ゲーム内汎用イベントディスパッチャとパケットデコーダ',
      leadText: 'if constexpr と構造化束縛を融合させ、型安全かつ超高速なゲームイベントバスを構築します。',
      dialogueBefore: [
        {
          id: 'dm8-13',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'シロクマ先生！ダメージイベント、スコア加算イベント、アイテム取得イベントを全部1つの汎用ディスパッチャに集約して、if constexpr で型安全に振り分けてみます！'
        },
        {
          id: 'dm8-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '見事じゃ！仮想関数テーブル（vtable）のオーバーヘッドもキャストの危険も完全ゼロで、コンパイル時に最高速のコードへと展開されるぞ！'
        }
      ],
      codeFiles: [
        {
          filename: 'EventDispatcher.cpp',
          language: 'cpp',
          description: 'if constexpr と構造化束縛によるゼロオーバーヘッド・イベントバス',
          isMain: true,
          code: `#include <iostream>
#include <string>

// イベント定義
struct DamageEvent {
    int targetId;
    int amount;
    bool isCritical;
};

struct ScoreEvent {
    std::string reason;
    int points;
};

// 汎用イベントディスパッチャ
class GameEventDispatcher {
public:
    template <typename TEvent>
    void dispatch(const TEvent& event) {
        if constexpr (std::is_same_v<TEvent, DamageEvent>) {
            // 構造化束縛でイベント中身を展開
            const auto& [target, dmg, crit] = event;
            std::cout << "⚔️ ダメージ適用: 対象=" << target 
                      << ", ダメージ=" << dmg 
                      << (crit ? " [CRITICAL!]" : "") << "\\n";
        } 
        else if constexpr (std::is_same_v<TEvent, ScoreEvent>) {
            const auto& [reason, pts] = event;
            std::cout << "⭐ スコア獲得: " << reason << " (+" << pts << " pts)\\n";
        } 
        else {
            static_assert(!sizeof(TEvent), "未対応のイベント型が送信されました！");
        }
    }
};

int main() {
    std::cout << "--- M8 イベントディスパッチシステム ---" << std::endl;
    GameEventDispatcher bus;

    // ダメージイベント送信
    bus.dispatch(DamageEvent{1, 150, true});

    // スコアイベント送信
    bus.dispatch(ScoreEvent{"インベーダー撃破", 300});

    return 0;
}`,
          highlightLines: [18, 20, 26, 30]
        }
      ]
    }
  ]
};
