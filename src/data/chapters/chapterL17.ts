import { Chapter } from '../../types/curriculum';

export const chapterL17: Chapter = {
  id: 26,
  slug: 'chapter-classic-17-multithreading',
  courseTrack: 'classic',
  courseChapterCode: 'C17',
  title: 'レガシー第17章：レガシーマルチスレッドとロックフリータスクキュー',
  subtitle: 'pthread / Win32時代の泥臭い排他制御とワーカースレッドプール',
  badge: 'レガシーC++ L17：マルチスレッド',
  gameVersion: 'v2_classes',
  description: '「巨大な次ステージマップの読み込み中、ゲーム画面が一瞬カクッと固まる」「激しい弾幕物理計算でフレームレートが30FPSまで急落する」——シングルスレッドのゲームループは、重い処理が1つ入るだけで描画が停止する致命的な弱点を抱えています。しかし、C++11の std::thread が登場する以前の現場では、OSネイティブの泥臭いスレッドAPI（POSIX pthreads や Windows Win32 API）を直接操作し、メモリ競合（Race Condition）やデッドロックと血みどろで戦いながら並行処理を組み上げていました。本章では、ゲームメインスレッドの60FPS描画を一切阻害せずに裏で計算やリソース読込を行う【ワーカースレッドプール】と【スレッドセーフ・タスクキュー】を自作します。',
  prevChapterSlug: 'chapter-classic-16-bit-flags',
  nextChapterSlug: 'chapter-classic-18-memory-leak-tracker',
  sections: [
    {
      id: 'sec-l17-game-thread-pitfalls',
      title: 'L17.1 「画面が一瞬固まる！」シングルスレッドゲームループの限界',
      leadText: 'なぜゲームでマルチスレッドが必要なのか？ 60FPSの厳格な時間制約（16.6ミリ秒の壁）と非同期処理の価値を体感します。',
      dialogueBefore: [
        {
          id: 'dl17-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！ボス面への突入時に、BGMデータと巨大背景テクスチャをファイルから読み込むコードを入れたら、画面が0.5秒くらいピタッと静止してしまいました！アクションゲームでこの一瞬のフリーズは致命的です…！'
        },
        {
          id: 'dl17-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それぞまさに【マイクロスタッター（Micro-stutter）】、シングルスレッドの悲哀じゃな！メインスレッドがファイルのI/O待ち（ディスクアクセス）をしている間、ゲームループの描画処理が完全にストップしておるのじゃ。'
        },
        {
          id: 'dl17-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '60FPSを維持するには、1フレームあたり「約16.6ミリ秒」以内にすべての処理を終わらせなきゃいけないんですよね。ファイル読み込みに50ミリ秒かかったら、それだけで数フレーム落としてしまいます…'
        },
        {
          id: 'dl17-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'その通り！そこでメインスレッドは「60FPSの描画と入力受付」に専念させ、重いファイル読み込みや敵の索敵AI・物理演算は【ワーカースレッド（裏方スレッド）】に丸投げする並行処理が必要になるのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'シングルスレッド vs ワーカースレッド非同期読込',
        cApproach: {
          title: '❌ メインスレッド同期読み込み（画面フリーズ・スタッター発生）',
          code: `// 毎フレームの更新ループ内で重い同期読み込みを実行
void updateGameLoop() {
    processInput();
    
    if (needNextStage) {
        // ⚠️ ディスクI/Oで500msブロック！この間画面は完全に静止する！
        loadNextStageAssetsSync("stage2.dat");
    }
    
    updateEntities();
    renderScreen(); // 16.6msの締め切りを大幅にオーバー！FPS急落！
}`,
          drawbacks: [
            'ファイル読み込みや重い計算のあいだ描画が完全停止し、プレイヤーに強い不快感を与える',
            '最新のマルチコアCPU（4コア、8コア）の計算資源を1コア分しか活用できず浪費する',
            '通信対戦時、パケット受信待ちでメインループが引っ張られ、ゲーム全体が同期遅延する'
          ]
        },
        cppApproach: {
          title: '⭕ ワーカースレッド非同期バックグラウンド読み込み',
          code: `// メインスレッドはタスクをキューに投入するだけ（所要時間0.001ms）
void updateGameLoop() {
    processInput();
    
    if (needNextStage) {
        // 💡 ワーカースレッドに「裏で読んでおいて」と依頼して即座に復帰
        taskQueue.push(new LoadAssetTask("stage2.dat"));
    }
    
    updateEntities();
    renderScreen(); // メインループは厳密に16.6msを維持し、60FPSヌルヌル描画！
}`,
          benefits: [
            'ロード中も自機やエフェクトが滑らかに動き続け、ロード画面レスのシームレス体験が実現',
            'マルチコアCPUのパワーを最大限に引き出し、物理・AI・描画コマンド生成を分散実行可能',
            'バックグラウンド読み込み完了のフラグが立った瞬間にアセットを切り替えるだけ'
          ]
        },
        paradigmShiftNotes: 'メインスレッドに重い処理を詰め込むシングルスレッド思考から脱却し、「描画・入力（60FPS維持）」と「I/O・重計算（非同期ワーカースレッド）」の責務を分離してタスクキューで橋渡しすることが、現代ゲームループの基礎です。'
      },
      takeaways: [
        {
          title: '16.6ミリ秒の絶対防衛線',
          description: '60FPSのゲームでは、1フレームあたり16.6ミリ秒を超過する処理をメインループに直接書いてはならない。'
        },
        {
          title: 'メインスレッドとワーカースレッドの責務分離',
          description: 'メインスレッドは描画・入力・即時判定に専念し、ディスクI/Oや重い計算は裏のワーカースレッドに非同期委譲する。'
        }
      ]
    },
    {
      id: 'sec-l17-pthreads-mutex',
      title: 'L17.2 レガシー並行処理の闇：データ競合（Data Race）とミューテックス',
      leadText: 'スレッドを複数動かした瞬間に発生する共有メモリ破壊。デバッグ困難な「たまに起きるバグ」の正体と排他制御を学びます。',
      dialogueBefore: [
        {
          id: 'dl17-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生、裏で敵を生成するスレッドを作ってみたんですが、時々スコアが異常な値になったり、敵の配列がクラッシュします！再現率が100回に1回くらいで、原因が全くわかりません！'
        },
        {
          id: 'dl17-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'ふっふっふ…それこそが並行プログラミングの洗礼、【データ競合（Race Condition）】じゃ！複数のスレッドが同じメモリ領域を「同時に読み書き」したため、変数のビットがズタズタに破壊されたのじゃよ。'
        }
      ],
      explanationText: `
### なぜ counter++ はスレッドセーフではないのか？

一見すると1行の「counter++」ですが、アセンブリ言語（CPU機械語）レベルでは以下の3ステップに分解されます：

1. **レジスタへ読み込み**: MOV EAX, [counter]
2. **インクリメント**: ADD EAX, 1
3. **メモリへ書き戻し**: MOV [counter], EAX

もし2つのスレッド（Thread A と Thread B）が同時にこのコードを実行すると：
- Thread A が counter (値: 10) を読み込む
- その直後、OSのコンテキストスイッチが起き、Thread B も counter (値: 10) を読み込む
- Thread A が 11 を計算し、メモリに書き込む (counter = 11)
- Thread B も手元の 10 に 1 を足して 11 を書き込む (counter = 11)

本来 2 回インクリメントされたので **12** になるべき値が、**11** になってしまうのです！
これがゲーム内で起きると、所持金が消滅したり、敵の生存数が狂って無限ループに陥ります。

これを防ぐのが【ミューテックス（Mutual Exclusion：相互排他）】によるクリティカルセクションの保護です。
      `,
      codeFiles: [
        {
          filename: 'LegacyMutexQueue.hpp',
          language: 'cpp',
          description: 'C++03時代のpthread互換ミューテックスラッパーとスコープ付きロック（RAII）',
          isMain: true,
          code: `#ifndef LEGACY_MUTEX_QUEUE_HPP
#define LEGACY_MUTEX_QUEUE_HPP

#include <iostream>
#include <queue>

// POSIX環境 (Linux/macOS) または Windows に応じた低レイヤAPIの切り替え
#if defined(_WIN32)
#include <windows.h>
typedef CRITICAL_SECTION MutexHandle;
#define MUTEX_INIT(m)   InitializeCriticalSection(&(m))
#define MUTEX_LOCK(m)   EnterCriticalSection(&(m))
#define MUTEX_UNLOCK(m) LeaveCriticalSection(&(m))
#define MUTEX_DESTROY(m) DeleteCriticalSection(&(m))
#else
#include <pthread.h>
typedef pthread_mutex_t MutexHandle;
#define MUTEX_INIT(m)   pthread_mutex_init(&(m), NULL)
#define MUTEX_LOCK(m)   pthread_mutex_lock(&(m))
#define MUTEX_UNLOCK(m) pthread_mutex_unlock(&(m))
#define MUTEX_DESTROY(m) pthread_mutex_destroy(&(m))
#endif

// C++03時代の自作RAIIミューテックス
class Mutex {
private:
    MutexHandle handle_;
    Mutex(const Mutex&);
    Mutex& operator=(const Mutex&);
public:
    Mutex() { MUTEX_INIT(handle_); }
    ~Mutex() { MUTEX_DESTROY(handle_); }
    void lock() { MUTEX_LOCK(handle_); }
    void unlock() { MUTEX_UNLOCK(handle_); }
    MutexHandle* getHandle() { return &handle_; }
};

// スコープを抜けたら自動アンロックされるLockGuard（RAIIの真髄）
class ScopedLock {
private:
    Mutex& mutex_;
public:
    explicit ScopedLock(Mutex& m) : mutex_(m) { mutex_.lock(); }
    ~ScopedLock() { mutex_.unlock(); }
};

#endif`
        }
      ],
      takeaways: [
        {
          title: 'アトミックではない単一文の罠',
          description: 'counter++ のような単純な操作でもCPUレベルでは複数命令に分解され、同期なしでは競合破壊される。'
        },
        {
          title: 'RAIIによるScopedLockの徹底',
          description: '手動で lock()/unlock() を呼ぶと例外や早期returnで解除漏れ（永久デッドロック）を起こすため、コンストラクタでロック・デストラクタで解除するガードクラスを使う。'
        }
      ]
    },
    {
      id: 'sec-l17-worker-pool-queue',
      title: 'L17.3 現場直伝：ワーカースレッドプールとタスクキューの実装',
      leadText: 'スレッドを都度生成・破棄するのはコストが重すぎる！常駐スレッドを待機させて仕事を配分するプロのスレッドプール設計。',
      dialogueBefore: [
        {
          id: 'dl17-7',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '仕事があるたびに pthread_create() でスレッドを立ち上げて、終わったら終了させれば簡単じゃないですか？'
        },
        {
          id: 'dl17-8',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: '喝ァァァ！OSにとってスレッドの新規生成と破棄はスタック領域の確保やカーネル遷移を伴う極めて重い処理（数万〜数十万サイクル）なのじゃ！1フレームに何回もスレッドを作って捨てていたら、本末転倒で逆にガタガタに遅くなるぞ！'
        },
        {
          id: 'dl17-9',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ひええっ！じゃあどうすればいいんですか！？'
        },
        {
          id: 'dl17-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ゲーム起動時にCPUのコア数分だけスレッドを生成して常駐させておくのじゃ！そして仕事（タスク）が来たらキューに積み、寝ているスレッドを叩き起こして処理させる【ワーカースレッドプール】を組むのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'ThreadPoolDemo.cpp',
          language: 'cpp',
          description: 'タスク抽象化インターフェースとスレッドセーフなタスクキューの設計',
          isMain: true,
          code: `#include <iostream>
#include <queue>
#include <vector>
#include <string>

// 実行するタスクの基底インターフェース
class ITask {
public:
    virtual ~ITask() {}
    virtual void execute() = 0;
};

// サンプルタスク：アセットの非同期バックグラウンド読み込み
class LoadAssetTask : public ITask {
private:
    std::string filename_;
public:
    explicit LoadAssetTask(const std::string& filename) : filename_(filename) {}
    
    virtual void execute() {
        std::cout << "[WorkerThread] Loading asset: " << filename_ << std::endl;
    }
};

// スレッドセーフなタスクキュー（簡易概念実装）
class TaskQueue {
private:
    std::queue<ITask*> queue_;
public:
    void push(ITask* task) {
        queue_.push(task);
    }

    ITask* pop() {
        if (queue_.empty()) return NULL;
        ITask* task = queue_.front();
        queue_.pop();
        return task;
    }

    bool empty() const {
        return queue_.empty();
    }
};

int main() {
    TaskQueue taskQueue;

    taskQueue.push(new LoadAssetTask("textures/boss_dragon.png"));
    taskQueue.push(new LoadAssetTask("audio/stage3_bgm.ogg"));

    std::cout << "[MainThread] 60FPS描画を継続中... タスクは裏で処理されます。" << std::endl;

    while (!taskQueue.empty()) {
        ITask* task = taskQueue.pop();
        if (task) {
            task->execute();
            delete task;
        }
    }

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'スレッド生成・破棄のコスト撲滅',
          description: 'スレッドはゲーム開始時にコア数分だけ生成して常駐待機させ、プールとして使い回すのが商用ゲームの鉄則。'
        },
        {
          title: 'プロデューサー・コンシューマーパターン',
          description: 'メインスレッドがタスクを生産（Push）し、ワーカースレッドが消費（Pop）する構造により、完全な疎結合非同期処理を実現する。'
        }
      ]
    },
    {
      id: 'sec-l17-modern-contrast',
      title: 'L17.4 古典C++03の苦闘と、モダンC++11並行処理への架け橋',
      leadText: 'なぜC++11で std::thread が言語標準に取り入れられたのか？ OS差分に苦しんだレガシー時代の歴史を知る。',
      dialogueBefore: [
        {
          id: 'dl17-11',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'Windowsだと CreateThread()、Linuxだと pthread_create()、ゲーム機だと専用OSの独自API…全部 #ifdef で書き分けるのって気が遠くなりませんか…？'
        },
        {
          id: 'dl17-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'まさにその苦痛こそが、C++11で std::thread, std::mutex, std::condition_variable、そして C++20の std::jthread が標準化された最大の理由なのじゃ！'
        },
        {
          id: 'dl17-13',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'OSネイティブAPIで泥臭く排他制御と競合の痛みを体感した者だけが、モダンC++のスマートポインタやスレッド抽象化のありがたみを心の底から理解できるのじゃよ！'
        }
      ],
      takeaways: [
        {
          title: 'OS抽象化の歴史的必然性',
          description: 'Win32/pthreadのプラットフォーム依存の激しいスレッドAPIに苦しんだ歴史が、C++11での標準スレッドライブラリ策定へと繋がった。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l17-1',
      question: '60FPSのリアルタイムゲームにおいて、メインスレッドでファイル読み込み等の重い処理を同期実行すると何が発生しますか？',
      options: [
        'CPUのクロック周波数が自動的に2倍になり、ゲームが高速化する',
        '描画ループがブロックされ、1フレーム16.6msを超過して画面が静止する（マイクロスタッター）',
        'コンパイラがエラーを出して実行ファイルが削除される',
        'ゲームの解像度が自動的にフルHDから4Kへ向上する'
      ],
      correctIndex: 1,
      explanation: 'メインスレッドがファイルI/Oで待たされると描画処理が実行できず、16.6ミリ秒のフレーム予算をオーバーして画面のカクつき（スタッター）が発生します。'
    },
    {
      id: 'quiz-l17-2',
      question: '複数スレッドが排他制御を行わずに同一変数（メモリ）を同時に読み書きした際に生じる不具合を何と呼びますか？',
      options: [
        'メモリリーク（Memory Leak）',
        'データ競合（Data Race / Race Condition）',
        'バッファオーバーフロー（Buffer Overflow）',
        'アライメントパディング（Alignment Padding）'
      ],
      correctIndex: 1,
      explanation: '排他制御なしで複数スレッドが同一メモリへ同時にアクセスする状態をデータ競合（Data Race）と呼び、計算結果の狂いや不正ポインタ参照の原因になります。'
    },
    {
      id: 'quiz-l17-3',
      question: 'ゲームループ中に仕事が発生するたびにスレッドを新規作成・破棄するのではなく、「スレッドプール」を用いる最大の利点は何ですか？',
      options: [
        'スレッドの作成と破棄に伴う重いOSカーネルオーバーヘッドを回避し、高速にタスクを消化できるため',
        'C++コードの行数が常に10行以下に短縮されるため',
        'ミューテックスを使わなくてもデータ競合が絶対に起きなくなるため',
        'メモリを全く消費しなくなるため'
      ],
      correctIndex: 0,
      explanation: 'スレッドの生成と破棄はスタック領域の割り当てやカーネル管理構造体の初期化を伴い非常に高コストです。常駐させたスレッドを使い回すプール設計が必須となります。'
    },
    {
      id: 'quiz-l17-4',
      question: 'ミューテックスのロック解除（unlock）漏れによる永久デッドロックを防ぐため、C++で最も推奨されるイディオムは何ですか？',
      options: [
        '関数の末尾に必ず手動で unlock() を書き、例外が起きたら諦める',
        'RAII（Resource Acquisition Is Initialization）を利用し、コンストラクタでロックしデストラクタで自動アンロックするガードオブジェクトを使う',
        'ミューテックスの代わりに goto 文で無限ループを作る',
        'すべてのマルチスレッド処理をシングルスレッドに戻す'
      ],
      correctIndex: 1,
      explanation: 'RAIIを用いたScopedLock（モダンC++のstd::lock_guardなど）を使うことで、関数の途中でreturnしたり例外が発生してもスコープ離脱時に確実にアンロックされ、デッドロックを防げます。'
    }
  ]
};
