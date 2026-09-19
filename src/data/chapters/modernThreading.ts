import { Chapter } from '../../types/curriculum';

export const chapterModernThreading: Chapter = {
  id: 33,
  slug: 'chapter-modern-5-multithreading',
  courseTrack: 'modern',
  courseChapterCode: 'M5',
  title: 'モダン第5章：【C++11/14】標準マルチスレッドと並行処理',
  subtitle: 'std::thread・排他制御（mutex/lock_guard）・データ競合の撲滅とstd::atomic',
  badge: 'モダンC++ M5【C++11/14】：マルチスレッド',
  gameVersion: 'v5_smart_pointers',
  description: '現代のすべてのCPUはマルチコア（8コア、16コア）が当たり前であり、1本のメインスレッドだけでゲームや高負荷システムを動かすのはCPUリソースの大半をドブに捨てるようなものです。しかし、かつてのC++03時代は言語仕様にスレッドの概念が存在せず、OS依存の泥臭いAPI（POSIX pthreadsやWin32 API）を直接叩かなければなりませんでした。C++11で初めて言語仕様として組み込まれた【標準スレッドライブラリ（std::thread）】と【メモリモデル】は、クロスプラットフォームで安全・高速な並行処理への扉を開きました。本章では、非同期タスクの起動・待機（join / detach）から、未定義動作を引き起こす「データ競合（Data Race）」のメカニズム、RAIIによる排他制御（std::mutex, std::lock_guard）、そして極限の低オーバーヘッドを実現する「ロックフリー原子的操作（std::atomic）」までを徹底解説します。',
  prevChapterSlug: 'chapter-modern-4-variadic-templates',
  nextChapterSlug: 'chapter-modern-6-string-view',
  sections: [
    {
      id: 'sec-m5-os-thread-to-std',
      title: 'M5.1 OS依存スレッドAPIの終焉：C++11標準メモリモデルの革命',
      leadText: 'pthreadやWin32から脱却し、なぜ言語仕様レベルでスレッドが定義される必要があったのかを解説します。',
      dialogueBefore: [
        {
          id: 'dm5-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！ステージ切り替え時に裏でBGMや敵テクスチャを非同期ロードしようとしたら、Windowsでは CreateThread、MacやLinuxでは pthread_create を書かねばならず、#ifdef 地獄でコードが爆発しました…！'
        },
        {
          id: 'dm5-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！C++03までは「世界はシングルスレッドで動くもの」として規格が作られておったからのう。マルチスレッドはすべてOS独自の拡張機能に頼るしかなかったのじゃ。'
        },
        {
          id: 'dm5-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'C++11で標準ライブラリに std::thread が入って、何が変わったんですか？'
        },
        {
          id: 'dm5-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'OSの差分が完全に消滅しただけでなく、言語規格として【メモリモデル（変数への読み書きの順序保証）】が厳格に定義されたのじゃ！どのOS・どのCPU（x86/ARM）でも、決定論的で安全な並行処理が書けるようになったのじゃぞ！'
        }
      ],
      paradigmComparison: {
        title: 'OS依存スレッド（pthread） vs C++11 std::thread',
        cApproach: {
          title: '❌ POSIX pthread / Win32 API（関数ポインタ・void*・OS依存）',
          code: `#include <pthread.h>

void* loadAssetThread(void* arg) {
    char* path = (char*)arg; // ⚠️ void* キャスト
    // 読込処理...
    return NULL;
}

// 呼び出し側
pthread_t thread;
pthread_create(&thread, NULL, loadAssetThread, (void*)"bgm.wav");
pthread_join(thread, NULL);`,
          drawbacks: [
            'WindowsとUnix/Macで全く別のAPIを書く必要があり、ポータビリティがゼロ',
            '引数は void* しか渡せず型安全性が崩壊する',
            '戻り値や例外を安全にメインスレッドへ伝播できない'
          ]
        },
        cppApproach: {
          title: '⭕ C++11 std::thread ＋ ラムダ式（型安全・クロスプラットフォーム）',
          code: `#include <thread>
#include <string>

std::string path = "bgm.wav";

// ラムダ式を渡すだけで即座にバックグラウンド実行！
std::thread worker([path]() {
    // 安全に引数が型付きでキャプチャされる
    loadAsset(path);
});

worker.join(); // 終了を待機`,
          benefits: [
            'Windows, macOS, Linux, ゲーム専用機でも完全に同一のコードで動作',
            'ラムダ式により任意の型・任意の変数を型安全にキャプチャして渡せる',
            'RAII原則に沿っており、デストラクタでの予期せぬ終了も検知可能'
          ]
        },
        paradigmShiftNotes: 'C++11のメモリモデルにより、「スレッド間の同期なしに同じ変数に読み書きすると未定義動作（UB）」と規格上明記されました。'
      }
    },
    {
      id: 'sec-m5-data-race-and-mutex',
      title: 'M5.2 データ競合（Data Race）の恐怖と std::lock_guard によるRAII排他制御',
      leadText: '複数のスレッドが同時に同じ変数を更新した瞬間に起きる破滅と、デッドロックを防ぐRAIIロックの仕組みを学びます。',
      dialogueBefore: [
        {
          id: 'dm5-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: '先生！2つのスレッドからスコア変数 g_score にそれぞれ 1000回ずつ +1 加算したのに、計算結果が 2000 ではなく 1432 とか変な数字になります！'
        },
        {
          id: 'dm5-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'それこそが並行処理最大の魔物【データ競合（Data Race / レースコンディション）】じゃ！g_score++ は1命令ではなく、「CPUレジスタに読み込む」「加算する」「メモリに書き戻す」という3ステップじゃから、途中で別スレッドに割り込まれて値が上書き消滅したのじゃ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'データ競合の発生（Data Race）',
          description: '最低1つのスレッドが書き込みを行う状態で、同期（同期プリミティブ）を取らずに同一メモリアドレスにアクセスした状態。C++規格上は「未定義動作（UB）」です。',
          impact: '計算結果の破損、メモリ破壊、予測不能なクラッシュ'
        },
        {
          stepNumber: 2,
          title: '排他制御（Mutex）の導入',
          description: 'std::mutex を使い、クリティカルセクション（変数更新ブロック）に同時に1つのスレッドしか入れないように遮断機を下ろします。',
          impact: 'データ競合の完全防御'
        },
        {
          stepNumber: 3,
          title: '手動 lock / unlock の罠（デッドロックと例外漏れ）',
          description: 'mutex.lock(); した後、途中で例外が飛んだり early return すると mutex.unlock(); が呼ばれず、他のスレッドが一生待たされフリーズ（デッドロック）します。',
          impact: '商用ゲームの永久ハングアップバグ'
        },
        {
          stepNumber: 4,
          title: 'std::lock_guard によるRAII解放',
          description: 'std::lock_guard<std::mutex> lock(mtx); でスコープに入った時に自動ロック、スコープを抜けた時にデストラクタで100%確実にアンロックします。',
          impact: '例外安全で漏れのない安全な排他制御の完成'
        }
      ]
    },
    {
      id: 'sec-m5-atomic-lockfree',
      title: 'M5.3 実装編：std::atomic によるロックフリー高速カウンタとスレッド処理',
      leadText: '重いミューテックスを回避し、CPUのハードウェアアトミック命令で超高速に動作するカウンタを実装します。',
      codeFiles: [
        {
          filename: 'ThreadSafeCounter.cpp',
          language: 'cpp',
          description: 'std::mutex vs std::atomic による並行加算の比較実装',
          isMain: true,
          code: `#include <iostream>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>

// 1. ミューテックスによる排他制御
int g_mutexCounter = 0;
std::mutex g_mtx;

void incrementWithMutex(int count) {
    for (int i = 0; i < count; ++i) {
        std::lock_guard<std::mutex> lock(g_mtx); // RAIIロック
        g_mutexCounter++;
    }
}

// 2. std::atomic によるロックフリー原子的加算（CPU命令レベルの排他）
std::atomic<int> g_atomicCounter(0);

void incrementWithAtomic(int count) {
    for (int i = 0; i < count; ++i) {
        g_atomicCounter.fetch_add(1); // または単に g_atomicCounter++
    }
}

int main() {
    const int THREAD_COUNT = 4;
    const int ITERATIONS = 10000;

    std::cout << "=== 1. std::mutex による並行処理 ===" << std::endl;
    std::vector<std::thread> threads1;
    for (int i = 0; i < THREAD_COUNT; ++i) {
        threads1.push_back(std::thread(incrementWithMutex, ITERATIONS));
    }
    for (size_t i = 0; i < threads1.size(); ++i) {
        threads1[i].join(); // 全スレッド終了待機
    }
    std::cout << "Mutex結果: " << g_mutexCounter << " (期待値: " << (THREAD_COUNT * ITERATIONS) << ")" << std::endl;

    std::cout << "\\n=== 2. std::atomic によるロックフリー処理 ===" << std::endl;
    std::vector<std::thread> threads2;
    for (int i = 0; i < THREAD_COUNT; ++i) {
        threads2.push_back(std::thread(incrementWithAtomic, ITERATIONS));
    }
    for (size_t i = 0; i < threads2.size(); ++i) {
        threads2[i].join();
    }
    std::cout << "Atomic結果: " << g_atomicCounter.load() << " (期待値: " << (THREAD_COUNT * ITERATIONS) << ")" << std::endl;

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'C++11標準スレッドの恩恵',
          description: 'OS依存コードを完全に排除し、std::thread とラムダ式で型安全・ポータブルな並行処理を実現する。'
        },
        {
          title: 'データ競合は未定義動作',
          description: '複数スレッドが同期なしで共有変数を書き換えるとメモリが破損する。必ず mutex か atomic を介さねばならない。'
        },
        {
          title: 'RAIIロックの徹底',
          description: '生 mutex.lock() は使わず、常に std::lock_guard または std::unique_lock を使用して例外発生時のアンロック漏れを防ぐ。'
        },
        {
          title: 'std::atomic の威力',
          description: '単一整数のインクリメントやフラグ更新には、OSのコンテキストスイッチを伴わないロックフリー原子的操作（std::atomic）が最速。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-m5-1',
      question: 'C++11の `std::thread` オブジェクトを破棄する際、join() も detach() も呼ばれていない場合に発生する重大な動作はどれですか？',
      options: [
        '裏で勝手にスレッドが終了するまで静かに待機する',
        'std::terminate() が強制的に呼び出され、プログラム全体が即座に異常終了（クラッシュ）する',
        'コンパイルエラーになる',
        'スレッドが自動的に detach されてOSに引き渡される'
      ],
      correctIndex: 1,
      explanation: 'C++規格では、joinable な状態（join も detach もされていない）の std::thread のデストラクタが走ると、安全のため問答無用で std::terminate() が呼ばれ、プロセスが即時アボートします。'
    },
    {
      id: 'quiz-m5-2',
      question: 'ミューテックスのロックに `std::lock_guard<std::mutex>` を使用する最大のメリットは何ですか？',
      options: [
        'ロックの処理速度が10倍速くなるため',
        'スコープを抜けた際や途中で例外がスローされた場合でも、デストラクタにより確実に unlock() が呼び出されデッドロックを防ぐため',
        '複数のミューテックスを1つの変数で同時に操作できるため',
        'メモリ使用量がゼロになるため'
      ],
      correctIndex: 1,
      explanation: 'std::lock_guard は RAII（Resource Acquisition Is Initialization）の典型例であり、構築時に lock() し破棄時に必ず unlock() を呼び出すため、関数の途中で return したり例外が飛んでもアンロック漏れが発生しません。'
    },
    {
      id: 'quiz-m5-3',
      question: '整数カウンタの並行加算において、`std::mutex` ではなく `std::atomic<int>` を選ぶ主な利点は何ですか？',
      options: [
        'atomic を使うとカウンタが無限大まで扱えるようになるため',
        'OSのカーネル呼び出しやスレッド休止（コンテキストスイッチ）を伴わず、CPUの原子的ハードウェア命令で超高速に加算できるため',
        'atomic はC++03でも利用可能なため',
        'atomic 変数はスタックメモリを一切消費しないため'
      ],
      correctIndex: 1,
      explanation: 'std::atomic はCPUのロックプレフィックス命令（LOCK XADDなど）に直接コンパイルされるため、ミューテックスのような重いOSカーネル同期やスレッドのブロック・ウェイクアップのオーバーヘッドなしに最高速で動作します。'
    }
  ]
};
