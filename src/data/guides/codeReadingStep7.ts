import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_7: Chapter = {
  id: 207,
  slug: 'reading-step-7',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R7',
  title: 'コード読解演習 Step 7【型パズル鑑識】：難解テンプレート＆メタプログラミングの解読術',
  subtitle: 'STLやオープンソースに潜む SFINAE・enable_if・type_traits・Concepts の暗号を解読し、本来のシグネチャを復元する',
  badge: '読解演習 Step 7',
  description: 'オープンソースのライブラリ（nlohmann/json, Boost, Eigen）やSTLのヘッダファイルを開いた瞬間、画面を埋め尽くす `template <typename T, typename std::enable_if<...>::type...>` という暗号に圧倒されたことはありませんか？コンパイラに「特定の型だけに関数を適用させる」ための高度な型制約技術（SFINAE）と、C++20の Concepts によるモダン記法を徹底解剖。「玉ねぎの皮むき法」で装飾を剥ぎ取り、数千行のエラーメッセージの真犯人を1秒で見抜くプロの鑑識眼を養成します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-6',
  nextChapterSlug: 'reading-step-8',
  sections: [
    {
      id: 'step7-overview',
      title: '7.1 なぜテンプレートコードは「暗号」に見えるのか？〜SFINAEと型制約のメカニズム〜',
      leadText: 'テンプレートは実行時ではなく「コンパイル時に動く別言語（メタ言語）」です。なぜこんな奇怪な構文が必要なのか、その根本理由から紐解きます。',
      dialogueBefore: [
        {
          id: 'dlg-r7-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生！先輩から「現場で使ってるOSSのシリアライザヘッダ（Serializer.hpp）を読んで自作クラスを対応させて」って言われたんですけど、開いてみたら呪文が並んでて何ひとつ読めません！\n`template <typename T, typename = std::enable_if_t<std::is_integral_v<T>>>` とか、本来の関数名や引数は一体どこにあるんですか！？'
        },
        {
          id: 'dlg-r7-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！全C++プログラマが一度は通る「テンプレートの洗礼」じゃな！\n初心者がテンプレートを読めない最大の理由は、**【関数本来の仕事】** と **【コンパイラへの型制約（門番）】** が同じ行にごちゃ混ぜに書かれているからじゃ。'
        },
        {
          id: 'dlg-r7-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'コンパイラへの門番……？普通の関数オーバーロードじゃダメなんですか？'
        },
        {
          id: 'dlg-r7-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'いい質問じゃ！「整数型（int, short, uint32_t 等）ならmemcpyで一気に書き込みたい」「浮動小数点型ならエンディアン反転したい」「クラスならserialize()メソッドを呼びたい」という時、型ごとに何十個も関数を手書きするのは地獄じゃろ？\nそれを解決するのが【SFINAE（スフィネ：置換失敗はエラーにあらず）】という、コンパイル時に型を自動選別する神業なんじゃよ！'
        }
      ],
      explanationText: `
### SFINAE（スフィネ）とは何か？

**SFINAE** は **Substitution Failure Is Not An Error**（代入失敗はコンパイルエラーにあらず）の頭文字をとったC++の中核ルールです。

通常、C++で不正な型操作（存在しないメンバへのアクセスや、無効な型変換）を書くと即座にコンパイルエラーになります。
しかし、**テンプレート実体化の候補選定中** に限っては：

> **「この型 T でテンプレートを展開しようとしたら失敗した？ よし、エラーにするのではなく、候補リストから静かに除外（脱落）させて、次のオーバーロード関数を探そう！」**

という特別な恩赦が与えられます。
ライブラリの作者はこのルールを逆手に取り、\`std::enable_if\` を使って「条件を満たさない型をわざと脱落させる（＝適合する型だけに関数を呼び出させる）」という高度な型パズルを組んでいるのです。
      `,
      takeaways: [
        {
          title: 'テンプレートは「実行時」ではなく「コンパイル時の交通整理」',
          description: '奇怪なコードの9割は実行時の処理ではなく、「どの型をこの関数に通し、どの型を弾くか」という門番（型制約）の記述です。'
        }
      ]
    },
    {
      id: 'step7-onion-peeling',
      title: '7.2 テンプレート読解の極意：3段階「玉ねぎの皮むき法（Onion Peeling Method）」',
      leadText: '暗号に見えるテンプレートも、外側の皮を1枚ずつ剥がせば、中身は驚くほど平凡な「いつもの関数」です。',
      explanationText: `
### プロが実践する「玉ねぎの皮むき法」

以下の暗号のような関数シグネチャを例に、読解のステップを追ってみましょう。

\`\`\`cpp
// 😱 初心者が絶望する暗号コード
template <typename T, typename std::enable_if<std::is_integral<T>::value, int>::type = 0>
void writeToBuffer(PacketBuffer& buf, T value);
\`\`\`

#### 【第1層の皮むき】：門番（SFINAE装飾）を手で隠す！
最初からすべてを読んではいけません。\`template <...>\` の中の型制約を一旦指で隠します：

\`\`\`cpp
// 🌟 皮を剥ぐと…ただの「関数名」「引数」「戻り値」が現れる！
void writeToBuffer(PacketBuffer& buf, T value);
\`\`\`
- **戻り値**: \`void\`
- **関数名**: \`writeToBuffer\`
- **引数**: \`buf\` と \`T value\`
これだけで「ああ、パケットバッファに何かの値 \`value\` を書き込む関数なんだな」と業務上の目的が瞬時に把握できます。

---

#### 【第2層の皮むき】：型特性（type_traits）の条件を日本語化する！
隠していた門番の部分を取り出し、何が判定されているかを翻訳します：

\`\`\`cpp
std::enable_if<std::is_integral<T>::value, int>::type = 0
\`\`\`
- \`std::is_integral<T>::value\` ➔ **「T は整数型（int, char, uint64_t等）か？」**
- \`std::enable_if<条件, 型>::type\` ➔ **「もし条件が真（true）なら、この型を有効化せよ」**

つまり、この門番が言っていることは、たったこれだけです：
> **「T が整数型の場合のみ、この writeToBuffer 関数を通しますよ」**

---

#### 【第3層の皮むき】：具象型を代入してシミュレーションする！
もし呼び出し元が \`writeToBuffer(buf, 42);\`（42 は int）なら：
- \`is_integral<int>::value\` は \`true\` ➔ この関数が生き残り、正常に呼ばれる！
もし \`writeToBuffer(buf, 3.14f);\`（float）なら：
- \`is_integral<float>::value\` は \`false\` ➔ \`enable_if\` の中に \`type\` が存在せず代入失敗！
- **SFINAE発動！** エラーにはならず、浮動小数点用の別の \`writeToBuffer\` へルーティングされる！
      `,
      takeaways: [
        {
          title: '「関数シグネチャの本体」と「門番」を視覚的に分離せよ',
          description: 'まず戻り値・関数名・引数だけを拾い読みして関数の責務を把握し、その後にテンプレート引数部の条件（type_traits）をチェックするのが最短の読解ルートです。'
        }
      ]
    },
    {
      id: 'step7-sample-code',
      title: '7.3 演習コード：現場の汎用ゲームパケットシリアライザ（SFINAE vs Concepts版）',
      leadText: '古典C++11の enable_if 版と、モダンC++20の Concepts 版を比較対比。型パズルが現代どのように劇的に進化・読みやすくなったかを体感します。',
      codeFiles: [
        {
          filename: 'PacketSerializer.hpp',
          language: 'cpp',
          description: 'ゲーム内ネットワーク通信で様々な型を自動バイナリ化するシリアライザ',
          isMain: true,
          code: `#include <iostream>
#include <vector>
#include <string>
#include <type_traits>
#include <cstring>
#include <cstdint>

// 簡易パケットバッファ
class PacketBuffer {
public:
    std::vector<uint8_t> data;

    void writeRaw(const void* src, size_t size) {
        const uint8_t* bytePtr = static_cast<const uint8_t*>(src);
        data.insert(data.end(), bytePtr, bytePtr + size);
    }
};

// ============================================================================
// 🏛️ 古典C++11/14スタイル：std::enable_if を用いたSFINAE型選別
// ============================================================================
namespace ClassicSerializer {

    // 【ケース1：整数型（int, short, uint32_t 等）】
    // memcpy によるバイト列ダイレクト書き込み
    template <typename T, 
              typename std::enable_if<std::is_integral<T>::value, int>::type = 0>
    void write(PacketBuffer& buf, T val) {
        std::cout << "[SFINAE: 整数型] サイズ " << sizeof(T) << " バイトを直接書き込み: " << val << "\\n";
        buf.writeRaw(&val, sizeof(T));
    }

    // 【ケース2：浮動小数点型（float, double 等）】
    template <typename T,
              typename std::enable_if<std::is_floating_point<T>::value, int>::type = 0>
    void write(PacketBuffer& buf, T val) {
        std::cout << "[SFINAE: 浮動小数点型] 精度を保護して書き込み: " << val << "\\n";
        buf.writeRaw(&val, sizeof(T));
    }

    // 【ケース3：文字列（std::string）】
    // 長さ（uint32_t）＋ 文字実体の順に書き込む
    template <typename T,
              typename std::enable_if<std::is_same<T, std::string>::value, int>::type = 0>
    void write(PacketBuffer& buf, const T& val) {
        std::cout << "[SFINAE: 文字列型] 長さ " << val.size() << " + 文字列本体を書き込み: " << val << "\\n";
        uint32_t len = static_cast<uint32_t>(val.size());
        buf.writeRaw(&len, sizeof(len));
        buf.writeRaw(val.data(), len);
    }
}

// ============================================================================
// 🚀 モダンC++20スタイル：Concepts（コンセプト）と requires節による明快な記述
// ============================================================================
#if __cplusplus >= 202002L || defined(_MSVC_LANG) && _MSVC_LANG >= 202002L

#include <concepts>

namespace ModernSerializer {

    // 整数型コンセプト
    template <typename T>
    concept NetworkInteger = std::integral<T>;

    // 浮動小数点コンセプト
    template <typename T>
    concept NetworkFloat = std::floating_point<T>;

    // 自作クラスが serialize() メソッドを持っているかを検証するコンセプト！
    template <typename T>
    concept CustomSerializable = requires(T a, PacketBuffer& buf) {
        { a.serialize(buf) } -> std::same_as<void>;
    };

    // 1. 整数の書き込み（英語の文章のように読める！）
    void write(PacketBuffer& buf, NetworkInteger auto val) {
        std::cout << "[Concepts: 整数型] " << val << "\\n";
        buf.writeRaw(&val, sizeof(val));
    }

    // 2. 浮動小数点の書き込み
    void write(PacketBuffer& buf, NetworkFloat auto val) {
        std::cout << "[Concepts: 浮動小数点型] " << val << "\\n";
        buf.writeRaw(&val, sizeof(val));
    }

    // 3. 自作カスタムオブジェクトの書き込み（メンバ関数 serialize を自動呼び出し）
    template <CustomSerializable T>
    void write(PacketBuffer& buf, const T& obj) {
        std::cout << "[Concepts: カスタムオブジェクト] 内部serializeを呼び出し\\n";
        obj.serialize(buf);
    }
}

#endif // C++20
`
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '古典 enable_if の定石パターンを見抜く',
          description: 'テンプレート引数の末尾に「typename std::enable_if<条件, int>::type = 0」と書くのがC++11の定石です。デフォルト引数にダミーの 0 を与えることで、呼び出し元のシンタックスを汚さずにSFINAEを発動させています。',
          impact: '適合する型のみがオーバーロード候補に残り、型安全に分岐する',
          designIntent: '手作業で関数を何十個も書かず、整数・小数の最適バイト書き込みを1行で集約'
        },
        {
          stepNumber: 2,
          title: 'C++20 Concepts による可読性革命を体感する',
          description: 'C++20では「NetworkInteger auto val」のように、関数の引数型そのものに制約（コンセプト）を直接書けるようになりました。これにより、暗号めいた enable_if は一切不要になり、コードの可読性が10倍向上しています。',
          impact: '関数のシグネチャが一目で分かり、コンパイルエラーも1行で明快に出力される',
          designIntent: '読解コストと保守コストを激減させ、API利用者に親切な設計を実現'
        }
      ]
    },
    {
      id: 'step7-error-monster',
      title: '7.4 コンパイルエラー怪獣の退治法：100行のエラーから「最初の1行」を特定する',
      leadText: 'テンプレートのコンパイルエラーはなぜあんなに長大なのか？パニックにならずに核心を突くデバッグの作法を学びます。',
      explanationText: `
### テンプレートエラーを読むプロの「視線誘導」

テンプレートのエラーが出たとき、コンソールには100行〜200行のログが一瞬で流れていきます。
このとき初心者は **「一番下にスクロールして最後の行を読もうとする」** ため、混乱して自爆します。

#### 鉄則：一番上まで戻り、「error: no matching function」の直後を見よ！

\`\`\`
// ❌ 画面下部に並ぶ数十行のログ（これは単なる「候補から落ちた理由の言い訳リスト」に過ぎない）
note: candidate template ignored: requirement 'std::is_integral<Player>::value' was not satisfied
note: candidate template ignored: requirement 'std::is_floating_point<Player>::value' was not satisfied
...

// ⭕ 一番上にある「最初の真実」を見よ！
error: no matching function for call to 'write(PacketBuffer&, Player&)'
note: candidate template ignored: constraints not satisfied [with T = Player]
\`\`\`

1. **第1着眼点（最上部）**:
   - \`no matching function for call to 'write(buf, player)'\`
   - ➔ **「どの関数を、どんな型の引数で呼ぼうとして失敗したか？」** が一発で分かります。
2. **第2着眼点（直下の note）**:
   - \`candidate template ignored: requirement '...' was not satisfied\`
   - ➔ コンパイラが「この関数を当てはめようとしたが、型制約（門番）に引っかかって脱落したよ」と教えてくれています。
3. **解決策の特定**:
   - 引数に渡した \`Player\` は整数でも浮動小数点でも文字列でもないため、全オーバーロードから脱落したことが判明します。
   - ➔ 対策：「Player 用のシリアライズオーバーロードを新設する」か「Player に serialize() メソッドを生やす」のどちらかが必要だと確定できます！
      `,
      takeaways: [
        {
          title: 'テンプレートエラーは「下」ではなく「最上部」を見る',
          description: '下部に並ぶ大量のログは「候補から外れた理由の言い訳」です。一番上にある「呼び出そうとした関数名と渡された型」こそが全ての根本原因です。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r7-1',
      question: '以下のテンプレート宣言において、この関数本来の「戻り値型（Return Type）」はどれでしょう？\n\ntemplate <typename T>\ntypename std::enable_if<std::is_integral<T>::value, double>::type\ncalculateBonus(T level);',
      options: [
        'void',
        'double',
        'int',
        'std::is_integral<T>'
      ],
      correctIndex: 1,
      explanation: '正解です！「std::enable_if<条件, 型>::type」の第2引数に指定された型（この場合は double）が、条件を満たしたときに本来の戻り値型として実体化されます。「玉ねぎの皮むき法」で外側の装飾を剥がすと、戻り値が double であることが見抜けます。'
    },
    {
      id: 'q-r7-2',
      question: 'C++の言語仕様「SFINAE（Substitution Failure Is Not An Error）」の挙動として正しい説明はどれでしょう？',
      options: [
        'テンプレート引数の代入時にエラーが発生した場合、即座にコンパイルが停止してエラーログを出力する',
        'テンプレート引数の代入に失敗した関数は、コンパイルエラーにせず「オーバーロードの候補リストから静かに除外」され、他の候補関数が探索される',
        '実行時に try-catch で例外を捕捉して安全に回避する仕組みのこと',
        'メモリリークを自動検出して解放するガベージコレクタの機能のこと'
      ],
      correctIndex: 1,
      explanation: '正解です！SFINAEの本質は「代入失敗はエラーにあらず」です。条件を満たさないテンプレートは単に候補から脱落するだけでエラーにならないため、条件ごとに複数のテンプレートを安全に出し分けることができます。'
    },
    {
      id: 'q-r7-3',
      question: 'テンプレート関数を呼び出した際に100行を超える長大なコンパイルエラーが出力されました。プロの開発者が最初に取るべき視線誘導はどれでしょう？',
      options: [
        'コンソールの一番下までスクロールして、最後の行のエラーメッセージを読む',
        'コンソールを一番上までスクロールし、最初の「error: no matching function for call to ...」と渡された引数の型を確認する',
        'とりあえず clean ビルドをしてもう一度コンパイルしてみる',
        'C++のコンパイラを再インストールする'
      ],
      correctIndex: 1,
      explanation: '正解です！テンプレートエラーの下部に並ぶ大量のログは「候補から脱落した理由（言い訳）」の羅列です。一番上にある「どの関数を、どの型で呼び出そうとしたのか」を確認するのが最短解決の鉄則です。'
    },
    {
      id: 'q-r7-4',
      question: '古典C++の「std::enable_if」による型制約と比較して、モダンC++20の「Concepts（コンセプト）/ requires節」を採用する最大の利点は何でしょう？',
      options: [
        '実行速度が100倍高速になる',
        '暗号のようなマクロやenable_ifのネストが不要になり、平易な英語構文で型制約を記述でき、エラーメッセージも極めて明快になる',
        'テンプレートを使わずに動的ポリモーフィズム（virtual）に自動変換される',
        'ヘッダファイルを一切 include しなくても動くようになる'
      ],
      correctIndex: 1,
      explanation: '正解です！Concepts はSFINAEの複雑怪奇なハックを過去のものにするためにC++20で導入された最高峰の言語機能です。コードが読みやすくなるだけでなく、コンパイラも「どのコンセプトを満たしていないか」を1行で明快に報告してくれるようになります。'
    }
  ]
};
