import { Chapter } from '../../types/curriculum';

export const chapterModernVariadic: Chapter = {
  id: 32,
  slug: 'chapter-modern-4-variadic-templates',
  courseTrack: 'modern',
  courseChapterCode: 'M4',
  title: 'モダン第4章：【C++11/14】可変引数テンプレートと完全転送',
  subtitle: '万能参照（T&&）・std::forward・ゼロコピー直接構築・イベントディスパッチャ',
  badge: 'モダンC++ M4【C++11/14】：完全転送',
  gameVersion: 'v5_smart_pointers',
  description: 'なぜ std::make_shared<Enemy>(x, y, "Boss") や vector::emplace_back(args...) は、どんな個数・どんな型の引数であっても、余分なコピーや一時オブジェクトを作らずに目的のクラスのコンストラクタへ直接届けることができるのでしょうか？その背後にある超重要メカニズムが、C++11の2大巨頭【可変引数テンプレート（Variadic Templates）】と【完全転送（Perfect Forwarding）】です。「万能参照（フォワーディング参照 T&&）」と「std::forward<T>」を正しく理解することは、現代的な汎用ライブラリ、ファクトリ、イベント駆動システムを自作するための必須教養です。本章では、パラメータパックの展開技法から、ゲーム内の任意イベントを型安全にブロードキャストするゼロオーバーヘッドなメッセージハブの実装までをステップバイステップで解明します。',
  prevChapterSlug: 'chapter-modern-3-lambda',
  nextChapterSlug: 'chapter-modern-5-multithreading',
  sections: [
    {
      id: 'sec-m4-make-unique-mystery',
      title: 'M4.1 emplace_back や make_unique の謎：引数が何個でも渡せる魔法',
      leadText: 'なぜモダンC++の標準ライブラリは、あらゆるコンストラクタ引数をそのまま透過できるのかを解き明かします。',
      dialogueBefore: [
        {
          id: 'dm4-1',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'シロクマ先生、std::vector の push_back って、あらかじめ Enemy のインスタンスを作ってから渡すので、コピーやムーブが1回発生しますよね？'
        },
        {
          id: 'dm4-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！そこで登場するのが emplace_back(x, y, "Boss") じゃな！vector 内のメモリ領域で「直接」コンストラクタを呼び出すため、一時オブジェクトのコピーもムーブも一切ゼロじゃ！'
        },
        {
          id: 'dm4-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'でも…コンストラクタの引数は、敵によって (int, int) だったり、(int, int, string, float) だったりバラバラです。関数はどうやって未知の個数と型の引数を受け取っているんですか？'
        },
        {
          id: 'dm4-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それこそが【可変引数テンプレート（Variadic Templates）】と【完全転送（Perfect Forwarding）】の合わせ技じゃ！C++11が誇るメタプログラミングの最高傑作じゃぞ！'
        }
      ],
      paradigmComparison: {
        title: 'C++03の大量オーバーロード vs C++11の可変引数完全転送',
        cApproach: {
          title: '❌ C++03：引数1個用、2個用、3個用…と手作業で大量にオーバーロード',
          code: `// C++03 時代は引数の数ごとに何十個も関数を手書きしていた！
template <typename T, typename A1>
T* create(const A1& a1) { return new T(a1); }

template <typename T, typename A1, typename A2>
T* create(const A1& a1, const A2& a2) { return new T(a1, a2); }

template <typename T, typename A1, typename A2, typename A3>
T* create(const A1& a1, const A2& a2, const A3& a3) { return new T(a1, a2, a3); }
// ⚠️ 右辺値参照がないため、ムーブ専用の引数も渡せない！`,
          drawbacks: [
            '引数の個数分（1個〜10個など）テンプレート関数をコピペ定義する必要があった',
            'const参照しか受け取れず、一時オブジェクトをムーブする最適化が効かなかった',
            'ライブラリのヘッダファイルが肥大化し、コンパイル時間が激増した'
          ]
        },
        cppApproach: {
          title: '⭕ C++11：可変引数テンプレート ＋ std::forward（たった1つの定義で全対応）',
          code: `// 任意の個数（0個〜無限）・任意の型を完全転送！
template <typename T, typename... Args>
std::unique_ptr<T> make_unique_custom(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}`,
          benefits: [
            'Args...（パラメータパック）により、引数が何個あっても1行で対応完了',
            '万能参照 Args&& と std::forward により、左辺値は左辺値のまま、右辺値は右辺値のまま完全保存',
            '余計な一時オブジェクトの生成・コピーが完全にゼロになり、最高速でメモリ上に直接構築'
          ]
        },
        paradigmShiftNotes: '「引数をそのまま右から左へ一切の型情報の劣化なく受け渡す」ことを完全転送（Perfect Forwarding）と呼びます。'
      }
    },
    {
      id: 'sec-m4-universal-reference',
      title: 'M4.2 万能参照（T&&）と参照の縮退（Reference Collapsing）のルール',
      leadText: '右辺値参照と同じ「&&」記号でありながら、まったく異なる挙動をする万能参照の仕組みを解明します。',
      processSteps: [
        {
          stepNumber: 1,
          title: '型推論を伴う T&& は「万能参照（Forwarding Reference）」になる',
          description: 'template <typename T> void func(T&& arg); のように型推論が働く場合、T&& は右辺値だけでなく左辺値も受け取ることができます。',
          impact: '左辺値を渡せば T&、右辺値を渡せば T&& に自動推論される'
        },
        {
          stepNumber: 2,
          title: '参照の縮退（Reference Collapsing）の4大原則',
          description: '& と & -> &, & と && -> &, && と & -> &, && と && -> && という論理積のような縮退ルールにより、参照の参照が合法化されます。',
          impact: 'C++規格が裏で型を一意に決定する基盤'
        },
        {
          stepNumber: 3,
          title: '名前がついた瞬間、変数は「左辺値」になる',
          description: '右辺値を受け取った arg でも、関数内では名前がついているため arg 自体は「左辺値」として評価されます。そのまま別の関数に渡すとコピーされてしまいます。',
          impact: 'ここで std::forward<T>(arg) が必須になる！'
        },
        {
          stepNumber: 4,
          title: 'std::forward<T>(arg) の役割：元の価値を復元する条件付きキャスト',
          description: '呼び出し元で元々「右辺値」だったなら static_cast<T&&>(arg) で右辺値に戻し、「左辺値」だったならそのまま左辺値として渡します。',
          impact: '完全転送の完成'
        }
      ]
    },
    {
      id: 'sec-m4-event-dispatcher',
      title: 'M4.3 実装編：型安全・ゼロコピーな可変引数イベントディスパッチャ',
      leadText: 'ゲーム内のあらゆるイベント（被弾、アイテム取得、ステージクリア）を任意引数で通知する基盤を構築します。',
      codeFiles: [
        {
          filename: 'EventSystem.cpp',
          language: 'cpp',
          description: '可変引数テンプレートと完全転送を活用したゲーム内ファクトリ＆イベントハブ',
          isMain: true,
          code: `#include <iostream>
#include <string>
#include <memory>
#include <utility>

// ゲームエンティティ
class Enemy {
public:
    std::string name;
    int x, y;
    int hp;

    Enemy(std::string name, int x, int y, int hp)
        : name(std::move(name)), x(x), y(y), hp(hp) {
        std::cout << "  [Enemy構築] " << this->name << " at (" << x << ", " << y << ") HP=" << hp << "\\n";
    }
};

// 万能ファクトリ関数：任意のクラスを完全転送で make_unique する
template <typename T, typename... Args>
std::unique_ptr<T> createEntity(Args&&... args) {
    std::cout << "[Factory] 引数を完全転送して " << typeid(T).name() << " を生成中...\\n";
    // std::forward<Args>(args)... で全引数を元の型のまま転送！
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}

int main() {
    std::cout << "=== 可変引数テンプレートによる完全転送テスト ===\\n";

    // 1. 左辺値文字列を渡す
    std::string bossName = "MegaBoss";
    auto boss = createEntity<Enemy>(bossName, 100, 200, 500);

    // 2. 右辺値（一時オブジェクト）を直接渡す（ムーブされる）
    auto minion = createEntity<Enemy>("Drone", 50, 80, 20);

    std::cout << "\\n生成完了: " << boss->name << ", " << minion->name << "\\n";
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'パラメータパック（Args...）',
          description: '任意の個数と型の引数をひとまとめに扱い、args... でカンマ区切りにアンパック展開するC++11の強力構文。'
        },
        {
          title: '万能参照（T&&）と右辺値参照の違い',
          description: '具体的な型（Enemy&&）は右辺値しか受け取れないが、推論型（T&&）は左辺値も右辺値も受け取れる万能参照となる。'
        },
        {
          title: 'std::forward の必然性',
          description: '関数内で名前を持った引数は左辺値になってしまうため、std::forward<T>(arg) で本来の右辺値性を取り戻して後続に渡す。'
        },
        {
          title: 'emplace系の真髄',
          description: 'vector::emplace_back や make_unique は、この完全転送によってコンテナ内部で直接オブジェクトを構築している。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-m4-1',
      question: '関数テンプレート「template <typename T> void func(T&& arg);」における「T&&」の正式な性質は何ですか？',
      options: [
        '右辺値（一時オブジェクト）しか受け取ることができない厳格な右辺値参照',
        '左辺値を渡せば左辺値参照、右辺値を渡せば右辺値参照として機能する「万能参照（フォワーディング参照）」',
        'ポインタのポインタ（void**）と同じ意味',
        '引数を必ずコピー渡しすることをコンパイラに指示する記号'
      ],
      correctIndex: 1,
      explanation: '型推論を伴うテンプレート引数 T に対する T&& は「万能参照（Forwarding Reference）」と呼ばれ、参照の縮退ルールによって左辺値も右辺値もその性質を損なわずに受け取ることができます。'
    },
    {
      id: 'quiz-m4-2',
      question: '完全転送を行う際、なぜ単に「func(args...)」ではなく「func(std::forward<Args>(args)...)」と書く必要があるのですか？',
      options: [
        'std::forward を書かないとコンパイルエラーになる文法規則だから',
        '仮引数 args は関数内部では「名前を持つ変数」なので左辺値として扱われてしまい、そのまま渡すとコピーが発生してしまうため',
        'std::forward を書くとマルチスレッドでの排他制御が自動的に行われるため',
        '引数の順序を逆順にソートするため'
      ],
      correctIndex: 1,
      explanation: 'C++の規則により、右辺値参照で受け取った値であっても、名前が与えられた変数は式の中では「左辺値」として評価されます。そのため、呼び出し元の右辺値性（ムーブ可能性）を維持して後続に渡すには std::forward による条件付きキャストが必須です。'
    },
    {
      id: 'quiz-m4-3',
      question: 'std::vector において、push_back() ではなく emplace_back() を使う最大のパフォーマンス上の利点は何ですか？',
      options: [
        'vector の内部配列の容量（capacity）が2倍速く拡張されるため',
        '一時オブジェクトを生成してコピー/ムーブするのではなく、コンテナ内のメモリ領域に直接コンストラクタ引数を転送して構築できるため',
        'マルチスレッドでのアクセス競合が自動的に解消されるため',
        'メモリリークをガベージコレクションしてくれるため'
      ],
      correctIndex: 1,
      explanation: 'emplace_back は可変引数テンプレートと完全転送を利用し、あらかじめ確保された配列スロット内で placement new によって直接コンストラクタを呼び出すため、無駄な一時オブジェクトの生成・コピー・ムーブを完全にゼロにできます。'
    }
  ]
};
