import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_5: Chapter = {
  id: 205,
  slug: 'reading-step-5',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R5',
  title: 'コード読解演習 Step 5【実戦解読】：巨大オープンソースリポジトリ実地読解（Box2D編）',
  subtitle: '数十万行の未知のコードベースを前にしても圧倒されない！トップダウン探索とコアデータ構造の抽出法',
  badge: '読解演習 Step 5',
  description: '「新機能のために世界水準の2D物理エンジン（Box2D）やグラフィックス基盤（SDL2）を解読・組み込みたいが、ファイルが何百個もあってどこから読めばいいか分からない」——業務で最も求められる【初見コードベースの高速マッピング技術】を伝授。エントリポイントの特定、抽象化レイヤーの剥ぎ取り、そして「中核データ構造（World/Body）」に狙いを定めて最短で攻略するプロの読解フローを体得します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-4',
  nextChapterSlug: 'reading-step-6',
  sections: [
    {
      id: 'step5-overview',
      title: '5.1 巨大リポジトリ攻略の3段階フレームワーク（森を見てから木を見よ）',
      leadText: '巨大なライブラリや社内フレームワークを渡された時、1ファイルずつ読むのは時間の無駄です。トップダウンの3段階で攻略します。',
      dialogueBefore: [
        {
          id: 'dlg-r5-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生！業務でオープンソースの物理エンジン Box2D を渡されたんですが、ファイルが200個以上あって、どこから読み始めればいいのか途方に暮れました……！'
        },
        {
          id: 'dlg-r5-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！未知の巨大城郭を攻略する時に、石垣の石を1個ずつ数えてはならぬ！プロのエンジニアは**【① samples / testbed から最小の動くコードを探す】→【② 公開ヘッダ include/ のAPIを眺めて神オブジェクトを特定する】→【③ ステップ更新ループ（Step()）のパイプラインを追う】**という黄金のトップダウン手順を踏むのじゃ！'
        }
      ],
      explanationText: `
### 巨大OSS・初見コードベース読解の「3段階トップダウン・スキャン法」

1. **第1段階：最小サンプル（Samples/Examples）からエントリポイントを逆引き**:
   - ドキュメントを読む前に \`samples/\` や \`examples/\` を探す。
   - 「たった30行で立方体が落下する最小コード」を見つけ、呼び出されているAPIの順序（初期化 → 登録 → 更新）を特定する。
2. **第2段階：公開ヘッダ（include/）から「中核データ構造」を特定**:
   - 内部実装（src/）には一切立ち入らず、外部向けヘッダだけを見る。
   - 大抵のエンジンには全体の親玉となる「World」や「Engine」クラスが存在する。
3. **第3段階：毎フレームの心臓部（Step() / Update()）のパイプライン解読**:
   - 「時間の経過（dt）」を受け取る中核関数の内部処理順序を箇条書きにする。
   - 例: 入力処理 → 外力適用 → 衝突判定 → 拘束解決 → 座標積分。
      `,
      takeaways: [
        {
          title: '内部実装（src/）から読んではいけない',
          description: '内部の細かい数学計算やメモリ最適化から読むと確実に迷子になります。まず「外部からどう使われているか（Usage）」を把握するのが鉄則です。'
        }
      ]
    },
    {
      id: 'step5-sample-code',
      title: '5.2 演習コード：Box2D風 2D物理シミュレーション・マイクロコア',
      leadText: '世界水準の物理エンジン Box2D のアーキテクチャ設計を凝縮した演習コードです。全体の構造を読み解いてください。',
      codeFiles: [
        {
          filename: 'MiniPhysicsEngine.h',
          language: 'cpp',
          description: 'Box2D のコア設計パターン（World, Body, Step, Factory）を凝縮した物理シミュレータ',
          isMain: true,
          code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>

// 2次元ベクトル
struct Vec2 {
    float x = 0.0f;
    float y = 0.0f;
    Vec2(float _x, float _y) : x(_x), y(_y) {}
    Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
    Vec2 operator*(float s) const { return {x * s, y * s}; }
};

// 剛体定義（生成用パラメータ）
struct BodyDef {
    Vec2 position{0.0f, 0.0f};
    Vec2 velocity{0.0f, 0.0f};
    float mass = 1.0f;
    bool isStatic = false; // 地形などの静的剛体か
};

// 剛体オブジェクト（Body）
class Body {
    friend class World; // World からのみ生成・管理される設計（ファクトリパターン）
private:
    Vec2 m_position;
    Vec2 m_velocity;
    float m_mass;
    float m_invMass; // 逆質量（計算高速化のため事前計算）
    bool m_isStatic;
    std::string m_userData; // ユーザーがゲーム側オブジェクトと紐付けるフック

    Body(const BodyDef& def)
        : m_position(def.position),
          m_velocity(def.velocity),
          m_mass(def.mass),
          m_invMass(def.isStatic || def.mass <= 0.0f ? 0.0f : 1.0f / def.mass),
          m_isStatic(def.isStatic) {}

public:
    void applyForce(const Vec2& force, float dt) {
        if (m_isStatic) return;
        m_velocity = m_velocity + (force * (m_invMass * dt));
    }

    const Vec2& getPosition() const { return m_position; }
    const Vec2& getVelocity() const { return m_velocity; }
    void setUserData(std::string tag) { m_userData = std::move(tag); }
    const std::string& getUserData() const { return m_userData; }
};

// 物理空間全体を統括する中核クラス（World）
class World {
private:
    Vec2 m_gravity;
    std::vector<std::unique_ptr<Body>> m_bodies;

public:
    explicit World(Vec2 gravity) : m_gravity(gravity) {}

    // 剛体の生成は必ず World を経由する（所有権の集中管理）
    Body* createBody(const BodyDef& def) {
        auto body = std::unique_ptr<Body>(new Body(def));
        Body* ptr = body.get();
        m_bodies.push_back(std::move(body));
        return ptr;
    }

    // 物理シミュレーションの1ステップ進行（心臓部）
    void step(float dt) {
        // 1. 重力と外力の適用（速度更新）
        for (auto& b : m_bodies) {
            if (!b->m_isStatic) {
                b->m_velocity = b->m_velocity + (m_gravity * dt);
            }
        }

        // 2. 座標の更新（オイラー積分）
        for (auto& b : m_bodies) {
            if (!b->m_isStatic) {
                b->m_position = b->m_position + (b->m_velocity * dt);
            }
        }
    }

    size_t getBodyCount() const { return m_bodies.size(); }
};`,
          highlightLines: [26, 49, 65, 73]
        }
      ],
      takeaways: [
        {
          title: 'なぜ new Body ではなく world->createBody なのか？',
          description: 'Box2Dのような高性能エンジンでは、内部のメモリプール（メモリアリーナ）から一括で高速アロケーションし、衝突判定やキャッシュの局所性を保つために、生成窓口を World に一本化する設計を採用しています。'
        }
      ]
    },
    {
      id: 'step5-architecture-mapping',
      title: '5.3 アーキテクチャの骨格抽出：データフローと依存グラフの可視化',
      leadText: 'コードから抽出した「所有権構造」「シミュレーションパイプライン」の鑑識結果です。',
      processSteps: [
        {
          stepNumber: 1,
          title: '所有権モデル：World が全 Body を完全所有する',
          description: 'ゲーム開発者が生の new / delete を呼ぶことは禁止されており、すべてのライフサイクルは World が一元管理します。これにより、未解放リークやダングリングポインタをエンジン内部で防ぎます。',
          impact: 'ゲームプログラマは生成と破棄のメモリ管理に悩む必要がなくなる'
        },
        {
          stepNumber: 2,
          title: '事前計算イディオム：逆質量（invMass = 1.0f / mass）',
          description: 'CPUにおいて割り算（div）は掛け算（mul）の10〜20倍重い処理です。毎フレーム `F / m` を計算する代わりに、生成時に `1.0f / m` を事前計算して掛け算 `F * invMass` に変換しています。静的剛体（質量無限大）は `invMass = 0.0f` とすることで、ゼロ除算なしに外力を無効化します。',
          impact: '何万回ものシミュレーションループを爆速化するプロの低レイヤ技法'
        },
        {
          stepNumber: 3,
          title: 'ユーザーデータ（userData）による双方向フック',
          description: '物理エンジンはゲームのキャラクタークラス（PlayerやEnemy）を知りません。`setUserData()` を介してゲーム側オブジェクトのアドレスや識別子を保持させることで、疎結合を維持したまま衝突イベント時にゲームロジックへコールバック可能にします。',
          impact: 'エンジンとゲーム本体の完全な関心事分離（SoC）'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r5-1',
      question: '巨大なオープンソースライブラリを解読する際、最初に確認すべき「最も効率的な場所」はどこでしょう？',
      options: [
        'src/ ディレクトリの中にある最も行数の多い .cpp ファイル',
        'samples/ や examples/ にある「最小の動くサンプルコード」',
        'CMakeLists.txt やビルドスクリプトの全行',
        'ヘッダファイルに含まれる数学アルゴリズムの導出式'
      ],
      correctIndex: 1,
      explanation: '正解です！最小サンプルコードを見ることで、「初期化→オブジェクト生成→毎フレーム更新」というライブラリの意図されたAPI呼び出し手順が一瞬で把握できます。'
    },
    {
      id: 'q-r5-2',
      question: 'MiniPhysicsEngine（およびBox2D）において、Body のコンストラクタが private であり、`world->createBody(def)` を使って生成させる設計理由は何でしょう？',
      options: [
        'C++の文法上の制約で、クラス外でコンストラクタを呼べないから',
        'World が全剛体のメモリ所有権を一括管理し、メモリプールによる高速化や衝突ペア登録を一元的に行うため（ファクトリパターン）',
        'メモリ使用量を半分にするため',
        'マルチスレッドを禁止するため'
      ],
      correctIndex: 1,
      explanation: '正解です！物理エンジンが空間内の全剛体をリストやアロケータで確実に追跡・管理できるようにするため、ファクトリメソッド経由でのみ生成を許可する堅牢なカプセル化設計です。'
    },
    {
      id: 'q-r5-3',
      question: '物理エンジン内部で、質量 mass ではなく「逆質量 invMass（1.0f / mass）」を保持して計算する最大のメリットは何でしょう？',
      options: [
        'CPUにおいて重い割り算命令を避け、高速な掛け算命令で加速度（F * invMass）を算出でき、静的剛体（固定地形）を invMass = 0.0f でゼロ除算なく扱えるから',
        '変数のメモリサイズが小さくなるから',
        '負の質量を表現できるようになるから',
        '浮動小数点数の丸め誤差が完全にゼロになるから'
      ],
      correctIndex: 0,
      explanation: '正解です！除算は乗算に比べてCPUクロックを多く消費します。さらに質量無限大（動かない地面）を `invMass = 0.0f` と定義することで、特別な if 分岐なしに `velocity += force * 0.0f` で静止状態を維持できます。'
    },
    {
      id: 'q-r5-4',
      question: '物理エンジンの剛体に `void*` や `std::string` の `m_userData` が用意されているアーキテクチャ上の目的は何でしょう？',
      options: [
        '物理エンジンのコードを難解にしてリバースエンジニアリングを防ぐため',
        '物理エンジン側がゲーム側の Player や Enemy などの具象クラスに依存することなく、ゲーム側オブジェクトと紐付ける疎結合フックを提供するため',
        '剛体のテクスチャ画像を物理エンジン内で描画するため',
        'セーブデータを暗号化するため'
      ],
      correctIndex: 1,
      explanation: '正解です！物理エンジンはゲーム固有のロジックに依存すべきではありません。userData フックを持たせることで、依存性を逆転させずに衝突相手がどのゲームキャラかを判定できます。'
    }
  ]
};
