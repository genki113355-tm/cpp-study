import { Chapter } from '../../types/curriculum';

export const chapterModernStringView: Chapter = {
  id: 34,
  slug: 'chapter-modern-6-string-view',
  courseTrack: 'modern',
  courseChapterCode: 'M6',
  title: 'モダン第6章：【C++17】ゼロコピー文字列革命：std::string_view',
  subtitle: '文字列を関数に渡すたびに発生するヒープアロケーション（malloc/new）の撲滅',
  badge: 'モダンC++ M6【C++17】：ゼロコピー文字列',
  gameVersion: 'v5_smart_pointers',
  description: '文字列を関数に渡す際、レガシーC++では const std::string& を使うのが常識とされてきました。しかし、文字列リテラル（"laser.png"）や C言語形式の const char* を渡すたびに、std::string の一時オブジェクトが生成され、裏で暗黙のヒープメモリ確保（malloc/new）が走るという致命的な落とし穴が存在します。何万回ものアセット名照合やテキスト描画でこれが起きると、激しいヒープ断片化とフレーム落ち（GCスパイクに似た停止）の原因になります。C++17で導入された std::string_view は、文字列の「ポインタと長さ」だけを保持するわずか16バイトの超軽量ビューです。文字列のコピーやアロケーションを完全ゼロ（O(1)）にし、部分文字列の切り出し（substr）も一瞬で完了します。本章では、その驚異的なメモリ構造から、現場プロが最も警戒すべき「ダングリング参照」や「null終端文字（\\0）の不在」という落とし穴までを徹底解剖します。',
  prevChapterSlug: 'chapter-modern-5-multithreading',
  nextChapterSlug: 'chapter-modern-4-modern-type-system',
  sections: [
    {
      id: 'sec-m6-pain-of-string-copy',
      title: 'M6.1 なぜ const std::string& では不十分なのか？（暗黙アロケーションの罠）',
      leadText: '現代C++において const std::string& が抱える隠れたコストと、文字列リテラル受け渡し時の罠を解剖します。',
      dialogueBefore: [
        {
          id: 'dm6-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！「効果音を再生する関数 playSound(const std::string& name)」を作って、弾を撃つたびに playSound("laser_shoot") と呼んでいたら、プロファイラで毎フレーム malloc が連発して警告が出ました！参照渡し（&）だからコピーは起きていないはずなのに何故ですか！？'
        },
        {
          id: 'dm6-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそが全C++プログラマが一度はハマる【暗黙の一時オブジェクト生成】の罠じゃ！"laser_shoot" は const char[12]（文字列リテラル）じゃな。一方、関数の引数は std::string への参照じゃ。型が違うじゃろ？'
        },
        {
          id: 'dm6-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ああっ！const char* から std::string に変換するために、見えないところで一時的な std::string が new されてヒープメモリが確保されていたんですか！？'
        },
        {
          id: 'dm6-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！関数を抜ければその一時文字列は即座に delete される。毎秒60フレーム、弾が出るたびに new と delete を繰り返せばヒープはズタズタじゃ。この問題を根本解決するために C++17 で生み出されたのが【std::string_view】なのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'const std::string& vs std::string_view の引数渡し',
        cApproach: {
          title: '❌ const std::string& （リテラル渡しで暗黙のヒープ確保が発生）',
          code: `// 引数は std::string 参照
void playSound(const std::string& assetName) {
    // 再生処理
}

// 呼び出し側
playSound("laser_fire.wav"); 
// ⚠️ "laser_fire.wav" (const char*) から std::string 一時オブジェクトが構築！
// 内部で malloc() が走り、関数終了時に free() される。
// 毎フレーム呼ぶと深刻なフレーム落ちとメモリ断片化！`,
          drawbacks: [
            '文字列リテラルや char 配列を渡すたびに一時 std::string が作られヒープ確保が発生',
            '部分文字列（substr）を切り出すと、また新しい std::string がヒープにコピー確保される',
            'C言語APIの const char* と std::string の間で常に型変換コストがかかる'
          ]
        },
        cppApproach: {
          title: '✨ C++17 std::string_view （ゼロコピー＆ヒープ確保ゼロ）',
          code: `#include <string_view>

// ポインタとサイズだけを受け取る超軽量ビュー（値渡しがベストプラクティス）
void playSound(std::string_view assetName) {
    // 再生処理
}

// 呼び出し側
playSound("laser_fire.wav");
// 🚀 一切のヒープ割り当てなし！
// 文字列リテラルの先頭アドレスと文字長 (14) がレジスタで直接渡される！`,
          benefits: [
            '文字列リテラル、std::string、char配列のいずれを渡しても一切メモリコピーが発生しない',
            'substr() で部分文字列を切り出しても、ポインタと長さをズラすだけで O(1) ゼロコスト',
            'sizeof(std::string_view) はポインタ＋サイズの 16バイト（64bit環境）。値渡しが最も高速'
          ]
        },
        paradigmShiftNotes: 'std::string_view は文字列の所有権を持たず「ポインタ＋長さ」だけを保持します。これにより、あらゆる文字列表現を同一の関数でゼロコスト受領可能になります。'
      }
    },
    {
      id: 'sec-m6-string-view-internals',
      title: 'M6.2 std::string_view のメモリ構造：ポインタ＋長さの超軽量スライス',
      leadText: 'std::string_view の内部構造と、substr() がなぜ O(1) ゼロコストで実行できるのかを視覚的に紐解きます。',
      dialogueBefore: [
        {
          id: 'dm6-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'string_view の中身って、具体的にどうなっているんですか？'
        },
        {
          id: 'dm6-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '極めてシンプルじゃぞ！中身は【const char* ptr_】と【size_t length_】の2つのメンバ変数しかない。64bit CPUなら 8バイト ＋ 8バイト ＝ たったの 16バイト じゃ！'
        },
        {
          id: 'dm6-7',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'えっ！たったそれだけですか！？じゃあ文字列の一部を切り出す substr() を呼んだら何が起きるんですか？'
        },
        {
          id: 'dm6-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'std::string の substr() なら新しい文字列メモリを確保して文字を全部コピーするが、std::string_view の substr() は「先頭ポインタにオフセットを足し、長さを減らす」だけじゃ！1ナノ秒もかからぬ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'std::string の substr()：O(N) ヒープ確保と物理コピー',
          description: 'substr(9, 6) を呼ぶと、OSにメモリを要求（malloc）し、6文字を新しいバッファへ物理コピーします。毎秒何万回も走ると激しいGC/ヒープ断片化を引き起こします。',
          impact: '大きな文字列の切り出しやループ内での使用は厳禁'
        },
        {
          stepNumber: 2,
          title: 'std::string_view の substr()：O(1) ポインタシフトのみ',
          description: '先頭ポインタを +9 ズラし、長さを 6 に設定した新しい 16バイトの string_view 構造体を返すだけです。メモリコピーは 0 バイトです。',
          impact: '100MBのログファイルや巨大JSONのパースも一瞬で完了'
        },
        {
          stepNumber: 3,
          title: 'レジスタ直渡しによる関数呼び出しの極限最適化',
          description: '64bit ABIでは16バイト以下の構造体はCPUレジスタ（RAX, RDXなど）に直接乗せて関数へ渡されます。スタックメモリすら経由しません。',
          impact: '「値渡し（pass-by-value）」が const 参照渡しよりも高速になる'
        }
      ]
    },
    {
      id: 'sec-m6-dangling-danger',
      title: 'M6.3 【最重要・現場の落とし穴】ダングリング参照と null終端の不在',
      leadText: 'プロでも見落としがちな string_view の2大トラップ：「寿命切れ（未定義動作）」と「\\0 なし問題」を完全に回避する設計指針。',
      dialogueBefore: [
        {
          id: 'dm6-9',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！関数の戻り値で std::string_view を返したら、受け取った先で文字列が文字化けしてゲームがクラッシュしました……！'
        },
        {
          id: 'dm6-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '喝ーーーッ！それは string_view 初心者が100人中100人踏む【ダングリング・ポインタの罠】じゃ！関数内のローカル std::string を string_view で返してはおらんじゃろうな！？'
        },
        {
          id: 'dm6-11',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ギクッ！「std::string temp = "score_" + to_string(s); return temp;」としていました……！'
        },
        {
          id: 'dm6-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'temp は関数を抜けた瞬間にデストラクタでメモリが消滅する！返された string_view は「すでに死んだメモリの墓場」を指しているのじゃ！string_view は【所有権を持たない】。寿命管理の鉄則を今すぐ頭に刻み込むのじゃ！'
        }
      ],
      takeaways: [
        {
          title: '落とし穴1：一時オブジェクトの寿命切れ（ダングリング参照）',
          description: '関数の戻り値で string_view を返してよいのは、静的文字列リテラルか、呼び出し元より長生きするメンバ変数の参照時のみ。一時文字列（std::string）の戻り値は値で返すこと。'
        },
        {
          title: '落とし穴2：null終端文字（\\0）で終わっている保証がない',
          description: 'substr() した string_view の末尾には \\0 がありません。fopen(sv.data()) や printf("%s", sv.data()) など C言語APIに直接 .data() を渡すとバッファオーバーランでクラッシュします。'
        }
      ]
    },
    {
      id: 'sec-m6-game-app',
      title: 'M6.4 実戦：ゲーム内アセットファインダーと超高速テキストレンダラー',
      leadText: 'ゲームループ内で何千回も呼ばれるアセット検索とログパーサーを std::string_view で最適化します。',
      dialogueBefore: [
        {
          id: 'dm6-13',
          speaker: 'penguin',
          emotion: 'smug',
          text: '先生！ゲームループの毎フレーム、敵の種別名からテクスチャIDを引くマップ検索を string_view にしてみます！'
        },
        {
          id: 'dm6-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！std::string_view をキーとして検索できるようにすると、一時文字列の生成がゼロになり、GCレスな極限のフレームレート安定化が実現するぞ！'
        }
      ],
      codeFiles: [
        {
          filename: 'AssetLookup.cpp',
          language: 'cpp',
          description: 'std::string_view によるゼロアロケーションなアセット照合と拡張子判定',
          isMain: true,
          code: `#include <iostream>
#include <string_view>
#include <array>

struct AssetMetadata {
    std::string_view key;
    int textureId;
};

// コンパイル時 constexpr 配列でアセットテーブルを定義
constexpr std::array<AssetMetadata, 3> ASSET_TABLE = {{
    {"enemy_crab",   101},
    {"enemy_squid",  102},
    {"enemy_octopus", 103}
}};

// std::string_view 引数により、const char* でも std::string でもゼロコピーで検索可能
int findTextureId(std::string_view assetKey) {
    for (const auto& item : ASSET_TABLE) {
        if (item.key == assetKey) {
            return item.textureId;
        }
    }
    return -1; // Not Found
}

// 拡張子チェック関数（O(1) ゼロアロケーション）
bool isPngAsset(std::string_view filepath) {
    if (filepath.length() < 4) return false;
    return filepath.substr(filepath.length() - 4) == ".png";
}

int main() {
    std::cout << "--- M6 アセット照合システム ---" << std::endl;
    
    // 文字列リテラルで検索（アロケーション 0）
    int id1 = findTextureId("enemy_squid");
    std::cout << "enemy_squid Texture ID: " << id1 << std::endl;

    // 動的 std::string で検索（アロケーション 0）
    std::string dynamicKey = "enemy_crab";
    int id2 = findTextureId(dynamicKey);
    std::cout << "enemy_crab Texture ID: " << id2 << std::endl;

    // 拡張子判定
    std::cout << "laser.png is valid? " << std::boolalpha << isPngAsset("laser.png") << std::endl;
    std::cout << "laser.wav is valid? " << std::boolalpha << isPngAsset("laser.wav") << std::endl;

    return 0;
}`,
          highlightLines: [6, 17, 27, 36, 41]
        }
      ]
    }
  ]
};
