import { Chapter } from '../../types/curriculum';

export const chapterL13: Chapter = {
  id: 21,
  slug: 'chapter-classic-13-asset-manager',
  courseTrack: 'classic',
  courseChapterCode: 'C13',
  title: 'レガシー第13章：アセット管理とリソースキャッシュ設計',
  subtitle: '二重読み込み防止・ハンドル型参照・Flyweightキャッシュパターン',
  badge: 'レガシーC++ L13：アセット管理',
  gameVersion: 'v2_classes',
  description: '敵キャラクターや弾幕、BGMや効果音が大量に登場する本格ゲームでは、「オブジェクトが生成されるたびにファイルから画像や音声をロードする」という素朴な設計は瞬時にメモリ破綻と激しいロードスパイクを引き起こします。本章では、デザインパターンの要である【Flyweight（フライウェイト）パターン】を導入し、何千体もの敵が同一のテクスチャデータをメモリ上で安全に共有するキャッシュアーキテクチャを構築します。さらに、生ポインタの危険性（誰が解放したかわからずクラッシュするダングリングポインタ）を排除するための【世代番号付きハンドル参照（Handle Idiom）】や、C++03環境でも堅牢に動く【参照カウント式ResourceManager】を設計・実装します。',
  prevChapterSlug: 'chapter-12-game-engine-architecture',
  nextChapterSlug: 'chapter-classic-14-spatial-partitioning',
  sections: [
    {
      id: 'sec-l13-duplicate-loading',
      title: 'L13.1 「敵を作るたびにテクスチャ読込」の悲劇：メモリ爆発とダングリングポインタ',
      leadText: 'なぜゲームエンティティ自身にテクスチャを持たせてはいけないのか？メモリ重複と破棄タイミングの破綻を徹底解明します。',
      dialogueBefore: [
        {
          id: 'dl13-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！インベーダーを100体画面に出したら、メモリ使用量が2GBを超えてPCがフリーズしかけました！敵1体の画像はたった500KBのはずなのに…！'
        },
        {
          id: 'dl13-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！敵クラスのコンストラクタで、毎回 "loadTexture(\\"invader.png\\")" と愚直にディスクから画像を読み込んでおるじゃろ？'
        },
        {
          id: 'dl13-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ギクッ！はい…敵ごとに Texture* texture = new Texture("invader.png"); とやっていました。しかも敵が倒されたときに delete texture; したら、まだ生き残っている他の敵の画像が化けてクラッシュしてしまいました…！'
        },
        {
          id: 'dl13-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '個々のゲームオブジェクト（寿命が短い）と、アセットリソース（寿命が長い・共有されるべき）のライフサイクルをごちゃ混ぜにしているのが原因じゃ！共有される重いデータは【リソースマネージャー】が一元管理し、個々のオブジェクトには「共有リソースへの軽い参照」だけを持たせるのがプロの鉄則じゃ！'
        }
      ],
      paradigmComparison: {
        title: '素朴なエンティティ内リソース保持 vs Flyweight リソースマネージャー',
        cApproach: {
          title: '❌ 個々のエンティティが独自に画像データを保持（メモリ爆発・二重解放）',
          code: `// 個々の敵がそれぞれ独自にテクスチャメモリを所有してしまう
class BadEnemy {
    Texture* texture; // 毎回 new Texture("invader.png") (数MB)
public:
    BadEnemy() {
        texture = new Texture("assets/invader.png"); // 毎回ディスク読込！
    }
    ~BadEnemy() {
        delete texture; // ⚠️ 共有ポインタを渡されていたら二重解放で即死！
    }
};`,
          drawbacks: [
            '敵100体で100回ディスクI/Oが走り、ロード時間が激増する',
            '全く同じ画像データが100個分メモリに複製され、VRAM/RAMが即座に枯渇する',
            'ある敵がデストラクタで delete した瞬間、他の敵が参照するポインタが不正（ダングリング）になる'
          ]
        },
        cppApproach: {
          title: '⭕ Flyweightキャッシュ ＋ 一元化ResourceManager（共有と軽量化）',
          code: `// リソースはマネージャーが1個だけキャッシュし、敵は軽量な参照のみを保持
class GoodEnemy {
    ResourceHandle textureHandle; // たった4〜8バイトのID！
public:
    GoodEnemy(ResourceManager& mgr) {
        // すでにロード済みなら既存の同一インスタンスを即座に返す
        textureHandle = mgr.acquireTexture("assets/invader.png");
    }
    void render(Renderer& r) {
        r.drawSprite(textureHandle, x, y);
    }
};`,
          benefits: [
            '同じ画像はメモリ上に1枚しか存在せず、メモリ消費量を最小限に抑えられる',
            '初回のみディスクロードし、2回目以降はキャッシュからO(1)で即座に返却',
            '個々の敵が死んでもテクスチャは消えず、ステージ終了時に一括安全破棄される'
          ]
        },
        paradigmShiftNotes: '「誰がリソースを所有しているのか（Ownership）」を明確にすることがC++リソース管理の真髄です。'
      },
      explanationText: 'Flyweight（フライウェイト）パターンとは、大量のオブジェクトが存在するときに、それら全体で共有できる不変（Immutable）な部分を外に抽出し、メモリ消費量を劇的に削減するデザインパターンです。ゲームプログラミングにおいては、テクスチャ、3Dメッシュ、効果音バッファ、フォントデータなどが代表的なFlyweight対象となります。'
    },
    {
      id: 'sec-l13-flyweight-pattern',
      title: 'L13.2 Flyweightパターン：固有状態（Extrinsic）と共有状態（Intrinsic）の完全分離',
      leadText: 'オブジェクトの状態を「全員同じ部分」と「個体ごとに違う部分」に外科手術のように切り分けます。',
      dialogueBefore: [
        {
          id: 'dl13-5',
          speaker: 'penguin',
          emotion: 'question',
          text: '「固有状態（Extrinsic State）」と「共有状態（Intrinsic State）」って、どう分ければいいんですか？'
        },
        {
          id: 'dl13-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '簡単じゃ！「画面上の全敵が同じもの」は共有状態、「敵Aと敵Bで異なるもの」は固有状態じゃ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '共有状態（Intrinsic State）の抽出',
          description: 'テクスチャピクセル配列、画像サイズ（幅・高さ）、頂点バッファ、オーディオ波形データなど、読み取り専用で全個体に共通するデータを Resource クラスに集約します。',
          impact: 'メモリ消費量をオブジェクト数 N から 定数 1 に削減'
        },
        {
          stepNumber: 2,
          title: '固有状態（Extrinsic State）の局所化',
          description: '現在座標 (x, y)、現在のHP、現在のアニメーションコマ番号、移動速度ベクトルなど、個体ごとに変化するパラメータのみを Enemy インスタンスに残します。',
          impact: 'Enemy クラスのサイズが数百KBから数十バイトに激減し、CPUキャッシュ効率が跳ね上がる'
        },
        {
          stepNumber: 3,
          title: '描画時の結合（Context Passing）',
          description: '描画する瞬間だけ、Enemy の固有状態（x, y）と、共有リソースのテクスチャハンドルをレンダラに渡して描画命令を発行します。',
          impact: '完全な疎結合と爆速のレンダリングパイプラインを両立'
        }
      ]
    },
    {
      id: 'sec-l13-handle-idiom',
      title: 'L13.3 生ポインタを捨てよ：世代番号付きハンドル参照（Handle Idiom）',
      leadText: 'Texture* や Sound* のような生ポインタをゲームエンティティに持たせるのがなぜ危険なのか、ハンドル参照の優位性を学びます。',
      dialogueBefore: [
        {
          id: 'dl13-7',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'リソースマネージャーがテクスチャを1つ持っているなら、敵には Texture* を渡せばいいんじゃないですか？ポインタのコピーなら8バイトで済みますよね？'
        },
        {
          id: 'dl13-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ステージクリア時にリソースマネージャーが「ステージ1のテクスチャを全破棄」した時、もし敵の残骸や遅延エフェクトが生ポインタを保持していたらどうなる？'
        },
        {
          id: 'dl13-9',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ああっ！すでに解放されたメモリを指す「ダングリングポインタ」になって、アクセスした瞬間にクラッシュ（アクセスバイオレーション）します！'
        },
        {
          id: 'dl13-10',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そこで登場するのが【世代番号付きハンドル（Generational Handle）】じゃ！インデックス番号と世代カウンタをパックした整数構造体を使うことで、リソースが破棄・再割り当てされたことを100%安全に検知できるのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'ResourceHandle.h',
          language: 'cpp',
          description: 'インデックスと世代番号（Generation）を内包する堅牢なハンドル構造体',
          isMain: true,
          code: `#ifndef RESOURCE_HANDLE_H
#define RESOURCE_HANDLE_H

#include <stdint.h>

// 32ビットの整数に [世代番号 16bit | スロット番号 16bit] をパック
struct ResourceHandle {
    uint32_t id;

    ResourceHandle() : id(0) {}
    ResourceHandle(uint16_t index, uint16_t generation) {
        id = (static_cast<uint32_t>(generation) << 16) | static_cast<uint32_t>(index);
    }

    uint16_t getIndex() const {
        return static_cast<uint16_t>(id & 0xFFFF);
    }

    uint16_t getGeneration() const {
        return static_cast<uint16_t>((id >> 16) & 0xFFFF);
    }

    bool isValid() const {
        return id != 0;
    }

    bool operator==(const ResourceHandle& other) const { return id == other.id; }
    bool operator!=(const ResourceHandle& other) const { return id != other.id; }
};

#endif // RESOURCE_HANDLE_H`
        }
      ]
    },
    {
      id: 'sec-l13-resource-manager',
      title: 'L13.4 実装編：レガシー参照カウント式ResourceManagerの完全構築',
      leadText: '同一ファイルの再ロードを防ぐ文字列キャッシュと、参照カウンタによる自動パージ機構を実装します。',
      codeFiles: [
        {
          filename: 'ResourceManager.cpp',
          language: 'cpp',
          description: 'Flyweightキャッシュと参照カウント管理を備えたリソースマネージャー',
          isMain: true,
          code: `#include <iostream>
#include <string>
#include <map>

struct TextureResource {
    std::string filename;
    int width;
    int height;
    int refCount; // 参照カウンタ

    TextureResource(const std::string& name) 
        : filename(name), width(64), height(64), refCount(1) {
        std::cout << "[Disk I/O] テクスチャ読込: " << filename << " (メモリ確保)" << std::endl;
    }

    ~TextureResource() {
        std::cout << "[VRAM Release] テクスチャ破棄: " << filename << std::endl;
    }
};

class ResourceManager {
private:
    std::map<std::string, TextureResource*> cache_;

public:
    ~ResourceManager() {
        unloadAll();
    }

    // リソースの取得（未ロードなら新規ロード、ロード済みなら既存を共有）
    TextureResource* acquireTexture(const std::string& filepath) {
        std::map<std::string, TextureResource*>::iterator it = cache_.find(filepath);
        if (it != cache_.end()) {
            it->second->refCount++;
            std::cout << "[Cache HIT] " << filepath << " を再利用 (参照数: " 
                      << it->second->refCount << ")" << std::endl;
            return it->second;
        }

        // 新規ロード
        TextureResource* res = new TextureResource(filepath);
        cache_[filepath] = res;
        return res;
    }

    // リソースの返却（参照カウントを減らし、0になったら即時または遅延解放）
    void releaseTexture(const std::string& filepath) {
        std::map<std::string, TextureResource*>::iterator it = cache_.find(filepath);
        if (it == cache_.end()) return;

        it->second->refCount--;
        std::cout << "[Release] " << filepath << " 返却 (残り参照数: " 
                  << it->second->refCount << ")" << std::endl;

        if (it->second->refCount <= 0) {
            delete it->second;
            cache_.erase(it);
        }
    }

    void unloadAll() {
        for (std::map<std::string, TextureResource*>::iterator it = cache_.begin();
             it != cache_.end(); ++it) {
            delete it->second;
        }
        cache_.clear();
    }

    size_t getLoadedCount() const { return cache_.size(); }
};

int main() {
    ResourceManager mgr;
    std::cout << "=== 10体の敵を生成 ===" << std::endl;
    TextureResource* enemies[10];
    for (int i = 0; i < 10; ++i) {
        // 全員同じ画像を要求するが、ディスクロードは最初の1回だけ！
        enemies[i] = mgr.acquireTexture("sprites/invader.png");
    }

    std::cout << "\\nキャッシュ中テクスチャ総数: " << mgr.getLoadedCount() << std::endl;

    std::cout << "\\n=== 敵を順次撃破（解放） ===" << std::endl;
    for (int i = 0; i < 10; ++i) {
        mgr.releaseTexture("sprites/invader.png");
    }

    std::cout << "\\n全解放後のキャッシュ数: " << mgr.getLoadedCount() << std::endl;
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'Flyweightパターンの本質',
          description: '全エンティティ共通の不変データ（画像・音声）を一元キャッシュし、個体ごとの可変データ（座標・HP）と厳格に分離する。'
        },
        {
          title: '重複ロードの根絶',
          description: 'ファイルパスをキーにしたマップで管理し、同一アセットはメモリ上に唯一無二の1インスタンスのみを保証する。'
        },
        {
          title: '生ポインタからハンドルへの昇華',
          description: 'アンロード時のダングリングポインタ事故を防ぐため、世代番号付きハンドルや参照カウント機構を設ける。'
        },
        {
          title: 'フォールバック機構の常備',
          description: 'ファイルが存在しない・破損している場合にクラッシュさせず、目立つ代替色（ピンク紫市松模様など）を表示して開発を止めない。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l13-1',
      question: 'ゲームプログラミングにおいて、Flyweightパターンを適用する主な目的として最も適切なものはどれですか？',
      options: [
        'ゲームループのフレームレートを固定化するため',
        '大量のオブジェクト間で共通する不変データを共有し、メモリ消費量とロード負荷を激減させるため',
        '仮想関数の呼び出しオーバーヘッドをゼロにするため',
        'マルチスレッドにおけるデッドロックを防止するため'
      ],
      correctIndex: 1,
      explanation: 'Flyweightパターンは、多数のオブジェクトが共通して持つ重いデータ（テクスチャピクセルや音声波形など）を共有キャッシュにまとめ、各オブジェクトには軽い識別子のみを持たせることでメモリを劇的に節約する手法です。'
    },
    {
      id: 'quiz-l13-2',
      question: '生ポインタ（Texture*）の代わりに「世代番号付きハンドル（Generational Handle）」を使用する最大の利点は何ですか？',
      options: [
        'ポインタよりも消費メモリが常に小さくなるため',
        'リソースが破棄された後や別のリソースに再利用された後にアクセスしても、無効な参照であることを確実に検知できるため',
        'コンパイル時の型チェックを完全に無効化できるため',
        'ディスクからの読み込み速度が物理的に2倍になるため'
      ],
      correctIndex: 1,
      explanation: 'スロットのインデックスに加えて「世代番号（Generation）」を保持することで、古いリソースが破棄された後に同じスロットが再利用された場合でも世代番号の不一致によってダングリングアクセスを100%検知・防御できます。'
    },
    {
      id: 'quiz-l13-3',
      question: 'リソースマネージャーの実装において、ロード対象の画像ファイルが見つからなかった場合の商用ゲームでの推奨設計はどれですか？',
      options: [
        '即座に std::abort() または assert() でゲームをクラッシュさせる',
        'nullptr を返し、呼び出し側がNULLチェックしていない箇所でSEGVを引き起こす',
        '目立つダミー画像（マゼンタのチェッカー模様など）をフォールバックとして返し、警告ログを出力してゲームは継続させる',
        '見つかるまで無限ループでディスクを再試行し続ける'
      ],
      correctIndex: 2,
      explanation: '商用ゲームエンジン（Unreal EngineやSource Engineなど）では、アセット欠損時にゲームを落とすのではなく、一目で未ロードとわかる「マゼンタと黒の市松模様（Missing Texture）」をフォールバックとして返す設計が一般的です。'
    }
  ]
};
