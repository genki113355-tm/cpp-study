import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_4: Chapter = {
  id: 204,
  slug: 'reading-step-4',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R4',
  title: 'コード読解演習 Step 4【現場鑑識】：非同期・マルチスレッド競合コードの読解術',
  subtitle: 'たまにしか再現しないクラッシュ・レースコンディション・デッドロックの潜伏箇所を静的スキャンで暴く',
  badge: '読解演習 Step 4',
  description: '「テスト環境では100%動くのに、本番サーバーや高負荷時だけたまに謎のクラッシュをする」——これこそが開発者を最も苦しめる並行処理のバグ（Heisenbug）です。排他制御（std::mutex）のロック範囲、複数ミューテックスの獲得順序、std::atomic の使われ方をコードから読み解き、レースコンディションやデッドロックの潜伏箇所を暴くプロの鑑識眼を養成します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-3',
  nextChapterSlug: 'reading-step-5',
  sections: [
    {
      id: 'step4-overview',
      title: '4.1 並行処理読解の鉄則：「共有データ」と「アクセスパス」の交差点を炙り出せ',
      leadText: 'マルチスレッドコードを漫然と読んではいけません。「共有される可変データ」を特定し、保護の網羅性とロック順序を監査します。',
      dialogueBefore: [
        {
          id: 'dlg-r4-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！先輩が書いたワーカースレッドのタスク処理コードで、「1000回に1回くらいキューの中身が壊れて落ちる」という恐ろしいバグの調査を頼まれました！デバッガを繋いでも再現しなくて途方に暮れています……！',
        },
        {
          id: 'dlg-r4-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！観察しようとすると現象が消える、名高き【ハイゼンバグ（Heisenbug）】じゃな！並行処理のバグは動的デバッグだけに頼ってはならぬ。コードを静的に眺め、**【① 複数スレッドが触る共有変数はどれか】→【② すべてのアクセスで mutex が握られているか】→【③ 複数ミューテックスの取得順序が一定か】**の3原則で静的に暴き出すのじゃ！',
        },
      ],
      explanationText: `
### 並行処理コード鑑識の「3大スキャン・チェックリスト」

1. **チェック1：共有可変状態（Shared Mutable State）の特定**:
   - どのメンバ変数が複数スレッドから読み書きされるか？（キュー、カウンタ、完了フラグなど）
   - 「読み取り（Read）」だからといって mutex なしでアクセスしていないか？（書き込み中の読み取りも立派なデータ競合）
2. **チェック2：ロック獲得順序（Lock Acquisition Order）の統一**:
   - 関数Aで \`Lock(M1) -> Lock(M2)\` の順で取っているのに、関数Bで \`Lock(M2) -> Lock(M1)\` と逆順で取っていないか？（デッドロックの確定フラグ）
3. **チェック3：同期プリミティブの正当性**:
   - \`std::condition_variable\` を呼ぶ際、\`while\` ループで条件を再確認しているか？（スプリアス・ウェイクアップ対策）
   - \`std::atomic\` に頼りすぎて、複数変数のアトミック性が崩れていないか？
      `,
      takeaways: [
        {
          title: '「読み取り専用だからロック不要」は最大の幻想',
          description: 'C++のメモリモデルにおいて、片方のスレッドが書き込んでいる最中に別のスレッドが非ロックで読み出すと「未定義動作（Undefined Behavior）」となり、値の破損やクラッシュが必発します。',
        },
      ],
    },
    {
      id: 'step4-sample-code',
      title: '4.2 演習コード：非同期タスク処理マネージャー（AsyncJobQueue）',
      leadText: '以下のC++コードには、現場で頻発する【深刻な並行処理バグが3箇所】潜んでいます。じっくり読み解いてください。',
      codeFiles: [
        {
          filename: 'AsyncJobQueue.h',
          language: 'cpp',
          description: 'ワーカースレッドが裏でジョブを消化する非同期キュー（不具合混入版）',
          isMain: true,
          code: `#include <iostream>
#include <vector>
#include <string>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

struct Job {
    int id;
    std::string payload;
};

class AsyncJobQueue {
private:
    std::queue<Job> m_queue;
    std::mutex m_queueMutex;
    std::mutex m_logMutex;
    std::condition_variable m_cv;
    
    bool m_isRunning = true;
    int m_processedCount = 0; // 処理済みジョブ数

public:
    // ジョブの追加（メインスレッドから呼ばれる）
    void pushJob(Job job) {
        {
            std::lock_guard<std::mutex> lock(m_queueMutex);
            m_queue.push(std::move(job));
        }
        m_cv.notify_one();
    }

    // ワーカースレッドのメインループ
    void workerLoop(int workerId) {
        while (m_isRunning) {
            Job currentJob;
            {
                std::unique_lock<std::mutex> qLock(m_queueMutex);
                m_cv.wait(qLock, [this]() { return !m_queue.empty() || !m_isRunning; });

                if (!m_isRunning && m_queue.empty()) {
                    break;
                }

                currentJob = std::move(m_queue.front());
                m_queue.pop();
            }

            // ジョブの実行
            executeJob(workerId, currentJob);

            // ⚠️ 疑問点A：排他制御のないカウンタ加算？
            m_processedCount++;
        }
    }

    // ジョブ実行（ログ出力付き）
    void executeJob(int workerId, const Job& job) {
        // ⚠️ 疑問点B：ロック順序は安全か？
        std::lock_guard<std::mutex> logLock(m_logMutex);
        std::cout << "[Worker " << workerId << "] Job " << job.id << " executed: " << job.payload << std::endl;
    }

    // ジョブキューの統計ダンプ
    void dumpStats() {
        // ⚠️ 疑問点C：m_logMutex を取った後に m_queueMutex を取る？
        std::lock_guard<std::mutex> logLock(m_logMutex);
        std::lock_guard<std::mutex> qLock(m_queueMutex);

        std::cout << "=== Queue Stats ===" << std::endl;
        std::cout << "Remaining: " << m_queue.size() << ", Completed: " << m_processedCount << std::endl;
    }

    // 処理済み件数の取得
    int getProcessedCount() const {
        return m_processedCount; // ⚠️ 疑問点D：ロックなしで直接読めるのか？
    }

    void stop() {
        {
            std::lock_guard<std::mutex> lock(m_queueMutex);
            m_isRunning = false;
        }
        m_cv.notify_all();
    }
};`,
          highlightLines: [49, 56, 63, 64, 72]
        }
      ],
      takeaways: [
        {
          title: 'コードレビュー時の視線の動かし方',
          description: 'まずメンバ変数一覧を見て「ミューテックスの数」を確認します。2個以上のミューテックスがある場合、必ず「複数同時にロックしている箇所」を探して順序の不一致（AB-BAデッドロック）を疑います。',
        },
      ]
    },
    {
      id: 'step4-inspection',
      title: '4.3 鑑識捜査：潜伏していた3大欠陥の解説',
      leadText: 'プロの鑑識眼が特定した「データ競合」「デッドロック」「非保護読み出し」の全貌です。',
      processSteps: [
        {
          stepNumber: 1,
          title: '欠陥1：m_processedCount へのデータ競合（Data Race）',
          description: '複数のワーカースレッドが同時に `m_processedCount++` を実行するため、CPUレジスタレベルでの読み込み→加算→書き戻しが重複し、値が消失します。`std::atomic<int>` にするか、ミューテックス保護が必要です。',
          impact: '処理件数のカウント漏れ、未定義動作によるクラッシュ'
        },
        {
          stepNumber: 2,
          title: '欠陥2：dumpStats() と executeJob() によるデッドロック（Deadlock）',
          description: 'もし将来 executeJob 内で queueMutex を参照する処理が追加された場合や、キュー操作とログ出力を同時に行う箇所でロック順序が `queue -> log` と `log -> queue` で交差すると、スレッド双方が相手の解放を永遠に待ち続ける完全停止（デッドロック）が発生します。',
          impact: 'ゲーム画面が完全にフリーズし、CPU使用率0%で無反応になる'
        },
        {
          stepNumber: 3,
          title: '欠陥3：getProcessedCount() の非同期非保護読み出し',
          description: 'ワーカースレッドが書き込んでいる最中にメインスレッドが getProcessedCount() を呼ぶと、キャッシュ不整合や中途半端なバイト列を読み出す危険があります。',
          impact: 'UI表示のチラつき、不正な完了判定'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r4-1',
      question: 'AsyncJobQueue において、複数スレッドから同時に実行された際に「データ競合（Data Race）」が発生して未定義動作となる変数はどれでしょう？',
      options: [
        'm_queue（std::queue）',
        'm_processedCount（int）',
        'm_queueMutex（std::mutex）',
        'm_cv（std::condition_variable）'
      ],
      correctIndex: 1,
      explanation: '正解です！m_processedCount は通常の int であり、workerLoop 内でロックなしに `m_processedCount++` されています。複数スレッドが同時にインクリメントすると競合（Data Race）が発生します。'
    },
    {
      id: 'q-r4-2',
      question: '複数スレッド間で「デッドロック（Deadlock）」が発生する根本的な原因は何でしょう？',
      options: [
        'スレッドの数が多すぎること',
        '複数のミューテックスを獲得する順序が、関数やスレッドごとに異なっており、互いに相手のロック解放を待ち合ってしまうこと',
        'std::lock_guard ではなく std::unique_lock を使っていること',
        'while ループを使っていること'
      ],
      correctIndex: 1,
      explanation: '正解です！例えばスレッドAが M1 を取ってから M2 を待っている間に、スレッドBが M2 を取ってから M1 を待つと、永久にお互いが進まなくなる「循環待ち（デッドロック）」が発生します。'
    },
    {
      id: 'q-r4-3',
      question: 'm_processedCount に対するデータ競合を解消するための、最もシンプルかつオーバーヘッドの低いC++標準の修正方法はどれでしょう？',
      options: [
        'volatile int m_processedCount に変更する',
        'std::atomic<int> m_processedCount = 0; に変更する',
        'すべてのスレッドをシングルスレッドにする',
        'sleep_for(1ms) をインクリメントの前に入れる'
      ],
      correctIndex: 1,
      explanation: '正解です！C++において volatile はスレッド安全性を保証しません。`std::atomic<int>` を使用することで、ハードウェアの原子的命令（CPUアトミック加算）によりロック不要かつ最高速でデータ競合を完全排除できます。'
    },
    {
      id: 'q-r4-4',
      question: '`m_cv.wait(qLock, [this]() { return !m_queue.empty() || !m_isRunning; });` でラムダ式による条件述語を渡している理由（スプリアス・ウェイクアップ対策）は何でしょう？',
      options: [
        'OSの都合で notify されていないのにスレッドが勝手に目覚めてしまう現象があるため、条件が真になるまで自動で再待機させるため',
        'コンパイルエラーを防ぐための形式的なおまじない',
        'メモリを節約するため',
        '関数の実行速度を2倍にするため'
      ],
      correctIndex: 0,
      explanation: '正解です！マルチスレッド環境では、OSのシグナル配送の都合などで通知がないのに起きてしまう「スプリアス・ウェイクアップ（虚偽の起床）」が起きます。述語を渡すことで、条件を満たしていない場合は自動的に再スリープに入りバグを防ぎます。'
    }
  ]
};
