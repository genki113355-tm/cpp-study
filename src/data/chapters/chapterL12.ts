import { Chapter } from '../../types/curriculum';

export const chapterL12: Chapter = {
  id: 16,
  slug: 'chapter-12-game-engine-architecture',
  courseTrack: 'classic',
  courseChapterCode: 'C12',
  title: 'レガシー第12章：レガシーゲームエンジン統合アーキテクチャ',
  subtitle: 'メインループ・レンダラ・物理・サウンドの疎結合オーケストレーション',
  badge: 'レガシーC++ L12：ゲームエンジン統合',
  gameVersion: 'v2_classes',
  description: 'これまでの第1章〜第11章で、私たちはカプセル化、動的寿命、ポリモーフィズム、State/Observerパターン、演算子オーバーロード、ポインタ演算、コールバック、多重継承の回避、CRTP、そして独自メモリプールまで、C++の強力な設計技法を1つずつ習得してきました。しかし、実際の商用ゲームや実務の大規模システムでは、「個々の部品が動く」だけでは通用しません。描画、物理演算、入力、サウンド、シーン遷移といった巨大なサブシステム群を、どのような順序で初期化し、どのような時間軸で更新し、安全に終了させるのかという【エンジン骨格（オーケストレーション）】の設計が不可欠です。本章では、市販の2D/3Dゲームエンジン（Unreal EngineやUnityの内部コア）でも採用されている伝説の【固定デルタタイム（Fixed Timestep）ゲームループ】と、サブシステムの結合度を極限まで下げる【IEngineSubsystem ライフサイクル管理】を徹底解説。PCスペックやフレームレートに一切左右されない、決定論的で堅牢なゲームエンジンアーキテクチャを完成させます。',
  prevChapterSlug: 'chapter-11-memory-pool-allocator',
  nextChapterSlug: 'chapter-classic-13-asset-manager',
  sections: [
    {
      id: 'sec-l12-fixed-timestep',
      title: 'L12.1 ゲームループの物理法則：可変デルタタイムの罠と「固定デルタタイム」',
      leadText: '前フレームの経過時間（dt）をそのまま掛ける素朴な手法が、なぜ「弾のすり抜け」や「フレームレート依存バグ」を引き起こすのかを解明します。',
      dialogueBefore: [
        {
          id: 'dl12-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！大変です！ハイスペックなゲーミングPC（240Hz）で動かすと敵の動きが超スローになり、逆に低スペックなノートPCで重い処理が走ると、自機の弾が敵の体をワープしてすり抜けてしまいます……！'
        },
        {
          id: 'dl12-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそがゲームプログラマの誰もが一度は通る洗礼、【可変デルタタイムの罠】じゃな！'
        },
        {
          id: 'dl12-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '前フレームからの経過時間 dt を測って、x += velocity * dt; と計算しています。現実世界の物理公式と同じはずなのに、なぜ壊れるんですか？'
        },
        {
          id: 'dl12-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '現実世界の時間は連続しておるが、コンピュータのシミュレーションは「離散的（飛び飛び）」じゃからじゃ！一瞬ガクッとフレーム落ちして dt = 0.2秒 に跳ね上がった瞬間、弾は1フレームで20ピクセルもジャンプし、間に挟まれた薄い敵の当たり判定を飛び越えてしまう（トンネリング現象）。物理シミュレーションは絶対に【固定時間（Fixed Timestep）】で回さねばならんのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '可変デルタタイム vs 固定デルタタイム・アキュムレータ方式',
        cApproach: {
          title: '❌ 素朴な可変デルタタイム（非決定論的・弾抜けの温床）',
          code: `// 毎フレームの経過時間 dt を直接物理演算に使う
void gameLoop() {
    float lastTime = getTime();
    while (running) {
        float now = getTime();
        float dt = now - lastTime;
        lastTime = now;

        // ⚠️ 危険：ガベージコレクションやOS割り込みで dt が大きくなると
        // 弾が障害物をすり抜ける（トンネリング）！
        // 浮動小数点誤差によりリプレイの再現性もゼロ！
        player.x += player.vx * dt;
        checkCollision(); 
        render();
    }
}`,
          drawbacks: [
            'フレーム落ち（処理落ちスパイク）が発生した瞬間に、弾や自機が壁・敵をすり抜ける「トンネリング現象」が多発する',
            '浮動小数点演算の丸め誤差が累積し、入力ログを再生しても同じ結果にならない（決定論的リプレイやネットワーク同期が不可能）',
            'フレームレートによってジャンプの到達高度や摩擦の減衰率が微妙に変化してしまう'
          ]
        },
        cppApproach: {
          title: '⭕ 固定デルタタイム ＋ アキュムレータ方式（プロ標準設計）',
          code: `// 物理演算は常に厳格な固定時間（例: 1/60秒 = 0.0166秒）で回す！
void gameLoop() {
    const float FIXED_DT = 1.0f / 60.0f; // 物理更新刻み
    const float MAX_FRAME_TIME = 0.25f;  // スパイラル・オブ・デス防止
    float lastTime = getTime();
    float accumulator = 0.0f;

    while (running) {
        float now = getTime();
        float frameTime = now - lastTime;
        lastTime = now;
        if (frameTime > MAX_FRAME_TIME) frameTime = MAX_FRAME_TIME; // クランプ

        accumulator += frameTime;

        // 蓄積時間が固定刻み以上ある限り、何度でも物理更新を実行！
        while (accumulator >= FIXED_DT) {
            physicsUpdate(FIXED_DT); // 常に一定の dt で厳密シミュレーション
            accumulator -= FIXED_DT;
        }

        // 余った端数時間（alpha）を使って、前フレームと現フレームを滑らかに描画補間
        float alpha = accumulator / FIXED_DT;
        render(alpha);
    }
}`,
          benefits: [
            '物理演算が常に一定の dt（1/60秒）で実行されるため、弾抜けやすり抜けが原理的に起きない',
            '入力が同じであれば常に100%同じシミュレーション結果を再現できる（決定論的リプレイ、通信対戦同期の必須要件）',
            '可変リフレッシュレート（144Hzや240Hzモニタ）でも、描画補間（alpha）によって極めて滑らかに表示される'
          ]
        },
        paradigmShiftNotes: '「前フレームのdtをそのまま掛ける」素朴な思考から脱却し、「物理は常に厳密な固定時間（1/60秒）で蓄積時間を消費し、余った端数は描画補間に使う」アキュムレータ方式が商用ゲームエンジンの絶対基準です。'
      },
      codeFiles: [
        {
          filename: 'FixedTimestepLoop.cpp',
          language: 'cpp',
          description: '実戦コード：アキュムレータ式固定デルタタイム・ループの実装（スパイラル・オブ・デス防止ガード付き）',
          code: `#include <iostream>
#include <chrono>
#include <thread>
#include <algorithm>

class FixedTimestepEngine {
private:
    static constexpr double FIXED_DT = 1.0 / 60.0; // 60Hz固定物理ステップ (約0.01666秒)
    static constexpr double MAX_FRAME_TIME = 0.25;  // 1フレームの最大許容時間（250ms）
    
    double simulatedTime_ = 0.0;
    int physicsTickCount_ = 0;
    int renderFrameCount_ = 0;

public:
    // 物理・ロジック更新（常に一定の固定刻みで呼ばれる）
    void updatePhysics(double dt) {
        simulatedTime_ += dt;
        physicsTickCount_++;
        // ここで厳密な衝突判定、弾移動、AI思考を行う
    }

    // 描画処理（ディスプレイの描画タイミングに合わせて呼ばれる）
    // alpha は [0.0, 1.0) の範囲：前フレームと現フレームの間の補間係数
    void render(double alpha) {
        renderFrameCount_++;
        (void)alpha; // 補間描画に使用
    }

    // 1フレーム分の時間進行を処理するコア関数
    void advanceTime(double frameTime, double& accumulator) {
        // ⚠️ スパイラル・オブ・デス（Spiral of Death）防止ガード！
        // 処理落ち時に物理更新が無限増殖して完全フリーズするのを防ぐ
        if (frameTime > MAX_FRAME_TIME) {
            frameTime = MAX_FRAME_TIME;
        }

        accumulator += frameTime;

        // 蓄積された時間が固定刻み FIXED_DT 以上ある限り、何回でも物理更新を回す！
        while (accumulator >= FIXED_DT) {
            updatePhysics(FIXED_DT);
            accumulator -= FIXED_DT;
        }

        // 残余時間を物理刻みで正規化（0.0 〜 0.999...）して描画補間へ渡す
        double alpha = accumulator / FIXED_DT;
        render(alpha);
    }

    void printStats() const {
        std::cout << "[Engine Stats] 物理Tick回数: " << physicsTickCount_
                  << ", 描画Frame回数: " << renderFrameCount_
                  << ", 物理シミュレーション時間: " << simulatedTime_ << "s\\n";
    }
};

int main() {
    FixedTimestepEngine engine;
    double accumulator = 0.0;

    std::cout << "--- 1. 通常フレーム (16.6ms 経過 / 60FPS) ---\\n";
    for (int i = 0; i < 3; ++i) {
        engine.advanceTime(1.0 / 60.0, accumulator);
    }
    engine.printStats();

    std::cout << "\\n--- 2. 激しい処理落ち発生！ (1フレームで 100ms 経過) ---\\n";
    // 100ms = 0.1秒 -> 約6回分の物理更新が一気に追いつき処理される！
    engine.advanceTime(0.100, accumulator);
    engine.printStats();

    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dl12-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'すごい！100msの重い処理落ちが起きたとき、描画は1回なのに、裏で updatePhysics が即座に6回呼ばれて遅れを完全に取り戻しました！弾が飛び越えずに、中間の全コマで当たり判定が計算されたんですね！'
        },
        {
          id: 'dl12-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！これこそが「決定論的（Deterministic）ゲームループ」の神髄じゃ。どんな劣悪なPC環境であっても、弾の軌道も敵の挙動も、数学的に1ピクセルの狂いもなく同一の結果を保証できるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-l12-subsystem-lifecycle',
      title: 'L12.2 サブシステムのライフサイクル：IEngineSubsystem とオーケストレーション',
      leadText: '描画・物理・音声・入力・アセットの各マネージャーが抱える「初期化順序と終了順序の依存地獄」を統一アーキテクチャで根絶します。',
      dialogueBefore: [
        {
          id: 'dl12-7',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生、ゲーム終了時にたまにアクセス違反で落ちます……。デバッガで見たら、サウンドシステムがすでに解放された後に、プレイヤーのデストラクタが「死亡時効果音」を鳴らそうとしてヌルポインタを踏んでいました……！'
        },
        {
          id: 'dl12-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これまた現場の典型的な罠じゃな！「初期化（Startup）」と「終了（Shutdown）」の順序が管理されておらんからじゃ。'
        },
        {
          id: 'dl12-9',
          speaker: 'penguin',
          emotion: 'question',
          text: '各マネージャーがバラバラにグローバル変数として存在しているのが問題なんですね？'
        },
        {
          id: 'dl12-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'その通りじゃ！C++では異なる翻訳単位のグローバル変数の初期化順は「未規定（Unspecified）」じゃ。すべてのサブシステムを【IEngineSubsystem】という共通インターフェースで統一し、カーネルが【初期化した順序の完全な逆順（LIFO: スタック順）】で終了させる規律を作らねばならんのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'SubsystemLifecycle.cpp',
          language: 'cpp',
          description: '実戦コード：IEngineSubsystem ライフサイクル管理と逆順シャットダウン',
          code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>

// サブシステムの標準インターフェース
class IEngineSubsystem {
public:
    virtual ~IEngineSubsystem() = default;
    virtual const char* getName() const = 0;
    virtual bool startup() = 0;
    virtual void update(double dt) = 0;
    virtual void shutdown() = 0;
};

// 1. 入力サブシステム
class InputSubsystem : public IEngineSubsystem {
public:
    const char* getName() const override { return "InputSubsystem"; }
    bool startup() override {
        std::cout << "  [OK] InputSubsystem 起動 (キーボード/マウス初期化)\\n";
        return true;
    }
    void update(double dt) override { (void)dt; }
    void shutdown() override {
        std::cout << "  [SHUTDOWN] InputSubsystem 終了\\n";
    }
};

// 2. サウンドサブシステム
class AudioSubsystem : public IEngineSubsystem {
public:
    const char* getName() const override { return "AudioSubsystem"; }
    bool startup() override {
        std::cout << "  [OK] AudioSubsystem 起動 (オーディオデバイス・バッファ確保)\\n";
        return true;
    }
    void update(double dt) override { (void)dt; }
    void shutdown() override {
        std::cout << "  [SHUTDOWN] AudioSubsystem 終了 (再生停止・ドライバ解放)\\n";
    }
};

// 3. レンダリングサブシステム
class RenderSubsystem : public IEngineSubsystem {
public:
    const char* getName() const override { return "RenderSubsystem"; }
    bool startup() override {
        std::cout << "  [OK] RenderSubsystem 起動 (GPUコンテキスト・スワップチェーン生成)\\n";
        return true;
    }
    void update(double dt) override { (void)dt; }
    void shutdown() override {
        std::cout << "  [SHUTDOWN] RenderSubsystem 終了 (GPUリソース解放・ウィンドウ破棄)\\n";
    }
};

// エンジンカーネル：サブシステムのオーケストレーションを担当
class EngineKernel {
private:
    std::vector<std::unique_ptr<IEngineSubsystem>> subsystems_;
    bool isRunning_ = false;

public:
    template <typename T, typename... Args>
    void registerSubsystem(Args&&... args) {
        subsystems_.push_back(std::make_unique<T>(std::forward<Args>(args)...));
    }

    bool startup() {
        std::cout << "=== エンジン起動シークエンス開始 ===\\n";
        for (auto& sys : subsystems_) {
            if (!sys->startup()) {
                std::cerr << "致命的エラー: " << sys->getName() << " の起動に失敗！\\n";
                shutdown();
                return false;
            }
        }
        isRunning_ = true;
        std::cout << "=== 全サブシステム起動完了 (ゲーム稼働可能) ===\\n\\n";
        return true;
    }

    void update(double dt) {
        if (!isRunning_) return;
        for (auto& sys : subsystems_) {
            sys->update(dt);
        }
    }

    // 終了時は登録の「完全な逆順（LIFO）」で解放する！
    void shutdown() {
        std::cout << "\\n=== エンジン終了シークエンス開始 (逆順シャットダウン) ===\\n";
        for (auto it = subsystems_.rbegin(); it != subsystems_.rend(); ++it) {
            (*it)->shutdown();
        }
        subsystems_.clear();
        isRunning_ = false;
        std::cout << "=== 全サブシステム安全破棄完了 ===\\n";
    }

    ~EngineKernel() {
        if (isRunning_) {
            shutdown();
        }
    }
};

int main() {
    EngineKernel engine;

    // 依存関係に従って登録順を決定（Input -> Audio -> Render）
    engine.registerSubsystem<InputSubsystem>();
    engine.registerSubsystem<AudioSubsystem>();
    engine.registerSubsystem<RenderSubsystem>();

    if (engine.startup()) {
        engine.update(1.0 / 60.0);
    }

    // 終了時は自動的に Render -> Audio -> Input の逆順で安全終了される！
    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l12-headless-mode',
      title: 'L12.3 プラットフォーム疎結合化とヘッドレス設計（CI自動テスト対応）',
      leadText: 'ゲームロジックからグラフィックスAPI依存を完全排除し、ウィンドウなし・秒速で回る「ヘッドレスモード」を構築します。',
      dialogueBefore: [
        {
          id: 'dl12-11',
          speaker: 'penguin',
          emotion: 'question',
          text: 'ベン先生、CI（継続的インテグレーション）のサーバー上でゲームの自動テストを走らせたいのですが、GitHub Actions のLinuxサーバーにはディスプレイが繋がっていないので DirectX やウィンドウ初期化でエラーになってしまいます！'
        },
        {
          id: 'dl12-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'おお！まさにモダン開発の現場で最重視される課題じゃ！商用エンジン（Unreal Engineなど）も、ビルドマシンや専用ゲームサーバーでは画面を一切出さない【ヘッドレスモード（Headless Mode / Dedicated Server）】で動くように設計されておるのじゃ。'
        },
        {
          id: 'dl12-13',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'ということは、「描画（IRenderer）」をインターフェースにして、本番ではOpenGLやDirectXのレンダラを使い、テストやサーバーでは「何もしないNullRenderer」を差し替えられるようにすればいいんですね！'
        }
      ],
      codeFiles: [
        {
          filename: 'HeadlessRenderer.cpp',
          language: 'cpp',
          description: '実戦コード：依存性注入（DI）によるヘッドレス・レンダラ切り替え',
          code: `#include <iostream>
#include <memory>
#include <string>

// 描画抽象インターフェース
class IRenderer {
public:
    virtual ~IRenderer() = default;
    virtual void clearScreen() = 0;
    virtual void drawSprite(int id, float x, float y) = 0;
    virtual void present() = 0;
};

// 1. 本番用：コンソール/グラフィックス描画
class ConsoleRenderer : public IRenderer {
public:
    void clearScreen() override { /* 画面消去 */ }
    void drawSprite(int id, float x, float y) override {
        std::cout << "[Draw] スプライトID=" << id << " を (" << x << ", " << y << ") に描画\\n";
    }
    void present() override {
        std::cout << "[Screen] 画面バッファをフリップ表示\\n";
    }
};

// 2. CI/テスト用：ヘッドレス・ヌルレンダラ（画面出力ゼロ・超高速）
class NullRenderer : public IRenderer {
public:
    void clearScreen() override {}
    void drawSprite(int id, float x, float y) override { (void)id; (void)x; (void)y; }
    void present() override {}
};

// ゲームワールド：レンダラに直接依存せず、抽象インターフェースに依存
class GameWorld {
private:
    IRenderer& renderer_;
    float playerX_ = 100.0f;
    float playerY_ = 200.0f;

public:
    GameWorld(IRenderer& renderer) : renderer_(renderer) {}

    void render() {
        renderer_.clearScreen();
        renderer_.drawSprite(1, playerX_, playerY_); // 自機
        renderer_.present();
    }

    void movePlayer(float dx, float dy) {
        playerX_ += dx;
        playerY_ += dy;
    }

    float getPlayerX() const { return playerX_; }
};

int main() {
    std::cout << "--- A. 本番グラフィックス実行 ---\\n";
    ConsoleRenderer realRenderer;
    GameWorld game(realRenderer);
    game.render();

    std::cout << "\\n--- B. CIサーバー用ヘッドレス自動テスト (画面なし・超高速) ---\\n";
    NullRenderer nullRenderer;
    GameWorld testWorld(nullRenderer);
    // 画面を出さずに1000回移動ロジックを回してアサーション検証！
    for (int i = 0; i < 1000; ++i) {
        testWorld.movePlayer(1.0f, 0.0f);
    }
    std::cout << "テスト完了: 最終自機X座標 = " << testWorld.getPlayerX() << " (期待値: 1100)\\n";

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l12-invader-integration',
      title: 'L12.4 インベーダーゲーム統合：60FPS完全同期の完成',
      leadText: 'これまで作ってきた全モジュール（メモリプール、CRTP、Stateマシン、空間ロジック）を1つのゲームエンジンへ統合します。',
      dialogueBefore: [
        {
          id: 'dl12-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '見よペンギン君！第1章のあの500行スパゲティコードだったインベーダーゲームが、今やプロ水準のゲームエンジンアーキテクチャの元で統制されておるぞ！'
        },
        {
          id: 'dl12-15',
          speaker: 'penguin',
          emotion: 'happy',
          text: '感動です……！メインループは固定デルタタイムで1ピクセルのブレもなく動き、サブシステムは安全な順序で起動・終了し、テストもヘッドレスで瞬時に完了します。これが商用ゲームエンジンの骨格なんですね！'
        }
      ],
      codeFiles: [
        {
          filename: 'ShirokumaGameEngine.cpp',
          language: 'cpp',
          description: 'アーキテクチャ総括：ShirokumaEngine 全体統括コード',
          code: `// Shirokuma 2D Game Engine Core Loop
class ShirokumaGameEngine {
public:
    void run() {
        kernel_.startup();
        
        while (isRunning_) {
            // 1. OSイベント・入力ポーリング
            input_.pollEvents();
            if (input_.isQuitRequested()) break;

            // 2. 固定デルタタイムによる決定論的物理・ロジック更新
            double frameTime = timer_.getElapsedSeconds();
            accumulator_ += std::min(frameTime, MAX_FRAME_TIME);

            while (accumulator_ >= FIXED_DT) {
                world_.update(FIXED_DT);
                audio_.update(FIXED_DT);
                accumulator_ -= FIXED_DT;
            }

            // 3. 残余時間 alpha による滑らかな補間描画
            double alpha = accumulator_ / FIXED_DT;
            renderer_.beginFrame();
            world_.render(renderer_, alpha);
            renderer_.endFrame();
        }

        kernel_.shutdown(); // 登録の完全逆順で安全破棄！
    }
};`
        }
      ],
      takeaways: [
        {
          title: '落とし穴1：スパイラル・オブ・デス（処理落ちの死の連鎖）',
          description: '1フレームの処理が重くて0.5秒かかった場合、次のフレームで0.5秒分（約30回分）の物理演算を一気に回そうとしてさらに処理落ちしゲームが凍結します。必ず frameTime = std::min(frameTime, 0.25); のように最大上限クランプを設けます。'
        },
        {
          title: '落とし穴2：サブシステム同士の相互参照（循環依存）',
          description: 'AudioSubsystem と RenderSubsystem が直接互いを参照すると初期化順序が破綻します。Observer パターンやイベントバスを介して疎結合に通信します。'
        },
        {
          title: '落とし穴3：サブシステムのシングルトン乱用',
          description: 'どこからでも呼べるグローバル Singleton を乱用すると、並行テストやDIが不可能になります。サブシステムは EngineKernel が一括所有し参照を渡すのがクリーンです。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-l12-1',
      question: '物理シミュレーションにおいて、可変デルタタイム（dt = now - lastTime）を直接使うことの最大の欠点はどれですか？',
      options: [
        'C++コンパイラがインライン展開できなくなるため、コンパイル時間が長くなる',
        'フレーム落ちした瞬間に dt が巨大化し、弾が壁や敵の当たり判定を飛び越える「トンネリング現象」が起きる',
        'CPUのL1キャッシュがフラグメンテーションを起こしてハードウェアが停止する',
        '仮想関数テーブル（vtable）のサイズがフレームごとに動的拡張されてしまう'
      ],
      correctIndex: 1,
      explanation: 'フレーム落ち等で dt が跳ね上がると、1フレームの移動量が当たり判定の厚みを超えてしまい、間に障害物があってもすり抜けてしまう「トンネリング現象」が発生します。固定デルタタイムにすることで、どんなに処理落ちしても小刻みなシミュレーションが順次実行され、弾抜けを確実に防ぐことができます。'
    },
    {
      id: 'q-l12-2',
      question: '複数のエンジンサブシステム（Input, Audio, Physics, Render）を終了（Shutdown）させる際、一般的に推奨される順序の原則はどれですか？',
      options: [
        '名前のアルファベット昇順（AからZの順）で終了させる',
        'ランダムな順序で終了させ、残ったメモリはOSの自動回収に任せる',
        '初期化（Startup）した順序の「完全な逆順（LIFO：スタック順）」で終了させる',
        'すべてのサブシステムを同時に並列スレッドで一斉に破棄する'
      ],
      correctIndex: 2,
      explanation: '後から初期化されたサブシステムは、先に初期化されたサブシステムに依存している（例: Render や GameWorld は Audio や MemoryPool に依存する）ことが一般的です。そのため、初期化と完全な逆順（LIFO）でシャットダウンすることで、依存先のサブシステムが先に消えて未定義動作やアクセス違反クラッシュを起こす事態を確実に防ぐことができます。'
    },
    {
      id: 'q-l12-3',
      question: '描画処理を抽象インターフェース（IRenderer）で設計し、「NullRenderer（何もしない描画）」を差し替えられるようにする「ヘッドレス設計」の最大のメリットは何ですか？',
      options: [
        'C++コードが自動的にアセンブリ言語に変換されてFPSが100倍になる',
        'GPUやディスプレイの存在しないCIサーバーやLinuxテスト環境でも、ゲームロジックの単体テストを超高速に自動実行できる',
        'すべての変数がコンパイル時に constexpr 評価されてバイナリサイズが半分になる',
        'マルチスレッドにおけるデッドロックが物理的に一切発生しなくなる'
      ],
      correctIndex: 1,
      explanation: 'ヘッドレス設計にすることで、GPUウィンドウの立ち上げができないCI/CD環境（GitHub Actions等）やマルチプレイヤー用専用サーバー（Dedicated Server）でも、ゲームループとゲームロジックだけを毎秒数千〜数万フレームの爆速で実行・自動検証できるようになります。'
    }
  ]
};
