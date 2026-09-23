import { Chapter } from '../../types/curriculum';

export const chapterL20: Chapter = {
  id: 29,
  slug: 'chapter-classic-20-legacy-engine-culmination',
  courseTrack: 'classic',
  courseChapterCode: 'C20',
  title: 'レガシー第20章：商用品質レガシーゲームエンジンの集大成とモダンC++への架け橋',
  subtitle: 'C1〜C19の全技術を結集した自作エンジン「ShirokumaEngine」の完成と新世代への跳躍',
  badge: 'レガシーC++ L20：エンジン集大成',
  gameVersion: 'v2_classes',
  description: '第1章の「main関数500行スパゲティコード」から始まったレガシーC++の長い旅路路路。クラス化、動的メモリ、継承ポリモーフィズム、演算子オーバーロード、手動アライメント、関数ポインタ、菱形継承、CRTP、独自メモリプール、モノリシックエンジン、アセット管理、空間グリッド分割、データ駆動設計、ビットフラグ、マルチスレッドプール、メモリリーク検知器、そしてリアルタイムUDP通信——これら現場のあらゆる泥臭い低レイヤ技術が、ついに1つの商用グレード2D自作ゲームエンジン【ShirokumaEngine】として完全統合されます。クラシックC++（C++03）の極限を体験し、なぜ現代のC++がモダン化を遂げたのかを魂で理解する、レガシーコース堂々のグランドフィナーレです！',
  prevChapterSlug: 'chapter-classic-19-network-sockets',
  nextChapterSlug: 'chapter-modern-1-smart-pointers-raii',
  sections: [
    {
      id: 'sec-l20-engine-architecture',
      title: 'L20.1 全サブシステムの集大成：ShirokumaEngine アーキテクチャ',
      leadText: 'L1からL19で培った技術がどのように1つの巨大な歯車として噛み合うのか？ 商用ゲームエンジンの全体鳥瞰図。',
      dialogueBefore: [
        {
          id: 'dl20-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生…！第1章ではmain関数の中にif文とグローバル変数が散らばっていたインベーダーゲームが、今ではメモリプール、空間分割、スレッドプール、データ駆動、通信まで備えた本格ゲームエンジンに進化しました…！'
        },
        {
          id: 'dl20-2',
          speaker: 'shirokuma',
          emotion: 'happy',
          text: 'うむ！よくぞここまで辿り着いた、ペンギン君！お前が学んだ技術は、ただの文法知識ではない。ゲーム開発の歴史の中で、数え切れないほどの先人たちがクラッシュと性能限界に泣き、血を吐きながら築き上げてきた【現場の知恵そのもの】なのじゃ！'
        },
        {
          id: 'dl20-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'でも先生、これだけのサブシステムがあると、どうやって全体を破綻なく統合して動かせばいいんでしょうか？'
        },
        {
          id: 'dl20-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'それこそが本章のテーマ、【商用ゲームエンジンアーキテクチャの完成】じゃ！明確な初期化・更新・描画・破棄のライフサイクルを確立し、完全なる60FPS固定ゲームループを完成させるのじゃ！'
        }
      ],
      explanationText: `
### ShirokumaEngine の階層アーキテクチャ

本エンジンは、以下の厳格なレイヤー分離によって構成されています：

【1. ゲームプレイ層 (InvaderGame)】
- データ駆動ステージローダー (L15)
- ビットフラグステータス異常 (L16)
- リアルタイム通信・推測航法 (L19)

【2. システム管理・サービス層】
- 空間ハッシュグリッド衝突判定 (L14)
- アセットキャッシュマネージャ (L13)
- ワーカースレッドプール (L17)
- イベント・コールバックディスパッチャ (L8)

【3. 低レイヤ・基盤インフラ層】
- 固定長・ブロックメモリアロケータ (L11)
- メモリリーク検知器・ダンプ出力 (L18)
- 手動メモリアライメント (L7)
- 高速Vector2D値オブジェクト (L6, CRTP L10)

各層が下位の層のみを利用し、上位へはインターフェース越しに通知することで、部品の独立性と堅牢性を極限まで高めています。
      `,
      takeaways: [
        {
          title: '階層化アーキテクチャの確立',
          description: 'インフラ層・サービス層・ゲームプレイ層に分離し、下位層への単方向依存を徹底することで巨大コードの崩壊を防ぐ。'
        },
        {
          title: 'ライフサイクルの厳格な統制',
          description: 'Init -> Load -> (Input -> Update -> Physics -> Render) -> Unload -> Shutdown の順序を厳密に管理する。'
        }
      ]
    },
    {
      id: 'sec-l20-shirokuma-engine-loop',
      title: 'L20.2 60FPS完全固定・ゼロスタッター・ゼロリークのゲームループ',
      leadText: '商用ゲームエンジンの心臓部。可変フレームレートと固定物理更新（Fixed Timestep）の完全融合。',
      dialogueBefore: [
        {
          id: 'dl20-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'PCの性能によってフレームレートが144FPSになったり30FPSになったりすると、弾の飛ぶスピードが変わってゲームバランスが崩れてしまいませんか？'
        },
        {
          id: 'dl20-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '鋭いぞ！そのため商用エンジンでは、描画は可変FPSで行いつつ、物理や当たり判定は「厳密に 1/60 秒（16.66ms）刻み」でシミュレーションする【固定タイムステップ（Fixed Timestep with Accumulator）】を採用するのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'ShirokumaEngine.hpp',
          language: 'cpp',
          description: 'レガシーC++の全英知を結集した統合ゲームエンジンクラス',
          isMain: true,
          code: `#ifndef SHIROKUMA_ENGINE_HPP
#define SHIROKUMA_ENGINE_HPP

#include <iostream>
#include <vector>

// 前方宣言によるヘッダ依存の最小化（第2章の知恵！）
class MemoryTracker;
class MemoryPool;
class SpatialGrid;
class AssetManager;
class ThreadPool;
class NetworkManager;

class ShirokumaEngine {
private:
    bool isRunning_;
    float timeAccumulator_;
    const float FIXED_DELTA_TIME; // 1/60 秒 = 0.016666f

public:
    ShirokumaEngine() 
        : isRunning_(false), timeAccumulator_(0.0f), FIXED_DELTA_TIME(1.0f / 60.0f) {}

    ~ShirokumaEngine() {}

    // エンジン初期化（インフラ層から順に起動）
    bool initialize() {
        std::cout << "[Engine] 1. MemoryTracker 起動 (L18)" << std::endl;
        std::cout << "[Engine] 2. 固定長MemoryPool 確保 (L11)" << std::endl;
        std::cout << "[Engine] 3. ワーカースレッドプール起動 (L17)" << std::endl;
        std::cout << "[Engine] 4. アセットキャッシュマネージャ初期化 (L13)" << std::endl;
        std::cout << "[Engine] 5. 空間グリッド分割初期化 (L14)" << std::endl;
        std::cout << "[Engine] 6. ノンブロッキングUDP通信開始 (L19)" << std::endl;
        std::cout << "[Engine] 7. データ駆動ステージ読込 (L15)" << std::endl;
        
        isRunning_ = true;
        std::cout << "✨ ShirokumaEngine 初期化完了！ 60FPSループ突入！" << std::endl;
        return true;
    }

    // 固定タイムステップゲームループ
    void runFrame(float frameTime) {
        timeAccumulator_ += frameTime;

        // 蓄積時間が16.6msを超える限り、物理更新を一定間隔で回す
        while (timeAccumulator_ >= FIXED_DELTA_TIME) {
            fixedUpdate(FIXED_DELTA_TIME);
            timeAccumulator_ -= FIXED_DELTA_TIME;
        }

        // 描画は毎フレーム実行
        render();
    }

    void fixedUpdate(float dt) {
        // 入力処理、ネットワーク推測航法、空間判定
    }

    void render() {
        // 描画バッファ転送
    }

    // エンジン終了処理（逆順で安全にクリーンアップ）
    void shutdown() {
        std::cout << "\n[Engine] シャットダウンシーケンス開始..." << std::endl;
        std::cout << "[Engine] 通信切断 -> スレッド停止 -> アセット解放 -> プール返却" << std::endl;
        std::cout << "[Engine] リークレポート出力 (L18)... 0 bytes leaked!" << std::endl;
        isRunning_ = false;
    }
};

#endif`
        }
      ],
      takeaways: [
        {
          title: '固定タイムステップ（Accumulator）方式',
          description: '描画FPSと物理演算FPSを分離し、マシンスペックに関わらず同一のシミュレーション結果を保証する。'
        },
        {
          title: '逆順クリーンアップの法則',
          description: '初期化で依存関係の下から順に積み上げたサブシステムは、終了時には必ず「完全な逆順」で安全に解体する。'
        }
      ]
    },
    {
      id: 'sec-l20-classical-limits',
      title: 'L20.3 クラシックC++03の限界：なぜ人間は疲弊したのか？',
      leadText: '手動管理の頂点を極めたからこそ見える景色。生ポインタ・ヘッダ地獄・マクロ依存の物理的限界。',
      dialogueBefore: [
        {
          id: 'dl20-7',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '先生…エンジンが動いた感動と同時に、正直に言ってもいいですか…？ テンプレートのCRTPは記法が奇怪すぎるし、new/deleteは1箇所忘れるだけで死ぬし、#ifdef やマクロだらけでコードが暗号みたいです…！'
        },
        {
          id: 'dl20-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'ワハハハハ！よくぞ言った！それこそが、世界中のC++エンジニアが2000年代後半に直面した【クラシックC++の物理的限界】なのじゃ！'
        },
        {
          id: 'dl20-9',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '人間の注意力には限界がある。どれだけ熟練したプロでも、何百万行のコードで「deleteの解放漏れ」や「マルチスレッドのロック漏れ」を100%防ぐことは不可能じゃった。言語自体の力で、これらを自動化・型安全にしなければならなかったのじゃ！'
        }
      ],
      takeaways: [
        {
          title: '手動管理の認知限界',
          description: 'プログラマの規律と注意力だけに依存したメモリ管理やスレッド同期は、ソフトウェアの大規模化に伴い必ず破綻する。'
        }
      ]
    },
    {
      id: 'sec-l20-bridge-to-modern',
      title: 'L20.4 そしてモダンC++へ：すべての苦闘が「新世代の必然性」へ昇華する',
      leadText: 'レガシー修了証授与！ 苦闘したあなただからこそ、モダンC++の真の美しさと威力がわかる。',
      dialogueBefore: [
        {
          id: 'dl20-10',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'シロクマ先生、僕、レガシーC++を学んで本当によかったです！もし最初からモダンC++の std::unique_ptr や std::thread を教わっていたら、「なぜそれを使うのか」のありがたみが全くわからなかったと思います！'
        },
        {
          id: 'dl20-11',
          speaker: 'shirokuma',
          emotion: 'happy',
          text: 'うむ！泥水をすすり、生メモリのアライメントやスレッド競合と戦ったお前は、もはや「ただの文法学習者」ではない。コンピュータの物理構造を芯から理解した【本物のシステムプログラマ】じゃ！'
        },
        {
          id: 'dl20-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'さあ、レガシーコース（全20章）の修了証を授与しよう！次なる旅路は【モダンC++コース（M1〜M14）】じゃ！C++11からC++20/23へと至る、圧倒的な型安全性とゼロコスト抽象化の奇跡をその目で確かめるが良い！'
        }
      ],
      takeaways: [
        {
          title: 'レガシーC++コース（全20章）完走！',
          description: '生ポインタ、メモリレイアウト、仮想関数、並行処理、通信の原理を体得したあなたは、どんな現場のレガシーコードも解読・保守できる強靭な力を手に入れた。'
        },
        {
          title: 'モダンC++への飛躍',
          description: 'C++11以降のスマートポインタ、ムーブセマンティクス、ラムダ、Concepts、Rangesは、すべてレガシーの苦しみを解決するために生まれた必然の進化である。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l20-1',
      question: '商用ゲームエンジンにおいて、描画処理と物理シミュレーションを分離する「固定タイムステップ（Fixed Timestep with Accumulator）」を採用する最大の利点は何ですか？',
      options: [
        'PCのフレームレート（FPS）の変動に関わらず、物理挙動やゲーム速度の再現性を完全に一定に保つため',
        'コンパイル時間が常に1秒未満になるため',
        'ゲームのメモリ使用量が自動的にゼロになるため',
        'ゲームの解像度を自動で8Kにアップスケーリングするため'
      ],
      correctIndex: 0,
      explanation: '固定タイムステップを採用することで、144Hzモニターでも30fpsの旧型機でも物理演算のΔtが一定に保たれ、マシンスペックによる有利不利や当たり判定のすり抜けを防げます。'
    },
    {
      id: 'quiz-l20-2',
      question: 'ゲームエンジンのシャットダウン（終了）処理において、各サブシステムを破棄する正しい順序の原則は何ですか？',
      options: [
        'ランダムに適当な順序で破棄する',
        '初期化時の依存関係（インフラ層→サービス層→ゲーム層）の「完全な逆順」で破棄する',
        '全てのサブシステムを一度に同時に解放する',
        '終了処理はOSに任せて何もしない'
      ],
      correctIndex: 1,
      explanation: '上位のサブシステムが下位の基盤（アロケータやスレッドプールなど）に依存しているため、必ず初期化の逆順（上位から下位へ）でクリーンアップしなければダングリングポインタ参照でクラッシュします。'
    },
    {
      id: 'quiz-l20-3',
      question: 'クラシックC++（C++03以前）からモダンC++（C++11以降）への進化において、最も劇的に変化したパラダイムは何ですか？',
      options: [
        'オブジェクト指向を完全に廃止し、BASIC言語に戻したこと',
        '生ポインタや手動解放に頼る危険な設計から、所有権管理（std::unique_ptr）やムーブセマンティクスによる「安全でゼロコストな自動リソース管理」への転換',
        'すべての変数をグローバル変数にすること',
        'プログラムの実行をコンパイル方式からインタープリタ方式に変更したこと'
      ],
      correctIndex: 1,
      explanation: 'モダンC++の真髄は、RAIIとムーブセマンティクス、スマートポインタにより、実行時オーバーヘッドなしでメモリリークや二重解放をコンパイルレベルで排除することにあります。'
    },
    {
      id: 'quiz-l20-4',
      question: 'レガシーC++（現場実務編・全20章）を修了したエンジニアが次に進むべき、新世代C++（C++11〜C++20）の世界の入り口はどこですか？',
      options: [
        '第1章の main関数スパゲティコードに戻る',
        'モダン第1章（M1）：スマートポインタとRAII（所有権とゼロリーク自動解放）',
        'C++を諦めてHTMLだけを書く',
        'パソコンの電源を切る'
      ],
      correctIndex: 1,
      explanation: 'レガシーで手動管理の原理を極めた次のステップは、モダン第1章（M1：スマートポインタとRAII）です。苦労した new/delete 手動管理が新世代でどのように美しく解決されるかを体感します。'
    }
  ]
};
