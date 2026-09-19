import { Chapter } from '../../types/curriculum';

export const CPP_SYNTAX_REFERENCE_GUIDE: Chapter = {
  id: 105,
  slug: 'guide-cpp-syntax-reference',
  category: 'guide',
  courseTrack: 'guide',
  courseChapterCode: 'G2',
  title: '【付録】ゼロから引ける！C++基本文法＆機能チートシート総覧',
  subtitle: '〜変数・型・制御構文・ポインタ・参照・関数・クラス・STL・キャストまで逆引き完全リファレンス〜',
  badge: '付録：C++文法総覧',
  gameVersion: 'none',
  description: 'オブジェクト指向設計やゲーム開発を学ぶ中で、「あれ、この構文どう書くんだっけ？」「ポインタと参照の違いは何だっけ？」と迷った時に、いつでも瞬時に引き戻せる完全なC++文法クイックリファレンスです。基本データ型、入出力、制御構造、ポインタ/参照、関数・ラムダ式、クラス/構造体、必須STL（vector, map, string, unique_ptr）、そしてC++の型安全キャストまで、実動コードスニペットと注意点を網羅しています。',
  sections: [
    {
      id: 'sec-syntax-basics-types',
      title: '付録1. 基本データ型・変数宣言・入出力・演算子',
      leadText: 'C++の最も基本的なビルディングブロック。各プリミティブ型のサイズと範囲、型推論 auto、そして高速な入出力のお約束。',
      dialogueBefore: [
        {
          id: 'dlg-syn-1',
          speaker: 'penguin',
          emotion: 'question',
          text: 'ベン先生！C++って型の種類が多くて混乱します。`int` と `int32_t` の違いや、`auto` の使いどころを教えてください！'
        },
        {
          id: 'dlg-syn-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！C++の型は「ハードウェアのメモリをどう解釈するか」の宣言じゃ。型を制する者がC++を制す！まずは最もよく使う基本型と入出力の型を整理するぞ！'
        }
      ],
      explanationText: `
### 1. よく使う基本データ型一覧

| 型名 | サイズ（一般的） | 表現できる範囲・用途 | 例 |
| :--- | :--- | :--- | :--- |
| \`bool\` | 1バイト | \`true\` または \`false\` | \`bool isAlive = true;\` |
| \`char\` | 1バイト | 1文字（ASCIIコード） / -128〜127 | \`char rank = 'S';\` |
| \`int\` | 4バイト (32bit) | 整数（約 -21億〜+21億） | \`int score = 1000;\` |
| \`int64_t\` / \`long long\` | 8バイト (64bit) | 巨大整数（約 -900京〜+900京） | \`int64_t largeId = 9999999999LL;\` |
| \`size_t\` | 4または8バイト | 配列の要素数やサイズ（非負の符号なし整数） | \`size_t len = vec.size();\` |
| \`float\` | 4バイト (32bit) | 単精度浮動小数点数（約7桁の有効数字） | \`float speed = 3.14f;\` |
| \`double\` | 8バイト (64bit) | 倍精度浮動小数点数（約15桁の有効数字） | \`double preciseVal = 3.14159265;\` |
| \`auto\` | コンパイル時決定 | 右辺の式から型を自動推論（C++11以降） | \`auto iter = vec.begin();\` |

> **💡 シロクマ指導官のTips: 固定長整数型を使おう**
> ゲームのパケット通信やセーブデータでは、環境によってサイズが変わる \`int\` や \`long\` ではなく、\`<cstdint>\` で定義されている \`int32_t\`, \`uint32_t\`, \`uint8_t\` などの明示的ビット長を使うのが実務の鉄則じゃ！

---

### 2. 標準入出力（std::cin / std::cout）

\`\`\`cpp
#include <iostream>
#include <string>

int main() {
    int score = 100;
    std::string name = "Shirokuma";

    // 出力: << 演算子で繋げる
    std::cout << "名前: " << name << ", スコア: " << score << "\\n";

    // 入力: >> 演算子で変数に格納
    std::cout << "新しいスコアを入力: ";
    std::cin >> score;

    return 0;
}
\`\`\`

> **⚠️ 注意: std::endl より '\\n' を使おう**
> \`std::endl\` は改行と同時に「バッファの強制フラッシュ（flush）」を行うため、ゲームループ内で多用すると劇的に処理速度が落ちます。普段は \`\\n\` を使いましょう。
      `
    },
    {
      id: 'sec-syntax-control-flow',
      title: '付録2. 制御構文（条件分岐・ループ・早期リターン）',
      leadText: 'if, switch, for, 範囲for, while の基本と、C++特有の強力な初期化付きif構文。',
      dialogueBefore: [
        {
          id: 'dlg-syn-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'for文も色々な書き方がありますよね？普通の `for(int i=0; i<N; ++i)` と、`for(const auto& x : list)` ってどう使い分ければいいですか？'
        },
        {
          id: 'dlg-syn-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '現代のC++では【範囲for文（Range-based for）】が基本じゃ！インデックス変数 i のタイポによる配列外参照バグを100%防ぎ、コードも圧倒的にスッキリ読めるからの！'
        }
      ],
      explanationText: `
### 1. 条件分岐 (if / else if / else)

\`\`\`cpp
// 通常のif文
if (playerHp <= 0) {
    std::cout << "ゲームオーバー\\n";
} else if (playerHp < 30) {
    std::cout << "警告: ピンチ！\\n";
} else {
    std::cout << "安全\\n";
}

// C++17: 初期化付きif文（スコープを限定できて安全！）
if (auto* enemy = findTarget(); enemy != nullptr) {
    enemy->takeDamage(10); // enemy はこの if ブロック内でのみ生存
}
\`\`\`

---

### 2. 多岐分岐 (switch / case)

\`\`\`cpp
enum GameState { TITLE, PLAYING, GAMEOVER };
GameState state = PLAYING;

switch (state) {
    case TITLE:
        renderTitle();
        break; // breakを忘れると下のcaseへ落下（フォールスルー）するので注意！
    case PLAYING:
        updateGame();
        break;
    case GAMEOVER:
        showResult();
        break;
    default:
        break;
}
\`\`\`

---

### 3. ループ構文（for / 範囲for / while）

\`\`\`cpp
#include <vector>

std::vector<int> scores = { 100, 250, 400 };

// ① 範囲for文（最も推奨！コピーを防ぐために const auto& を使う）
for (const auto& s : scores) {
    std::cout << s << "\\n";
}

// ② 値を変更したい場合の範囲for文（非const参照 auto&）
for (auto& s : scores) {
    s += 10; // 要素そのものを書き換え
}

// ③ インデックスが必要な場合の伝統的for文
for (size_t i = 0; i < scores.size(); ++i) {
    std::cout << i << "位: " << scores[i] << "\\n";
}

// ④ while文（条件が真の間繰り返す）
int countdown = 3;
while (countdown > 0) {
    std::cout << countdown-- << "...\\n";
}
\`\`\`
      `
    },
    {
      id: 'sec-syntax-pointers-references',
      title: '付録3. ポインタ（*）と参照（&）の完全攻略',
      leadText: 'C++初心者の最大の関門。「アドレス」「間接参照」「参照渡し」「const参照」の違いを図解でスッキリ解消。',
      dialogueBefore: [
        {
          id: 'dlg-syn-5',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '`int*` と `int&`、記号が似ていて頭が爆発しそうです……！どっちを使えばいいんですか！？'
        },
        {
          id: 'dlg-syn-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！違いは極めて明快じゃ！\n・ポインタ（*）は「住所（アドレス）をメモした紙」。空っぽ（nullptr）にもなれるし、別の住所を書き直すこともできる。\n・参照（&）は「その人につけた『あだ名（別名）』」。最初から実体にガッチリ結合し、絶対に nullptr にはなれん！\n現代C++では【参照を使える場所では、常に参照を優先する】のが鉄則じゃ！'
        }
      ],
      explanationText: `
### ポインタ vs 参照の比較表

| 比較項目 | ポインタ (\`T*\`) | 参照 (\`T&\`) |
| :--- | :--- | :--- |
| **本質** | アドレス（メモリ番地）を格納する独立した変数 | 既存のオブジェクトに対する「別名（エイリアス）」 |
| **nullptr（空）** | **可能** (\`int* p = nullptr;\`) | **不可**（必ず有効な実体を指す必要がある） |
| **再代入（対象の変更）**| **可能**（別の変数を指し直せる） | **不可**（一度バインドしたら一生その実体を指す） |
| **構文** | アドレス取得 \`&x\`、中身アクセス \`*p\` | 普通の変数と同じように扱える（\`ref = 20;\`） |

---

### 実践コード例

\`\`\`cpp
#include <iostream>

void pointerExample() {
    int val = 42;
    int* ptr = &val; // &val で val のアドレスを取得

    std::cout << "val のアドレス: " << ptr << "\\n";
    std::cout << "ptr が指す中身: " << *ptr << "\\n"; // * で逆参照

    *ptr = 100; // val の値が 100 に書き換わる
}

void referenceExample() {
    int val = 42;
    int& ref = val; // ref は val の別名（エイリアス）

    ref = 999; // * を付けずにそのまま代入！val も 999 になる
}
\`\`\`

---

### const との組み合わせ（関数の引数設計）

\`\`\`cpp
// 1. 値渡し: 巨大なオブジェクトだと全コピーが発生し激遅！
void processCopy(std::string str); 

// 2. 参照渡し: 中身を関数内で書き換える場合
void addScore(int& score) { score += 10; }

// 3. const参照渡し: 【最も頻出！】コピーを一切せず、読み取り専用で高速に渡す
void printName(const std::string& name) {
    // name = "New"; ➔ コンパイルエラー（書き換え禁止で安全！）
    std::cout << name << "\\n";
}
\`\`\`
      `
    },
    {
      id: 'sec-syntax-functions-lambdas',
      title: '付録4. 関数・オーバーロード・デフォルト引数・ラムダ式',
      leadText: '関数の基本定義から、同じ名前で引数を変えるオーバーロード、そしてC++11の最強機能「ラムダ式」まで。',
      dialogueBefore: [
        {
          id: 'dlg-syn-7',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'ラムダ式って `[](){}` みたいな顔文字みたいな記号ですよね。何が便利なんですか？'
        },
        {
          id: 'dlg-syn-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '「その場限りの小さな関数」をわざわざ外で名前をつけて定義しなくて済むんじゃ！ソートの条件指定や、敵のフィルタリングで絶大な威力を発揮するぞ！'
        }
      ],
      explanationText: `
### 1. 関数のオーバーロードとデフォルト引数

\`\`\`cpp
// オーバーロード: 同じ関数名で引数の型や数が異なる関数を定義できる
int add(int a, int b) { return a + b; }
float add(float a, float b) { return a + b; }

// デフォルト引数: 引数が省略された時の初期値を指定
void spawnEnemy(int x, int y, int hp = 100) {
    // hp が渡されなければ 100 になる
}

spawnEnemy(10, 20);      // hp = 100
spawnEnemy(10, 20, 500);  // hp = 500 (ボス)
\`\`\`

---

### 2. ラムダ式（無名関数）

\`\`\`cpp
#include <algorithm>
#include <vector>

// 基本構文: [キャプチャ](引数) -> 戻り値の型 { 処理 }

auto greet = [](const std::string& name) {
    std::cout << "こんにちは、" << name << "さん！\\n";
};
greet("シロクマ");

// 実戦例: std::sort で敵をHP順に並び替える
struct Enemy { int id; int hp; };
std::vector<Enemy> enemies = { {1, 50}, {2, 200}, {3, 10} };

// ラムダ式で並び替え条件をインライン記述
std::sort(enemies.begin(), enemies.end(), [](const Enemy& a, const Enemy& b) {
    return a.hp < b.hp; // HPが低い順にソート
});

// キャプチャの基本:
int threshold = 100;
// [threshold]: 外の変数をコピーして持ち込む
// [&threshold]: 外の変数を参照として持ち込む
// [&]: 外の全変数を参照キャプチャ
auto isHighHp = [threshold](const Enemy& e) {
    return e.hp >= threshold;
};
\`\`\`
      `
    },
    {
      id: 'sec-syntax-classes-structs',
      title: '付録5. クラス（class）と構造体（struct）・アクセス修飾子',
      leadText: 'struct と class の唯一の違いとは？カプセル化、メンバ初期化子リスト、explicit の重要性を復習。',
      dialogueBefore: [
        {
          id: 'dlg-syn-9',
          speaker: 'penguin',
          emotion: 'question',
          text: 'C++では `struct` と `class` って何が違うんですか？機能はほとんど同じに見えますが…'
        },
        {
          id: 'dlg-syn-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '違いはたった1つ！【何も指定しなかった時のデフォルトが public か private か】だけじゃ！\n・struct はデフォルトが public（データの集まり向け）\n・class はデフォルトが private（カプセル化したい設計向け）\n現場ではこの意図で使い分けるのが紳士協定じゃな！'
        }
      ],
      explanationText: `
### クラスの標準的な設計テンプレート

\`\`\`cpp
#include <string>
#include <algorithm>

class Player {
// 1. private: 外部から直接触らせない内部データ（カプセル化）
private:
    std::string name_;
    int hp_;
    int maxHp_;

// 2. public: 外部に公開する操作（メソッド）
public:
    // コンストラクタ: メンバ初期化子リスト (: name_(name)...) を使うのが鉄則！
    // explicit: 意図しない暗黙の型変換を防ぐ
    explicit Player(const std::string& name, int maxHp = 100)
        : name_(name), hp_(maxHp), maxHp_(maxHp) {}

    // デストラクタ: 寿命を迎えた時に自動で呼ばれる
    ~Player() = default;

    // ゲッター (constメンバ関数: メンバ変数を変更しないことを保証)
    int getHp() const { return hp_; }
    const std::string& getName() const { return name_; }

    // ビジネスロジック（状態変更）
    void takeDamage(int dmg) {
        hp_ = std::max(0, hp_ - dmg); // 不正なマイナス値を防ぐ
    }
};
\`\`\`
      `
    },
    {
      id: 'sec-syntax-stl-containers',
      title: '付録6. 必須STLコンテナ（vector, string, unordered_map, unique_ptr）',
      leadText: '標準ライブラリ（Standard Template Library）を制覇する。生配列にさよならを告げる4大必須ツール。',
      dialogueBefore: [
        {
          id: 'dlg-syn-11',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'STLを使えるようになってから、生配列のバッファオーバーフローに怯えなくて済むようになりました！'
        },
        {
          id: 'dlg-syn-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！特に \`std::vector\`（動的配列）と \`std::unordered_map\`（ハッシュ連想配列）はゲーム開発の全域で使う主食じゃ。使いこなすのじゃ！'
        }
      ],
      explanationText: `
### 1. \`std::vector\` (動的配列)

\`\`\`cpp
#include <vector>

std::vector<int> v;
v.push_back(10);        // 末尾に追加
v.emplace_back(20);     // 直接構築して追加（push_backより高速）
std::cout << v[0];      // 添字アクセス
std::cout << v.size();   // 要素数 (2)
v.clear();              // 全消去
\`\`\`

---

### 2. \`std::string\` (安全な文字列)

\`\`\`cpp
#include <string>

std::string s1 = "Hello";
std::string s2 = " World";
std::string s3 = s1 + s2; // 結合: "Hello World"

if (s3.find("World") != std::string::npos) {
    // 文字列が含まれているか検索
}
const char* rawCStr = s3.c_str(); // C言語の char* APIに渡す場合
\`\`\`

---

### 3. \`std::unordered_map\` (キー・バリュー辞書 / ハッシュマップ)

\`\`\`cpp
#include <unordered_map>
#include <string>

std::unordered_map<std::string, int> itemPrices;
itemPrices["Potion"] = 50;
itemPrices["Ether"] = 120;

// 検索
if (itemPrices.find("Potion") != itemPrices.end()) {
    std::cout << "ポーションの価格: " << itemPrices["Potion"] << "G\\n";
}
\`\`\`

---

### 4. \`std::unique_ptr\` (スマートポインタ / 単独所有権)

\`\`\`cpp
#include <memory>

class Weapon { /* ... */ };

// 生 new は書かない！make_unique を使う
auto weapon = std::make_unique<Weapon>();

// スコープを抜けた瞬間、delete が 100% 自動実行される！
// 所有権の移譲（ムーブ）:
std::unique_ptr<Weapon> playerWeapon = std::move(weapon);
\`\`\`
      `
    },
    {
      id: 'sec-syntax-cpp-casts',
      title: '付録7. C++型安全キャスト4兄弟（static, reinterpret, const, dynamic）',
      leadText: 'C言語流の危険な (Type)val キャストを全廃する。コンパイラに意図を伝え、バグを未然に防ぐ4つのキャスト演算子。',
      dialogueBefore: [
        {
          id: 'dlg-syn-13',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'C言語だと `(int)3.14` みたいにカッコで囲むだけでキャストできましたよね。なぜC++ではわざわざ `static_cast<int>(3.14)` と長く書くんですか？'
        },
        {
          id: 'dlg-syn-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'C言語のキャストは「何でも無理やり型変換する万能のこぎり」じゃ！危険なポインタ変換も数値変換も同じ構文だから、重大なバグを見逃してしまう。C++の4大キャストは【何のためにキャストしているのかという意図を明確にし、危険な変換をコンパイラに拒否させる防壁】なんじゃよ！'
        }
      ],
      explanationText: `
### C++ 4大キャストの使い分け一覧

| キャスト名 | 用途 | 安全性 | 例 |
| :--- | :--- | :--- | :--- |
| **\`static_cast\`** | 基本的な型の変換（float ➔ int、安全なアップキャスト等） | **高**（不可能な変換はコンパイルエラー） | \`int x = static_cast<int>(3.14f);\` |
| **\`dynamic_cast\`** | 継承関係におけるダウンキャスト（仮想関数を持つクラス限定） | **最高**（失敗すると \`nullptr\` を返す） | \`Boss* b = dynamic_cast<Boss*>(enemyPtr);\` |
| **\`const_cast\`** | \`const\` 修飾を一時的に外す（レガシーC言語APIとの連携時のみ） | **注意**（本来constなオブジェクトを書き換えると未定義動作） | \`char* p = const_cast<char*>(constStr);\` |
| **\`reinterpret_cast\`**| メモリの生バイト列を別の型として無理やり解釈（ハードウェア制御向け） | **危険**（アライメントや型エイリアス違反に注意） | \`uintptr_t addr = reinterpret_cast<uintptr_t>(ptr);\` |

> **💡 シロクマ指導官のまとめ**:
> 迷ったらまず **\`static_cast\`** を使おう！コンパイルが通らなければ、設計そのものがおかしい可能性が高いぞ！
      `
    }
  ]
};
