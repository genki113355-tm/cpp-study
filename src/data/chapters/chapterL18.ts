import { Chapter } from '../../types/curriculum';

export const chapterL18: Chapter = {
  id: 27,
  slug: 'chapter-classic-18-memory-leak-tracker',
  courseTrack: 'classic',
  courseChapterCode: 'C18',
  title: 'レガシー第18章：自作メモリリーク検知器とクラッシュダンプ解析',
  subtitle: 'グローバル new/delete オーバーライドによる確保履歴トラッキングとコールスタック記録',
  badge: 'レガシーC++ L18：メモリデバッグ',
  gameVersion: 'v2_classes',
  description: '「ゲーム終了時に32バイトだけメモリリークしていると警告が出るが、数十万行のどこで確保されたのか見当もつかない」「本番環境のプレイヤーのPCでだけ、10時間に1回謎のクラッシュが発生する」——生ポインタを手動管理するレガシーC++開発において、最もプログラマの精神を削るのがメモリ破壊とリークです。ValgrindやAddressSanitizerが使えない組込み機器や独自ゲーム機環境では、自分たちでメモリ追跡システムを開発するのが現場の常識でした。本章では、グローバル operator new / delete をオーバーライドし、確保時のファイル名・行番号・バイト数を双方向リンクリストで記録する【自作メモリリーク検知システム】を構築します。',
  prevChapterSlug: 'chapter-classic-17-multithreading',
  nextChapterSlug: 'chapter-classic-19-network-sockets',
  sections: [
    {
      id: 'sec-l18-leak-nightmare',
      title: 'L18.1 「32バイトが消えた！」レガシー現場を襲うメモリリークの悪夢',
      leadText: 'なぜゲームで1バイトのメモリリークも許されないのか？ 長時間稼働で発生するメモリ枯渇の恐怖を解剖します。',
      dialogueBefore: [
        {
          id: 'dl18-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生、ゲームを終了したときにデバッガのログに「Detected memory leaks! 32 bytes」と一行だけ表示されるんです。たった32バイトくらい、ゲームを再起動したらOSが回収してくれるし無視していいですよね…？'
        },
        {
          id: 'dl18-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: '大喝じゃーーーっ！！ゲーム機や組込み機器、そして何十時間も放置されるMMOやスマホゲームにおいて、「毎フレーム32バイト漏れる」バグがあったらどうなると思うのじゃ！？'
        },
        {
          id: 'dl18-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '1フレーム（1/60秒）で32バイトだと…1秒で約2KB、1分で約120KB、1時間で約7.2MB…数時間プレイしたらスマホのメモリを食い尽くして強制終了（OOMクラッシュ）しますね…！'
        },
        {
          id: 'dl18-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'その通り！リークの最大の問題は「何万行もあるコードの、どの new が解放されていないのか分からない」ことじゃ。どこで new されたか行番号とファイル名を突き止める仕組みを、自力でエンジンに組み込むのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'ブラックボックスnew vs メモリトラッキングnew',
        cApproach: {
          title: '❌ 標準の生 new / malloc（リーク元の情報が完全に消失）',
          code: `// 通常の new はサイズ情報しか渡らない
Enemy* e = new Enemy(); // ⚠️ 内部で malloc(sizeof(Enemy)) が呼ばれるだけ
// もし delete e; を忘れてゲームを終了すると:
// 「32 bytes leaked at address 0x0045F120」
// どのファイルの何行目で確保されたか全く分からない！`,
          drawbacks: [
            'リークしたメモリのアドレスしか出力されず、原因コードの特定に何日も浪費する',
            '二重解放（Double Free）した際に、最初にどこで解放されたのか追跡できない',
            'プロジェクトが大規模化すると、原因不明のメモリ増大でゲームが突然死する'
          ]
        },
        cppApproach: {
          title: '⭕ グローバル operator new オーバーライド ＋ デバッグマクロ',
          code: `// #define new new(__FILE__, __LINE__) マクロにより
// 呼び出し元のファイル名と行番号が自動的に注入される！
Enemy* e = new Enemy(); // 実際は new("EnemyManager.cpp", 42) Enemy()

// ゲーム終了時に未解放ブロックのファイル名と行番号を一撃特定！
// [LEAK DETECTED] File: EnemyManager.cpp, Line: 42, Size: 32 bytes`,
          benefits: [
            'ゲーム終了時に未解放のメモリブロックの発生元コード位置（ファイル名・行番号）が即座に判明',
            'メモリ使用量のピークや、どの機能が一番メモリを消費しているかを可視化可能',
            'リリースビルドではマクロを無効化することでオーバーヘッドを完全ゼロにできる'
          ]
        },
        paradigmShiftNotes: '「動的確保したメモリはいつか解放されるはず」という希望的観測を捨て、グローバルなフックとメタデータ注入によって「全ての確保と解放を監査・追跡可能にする」ことが、大規模C++プロジェクトを崩壊から守る防壁となります。'
      },
      takeaways: [
        {
          title: 'ゼロリークの鉄則',
          description: '家庭用ゲーム機やスマホゲームでは、長時間の連続稼働に耐えるため1バイトのメモリリークも許容されない。'
        },
        {
          title: '確保コンテキストの保存',
          description: 'アドレスとサイズだけでなく、ファイル名・行番号のメタデータを確保ヘッダに紐付けることでデバッグが劇的に容易になる。'
        }
      ]
    },
    {
      id: 'sec-l18-override-new',
      title: 'L18.2 グローバル operator new / delete のオーバーロード術',
      leadText: 'C++の最も深い魔術の1つ。言語標準のメモリアロケータをフックし、全確保を傍受するテクニック。',
      dialogueBefore: [
        {
          id: 'dl18-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'new 演算子って、C++の言語仕様そのものですよね？プログラマが中身を勝手に書き換えてしまってもいいんですか？'
        },
        {
          id: 'dl18-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'よいのじゃ！C++言語仕様では「グローバル operator new」をプログラマが独自定義（リプレース）することが正式に認められておる。これを使ってすべての new / delete を我々の監視下に置くのじゃ！'
        }
      ],
      explanationText: `
### 「new」式 と 「operator new」の決定的な違い

C++初心者最大の混乱ポイントがこれです：

1. **「new」式（言語仕様・構文）**:
   Enemy* e = new Enemy();
   これはコンパイラによって以下の2段階の処理に変換されます：
   - ステップA: void* mem = operator new(sizeof(Enemy)); （メモリ確保関数）
   - ステップB: Enemy::Enemy() をそのメモリ上で実行（コンストラクタ呼び出し）

2. **「operator new」（ただの関数）**:
   メモリの生バイト領域を確保して返すだけの関数（malloc に近い）。
   **我々がオーバーロードできるのは、このステップAの関数なのです！**
      `,
      codeFiles: [
        {
          filename: 'MemoryTracker.hpp',
          language: 'cpp',
          description: 'メタデータヘッダを付与するカスタム new / delete 実装',
          isMain: true,
          code: `#ifndef MEMORY_TRACKER_HPP
#define MEMORY_TRACKER_HPP

#include <cstdlib>
#include <iostream>

// 確保されたメモリブロックの先頭に付与するメタデータ
struct MemoryHeader {
    size_t size;
    const char* filename;
    int line;
    MemoryHeader* next;
    MemoryHeader* prev;
};

// グローバルなリンクリスト先頭
extern MemoryHeader* g_allocatedHead;
extern size_t g_totalAllocatedBytes;

// デバッグ用 operator new（ファイル名と行番号を受け取る）
void* operator new(size_t size, const char* filename, int line);
void* operator new[](size_t size, const char* filename, int line);

// 通常の delete
void operator delete(void* ptr) throw();
void operator delete[](void* ptr) throw();

// デバッグビルド時のみ new を置換するマクロ
#if defined(_DEBUG) || !defined(NDEBUG)
    #define DEBUG_NEW new(__FILE__, __LINE__)
    #define new DEBUG_NEW
#endif

// リークレポート出力関数
void dumpMemoryLeaks();

#endif`
        }
      ],
      takeaways: [
        {
          title: 'new式とoperator newの明確な区別',
          description: 'new式はメモリ確保＋コンストラクタ実行。オーバーライドできるのはメモリ確保関数である operator new。'
        },
        {
          title: 'ヘッダープレフィックス技法',
          description: '確保要求サイズより少し大きな領域を取り、先頭にメタデータを格納してポインタをずらして返すのがアロケータの定石。'
        }
      ]
    },
    {
      id: 'sec-l18-tracker-implementation',
      title: 'L18.3 双方向リンクリストによる確保マップと終了時リークレポート',
      leadText: '確保された全ブロックを鎖で繋ぎ、deleteされたら外す。生き残ったブロックをゲーム終了時に告発する完全実装。',
      dialogueBefore: [
        {
          id: 'dl18-7',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'なるほど！new されたらリストに追加して、delete されたらリストから除外すれば、ゲーム終了時にリストに残っているもの＝メモリリークですね！'
        },
        {
          id: 'dl18-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'その通りじゃ！ただしトラッカー自身のリスト管理に std::vector や std::map を使うと、トラッカー内部で new が呼ばれて無限再帰（デッドロック）してしまう。生のポインタを使った双方向リンクリストで自作するのが鉄則じゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'MemoryTrackerDemo.cpp',
          language: 'cpp',
          description: 'メモリリーク検知器の動作検証プログラム',
          isMain: true,
          code: `#include <iostream>
#include <cstdlib>

struct MemoryBlock {
    size_t size;
    const char* file;
    int line;
    MemoryBlock* next;
};

static MemoryBlock* g_head = NULL;

void* my_alloc(size_t size, const char* file, int line) {
    // ヘッダー分余計に確保
    size_t total = sizeof(MemoryBlock) + size;
    MemoryBlock* blk = (MemoryBlock*)std::malloc(total);
    blk->size = size;
    blk->file = file;
    blk->line = line;
    blk->next = g_head;
    g_head = blk;
    
    // データ領域へのポインタを返す
    return (void*)(blk + 1);
}

void my_free(void* ptr) {
    if (!ptr) return;
    MemoryBlock* target = ((MemoryBlock*)ptr) - 1;
    
    // リストから除外（簡易実装）
    if (g_head == target) {
        g_head = target->next;
    } else {
        MemoryBlock* curr = g_head;
        while (curr && curr->next != target) {
            curr = curr->next;
        }
        if (curr) curr->next = target->next;
    }
    std::free(target);
}

void reportLeaks() {
    std::cout << "\n=== Memory Leak Report ===" << std::endl;
    int count = 0;
    MemoryBlock* curr = g_head;
    while (curr) {
        std::cout << "[LEAK] File: " << curr->file 
                  << ", Line: " << curr->line 
                  << ", Size: " << curr->size << " bytes" << std::endl;
        count++;
        curr = curr->next;
    }
    if (count == 0) {
        std::cout << "✨ Perfect! 0 bytes leaked." << std::endl;
    } else {
        std::cout << "❌ Total " << count << " leak(s) found!" << std::endl;
    }
}

int main() {
    // 正常な確保と解放
    int* p1 = (int*)my_alloc(sizeof(int) * 10, "main.cpp", 57);
    my_free(p1);

    // 意図的な解放忘れ（リーク発生！）
    char* leak1 = (char*)my_alloc(64, "Player.cpp", 108);
    double* leak2 = (double*)my_alloc(sizeof(double) * 2, "Enemy.cpp", 215);

    // プログラム終了時にリーク一覧を出力
    reportLeaks();

    // 後片付け
    my_free(leak1);
    my_free(leak2);
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '自己参照アロケーションの回避',
          description: 'メモリアロケータ自身が動的メモリを要求すると無限ループに陥るため、固定長ヘッダや自前リンクリストで完結させる。'
        },
        {
          title: '継続的インテグレーション（CI）への組み込み',
          description: '自動テスト終了時にリーク検知器が0件であることをアサートすることで、メモリリークのマスターブランチ混入を未然に防ぐ。'
        }
      ]
    },
    {
      id: 'sec-l18-crash-dump-analysis',
      title: 'L18.4 クラッシュダンプ解析と現場のシンボル解決',
      leadText: 'プレイヤーの手元で起きたクラッシュを遠隔デバッグする。MiniDumpとPDBシンボルファイルの現場実務。',
      dialogueBefore: [
        {
          id: 'dl18-9',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '開発環境では一切起きないのに、ゲームを公開した後にユーザーさんから「ボスを倒した瞬間に強制終了した」と報告が来ました。再現できなくて頭を抱えています…'
        },
        {
          id: 'dl18-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そこで活躍するのが【クラッシュダンプ（MiniDump / Core Dump）】じゃ！クラッシュした瞬間のCPUレジスタとスタックメモリをファイルに書き出し、開発者の手元でその瞬間の変数の値やコールスタックを丸ごとタイムトラベル再現するのじゃ！'
        }
      ],
      takeaways: [
        {
          title: 'PDBシンボルファイルの厳重保管',
          description: 'リリースビルドのバイナリと完全に一致するデバッグシンボル（PDBファイル）がなければ、ダンプファイルからソースコード行を復元できない。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l18-1',
      question: 'C++の new 式（Enemy* e = new Enemy();）において、プログラマが独自にオーバーロードできるのはどの部分ですか？',
      options: [
        'コンストラクタの実行タイミングのみ',
        'メモリ領域の生バイトを確保する関数 operator new(size_t) のみ',
        'C++コンパイラの字句解析フェーズのみ',
        'CPUのL1キャッシュ制御命令のみ'
      ],
      correctIndex: 1,
      explanation: 'new 式は「operator new によるメモリ確保」と「コンストラクタ呼び出し」の2段階で構成され、プログラマがオーバーロードできるのは前者の operator new 関数です。'
    },
    {
      id: 'quiz-l18-2',
      question: 'メモリリーク検知器において、各確保ブロックのファイル名と行番号を特定するために広く使われたプリプロセッサマクロはどれですか？',
      options: [
        '#define new new(__FILE__, __LINE__)',
        '#define delete exit(0)',
        '#define malloc free',
        '#pragma once'
      ],
      correctIndex: 0,
      explanation: '__FILE__ と __LINE__ はコンパイル時に現在のソースファイル名と行番号に置換される定義済みマクロであり、これらを operator new の追加引数として渡すことで確保元を記録できます。'
    },
    {
      id: 'quiz-l18-3',
      question: '自作メモリアロケータやリークトラッカーの実装内で、std::vector や std::map などの動的STLコンテナの使用を避けるべき最大の理由は何ですか？',
      options: [
        'STLを使うとC++のライセンス料が発生するため',
        'STL内部で new が呼ばれ、トラッカー自身が自分自身を呼び出して無限再帰やデッドロックに陥る危険があるため',
        'STLを使うと画面の解像度が低下するため',
        'std::vector はC言語でコンパイルできないため'
      ],
      correctIndex: 1,
      explanation: 'カスタムアロケータ内で標準STLコンテナを使うと、そのコンテナがさらにメモリを要求して operator new を呼び出し、無限再帰クラッシュを引き起こします。'
    },
    {
      id: 'quiz-l18-4',
      question: 'リリース環境で発生したクラッシュダンプから、ソースコードのファイル名や行番号を正確に復元するために不可欠なファイルは何ですか？',
      options: [
        'ゲームのBGMサウンドファイル（.wav）',
        'ビルド時に生成されたデバッグシンボルファイル（Windowsでは.pdb、Linuxでは.sym等）',
        'ゲームのREADME.txtファイル',
        'GPUのディスプレイドライバインストーラ'
      ],
      correctIndex: 1,
      explanation: 'シンボルファイル（.pdb）には機械語のアドレスとソースコードのファイル名・行番号・変数名の対応関係が記録されており、クラッシュダンプ解析に必須です。'
    }
  ]
};
