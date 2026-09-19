import { Chapter } from '../../types/curriculum';

export const CPP_SYNTAX_REFERENCE_GUIDE: Chapter = {
  id: 105,
  slug: 'guide-cpp-syntax-reference',
  category: 'guide',
  courseTrack: 'guide',
  courseChapterCode: 'G2',
  title: '【付録】ゼロから引ける！C++基本文法＆機能チートシート総覧',
  subtitle: '〜変数・型・制御構文・ポインタ・参照・関数・クラス・STL・キャストまで【C++03/11/14/17/20規格対応】逆引き完全リファレンス〜',
  badge: '付録：C++文法総覧（規格別対応）',
  gameVersion: 'none',
  description: 'オブジェクト指向設計やゲーム開発を学ぶ中で、「あれ、この構文どう書くんだっけ？」「うちのプロジェクト（C++11 / C++17等）でこの書き方は使えるんだっけ？」と迷った時に、いつでも瞬時に引き戻せる規格対応版C++文法クイックリファレンスです。C++03からC++11/14/17/20までの主要な違い、基本型、入出力、制御構造、enum class、ポインタ/参照/nullptr、関数・ラムダ式・テンプレート超入門、クラス/構造体、必須STL（vector, map, string, string_view, unique_ptr）、そしてC++の型安全キャストまで、実動コードスニペットと注意点を網羅しています。',
  sections: [
    {
      id: 'sec-syntax-basics-types',
      title: '付録1. C++規格早見表・基本データ型・定数・入出力',
      leadText: 'プロジェクトで使える規格（C++03〜C++20）の判定基準と、各プリミティブ型、型推論 auto、定数 constexpr、高速な入出力。',
      dialogueBefore: [
        {
          id: 'dlg-syn-1',
          speaker: 'penguin',
          emotion: 'question',
          text: 'ベン先生！C++の基本データ型って全部で何種類あるんですか？よく見る int 以外にも unsigned や long、それに char16_t や std::byte も見かけます！'
        },
        {
          id: 'dlg-syn-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！「よく使う型」だけで誤魔化さず、C++に存在する【基本データ型・固定幅整数・文字Unicode・浮動小数点・特殊型】を完全網羅して整理するぞ！ハードウェアとメモリの境界を把握するのじゃ！'
        }
      ],
      explanationText: `
### 0. C++規格バージョンの進化早見年表

実務でコードを書く際、「この機能は現場のC++規格で使えるか？」を常に意識することが極めて重要です。

| 規格名 | 通称 | 主な現場での位置づけ・代表的機能 |
| :--- | :--- | :--- |
| **C++98 / 03** | クラシックC++ | レガシー現場・生ポインタ・手動 \`new\`/\`delete\`・STL基礎。 |
| **C++11** | モダンC++の夜明け | **【最大の大改新】** \`auto\`, \`nullptr\`, 範囲for, ラムダ式, \`unique_ptr\`, \`enum class\`, \`constexpr\`。生ポインタの危険性が劇的に撲滅された。 |
| **C++14** | C++11の完成形 | \`std::make_unique\`, ジェネリックラムダ, \`constexpr\` の制限緩和。 |
| **C++17** | 現代実務のデファクト | **【現在の業界標準】** 初期化付きif/switch, \`std::string_view\`, \`std::optional\`, 構造化束縛 (\`auto [k, v]\`), \`std::filesystem\`。 |
| **C++20** | 次世代C++ | コンセプト（型制約 Concept）, 範囲ライブラリ（Ranges）, コルーチン, \`std::span\`, \`std::format\`。 |

---

### 1. C++基本データ型・組み込み型 完全網羅リファレンス

C++の型は「ハードウェアのメモリ領域を何バイト確保し、どう解釈するか」の宣言です。以下の5カテゴリで全型を網羅できます。

#### ① 整数基本型（標準整数） 【C++98〜】
| 型名 | 対応規格 | サイズ（一般的） | 表現できる範囲・用途 | 例 |
| :--- | :---: | :--- | :--- | :--- |
| \`bool\` | C++98〜 | 1バイト | \`true\` (1) または \`false\` (0) | \`bool isGrounded = true;\` |
| \`char\` | C++98〜 | 1バイト | 1文字（ASCII）/ 符号の有無はコンパイラ依存 | \`char rank = 'S';\` |
| \`signed char\` | C++98〜 | 1バイト (8bit) | 確実に符号付きの8bit整数 (-128〜127) | \`signed char delta = -5;\` |
| \`unsigned char\` | C++98〜 | 1バイト (8bit) | 符号なし8bit整数 (0〜255 / 生バイト表現) | \`unsigned char byte = 0xFF;\` |
| \`short\` (\`short int\`) | C++98〜 | 2バイト (16bit) | -32,768 〜 +32,767 | \`short volume = 100;\` |
| \`unsigned short\` | C++98〜 | 2バイト (16bit) | 0 〜 65,535 (ポート番号等) | \`unsigned short port = 8080;\` |
| \`int\` | C++98〜 | 4バイト (32bit) | 整数（約 -21億〜+21億） | \`int score = 1000;\` |
| \`unsigned int\` | C++98〜 | 4バイト (32bit) | 0 〜 約42.9億 (非負カウンタ・ビットマスク) | \`unsigned int flags = 0x01;\` |
| \`long\` | C++98〜 | 4または8バイト | Windows 64bit(LLP64)では4バイト、Linux 64bit(LP64)では8バイト | \`long count = 100000L;\` |
| \`unsigned long\` | C++98〜 | 4または8バイト | 符号なしlong (Windows: 32bit / Linux: 64bit) | \`unsigned long uCount = 100UL;\` |
| \`long long\` | **C++11〜** | 8バイト (64bit以上) | 巨大整数（約 -922京〜+922京） | \`long long bigId = 9999999999LL;\` |
| \`unsigned long long\` | **C++11〜** | 8バイト (64bit以上) | 0 〜 約1844京 | \`unsigned long long maxId = ~0ULL;\` |

#### ② 固定幅整数型・実務標準型（<cstdint> / <cstddef>） 【C++11〜 実務標準】
環境差（Windows vs Linux等）によるバグを防ぐため、ゲーム・通信開発では以下の固定幅型が最優先で使われます。

| 型名 | 対応規格 | サイズ | 表現できる範囲・用途 | 例 |
| :--- | :---: | :--- | :--- | :--- |
| \`int8_t\` / \`uint8_t\` | **C++11〜** | 1バイト (8bit) | 厳密な8bit整数 (-128〜127 / 0〜255)。RGBカラー値等 | \`uint8_t alpha = 255;\` |
| \`int16_t\` / \`uint16_t\` | **C++11〜** | 2バイト (16bit) | 厳密な16bit整数 (-32,768〜32,767 / 0〜65,535) | \`int16_t sample = -1200;\` |
| \`int32_t\` / \`uint32_t\` | **C++11〜** | 4バイト (32bit) | 厳密な32bit整数。座標・スコア・パケット構造体 | \`uint32_t color = 0xFF00FFFF;\` |
| \`int64_t\` / \`uint64_t\` | **C++11〜** | 8バイト (64bit) | 厳密な64bit整数。ミリ秒タイムスタンプ、ユーザーID | \`int64_t nowMs = 1710000000000LL;\` |
| \`size_t\` | C++98〜 | 4または8バイト | メモリサイズ・配列インデックス用の非負整数 (符号なしポインタ長) | \`size_t len = vec.size();\` |
| \`ptrdiff_t\` | C++98〜 | 4または8バイト | 2つのポインタ間の距離（イテレータの減算結果・符号付き） | \`ptrdiff_t diff = ptr2 - ptr1;\` |
| \`intptr_t\` / \`uintptr_t\` | **C++11〜** | 4または8バイト | ポインタと同じビット幅を持つ整数型（ポインタのアドレス数値化） | \`uintptr_t addr = (uintptr_t)ptr;\` |

#### ③ 文字型・Unicode文字型（国際化対応）
| 型名 | 対応規格 | サイズ | 表現できる範囲・用途 | 例 |
| :--- | :---: | :--- | :--- | :--- |
| \`char\` | C++98〜 | 1バイト | ASCII文字 / UTF-8 code unit | \`char c = 'A';\` |
| \`wchar_t\` | C++98〜 | 2または4バイト | ワイド文字 (Windows: 16bit UTF-16 / Linux: 32bit UTF-32) | \`wchar_t wc = L'あ';\` |
| \`char8_t\` | **C++20〜** | 1バイト | UTF-8専用文字型（charとの混同を型レベルで防止） | \`char8_t u8c = u8'A';\` |
| \`char16_t\` | **C++11〜** | 2バイト | UTF-16文字型（サロゲートペア対応） | \`char16_t u16c = u'あ';\` |
| \`char32_t\` | **C++11〜** | 4バイト | UTF-32文字型（全Unicodeを1文字1要素で表現） | \`char32_t u32c = U'🐱';\` |

#### ④ 浮動小数点数型（実数）
| 型名 | 対応規格 | サイズ | 精度・有効桁数・用途 | 例 |
| :--- | :---: | :--- | :--- | :--- |
| \`float\` | C++98〜 | 4バイト (32bit) | 単精度（有効桁数約7桁）。ゲームの3D座標・物理演算・GPU | \`float speed = 3.14f;\` |
| \`double\` | C++98〜 | 8バイト (64bit) | 倍精度（有効桁数約15〜17桁）。精密計算・シミュレーションの標準 | \`double preciseVal = 3.14159265;\` |
| \`long double\` | C++98〜 | 8/12/16バイト | 拡張倍精度（x86では80bit、ARMでは128bit等環境依存） | \`long double highPrec = 1.0L;\` |

#### ⑤ 特殊型・型推論・生メモリ型
| 型名 | 対応規格 | サイズ | 特徴・用途 | 例 |
| :--- | :---: | :--- | :--- | :--- |
| \`void\` | C++98〜 | 0バイト | 値を持たない空の型（戻り値なし関数、\`void*\` 汎用ポインタ） | \`void update(); void* p = ptr;\` |
| \`std::nullptr_t\` | **C++11〜** | ポインタ長 | \`nullptr\` の固有型。ポインタオーバーロード解決の安全弁 | \`std::nullptr_t nullVal = nullptr;\` |
| \`std::byte\` | **C++17〜** | 1バイト | 数値や文字ではない純粋な「生のバイナリデータ」型 (\`<cstddef>\`) | \`std::byte b{0x3F};\` |
| \`auto\` | **C++11〜** | コンパイル時決定 | 右辺の式から型を自動推論（イテレータやラムダ保持に必須） | \`auto iter = vec.begin();\` |
| \`decltype(式)\` | **C++11〜** | 式の型 | 指定した式や変数の型をコンパイル時に取得する演算子 | \`decltype(score) newScore;\` |

> **💡 シロクマ指導官のTips: なぜ固定幅整数型（int32_t等）が実務標準なのか？**
> C++規格では \`int\` は「16bit以上」、\`long\` は「32bit以上」としか定められておらず、Windows（64bitでもlongは4バイト）とLinux（64bitだとlongは8バイト）でサイズが食い違います。パケット通信やファイル保存で致命的なズレを生むため、現場では \`int32_t\` や \`uint64_t\` などの明示的ビット長を使うのが常識なんじゃ！

---

### 2. 定数宣言: const 【C++98】 vs constexpr 【C++11/14】

C言語の \`#define MAX_ENEMY 100\` のようなマクロ定数は型情報がなくデバッグしにくいため、現代C++では **\`constexpr\`** を使用します。

\`\`\`cpp
// ❌ 非推奨: C言語流マクロ（スコープ無視・型安全性なし）
#define MAX_HP 999

// ⭕ C++98: const 定数（実行時確定でもOK）
const int MaxPlayers = 4;

// 🌟 C++11/14: constexpr（コンパイル時計算の定数・配列サイズに使える）
constexpr int ScreenWidth = 800;
constexpr int ScreenHeight = 600;
constexpr int TotalPixels = ScreenWidth * ScreenHeight; // コンパイル時に計算完了！

// constexpr 関数 (C++14〜: ループや条件分岐も可能)
constexpr int square(int x) {
    return x * x;
}
int buffer[square(4)]; // コンパイル時定数なので配列サイズに使える！
\`\`\`

---

### 3. 標準入出力（std::cin / std::cout） 【C++98〜】

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
      title: '付録2. 制御構文・列挙型（enum class）・構造化束縛',
      leadText: 'if, switch, 初期化付きif/switch 【C++17】, enum class 【C++11】, 範囲for 【C++11】, 構造化束縛 【C++17】。',
      dialogueBefore: [
        {
          id: 'dlg-syn-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'for文も色々な書き方がありますよね？それと、現場で「生enumではなく enum class を使え」と怒られたのですが、何が違うんですか？'
        },
        {
          id: 'dlg-syn-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '生enumは名前がスコープ外に漏れ出し、勝手に int に型変換されてバグの温床になるんじゃ！C++11の【enum class】と【範囲for文】、さらにC++17の【構造化束縛】をマスターすれば、現代の現場コードは怖くないぞ！'
        }
      ],
      explanationText: `
### 1. 条件分岐 (if / else) 【C++98〜】 & 初期化付きif 【C++17〜】

\`\`\`cpp
// 通常のif文 【C++98〜】
if (playerHp <= 0) {
    std::cout << "ゲームオーバー\\n";
} else if (playerHp < 30) {
    std::cout << "警告: ピンチ！\\n";
} else {
    std::cout << "安全\\n";
}

// 🌟 C++17: 初期化付きif文（スコープをifブロック内だけに限定できて超安全！）
if (auto* enemy = findTarget(); enemy != nullptr) {
    enemy->takeDamage(10); // enemy はこの if ブロック内でのみ生存し、外に漏れない
}
\`\`\`

---

### 2. 列挙型: enum 【C++98】 vs enum class 【C++11〜】

現代C++の実務では、特別な理由がない限り **\`enum class\`** のみが許可されます。

\`\`\`cpp
// ❌ レガシー: 生の enum (C++98)
// 問題1: TITLE や PLAYING が外のグローバル空間を汚染する
// 問題2: int と暗黙に比較・代入できてしまい型安全でない (if (state == 0) が通る)
enum LegacyState { TITLE, PLAYING };

// ⭕ 現代標準: enum class (C++11〜 スコープ付き列挙型)
enum class GameState {
    Title,
    Playing,
    GameOver
};

// 使い方: 必ず GameState:: を前置する（名前衝突ゼロ！）
GameState state = GameState::Playing;

// if (state == 1) ➔ コンパイルエラー！（暗黙のint変換を防ぎバグを阻止）
if (state == GameState::Playing) {
    // 正常処理
}
\`\`\`

---

### 3. 多岐分岐 (switch / case) 【C++98〜】 & 初期化付きswitch 【C++17〜】

\`\`\`cpp
switch (state) {
    case GameState::Title:
        renderTitle();
        break; // breakを忘れると下のcaseへ落下（フォールスルー）するので注意！
    case GameState::Playing:
        updateGame();
        break;
    case GameState::GameOver:
        showResult();
        break;
}

// 🌟 C++17: 初期化付きswitch文
switch (auto status = getNetworkStatus(); status) {
    // status の有効範囲を switch 内に限定
}
\`\`\`

---

### 4. ループ構文（for / 範囲for 【C++11】 / 構造化束縛 【C++17】）

\`\`\`cpp
#include <vector>
#include <unordered_map>
#include <string>

std::vector<int> scores = { 100, 250, 400 };

// ① 範囲for文 【C++11〜】（最も推奨！コピーを防ぐために const auto& を使う）
for (const auto& s : scores) {
    std::cout << s << "\\n";
}

// ② 値を変更したい場合の範囲for文（非const参照 auto&）
for (auto& s : scores) {
    s += 10; // 要素そのものを書き換え
}

// ③ 構造化束縛 (Structured Binding) 【C++17〜】（マップのキーと値を一発分解！）
std::unordered_map<std::string, int> itemPrices = { {"Potion", 50}, {"Ether", 120} };
for (const auto& [item, price] : itemPrices) {
    std::cout << item << " は " << price << "G です\\n";
}

// ④ インデックスが必要な場合の伝統的for文 【C++98〜】
for (size_t i = 0; i < scores.size(); ++i) {
    std::cout << i << "位: " << scores[i] << "\\n";
}

// ⑤ while文 【C++98〜】
int countdown = 3;
while (countdown > 0) {
    std::cout << countdown-- << "...\\n";
}
\`\`\`
      `
    },
    {
      id: 'sec-syntax-pointers-references',
      title: '付録3. ポインタ（*）・参照（&）・nullptr 【C++11】の完全攻略',
      leadText: '「アドレス」「間接参照」「参照渡し」「const参照」、そしてNULLの曖昧さを葬り去った型安全な nullptr 【C++11】の決定打。',
      dialogueBefore: [
        {
          id: 'dlg-syn-5',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '`int*` と `int&`、記号が似ていて頭が爆発しそうです……！あと、`NULL` と `nullptr` って何が違うんですか？'
        },
        {
          id: 'dlg-syn-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！違いは極めて明快じゃ！\n・ポインタ（*）は「住所（アドレス）をメモした紙」。空っぽ（nullptr）にもなれるし、別の住所を指し直すこともできる。\n・参照（&）は「実体につけた『あだ名』」。絶対に nullptr にはなれず、生涯その実体を指し続ける！\nそして NULL は大昔の整数の 0 じゃが、C++11 の【nullptr】は正真正銘のポインタ専用型じゃ！'
        }
      ],
      explanationText: `
### 1. ポインタ vs 参照の比較表

| 比較項目 | ポインタ (\`T*\`) 【C++98〜】 | 参照 (\`T&\`) 【C++98〜】 |
| :--- | :--- | :--- |
| **本質** | アドレス（メモリ番地）を格納する独立した変数 | 既存のオブジェクトに対する「別名（エイリアス）」 |
| **空（未初期化/無効）** | **可能** (\`int* p = nullptr;\`) | **不可**（必ず有効な実体への結合が必要） |
| **再代入（対象の変更）**| **可能**（別の変数のアドレスを代入可能） | **不可**（一度バインドしたら一生その実体を指す） |
| **構文** | アドレス取得 \`&x\`、中身アクセス \`*p\` | 普通の変数と全く同じように扱える（\`ref = 20;\`） |
| **実務の原則** | nullptr を許容したい場合のみ使用 | **【最優先】nullptr があり得ない場合は常に参照を使う** |

---

### 2. nullptr 【C++11〜】 vs NULL / 0 【C++98】（なぜ現代でNULLは禁止なのか？）

現代C++において、\`NULL\` や \`0\` でポインタを初期化することは静的解析ツールで重大警告（Clang-Tidy等）となります。

\`\`\`cpp
// ❌ 危険: NULL はマクロで単なる整数 0 と定義されていることが多い
void printTarget(int id)    { std::cout << "ID: " << id << "\\n"; }
void printTarget(Enemy* e) { std::cout << "Enemy Pointer\\n"; }

printTarget(NULL); // 🚨 曖昧さエラー！あるいは printTarget(int) が呼ばれてしまう大事故！

// ⭕ 現代標準: nullptr 【C++11〜】(std::nullptr_t 型)
printTarget(nullptr); // 確実に printTarget(Enemy*) が呼ばれる！100%型安全
\`\`\`

---

### 3. 実践コード例: アドレス取得と参照 【C++98〜】

\`\`\`cpp
#include <iostream>

void pointerExample() {
    int val = 42;
    int* ptr = &val; // &val で val のメモリアドレスを取得

    std::cout << "val のアドレス: " << ptr << "\\n";
    std::cout << "ptr が指す中身: " << *ptr << "\\n"; // * で逆参照（中身を読む）

    *ptr = 100; // ptr を通じて val の値が 100 に書き換わる
}

void referenceExample() {
    int val = 42;
    int& ref = val; // ref は val の別名（エイリアス）

    ref = 999; // * を付けずにそのまま代入！val も 999 になる
}
\`\`\`

---

### 4. const との組み合わせ（関数の引数設計の鉄則） 【C++98〜】

\`\`\`cpp
// 1. 値渡し: 巨大なオブジェクトだと全コピーが発生し激遅！
void processCopy(std::string str); 

// 2. 参照渡し: 中身を関数内で書き換えて呼び出し元に戻す場合
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
      title: '付録4. 関数・オーバーロード・ラムダ式・テンプレート超入門',
      leadText: 'オーバーロード 【C++98】、C++11の最強兵器「ラムダ式」、C++14「ジェネリックラムダ」、そしてSTLの山括弧 <> の正体である「関数テンプレート超入門」【C++98〜】。',
      dialogueBefore: [
        {
          id: 'dlg-syn-7',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'ラムダ式って `[](){}` みたいな顔文字みたいな記号ですよね。あと、STLで見かける `<typename T>` や `<int>` って何者なんですか？'
        },
        {
          id: 'dlg-syn-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ラムダ式【C++11】はその場限りの使い捨て関数をスマートに書く武器じゃ！そして山括弧 `<>` は【テンプレート】と呼ばれ、「型だけを差し替えて同じ処理を使い回す」C++の奥義なんじゃ！両方押さえておくぞ！'
        }
      ],
      explanationText: `
### 1. 関数のオーバーロードとデフォルト引数 【C++98〜】

\`\`\`cpp
// オーバーロード: 同じ関数名で引数の型や数が異なる関数を定義できる
int add(int a, int b) { return a + b; }
float add(float a, float b) { return a + b; }

// デフォルト引数: 引数が省略された時の初期値を指定（右側の引数から順に指定）
void spawnEnemy(int x, int y, int hp = 100) {
    // hp が渡されなければ 100 になる
}

spawnEnemy(10, 20);      // hp = 100
spawnEnemy(10, 20, 500);  // hp = 500 (ボス)
\`\`\`

---

### 2. ラムダ式（無名関数） 【C++11〜】 & ジェネリックラムダ 【C++14〜】

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
// [threshold]: 外の変数をコピーして持ち込む（読み取り専用）
// [&threshold]: 外の変数を参照として持ち込む（書き換え可能）
// [&]: 外の全変数を参照キャプチャ
auto isHighHp = [threshold](const Enemy& e) {
    return e.hp >= threshold;
};

// 🌟 C++14: ジェネリックラムダ（引数に auto を使える！）
auto printItem = [](const auto& item) {
    std::cout << item << "\\n";
};
\`\`\`

---

### 3. 関数テンプレート超入門 【C++98〜】（STLの山括弧 <> の正体）

「型が違うだけで、全く同じロジックを何個も書きたくない」ときに使います。

\`\`\`cpp
// 任意の型 T を受け取って大きい方を返すテンプレート関数
template <typename T>
T myMax(T a, T b) {
    return (a > b) ? a : b;
}

// 使い方:
int maxInt = myMax<int>(10, 20);        // 型を明示指定: T = int
double maxDbl = myMax(3.14, 2.71);      // 引数から自動型推論: T = double

// 💡 これこそが、std::vector<int> や std::make_unique<Enemy>() の山括弧 <> の仕組み！
// クラスや関数に「型を外から注入する」ためのC++の根本機能です。
\`\`\`
      `
    },
    {
      id: 'sec-syntax-classes-structs',
      title: '付録5. クラス（class）・構造体（struct）・現代的クラス設計',
      leadText: 'struct と class の違い 【C++98】、メンバ初期化子リスト、C++11のメンバ内初期化、= default / = delete、override 修飾子。',
      dialogueBefore: [
        {
          id: 'dlg-syn-9',
          speaker: 'penguin',
          emotion: 'question',
          text: 'C++では `struct` と `class` って何が違うんですか？あと `= default` や `override` などの新キーワードもよく見かけます！'
        },
        {
          id: 'dlg-syn-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'struct と class の違いはたった1つ！【何も書かなかった時のデフォルトが public か private か】だけじゃ！\nそして C++11 から加わった `= default`, `= delete`, `override` は、設計ミスをコンパイル段階で100%弾く現代の必須装備じゃ！'
        }
      ],
      explanationText: `
### 1. struct vs class の比較 【C++98〜】

| 比較項目 | 構造体 (\`struct\`) | クラス (\`class\`) |
| :--- | :--- | :--- |
| **デフォルトのアクセス権** | **\`public:\`**（外部から自由にアクセス可能） | **\`private:\`**（外部から非公開・隠蔽） |
| **デフォルトの継承** | \`public\` 継承 | \`private\` 継承 |
| **実務での使い分け** | メンバ関数を持たない「データの束」向け | カプセル化（内部状態を隠す）された「オブジェクト」向け |

---

### 2. 現代C++のクラス標準設計テンプレート 【C++11〜17】

\`\`\`cpp
#include <string>
#include <algorithm>
#include <iostream>

class Player {
// 1. private: 外部から直接書き換えさせない内部データ
private:
    std::string name_;
    // 🌟 C++11: メンバ内初期化（コンストラクタで書き忘れてもゴミ値が入らない！）
    int hp_{100};
    int maxHp_{100};

// 2. public: 外部に公開するインターフェース
public:
    // コンストラクタ: メンバ初期化子リスト (: name_(name)...) を使うのが鉄則
    // explicit 【C++98〜】: 意図しない暗黙の型変換（Player p = 100; 等）を防ぐ
    explicit Player(std::string name, int maxHp = 100)
        : name_(std::move(name)), hp_(maxHp), maxHp_(maxHp) {}

    // デストラクタ 【C++11〜】: コンパイラ生成の標準動作であることを明示
    ~Player() = default;

    // 🌟 C++11: コピー禁止の宣言（浅いコピーによる二重解放バグを完全封殺）
    Player(const Player&) = delete;
    Player& operator=(const Player&) = delete;

    // ゲッター (constメンバ関数 【C++98〜】: メンバ変数を変更しないことをコンパイラが保証)
    int getHp() const { return hp_; }
    const std::string& getName() const { return name_; }

    // ビジネスロジック（状態変更）
    void takeDamage(int dmg) {
        hp_ = std::max(0, hp_ - dmg); // 不正なマイナス値を防ぐ
    }
};

// 🌟 C++11: override 指定子（基底クラスの仮想関数を上書きしたことを明示）
class BaseEntity {
public:
    virtual ~BaseEntity() = default;
    virtual void update() {}
};

class Monster : public BaseEntity {
public:
    // override を付けることで、関数名のタイポ時にコンパイルエラーを出してくれる！
    void update() override {
        std::cout << "Monster update\\n";
    }
};
\`\`\`
      `
    },
    {
      id: 'sec-syntax-stl-containers',
      title: '付録6. 必須STLコンテナ・文字列（string_view）・スマートポインタ',
      leadText: 'vector 【C++98/11】, string 【C++98】, string_view 【C++17】, unordered_map 【C++11】, unique_ptr 【C++11】 / make_unique 【C++14】。生配列と手動deleteに完全決別する必須ツール群。',
      dialogueBefore: [
        {
          id: 'dlg-syn-11',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'STLを使えるようになってから、生配列のバッファオーバーフローに怯えなくて済むようになりました！あと最近よく聞く `std::string_view` って何ですか？'
        },
        {
          id: 'dlg-syn-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！`std::vector` と `std::unordered_map` はゲーム開発の主食じゃ！\nそして C++17 で登場した【std::string_view】は、「メモリコピーを一切起こさずに文字列を覗き見する」現代C++の超高速キラー機能じゃぞ！'
        }
      ],
      explanationText: `
### 1. std::vector（動的配列） 【C++98〜】 & emplace_back 【C++11〜】

\`\`\`cpp
#include <vector>

std::vector<int> v = { 1, 2, 3 }; // 初期化子リスト 【C++11〜】
v.push_back(10);                  // 末尾に追加（コピーまたはムーブ）
v.emplace_back(20);               // 🌟 C++11: その場で直接コンストラクト（高速！）

std::cout << v[0];                // 添字アクセス（高速・範囲外チェックなし）
std::cout << v.at(0);             // 範囲外なら例外を投げる安全アクセス
std::cout << v.size();             // 要素数
v.clear();                        // 全要素消去
\`\`\`

---

### 2. std::string 【C++98〜】 vs std::string_view 【C++17〜】

\`\`\`cpp
#include <string>
#include <string_view>
#include <iostream>

// ❌ レガシー: const std::string& は "Hello" などの文字列リテラルを渡すと一時オブジェクト生成（動的メモリ確保）が発生することがある
void printLegacy(const std::string& s) {
    std::cout << s << "\\n";
}

// 🌟 現代標準: std::string_view 【C++17〜】
// ポインタと長さ（16バイト程度）だけを保持し、コピーやメモリ確保が【絶対ゼロ】！
void printModern(std::string_view sv) {
    std::cout << sv << "\\n";
}

int main() {
    std::string str = "プレイヤー";
    printModern(str);              // std::string をそのまま渡せる（コピーなし）
    printModern("ゲームスタート");   // 文字列リテラルもそのまま渡せる（アロケーションなし）
    printModern(std::string_view(str.data(), 3)); // 部分切り出しもO(1)で超高速！
}
\`\`\`

---

### 3. std::unordered_map 【C++11〜】 vs std::map 【C++98〜】

| コンテナ | 内部構造 | 検索計算量 | 特徴 |
| :--- | :--- | :--- | :--- |
| **\`std::unordered_map\`** 【C++11〜】 | ハッシュテーブル | **平均 O(1)** | 順序不定。**ゲーム開発の辞書・ID検索の第一候補** |
| **\`std::map\`** 【C++98〜】 | 赤黒木（平衡二分木） | **O(log N)** | キーが常に昇順ソートされる。ランキング表示等向け |

\`\`\`cpp
#include <unordered_map>
#include <string>

std::unordered_map<std::string, int> itemPrices;
itemPrices["Potion"] = 50;
itemPrices["Ether"] = 120;

// find で存在確認（存在しないキーに [] を使うと勝手に要素が生成されてしまうため！）
if (auto it = itemPrices.find("Potion"); it != itemPrices.end()) {
    std::cout << "ポーションの価格: " << it->second << "G\\n";
}
\`\`\`

---

### 4. std::unique_ptr 【C++11〜】 & std::make_unique 【C++14〜】

現代C++では、生の \`new\` / \`delete\` を業務コードに書くことは完全に禁止されています。

\`\`\`cpp
#include <memory>

class Weapon { /* ... */ };

// ❌ 過去の書き方: 生 new（delete 忘れや例外でメモリリークの原因）
// Weapon* w = new Weapon();

// ⭕ 現代標準: std::make_unique 【C++14〜】
auto weapon = std::make_unique<Weapon>();

// 💡 スコープを抜けた瞬間、デストラクタと delete が 100% 自動実行される！

// 所有権の移動（ムーブセマンティクス 【C++11〜】）
// unique_ptr はコピー不可（= delete）。std::move でのみ所有権を譲渡できる
std::unique_ptr<Weapon> playerWeapon = std::move(weapon);
// この時点で weapon は nullptr になる
\`\`\`

> **💡 shared_ptr / weak_ptr 【C++11〜】 の使いどころ**:
> 複数のオブジェクトで共同所有したい場合のみ \`std::shared_ptr\` / \`std::make_shared\` を使います。循環参照によるメモリリークを防ぐ監視役には \`std::weak_ptr\` を組み合わせます。
      `
    },
    {
      id: 'sec-syntax-cpp-casts',
      title: '付録7. C++型安全キャスト4兄弟（static, dynamic, const, reinterpret） 【C++98〜】',
      leadText: 'C言語流の危険な (Type)val キャストを全廃する。コンパイラに意図を伝え、重大なバグを未然に防ぐ4つのキャスト演算子。',
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
          text: 'C言語の丸カッコキャストは「何でも無理やり型変換する万能のこぎり」じゃ！危険なポインタ変換も数値変換も同じ構文だから、重大なバグを見逃してしまう。\nC++の4大キャストは【何のためにキャストしているのかという意図を明確にし、危険な変換をコンパイラに拒否させる防壁】なんじゃよ！'
        }
      ],
      explanationText: `
### C++ 4大キャストの使い分け一覧 【C++98〜 全規格共通ルール】

| キャスト名 | 用途 | 安全性 | 実戦コード例 |
| :--- | :--- | :---: | :--- |
| **\`static_cast\`** | 基本的な型の変換（float ➔ int、安全なアップキャスト等） | **高** | \`int x = static_cast<int>(3.14f);\` |
| **\`dynamic_cast\`** | 継承関係におけるダウンキャスト（仮想関数を持つクラス限定） | **最高** | \`Boss* b = dynamic_cast<Boss*>(enemyPtr);\`<br/>*(失敗時は nullptr を返す)* |
| **\`const_cast\`** | \`const\` 修飾を一時的に外す（レガシーC言語APIとの連携時のみ） | **注意** | \`char* p = const_cast<char*>(constStr);\` |
| **\`reinterpret_cast\`**| メモリの生バイト列を別の型として無理やり解釈（バイナリ通信等） | **危険** | \`uintptr_t addr = reinterpret_cast<uintptr_t>(ptr);\` |

> **⚠️ 現場の静的解析ルール**:
> Google C++ Style Guide や Clang-Tidy（\`google-readability-casting\`）では、C言語スタイルの丸カッコキャスト \`(Type)val\` は**エラー対象**として検知されます。C++コードでは必ず上記4つの明示キャストを使いましょう！
      `
    }
  ]
};

