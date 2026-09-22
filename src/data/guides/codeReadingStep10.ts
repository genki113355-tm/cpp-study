import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_10: Chapter = {
  id: 210,
  slug: 'reading-step-10',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R10',
  title: 'コード読解演習 Step 10【構造鑑識】：アーキテクチャレビューと密結合コードの依存構造分析',
  subtitle: '循環参照と神クラス（God Class）を解体するための依存性グラフ抽出とDIP原則の外科手術',
  badge: '読解演習 Step 10',
  description: '「A.h が B.h をインクルードし、B.h が A.h をインクルードしてビルドが通らない」「1つの巨大な神クラス GameManager を修正すると、無関係な200ファイルが全再コンパイルになり30分待たされる」――ソフトウェアが大規模化・長期化した際、最大の敵となるのが【循環依存】と【密結合】です。本章では、巨大コードベースの依存関係を有向非巡回グラフ（DAG）として可視化し、前方宣言による物理依存の切断、そして依存性逆転の原則（DIP）によるインターフェース分離手術を敢行する、最高峰のアーキテクチャレビュー技術を習得します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-9',
  sections: [
    {
      id: 'step10-spaghetti-dependency',
      title: '10.1 「ヘッダ1行直して30分ビルド」循環依存の蟻地獄',
      leadText: 'なぜクラス同士が抱き合うとプロジェクトが死滅するのか？ 密結合の病理と有向グラフ（DAG）の原則。',
      dialogueBefore: [
        {
          id: 'dlg-r10-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生…！GameManager.h のコメントを1文字修正してリビルドを押したら、プロジェクトの全ファイルがコンパイルし直されて、完了まで30分も待たされました…開発効率が最悪です！'
        },
        {
          id: 'dlg-r10-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: '大喝じゃーーーっ！！それぞまさに【ヘッダインクルードの津波】！GameManager.h がプロジェクト中のあらゆるヘッダからインクルードされておるのじゃ！'
        },
        {
          id: 'dlg-r10-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'しかも Player.h で Enemy.h をインクルードして、Enemy.h でも Player.h をインクルードしようとしたら「型が未定義です」ってコンパイラに怒られました…'
        },
        {
          id: 'dlg-r10-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふっふっふ、【循環依存（Circular Dependency）】の泥沼じゃな！健全なアーキテクチャは依存の矢印が一方向に向かう「有向非巡回グラフ（DAG）」でなければならん。矢印がループした瞬間、ソフトウェアは1つの巨大な粗大ゴミと化すのじゃ！'
        }
      ],
      explanationText: `
### 健全なDAG vs 破綻した循環結合

ソフトウェアの依存関係は、数学的に以下の2つのどちらかになります：

- ⭕ **DAG（Directed Acyclic Graph：有向非巡回グラフ）**:
  - 依存の矢印を辿っていっても、決して元のクラスに戻らない構造。
  - 利点: 変更の影響範囲が下流にしか及ばず、並行コンパイルが爆速で走り、末端の部品から単体テストできる。
- ❌ **循環結合（Circular Cycles）**:
  - A ➔ B ➔ C ➔ A と矢印が一周している構造。
  - 弊害: どこか1箇所を変更すると全員に波及し、単体テストしようとしても全システムをリンクしなければ動かない。

この蟻地獄を断ち切る武器が、**「前方宣言による物理依存の切断」** と **「DIP（依存性逆転の原則）による論理依存の逆転」** です。
      `,
      takeaways: [
        {
          title: '依存関係にループ（循環）を絶対に許すな',
          description: '矢印が一周した時点で、そのクラス群は独立した部品ではなく「分割されたフリをした1つの巨大な神クラス」に成り下がります。'
        }
      ]
    },
    {
      id: 'step10-forward-decl-surgery',
      title: '10.2 物理依存を断ち切る「前方宣言（Forward Declaration）」の鉄則',
      leadText: 'ヘッダに安易な #include を書くべからず！ ポインタと参照を制する者がビルド時間を制する。',
      dialogueBefore: [
        {
          id: 'dlg-r10-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'ヘッダファイルの中で別のクラスを使うときは、いつもとりあえず先頭に #include を書いていました…これってダメなんですか？'
        },
        {
          id: 'dlg-r10-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '愚か者めが！ヘッダに #include を書くということは、そのヘッダの中身を丸ごと自分のヘッダにコピペするのと同じことじゃ！もしクラスのポインタ（Player*）や参照（const Player&）しか使わんのなら、【前方宣言】で済ませるのがC++プロの鉄則じゃ！'
        }
      ],
      explanationText: `
### 前方宣言ができる条件・できない条件

コンパイラがクラスの「完全な定義（#include）」を必要とするのは、**「そのオブジェクトのメモリサイズ（sizeof）やメンバ変数の中身を知らなければならない時」** だけです：

| ケース | 前方宣言でOK？ | 理由 |
| :--- | :--- | :--- |
| 「class Player;」でポインタ保持 (Player* p;) | ⭕ **OK（推奨）** | ポインタのサイズは常に8バイト（64bit）で固定だから |
| 関数の引数・戻り値で参照渡し (void hit(Player& p);) | ⭕ **OK（推奨）** | アドレスを渡すだけなので中身を知る必要がない |
| 実体メンバとして保持 (Player m_player;) | ❌ **NG (#include必須)** | Player全体のバイト数を知らないとメモリ確保できない |
| メンバ関数を呼び出す (p->attack();) | ❌ **NG (#include必須)** | 関数オフセットやシグネチャが必要（.cpp側でincludeする） |

#### 【実践ルール】
**「ヘッダ（.h）には前方宣言だけを書き、実体やメンバ関数呼び出しが必要な実装ファイル（.cpp）の中だけで #include を書く」**。
これだけで、ヘッダの変更による再コンパイルの波及を90%以上遮断できます。
      `,
      codeFiles: [
        {
          filename: 'ForwardDeclarationBestPractice.hpp',
          language: 'cpp',
          description: 'ヘッダの結合度を極小化する前方宣言イディオム',
          code: `// ❌ 【悪いヘッダ】無関係な巨大ヘッダをインクルードしまくる
// #include "HeavyMonster.hpp"
// #include "SoundEngine.hpp"
// #include "UiRenderer.hpp"

// ⭕ 【美しいヘッダ】ポインタと参照のみなので前方宣言で物理依存を完全切断！
class HeavyMonster;
class SoundEngine;
class UiRenderer;

class BattleArena {
private:
    HeavyMonster* m_boss;   // サイズは8バイト固定。Monsterの中身を知る必要ゼロ！
    SoundEngine*  m_sound;

public:
    BattleArena();
    ~BattleArena();

    // 参照渡しなので前方宣言だけでシグネチャ成立！
    void registerBoss(HeavyMonster& boss);
    void render(UiRenderer& ui);
};

// 実際の Monster->takeDamage() 等の呼び出しは
// BattleArena.cpp の中で #include "HeavyMonster.hpp" して行う！`
        }
      ],
      takeaways: [
        {
          title: 'ヘッダに #include を書く前に「ポインタで済まないか」問え',
          description: '前方宣言の活用により、ヘッダ同士の結合度（ファンイン/ファンアウト）を最小化し、ビルド時間と循環依存を一挙に撲滅できます。'
        }
      ]
    },
    {
      id: 'step10-dip-refactoring',
      title: '10.3 依存性逆転の原則（DIP）による神クラスの外科手術',
      leadText: '矢印の向きを180度反転させる！ 抽象インターフェースによる神クラス解体の最終奥義。',
      explanationText: `
### 依存性逆転の原則（Dependency Inversion Principle: DIP）

オブジェクト指向設計の最高峰原則である **DIP** はこう述べています：

1. **上位モジュール（GamePlay）は下位モジュール（Sound/Network/Render）に直接依存してはならない。両者は「抽象（Interface）」に依存すべきである。**
2. **抽象は詳細に依存してはならない。詳細が抽象に依存すべきである。**

もし「Player」クラスが「DirectXSoundSystem」クラスを直接 new して呼んでいたら、サウンドシステムの変更で Player が壊れ、音の出ない単体テスト環境では Player クラスをリンクすることすらできなくなります。

#### 【外科手術の手順】
1. 純粋仮想インターフェース「ISoundService」（virtual void playSound(int id) = 0;）を新設する。
2. Player は「ISoundService&」だけを受け取って呼び出す（Player の依存の矢印がインターフェースへ向かう）。
3. 本番用「DirectXSoundSystem」とテスト用「MockSoundSystem」を「ISoundService」から派生させる。
4. **依存の向きが逆転！** Player はサウンド実装の詳細を一切知らず、単体テストでもモックを渡して1ミリ秒で検証可能になる！
      `,
      codeFiles: [
        {
          filename: 'DIPArchitectureRefactor.cpp',
          language: 'cpp',
          description: '依存性逆転（DIP）による神クラス解体とテスト容易性の獲得',
          code: `// ⭕ 【抽象インターフェース】依存のクッション
class IAudioPlayer {
public:
    virtual ~IAudioPlayer() {}
    virtual void playSfx(int soundId) = 0;
};

// ⭕ 【高水準ビジネスロジック】具体的な音響APIを知らない！
class SpaceShip {
private:
    IAudioPlayer& m_audio; // 抽象にのみ依存
    int m_hp;

public:
    SpaceShip(IAudioPlayer& audio) : m_audio(audio), m_hp(100) {}

    void onTakeDamage(int dmg) {
        m_hp -= dmg;
        m_audio.playSfx(42); // 爆発音をリクエスト（誰がどう鳴らすかは知らん！）
    }
    int getHp() const { return m_hp; }
};

// -------------------------------------------------------------
// 🧪 【単体テスト】サウンドカードのないCIサーバーでも爆速検証！
class MockAudioPlayer : public IAudioPlayer {
public:
    int lastPlayedId = -1;
    void playSfx(int soundId) override { lastPlayedId = soundId; }
};

void testSpaceShipDamage() {
    MockAudioPlayer mockAudio;
    SpaceShip ship(mockAudio);

    ship.onTakeDamage(30);

    assert(ship.getHp() == 70);
    assert(mockAudio.lastPlayedId == 42 && "ダメージ時に爆発音が鳴っていません！");
    printf("単体テスト完全パス！ハードウェア依存ゼロ！\\n");
}`
        }
      ],
      takeaways: [
        {
          title: 'インターフェースを境界に差し挟み、依存を逆流させよ',
          description: '具象クラス同士の直接結合を断ち切り、純粋仮想クラスを挟むことで、部品の交換可能性とテスト容易性が極限まで高まります。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-r10-1',
      question: 'C++のヘッダファイル内で、クラスのポインタ（Enemy*）や参照（Enemy&）のみをメンバや引数として扱う際、推奨される記述は何ですか？',
      options: [
        '#include "Enemy.hpp" を必ず書く',
        'class Enemy; と前方宣言（Forward Declaration）を行い、ヘッダレベルでのインクルード依存を切断する',
        'Enemy クラスの定義をヘッダ内に直接コピー＆ペーストする',
        'void* にキャストして型情報を消す'
      ],
      correctIndex: 1,
      explanation: 'ポインタや参照はアドレス（固定サイズ）を保持するだけなので完全な定義を必要とせず、前方宣言で済ませることで再コンパイルの波及を劇的に抑えられます。'
    },
    {
      id: 'quiz-r10-2',
      question: 'ヘッダファイル同士が循環インクルード（A.h が B.h を含み、B.h が A.h を含む）した際に生じる最も深刻なアーキテクチャ上の弊害は何ですか？',
      options: [
        '画面の色が反転する',
        '2つのクラスが不可分に密結合し、単体テストや部品単体での再利用が不可能になり、全再コンパイルが誘発される',
        '関数の実行速度が半分になる',
        'C++コンパイラがC言語モードに切り替わる'
      ],
      correctIndex: 1,
      explanation: '循環依存が発生すると、部品ごとの独立性が失われ、単体テスト・モジュール分割・並行ビルドがすべて阻害されます。'
    },
    {
      id: 'quiz-r10-3',
      question: '依存性逆転の原則（DIP）において、上位ロジック（Player）が下位システム（DirectXSound）に直接依存するのを防ぐために間に挟むべきものは何ですか？',
      options: [
        'グローバル変数',
        '純粋仮想関数を持つ抽象インターフェース（例: ISoundService）',
        'goto文によるジャンプテーブル',
        'OSのシステムコール'
      ],
      correctIndex: 1,
      explanation: '抽象インターフェースを間に挟むことで、上位モジュールも下位モジュールも抽象に依存する形となり、モックへの差し替えや単体テストが極めて容易になります。'
    },
    {
      id: 'quiz-r10-4',
      question: '巨大な神クラス（God Class）の改修において、Pimplイディオム（Pointer to Implementation）を適用する最大のメリットは何ですか？',
      options: [
        'クラスの private メンバ変数の変更が公開ヘッダに一切波及せず、他ファイルの再コンパイルを完全に防げる',
        'メモリ使用量が必ず1バイトになる',
        '仮想関数の呼び出しコストがゼロになる',
        'C++のコードがPythonに自動変換される'
      ],
      correctIndex: 0,
      explanation: 'Pimplイディオムは内部実装を不透明ポインタの先の構造体に隠蔽するため、プライベート変数を変更しても公開ヘッダが一切変わらず、巨大プロジェクトの再ビルドを劇的に削減します。'
    }
  ]
};
