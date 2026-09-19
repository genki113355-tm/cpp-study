/**
 * 実践コーディング課題（道場）およびプレイグラウンド用テンプレートデータ
 */

export interface CodingChallenge {
  id: string;
  chapterSlug: string; // 対象の章スラッグ
  chapterBadge: string;
  title: string;
  missionObjective: string;
  mentorAdvice: string; // シロクマ先生のアドバイス
  initialCode: string;
  expectedOutputPattern: string | RegExp; // 合格判定用の正規表現または文字列
  successMessage: string;
  hint: string;
  solutionCode: string;
}

export interface PlaygroundTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  code: string;
}

/** 各章連動の実践コーディング課題リスト */
export const CODING_CHALLENGES: Record<string, CodingChallenge> = {
  // L1: スパゲティから手続き化へ
  'chapter-1-spaghetti-code': {
    id: 'challenge-l1',
    chapterSlug: 'chapter-1-spaghetti-code',
    chapterBadge: 'L1',
    title: '演習L1：グローバル変数を関数で安全にカプセル化せよ！',
    missionObjective: 'グローバル変数に直接代入する危険なコードを廃止し、引数で安全に更新を行う movePlayer(delta) 関数と addScore(points) 関数を実装してテストをパスさせてください。',
    mentorAdvice: '「誰がいつ値を書き換えたか分からない」のがスパゲティの元凶じゃ！まずは関数という関所を設け、不正な座標（0未満など）を防ぐガード条件を入れるのじゃ！',
    initialCode: `#include <iostream>

// グローバル状態
int g_player_x = 10;
int g_score = 0;

// TODO: 以下の2つの関数を実装してください
// 1. movePlayer(int delta): g_player_x に delta を加算する（ただし 0 未満にはならないようにガード）
// 2. addScore(int points): g_score に points を加算する
void movePlayer(int delta) {
    // ここに実装
}

void addScore(int points) {
    // ここに実装
}

int main() {
    std::cout << "--- L1 テスト開始 ---" << std::endl;
    movePlayer(5);
    addScore(100);
    movePlayer(-20); // 0 未満にならないかテスト

    std::cout << "Player X: " << g_player_x << std::endl;
    std::cout << "Score: " << g_score << std::endl;

    if (g_player_x >= 0 && g_score == 100) {
        std::cout << "[CLEAR] L1_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 条件を満たしていません" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L1_MISSION_SUCCESS',
    successMessage: '🎉 お見事！関数による安全な状態変更（手続き化）の第一歩を踏み出しました！',
    hint: 'movePlayer では g_player_x += delta; を行った後、if (g_player_x < 0) g_player_x = 0; とするか、std::max(0, g_player_x + delta) を使いましょう。',
    solutionCode: `#include <iostream>
#include <algorithm>

int g_player_x = 10;
int g_score = 0;

void movePlayer(int delta) {
    g_player_x = std::max(0, g_player_x + delta);
}

void addScore(int points) {
    g_score += points;
}

int main() {
    std::cout << "--- L1 テスト開始 ---" << std::endl;
    movePlayer(5);
    addScore(100);
    movePlayer(-20);

    std::cout << "Player X: " << g_player_x << std::endl;
    std::cout << "Score: " << g_score << std::endl;

    if (g_player_x >= 0 && g_score == 100) {
        std::cout << "[CLEAR] L1_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // L2: クラスとカプセル化
  'chapter-2-classes-and-files': {
    id: 'challenge-l2',
    chapterSlug: 'chapter-2-classes-and-files',
    chapterBadge: 'L2',
    title: '演習L2：Playerクラスを作りメンバをprivateに隠蔽せよ！',
    missionObjective: 'Player クラスを定義し、座標 x_ と HP hp_ を private メンバ変数として隠蔽してください。外部からは public な move(delta), takeDamage(dmg), getX(), getHp() 経由でのみアクセスできるようにします。',
    mentorAdvice: '外部から勝手に hp = -9999; と代入される悲劇を防ぐのがカプセル化の神髄じゃ！private と public の境界線をビシッと引くのじゃ！',
    initialCode: `#include <iostream>
#include <algorithm>

// TODO: Player クラスを完成させてください
class Player {
    // 1. private 領域に int x_; と int hp_; を配置
    // 2. public 領域に コンストラクタ Player(int x, int hp)
    // 3. public 領域に move(int delta), takeDamage(int dmg), getX(), getHp() を実装
    // ※ takeDamage で hp_ が 0 未満にならないようガード
public:
    Player(int x, int hp) {
        // ここに初期化
    }
    
    // ここにメンバ関数を実装
};

int main() {
    std::cout << "--- L2 カプセル化テスト ---" << std::endl;
    Player p(10, 100);
    p.move(4);
    p.takeDamage(30);

    std::cout << "Player X: " << p.getX() << ", HP: " << p.getHp() << std::endl;

    if (p.getX() == 14 && p.getHp() == 70) {
        std::cout << "[CLEAR] L2_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 値が期待値と異なります" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L2_MISSION_SUCCESS',
    successMessage: '🎉 完璧です！メンバ変数を private で守り、オブジェクトの独立性を確立しました！',
    hint: 'class Player { private: int x_; int hp_; public: Player(int x, int hp) : x_(x), hp_(hp) {} ... }; のようにメンバ初期化子リストを使うと綺麗に書けます。',
    solutionCode: `#include <iostream>
#include <algorithm>

class Player {
private:
    int x_;
    int hp_;

public:
    Player(int x, int hp) : x_(x), hp_(hp) {}

    void move(int delta) {
        x_ = std::max(0, x_ + delta);
    }

    void takeDamage(int dmg) {
        hp_ = std::max(0, hp_ - dmg);
    }

    int getX() const { return x_; }
    int getHp() const { return hp_; }
};

int main() {
    std::cout << "--- L2 カプセル化テスト ---" << std::endl;
    Player p(10, 100);
    p.move(4);
    p.takeDamage(30);

    std::cout << "Player X: " << p.getX() << ", HP: " << p.getHp() << std::endl;

    if (p.getX() == 14 && p.getHp() == 70) {
        std::cout << "[CLEAR] L2_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // L3: 動的メモリと std::vector
  'chapter-3-dynamic-lifecycle': {
    id: 'challenge-l3',
    chapterSlug: 'chapter-3-dynamic-lifecycle',
    chapterBadge: 'L3',
    title: '演習L3：std::vectorで画面外の弾を自動消去（erase-remove）せよ！',
    missionObjective: 'std::vector<Bullet> を使い、弾の移動処理と「y座標が0未満になった画面外の弾」を安全に消去する cleanUpOffscreen() を実装してください。',
    mentorAdvice: '固定長配列のバッファオーバーフローとおさらばじゃ！vectorの要素消去は C++20 の std::erase_if を使うと1行で超エレガントに書けるぞ！',
    initialCode: `#include <iostream>
#include <vector>
#include <algorithm>

struct Bullet {
    int x;
    int y;
    bool active;
};

class BulletManager {
private:
    std::vector<Bullet> bullets_;

public:
    void shoot(int x, int y) {
        bullets_.push_back({x, y, true});
    }

    void update() {
        for (auto& b : bullets_) {
            b.y -= 1; // 上へ飛ぶ
        }
    }

    // TODO: y < 0 になった弾を bullets_ から消去してください
    void cleanUpOffscreen() {
        // C++20 の std::erase_if(bullets_, [](const Bullet& b) { return b.y < 0; });
        // または伝統的な erase-remove イディオムを使用
    }

    size_t count() const { return bullets_.size(); }
};

int main() {
    std::cout << "--- L3 弾丸マネージャテスト ---" << std::endl;
    BulletManager bm;
    bm.shoot(10, 2);
    bm.shoot(15, 0); // 次のフレームで y = -1 となり画面外へ

    bm.update(); // 1つ目は y=1, 2つ目は y=-1
    bm.cleanUpOffscreen();

    std::cout << "Active bullets remaining: " << bm.count() << std::endl;

    if (bm.count() == 1) {
        std::cout << "[CLEAR] L3_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 画面外の弾が消去されていません (残弾数: " << bm.count() << ")" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L3_MISSION_SUCCESS',
    successMessage: '🎉 素晴らしい！動的配列 std::vector と std::erase_if でメモリリーク・不正参照を防ぎました！',
    hint: 'std::erase_if(bullets_, [](const Bullet& b) { return b.y < 0; }); と書くのが最もモダンです。',
    solutionCode: `#include <iostream>
#include <vector>
#include <algorithm>

struct Bullet {
    int x;
    int y;
    bool active;
};

class BulletManager {
private:
    std::vector<Bullet> bullets_;

public:
    void shoot(int x, int y) {
        bullets_.push_back({x, y, true});
    }

    void update() {
        for (auto& b : bullets_) {
            b.y -= 1;
        }
    }

    void cleanUpOffscreen() {
        std::erase_if(bullets_, [](const Bullet& b) {
            return b.y < 0;
        });
    }

    size_t count() const { return bullets_.size(); }
};

int main() {
    std::cout << "--- L3 弾丸マネージャテスト ---" << std::endl;
    BulletManager bm;
    bm.shoot(10, 2);
    bm.shoot(15, 0);

    bm.update();
    bm.cleanUpOffscreen();

    std::cout << "Active bullets remaining: " << bm.count() << std::endl;

    if (bm.count() == 1) {
        std::cout << "[CLEAR] L3_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // L4: 継承と多態性
  'chapter-4-inheritance-and-polymorphism': {
    id: 'challenge-l4',
    chapterSlug: 'chapter-4-inheritance-and-polymorphism',
    chapterBadge: 'L4',
    title: '演習L4：純粋仮想関数をoverrideしてBossEnemyを作れ！',
    missionObjective: '抽象基底クラス Enemy の純粋仮想関数 virtual void attack() const = 0; を継承し、BossEnemy クラスを作成してください。Enemy* のポインタ配列を通して多態性（ポリモーフィズム）を実証してください。',
    mentorAdvice: '派生クラス側には必ず override キーワードを付けるのじゃ！スペルミスや引数の違いをコンパイラが怒ってくれる命綱じゃぞ！',
    initialCode: `#include <iostream>
#include <vector>
#include <memory>

class Enemy {
public:
    virtual ~Enemy() = default;
    // 純粋仮想関数
    virtual void attack() const = 0;
};

class NormalEnemy : public Enemy {
public:
    void attack() const override {
        std::cout << "Normal: 単発レーザー発射！" << std::endl;
    }
};

// TODO: Enemy を継承した BossEnemy を実装してください
// attack() 内で「Boss: 3WAY拡散メガキャノン発射！」と出力すること
class BossEnemy : public Enemy {
    // ここに実装
};

int main() {
    std::cout << "--- L4 多態性 (vtable) テスト ---" << std::endl;
    
    // 基底ポインタのベクタで一括管理
    std::vector<std::unique_ptr<Enemy>> enemies;
    enemies.push_back(std::make_unique<NormalEnemy>());
    enemies.push_back(std::make_unique<BossEnemy>());

    for (const auto& e : enemies) {
        e->attack(); // 仮想関数テーブル経由の動的呼び出し
    }

    std::cout << "[CLEAR] L4_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
    expectedOutputPattern: 'Boss: 3WAY拡散メガキャノン発射！',
    successMessage: '🎉 大正解！仮想関数テーブル（vtable）による動的ディスパッチをその手で実現しました！',
    hint: 'class BossEnemy : public Enemy { public: void attack() const override { std::cout << "Boss: 3WAY拡散メガキャノン発射！" << std::endl; } }; と定義します。',
    solutionCode: `#include <iostream>
#include <vector>
#include <memory>

class Enemy {
public:
    virtual ~Enemy() = default;
    virtual void attack() const = 0;
};

class NormalEnemy : public Enemy {
public:
    void attack() const override {
        std::cout << "Normal: 単発レーザー発射！" << std::endl;
    }
};

class BossEnemy : public Enemy {
public:
    void attack() const override {
        std::cout << "Boss: 3WAY拡散メガキャノン発射！" << std::endl;
    }
};

int main() {
    std::cout << "--- L4 多態性 (vtable) テスト ---" << std::endl;
    
    std::vector<std::unique_ptr<Enemy>> enemies;
    enemies.push_back(std::make_unique<NormalEnemy>());
    enemies.push_back(std::make_unique<BossEnemy>());

    for (const auto& e : enemies) {
        e->attack();
    }

    std::cout << "[CLEAR] L4_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
  },

  // M1: スマートポインタとRAII
  'chapter-5-smart-pointers-raii': {
    id: 'challenge-m1',
    chapterSlug: 'chapter-5-smart-pointers-raii',
    chapterBadge: 'M1',
    title: '演習M1：生ポインタ new/delete を std::unique_ptr に置換せよ！',
    missionObjective: '危険な生ポインタ new/delete を追放し、std::unique_ptr と std::make_unique を使って、例外が発生しても確実にデストラクタが呼ばれる RAII 設計に書き換えてください。',
    mentorAdvice: '「deleteを忘れないように気をつける」のは人間の脳には無理じゃ！寿命がスコープを抜けた瞬間に自動解放されるスマートポインタを使い倒すのじゃ！',
    initialCode: `#include <iostream>
#include <memory>

class ShieldGenerator {
public:
    ShieldGenerator() { std::cout << "[GEN] シールド発生器起動" << std::endl; }
    ~ShieldGenerator() { std::cout << "[GEN] シールド発生器安全に停止（メモリ解放）" << std::endl; }
    void activate() { std::cout << "[GEN] バリア展開中！" << std::endl; }
};

// TODO: 生ポインタではなく std::unique_ptr<ShieldGenerator> を使用してください
void runMission() {
    // 修正前:
    // ShieldGenerator* gen = new ShieldGenerator();
    // gen->activate();
    // delete gen; // 途中で例外が出たらリーク！

    // ここを std::make_unique に書き換え
}

int main() {
    std::cout << "--- M1 RAII テスト開始 ---" << std::endl;
    runMission();
    std::cout << "ミッション終了後のスコープ" << std::endl;
    std::cout << "[CLEAR] M1_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
    expectedOutputPattern: '[GEN] シールド発生器安全に停止',
    successMessage: '🎉 完璧です！deleteを一切書くことなく、スコープ脱出時に100%確実に安全解放されました！',
    hint: 'auto gen = std::make_unique<ShieldGenerator>(); gen->activate(); とするだけで、関数終了時に自動解放されます。',
    solutionCode: `#include <iostream>
#include <memory>

class ShieldGenerator {
public:
    ShieldGenerator() { std::cout << "[GEN] シールド発生器起動" << std::endl; }
    ~ShieldGenerator() { std::cout << "[GEN] シールド発生器安全に停止（メモリ解放）" << std::endl; }
    void activate() { std::cout << "[GEN] バリア展開中！" << std::endl; }
};

void runMission() {
    auto gen = std::make_unique<ShieldGenerator>();
    gen->activate();
}

int main() {
    std::cout << "--- M1 RAII テスト開始 ---" << std::endl;
    runMission();
    std::cout << "ミッション終了後のスコープ" << std::endl;
    std::cout << "[CLEAR] M1_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
  },

  // L10: CRTP 静的多態性
  'chapter-10-static-polymorphism-crtp': {
    id: 'challenge-l10',
    chapterSlug: 'chapter-10-static-polymorphism-crtp',
    chapterBadge: 'L10',
    title: '演習L10：CRTPパターンでvtable無しの高速ディスパッチを実現せよ！',
    missionObjective: '仮想関数テーブル（vtable）のポインタ参照オーバーヘッドをゼロにするため、CRTP（Curiously Recurring Template Pattern）を用いて、基底クラスから派生クラスの実装 static_cast<const Derived*>(this)->renderImpl() を静的呼び出ししてください。',
    mentorAdvice: 'コンパイル時に型が決定し、インライン展開まで狙えるのがCRTPの威力じゃ！基底クラスが自らを継承する派生クラスの型をテンプレート引数として受け取るのが鍵じゃぞ！',
    initialCode: `#include <iostream>

// CRTP 基底クラス
template <typename Derived>
class EntityRenderer {
public:
    void render() const {
        // TODO: static_cast を使って派生クラスにキャストし、renderImpl() を呼び出してください
        // static_cast<const Derived*>(this)->renderImpl();
    }
};

class InvaderGraphic : public EntityRenderer<InvaderGraphic> {
public:
    void renderImpl() const {
        std::cout << "👾 [CRTP INLINE] インベーダーを描画" << std::endl;
    }
};

int main() {
    std::cout << "--- L10 CRTP テスト ---" << std::endl;
    InvaderGraphic invader;
    invader.render(); // vtable を介さないゼロオーバーヘッド呼び出し

    std::cout << "[CLEAR] L10_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
    expectedOutputPattern: '👾 [CRTP INLINE] インベーダーを描画',
    successMessage: '🎉 素晴らしい！vtableのメモリも間接参照コストもゼロの静的多態性を達成しました！',
    hint: 'render() の中で static_cast<const Derived*>(this)->renderImpl(); と記述します。',
    solutionCode: `#include <iostream>

template <typename Derived>
class EntityRenderer {
public:
    void render() const {
        static_cast<const Derived*>(this)->renderImpl();
    }
};

class InvaderGraphic : public EntityRenderer<InvaderGraphic> {
public:
    void renderImpl() const {
        std::cout << "👾 [CRTP INLINE] インベーダーを描画" << std::endl;
    }
};

int main() {
    std::cout << "--- L10 CRTP テスト ---" << std::endl;
    InvaderGraphic invader;
    invader.render();

    std::cout << "[CLEAR] L10_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
  },

  // L11: 独自メモリアロケータと固定長プール
  'chapter-11-memory-pool-allocator': {
    id: 'challenge-l11',
    chapterSlug: 'chapter-11-memory-pool-allocator',
    chapterBadge: 'L11',
    title: '演習L11：placement new で静的バッファ上にオブジェクトを構築せよ！',
    missionObjective: 'OSのヒープmallocに頼らず、alignas(Bullet) でアライメント確保されたスタックバッファメモリ上に placement new (new (ptr) Bullet(...)) で弾丸を生成し、明示的デストラクタ呼び出し (~Bullet()) で破棄してください。',
    mentorAdvice: 'ヒープ断片化（フラグメンテーション）に怯える組込みやゲームエンジン開発の必殺技じゃ！new (アドレス) 型名(引数) の構文をしっかり身につけるのじゃ！',
    initialCode: `#include <iostream>
#include <new> // placement new に必須

struct Bullet {
    int id;
    int power;

    Bullet(int i, int p) : id(i), power(p) {
        std::cout << "[POOL] 弾丸 #" << id << " を配置 new で生成！" << std::endl;
    }
    ~Bullet() {
        std::cout << "[POOL] 弾丸 #" << id << " のデストラクタを実行！" << std::endl;
    }
};

int main() {
    std::cout << "--- L11 固定長プール ＆ placement new テスト ---" << std::endl;

    // 弾丸1個分の生メモリバッファをアライメント正しく確保
    alignas(Bullet) char memoryBuffer[sizeof(Bullet)];

    // TODO 1: memoryBuffer のアドレス上に placement new で Bullet(42, 999) を構築してください
    // Bullet* b = new (memoryBuffer) Bullet(42, 999);
    Bullet* b = nullptr;

    // TODO 2: placement new したオブジェクトは delete してはならない（バッファがヒープでないため）
    // 明示的デストラクタ呼び出し b->~Bullet(); を行ってください
    if (b) {
        std::cout << "Bullet ID: " << b->id << ", Power: " << b->power << std::endl;
        // デストラクタ呼び出し
    }

    std::cout << "[CLEAR] L11_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
    expectedOutputPattern: '[POOL] 弾丸 #42 のデストラクタを実行！',
    successMessage: '🎉 お見事！プレースメントnewと明示的デストラクタ呼び出しで、独自メモリアロケータの真髄を極めました！',
    hint: 'Bullet* b = new (memoryBuffer) Bullet(42, 999); とし、破棄は b->~Bullet(); と直接関数呼び出しします。',
    solutionCode: `#include <iostream>
#include <new>

struct Bullet {
    int id;
    int power;

    Bullet(int i, int p) : id(i), power(p) {
        std::cout << "[POOL] 弾丸 #" << id << " を配置 new で生成！" << std::endl;
    }
    ~Bullet() {
        std::cout << "[POOL] 弾丸 #" << id << " のデストラクタを実行！" << std::endl;
    }
};

int main() {
    std::cout << "--- L11 固定長プール ＆ placement new テスト ---" << std::endl;

    alignas(Bullet) char memoryBuffer[sizeof(Bullet)];

    Bullet* b = new (memoryBuffer) Bullet(42, 999);

    if (b) {
        std::cout << "Bullet ID: " << b->id << ", Power: " << b->power << std::endl;
        b->~Bullet();
    }

    std::cout << "[CLEAR] L11_MISSION_SUCCESS" << std::endl;
    return 0;
}
`,
  },

  // L12: レガシーゲームエンジン統合アーキテクチャ
  'chapter-12-game-engine-architecture': {
    id: 'challenge-l12',
    chapterSlug: 'chapter-12-game-engine-architecture',
    chapterBadge: 'L12',
    title: '演習L12：固定デルタタイムとアキュムレータループを実装せよ！',
    missionObjective: 'フレームごとの経過時間（dt）をアキュムレータに蓄積し、FIXED_DT（1/60秒 ≒ 0.0166秒）刻みで物理更新 advancePhysicsStep() を実行する決定論的ゲームループを実装してください。',
    mentorAdvice: '商用エンジンの心臓部じゃ！accumulator >= FIXED_DT の間 while ループでシミュレーションを進め、accumulator から FIXED_DT を引くのじゃ！',
    initialCode: `#include <iostream>
#include <algorithm>

class GameEngineLoop {
private:
    static constexpr double FIXED_DT = 1.0 / 60.0; // 0.016666...
    double accumulator_ = 0.0;
    int physicsTickCount_ = 0;

public:
    void advancePhysicsStep() {
        physicsTickCount_++;
        std::cout << "  [Physics] 固定ステップ #" << physicsTickCount_ << " 実行 (dt=" << FIXED_DT << ")" << std::endl;
    }

    // TODO: 1フレームの経過時間 frameTime を受け取り、
    // accumulator_ に蓄積して、FIXED_DT 刻みで advancePhysicsStep() を実行してください
    void update(double frameTime) {
        // スパイラル・オブ・デス防止：上限 0.25秒 でクランプ
        double clampedTime = std::min(frameTime, 0.25);

        // ここにアキュムレータへの蓄積と、while ループでの物理ステップ呼び出しを実装
        // accumulator_ += clampedTime;
        // while (accumulator_ >= FIXED_DT) {
        //     advancePhysicsStep();
        //     accumulator_ -= FIXED_DT;
        // }
    }

    int getTickCount() const { return physicsTickCount_; }
    double getRemainingAccumulator() const { return accumulator_; }
};

int main() {
    std::cout << "--- L12 固定デルタタイム ゲームループ テスト ---" << std::endl;
    GameEngineLoop engine;

    // 1. 通常の 60FPS フレーム (約 0.0167秒) -> 1回物理ステップが走る
    std::cout << "Frame 1 (0.0167秒経過):" << std::endl;
    engine.update(0.0167);

    // 2. 激しい処理落ちフレーム (0.0500秒経過: 約3フレーム分) -> 3回物理ステップが走る
    std::cout << "Frame 2 (0.0500秒経過 - 処理落ち発生):" << std::endl;
    engine.update(0.0500);

    std::cout << "Total Physics Ticks: " << engine.getTickCount() << std::endl;

    // 0.0167 + 0.0500 = 0.0667秒 / (1/60 ≒ 0.016666) -> 計4回のTicksが期待される
    if (engine.getTickCount() == 4) {
        std::cout << "[CLEAR] L12_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 物理Tick回数が期待値(4)と一致しません (実際: " << engine.getTickCount() << ")" << std::endl;
    }

    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L12_MISSION_SUCCESS',
    successMessage: '🎉 完璧です！アキュムレータ方式によって、処理落ちが発生しても弾抜けを起こさず決定論的に追いつくゲームループを構築できました！',
    hint: 'accumulator_ += clampedTime; のあと、while (accumulator_ >= FIXED_DT) { advancePhysicsStep(); accumulator_ -= FIXED_DT; } と記述します。',
    solutionCode: `#include <iostream>
#include <algorithm>

class GameEngineLoop {
private:
    static constexpr double FIXED_DT = 1.0 / 60.0;
    double accumulator_ = 0.0;
    int physicsTickCount_ = 0;

public:
    void advancePhysicsStep() {
        physicsTickCount_++;
        std::cout << "  [Physics] 固定ステップ #" << physicsTickCount_ << " 実行 (dt=" << FIXED_DT << ")" << std::endl;
    }

    void update(double frameTime) {
        double clampedTime = std::min(frameTime, 0.25);
        accumulator_ += clampedTime;
        while (accumulator_ >= FIXED_DT) {
            advancePhysicsStep();
            accumulator_ -= FIXED_DT;
        }
    }

    int getTickCount() const { return physicsTickCount_; }
    double getRemainingAccumulator() const { return accumulator_; }
};

int main() {
    std::cout << "--- L12 固定デルタタイム ゲームループ テスト ---" << std::endl;
    GameEngineLoop engine;

    std::cout << "Frame 1 (0.0167秒経過):" << std::endl;
    engine.update(0.0167);

    std::cout << "Frame 2 (0.0500秒経過 - 処理落ち発生):" << std::endl;
    engine.update(0.0500);

    std::cout << "Total Physics Ticks: " << engine.getTickCount() << std::endl;

    if (engine.getTickCount() == 4) {
        std::cout << "[CLEAR] L12_MISSION_SUCCESS" << std::endl;
    }

    return 0;
}
`,
  },

  // L13: アセット管理とリソースキャッシュ設計
  'chapter-classic-13-asset-manager': {
    id: 'challenge-l13',
    chapterSlug: 'chapter-classic-13-asset-manager',
    chapterBadge: 'L13',
    title: '演習L13：Flyweightリソースマネージャーでアセット共有を実装せよ！',
    missionObjective: 'リソース名（キー）をマップでキャッシュ管理し、初回は新規ロード、2回目以降は既存の共有インスタンスを返却して不要なメモリ確保を防ぐ acquireSound() を実装してください。',
    mentorAdvice: '「同じ音・同じ画像を何度も new しない」のがFlyweightの基本じゃ！cache_.find(name) で検索し、見つかれば refCount++ して既存ポインタを返し、見つからなければ new してキャッシュに追加するのじゃ！',
    initialCode: `#include <iostream>
#include <string>
#include <map>

struct SoundEffect {
    std::string name;
    int refCount;
    SoundEffect(const std::string& n) : name(n), refCount(1) {
        std::cout << "  [Disk Load] 効果音読込: " << name << std::endl;
    }
    ~SoundEffect() {
        std::cout << "  [Release] 効果音破棄: " << name << std::endl;
    }
};

class SoundManager {
private:
    std::map<std::string, SoundEffect*> cache_;
    int loadCount_ = 0;

public:
    ~SoundManager() {
        for (std::map<std::string, SoundEffect*>::iterator it = cache_.begin(); it != cache_.end(); ++it) {
            delete it->second;
        }
    }

    // TODO: Flyweight パターンによるリソース取得を実装してください
    // 1. cache_ 内にすでに name が存在するか検索
    // 2. 存在する場合は refCount をインクリメントし、既存ポインタを返す
    // 3. 存在しない場合は new SoundEffect(name) して cache_ に登録し、loadCount_++ して返す
    SoundEffect* acquireSound(const std::string& name) {
        // ここに実装
        return nullptr;
    }

    int getUniqueLoadedCount() const { return loadCount_; }
    int getCacheSize() const { return static_cast<int>(cache_.size()); }
};

int main() {
    std::cout << "--- L13 Flyweightリソースキャッシュ テスト ---" << std::endl;
    SoundManager manager;

    // 1. レーザー音を3回要求
    SoundEffect* s1 = manager.acquireSound("laser.wav");
    SoundEffect* s2 = manager.acquireSound("laser.wav");
    SoundEffect* s3 = manager.acquireSound("laser.wav");

    // 2. 爆発音を2回要求
    SoundEffect* s4 = manager.acquireSound("explosion.wav");
    SoundEffect* s5 = manager.acquireSound("explosion.wav");

    std::cout << "ディスク読込回数: " << manager.getUniqueLoadedCount() << std::endl;
    std::cout << "キャッシュ内アイテム数: " << manager.getCacheSize() << std::endl;
    std::cout << "laser.wav 参照カウント: " << (s1 ? s1->refCount : 0) << std::endl;

    // 合計5回要求したが、ユニークなロードは2回だけで、同一インスタンスが共有されていること
    if (s1 == s2 && s2 == s3 && s1 != nullptr &&
        s4 == s5 && s4 != nullptr &&
        manager.getUniqueLoadedCount() == 2 &&
        s1->refCount == 3 && s4->refCount == 2) {
        std::cout << "[CLEAR] L13_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] リソースが正しく共有されていません" << std::endl;
    }

    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L13_MISSION_SUCCESS',
    successMessage: '🎉 素晴らしい！同一アセットがメモリ上に1つだけ保持され、何百回再生要求されてもロードが1回で済むFlyweightアーキテクチャが完成しました！',
    hint: 'std::map<std::string, SoundEffect*>::iterator it = cache_.find(name); で検索し、it != cache_.end() なら it->second->refCount++; return it->second; とします。見つからなければ new して cache_[name] に保存します。',
    solutionCode: `#include <iostream>
#include <string>
#include <map>

struct SoundEffect {
    std::string name;
    int refCount;
    SoundEffect(const std::string& n) : name(n), refCount(1) {
        std::cout << "  [Disk Load] 効果音読込: " << name << std::endl;
    }
    ~SoundEffect() {
        std::cout << "  [Release] 効果音破棄: " << name << std::endl;
    }
};

class SoundManager {
private:
    std::map<std::string, SoundEffect*> cache_;
    int loadCount_ = 0;

public:
    ~SoundManager() {
        for (std::map<std::string, SoundEffect*>::iterator it = cache_.begin(); it != cache_.end(); ++it) {
            delete it->second;
        }
    }

    SoundEffect* acquireSound(const std::string& name) {
        std::map<std::string, SoundEffect*>::iterator it = cache_.find(name);
        if (it != cache_.end()) {
            it->second->refCount++;
            return it->second;
        }
        SoundEffect* effect = new SoundEffect(name);
        cache_[name] = effect;
        loadCount_++;
        return effect;
    }

    int getUniqueLoadedCount() const { return loadCount_; }
    int getCacheSize() const { return static_cast<int>(cache_.size()); }
};

int main() {
    SoundManager manager;
    SoundEffect* s1 = manager.acquireSound("laser.wav");
    SoundEffect* s2 = manager.acquireSound("laser.wav");
    SoundEffect* s3 = manager.acquireSound("laser.wav");
    SoundEffect* s4 = manager.acquireSound("explosion.wav");
    SoundEffect* s5 = manager.acquireSound("explosion.wav");

    if (s1 == s2 && s2 == s3 && s1 != nullptr &&
        s4 == s5 && s4 != nullptr &&
        manager.getUniqueLoadedCount() == 2 &&
        s1->refCount == 3 && s4->refCount == 2) {
        std::cout << "[CLEAR] L13_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // L14: 空間分割と超高速衝突判定
  'chapter-classic-14-spatial-partitioning': {
    id: 'challenge-l14',
    chapterSlug: 'chapter-classic-14-spatial-partitioning',
    chapterBadge: 'L14',
    title: '演習L14：均等グリッドによる衝突判定の枝刈りを実装せよ！',
    missionObjective: 'オブジェクトの座標からグリッドのセルIDを算出し、同一セルに属するペアのみを抽出して衝突判定を行う空間ハッシュ関数 getCellId() と登録処理を実装してください。',
    mentorAdvice: 'セル座標は x / cellSize, y / cellSize の整数除算じゃ！異なるセル同士は遠く離れているのでチェック不要、同一セル内だけ二重ループを回せば計算量が激変するのじゃ！',
    initialCode: `#include <iostream>
#include <vector>
#include <map>

struct Object2D {
    int id;
    int x;
    int y;
};

class SimpleSpatialGrid {
private:
    int cellSize_;
    // セルID -> そのセルに存在するオブジェクトIDのリスト
    std::map<int, std::vector<int> > cells_;

public:
    SimpleSpatialGrid(int cellSize) : cellSize_(cellSize) {}

    // TODO: 座標 (x, y) から 1次元のセルID を計算して返してください
    // 簡単のため、セルX = x / cellSize_, セルY = y / cellSize_ とし、
    // セルID = セルY * 1000 + セルX としてください（座標は正の整数を想定）
    int getCellId(int x, int y) const {
        // ここに実装
        return 0;
    }

    void insert(const Object2D& obj) {
        int cellId = getCellId(obj.x, obj.y);
        cells_[cellId].push_back(obj.id);
    }

    // 同一セル内のペア判定を実行し、判定回数（checkCount）を返す
    int countNarrowPhaseChecks() const {
        int checks = 0;
        for (std::map<int, std::vector<int> >::const_iterator it = cells_.begin(); it != cells_.end(); ++it) {
            size_t count = it->second.size();
            // セル内の全ペア数: N * (N - 1) / 2
            if (count >= 2) {
                checks += static_cast<int>(count * (count - 1) / 2);
            }
        }
        return checks;
    }
};

int main() {
    std::cout << "--- L14 空間グリッド衝突枝刈り テスト ---" << std::endl;
    // セルサイズ 100x100
    SimpleSpatialGrid grid(100);

    // セル(0, 0) に3個: x in [0, 99], y in [0, 99]
    grid.insert({1, 10, 20});
    grid.insert({2, 30, 40});
    grid.insert({3, 50, 60});

    // セル(5, 5) に2個: x in [500, 599], y in [500, 599]
    grid.insert({4, 510, 520});
    grid.insert({5, 530, 540});

    // 孤立したセルに1個
    grid.insert({6, 900, 900});

    // 総当たり（N=6）なら 6 * 5 / 2 = 15回の判定が必要
    // 空間グリッドなら:
    // セル(0, 0)の3個 -> 3 * 2 / 2 = 3回
    // セル(5, 5)の2個 -> 2 * 1 / 2 = 1回
    // 合計: 4回！
    int checks = grid.countNarrowPhaseChecks();
    std::cout << "空間グリッドでの判定回数: " << checks << " 回 (総当たりなら 15 回)" << std::endl;

    if (grid.getCellId(50, 60) == 0 &&
        grid.getCellId(510, 520) == 5005 &&
        checks == 4) {
        std::cout << "[CLEAR] L14_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] セルIDの計算または判定回数が正しくありません" << std::endl;
    }

    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L14_MISSION_SUCCESS',
    successMessage: '🎉 お見事！遠く離れたオブジェクト同士の判定を空間分割で根こそぎ枝刈りし、判定回数を大幅に削減できました！',
    hint: 'int cx = x / cellSize_; int cy = y / cellSize_; return cy * 1000 + cx; と実装します。',
    solutionCode: `#include <iostream>
#include <vector>
#include <map>

struct Object2D {
    int id;
    int x;
    int y;
};

class SimpleSpatialGrid {
private:
    int cellSize_;
    std::map<int, std::vector<int> > cells_;

public:
    SimpleSpatialGrid(int cellSize) : cellSize_(cellSize) {}

    int getCellId(int x, int y) const {
        int cx = x / cellSize_;
        int cy = y / cellSize_;
        return cy * 1000 + cx;
    }

    void insert(const Object2D& obj) {
        int cellId = getCellId(obj.x, obj.y);
        cells_[cellId].push_back(obj.id);
    }

    int countNarrowPhaseChecks() const {
        int checks = 0;
        for (std::map<int, std::vector<int> >::const_iterator it = cells_.begin(); it != cells_.end(); ++it) {
            size_t count = it->second.size();
            if (count >= 2) {
                checks += static_cast<int>(count * (count - 1) / 2);
            }
        }
        return checks;
    }
};

int main() {
    SimpleSpatialGrid grid(100);
    grid.insert({1, 10, 20});
    grid.insert({2, 30, 40});
    grid.insert({3, 50, 60});
    grid.insert({4, 510, 520});
    grid.insert({5, 530, 540});
    grid.insert({6, 900, 900});

    int checks = grid.countNarrowPhaseChecks();
    if (grid.getCellId(50, 60) == 0 &&
        grid.getCellId(510, 520) == 5005 &&
        checks == 4) {
        std::cout << "[CLEAR] L14_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // L15: データ駆動設計とスクリプトローダー
  'chapter-classic-15-data-driven': {
    id: 'challenge-l15',
    chapterSlug: 'chapter-classic-15-data-driven',
    chapterBadge: 'L15',
    title: '演習L15：テキストステージスクリプトパーサーを実装せよ！',
    missionObjective: '文字列ストリームを用いて "INVADER 100 200 50" のようなテキスト行を安全に読み取り、コメント行（#）を無視して敵の配置リスト（vector<SpawnData>）を構築するパーサーを実装してください。',
    mentorAdvice: 'std::stringstream と std::getline の組み合わせじゃ！line.empty() || line[0] == "#" をスキップし、lineStream >> type >> x >> y >> hp で安全に型変換して取得するのじゃ！',
    initialCode: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>

struct SpawnData {
    std::string type;
    int x;
    int y;
    int hp;
};

class StageParser {
public:
    // TODO: scriptText を1行ずつ読み込み、有効な SpawnData を outList に格納してください
    // 1. 空行、および先頭が '#' のコメント行はスキップ
    // 2. 正常行は "TYPE X Y HP" の4トークンを読み込む
    // 3. パース成功行のみ outList に追加
    static void parse(const std::string& scriptText, std::vector<SpawnData>& outList) {
        // ここに実装
    }
};

int main() {
    std::cout << "--- L15 データ駆動テキストパーサー テスト ---" << std::endl;
    std::string script = 
        "# === ステージ1 スクリプト ===\\n"
        "# コメント行はスキップ\\n"
        "INVADER 100 200 30\\n"
        "\\n"
        "# 敵2\\n"
        "INVADER 160 200 30\\n"
        "BOSS 300 150 500\\n";

    std::vector<SpawnData> list;
    StageParser::parse(script, list);

    std::cout << "パース成功件数: " << list.size() << std::endl;
    for (size_t i = 0; i < list.size(); ++i) {
        std::cout << "  [" << i << "] " << list[i].type 
                  << " at (" << list[i].x << ", " << list[i].y << ") HP=" << list[i].hp << std::endl;
    }

    if (list.size() == 3 &&
        list[0].type == "INVADER" && list[0].x == 100 && list[0].hp == 30 &&
        list[2].type == "BOSS" && list[2].x == 300 && list[2].hp == 500) {
        std::cout << "[CLEAR] L15_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] パーサーの抽出結果が期待値と一致しません" << std::endl;
    }

    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L15_MISSION_SUCCESS',
    successMessage: '🎉 素晴らしい！外部テキストファイルからゲームステージの敵配置を動的にパース・ロードするデータ駆動アーキテクチャの基礎が完成しました！',
    hint: 'std::istringstream stream(scriptText); std::string line; while (std::getline(stream, line)) { if (line.empty() || line[0] == \'#\') continue; std::stringstream ls(line); SpawnData d; if (ls >> d.type >> d.x >> d.y >> d.hp) outList.push_back(d); } と記述します。',
    solutionCode: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>

struct SpawnData {
    std::string type;
    int x;
    int y;
    int hp;
};

class StageParser {
public:
    static void parse(const std::string& scriptText, std::vector<SpawnData>& outList) {
        std::istringstream stream(scriptText);
        std::string line;
        while (std::getline(stream, line)) {
            if (line.empty() || line[0] == '#') {
                continue;
            }
            std::stringstream ls(line);
            SpawnData d;
            if (ls >> d.type >> d.x >> d.y >> d.hp) {
                outList.push_back(d);
            }
        }
    }
};

int main() {
    std::string script = 
        "# === ステージ1 スクリプト ===\\n"
        "# コメント行はスキップ\\n"
        "INVADER 100 200 30\\n"
        "\\n"
        "INVADER 160 200 30\\n"
        "BOSS 300 150 500\\n";

    std::vector<SpawnData> list;
    StageParser::parse(script, list);

    if (list.size() == 3 &&
        list[0].type == "INVADER" && list[0].x == 100 && list[0].hp == 30 &&
        list[2].type == "BOSS" && list[2].x == 300 && list[2].hp == 500) {
        std::cout << "[CLEAR] L15_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // L16: ビット演算・ビットフラグとステータス異常系
  'chapter-classic-16-bit-flags': {
    id: 'challenge-l16',
    chapterSlug: 'chapter-classic-16-bit-flags',
    chapterBadge: 'L16',
    title: '演習L16：型安全ビットフラグによる状態異常コンボ判定を実装せよ！',
    missionObjective: 'enum class StatusEffect に対するビットフラグ付与（OR）、解除（AND + NOT）、所持チェック（AND）、複合判定（hasAll）を実装し、状態異常のテストをパスさせてください。',
    mentorAdvice: 'フラグ付与は flags |= mask、解除は flags &= ~mask、チェックは (flags & mask) != 0 じゃ！enum class は static_cast<uint32_t> して演算するのじゃ！',
    initialCode: `#include <iostream>
#include <stdint.h>

enum class StatusEffect : uint32_t {
    None        = 0,
    Poison      = 1 << 0, // 0x01: 毒
    Frozen      = 1 << 1, // 0x02: 氷結
    Invincible  = 1 << 2, // 0x04: 無敵
    Shield      = 1 << 3  // 0x08: バリア
};

inline StatusEffect operator|(StatusEffect a, StatusEffect b) {
    return static_cast<StatusEffect>(static_cast<uint32_t>(a) | static_cast<uint32_t>(b));
}

inline StatusEffect operator&(StatusEffect a, StatusEffect b) {
    return static_cast<StatusEffect>(static_cast<uint32_t>(a) & static_cast<uint32_t>(b));
}

inline StatusEffect operator~(StatusEffect a) {
    return static_cast<StatusEffect>(~static_cast<uint32_t>(a));
}

class StatusHolder {
private:
    StatusEffect flags_ = StatusEffect::None;

public:
    // TODO: 以下の4つのビット操作メソッドを実装してください
    // 1. add: flags_ に effect を付与 (OR演算)
    // 2. remove: flags_ から effect を解除 (AND + NOT演算)
    // 3. has: effect のビットが立っているか判定 (None以外ならtrue)
    // 4. hasAll: combined に含まれるすべてのビットが立っているか判定
    void add(StatusEffect effect) {
        // ここに実装
    }

    void remove(StatusEffect effect) {
        // ここに実装
    }

    bool has(StatusEffect effect) const {
        // ここに実装
        return false;
    }

    bool hasAll(StatusEffect combined) const {
        // ここに実装
        return false;
    }

    uint32_t getRawValue() const { return static_cast<uint32_t>(flags_); }
};

int main() {
    std::cout << "--- L16 型安全ビットフラグ テスト ---" << std::endl;
    StatusHolder holder;

    // 1. 毒と氷結を付与 (0x01 | 0x02 = 0x03)
    holder.add(StatusEffect::Poison | StatusEffect::Frozen);
    std::cout << "付与後生フラグ値: 0x" << std::hex << holder.getRawValue() << std::dec << std::endl;

    bool check1 = holder.has(StatusEffect::Poison);
    bool check2 = holder.has(StatusEffect::Frozen);
    bool check3 = !holder.has(StatusEffect::Shield);
    bool checkCombo = holder.hasAll(StatusEffect::Poison | StatusEffect::Frozen);

    // 2. 毒のみを解除 (0x03 & ~0x01 = 0x02)
    holder.remove(StatusEffect::Poison);
    bool check4 = !holder.has(StatusEffect::Poison);
    bool check5 = holder.has(StatusEffect::Frozen);

    std::cout << "Poisonあり: " << check1 << ", Frozenあり: " << check2 << ", Combo判定: " << checkCombo << std::endl;
    std::cout << "Poison解除後: " << check4 << ", Frozen残り: " << check5 << std::endl;

    if (check1 && check2 && check3 && checkCombo && check4 && check5 && holder.getRawValue() == 2) {
        std::cout << "[CLEAR] L16_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] ビットフラグの操作結果が正しくありません" << std::endl;
    }

    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] L16_MISSION_SUCCESS',
    successMessage: '🎉 完璧です！たった1つの整数で32種の状態をO(1)で操り、複合条件も一瞬で判定できる型安全ビットフラグをマスターしました！',
    hint: 'addは flags_ = flags_ | effect; removeは flags_ = flags_ & (~effect); hasは (flags_ & effect) != StatusEffect::None; hasAllは (flags_ & combined) == combined; とします。',
    solutionCode: `#include <iostream>
#include <stdint.h>

enum class StatusEffect : uint32_t {
    None        = 0,
    Poison      = 1 << 0,
    Frozen      = 1 << 1,
    Invincible  = 1 << 2,
    Shield      = 1 << 3
};

inline StatusEffect operator|(StatusEffect a, StatusEffect b) {
    return static_cast<StatusEffect>(static_cast<uint32_t>(a) | static_cast<uint32_t>(b));
}

inline StatusEffect operator&(StatusEffect a, StatusEffect b) {
    return static_cast<StatusEffect>(static_cast<uint32_t>(a) & static_cast<uint32_t>(b));
}

inline StatusEffect operator~(StatusEffect a) {
    return static_cast<StatusEffect>(~static_cast<uint32_t>(a));
}

class StatusHolder {
private:
    StatusEffect flags_ = StatusEffect::None;

public:
    void add(StatusEffect effect) {
        flags_ = flags_ | effect;
    }

    void remove(StatusEffect effect) {
        flags_ = flags_ & (~effect);
    }

    bool has(StatusEffect effect) const {
        return (flags_ & effect) != StatusEffect::None;
    }

    bool hasAll(StatusEffect combined) const {
        return (flags_ & combined) == combined;
    }

    uint32_t getRawValue() const { return static_cast<uint32_t>(flags_); }
};

int main() {
    StatusHolder holder;
    holder.add(StatusEffect::Poison | StatusEffect::Frozen);
    holder.remove(StatusEffect::Poison);

    if (holder.getRawValue() == 2) {
        std::cout << "[CLEAR] L16_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M3: 【C++11/14】ラムダ式と関数オブジェクト
  'chapter-modern-3-lambda': {
    id: 'challenge-m3',
    chapterSlug: 'chapter-modern-3-lambda',
    chapterBadge: 'M3',
    title: '演習M3：ラムダ式で条件に合致する敵を抽出せよ！',
    missionObjective: 'std::count_if の述語引数にラムダ式 [threshold](const Enemy& e) { return e.hp <= threshold; } を渡し、低HP敵のカウントテストをパスさせてください。',
    mentorAdvice: '外部のローカル変数 threshold をキャプチャリスト [threshold] に入れて取り込むのじゃ！引数は (const Enemy& e) で受け取るのじゃぞ！',
    initialCode: `#include <iostream>
#include <vector>
#include <algorithm>

struct Enemy {
    int id;
    int hp;
};

int main() {
    std::cout << "--- M3 ラムダ式カウント テスト ---" << std::endl;
    std::vector<Enemy> enemies = {
        {1, 50},
        {2, 15},
        {3, 80},
        {4, 25},
        {5, 5}
    };

    int threshold = 20;

    // TODO: threshold 以下のHPを持つ敵の数をカウントするラムダ式を
    // std::count_if の第3引数に渡してください
    int lowHpCount = std::count_if(enemies.begin(), enemies.end(), /* ここにラムダ式を記述 */ [](const Enemy& e) {
        return false;
    });

    std::cout << "HP " << threshold << " 以下の敵数: " << lowHpCount << std::endl;

    if (lowHpCount == 2) {
        std::cout << "[CLEAR] M3_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] カウント結果が期待値(2)と一致しません" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M3_MISSION_SUCCESS',
    successMessage: '🎉 お見事！ローカル変数を安全にキャプチャしたラムダ式で、インラインかつ型安全にコレクション処理を記述できました！',
    hint: 'std::count_if(enemies.begin(), enemies.end(), [threshold](const Enemy& e) { return e.hp <= threshold; }); と記述します。',
    solutionCode: `#include <iostream>
#include <vector>
#include <algorithm>

struct Enemy {
    int id;
    int hp;
};

int main() {
    std::vector<Enemy> enemies = {
        {1, 50},
        {2, 15},
        {3, 80},
        {4, 25},
        {5, 5}
    };

    int threshold = 20;
    int lowHpCount = std::count_if(enemies.begin(), enemies.end(), [threshold](const Enemy& e) {
        return e.hp <= threshold;
    });

    if (lowHpCount == 2) {
        std::cout << "[CLEAR] M3_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M4: 【C++11/14】可変引数テンプレートと完全転送
  'chapter-modern-4-variadic-templates': {
    id: 'challenge-m4',
    chapterSlug: 'chapter-modern-4-variadic-templates',
    chapterBadge: 'M4',
    title: '演習M4：可変引数テンプレートと完全転送で万能ファクトリを実装せよ！',
    missionObjective: '万能参照 Args&&... と std::forward<Args>(args)... を用いて、任意の引数をそのままコンストラクタに届けて std::unique_ptr<T> を生成する spawnEntity<T>() を実装してください。',
    mentorAdvice: '「テンプレート引数 Args&&... で受け、new T(std::forward<Args>(args)...) で転送する」のが完全転送の黄金律じゃ！',
    initialCode: `#include <iostream>
#include <string>
#include <memory>
#include <utility>

struct Projectile {
    std::string type;
    int speed;
    int power;
    Projectile(std::string t, int s, int p) : type(std::move(t)), speed(s), power(p) {}
};

// TODO: 可変引数テンプレートと完全転送を用いて spawnEntity<T>() を実装してください
// template <typename T, typename... Args>
// std::unique_ptr<T> spawnEntity(Args&&... args) {
//     return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
// }
template <typename T, typename... Args>
std::unique_ptr<T> spawnEntity(Args&&... args) {
    // ここに実装
    return nullptr;
}

int main() {
    std::cout << "--- M4 可変引数完全転送ファクトリ テスト ---" << std::endl;
    auto bullet = spawnEntity<Projectile>("Laser", 500, 30);

    if (bullet && bullet->type == "Laser" && bullet->speed == 500 && bullet->power == 30) {
        std::cout << "[CLEAR] M4_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 生成されたオブジェクトの値が不正です" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M4_MISSION_SUCCESS',
    successMessage: '🎉 完璧です！引数の数や型に一切依存せず、ゼロコピーで直接オブジェクトを構築する万能ファクトリを完成させました！',
    hint: 'return std::unique_ptr<T>(new T(std::forward<Args>(args)...)); と記述します。',
    solutionCode: `#include <iostream>
#include <string>
#include <memory>
#include <utility>

struct Projectile {
    std::string type;
    int speed;
    int power;
    Projectile(std::string t, int s, int p) : type(std::move(t)), speed(s), power(p) {}
};

template <typename T, typename... Args>
std::unique_ptr<T> spawnEntity(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}

int main() {
    auto bullet = spawnEntity<Projectile>("Laser", 500, 30);
    if (bullet && bullet->type == "Laser" && bullet->speed == 500 && bullet->power == 30) {
        std::cout << "[CLEAR] M4_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M5: 【C++11/14】標準マルチスレッドと並行処理
  'chapter-modern-5-multithreading': {
    id: 'challenge-m5',
    chapterSlug: 'chapter-modern-5-multithreading',
    chapterBadge: 'M5',
    title: '演習M5：std::atomic でスレッドセーフなスコアカウンタを実装せよ！',
    missionObjective: '複数スレッドから同時に並行加算されてもデータ競合を起こさない SafeScoreCounter クラスを std::atomic を使って完成させてください。',
    mentorAdvice: 'std::atomic<int> score_{0}; に対し、score_.fetch_add(val); または score_ += val; を呼ぶのじゃ！CPUアトミック命令でロックフリーに完結するぞ！',
    initialCode: `#include <iostream>
#include <thread>
#include <vector>
#include <atomic>

class SafeScoreCounter {
private:
    std::atomic<int> score_{0};

public:
    // TODO: スレッドセーフに val を加算する addScore メソッドを実装してください
    void addScore(int val) {
        // ここに実装
    }

    int getScore() const {
        return score_.load();
    }
};

int main() {
    std::cout << "--- M5 マルチスレッド並行処理 テスト ---" << std::endl;
    SafeScoreCounter counter;
    const int THREAD_COUNT = 4;
    const int ADDS_PER_THREAD = 1000;

    std::vector<std::thread> threads;
    for (int i = 0; i < THREAD_COUNT; ++i) {
        threads.emplace_back([&counter, ADDS_PER_THREAD]() {
            for (int j = 0; j < ADDS_PER_THREAD; ++j) {
                counter.addScore(1);
            }
        });
    }

    for (auto& th : threads) {
        th.join();
    }

    std::cout << "最終スコア: " << counter.getScore() << " (期待値: 4000)" << std::endl;

    if (counter.getScore() == 4000) {
        std::cout << "[CLEAR] M5_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] データ競合が発生しています" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M5_MISSION_SUCCESS',
    successMessage: '🎉 素晴らしい！std::atomic により、重いOSミューテックスを使わずロックフリーにスレッド安全な高速カウンタを実現しました！',
    hint: 'score_.fetch_add(val); または score_ += val; と記述します。',
    solutionCode: `#include <iostream>
#include <thread>
#include <vector>
#include <atomic>

class SafeScoreCounter {
private:
    std::atomic<int> score_{0};

public:
    void addScore(int val) {
        score_.fetch_add(val);
    }

    int getScore() const {
        return score_.load();
    }
};

int main() {
    SafeScoreCounter counter;
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&counter]() {
            for (int j = 0; j < 1000; ++j) counter.addScore(1);
        });
    }
    for (auto& th : threads) th.join();
    if (counter.getScore() == 4000) {
        std::cout << "[CLEAR] M5_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M6: 【C++17】ゼロコピー文字列革命：std::string_view
  'chapter-modern-6-string-view': {
    id: 'challenge-m6-string-view',
    chapterSlug: 'chapter-modern-6-string-view',
    chapterBadge: 'M6',
    title: '演習M6：std::string_view でゼロコピー文字列切り出しと拡張子判定を実装せよ！',
    missionObjective: 'std::string_view を引数にとり、文字列のコピー（ヒープ確保）を一切行わずに末尾の拡張子を切り出して判定する isTargetExtension(filepath, ext) 関数を完成させてください。',
    mentorAdvice: 'std::string_view の substr() は文字をコピーせずポインタと長さをズラすだけじゃ！O(1) の高速スライスを体感するのじゃ！',
    initialCode: `#include <iostream>
#include <string_view>

// TODO: std::string_view を使って、filepath の末尾が targetExt と一致するか判定する関数を実装してください
// 1. filepath の長さが targetExt の長さ未満なら false
// 2. filepath.substr(filepath.length() - targetExt.length()) と targetExt を比較
bool isTargetExtension(std::string_view filepath, std::string_view targetExt) {
    // ここに実装
    return false;
}

int main() {
    std::cout << "--- M6 std::string_view ゼロコピー判定テスト ---" << std::endl;
    
    // 文字列リテラル（malloc 0）
    bool test1 = isTargetExtension("assets/textures/boss_ship.png", ".png");
    bool test2 = isTargetExtension("sounds/bgm/battle.wav", ".png");
    bool test3 = isTargetExtension("short", ".toolongextension");

    std::cout << "test1 (true expected): " << std::boolalpha << test1 << std::endl;
    std::cout << "test2 (false expected): " << std::boolalpha << test2 << std::endl;
    std::cout << "test3 (false expected): " << std::boolalpha << test3 << std::endl;

    if (test1 && !test2 && !test3) {
        std::cout << "[CLEAR] M6_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 判定ロジックが不正です" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M6_MISSION_SUCCESS',
    successMessage: '🎉 お見事！std::string_view によるゼロコピー＆ゼロアロケーションな高速文字列判定をマスターしました！',
    hint: 'if (filepath.length() < targetExt.length()) return false; return filepath.substr(filepath.length() - targetExt.length()) == targetExt; と記述します。',
    solutionCode: `#include <iostream>
#include <string_view>

bool isTargetExtension(std::string_view filepath, std::string_view targetExt) {
    if (filepath.length() < targetExt.length()) return false;
    return filepath.substr(filepath.length() - targetExt.length()) == targetExt;
}

int main() {
    bool test1 = isTargetExtension("assets/textures/boss_ship.png", ".png");
    bool test2 = isTargetExtension("sounds/bgm/battle.wav", ".png");
    bool test3 = isTargetExtension("short", ".toolongextension");

    if (test1 && !test2 && !test3) {
        std::cout << "[CLEAR] M6_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M8: 【C++17】テンプレート革命：if constexpr と構造化束縛
  'chapter-modern-8-if-constexpr': {
    id: 'challenge-m8-if-constexpr',
    chapterSlug: 'chapter-modern-8-if-constexpr',
    chapterBadge: 'M8',
    title: '演習M8：if constexpr と構造化束縛で汎用ダメージ計算を実装せよ！',
    missionObjective: 'if constexpr を用いて浮動小数点（倍率計算）と整数型（固定加減算）をコンパイル時に分岐し、さらに戻り値を構造化束縛 auto [finalDmg, isCrit] で受け取るシステムを完成させてください。',
    mentorAdvice: 'if constexpr (std::is_floating_point_v<T>) を使うのじゃ！合致しない方のブランチはコンパイラが綺麗に消滅させてくれるぞ！',
    initialCode: `#include <iostream>
#include <type_traits>
#include <tuple>

struct CombatReport {
    int finalDamage;
    bool isCritical;
};

// TODO: if constexpr を用いて、引数 mod の型に応じたダメージ計算を行ってください
// - T が浮動小数点数（std::is_floating_point_v<T>）の場合:
//     finalDamage = static_cast<int>(baseDmg * mod)
//     isCritical = (mod >= 1.5)
// - それ以外（整数等）の場合:
//     finalDamage = baseDmg + static_cast<int>(mod)
//     isCritical = (mod >= 50)
template <typename T>
CombatReport computeDamage(int baseDmg, T mod) {
    // ここに if constexpr による分岐を実装
    return {0, false};
}

int main() {
    std::cout << "--- M8 if constexpr & 構造化束縛テスト ---" << std::endl;

    // 1. 浮動小数点倍率（1.5倍クリティカル）
    auto [dmg1, crit1] = computeDamage(100, 1.5);
    std::cout << "計算1: " << dmg1 << ", クリティカル: " << std::boolalpha << crit1 << std::endl;

    // 2. 整数固定ボーナス（+60クリティカル）
    auto [dmg2, crit2] = computeDamage(100, 60);
    std::cout << "計算2: " << dmg2 << ", クリティカル: " << std::boolalpha << crit2 << std::endl;

    if (dmg1 == 150 && crit1 && dmg2 == 160 && crit2) {
        std::cout << "[CLEAR] M8_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] ダメージ計算結果が不正です" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M8_MISSION_SUCCESS',
    successMessage: '🎉 完璧です！if constexpr によるコンパイル時型分岐と、構造化束縛による多値受け取りを完全攻略しました！',
    hint: 'if constexpr (std::is_floating_point_v<T>) { return {static_cast<int>(baseDmg * mod), mod >= 1.5}; } else { return {baseDmg + static_cast<int>(mod), mod >= 50}; } と記述します。',
    solutionCode: `#include <iostream>
#include <type_traits>
#include <tuple>

struct CombatReport {
    int finalDamage;
    bool isCritical;
};

template <typename T>
CombatReport computeDamage(int baseDmg, T mod) {
    if constexpr (std::is_floating_point_v<T>) {
        return {static_cast<int>(baseDmg * mod), mod >= 1.5};
    } else {
        return {baseDmg + static_cast<int>(mod), mod >= 50};
    }
}

int main() {
    auto [dmg1, crit1] = computeDamage(100, 1.5);
    auto [dmg2, crit2] = computeDamage(100, 60);

    if (dmg1 == 150 && crit1 && dmg2 == 160 && crit2) {
        std::cout << "[CLEAR] M8_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M9: 【C++17】クロスプラットフォームファイル操作：std::filesystem
  'chapter-modern-9-filesystem': {
    id: 'challenge-m9-filesystem',
    chapterSlug: 'chapter-modern-9-filesystem',
    chapterBadge: 'M9',
    title: '演習M9：std::filesystem::path でクロスプラットフォームパスを結合・抽出せよ！',
    missionObjective: 'std::filesystem::path の / 演算子を用いて親ディレクトリ・サブフォルダ・ファイル名を結合し、.extension() や .stem() を正しく抽出する AssetPathResolver を完成させてください。',
    mentorAdvice: 'OSごとの \\\\ や / の違いに悩む日々は終わったのじゃ！path::operator/ のスマートな結合を体感するのじゃ！',
    initialCode: `#include <iostream>
#include <filesystem>
#include <string>

namespace fs = std::filesystem;

class AssetPathResolver {
public:
    // TODO: baseDir, category, filename を / 演算子で結合して正規化パスを返す
    static fs::path buildPath(const std::string& baseDir, const std::string& category, const std::string& filename) {
        // ここに実装
        return {};
    }

    // TODO: 与えられた path の拡張子が targetExt と等しいか判定する
    static bool hasExtension(const fs::path& p, const std::string& targetExt) {
        // ここに実装
        return false;
    }
};

int main() {
    std::cout << "--- M9 std::filesystem パス操作テスト ---" << std::endl;
    
    fs::path resolved = AssetPathResolver::buildPath("game_root", "textures", "boss.png");
    std::cout << "生成パス: " << resolved.string() << std::endl;
    std::cout << "ファイル名本体: " << resolved.stem().string() << std::endl;

    bool isPng = AssetPathResolver::hasExtension(resolved, ".png");
    bool isWav = AssetPathResolver::hasExtension(resolved, ".wav");

    if (resolved.filename() == "boss.png" && resolved.stem() == "boss" && isPng && !isWav) {
        std::cout << "[CLEAR] M9_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] パス解決結果が期待値と異なります" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M9_MISSION_SUCCESS',
    successMessage: '🎉 お見事！std::filesystem によるスマートなパス構築と拡張子解析を完全に体得しました！',
    hint: 'buildPath では fs::path p = fs::path(baseDir) / category / filename; return p.lexically_normal();、hasExtension では return p.extension() == targetExt; と記述します。',
    solutionCode: `#include <iostream>
#include <filesystem>
#include <string>

namespace fs = std::filesystem;

class AssetPathResolver {
public:
    static fs::path buildPath(const std::string& baseDir, const std::string& category, const std::string& filename) {
        fs::path p = fs::path(baseDir) / category / filename;
        return p.lexically_normal();
    }

    static bool hasExtension(const fs::path& p, const std::string& targetExt) {
        return p.extension() == targetExt;
    }
};

int main() {
    fs::path resolved = AssetPathResolver::buildPath("game_root", "textures", "boss.png");
    bool isPng = AssetPathResolver::hasExtension(resolved, ".png");
    bool isWav = AssetPathResolver::hasExtension(resolved, ".wav");

    if (resolved.filename() == "boss.png" && resolved.stem() == "boss" && isPng && !isWav) {
        std::cout << "[CLEAR] M9_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M12: C++20 コルーチン
  'chapter-modern-5-coroutines': {
    id: 'challenge-m12',
    chapterSlug: 'chapter-modern-5-coroutines',
    chapterBadge: 'M12',
    title: '演習M12：C++20 コルーチンで時間差ウェーブ攻撃を実装せよ！',
    missionObjective: 'co_await を使って処理を一時中断できるコルーチン関数 bossSequence(stepTracker) を完成させ、メインループから resume() を呼び出して段階的に攻撃を進めるテストをパスさせてください。',
    mentorAdvice: '「関数自身が時間の経過を制御し、必要なところで co_await でフレームを譲る」のがコルーチンの真髄じゃ！Update() の巨大 switch 文とは永久にお別れじゃぞ！',
    initialCode: `#include <iostream>
#include <coroutine>

struct SimpleTask {
    struct promise_type {
        SimpleTask get_return_object() {
            return SimpleTask{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_void() noexcept {}
        void unhandled_exception() { std::terminate(); }
    };
    std::coroutine_handle<promise_type> handle;
    ~SimpleTask() { if (handle) handle.destroy(); }
    void resume() { if (handle && !handle.done()) handle.resume(); }
    bool isDone() const { return !handle || handle.done(); }
};

struct YieldPoint {
    bool await_ready() const noexcept { return false; }
    void await_suspend(std::coroutine_handle<>) const noexcept {}
    void await_resume() const noexcept {}
};

int g_attackPhase = 0;

// TODO: co_await YieldPoint{} を使って3段階の攻撃シーケンスを実装してください
// 1. g_attackPhase を 1 にセットし、co_await YieldPoint{}; で中断
// 2. g_attackPhase を 2 にセットし、co_await YieldPoint{}; で中断
// 3. g_attackPhase を 3 にセットして関数終了
SimpleTask bossSequence() {
    // ここにコルーチン実装
}

int main() {
    std::cout << "--- M5 コルーチン時間差シーケンス テスト ---" << std::endl;
    SimpleTask task = bossSequence();

    std::cout << "Step 1 実行前: " << g_attackPhase << std::endl;
    task.resume();
    std::cout << "Step 1 実行後: " << g_attackPhase << std::endl;

    task.resume();
    std::cout << "Step 2 実行後: " << g_attackPhase << std::endl;

    task.resume();
    std::cout << "Step 3 実行後: " << g_attackPhase << std::endl;

    if (g_attackPhase == 3 && task.isDone()) {
        std::cout << "[CLEAR] M5_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] シーケンスが期待通りに完了していません" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M5_MISSION_SUCCESS',
    successMessage: '🎉 お見事！C++20 コルーチンの co_await による時間差シーケンスを完全マスターしました！',
    hint: 'g_attackPhase = 1; co_await YieldPoint{}; g_attackPhase = 2; co_await YieldPoint{}; g_attackPhase = 3; のように直線的に記述します。',
    solutionCode: `#include <iostream>
#include <coroutine>

struct SimpleTask {
    struct promise_type {
        SimpleTask get_return_object() {
            return SimpleTask{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_void() noexcept {}
        void unhandled_exception() { std::terminate(); }
    };
    std::coroutine_handle<promise_type> handle;
    ~SimpleTask() { if (handle) handle.destroy(); }
    void resume() { if (handle && !handle.done()) handle.resume(); }
    bool isDone() const { return !handle || handle.done(); }
};

struct YieldPoint {
    bool await_ready() const noexcept { return false; }
    void await_suspend(std::coroutine_handle<>) const noexcept {}
    void await_resume() const noexcept {}
};

int g_attackPhase = 0;

SimpleTask bossSequence() {
    g_attackPhase = 1;
    co_await YieldPoint{};

    g_attackPhase = 2;
    co_await YieldPoint{};

    g_attackPhase = 3;
}

int main() {
    std::cout << "--- M5 コルーチン時間差シーケンス テスト ---" << std::endl;
    SimpleTask task = bossSequence();

    std::cout << "Step 1 実行前: " << g_attackPhase << std::endl;
    task.resume();
    std::cout << "Step 1 実行後: " << g_attackPhase << std::endl;

    task.resume();
    std::cout << "Step 2 実行後: " << g_attackPhase << std::endl;

    task.resume();
    std::cout << "Step 3 実行後: " << g_attackPhase << std::endl;

    if (g_attackPhase == 3 && task.isDone()) {
        std::cout << "[CLEAR] M5_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M6: C++20 コンセプト
  'chapter-modern-6-concepts': {
    id: 'challenge-m6',
    chapterSlug: 'chapter-modern-6-concepts',
    chapterBadge: 'M6',
    title: '演習M6：C++20 コンセプトで被ダメージ型を厳密に制約せよ！',
    missionObjective: 'requires 式を用いて Damageable コンセプトを定義し、takeDamage(int) と getHp() -> int を持つ型だけを安全に受け取る hitEntity(Damageable auto&, int) 関数を完成させてください。',
    mentorAdvice: '「この型は何ができなければならないか」をコンパイラに契約として伝えるのじゃ！SFINAEの黒魔術とは永遠にサヨナラじゃ！',
    initialCode: `#include <iostream>
#include <concepts>

// TODO: Damageable コンセプトを定義してください
// 1. target.takeDamage(int) が呼び出し可能であること
// 2. target.getHp() の戻り値が std::convertible_to<int> であること
template <typename T>
concept Damageable = requires(T a, int dmg) {
    // ここに制約を記述
};

struct AlienShip {
    int hp = 100;
    void takeDamage(int d) { hp -= d; }
    int getHp() const { return hp; }
};

// TODO: Damageable コンセプトで制約された関数を完成させてください
void hitEntity(auto& target, int dmg) {
    // ここに実装
}

int main() {
    std::cout << "--- M6 C++20 コンセプト制約テスト ---" << std::endl;
    AlienShip alien;
    hitEntity(alien, 35);

    std::cout << "Alien HP: " << alien.getHp() << std::endl;

    if (alien.getHp() == 65) {
        std::cout << "[CLEAR] M6_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] ダメージが正しく適用されていません" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M6_MISSION_SUCCESS',
    successMessage: '🎉 素晴らしい！C++20 コンセプトによる美しい自己文書化ジェネリクスを習得しました！',
    hint: 'concept Damageable = requires(T a, int dmg) { a.takeDamage(dmg); { a.getHp() } -> std::convertible_to<int>; }; と定義し、void hitEntity(Damageable auto& target, int dmg) { target.takeDamage(dmg); } と実装します。',
    solutionCode: `#include <iostream>
#include <concepts>

template <typename T>
concept Damageable = requires(T a, int dmg) {
    a.takeDamage(dmg);
    { a.getHp() } -> std::convertible_to<int>;
};

struct AlienShip {
    int hp = 100;
    void takeDamage(int d) { hp -= d; }
    int getHp() const { return hp; }
};

void hitEntity(Damageable auto& target, int dmg) {
    target.takeDamage(dmg);
}

int main() {
    std::cout << "--- M6 C++20 コンセプト制約テスト ---" << std::endl;
    AlienShip alien;
    hitEntity(alien, 35);

    std::cout << "Alien HP: " << alien.getHp() << std::endl;

    if (alien.getHp() == 65) {
        std::cout << "[CLEAR] M6_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M7: C++20 Ranges & Views
  'chapter-modern-7-ranges-views': {
    id: 'challenge-m7',
    chapterSlug: 'chapter-modern-7-ranges-views',
    chapterBadge: 'M7',
    title: '演習M7：C++20 Ranges パイプラインで迎撃目標をゼロアロケーション抽出せよ！',
    missionObjective: 'std::views::filter と std::views::take をパイプライン演算子（|）で繋ぎ、生存中（isAlive == true）かつ脅威度（threatLevel >= 3）の敵上位2体の合計HPを計算してください。',
    mentorAdvice: '中間 vector は1バイトも作るでないぞ！パイプラインでオンデマンドに吸い上げるゼロアロケーションの美学を味わうのじゃ！',
    initialCode: `#include <iostream>
#include <vector>
#include <ranges>

struct EnemyContact {
    int id;
    int hp;
    int threatLevel;
    bool isAlive;
};

int main() {
    std::vector<EnemyContact> contacts = {
        {1, 50,  1, true},
        {2, 120, 4, true},   // 合致1 (HP: 120)
        {3, 200, 5, false},  // 撃破済み
        {4, 80,  3, true},   // 合致2 (HP: 80)
        {5, 90,  5, true}    // 合致3（ただし take(2) で除外されるべき）
    };

    int totalHp = 0;

    // TODO: contacts からパイプライン演算子 (|) を使って
    // 1. isAlive が true
    // 2. threatLevel が 3 以上
    // 3. 先頭 2 件を取り出す (std::views::take(2))
    // のビューを作成し、for ループで totalHp に hp を加算してください
    
    // auto pipeline = ...;

    std::cout << "--- M7 Ranges & Views 抽出テスト ---" << std::endl;
    std::cout << "選定敵2体の合計HP: " << totalHp << " (期待値: 200)" << std::endl;

    if (totalHp == 200) {
        std::cout << "[CLEAR] M7_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 合計HPが期待値と異なります" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M7_MISSION_SUCCESS',
    successMessage: '🎉 完璧です！C++20 Ranges による遅延評価パイプラインで、ゼロアロケーション走査を極めました！',
    hint: 'auto view = contacts | std::views::filter([](const auto& e){ return e.isAlive && e.threatLevel >= 3; }) | std::views::take(2); for (const auto& e : view) totalHp += e.hp; と記述します。',
    solutionCode: `#include <iostream>
#include <vector>
#include <ranges>

struct EnemyContact {
    int id;
    int hp;
    int threatLevel;
    bool isAlive;
};

int main() {
    std::vector<EnemyContact> contacts = {
        {1, 50,  1, true},
        {2, 120, 4, true},   // 合致1 (HP: 120)
        {3, 200, 5, false},  // 撃破済み
        {4, 80,  3, true},   // 合致2 (HP: 80)
        {5, 90,  5, true}    // 合致3
    };

    int totalHp = 0;

    auto pipeline = contacts 
        | std::views::filter([](const auto& e) { return e.isAlive; })
        | std::views::filter([](const auto& e) { return e.threatLevel >= 3; })
        | std::views::take(2);

    for (const auto& e : pipeline) {
        totalHp += e.hp;
    }

    std::cout << "--- M7 Ranges & Views 抽出テスト ---" << std::endl;
    std::cout << "選定敵2体の合計HP: " << totalHp << " (期待値: 200)" << std::endl;

    if (totalHp == 200) {
        std::cout << "[CLEAR] M7_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },

  // M8: C++20 モジュール
  'chapter-modern-8-modules': {
    id: 'challenge-m8',
    chapterSlug: 'chapter-modern-8-modules',
    chapterBadge: 'M8',
    title: '演習M8：モジュールアーキテクチャによるクリーンなカプセル化を体得せよ！',
    missionObjective: 'モジュール境界設計の原則に従い、公開インターフェース（Public API）と非公開ヘルパー（Private Core）の責務を分離したゲームエンジン初期化システムを完成させてください。',
    mentorAdvice: '「外部に見せるもの（export）」と「モジュール内部に隠蔽するもの」の境界線をビシッと引くのがモジュール設計の要諦じゃ！',
    initialCode: `#include <iostream>
#include <string>

// モジュール内部専用（非公開ヘルパー）
namespace Internal {
    int calculateInitialMemory() {
        return 1024 * 64; // 64KB
    }
}

// モジュール外部へエクスポートされる公開クラス
class EngineModuleFacade {
private:
    int allocatedMemory_ = 0;
    bool initialized_ = false;

public:
    // TODO: startup() を実装してください
    // 1. Internal::calculateInitialMemory() を呼んで allocatedMemory_ にセット
    // 2. initialized_ を true にセット
    void startup() {
        // ここに実装
    }

    int getAllocatedMemory() const { return allocatedMemory_; }
    bool isReady() const { return initialized_; }
};

int main() {
    std::cout << "--- M8 モジュール境界初期化テスト ---" << std::endl;
    EngineModuleFacade engine;
    engine.startup();

    std::cout << "エンジン状態: " << (engine.isReady() ? "Ready" : "Not Ready") << std::endl;
    std::cout << "確保メモリ: " << engine.getAllocatedMemory() << " Bytes" << std::endl;

    if (engine.isReady() && engine.getAllocatedMemory() == 65536) {
        std::cout << "[CLEAR] M8_MISSION_SUCCESS" << std::endl;
    } else {
        std::cout << "[FAIL] 初期化が期待値と異なります" << std::endl;
    }
    return 0;
}
`,
    expectedOutputPattern: '[CLEAR] M8_MISSION_SUCCESS',
    successMessage: '🎉 祝・全課程修了！C++20 モジュールによるクリーンアーキテクチャを完全制覇しました！',
    hint: 'allocatedMemory_ = Internal::calculateInitialMemory(); initialized_ = true; と実装します。',
    solutionCode: `#include <iostream>
#include <string>

namespace Internal {
    int calculateInitialMemory() {
        return 1024 * 64;
    }
}

class EngineModuleFacade {
private:
    int allocatedMemory_ = 0;
    bool initialized_ = false;

public:
    void startup() {
        allocatedMemory_ = Internal::calculateInitialMemory();
        initialized_ = true;
    }

    int getAllocatedMemory() const { return allocatedMemory_; }
    bool isReady() const { return initialized_; }
};

int main() {
    std::cout << "--- M8 モジュール境界初期化テスト ---" << std::endl;
    EngineModuleFacade engine;
    engine.startup();

    std::cout << "エンジン状態: " << (engine.isReady() ? "Ready" : "Not Ready") << std::endl;
    std::cout << "確保メモリ: " << engine.getAllocatedMemory() << " Bytes" << std::endl;

    if (engine.isReady() && engine.getAllocatedMemory() == 65536) {
        std::cout << "[CLEAR] M8_MISSION_SUCCESS" << std::endl;
    }
    return 0;
}
`,
  },
};

// 後方互換性・旧スラッグエイリアス登録
CODING_CHALLENGES['chapter-1-spaghetti-to-oop'] = CODING_CHALLENGES['chapter-1-spaghetti-code'];
CODING_CHALLENGES['chapter-2-classes-and-encapsulation'] = CODING_CHALLENGES['chapter-2-classes-and-files'];
CODING_CHALLENGES['chapter-3-dynamic-memory-and-vector'] = CODING_CHALLENGES['chapter-3-dynamic-lifecycle'];
CODING_CHALLENGES['chapter-l10-static-polymorphism-crtp'] = CODING_CHALLENGES['chapter-10-static-polymorphism-crtp'];
CODING_CHALLENGES['chapter-l11-custom-allocator-memory-pool'] = CODING_CHALLENGES['chapter-11-memory-pool-allocator'];

/** 自由実験室（Online Playground）用のプリセットテンプレート一覧 */
export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  {
    id: 'template-basic',
    name: 'C++23 基本テンプレート',
    badge: 'Basic',
    description: 'std::println や auto など最新C++23構文を試せる標準テンプレートです。',
    code: `#include <iostream>
#include <vector>
#include <string>
#include <numeric>

int main() {
    std::cout << "🐻❄️ シロクマC++ラボ オンライン実行環境へようこそ！" << std::endl;

    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);

    std::cout << "合計値: " << sum << std::endl;
    std::cout << "C++バージョン: " << __cplusplus << std::endl;

    return 0;
}
`,
  },
  {
    id: 'template-encapsulation',
    name: 'クラスとカプセル化 (L2)',
    badge: 'L2',
    description: 'privateメンバ変数とpublicメソッドによる防御的プログラミングのサンプルです。',
    code: `#include <iostream>
#include <string>

class SpaceShip {
private:
    std::string name_;
    int shield_{100};

public:
    SpaceShip(std::string name) : name_(std::move(name)) {}

    void takeHit(int damage) {
        shield_ -= damage;
        if (shield_ < 0) shield_ = 0;
        std::cout << name_ << " は " << damage << " ダメージを受けた！ (残シールド: " << shield_ << ")\\n";
    }

    bool isAlive() const { return shield_ > 0; }
};

int main() {
    SpaceShip player("シロクマ1号");
    player.takeHit(35);
    player.takeHit(80);
    std::cout << "生存状態: " << (player.isAlive() ? "戦闘可能" : "大破！") << std::endl;
    return 0;
}
`,
  },
  {
    id: 'template-polymorphism',
    name: '仮想関数と多態性 (L4)',
    badge: 'L4',
    description: '純粋仮想関数、override、基底クラスポインタによる動的ディスパッチのサンプルです。',
    code: `#include <iostream>
#include <vector>
#include <memory>

class Weapon {
public:
    virtual ~Weapon() = default;
    virtual void fire() const = 0;
};

class LaserGun : public Weapon {
public:
    void fire() const override {
        std::cout << "⚡ ビビビッ！高速レーザー光線！" << std::endl;
    }
};

class PlasmaBomb : public Weapon {
public:
    void fire() const override {
        std::cout << "💥 ドゴォォン！広範囲プラズマ爆発！" << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Weapon>> inventory;
    inventory.push_back(std::make_unique<LaserGun>());
    inventory.push_back(std::make_unique<PlasmaBomb>());

    for (const auto& w : inventory) {
        w->fire();
    }
    return 0;
}
`,
  },
  {
    id: 'template-smart-ptr',
    name: 'スマートポインタとRAII (M1)',
    badge: 'M1',
    description: 'std::unique_ptr と std::shared_ptr による所有権モデルと自動寿命管理のサンプルです。',
    code: `#include <iostream>
#include <memory>

struct Resource {
    std::string tag;
    Resource(std::string t) : tag(std::move(t)) {
        std::cout << "[ALLOC] " << tag << " が確保されました\\n";
    }
    ~Resource() {
        std::cout << "[FREE] " << tag << " が安全に破棄されました（RAII）\\n";
    }
    void use() const {
        std::cout << "-> " << tag << " を使用中...\\n";
    }
};

int main() {
    std::cout << "--- スコープ開始 ---\\n";
    {
        auto uptr = std::make_unique<Resource>("独占リソースA");
        uptr->use();

        auto sptr1 = std::make_shared<Resource>("共有リソースB");
        {
            auto sptr2 = sptr1;
            std::cout << "共有リソースBの参照カウント: " << sptr1.use_count() << std::endl;
        }
        std::cout << "内側スコープ脱出後の参照カウント: " << sptr1.use_count() << std::endl;
    }
    std::cout << "--- スコープ終了 ---\\n";
    return 0;
}
`,
  },
  {
    id: 'template-crtp',
    name: 'CRTP 静的多態性 (L10)',
    badge: 'L10',
    description: '仮想関数テーブルのコストを完全ゼロにするコンパイル時ポリモーフィズムのサンプルです。',
    code: `#include <iostream>

template <typename Derived>
class BaseProcessor {
public:
    void process() {
        std::cout << "[Pre-process] メモリ事前準備\\n";
        static_cast<Derived*>(this)->executeImpl();
        std::cout << "[Post-process] キャッシュフラッシュ\\n";
    }
};

class FastEngine : public BaseProcessor<FastEngine> {
public:
    void executeImpl() {
        std::cout << "🚀 超高速インライン演算実行（vtableオーバーヘッド0B）\\n";
    }
};

int main() {
    FastEngine engine;
    engine.process();
    return 0;
}
`,
  },
  {
    id: 'template-memory-pool',
    name: '固定長メモリプール (L11)',
    badge: 'L11',
    description: '配列バッファとプレースメントnewによるヒープ断片化ゼロの高速アロケータです。',
    code: `#include <iostream>
#include <new>

struct Particle {
    float x, y, vx, vy;
    int life;
    Particle(float px, float py) : x(px), y(py), vx(1.0f), vy(0.5f), life(60) {
        std::cout << "パーティクル生成 (" << x << ", " << y << ")\\n";
    }
    ~Particle() {
        std::cout << "パーティクル消滅\\n";
    }
};

int main() {
    // 連続メモリプール（スタック事前確保）
    alignas(Particle) char pool[sizeof(Particle) * 3];

    // 1つ目のスロットに placement new で構築
    Particle* p1 = new (&pool[sizeof(Particle) * 0]) Particle(100.0f, 200.0f);

    // 明示的デストラクタ呼び出し
    p1->~Particle();

    return 0;
}
`,
  },
];
