import { Chapter } from '../../types/curriculum';

export const chapterModernLambda: Chapter = {
  id: 31,
  slug: 'chapter-modern-3-lambda',
  courseTrack: 'modern',
  courseChapterCode: 'M3',
  title: 'モダン第3章：【C++11/14】ラムダ式と関数オブジェクト完全マスター',
  subtitle: '関数ポインタの脱皮・キャプチャの落とし穴・std::function とジェネリックラムダ',
  badge: 'モダンC++ M3【C++11/14】：ラムダ式',
  gameVersion: 'v5_smart_pointers',
  description: 'C言語やレガシーC++03でコールバック関数を実現するには、「関数ポインタ」と「void* ユーザーデータ」を組み合わせるという、型安全性が脆弱で極めて書きづらい手法しかありませんでした。C++11で導入された【ラムダ式（無名関数）】は、関数のすぐそばに処理をインラインで記述できるだけでなく、周囲の変数を「キャプチャ（捕捉）」して状態を持つ関数オブジェクトを自動生成する革命的機能です。しかし、「参照キャプチャ（[&]）によるダングリング参照の未定義動作」や、「std::function のヒープ確保オーバーヘッド」など、現場のプロが最も警戒すべき落とし穴も存在します。本章では、値・参照・ムーブキャプチャ（C++14初期化キャプチャ）のメモリモデルから、C++14ジェネリックラムダ（auto引数）までを徹底解説し、最新のイベント駆動プログラミングの真髄を極めます。',
  prevChapterSlug: 'modern-2-move-and-modern-features',
  nextChapterSlug: 'chapter-modern-4-variadic-templates',
  sections: [
    {
      id: 'sec-m3-funcptr-to-lambda',
      title: 'M3.1 関数ポインタからの脱皮：なぜラムダ式が世界を変えたのか',
      leadText: 'レガシーな関数ポインタ（void* 渡し）の苦痛と、ラムダ式による劇的なコードの洗練を比較します。',
      dialogueBefore: [
        {
          id: 'dm3-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！「HPが30以下の敵だけを抽出して必殺技を当てる」処理を書くために、クラスの外に関数を1個定義して、関数ポインタを渡して…ってやっていたらコードがバラバラになって読むのが辛いです！'
        },
        {
          id: 'dm3-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそがC++03までの苦行じゃな！しかも「プレイヤーの現在レベル」などのローカル変数を使おうとすると、void* でポインタをキャストして渡さねばならず、型安全性も崩壊しておった。'
        },
        {
          id: 'dm3-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '呼び出したいその場に、サクッと使い捨ての関数を書くことはできないんですか？'
        },
        {
          id: 'dm3-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それこそがC++11最大の贈り物【ラムダ式（Lambda Expression）】じゃ！[](引数){ 処理 } と書くだけで、コンパイラが裏で自動的に高機能な関数オブジェクトクラスを生成してくれるのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'C言語/C++03 関数ポインタ vs C++11/14 ラムダ式',
        cApproach: {
          title: '❌ レガシー関数ポインタ ＋ void* ユーザーデータ渡し（型安全性の喪失）',
          code: `// コールバック関数をクラス外にわざわざ定義
bool isLowHpEnemy(const Enemy* e, void* userData) {
    int threshold = *reinterpret_cast<int*>(userData); // ⚠️ 危険なキャスト！
    return e->hp <= threshold;
}

// 呼び出し側
int threshold = 30;
findEnemy(enemies, isLowHpEnemy, &threshold); // 記述が遠く離れて散乱する`,
          drawbacks: [
            '少し条件を変えたいだけで、わざわざ別のグローバル/静的関数を定義しなければならない',
            '周囲のローカル変数を渡すために void* キャストが必要になり、型安全性が破壊される',
            'インライン展開されにくく、関数ポインタ経由の間接呼び出しコストが発生する'
          ]
        },
        cppApproach: {
          title: '⭕ C++11 ラムダ式（その場でインライン記述 ＆ 型安全なキャプチャ）',
          code: `int threshold = 30;

// その場に直接記述！周囲の threshold も安全にキャプチャ！
auto it = std::find_if(enemies.begin(), enemies.end(), [threshold](const Enemy& e) {
    return e.hp <= threshold;
}); // コンパイラによって完全にインライン最適化される！`,
          benefits: [
            '「呼び出す場所」にロジックが直接書けるため、コードの意図が一目瞭然になる',
            '周囲の変数を安全に型付きで捕捉（キャプチャ）できるため、void* は完全消滅',
            'コンパイラがラムダ式ごとに固有の型を生成するため、100%インライン展開が可能'
          ]
        },
        paradigmShiftNotes: 'ラムダ式は「構文糖衣（Syntax Sugar）」であり、コンパイラが裏で operator() を持つ独自の無名クラス（Functor）を自動生成しています。'
      }
    },
    {
      id: 'sec-m3-capture-memory',
      title: 'M3.2 キャプチャの深淵：値キャプチャ vs 参照キャプチャの落とし穴',
      leadText: '最も重大なクラッシュ原因「ダングリング参照」のメカニズムと、C++14初期化キャプチャ（ムーブ）を解説します。',
      dialogueBefore: [
        {
          id: 'dm3-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: '先生！非同期タスクや遅延コールバックで [&]（全参照キャプチャ）を使ったら、実行時にアクセスバイオレーションでゲームが落ちました！'
        },
        {
          id: 'dm3-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞラムダ式最大の落とし穴【ダングリング参照（Dangling Reference）】じゃ！ローカル変数がスタックから消滅した後に、その参照にアクセスしてしまったのじゃ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '値キャプチャ [x]：安全なコピー保持',
          description: '変数の現在の値をラムダ式オブジェクト内のメンバ変数にコピーして保持します。元の変数が破棄されても安全です。',
          impact: '非同期処理・遅延実行・UIコールバックでは値キャプチャが基本'
        },
        {
          stepNumber: 2,
          title: '参照キャプチャ [&x]：ゼロコストだが寿命に警戒',
          description: '変数のアドレス（参照）を内部で保持します。コピーが起きず元の変数を書き換えられますが、元の変数がスコープを抜けると即死します。',
          impact: 'std::find_if や std::sort など、その場で即座に同期実行されるアルゴリズム専用'
        },
        {
          stepNumber: 3,
          title: 'C++14 初期化キャプチャ [p = std::move(ptr)]：所有権のムーブ',
          description: 'std::unique_ptr などのコピー不可オブジェクトを、ラムダ式の内部メンバへと所有権ごとムーブ移動させます。',
          impact: 'スマートポインタを非同期タスクキューに渡す際の唯一の安全解'
        }
      ]
    },
    {
      id: 'sec-m3-function-vs-template',
      title: 'M3.3 実装編：std::function のコスト vs テンプレート受取のゼロコスト',
      leadText: 'コールバックを受け取る関数をどう設計すべきか？プロの現場での使い分けを実装します。',
      codeFiles: [
        {
          filename: 'LambdaPerformance.cpp',
          language: 'cpp',
          description: 'std::function による型消去とテンプレートによるゼロコストインライン化の比較',
          isMain: true,
          code: `#include <iostream>
#include <vector>
#include <functional>
#include <algorithm>

struct Enemy {
    int id;
    int hp;
    Enemy(int i, int h) : id(i), hp(h) {}
};

// 1. テンプレートによる受取（ゼロオーバーヘッド・インライン展開）
template <typename Predicate>
void filterEnemiesFast(const std::vector<Enemy>& enemies, Predicate pred) {
    for (size_t i = 0; i < enemies.size(); ++i) {
        if (pred(enemies[i])) {
            std::cout << "  [Fast] 該当敵ID: " << enemies[i].id << " (HP=" << enemies[i].hp << ")\\n";
        }
    }
}

// 2. std::function による受取（型消去・動的ポリモーフィズム・メンバ変数保存可能）
class EventDispatcher {
private:
    std::vector<std::function<void(int)> > listeners_;

public:
    void addListener(std::function<void(int)> callback) {
        listeners_.push_back(callback);
    }

    void dispatch(int damage) {
        for (size_t i = 0; i < listeners_.size(); ++i) {
            listeners_[i](damage);
        }
    }
};

int main() {
    std::vector<Enemy> enemies;
    enemies.push_back(Enemy(1, 20));
    enemies.push_back(Enemy(2, 50));
    enemies.push_back(Enemy(3, 15));

    int hpLimit = 25;

    std::cout << "=== テンプレート直接受取（アルゴリズム用） ===\\n";
    // ラムダ式を直接渡す（インライン展開される）
    filterEnemiesFast(enemies, [hpLimit](const Enemy& e) {
        return e.hp <= hpLimit;
    });

    std::cout << "\\n=== std::function 保存（イベントリスナー用） ===\\n";
    EventDispatcher dispatcher;
    int totalDamageTaken = 0;

    // C++14: 参照キャプチャによる累積
    dispatcher.addListener([&totalDamageTaken](int dmg) {
        totalDamageTaken += dmg;
        std::cout << "  💥 ダメージ被弾リスナーA: " << dmg << " (合計=" << totalDamageTaken << ")\\n";
    });

    dispatcher.addListener([](int dmg) {
        std::cout << "  🔊 サウンド再生リスナーB: 被弾効果音再生！\\n";
    });

    dispatcher.dispatch(30);
    dispatcher.dispatch(15);

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'ラムダ式の正体',
          description: 'コンパイラが自動生成する無名構造体（Functor）であり、キャプチャされた変数はメンバ変数として格納される。'
        },
        {
          title: '参照キャプチャの寿命管理',
          description: '非同期処理やイベントリスナーなど、関数を抜けた後も生き残るラムダには絶対にローカル変数の参照（[&]）を渡してはならない。'
        },
        {
          title: '受取方法の使い分け',
          description: 'その場で実行して終わる関数（アルゴリズム）はテンプレートで受けてゼロコストインライン化。クラス内に保持するリスナーは std::function を使う。'
        },
        {
          title: 'C++14 初期化キャプチャ',
          description: '[ptr = std::move(uptr)] により、コピー不可な unique_ptr もラムダ式内に安全に所有権を移行できる。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-m3-1',
      question: '関数を抜けた後に実行される非同期タスクやタイマーコールバックにラムダ式を渡す際、最も推奨されるキャプチャ方法はどれですか？',
      options: [
        'すべての変数を参照で取り込む [&]',
        '必要な変数を安全にコピー保持する「値キャプチャ [x]」または「初期化キャプチャ [x = std::move(y)]」',
        'キャプチャリストを空 [] にして、グローバル変数経由でやり取りする',
        '生ポインタを void* にキャストして渡す'
      ],
      correctIndex: 1,
      explanation: '関数スコープが終了するとローカル変数のスタックメモリは破棄されるため、参照キャプチャ（[&]）は即座にダングリング参照（未定義動作）になります。後から呼ばれるコールバックには値キャプチャまたはムーブキャプチャが必須です。'
    },
    {
      id: 'quiz-m3-2',
      question: '標準ライブラリの `std::function` と、テンプレートでラムダ式を受け取る設計の最大の違いは何ですか？',
      options: [
        'std::function はC++20以降でしか使えない',
        'std::function は型消去を行うためコンパイル後の関数を vector 等に格納できるが、テンプレート直接受取に比べて仮想関数呼び出し相当の間接コスト（および大きなキャプチャ時のヒープ確保）が発生する',
        'テンプレートで受けるとラムダ式の実行速度が10倍遅くなる',
        'std::function は引数を1つしか取ることができない'
      ],
      correctIndex: 1,
      explanation: 'テンプレート直接受取はラムダ固有の型をそのまま受け取るため100%インライン展開されますが型が一致しないと配列に保存できません。std::function は「シグネチャが同じならどんな関数・ラムダも代入できる（型消去）」柔軟性がありますが、仮想関数と同等の間接呼び出しコストを払います。'
    },
    {
      id: 'quiz-m3-3',
      question: 'C++14で導入された「ジェネリックラムダ」の書き方として正しいものはどれですか？',
      options: [
        'template <typename T> [](T x) { return x * 2; }',
        '[](auto x) { return x * 2; }',
        '[](generic x) { return x * 2; }',
        '[](var x) { return x * 2; }'
      ],
      correctIndex: 1,
      explanation: 'C++14ではラムダ式の引数に auto を指定できる「ジェネリックラムダ」がサポートされました。コンパイラは内部でメンバ関数テンプレート operator()<T>(T x) を生成します。'
    }
  ]
};
