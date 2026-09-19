import { Chapter } from '../../types/curriculum';

export const chapterM5: Chapter = {
  id: 17,
  slug: 'chapter-modern-5-coroutines',
  courseTrack: 'modern',
  courseChapterCode: 'M12',
  title: 'モダン第12章：【C++20】コルーチン（Coroutines）による非同期ゲームループ',
  subtitle: 'co_await / co_yield でステートマシン地獄を解消する',
  badge: 'モダンC++ M12【C++20】：コルーチン',
  gameVersion: 'v7_ecs_final',
  description: 'ゲームプログラミングにおいて、敵ボスの多段行動パターン、カットシーンの会話イベント、チュートリアルの進行管理などは、常に「時間経過」や「プレイヤーの特定アクション待ち」を伴います。古典的な設計では、これらを管理するために大量のフラグ変数、タイマー、巨大な switch-case ステートマシンを作成せざるを得ず、ロジックが四散して深刻なバグの温床となっていました。C++20 で言語機能として導入された【コルーチン（Coroutines）】は、関数の実行を途中で中断（Suspend）し、後から任意の位置で再開（Resume）できる画期的なパラダイムです。本章では、`co_await` による時系列シーケンスの直線的記述、`co_yield` による遅延評価弾幕ジェネレータ、そして C++20 コルーチンの内部メカニズム（Promise型、CoroutineHandle、Awaiter）を完全解剖します。',
  prevChapterSlug: 'chapter-modern-6-concepts',
  nextChapterSlug: 'chapter-modern-7-ranges-views',
  sections: [
    {
      id: 'sec-m5-state-machine-hell',
      title: 'M5.1 状態爆発のステートマシン地獄 vs 直線的に書けるコルーチン',
      leadText: 'ボスの「出現演出 → 3秒待機 → ビーム照射 → 2秒待機 → 拡散弾乱射」という一連のシーケンスを、フラグまみれの巨大 switch 文から解放します。',
      dialogueBefore: [
        {
          id: 'dm5-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！ステージ2のボスの攻撃パターンを作ったのですが、コードが地獄の様相を呈しています……！「出現中」「ビーム準備中」「発射中」「クールダウン中」のフラグとタイマー変数が10個以上乱立し、Update() の switch 文が200行を超えて、どこで何が起きているのか作者の私ですら追えなくなりました！'
        },
        {
          id: 'dm5-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそが全ゲーム開発者が一度は落ちる【ステートマシン地獄（State Machine Explosion）】じゃ！本来は「上から下へ流れる直線的なストーリー」なのに、毎フレーム呼ばれる Update() 関数の枠組みに押し込めるために、時間を無理やり状態で輪切りにしているのが原因なのじゃ。'
        },
        {
          id: 'dm5-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '「3秒待つ」という処理を、普通の関数呼び出しのように while ループで待つと、ゲーム全体の画面が3秒間フリーズしちゃいますよね……？'
        },
        {
          id: 'dm5-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'まさにそこじゃ！メインスレッドを一切止めずに、「この関数の実行だけを一時停止して呼び出し元に制御を返し、3秒後にこの行から再開する」という魔法を実現するのが、C++20 の新機能【コルーチン（Coroutines）】なんじゃぞ！'
        }
      ],
      paradigmComparison: {
        title: '古典的ステートマシン（フラグとタイマー管理） vs C++20 コルーチン（co_await）',
        cApproach: {
          title: '❌ 古典的設計：状態変数とタイマーで細切れにした switch-case',
          code: `// 状態とタイマーをメンバ変数として持ち、毎フレーム更新
enum class BossState { Spawning, WaitBeam, FiringBeam, WaitBullets, FiringBullets };

class Boss {
    BossState state = BossState::Spawning;
    float timer = 0.0f;

    void update(float dt) {
        timer += dt;
        switch (state) {
        case BossState::Spawning:
            if (timer >= 2.0f) { state = BossState::WaitBeam; timer = 0.0f; }
            break;
        case BossState::WaitBeam:
            chargeEffect();
            if (timer >= 3.0f) { state = BossState::FiringBeam; timer = 0.0f; }
            break;
        case BossState::FiringBeam:
            fireLaser();
            if (timer >= 1.5f) { state = BossState::WaitBullets; timer = 0.0f; }
            break;
        // 状態が増えるたびにバグと認知負荷が爆発！
        }
    }
};`,
          drawbacks: [
            '「上から順に実行される」という直感的な時間の流れが破壊され、状態フラグの遷移表を頭の中でシミュレーションしないと読めない',
            'ローカル変数を状態間で共有できず、すべてクラスのメンバ変数として昇格させなければならない（スコープ汚染）',
            '途中に「プレイヤーが特定の行動を取ったら中断」などの割り込み条件が入ると、switch 文の分岐が指数関数的に肥大化する'
          ]
        },
        cppApproach: {
          title: '⭕ C++20 コルーチン：直感的な直線的コード（co_await）',
          code: `// ボスの行動AIを「時系列シナリオ」としてそのまま直線的に記述！
Task runBossAI(Boss& boss) {
    // 1. 出現演出を行い、完了まで2秒待機
    boss.playSpawnAnimation();
    co_await WaitForSeconds(2.0f); // ← ここで一旦中断し、メインループへ制御を戻す！

    // 2. チャージを行い、3秒待機
    boss.chargeEffect();
    co_await WaitForSeconds(3.0f);

    // 3. ビーム発射（1.5秒間）
    boss.fireLaser();
    co_await WaitForSeconds(1.5f);

    // 4. 弾幕乱射へ移行
    boss.fireBarrage();
}`,
          benefits: [
            '時間の経過を co_await で直線的に記述できるため、シナリオ通りに上から下へ素直に読める（可読性10倍向上）',
            'ローカル変数がコルーチンフレーム内に自動保持されるため、メンバ変数の乱立やスコープ汚染がゼロになる',
            'メインループやレンダリングを一切ブロックせず、非同期に安全に待機と再開が行われる'
          ]
        },
        paradigmShiftNotes: '「関数を毎フレーム呼んで状態を小刻みに進める」受動的設計から、「関数自身が時間の経過を制御し、必要な時だけ処理を中断してフレームを譲る」能動的コルーチン設計への大転換です。'
      },
      codeFiles: [
        {
          filename: 'CoroutineWaitExample.cpp',
          language: 'cpp',
          description: 'C++20 コルーチンの基礎：一時停止と再開を行う最小サンプル',
          code: `#include <iostream>
#include <coroutine>

// 最小限のコルーチン戻り値型（Task）
struct SimpleTask {
    struct promise_type {
        SimpleTask get_return_object() {
            return SimpleTask{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_never initial_suspend() noexcept { return {}; } // 呼び出し時に即開始
        std::suspend_always final_suspend() noexcept { return {}; }   // 終了時に中断保持
        void return_void() noexcept {}
        void unhandled_exception() { std::terminate(); }
    };

    std::coroutine_handle<promise_type> handle;
    ~SimpleTask() {
        if (handle) handle.destroy();
    }
};

// 一時停止（Suspend）を明示的に要求するカスタム Awaiter
struct SuspendPoint {
    bool await_ready() const noexcept { return false; } // 常に中断
    void await_suspend(std::coroutine_handle<>) const noexcept {}
    void await_resume() const noexcept {}
};

// コルーチン関数（内部に co_await があるため自動的にコルーチンとしてコンパイルされる）
SimpleTask bossSequence(std::coroutine_handle<>& outHandle) {
    std::cout << "[Step 1] ボス出現！警告アラート吹鳴！\\n";
    co_await SuspendPoint{}; // ここで中断して呼び出し元に戻る！

    std::cout << "[Step 2] チャージ完了！ハイパーメガ粒子砲発射！\\n";
    co_await SuspendPoint{}; // 再び中断

    std::cout << "[Step 3] シールド展開！第2フェーズ突入！\\n";
}

int main() {
    std::cout << "--- メインループ開始 ---\\n";
    std::coroutine_handle<> handle;
    
    // コルーチンを起動
    bossSequence(handle);

    std::cout << "--- メインループ：自機移動・描画などの通常フレーム実行中 ---\\n";

    // 外側のゲームループから任意のタイミングで再開（resume）可能！
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm5-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'おおっ！`co_await` を書いた行で本当に関数の実行がピタッと止まって、メイン関数に制御が戻ってきました！しかも次に再開したときは、止まった次の行から正確に続きが実行されています！'
        },
        {
          id: 'dm5-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そうじゃ！C++20 コルーチンはスタックレス（Stackless）コルーチンと呼ばれ、OSのスレッド切り替え（コンテキストスイッチ）のような重い負荷は一切ない。コンパイラが裏で状態マシンを自動合成してくれるため、極めて軽量かつゼロオーバーヘッドなのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m5-coroutine-internals',
      title: 'M5.2 コルーチンの内部構造：Promise型・Handle・Awaiterの3大構成要素',
      leadText: 'C++20 コルーチンが裏でどのように動作しているのか、ブラックボックスを開けて内部の配線メカニズムを解き明かします。',
      dialogueBefore: [
        {
          id: 'dm5-7',
          speaker: 'penguin',
          emotion: 'question',
          text: 'ベン先生、普通の関数とコルーチンは何が違うんですか？戻り値の型に `struct promise_type` を定義したり、聞き慣れない型がたくさん出てきて頭が混乱しています……！'
        },
        {
          id: 'dm5-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '良い疑問じゃ！C++20 コルーチンは「何でもありの便利ライブラリ」ではなく、「言語仕様として提供された低レイヤフレームワーク」なんじゃ。次の【3大構成要素】さえ理解すれば、完全に自分の手足として操れるようになるぞ！'
        }
      ],
      codeFiles: [
        {
          filename: 'GameCoroutineTask.cpp',
          language: 'cpp',
          description: 'ゲームループと連動する本格的な GameTask とタイマー Awaiter の実装',
          code: `#include <iostream>
#include <coroutine>
#include <vector>
#include <memory>

// 1. ゲーム用コルーチンタスク（所有権管理と再開インターフェース）
class GameTask {
public:
    struct promise_type {
        GameTask get_return_object() {
            return GameTask{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; } // 生成時は待機
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_void() noexcept {}
        void unhandled_exception() { std::terminate(); }
    };

    using Handle = std::coroutine_handle<promise_type>;

    explicit GameTask(Handle h) : handle_(h) {}
    ~GameTask() {
        if (handle_) handle_.destroy();
    }

    GameTask(GameTask&& other) noexcept : handle_(other.handle_) {
        other.handle_ = nullptr;
    }
    GameTask& operator=(GameTask&& other) noexcept {
        if (this != &other) {
            if (handle_) handle_.destroy();
            handle_ = other.handle_;
            other.handle_ = nullptr;
        }
        return *this;
    }

    bool isDone() const { return !handle_ || handle_.done(); }
    void resume() {
        if (handle_ && !handle_.done()) {
            handle_.resume();
        }
    }

private:
    Handle handle_;
};

// 2. 指定秒数だけ中断する Awaiter
struct WaitForSeconds {
    float duration;
    float elapsed = 0.0f;

    explicit WaitForSeconds(float sec) : duration(sec) {}

    // await_ready: true を返すと中断せずに即座に実行を継続する
    bool await_ready() const noexcept { return duration <= 0.0f; }

    // await_suspend: 中断される直前に呼ばれる（コルーチンハンドルの保持などを行う）
    void await_suspend(std::coroutine_handle<> h) noexcept {
        // ここでタイマーマネージャ等にハンドルを登録できる
    }

    // await_resume: 再開された瞬間に呼ばれ、co_await 式の評価値を返す
    void await_resume() const noexcept {}
};

// 実戦コルーチン：ボス行動パターン
GameTask bossRoutine() {
    std::cout << "  [ボスAI] 画面上部からゆっくり下降中...\\n";
    co_await WaitForSeconds(1.0f);

    std::cout << "  [ボスAI] 自機を照準ロックオン！\\n";
    co_await WaitForSeconds(1.0f);

    std::cout << "  [ボスAI] ホーミングミサイル一斉発射！\\n";
}

int main() {
    std::cout << "=== ゲームタスク実行マネージャー ===\\n";
    GameTask boss = bossRoutine();

    int frame = 0;
    while (!boss.isDone()) {
        std::cout << "Frame " << ++frame << ": ゲームループ更新中\\n";
        boss.resume();
    }
    std::cout << "=== ボス行動シーケンス完了 ===\\n";
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm5-9',
          speaker: 'penguin',
          emotion: 'teaching',
          text: 'なるほど！`promise_type` はコルーチンの生成や結果受け取りの窓口、`coroutine_handle` は再開・破棄を操作するリモコン、`Awaiter` は中断・再開のルールを決める審判員なんですね！'
        },
        {
          id: 'dm5-10',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '完璧な理解じゃ！Unity の `IEnumerator` や JavaScript の `async/await` は言語ランタイムが固定の動作を決めておるが、C++20 はこの3つの部品をプログラマが100%自由にカスタマイズできる。だからこそメモリ確保ゼロの超高速ゲームタスクが作れるのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m5-generator-barrage',
      title: 'M5.3 co_yield による弾幕座標ジェネレータ（遅延評価）',
      leadText: '数千発の弾丸座標を巨大な vector に一括生成してメモリを浪費するのをやめ、必要な時に1発ずつ生成する遅延評価ジェネレータを作ります。',
      dialogueBefore: [
        {
          id: 'dm5-11',
          speaker: 'penguin',
          emotion: 'question',
          text: '先生、全方位360度に弾を撃ち出す弾幕パターンを作るとき、事前に `std::vector<BulletData>` で全座標を計算して返していたんですが、途中でボスが撃破されたら残りの計算が無駄になってしまいます……。'
        },
        {
          id: 'dm5-12',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そこで登場するのが【co_yield】じゃ！「値を呼び出し元に1つ渡して、自分はそこで一時停止する」という【ジェネレータ（Generator）】を作れば、必要な弾の分だけオンデマンドで生成できるのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'BulletGenerator.cpp',
          language: 'cpp',
          description: 'co_yield を使ったオンデマンド遅延評価弾幕ジェネレータ',
          code: `#include <iostream>
#include <coroutine>
#include <cmath>

struct Vec2 {
    float x, y;
};

// 単一の値を次々と産み出す Generator 型
template <typename T>
class Generator {
public:
    struct promise_type {
        T current_value;

        Generator get_return_object() {
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }

        // co_yield value; が呼ばれたときの処理
        std::suspend_always yield_value(T value) noexcept {
            current_value = value;
            return {}; // 値をセットして一時中断！
        }

        void return_void() noexcept {}
        void unhandled_exception() { std::terminate(); }
    };

    using Handle = std::coroutine_handle<promise_type>;

    explicit Generator(Handle h) : handle_(h) {}
    ~Generator() { if (handle_) handle_.destroy(); }

    // 次の値を取り出す（コルーチンを再開）
    bool next() {
        if (handle_ && !handle_.done()) {
            handle_.resume();
            return !handle_.done();
        }
        return false;
    }

    T getValue() const {
        return handle_.promise().current_value;
    }

private:
    Handle handle_;
};

// 螺旋弾幕の射出ベクトルを生成するジェネレータ
Generator<Vec2> makeSpiralBarrage(int bulletCount, float baseAngle) {
    const float PI = 3.14159265f;
    for (int i = 0; i < bulletCount; ++i) {
        float angle = baseAngle + (i * (2.0f * PI / bulletCount));
        Vec2 dir = { std::cos(angle), std::sin(angle) };
        
        // 1発分の方向ベクトルを呼び出し側に渡して一時停止！
        co_yield dir;
    }
}

int main() {
    std::cout << "--- 螺旋弾幕生成開始 (8発オンデマンド生成) ---\\n";
    auto barrage = makeSpiralBarrage(8, 0.0f);

    int count = 0;
    while (barrage.next()) {
        Vec2 dir = barrage.getValue();
        std::cout << "弾 #" << ++count << " 発射ベクトル: (" 
                  << dir.x << ", " << dir.y << ")\\n";
        
        // もし途中でプレイヤーがボムを使ったら、即座にループを抜けて終了可能！
        if (count >= 4) {
            std::cout << "ボム発動！残りの弾丸計算はキャンセルされました（ゼロオーバーヘッド）\\n";
            break;
        }
    }
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dm5-13',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'すごい！`co_yield` を使うと、配列を一括確保することなく、1発ずつ必要な分だけ座標を取り出せます！途中で中断したときも無駄な計算が一切走らないのが最高ですね！'
        },
        {
          id: 'dm5-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'Python の yield や C# の yield return と同じ感覚で、しかも一切のガベージコレクションや仮想マシンなしに、ネイティブC++の極限速度で動くのじゃ！'
        }
      ]
    },
    {
      id: 'sec-m5-invader-integration',
      title: 'M5.4 インベーダー統合：ボス行動AIのコルーチンオーケストレーション',
      leadText: '第7章のECSや前章の型安全システムとコルーチンを融合させ、完全非同期の敵ボス行動AIを完成させます。',
      dialogueBefore: [
        {
          id: 'dm5-15',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'さあ仕上げじゃ！インベーダーの母艦ボスに、コルーチンによる「時間差突撃＆援護ビット射出シーケンス」を組み込むぞ！'
        },
        {
          id: 'dm5-16',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'はい！毎フレームの switch 文とは完全に決別して、美麗な直線コードでボスを操ってみせます！'
        }
      ],
      codeFiles: [
        {
          filename: 'BossCoroutineIntegration.cpp',
          language: 'cpp',
          description: 'ゲーム本編に組み込むコルーチン駆動型ボス行動エンジン',
          code: `#include <iostream>
#include <vector>
#include <coroutine>

struct CoroutineTask {
    struct promise_type {
        CoroutineTask get_return_object() {
            return CoroutineTask{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_void() noexcept {}
        void unhandled_exception() { std::terminate(); }
    };
    std::coroutine_handle<promise_type> h;
    bool tick() {
        if (h && !h.done()) { h.resume(); return !h.done(); }
        return false;
    }
    ~CoroutineTask() { if (h) h.destroy(); }
};

struct YieldFrame {
    bool await_ready() const noexcept { return false; }
    void await_suspend(std::coroutine_handle<>) const noexcept {}
    void await_resume() const noexcept {}
};

// 1フレーム待機するヘルパー関数
auto waitFrames(int frames) -> CoroutineTask {
    for (int i = 0; i < frames; ++i) {
        co_await YieldFrame{};
    }
}

// ボス行動AI：完全な直線コードで時間差攻撃を記述
CoroutineTask bossAI() {
    std::cout << "[Boss] フェーズ1：左右への威嚇移動開始\\n";
    for (int f = 0; f < 3; ++f) {
        std::cout << "  ボス位置移動...\\n";
        co_await YieldFrame{};
    }

    std::cout << "[Boss] フェーズ2：中央へテレポート！警告発令！\\n";
    co_await YieldFrame{};

    std::cout << "[Boss] フェーズ3：3WAY全方位弾幕一斉射撃！\\n";
    co_await YieldFrame{};

    std::cout << "[Boss] 行動シーケンス完了。ループ待機へ\\n";
}

int main() {
    std::cout << "=== インベーダー・ボス コルーチンAI稼働 ===\\n";
    CoroutineTask boss = bossAI();

    int frameCount = 0;
    while (boss.tick()) {
        std::cout << "--- フレーム " << ++frameCount << " 描画・物理演算同期完了 ---\\n";
    }
    std::cout << "=== ボス行動終了 ===\\n";
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '落とし穴1：コルーチン引数の「参照渡し（&）」によるダングリング参照',
          description: 'コルーチンに参照（const std::string& など）を渡すと、呼び出し元のローカル変数がスコープを抜けて消滅した後にコルーチンが再開され、未定義動作やクラッシュを引き起こします。コルーチンの引数は必ず「値渡し（Value copy）」またはスマートポインタで渡すのが鉄則です。'
        },
        {
          title: '落とし穴2：コルーチンハンドルの二重破棄・解放漏れ',
          description: 'std::coroutine_handle は生ポインタと同等です。RAII クラス（Task クラスのデストラクタで handle.destroy() を呼ぶ）を作成し、必ず所有権を一元管理してください。'
        },
        {
          title: '落とし穴3：final_suspend で suspend_never を返したときの未定義動作',
          description: 'final_suspend で suspend_never を返すと、コルーチン終了時にフレームが自動消滅します。その後に外側から handle.done() や handle.destroy() を呼ぶと解放済みメモリへのアクセス（Use-After-Free）になります。外側でハンドルを管理する場合は必ず suspend_always を返します。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-m5-1',
      question: 'C++20 コルーチンにおいて、関数の実行を一時停止（中断）し、呼び出し元に制御を戻すキーワードはどれですか？',
      options: [
        'co_await',
        'std::yield',
        'goto_pause',
        'suspend_now'
      ],
      correctIndex: 0,
      explanation: '正解は co_await です！co_await 式はオペランドの Awaiter オブジェクトを評価し、必要に応じて関数の実行を中断して呼び出し元に制御を返します。値を生成して中断する場合は co_yield を使用します。'
    },
    {
      id: 'q-m5-2',
      question: 'C++20 コルーチンの設計において、関数の引数にローカル変数の参照（T&）を渡すことが危険とされる最大の理由は何ですか？',
      options: [
        'コンパイラが参照渡しを禁止する構文エラーを出すから',
        'co_await で中断している間に呼び出し元の実体がスコープを抜けて破棄され、再開時にダングリング参照（未定義動作）になるから',
        '参照渡しを使うと自動的にマルチスレッド実行になってデッドロックするから',
        '参照渡しを使うとコルーチンの vtable が肥大化するから'
      ],
      correctIndex: 1,
      explanation: '正解は「co_await で中断している間に呼び出し元の実体がスコープを抜けて破棄され、再開時にダングリング参照（未定義動作）になるから」です！コルーチンは呼び出し元の関数よりも長く生存することが日常茶飯事であるため、引数は原則として値渡し（コピーまたはムーブ）で安全にコルーチンフレーム内に保持する必要があります。'
    },
    {
      id: 'q-m5-3',
      question: 'C++20 コルーチンの「3大構成要素」として正しい組み合わせはどれですか？',
      options: [
        'promise_type、std::coroutine_handle、Awaiter',
        'std::thread、std::mutex、std::condition_variable',
        'unique_ptr、shared_ptr、weak_ptr',
        'vector、list、unordered_map'
      ],
      correctIndex: 0,
      explanation: '正解は「promise_type、std::coroutine_handle、Awaiter」です！promise_type はコルーチンの生成・結果伝達、std::coroutine_handle は外側からの再開・破棄制御、Awaiter は中断可否と再開条件の判定を担当します。'
    }
  ]
};
