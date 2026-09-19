import { Chapter } from '../../types/curriculum';

export const chapterL11: Chapter = {
  id: 15,
  slug: 'chapter-11-memory-pool-allocator',
  courseTrack: 'classic',
  courseChapterCode: 'C11',
  title: 'レガシー第11章：独自メモリアロケータと固定長プール管理',
  subtitle: 'ゲーム現場のnew/delete禁止令！フラグメンテーション撲滅とO(1)爆速固定長メモリプール',
  badge: 'レガシーC++ L11：独自メモリプール',
  gameVersion: 'v2_classes',
  description: 'ゲーム開発の現場、とりわけコンシューマ機やリアルタイムアクションの現場には、古くから伝わる絶対の掟があります。それは「ゲームプレイのメインループ中に生 new や生 delete を絶対に呼んではならない」という禁止令です。OSの汎用メモリアロケータ（malloc/new）は、いつどこで空きメモリを探すか予測できず、突発的なフレーム落ち（スパイク）を引き起こします。さらに深刻なのが「メモリの断片化（フラグメンテーション）」です。メモリの空き総量は十分にあるのに、連続したメモリが確保できずゲームが強制クラッシュする恐怖のバグです。本章では、弾幕やパーティクルなどの同種オブジェクトを事前に一括確保し、空き領域自体をリンクリストとして再利用する伝説の技法【固定長メモリプール（Fixed-Size Memory Pool）】を徹底解剖。さらにC++の深淵である【プレースメントnew】と【明示的デストラクタ呼び出し】をマスターし、O(1)定数時間で爆速にメモリを切り売りするプロクオリティの独自アロケータを構築します。',
  prevChapterSlug: 'chapter-10-static-polymorphism-crtp',
  nextChapterSlug: 'chapter-12-game-engine-architecture',
  sections: [
    {
      id: 'sec-l11-fragmentation-hell',
      title: 'L11.1 なぜゲーム本編中の new/delete は厳禁されるのか？',
      leadText: 'OSシステムコールのオーバーヘッドと、長時間稼働でゲームを確実に死に至らしめる「メモリフラグメンテーション」の恐怖を解明します。',
      dialogueBefore: [
        {
          id: 'dl11-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生……！24時間耐久の放置デバッグテストをしていたら、起動して12時間経ったあたりで突然 std::bad_alloc でゲームがクラッシュしてしまいました……！タスクマネージャで見ると、メモリはまだ半分以上余っているのに、なぜ「メモリ不足」になるんですか！？'
        },
        {
          id: 'dl11-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそがゲームプログラマを夜通し震え上がらせる悪魔、【外部フラグメンテーション（メモリの断片化）】の仕業じゃ！'
        },
        {
          id: 'dl11-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '断片化……？メモリの空き容量があるのに確保できないって、どういうことですか？'
        },
        {
          id: 'dl11-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '本棚を想像してみよ。1冊分の隙間が100箇所にあっても、厚さ10冊分の全集はどこにも収まらぬじゃろ？弾やエフェクトを毎フレーム new と delete で無秩序に出し入れしておると、メモリ空間が虫食い状態（モザイク状）になり、連続した空き領域が全滅してしまうのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '毎フレームの new/delete vs 固定長メモリプール',
        cApproach: {
          title: '❌ 危険：毎フレーム new / delete（フラグメンテーションの温床）',
          code: `// 弾を発射するたびにOSのヒープを叩く
void shootBullet(float x, float y) {
    // 1. OSの汎用アロケータがヒープから空き領域を線形探索
    // 2. ミューテックスロックがかかりマルチスレッド競合が発生
    // 3. メモリが虫食い状に断片化
    Bullet* b = new Bullet(x, y);
    bullets.push_back(b);
}

void onBulletHit(Bullet* b) {
    // 解放しても周囲の空きメモリと統合できるとは限らない
    delete b;
}`,
          drawbacks: [
            'OSのカーネル/ヒープアロケータを呼び出すため、割り当てにかかる時間が非決定論的（100ns〜数ミリ秒のブレ）となり、フレーム落ちを招く',
            '様々なサイズのオブジェクトを new/delete すると、メモリが虫食い状（外部フラグメンテーション）になり、合計空き容量があっても割り当て不能に陥る',
            'マルチスレッド環境では malloc の内部ロックにより激しいスレッド競合が発生する'
          ]
        },
        cppApproach: {
          title: '⭕ 安全：固定長メモリプール（事前一括確保＆O(1)再利用）',
          code: `// ゲーム起動時に最大必要数（例: 2048個分）のメモリを1枚の板として一括確保！
MemoryPool<Bullet, 2048> bulletPool;

void shootBullet(float x, float y) {
    // 1. 配列の先頭から即座に1個取り出すだけ（O(1)定数時間・数ナノ秒！）
    // 2. OSシステムコールはゼロ！
    // 3. 断片化は原理的に100%発生しない！
    Bullet* b = bulletPool.allocate(x, y);
    bullets.push_back(b);
}

void onBulletHit(Bullet* b) {
    // プールのフリーリストの先頭に繋ぎ直すだけ（O(1)定数時間）
    bulletPool.deallocate(b);
}`,
          benefits: [
            'アロケート・デアロケートが数ステップのポインタ操作（O(1)）で完了し、実行速度が10〜50倍高速',
            'オブジェクトサイズが完全に均一なため、虫食い（断片化）が原理的に絶対に発生しない',
            '連続したメモリ領域（キャッシュローカリティ）に配置されるため、CPUのL1/L2キャッシュヒット率が劇的に向上する'
          ]
        },
        paradigmShiftNotes: '「動的にメモリをOSから借りる」のをやめ、「最初に必要な最大領域を一括確保して自前で小分けにする」のがゲームアーキテクチャの基本設計です。'
      },
      processSteps: [
        {
          stepNumber: 1,
          title: '連続メモリ領域の一括確保',
          description: 'ゲーム起動時に最大想定数のメモリ領域を連続した1つの配列として確保します。',
          codeSnippet: 'alignas(alignof(T)) uint8_t memoryBuffer[sizeof(T) * CAPACITY];',
          impact: 'ゲーム本編中にOSへメモリ割り当てシステムコールを発行する必要が完全にゼロになります。'
        },
        {
          stepNumber: 2,
          title: '未使用スロットのフリーリスト化',
          description: '未使用のメモリスロット同士を単方向連結リストとして数珠繋ぎにしておきます。',
          codeSnippet: 'freeListHead = reinterpret_cast<Node*>(memoryBuffer);',
          impact: '空いている場所の先頭ポインタを持っておくだけで、O(1)で即座に貸し出せます。'
        },
        {
          stepNumber: 3,
          title: 'O(1)での貸出と返却',
          description: '貸出時はフリーリストの先頭を取り出し、返却時は先頭にプッシュするだけの定数時間処理を行います。',
          codeSnippet: 'Node* next = freeListHead->next; ... freeListHead = next;',
          impact: '探索ループが一切存在しないため、最悪実行時間が常に数ナノ秒で保証されます。'
        }
      ],
      codeFiles: [
        {
          filename: 'FragmentationVisualizer.cpp',
          language: 'cpp',
          description: 'ヒープ断片化の再現とメモリプールの比較実験',
          code: `#include <iostream>
#include <vector>
#include <chrono>

// 弾オブジェクト（48バイト）
struct Bullet {
    float x, y;
    float vx, vy;
    int damage;
    int lifeTimer;
    char padding[24]; // リアルなサイズをシミュレート
};

// ❌ 悪い例：毎フレームのヒープ確保とランダム破棄（断片化の再現）
void benchmarkHeap() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<Bullet*> activeBullets;
    activeBullets.reserve(10000);

    for (int frame = 0; frame < 10000; ++frame) {
        // 毎フレーム10個生成
        for (int i = 0; i < 10; ++i) {
            activeBullets.push_back(new Bullet{0, 0, 1, 1, 10, 60, {}});
        }
        // 古い弾を途中で間引き削除（虫食いを作る）
        if (activeBullets.size() > 500) {
            for (int i = 0; i < 5; ++i) {
                delete activeBullets[i];
            }
            activeBullets.erase(activeBullets.begin(), activeBullets.begin() + 5);
        }
    }

    for (auto* b : activeBullets) delete b;
    auto end = std::chrono::high_resolution_clock::now();
    std::cout << "Heap new/delete time: " 
              << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() 
              << " ms\\n";
}`
        }
      ]
    },
    {
      id: 'sec-l11-free-list-trick',
      title: 'L11.2 メモリ消費ゼロの奇術：埋め込みフリーリスト（Embedded Free List）',
      leadText: '空いているメモリ領域そのものをリンクリストの「次のポインタ」として再利用する、ゲームプログラマ秘伝のメモリ節約テクニックを習得します。',
      dialogueBefore: [
        {
          id: 'dl11-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'プールが空いている場所を管理するために、std::vector<int> freeIndices; とか bool isUsed[2048]; みたいな管理用変数が別途必要なんじゃないですか？それだとメモリが二重に食われてしまいませんか？'
        },
        {
          id: 'dl11-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そこがプロの真骨頂よ！【使っていないスロットの中に、次の空きスロットへのポインタを直接書き込む】のじゃ！これを「埋め込みフリーリスト（Embedded Free List）」と呼ぶ！'
        },
        {
          id: 'dl11-7',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ええっ！？使っていないメモリにポインタを書き込む！？そんなことして元のデータが壊れたりしないんですか？'
        },
        {
          id: 'dl11-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '使っておらん（貸し出していない）のじゃから、何を書こうが自由じゃろ！オブジェクトとして貸し出す瞬間に上書きされ、返却されたら再びポインタを書き込む。管理オーバーヘッドは【驚異の0バイト】じゃ！'
        }
      ],
      memoryMap: {
        title: '埋め込みフリーリストのメモリ構造（追加メモリ消費0バイト）',
        description: '未使用スロット自体に次の空きスロットへのポインタを埋め込むことで、追加メモリを一切使わずにO(1)アロケーションを実現します。',
        asciiArt: `+-------------------------------------------------------------------------------+
|                      固定長メモリプール全体のバッファ (連続領域)               |
+-------------------------------------------------------------------------------+
|  スロット 0        |  スロット 1        |  スロット 2        |  スロット 3        |
|  [貸出中: Bullet]  |  [空きスロット]    |  [貸出中: Bullet]  |  [空きスロット]    |
|  x = 120.0f        |  +--------------+  |  x = 350.0f        |  +--------------+  |
|  y = 450.0f        |  | nextポインタ |--->|  x = 350.0f        |  | next = nullptr| |
|  vx = 0.0f         |  +--------------+  |  vx = -2.0f        |  +--------------+  |
|  (有効な弾データ)  |  (未使用領域借用)  |  (有効な弾データ)  |  (リスト末尾)      |
+--------------------+--------------------+--------------------+--------------------+
                          ^
                          |
                   [ freeListHead ] (次の貸出先はスロット1)`,
        stackItems: [
          { address: '0x7ffd00', variable: 'freeListHead', value: '0x100030 (&pool[1])', notes: '次に貸し出す空きスロットのアドレス' },
          { address: '0x7ffd08', variable: 'm_allocatedCount', value: '2', notes: '現在貸出中のオブジェクト数' }
        ],
        heapItems: [
          { address: '0x100000', object: 'Bullet (slot[0])', state: 'active', lifecycle: '貸出中：画面上の弾データとして使用中' },
          { address: '0x100030', object: 'Slot* (slot[1])', state: 'free', lifecycle: '空き：nextポインタ(0x100090)として機能' },
          { address: '0x100060', object: 'Bullet (slot[2])', state: 'active', lifecycle: '貸出中：画面上の弾データとして使用中' },
          { address: '0x100090', object: 'Slot* (slot[3])', state: 'free', lifecycle: '空き：next=nullptr（フリーリスト末尾）' }
        ],
        lifecycleExplanation: 'オブジェクトが破棄されると、デストラクタが明示的に呼ばれた後、そのアドレスが即座にフリーリストの先頭（freeListHead）に繋ぎ直されます。'
      },
      codeFiles: [
        {
          filename: 'FixedMemoryPool.hpp',
          language: 'cpp',
          description: '埋め込みフリーリストによる固定長メモリプールの完全実装',
          code: `#pragma once
#include <cstddef>
#include <new>
#include <utility>
#include <cassert>

template <typename T, size_t Capacity>
class FixedMemoryPool {
private:
    // スロットの共用体（Union）：
    // 貸出中は T の生メモリ領域として機能し、
    // 空き状態の時は次の空きノードへのポインタとして機能する！
    union Slot {
        alignas(alignof(T)) char storage[sizeof(T)];
        Slot* next; // 空きリスト連結用ポインタ
    };

    Slot m_pool[Capacity]; // 連続した巨大メモリブロック
    Slot* m_freeListHead;  // 次に貸し出せる空きスロットの先頭
    size_t m_allocatedCount;

public:
    FixedMemoryPool() : m_freeListHead(nullptr), m_allocatedCount(0) {
        // 全スロットを芋づる式にフリーリストへ繋ぐ
        for (size_t i = 0; i < Capacity - 1; ++i) {
            m_pool[i].next = &m_pool[i + 1];
        }
        m_pool[Capacity - 1].next = nullptr;
        m_freeListHead = &m_pool[0];
    }

    // O(1) でメモリを割り当て、コンストラクタを呼び出す
    template <typename... Args>
    T* allocate(Args&&... args) {
        if (!m_freeListHead) {
            return nullptr; // プール枯渇！
        }

        // 1. フリーリストの先頭を取り出す
        Slot* slot = m_freeListHead;
        m_freeListHead = m_freeListHead->next;
        ++m_allocatedCount;

        // 2. プレースメント new でそのアドレス上に T を直接構築！
        return new (slot->storage) T(std::forward<Args>(args)...);
    }

    // O(1) でデストラクタを呼び出し、メモリをプールへ返却
    void deallocate(T* ptr) {
        if (!ptr) return;

        // 1. 明示的デストラクタ呼び出し（メモリは解放しない！）
        ptr->~T();

        // 2. スロットをフリーリストの先頭へ差し戻す
        Slot* slot = reinterpret_cast<Slot*>(ptr);
        slot->next = m_freeListHead;
        m_freeListHead = slot;
        --m_allocatedCount;
    }

    size_t allocatedCount() const { return m_allocatedCount; }
    size_t capacity() const { return Capacity; }
    bool isFull() const { return m_freeListHead == nullptr; }
};`
        }
      ]
    },
    {
      id: 'sec-l11-placement-new-destructor',
      title: 'L11.3 C++の深淵：プレースメントnewと明示的デストラクタ呼び出し',
      leadText: '「メモリの割り当て」と「オブジェクトの初期化」を完全に切り離す、標準ライブラリ（std::vector等）の根幹をなす超絶技法を極めます。',
      dialogueBefore: [
        {
          id: 'dl11-9',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'コードに出てきた new (slot->storage) T(...) と ptr->~T() って何ですか！？デストラクタを手動で直接呼び出しているのなんて初めて見ました……！壊れたりしないんですか！？'
        },
        {
          id: 'dl11-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞC++プログラマが必ず知っておくべき秘奥義じゃ！普通の new は「①mallocでメモリ確保」＋「②コンストラクタ呼び出し」の2つを同時に行う。だが【プレースメント new】は、既に確保済みのメモリ番地を渡し、【②のコンストラクタ呼び出しだけ】を行うのじゃ！'
        },
        {
          id: 'dl11-11',
          speaker: 'penguin',
          emotion: 'question',
          text: 'なるほど！じゃあ片付ける時はなぜ delete ptr じゃダメなんですか？'
        },
        {
          id: 'dl11-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'もし delete ptr を呼んだら、OSのヒープ解放関数（free）が走り、プール全体のメモリ配列ごと吹き飛んでクラッシュしてしまう！だから「①デストラクタだけを明示的に呼び出し（ptr->~T()）」、メモリは自分のプールのフリーリストに戻すのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'PlacementNewDemo.cpp',
          language: 'cpp',
          description: 'プレースメントnewと明示的デストラクタの動作検証',
          code: `#include <iostream>
#include <new> // プレースメント new のために必須

class ExplosionParticle {
private:
    int m_id;
public:
    ExplosionParticle(int id) : m_id(id) {
        std::cout << "Particle [" << m_id << "] 誕生（コンストラクタ実行）\\n";
    }
    ~ExplosionParticle() {
        std::cout << "Particle [" << m_id << "] 爆散終了（デストラクタ実行）\\n";
    }
    void render() {
        std::cout << "Particle [" << m_id << "] 描画中...\\n";
    }
};

int main() {
    // 1. スタック上に生メモリ領域をアライメント考慮で用意
    alignas(ExplosionParticle) char rawMemory[sizeof(ExplosionParticle)];

    std::cout << "--- 1. プレースメント new で生メモリ上に直接インスタンス化 ---\\n";
    // メモリ確保は行わず、rawMemory の位置にオブジェクトを構築する
    ExplosionParticle* p = new (rawMemory) ExplosionParticle(42);
    p->render();

    std::cout << "\\n--- 2. 明示的デストラクタ呼び出し ---\\n";
    // メモリ解放は行わず、後片付け処理（デストラクタ）のみを実行！
    // ❌ 絶対に delete p; を呼んではならない（rawMemory はスタックなので即死）
    p->~ExplosionParticle();

    std::cout << "\\n--- 3. 同じ生メモリ領域に別のオブジェクトを再構築！ ---\\n";
    ExplosionParticle* p2 = new (rawMemory) ExplosionParticle(99);
    p2->render();
    p2->~ExplosionParticle();

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l11-game-bullet-pool',
      title: 'L11.4 実践：インベーダーゲームの弾幕＆パーティクルプール統合',
      leadText: '実際のゲームループに固定長メモリプールを組み込み、1秒間に数千発の弾が出現・消滅してもヒープ確保回数ゼロを維持する堅牢な設計を完成させます。',
      dialogueBefore: [
        {
          id: 'dl11-13',
          speaker: 'penguin',
          emotion: 'happy',
          text: '先生！固定長メモリプールをインベーダーの弾（Bullet）と敵の爆発火花（Particle）に組み込んだら、弾幕がいくら激しくなってもフレームレートが60FPSにビタ止まりするようになりました！'
        },
        {
          id: 'dl11-14',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'うむ！OSへのアロケーション要求がゼロになり、さらにメモリが連続しておるからCPUのキャッシュヒット率も跳ね上がった証拠じゃな！これぞ商用ゲームエンジンの心臓部じゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'GameBulletManager.hpp',
          language: 'cpp',
          description: 'メモリプールを活用した実戦的弾丸管理クラス',
          code: `#pragma once
#include "FixedMemoryPool.hpp"
#include <vector>
#include <iostream>

struct Bullet {
    float x, y;
    float vy;
    bool isAlive;

    Bullet(float startX, float startY, float speedY)
        : x(startX), y(startY), vy(speedY), isAlive(true) {}

    void update() {
        y += vy;
        if (y < 0.0f || y > 600.0f) {
            isAlive = false; // 画面外で死亡
        }
    }
};

class GameBulletManager {
private:
    // 最大1024発の弾を事前一括確保するプール
    FixedMemoryPool<Bullet, 1024> m_pool;
    // 画面上で現在アクティブな弾のポインタリスト
    std::vector<Bullet*> m_activeBullets;

public:
    void spawnBullet(float x, float y, float vy) {
        Bullet* b = m_pool.allocate(x, y, vy);
        if (b) {
            m_activeBullets.push_back(b);
        } else {
            std::cerr << "警告: 弾丸プール枯渇！発射をスキップ\\n";
        }
    }

    void updateAll() {
        for (size_t i = 0; i < m_activeBullets.size(); ) {
            Bullet* b = m_activeBullets[i];
            b->update();

            if (!b->isAlive) {
                // 1. プールへ返却（O(1)）
                m_pool.deallocate(b);

                // 2. vector の末尾と入れ替えて高速削除（swap-and-pop: O(1)）
                m_activeBullets[i] = m_activeBullets.back();
                m_activeBullets.pop_back();
            } else {
                ++i;
            }
        }
    }

    size_t activeCount() const { return m_activeBullets.size(); }
    size_t poolUsage() const { return m_pool.allocatedCount(); }
};`
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l11-1',
      question: 'ゲームの実行時（メインループ中）に生 new / delete の多用が厳禁される最大の理由として、最も適切なものはどれですか？',
      options: [
        'C++コンパイラが new を見つけると自動的に最適化を解除してしまう仕様だから',
        'OSのヒープアロケータは実行時間がブレる（非決定論的）上に、断片化（フラグメンテーション）により空き容量があっても割り当て不能でクラッシュする危険があるから',
        'new で確保したメモリは delete を呼んでもOSに返却されないバグがCPUに存在するから',
        'ポインタのビット数が new を呼ぶたびに肥大化して64bitを超えてしまうから'
      ],
      correctIndex: 1,
      explanation: '正解は「OSのヒープアロケータは実行時間がブレる上に、断片化により空き容量があっても割り当て不能でクラッシュする危険があるから」です！汎用アロケータは様々なサイズの要求に応えるため、繰り返しの new/delete でメモリが虫食い状態になります。ゲーム開発では固定長プールやスタックアロケータにより、フレームごとのヒープ割り当てをゼロに抑えるのが鉄則です。'
    },
    {
      id: 'quiz-l11-2',
      question: '独自メモリプールで利用される「プレースメント new（placement new）」と「後片付け」に関する説明として、正しいものはどれですか？',
      options: [
        'プレースメント new はヒープから自動確保するため、通常通り delete ptr; で破棄しなければならない',
        'プレースメント new はメモリ確保を行わず指定アドレスにオブジェクトを構築するため、破棄時は delete を使わず明示的デストラクタ（ptr->~T()）を呼び、メモリはプールへ返却する',
        'プレースメント new で構築したオブジェクトはデストラクタを呼び出す必要がなく、free(ptr) だけで完全に安全に破棄できる',
        'プレースメント new は C++17 で非推奨となり、現在は std::make_shared 以外の使用が禁止されている'
      ],
      correctIndex: 1,
      explanation: '正解は「プレースメント new はメモリ確保を行わず指定アドレスにオブジェクトを構築するため、破棄時は delete を使わず明示的デストラクタ（ptr->~T()）を呼び、メモリはプールへ返却する」です！もし delete ptr; を呼ぶと、OSの free() が走ってプール全体のバッファを不正破壊して即死クラッシュします。メモリ割り当てとオブジェクトライフサイクルを完全に分離するのがC++低レイヤの神髄です。'
    }
  ]
};
