import { Chapter } from '../../types/curriculum';

export const chapterL10: Chapter = {
  id: 14,
  slug: 'chapter-10-static-polymorphism-crtp',
  courseTrack: 'classic',
  courseChapterCode: 'C10',
  title: 'レガシー第10章：静的ポリモーフィズム入門（CRTPとクラシックTemplate）',
  subtitle: '仮想関数テーブル（vtable）のオーバーヘッドをゼロにする！コンパイル時ポリモーフィズムと奇妙に再帰したテンプレートパターン',
  badge: 'レガシーC++ L10：CRTP・静的ポリモーフィズム',
  gameVersion: 'v2_classes',
  description: 'オブジェクト指向の代名詞である仮想関数（virtual）による動的ポリモーフィズムは、柔軟で美しい設計を可能にしますが、極限のパフォーマンスが求められるゲーム開発では「隠れたコスト」が存在します。毎フレーム何万回も呼ばれる弾幕やパーティクルにおいて、vtable（仮想関数テーブル）を辿るポインタ間接参照と、コンパイラが関数をインライン展開できないことによる関数呼び出しオーバーヘッドは無視できない負荷となります。本章では、C++98時代からゲームプログラマが愛用してきた伝説の技法【CRTP（Curiously Recurring Template Pattern：奇妙に再帰したテンプレートパターン）】を徹底解剖。仮想関数のオーバーヘッドを1サイクル・1バイトすら残さずコンパイル時に消滅させ、超高速な静的ポリモーフィズムを実現するアーキテクチャを習得します。',
  sections: [
    {
      id: 'sec-l10-virtual-overhead',
      title: 'L10.1 仮想関数（virtual）の隠れた代償：弾幕1万発の限界',
      leadText: 'なぜ弾幕やパーティクルで virtual を使うとゲームがカクつくのか？インライン展開の阻害、キャッシュミス、そしてオブジェクトごとの vptr メモリ消費の真実を学びます。',
      dialogueBefore: [
        {
          id: 'dl10-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生、助けてください……！ボスが画面いっぱいに1万発の弾幕（通常弾・誘導弾・レーザー）を放つ演出を作ったんです。弾の基底クラス `virtual void update() = 0;` を作って綺麗なオブジェクト指向で書いたんですが、弾幕が出た瞬間にフレームレートが60FPSから15FPSまで大暴落しました……！'
        },
        {
          id: 'dl10-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！1万個のオブジェクトに対して毎フレーム virtual 関数を呼び出しておるのか！CPUが悲鳴を上げて白目を剥くのも無理はないわい！'
        },
        {
          id: 'dl10-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'えっ！？でも、弾の座標に速度を足しているだけの超単純な処理ですよ？なぜ仮想関数にしただけでそんなに重くなるんですか？'
        },
        {
          id: 'dl10-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '仮想関数には【3大パフォーマンスキラー】が潜んでおるからじゃ！1つ目は「vptr ➔ vtable ➔ 関数アドレス」と2回もメモリを辿る間接呼び出しコスト。2つ目は関数の実体が実行時まで不明なため【コンパイラが関数をインライン展開（Inlining）できない】こと。そして3つ目は、各弾オブジェクトに vptr（8バイト）が強制付加されてキャッシュ効率が崩壊することじゃ！'
        }
      ],
      paradigmComparison: {
        title: '動的ポリモーフィズム（virtual） vs 静的ポリモーフィズム（CRTP）',
        cApproach: {
          title: '動的ポリモーフィズム（virtual 関数呼び出し）',
          code: `class BulletBase {
public:
    virtual ~BulletBase() = default;
    virtual void update() = 0; // 実行時解決
};

class NormalBullet : public BulletBase {
public:
    void update() override { x += vx; y += vy; }
};

// ❌ 1万個の弾を更新する時…
for (auto* b : bullets) {
    b->update(); // 1. vptr から vtable を検索 (間接ジャンプ)
                 // 2. インライン展開不可！関数プロローグ/エピローグの負荷
                 // 3. キャッシュミス多発でCPUパイプラインが停止
}`,
          drawbacks: [
            '各インスタンスに隠しポインタ vptr（64bit環境で8バイト）が付加され、メモリを圧迫する',
            '関数呼び出しが間接ジャンプ命令（call [rax + offset]）となり、CPUの分岐予測が外れやすい',
            '中身が1行の単純なコードでもインライン展開できず、関数呼び出しオーバーヘッドが支配的になる'
          ]
        },
        cppApproach: {
          title: '静的ポリモーフィズム（CRTP テンプレート呼び出し）',
          code: `template <typename Derived>
class BulletCRTP {
public:
    void update() {
        // コンパイル時に型が確定！静的ディスパッチ
        static_cast<Derived*>(this)->updateImpl();
    }
};

class NormalBullet : public BulletCRTP<NormalBullet> {
public:
    void updateImpl() { x += vx; y += vy; } // 100%インライン展開！
};

// ✅ コンパイル時にインライン展開された結果…
for (auto& b : bullets) {
    b.x += b.vx; b.y += b.vy; // 関数呼び出しコスト完全ゼロ！生ループと同等の最高速！
}`,
          benefits: [
            'vptr が一切存在しないため、オブジェクトサイズが純粋なメンバ変数分のみ（メモリ浪費ゼロ）',
            'コンパイル時に呼び出し先関数が確定するため、100%インライン展開され関数呼び出しコストが消滅',
            'メモリが連続して配置され、CPUキャッシュ（L1/L2）のヒット率が極限まで高まる'
          ]
        },
        paradigmShiftNotes: '実行時に敵や武器の種類が動的に入れ替わる必要がない大量データ（弾幕・パーティクル・物理剛体）は、仮想関数による動的解決を捨てて、コンパイル時に多態性を解決する静的ポリモーフィズムへと設計を切り替えます。'
      },
      processSteps: [
        {
          stepNumber: 1,
          title: 'インライン展開（Inlining）がゲームループの命である理由',
          codeSnippet: `// インライン展開なし（関数呼び出し）
push rbp; mov rbp, rsp; mov [rbp+x], ...; pop rbp; ret; // 毎回スタック操作！

// インライン展開あり（直接埋め込み）
add [bullet_x], eax; // わずか1命令で完了！`,
          description: '弾の移動のような数命令で終わる処理では、処理そのものの時間よりも「関数を呼ぶためのレジスタ退避・スタック操作・ジャンプ」のオーバーヘッドの方が何倍も大きくなります。',
          impact: '仮想関数はこのインライン展開を完全に阻害します。',
          designIntent: '現代のCPUアーキテクチャでは、関数呼び出しを消去するインライン展開が最大の最適化です。'
        },
        {
          stepNumber: 2,
          title: 'vptr によるメモリ浪費の物理的計算',
          codeSnippet: `struct BulletData { float x, y, vx, vy; }; // 16バイト
// virtual を1つ足すと…
struct VirtualBullet { void* vptr; float x, y, vx, vy; }; // 24〜32バイト (1.5倍〜2倍！)`,
          description: '弾が1万発ある場合、vptr だけで 80KB、10万発なら 800KB のキャッシュメモリを「ただのテーブルへのポインタ」で浪費します。',
          impact: 'CPUのL1キャッシュ（通常32KB〜64KB）から弾データが溢れ出し、メインメモリへのアクセス待ち（メモリスピル）が発生します。',
          designIntent: 'データ指向設計（DOD）におけるメモリ密度の重要性です。'
        },
        {
          stepNumber: 3,
          title: 'コンパイル時解決へのパラダイムシフト',
          codeSnippet: `// 実行時に型を調べるのではなく…
// コンパイラがビルド時に専用の最適化ループを生成する！`,
          description: '「型ごとに配列を分け、型ごとにコンパイル時最適化されたコードを実行する」という静的ディスパッチの思想にシフトします。',
          impact: 'オブジェクト指向の再利用性を維持したまま、C言語のベタ書き以上の速度を叩き出します。',
          designIntent: 'ゼロオーバーヘッド原則（使わないものにコストは払わない）の具現化です。'
        }
      ],
      codeFiles: [
        {
          filename: 'VirtualOverheadBenchmark.cpp',
          language: 'cpp',
          description: '仮想関数の間接呼び出しによるオーバーヘッドを測定する対比コード',
          code: `#include <iostream>
#include <vector>
#include <chrono>

// 1. 動的ポリモーフィズム (仮想関数)
class IVirtualParticle {
public:
    virtual ~IVirtualParticle() = default;
    virtual void update() = 0;
};

class VirtualSpark : public IVirtualParticle {
public:
    float x = 0, y = 0, vx = 1.5f, vy = 2.0f;
    void update() override {
        x += vx;
        y += vy;
    }
};

int main() {
    const int COUNT = 100000;
    std::vector<IVirtualParticle*> particles;
    for (int i = 0; i < COUNT; ++i) {
        particles.push_back(new VirtualSpark());
    }

    auto start = std::chrono::high_resolution_clock::now();

    // 10万個の仮想関数呼び出しループ
    for (int frame = 0; frame < 100; ++frame) {
        for (int i = 0; i < COUNT; ++i) {
            particles[i]->update(); // vptr 間接呼び出し（インライン展開不可）
        }
    }

    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> elapsed = end - start;

    std::cout << "仮想関数 10万個 x 100フレーム 更新時間: " 
              << elapsed.count() << " ms\\n";
    std::cout << "1個あたりのサイズ: " << sizeof(VirtualSpark) << " バイト (vptr含む)\\n";

    // メモリ解放
    for (auto* p : particles) delete p;

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l10-crtp-mechanism',
      title: 'L10.2 CRTP（奇妙に再帰したテンプレートパターン）の全貌',
      leadText: '派生クラスが自分自身を基底クラスのテンプレート引数に渡す？！CRTPの構文、コンパイル時ダウンキャストの安全性、そしてインライン化の仕組みを解剖します。',
      dialogueBefore: [
        {
          id: 'dl10-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ベン先生！このコード、構文エラーじゃないんですか！？\n`class Bullet : public BulletBase<Bullet>`\n自分がまだ定義し終わっていないのに、自分の名前 `Bullet` を親クラスのテンプレート引数に渡すなんて、タイムパラドックスみたいなこと許されるんですか！？'
        },
        {
          id: 'dl10-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！それこそが世界中のC++プログラマを驚嘆させた【奇妙に再帰したテンプレートパターン（CRTP）】の美しいトリックなんじゃよ！'
        },
        {
          id: 'dl10-7',
          speaker: 'penguin',
          emotion: 'question',
          text: 'なぜこれでコンパイルが通るんですか……？'
        },
        {
          id: 'dl10-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'クラスの継承節（: public ...）を評価する時点で、コンパイラは既に `class Bullet` という型の名前が存在することを知っておる（不完全型）。そして基底クラスのメンバ関数が実際にコンパイル（実体化）されるのは、プログラム中で呼び出された瞬間じゃ！その時には Bullet の完全な定義が終わっておるから、安全に `static_cast<Bullet*>(this)` が成立するんじゃよ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'CRTP基底クラスの宣言と static_cast',
          codeSnippet: `template <typename Derived>
class EntityCRTP {
public:
    void update() {
        // 自分自身（this）を派生クラス型へキャスト！
        static_cast<Derived*>(this)->updateImpl();
    }
};`,
          description: '基底クラスは型パラメータ `Derived` を通じて、未来の派生クラスの存在を知っています。仮想関数を使わずに、直接派生クラスの `updateImpl()` を静的ディスパッチします。',
          impact: '仮想関数テーブル（vtable）が一切生成されません。',
          designIntent: 'コンパイル時ポリモーフィズムの心臓部です。'
        },
        {
          stepNumber: 2,
          title: '派生クラスによる自分自身の注入',
          codeSnippet: `class FastBullet : public EntityCRTP<FastBullet> {
public:
    void updateImpl() {
        x += vx;
        y += vy;
    }
};`,
          description: '派生クラスは、基底クラスのテンプレート引数に「自分自身の型名」を渡して継承します。これにより基底クラスと派生クラスの型が1対1で強固に結合されます。',
          impact: '基底クラスの `update()` を呼ぶと、即座に `FastBullet::updateImpl()` にインライン展開されます。',
          designIntent: 'コードの再利用と静的型解決の両立。'
        },
        {
          stepNumber: 3,
          title: 'コンパイラによる完全なインライン展開',
          codeSnippet: `FastBullet bullet;
bullet.update();
// ➔ コンパイラ最適化後:
// bullet.x += bullet.vx; bullet.y += bullet.vy;
// 関数呼び出しすら跡形もなく消滅！`,
          description: 'オプティマイザは `update()` から `updateImpl()` への呼び出しパスを完全に把握できるため、関数呼び出しの境界を消し去り、直接数式をその場に展開します。',
          impact: 'C言語で手書きした最速の生ループと寸分違わぬ機械語が出力されます。',
          designIntent: 'ゼロコスト抽象化（Zero-overhead abstraction）の極致です。'
        }
      ],
      codeFiles: [
        {
          filename: 'CRTPMechanismDemo.cpp',
          language: 'cpp',
          description: 'CRTPによる静的ディスパッチとインライン展開の検証コード',
          code: `#include <iostream>

// CRTP基底クラス
template <typename Derived>
class SpaceObject {
public:
    // 共通インターフェース
    void render() {
        // 派生クラスの具象実装をコンパイル時ディスパッチ
        static_cast<Derived*>(this)->renderImpl();
    }

    void move() {
        static_cast<Derived*>(this)->moveImpl();
    }
};

// 派生クラス1: 通常弾
class LaserBeam : public SpaceObject<LaserBeam> {
public:
    void renderImpl() {
        std::cout << "━ レーザー描画 (シアン色)\\n";
    }
    void moveImpl() {
        std::cout << "レーザー光速直進\\n";
    }
};

// 派生クラス2: 誘導ミサイル
class HomingMissile : public SpaceObject<HomingMissile> {
public:
    void renderImpl() {
        std::cout << "▲ ミサイル描画 (オレンジ色)\\n";
    }
    void moveImpl() {
        std::cout << "ミサイル追尾旋回\\n";
    }
};

// テンプレート関数による統一呼び出し
template <typename T>
void processObject(SpaceObject<T>& obj) {
    obj.move();
    obj.render();
}

int main() {
    LaserBeam laser;
    HomingMissile missile;

    std::cout << "=== CRTP 静的ポリモーフィズム実行 ===\\n";
    processObject(laser);
    processObject(missile);

    std::cout << "\\n=== オブジェクトサイズの比較 ===\\n";
    std::cout << "LaserBeam のサイズ: " << sizeof(laser) << " バイト\\n";
    std::cout << "HomingMissile のサイズ: " << sizeof(missile) << " バイト\\n";
    // 仮想関数が一切ないため、vptr の 8バイトが存在しない！

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l10-crtp-in-game-dev',
      title: 'L10.3 ゲーム開発におけるCRTPの実践：静的Mix-inと超高速弾幕エンジン',
      leadText: '共通機能（カウント、クローン、当たり判定）を静的に注入する Mix-in 設計と、動的ポリモーフィズムとの適切な使い分け基準をマスターします。',
      dialogueBefore: [
        {
          id: 'dl10-9',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'ベン先生、CRTPが超高速なのは分かりましたが、`std::vector<SpaceObject*>` みたいに異なる弾を1つの配列にまとめてループで回すことはできないんですか？'
        },
        {
          id: 'dl10-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '良い着眼点じゃ！結論から言うと【そのままでは異種コンテナにまとめられない】！`SpaceObject<LaserBeam>` と `SpaceObject<HomingMissile>` はコンパイラから見れば全くの別型じゃからな！'
        },
        {
          id: 'dl10-11',
          speaker: 'penguin',
          emotion: 'question',
          text: 'じゃあ現場のゲーム開発では、CRTPはどうやって使われているんですか？'
        },
        {
          id: 'dl10-12',
          speaker: 'shirokuma',
          emotion: 'happy',
          text: '弾の種類ごとに `std::vector<LaserBeam>`、`std::vector<HomingMissile>` と別々の連続メモリ（データ指向配列）で管理してCRTPで爆速一括処理するんじゃ！さらに「生存インスタンス数の自動計測」や「型安全な複製（Cloneable）」といった機能を部品として注入する【静的Mix-in】としても大活躍するぞ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '静的Mix-in（機能注入）パターン',
          codeSnippet: `template <typename T>
class InstanceCounter {
private:
    static inline int count_ = 0;
public:
    InstanceCounter() { ++count_; }
    ~InstanceCounter() { --count_; }
    static int aliveCount() { return count_; }
};

// クラスに「生存数カウント機能」を多重継承で静的に注入！
class Bullet : public InstanceCounter<Bullet> { ... };`,
          description: 'CRTPを用いると、型ごとに完全に独立した static 変数を持つ機能を部品（Mix-in）として簡単に合体させることができます。',
          impact: '実行時オーバーヘッドなしで、画面内の弾の数をリアルタイム監視できます。',
          designIntent: 'コードの重複を撲滅するメタプログラミング手法です。'
        },
        {
          stepNumber: 2,
          title: 'データ指向設計（DOD）との完璧な親和性',
          codeSnippet: `// 異種混合ポインタ配列（キャッシュミス多発）ではなく
// 型ごとの連続メモリ配列（最高速）で回す！
std::vector<LaserBeam> lasers;
std::vector<HomingMissile> missiles;`,
          description: '現代の商用ゲームエンジンやECS（Entity-Component-System）では、オブジェクトをポインタの配列で持つのではなく、同じ型の連続配列で持つことが推奨されます。',
          impact: 'CRTPはこの連続配列走査と完璧にフィットし、CPUのSIMD（ベクトル化）最適化すら誘発します。',
          designIntent: 'ハードウェアの特性に合わせたキャッシュフレンドリー設計。'
        },
        {
          stepNumber: 3,
          title: '動的（virtual）と静的（CRTP）の使い分け絶対基準',
          codeSnippet: `// 【virtual を使うべき場所】
// 画面全体のシーン遷移（Title ➔ Play ➔ GameOver）など、
// オブジェクト数が少なく、実行時に動的に入れ替わる高位アーキテクチャ。

// 【CRTP を使うべき場所】
// 弾幕、パーティクル、物理演算の剛体、数値ベクトル計算など、
// 数千〜数万個存在し、1サイクルの遅延が命取りになるコアエンジン層。`,
          description: 'どちらか一方だけを使うのではなく、システムの階層（抽象レイヤー vs 高速実行レイヤー）に応じて両者を使い分けるのがシニアアーキテクトの腕の見せ所です。',
          impact: '柔軟性とパフォーマンスの究極の共存を実現します。',
          designIntent: 'アーキテクチャの適材適所の原則。'
        }
      ],
      codeFiles: [
        {
          filename: 'BulletStormEngine.cpp',
          language: 'cpp',
          description: 'CRTPと静的Mix-inを駆使した超高速弾幕エンジンの実装',
          code: `#include <iostream>
#include <vector>

// 1. 生存数カウンタ Mix-in (CRTP)
template <typename T>
class ObjectCounter {
private:
    static inline int activeCount_ = 0;
public:
    ObjectCounter() { ++activeCount_; }
    ObjectCounter(const ObjectCounter&) { ++activeCount_; }
    virtual ~ObjectCounter() = default; // 安全のための仮想デストラクタ
    // 注: Mix-in単体としてデストラクタが必要な場合のみ
    static int getActiveCount() { return activeCount_; }
protected:
    void decrement() { --activeCount_; }
};

// 2. 弾幕CRTP基底クラス
template <typename Derived>
class BulletSystem {
public:
    void updatePhysics(float dt) {
        static_cast<Derived*>(this)->onUpdate(dt);
    }
};

// 3. 具体的な弾1: 直進レーザー
class Laser : public BulletSystem<Laser>, public ObjectCounter<Laser> {
public:
    float x = 0, y = 0, speed = 800.0f;

    void onUpdate(float dt) {
        y += speed * dt; // インライン展開される超高速移動
    }
};

// 4. 具体的な弾2: 拡散弾
class SpreadPellet : public BulletSystem<SpreadPellet>, public ObjectCounter<SpreadPellet> {
public:
    float x = 0, y = 0, vx = 200.0f, vy = 300.0f;

    void onUpdate(float dt) {
        x += vx * dt;
        y += vy * dt;
    }
};

// 5. 弾幕マネージャー (型ごとの高密度連続配列)
class BulletManager {
private:
    std::vector<Laser> lasers_;
    std::vector<SpreadPellet> pellets_;

public:
    void spawnLaser(float startX, float startY) {
        Laser l; l.x = startX; l.y = startY;
        lasers_.push_back(l);
    }

    void spawnPellet(float startX, float startY, float vx, float vy) {
        SpreadPellet p; p.x = startX; p.y = startY; p.vx = vx; p.vy = vy;
        pellets_.push_back(p);
    }

    void updateAll(float dt) {
        // レーザーの超高速一括更新 (CRTPにより完全インライン化)
        for (auto& laser : lasers_) {
            laser.updatePhysics(dt);
        }

        // 拡散弾の超高速一括更新 (CRTPにより完全インライン化)
        for (auto& pellet : pellets_) {
            pellet.updatePhysics(dt);
        }
    }

    void printStats() const {
        std::cout << "アクティブなレーザー数: " << Laser::getActiveCount() << "\\n";
        std::cout << "アクティブな拡散弾数:   " << SpreadPellet::getActiveCount() << "\\n";
    }
};

int main() {
    BulletManager manager;

    // 弾を生成
    for (int i = 0; i < 5; ++i) manager.spawnLaser(i * 50.0f, 100.0f);
    for (int i = 0; i < 8; ++i) manager.spawnPellet(200.0f, 200.0f, (i - 4) * 30.0f, 150.0f);

    std::cout << "=== 弾幕エンジンのシミュレーション ===\\n";
    manager.printStats();

    // 1フレーム更新 (60FPS相当: dt = 0.016s)
    manager.updateAll(0.016f);
    std::cout << "1フレーム更新完了（関数呼び出しコストゼロ・完全インライン実行）\\n";

    return 0;
}`
        }
      ],
      umlDiagram: {
        diagramType: 'class',
        title: 'CRTPによる静的ポリモーフィズムとMix-inアーキテクチャ',
        description: '派生クラス（Laser, SpreadPellet）が基底クラステンプレートに自身の型を渡して継承します。仮想関数テーブルを一切持たず、コンパイル時に全てのメソッド呼び出しがインライン展開されます。',
        classes: [
          {
            name: 'BulletSystem<Derived>',
            stereotype: 'CRTP Interface',
            attributes: [],
            operations: [
              {
                name: 'updatePhysics(dt: float)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BulletStormEngine.cpp', line: 23, keyword: 'updatePhysics' }
              }
            ]
          },
          {
            name: 'ObjectCounter<T>',
            stereotype: 'Static Mix-in',
            attributes: [
              {
                name: 'activeCount_',
                type: 'int (static)',
                visibility: '-',
                isStatic: true,
                codeLineRef: { filename: 'BulletStormEngine.cpp', line: 8, keyword: 'activeCount_' }
              }
            ],
            operations: [
              {
                name: 'getActiveCount()',
                type: 'int',
                visibility: '+',
                isStatic: true,
                codeLineRef: { filename: 'BulletStormEngine.cpp', line: 14, keyword: 'getActiveCount' }
              }
            ]
          },
          {
            name: 'Laser',
            stereotype: 'Concrete Bullet',
            attributes: [
              { name: 'x', type: 'float', visibility: '+', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 32, keyword: 'x' } },
              { name: 'y', type: 'float', visibility: '+', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 32, keyword: 'y' } },
              { name: 'speed', type: 'float', visibility: '+', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 32, keyword: 'speed' } }
            ],
            operations: [
              {
                name: 'onUpdate(dt: float)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BulletStormEngine.cpp', line: 34, keyword: 'onUpdate' }
              }
            ]
          },
          {
            name: 'SpreadPellet',
            stereotype: 'Concrete Bullet',
            attributes: [
              { name: 'x', type: 'float', visibility: '+', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 42, keyword: 'x' } },
              { name: 'vx', type: 'float', visibility: '+', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 42, keyword: 'vx' } }
            ],
            operations: [
              {
                name: 'onUpdate(dt: float)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BulletStormEngine.cpp', line: 44, keyword: 'onUpdate' }
              }
            ]
          },
          {
            name: 'BulletManager',
            stereotype: 'Manager',
            attributes: [
              { name: 'lasers_', type: 'vector<Laser>', visibility: '-', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 52, keyword: 'lasers_' } },
              { name: 'pellets_', type: 'vector<SpreadPellet>', visibility: '-', codeLineRef: { filename: 'BulletStormEngine.cpp', line: 53, keyword: 'pellets_' } }
            ],
            operations: [
              {
                name: 'updateAll(dt: float)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BulletStormEngine.cpp', line: 66, keyword: 'updateAll' }
              }
            ]
          }
        ],
        relations: [
          {
            from: 'Laser',
            to: 'BulletSystem<Derived>',
            type: 'generalization',
            label: 'CRTP継承 (Derived=Laser)'
          },
          {
            from: 'Laser',
            to: 'ObjectCounter<T>',
            type: 'generalization',
            label: 'Mix-in継承 (T=Laser)'
          },
          {
            from: 'SpreadPellet',
            to: 'BulletSystem<Derived>',
            type: 'generalization',
            label: 'CRTP継承 (Derived=SpreadPellet)'
          },
          {
            from: 'BulletManager',
            to: 'Laser',
            type: 'composition',
            label: '連続メモリ所有'
          },
          {
            from: 'BulletManager',
            to: 'SpreadPellet',
            type: 'composition',
            label: '連続メモリ所有'
          }
        ],
        codeMappingNotes: [
          'Laser と SpreadPellet は仮想関数テーブルを持たないため、インスタンスサイズに vptr (8B) の無駄が一切ありません。',
          'BulletManager::updateAll は型ごとの連続配列を走査し、コンパイラによって完全にインライン展開された最高速コードを実行します。',
          'ObjectCounter は CRTP により各弾の型ごとに独立した静的カウンタを自動生成し、生存数をゼロコストで追跡します。'
        ]
      }
    }
  ],
  quiz: [
    {
      id: 'q-l10-1',
      question: '大量のオブジェクト（弾幕やパーティクル）を毎フレーム更新する際、仮想関数（動的ポリモーフィズム）が深刻なボトルネックを引き起こす最大の要因は何でしょうか？',
      options: [
        '仮想関数を宣言するとコンパイラが自動的に sleep(1) を挿入する仕様だから',
        'vtable を介したポインタ間接参照が発生し、呼び出し先が実行時まで確定しないためコンパイラが「インライン展開（Inlining）」を行えず関数呼び出しオーバーヘッドが毎回発生するから',
        'C++の仮想関数は1つのクラスで最大10回しか呼び出せない制限があるから',
        '仮想関数を使うとCPUの冷却ファンが停止してしまうから'
      ],
      correctIndex: 1,
      explanation: '正解は「vtable を介したポインタ間接参照が発生し、呼び出し先が実行時まで確定しないためコンパイラが「インライン展開（Inlining）」を行えず関数呼び出しオーバーヘッドが毎回発生するから」です。弾の移動のような数行の処理では、処理時間よりも関数呼び出し（スタック操作やレジスタ退避）のコストの方が圧倒的に大きくなります。仮想関数は実行時ディスパッチであるためコンパイラがインライン展開できず、性能が激減します。'
    },
    {
      id: 'q-l10-2',
      question: 'CRTP構文 `class Bullet : public BulletBase<Bullet>` において、基底クラス内で `static_cast<Derived*>(this)` によるダウンキャストが安全に成立する理由はどれでしょうか？',
      options: [
        'C++ではすべてのポインタキャストが無条件で安全に実行されるから',
        '基底クラスのメンバ関数が実際にインスタンス化（コンパイル）される時点では、派生クラス Bullet の完全な定義が完了しており、Bullet が BulletBase<Bullet> の派生クラスであることが保証されているから',
        'コンパイラが裏で dynamic_cast を実行して安全性を検証しているから',
        '派生クラスが仮想関数テーブルを自動生成するから'
      ],
      correctIndex: 1,
      explanation: '正解は「基底クラスのメンバ関数が実際にインスタンス化（コンパイル）される時点では、派生クラス Bullet の完全な定義が完了しており、Bullet が BulletBase<Bullet> の派生クラスであることが保証されているから」です。クラスの継承節の時点では Bullet は不完全型ですが、基底クラスのメソッドが呼び出されて実体化されるタイミングでは完全型となっているため、安全な静的キャストが成立します。'
    },
    {
      id: 'q-l10-3',
      question: '仮想関数による動的ポリモーフィズムと比較した際、CRTP（静的ポリモーフィズム）が抱える設計上の最大の制約は何でしょうか？',
      options: [
        'CRTPを使うとコードの実行速度が100倍遅くなる',
        '異なる派生クラス（例: Bullet と Laser）は基底テンプレートの型（Base<Bullet> と Base<Laser>）が異なるため、std::vector<Base*> のような単一の異種混合コンテナにまとめて保持することができない点',
        'CRTPを使ったクラスにはメンバ変数を定義できない',
        '64bit OSではCRTPがコンパイルエラーになる'
      ],
      correctIndex: 1,
      explanation: '正解は「異なる派生クラス（例: Bullet と Laser）は基底テンプレートの型（Base<Bullet> と Base<Laser>）が異なるため、std::vector<Base*> のような単一の異種混合コンテナにまとめて保持することができない点」です。CRTPはコンパイル時に型が分かれるため、1つの配列に異なる型を混在させることはできません。そのためゲーム現場では、型ごとの連続配列（std::vector<Bullet> と std::vector<Laser>）で管理するデータ指向設計と組み合わせて使用されます。'
    },
    {
      id: 'q-l10-4',
      question: '大規模な商用ゲームアーキテクチャにおいて、「仮想関数（動的）」と「CRTP（静的）」を使い分ける指針として、最も適切なものはどれでしょうか？',
      options: [
        'すべてのコードをCRTPだけで書き、仮想関数は一切使わないようにする',
        '画面遷移（Title/Play/GameOver）など疎結合性と動的な差し替えが重要な高位レイヤーには仮想関数を使い、弾幕・パーティクル・物理剛体など毎フレーム大量に処理されるコア層にはCRTPやデータ指向配列を使う',
        'すべてのコードを仮想関数だけで書き、テンプレートは一切使わないようにする',
        '偶数日には仮想関数を使い、奇数日にはCRTPを使う'
      ],
      correctIndex: 1,
      explanation: '正解は「画面遷移（Title/Play/GameOver）など疎結合性と動的な差し替えが重要な高位レイヤーには仮想関数を使い、弾幕・パーティクル・物理剛体など毎フレーム大量に処理されるコア層にはCRTPやデータ指向配列を使う」です。アーキテクチャの柔軟性が求められる高位モジュールには仮想関数（ObserverやStateパターン）が最適であり、極限のパフォーマンスが求められる大量オブジェクトの更新にはCRTPやデータ指向設計が威力を発揮します。'
    }
  ],
  prevChapterSlug: 'chapter-9-multiple-inheritance-diamond',
  nextChapterSlug: 'chapter-11-memory-pool-allocator'
};
