import { Chapter } from '../../types/curriculum';

export const chapterM7: Chapter = {
  id: 19,
  slug: 'chapter-modern-7-ranges-views',
  courseTrack: 'modern',
  courseChapterCode: 'M13',
  title: 'モダン第13章：【C++20】Ranges & Views による関数型パイプライン',
  subtitle: 'ループを書かない！パイプ演算子（|）による遅延評価とゼロアロケーション',
  badge: 'モダンC++ M13【C++20】：Ranges',
  gameVersion: 'v7_ecs_final',
  description: 'ゲームプログラミングでは、「生きている敵の中から、HPが半分以下で、自機から100ピクセル以内にいる敵の上位3体を抽出し、ロックオンマーカーを付与する」といったコレクション走査・フィルタリング処理が毎フレーム無数に発生します。従来のC++では、これらを記述するためにネストしたfor文とif文の樹海を作るか、中間結果を一時的な `std::vector` にコピーしてメモリを浪費していました。C++20 で導入された【Rangesライブラリ】と【std::views】は、UNIXパイプラインのように演算子（`|`）で処理を連結し、要素が必要になった瞬間にのみ計算を行う【遅延評価（Lazy Evaluation）】を提供します。本章では、一時メモリ割り当てを完全にゼロにし、可読性と実行速度を両立する新世代の関数型データパイプラインをマスターします。',
  prevChapterSlug: 'chapter-modern-5-coroutines',
  nextChapterSlug: 'chapter-modern-8-modules',
  sections: [
    {
      id: 'sec-m7-nested-loop-hell',
      title: 'M7.1 ネストしたfor/if文の森 vs エレガントなパイプライン演算子',
      leadText: '条件分岐が何重にも重なった敵リストの探索コードを、たった1行の美しいパイプラインへと昇華させます。',
      dialogueBefore: [
        {
          id: 'dm7-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！自機の自動ロックオンレーダーを作ったんですが、for ループの中に if 文が4重にネストして、コードの右端が見えなくなってしまいました……！一時保存用の `std::vector<Enemy*> targetList` を毎フレーム new しているせいで、ヒープの負荷も気になります。'
        },
        {
          id: 'dm7-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！典型的な「手続き型コレクション走査の罠」じゃな！一時配列を作ればアロケーションで重くなり、作らなければインデントの深いスパゲティコードになる。'
        },
        {
          id: 'dm7-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'C++でも関数型言語やLINQ（C#）のように、`filter` や `map` を綺麗に繋げて書くことはできないんでしょうか？'
        },
        {
          id: 'dm7-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それがC++20でついに標準化された【std::ranges & views】じゃ！パイプ演算子 `|` で繋ぐだけで、一時 vector を1バイトも作らず、極めて直感的にコレクションを変換できるのじゃぞ！'
        }
      ],
      paradigmComparison: {
        title: '古典的for/ifループ（中間vector確保） vs C++20 Ranges パイプライン（ゼロ確保）',
        cApproach: {
          title: '❌ 古典的設計：4重ネストと無駄な一時vector生成',
          code: `// 生存中かつHP50%以下、かつ距離100以内の敵上位3体を抽出
std::vector<Enemy> candidates;
for (const auto& enemy : allEnemies) {
    if (enemy.isAlive) {
        if (enemy.hp <= enemy.maxHp * 0.5f) {
            float dist = calcDistance(playerPos, enemy.pos);
            if (dist <= 100.0f) {
                candidates.push_back(enemy); // ヒープ割り当て発生！
            }
        }
    }
}
std::sort(candidates.begin(), candidates.end(), compareDistance);
if (candidates.size() > 3) candidates.resize(3);`,
          drawbacks: [
            'for文とif文のネストが深く、何を行っている処理なのか一目で把握できない',
            '途中の条件に合致したオブジェクトを一時 vector にコピーするため、毎フレーム無駄なヒープ確保と解放が走る',
            '全件を走査・ソートした後に切り詰めるため、計算量が無駄に多い'
          ]
        },
        cppApproach: {
          title: '⭕ C++20 Ranges：パイプ演算子による遅延評価パイプライン',
          code: `// パイプラインで流れるように宣言的記述！一時メモリ確保はゼロ！
auto targetView = allEnemies 
    | std::views::filter([](const auto& e) { return e.isAlive; })
    | std::views::filter([](const auto& e) { return e.hp <= e.maxHp * 0.5f; })
    | std::views::filter([&](const auto& e) { return calcDistance(playerPos, e.pos) <= 100.0f; })
    | std::views::take(3); // 先頭3件だけを取り出す

// 必要な時にだけループで評価（遅延評価）
for (const auto& target : targetView) {
    lockOn(target);
}`,
          benefits: [
            '「生存判定 → HP判定 → 距離判定 → 3件取得」という思考の順序のまま一直線に記述できる',
            '中間配列（vector）を一切生成しないため、メモリ使用量とアロケーションコストが完全ゼロ（0バイト）',
            '遅延評価（Lazy Evaluation）のため、take(3) を満たした時点で余計な要素の計算を自動で打ち切る'
          ]
        },
        paradigmShiftNotes: '「データを配列に詰めてから次の処理へ渡す」中間コピー設計から、「データの通り道にフィルターのパイプを繋ぎ、オンデマンドで吸い上げる」ゼロコピー設計への革新です。'
      },
      codeFiles: [
        {
          filename: 'RangesPipelineBasic.cpp',
          language: 'cpp',
          description: 'C++20 Ranges & Views の基本パイプライン構文',
          code: `#include <iostream>
#include <vector>
#include <ranges>
#include <string>

struct Invader {
    std::string name;
    int hp;
    bool isBoss;
};

int main() {
    std::vector<Invader> armada = {
        {"雑魚A", 10, false},
        {"強撃エリート", 80, false},
        {"巨大母艦", 500, true},
        {"雑魚B", 15, false},
        {"重装甲中ボス", 250, true}
    };

    std::cout << "--- 高耐久ボスクラスの敵（HP >= 100）上位2体を抽出 ---\\n";

    // パイプライン演算子 | で流れるように変換
    auto bossTargets = armada 
        | std::views::filter([](const Invader& inv) { return inv.hp >= 100; })
        | std::views::take(2)
        | std::views::transform([](const Invader& inv) { return "🚨 迎撃対象: " + inv.name + " (HP: " + std::to_string(inv.hp) + ")"; });

    // この for ループが回る瞬間まで、実際のフィルタリングは実行されない（遅延評価）！
    for (const auto& msg : bossTargets) {
        std::cout << msg << "\\n";
    }

    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm7-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: '美しい……！`armada | filter | take | transform` と繋ぐだけで、読みやすさが段違いです！しかも vector の一時コピーが一切発生していないなんて信じられません！'
        },
        {
          id: 'dm7-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そうじゃ！`std::views` はイテレータのラッパーに過ぎん。オブジェクトを保持するのではなく、「どう走査するか」というルールだけを保持しているから、メモリも時間も一切無駄遣いしないのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m7-lazy-evaluation',
      title: 'M7.2 遅延評価（Lazy Evaluation）とメモリゼロの秘密',
      leadText: 'なぜ Views は巨大な配列を扱っても高速なのか？要素を要求された瞬間にのみ計算する「遅延評価」のメカニズムを解き明かします。',
      dialogueBefore: [
        {
          id: 'dm7-7',
          speaker: 'penguin',
          emotion: 'question',
          text: 'もし敵が10,000体いたとして、`views::filter` を3回重ねたら、10,000回×3回のループが回ってしまうんじゃないですか？'
        },
        {
          id: 'dm7-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！そこが遅延評価の素晴らしいところじゃ！各フィルターは一括実行されるのではなく、1つの要素に対して filter1 → filter2 → filter3 と通過させ、OKなら即座に呼び出し元に届けるのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'LazyEvaluationProof.cpp',
          language: 'cpp',
          description: '遅延評価の動作検証：計算がいつ行われているかをログで追跡',
          code: `#include <iostream>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    std::cout << "1. パイプライン定義（ここでは一切処理は走りません）\\n";
    auto pipeline = numbers
        | std::views::filter([](int n) {
            std::cout << "  [Filter] " << n << " は偶数か？\\n";
            return n % 2 == 0;
        })
        | std::views::transform([](int n) {
            std::cout << "  [Transform] " << n << " を10倍に変換\\n";
            return n * 10;
        })
        | std::views::take(2); // 最初の2つが取れたら即終了

    std::cout << "\\n2. ループ開始（ここで初めてオンデマンドに評価される）\\n";
    for (int val : pipeline) {
        std::cout << "==> 受け取った値: " << val << "\\n\\n";
    }

    std::cout << "3. ループ終了（5以降の数字は一度も判定すらされていない！）\\n";
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm7-9',
          speaker: 'penguin',
          emotion: 'teaching',
          text: 'ログを見て鳥肌が立ちました！`take(2)` で2つ目の偶数（4）が見つかった瞬間に全体の評価がピタッと止まり、5〜10の要素は一度も filter にすら入っていません！'
        },
        {
          id: 'dm7-10',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'まさに最小限の労力で最大の結果を出すプロの技じゃ。無限の敵ウェーブ列であっても、必要な分だけを先頭から安全に切り取れるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m7-range-algorithms',
      title: 'M7.3 イテレータペアの追放：std::ranges アルゴリズムと射影（Projection）',
      leadText: '`std::sort(v.begin(), v.end())` と2度書く苦行にさようなら。コンテナを直接渡し、射影でメンバ変数を直感指定するモダン記法を習得します。',
      dialogueBefore: [
        {
          id: 'dm7-11',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '`std::sort(enemies.begin(), enemies.end(), [](auto& a, auto& b){ return a.score < b.score; });` って書くたびに、`begin()` と `end()` を打ち間違えたり、比較ラムダが長くなってうんざりしていました。'
        },
        {
          id: 'dm7-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！C++20 からは `std::ranges::sort(enemies, {}, &Enemy::score);` と書くだけでよいのじゃ！コンテナ全体をそのまま渡せる上に、【射影（Projection）】でメンバ変数ポインタを指定できるのじゃぞ！'
        }
      ],
      codeFiles: [
        {
          filename: 'RangesProjection.cpp',
          language: 'cpp',
          description: 'std::ranges アルゴリズムと射影（Projection）による極限の簡潔化',
          code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct StarShip {
    std::string name;
    int speed;
    int firepower;
};

int main() {
    std::vector<StarShip> fleet = {
        {"巡洋艦アルファ", 300, 80},
        {"高速迎撃機ベータ", 850, 45},
        {"超弩級戦艦ガンマ", 150, 300},
        {"偵察機デルタ", 920, 20}
    };

    // 1. C++20: コンテナを直接渡して、speed の昇順にソート！
    // 第3引数にメンバ変数ポインタ &StarShip::speed を指定（射影）
    std::ranges::sort(fleet, {}, &StarShip::speed);

    std::cout << "--- 速度順ソート結果 ---\\n";
    for (const auto& ship : fleet) {
        std::cout << ship.name << " (速度: " << ship.speed << ")\\n";
    }

    // 2. 火力 100 以上の船が存在するか判定
    bool hasCapitalShip = std::ranges::any_of(fleet, [](int p) { return p >= 100; }, &StarShip::firepower);
    std::cout << "\\n戦艦（火力>=100）配備確認: " << (hasCapitalShip ? "YES" : "NO") << "\\n";

    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm7-13',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'ラムダ式で `a.speed < b.speed` と書く必要すらなく、`&StarShip::speed` と書くだけでソートできるんですね！コード量が半分以下になりました！'
        },
        {
          id: 'dm7-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '射影は比較関数と抽出処理を綺麗に分離する強力なパラダイムじゃ。コードが意図そのものを語るようになるぞ！'
        }
      ]
    },
    {
      id: 'sec-m7-invader-integration',
      title: 'M7.4 インベーダー統合：索敵レーダー・ターゲット選定の1行パイプライン化',
      leadText: '全敵インベーダーの群れから、優先迎撃目標を自動選定してミサイルを誘導するシステムを完成させます。',
      dialogueBefore: [
        {
          id: 'dm7-15',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'さあペンギン君！インベーダーの防空レーダーシステムに、この美しい Ranges パイプラインを組み込むのじゃ！'
        },
        {
          id: 'dm7-16',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'はい！最前線にいる危険な敵を、ゼロアロケーションで瞬時に特定してみせます！'
        }
      ],
      codeFiles: [
        {
          filename: 'RadarTargetingSystem.cpp',
          language: 'cpp',
          description: 'C++20 Ranges を活用したリアルタイム自動ターゲティングシステム',
          code: `#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>
#include <cmath>

struct Target {
    int id;
    float x, y;
    int threatLevel; // 脅威度 (1〜5)
    bool isAlive;
};

int main() {
    std::vector<Target> radarContacts = {
        {1, 100.0f, 400.0f, 2, true},
        {2, 300.0f, 150.0f, 5, true},   // 最重要ターゲット（脅威度5、自機に近い）
        {3, 200.0f, 50.0f,  1, false},  // 撃破済み
        {4, 250.0f, 200.0f, 4, true},
        {5, 500.0f, 800.0f, 3, true}    // 画面外の遠方
    };

    const float PLAYER_Y = 100.0f;

    std::cout << "=== 防空レーダー：迎撃優先ターゲット走査 ===\\n";

    // 生存中 かつ Y座標が防衛ライン（300未満）に接近している脅威度3以上の敵
    auto priorityQueue = radarContacts
        | std::views::filter([](const Target& t) { return t.isAlive; })
        | std::views::filter([](const Target& t) { return t.threatLevel >= 3; })
        | std::views::filter([PLAYER_Y](const Target& t) { return std::abs(t.y - PLAYER_Y) <= 200.0f; });

    for (const auto& target : priorityQueue) {
        std::cout << "🎯 [LOCK-ON] 敵ID: " << target.id 
                  << " (脅威度: " << target.threatLevel 
                  << ", Y座標: " << target.y << ") に迎撃ミサイル発射！\\n";
    }

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '落とし穴1：一時オブジェクト（rvalue）への View によるダングリング参照',
          description: '関数から返された一時 vector に対して `getEnemies() | std::views::filter(...)` とパイプを繋ぎ、その view を変数に保存すると、一時 vector が式終了時に破棄され、view の内部イテレータが死んだメモリを指す（ダングリング参照）事故が発生します。View の元のコンテナは、View が使われている間必ず生存していなければなりません。'
        },
        {
          title: '落とし穴2：副作用を持つラムダ式を Views に渡す危険性',
          description: 'Views は遅延評価されるため、イテレーションの順序や回数（複数回走査されるなど）が保証されません。`std::views::filter` や `transform` の中でグローバル変数を書き換えたり画面出力を行ったりする副作用のあるコードを書くと、予測不能なバグを引き起こします。'
        },
        {
          title: '落とし穴3：パイプライン内での重い再計算の繰り返し',
          description: '遅延評価される View を何度も走査する場合、同じ計算が要素アクセスごとに再実行されます。計算結果を何度も参照する場合は、終端で `std::ranges::to<std::vector>()`（C++23）などを用いてコンテナに一度固定化することを検討してください。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-m7-1',
      question: 'C++20 Ranges & Views において、パイプライン演算子（|）を使ってビューを合成した際、メモリ確保が行われるタイミングはいつですか？',
      options: [
        'パイプライン演算子（|）を記述した瞬間に全データ分のメモリが一括確保される',
        '原則としてヒープメモリ確保は一切行われず（0バイト）、要素が必要になった瞬間にイテレータ経由で遅延評価される',
        'プログラム起動時にスタック領域に事前確保される',
        'OSの仮想記憶スワップファイルに自動的に書き込まれる'
      ],
      correctIndex: 1,
      explanation: '正解は「原則としてヒープメモリ確保は一切行われず、要素が必要になった瞬間にイテレータ経由で遅延評価される」です！std::views は元のコンテナの走査アルゴリズムを保持する軽量ラッパーに過ぎないため、中間コンテナのコピーやヒープアロケーションをゼロに抑えることができます。'
    },
    {
      id: 'q-m7-2',
      question: '`std::views::take(N)` の最大のパフォーマンス上のメリットは何ですか？',
      options: [
        'すべての要素をコンパイル時定数（constexpr）に変換する',
        '先頭から N 個の条件合致要素を取り出した時点で走査を即時中断し、残りの不要な要素の計算を完全にスキップできる',
        '自動的にマルチスレッドの OpenMP 並列化が行われる',
        '要素のサイズを自動的に半分に圧縮する'
      ],
      correctIndex: 1,
      explanation: '正解は「先頭から N 個の条件合致要素を取り出した時点で走査を即時中断し、残りの不要な要素の計算を完全にスキップできる」です！従来のループ＋全件ソートに比べ、遅延評価と take を組み合わせることで、無駄な計算を一切行わずに必要な分だけを即座に取得できます。'
    },
    {
      id: 'q-m7-3',
      question: 'C++20 `std::ranges::sort` において、ソート基準となるメンバ変数をラムダ式なしで指定できる機能の名称は何ですか？',
      options: [
        '射影（Projection）',
        'リフレクション（Reflection）',
        'インターセプター（Interceptor）',
        'ディスパッチャ（Dispatcher）'
      ],
      correctIndex: 0,
      explanation: '正解は「射影（Projection）」です！アルゴリズムにメンバ変数ポインタ（例: `&Enemy::score`）やプロジェクション関数を渡すことで、要素から比較対象の値を自動抽出し、極めて簡潔かつ型安全に処理を記述できます。'
    }
  ]
};
