import { Chapter } from '../../types/curriculum';

export const chapterM4: Chapter = {
  id: 10,
  slug: 'chapter-modern-4-modern-type-system',
  courseTrack: 'modern',
  courseChapterCode: 'M7',
  title: 'モダン第7章：【C++17】現代的型システムとゼロオーバーヘッド抽象化',
  subtitle: 'std::optional, std::variant, constexpr による極限の型安全性と超高速ディスパッチ',
  badge: 'モダンC++ M7【C++17】：現代的型システム',
  gameVersion: 'v7_ecs_final',
  description: 'C++03までの旧来設計では、「値が存在しない」ことを表すためにNULLポインタやマジックナンバー（-1など）を返し、実行時クラッシュの原因となっていました。また、多様なアイテムや敵の種別分岐には重いRTTI（dynamic_cast）や巨大なswitch文が使われていました。C++17で導入された std::optional（値の有無の型安全表現）、std::variant + std::visit（仮想関数テーブル不要の超高速パターンマッチング）、そしてコンパイル時計算の constexpr を活用し、安全かつ極限まで高速な新世代のゲームアーキテクチャを構築します。',
  sections: [
    {
      id: 'sec-m4-optional',
      title: 'M4.1 ヌルポインタクラッシュを撲滅する std::optional',
      leadText: '「ポインタがNULLかどうかのチェック忘れ」による実行時強制終了に終止符！戻り値に「値が存在しない可能性」を型として明示するモダンC++の標準規律を学びます。',
      dialogueBefore: [
        {
          id: 'dm4-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！自機の自動追尾レーダーで「最も近い敵」を探す関数を作ったんですが、画面上に敵が1体もいない時に NULL ポインタを返したら、呼び出し側でチェックを忘れて即座にぬるぽ（NullPointerException）でゲームが落ちました……！'
        },
        {
          id: 'dm4-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！ゲーム開発者の登竜門【NULLポインタ事故】じゃな！C言語や古典C++では「値がない」ことを表すためにポインタを使わざるを得ず、呼び出し側がNULLチェックを強制されないのが最大の欠陥じゃった。'
        },
        {
          id: 'dm4-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '「ポインタじゃない普通のオブジェクト」を返そうとすると、敵がいない時に何を返せばいいか困るんですよね。ダミーの座標（-9999, -9999）を返すのもバグのもとですし……。'
        },
        {
          id: 'dm4-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そこでC++17の至宝【std::optional<T>】じゃ！「値があるかもしれないし、空っぽかもしれない」という状態そのものを型として明示し、ヒープアロケーションなしで安全に取り出せる優れものなんじゃぞ！'
        }
      ],
      paradigmComparison: {
        title: '古典C++（NULLポインタ / マジックナンバー） vs モダンC++（std::optional）',
        cApproach: {
          title: '古典C++：生ポインタを返し、NULLチェックを呼び出し側に祈る設計',
          code: `// 最も近い敵を探す関数（敵がいない場合は NULL を返す）
Enemy* findNearestEnemy(const Vec2& playerPos, std::vector<Enemy>& enemies) {
    if (enemies.empty()) return NULL; // ← ポインタを返すためヒープか生存管理が必要
    // 探索処理...
    return &enemies[0];
}

// 呼び出し側：チェックを忘れると即座に未定義動作・クラッシュ！
Enemy* target = findNearestEnemy(player.getPos(), enemies);
// もし target == NULL だった場合、次の行で大惨事に！
target->takeDamage(10); // CRASH!! (SIGSEGV)`,
          drawbacks: [
            '関数のシグネチャを見ただけでは「NULLが返る可能性があるかどうか」が分からない',
            '「ポインタを返されたが、このポインタは誰が delete すべきなのか？」という寿命の曖昧さが発生',
            'チェック忘れをコンパイラが警告・検知できないため、実行時クラッシュが頻発する'
          ]
        },
        cppApproach: {
          title: 'モダンC++：std::optional で値の不在を型レベルで明示',
          code: `#include <optional>

// 戻り値の型が「存在するかもしれないし空かもしれない」ことを完全保証！
std::optional<Enemy> findNearestEnemy(const Vec2& playerPos, const std::vector<Enemy>& enemies) {
    if (enemies.empty()) {
        return std::nullopt; // 空っぽであることを明示
    }
    // 探索処理...
    return enemies[0]; // 値をそのまま包んで返す（ヒープ確保なし！）
}

// 呼び出し側：安全かつ明示的なアクセス
auto target = findNearestEnemy(player.getPos(), enemies);
if (target.has_value()) {
    target->takeDamage(10); // target.value().takeDamage(10) でも可
} else {
    std::cout << "ターゲット圏外です" << std::endl;
}`,
          benefits: [
            '「値が空である可能性」が型シグネチャに刻まれるため、呼び出し側が安全に意識できる',
            'ヒープメモリを一切確保せず、スタック上で直接値とブールフラグを管理するため極めて高速',
            'value_or() を使えば「空ならデフォルト値を使う」処理を1行で安全に記述可能'
          ]
        },
        paradigmShiftNotes: '「値が存在しない」という概念のためにポインタを悪用する時代は終わりました。値の所有と寿命を汚さず、std::optional によって値の意味論（セマンティクス）を明確にします。'
      }
    },
    {
      id: 'sec-m4-variant-visit',
      title: 'M4.2 dynamic_cast と switch を葬る std::variant + std::visit',
      leadText: '仮想関数テーブル（vtable）のオーバーヘッドも、ヒープ確保も不要！静的型安全なTagged Unionとパターンマッチングによる新時代の高速多態性を学びます。',
      dialogueBefore: [
        {
          id: 'dm4-5',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '先生、第4章でポリモーフィズムを習いましたが、ドロップアイテム（攻撃力UP・バリア・全体ボム）みたいな「固定の数種類しかないデータ」まで全部 `virtual void apply()` の継承クラスにするのって、少し大げさな気がするんです。'
        },
        {
          id: 'dm4-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'おおっ、見事な洞察力じゃ！継承と仮想関数は「将来どんな派生クラスが増えるか分からない」時には強力じゃが、vtableのポインタ間接参照とヒープアロケーション（unique_ptr）のコストが必ず発生する。'
        },
        {
          id: 'dm4-7',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'C言語の `union`（共用体）ならメモリは1箇所で済みますけど、どの型が入っているか分からなくなって危ないですよね……？'
        },
        {
          id: 'dm4-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そこで登場するのがC++17の最終兵器【std::variant】と【std::visit】じゃ！「型安全な共用体（Tagged Union）」であり、ヒープ確保も仮想関数テーブルも一切なしに、全種類の処理をコンパイル時網羅性チェック付きで実行できるんじゃぞ！'
        }
      ],
      variables: [
        {
          name: 'std::variant<Ts...>',
          type: '型安全な共用体（Tagged Union）',
          scope: 'メモリ上はスタックに最大サイズの型 + 型インデックス',
          description: '指定された複数の型のうち「いずれか1つ」を安全に保持するコンテナ。古典的なCの共用体と違い、デストラクタが正しく呼ばれ、現在の型が何かを厳密に管理する。',
          cComparison: 'C言語では struct { enum Type type; union { ... } data; } と手動で書いていた危険な構造を完全自動化。'
        },
        {
          name: 'std::visit(Visitor, variant)',
          type: 'パターンマッチング関数',
          scope: '式レベル',
          description: 'variant に現在入っている実型の型情報をもとに、適切な関数やラムダ式をコンパイル時テーブルで超高速ディスパッチ。全型が網羅されていないとコンパイルエラーになるため安全。',
          cComparison: 'C言語の巨大 switch(type) 文や C++の dynamic_cast を一掃する。'
        },
        {
          name: 'constexpr',
          type: 'コンパイル時計算指定子',
          scope: '関数・変数・定数',
          description: 'プログラムのコンパイル時に計算を完結させ、実行時のCPU負荷を完全にゼロにするキーワード。事前計算されたゲーム定数やテーブル生成に威力を発揮。',
          cComparison: 'C言語のマクロ（#define）と違い、完全な型安全性とデバッガ親和性を持ちながらゼロコストを実現。'
        }
      ]
    },
    {
      id: 'sec-m4-constexpr-tables',
      title: 'M4.3 constexpr と std::visit による完全実戦コード',
      leadText: 'コンパイル時定数テーブルと std::variant を組み合わせ、ゲームのアイテム効果適用ロジックをゼロオーバーヘッドで組み上げます。',
      dialogueBefore: [
        {
          id: 'dm4-9',
          speaker: 'penguin',
          emotion: 'happy',
          text: '先生！`std::variant` と `std::visit` を使うと、ラムダ式のオーバーロードを使って「パワーアップなら弾数+1」「バリアならシールド回復」ってめちゃくちゃ綺麗に書けますね！'
        },
        {
          id: 'dm4-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そうじゃ！しかももし将来「新しいアイテム型」を追加して処理を書き忘れたら、コンパイラが「型が網羅されておらんぞ！」とビルドエラーで教えてくれる。これぞモダンC++の【ゼロコストかつコンパイル時安全性】の極致なんじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'ModernItems.h',
          language: 'cpp',
          description: 'std::variant と Overloaded イディオムによる型安全アイテム定義',
          isMain: true,
          code: `#pragma once
#include <variant>
#include <iostream>
#include <string_view>

// 1. 各アイテムはシンプルな値構造体（継承も仮想関数も不要！）
struct PowerUpItem {
    int extraBullets = 1;
};

struct ShieldItem {
    int repairAmount = 2;
};

struct BombItem {
    float blastRadius = 5.0f;
};

// 2. アイテムの種類を std::variant で定義（型安全な共用体）
using ItemData = std::variant<PowerUpItem, ShieldItem, BombItem>;

// 3. 複数のラムダ式を多重継承してオーバーロード関数オブジェクトを作るモダンイディオム
template<class... Ts>
struct Overloaded : Ts... { using Ts::operator()...; };
template<class... Ts>
Overloaded(Ts...) -> Overloaded<Ts...>;

// 4. constexpr によるコンパイル時事前計算（実行時コスト完全ゼロ！）
constexpr int kMaxItemSlots = 8;
constexpr float kItemFallSpeed = 1.5f;

// コンパイル時に計算されるステージ初期化定数
constexpr int calculateInitialBonus(int stage) {
    return stage * 500 + 1000;
}`
        },
        {
          filename: 'GamePlay.cpp',
          language: 'cpp',
          description: 'std::visit による高速パターンマッチング処理',
          code: `#include "ModernItems.h"
#include <vector>

class PlayerShip {
public:
    int bullets = 1;
    int shield = 3;
    void addScore(int s) {}
    void triggerScreenBomb(float radius) {}
};

// アイテム取得イベントのディスパッチ処理
void applyItemEffect(PlayerShip& player, const ItemData& item) {
    // std::visit により、現在入っている型に対応するラムダが超高速に直呼び出しされる！
    // 仮想関数テーブルの参照も、キャストも一切不要！
    std::visit(Overloaded {
        [&](const PowerUpItem& p) {
            player.bullets += p.extraBullets;
            std::cout << "🚀 パワーアップ！最大弾数: " << player.bullets << std::endl;
        },
        [&](const ShieldItem& s) {
            player.shield += s.repairAmount;
            std::cout << "🛡️ シールド修復！残量: " << player.shield << std::endl;
        },
        [&](const BombItem& b) {
            player.triggerScreenBomb(b.blastRadius);
            std::cout << "💥 全画面ボム発動！半径: " << b.blastRadius << std::endl;
        }
    }, item);
}`
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-m4-1',
      question: 'std::optional<T> が「値を持たない空の状態」であることを表す、C++17標準の定数はどれですか？',
      options: [
        'NULL',
        'nullptr',
        'std::nullopt',
        'std::none'
      ],
      correctIndex: 2,
      explanation: 'std::optional の無効状態（空）を明示するには std::nullopt を使用します。これにより、ポインタの nullptr や整数の -1 などのマジックナンバーに頼らず、型安全に「値の不在」を扱えます。'
    },
    {
      id: 'q-m4-2',
      question: 'C++17の std::variant が、古典的な C言語の union や基底ポインタの dynamic_cast よりも優れている最大の理由は何ですか？',
      options: [
        '内部で自動的にガベージコレクション（GC）が動くから',
        '型安全（現在保持している型を厳密に追跡しデストラクタも呼ぶ）であり、ヒープ確保やvtableなしで動作するから',
        'マルチスレッド間で自動的に排他ロック（mutex）を取得するから',
        'コンパイルが不要になるスクリプト機能だから'
      ],
      correctIndex: 1,
      explanation: 'std::variant は「型安全な共用体（Tagged Union）」であり、古典的な union のような型取り違えによるメモリ破壊を防ぎ、かつ継承ポリモーフィズムのようなヒープ割り当てや仮想関数テーブル（vtable）ポインタを必要としません。'
    },
    {
      id: 'q-m4-3',
      question: 'std::variant に格納された実型の処理を行う際、std::visit に複数のラムダ式を結合して渡すモダンイディオムの名称はどれですか？',
      options: [
        'Overloaded パターン（オーバーロード構造体）',
        'Singleton パターン',
        'Proxy パターン',
        'Pimpl イディオム'
      ],
      correctIndex: 0,
      explanation: '複数のラムダ式を多重継承して using Ts::operator()... でオーバーロード解決させるテクニックは「Overloaded パターン」と呼ばれ、C++17の std::visit と組み合わせて最も広く使われる公式イディオムです。'
    },
    {
      id: 'q-m4-4',
      question: '関数や変数に constexpr を付与する最大のメリットは何ですか？',
      options: [
        'メモリを必ずハードディスク（SSD）に書き込むため電源が切れても安全',
        'コンパイル時に計算が完了するため、プログラム実行時のCPU負荷とレイテンシが完全にゼロになる',
        'プログラムのバイナリサイズが自動的に半分になる',
        '例外処理の try-catch が不要になる'
      ],
      correctIndex: 1,
      explanation: 'constexpr は「定数式（Constant Expression）」を意味し、コンパイラがビルド時に式の値を計算してバイナリに定数として埋め込みます。これにより、ゲーム実行時の計算負荷や初期化の遅延がゼロになります。'
    }
  ],
  prevChapterSlug: 'chapter-modern-6-string-view',
  nextChapterSlug: 'chapter-modern-8-if-constexpr'
};

