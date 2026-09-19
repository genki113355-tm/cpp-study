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
  'chapter-1-spaghetti-to-oop': {
    id: 'challenge-l1',
    chapterSlug: 'chapter-1-spaghetti-to-oop',
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
  'chapter-2-classes-and-encapsulation': {
    id: 'challenge-l2',
    chapterSlug: 'chapter-2-classes-and-encapsulation',
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
  'chapter-3-dynamic-memory-and-vector': {
    id: 'challenge-l3',
    chapterSlug: 'chapter-3-dynamic-memory-and-vector',
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
  'chapter-l10-static-polymorphism-crtp': {
    id: 'challenge-l10',
    chapterSlug: 'chapter-l10-static-polymorphism-crtp',
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
  'chapter-l11-custom-allocator-memory-pool': {
    id: 'challenge-l11',
    chapterSlug: 'chapter-l11-custom-allocator-memory-pool',
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
};

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
