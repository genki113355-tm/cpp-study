import { Chapter } from '../../types/curriculum';

export const chapter5: Chapter = {
  id: 5,
  slug: 'chapter-modern-1-smart-pointers-raii',
  courseTrack: 'modern',
  courseChapterCode: 'M1',
  title: 'モダン第1章：【C++11】スマートポインタとRAII（所有権設計とメモリ安全性）',
  subtitle: 'std::unique_ptr と std::shared_ptr によるリソース完全自動管理',
  badge: 'モダンC++ M1【C++11】：スマートポインタ',
  gameVersion: 'v5_smart_pointers',
  description: '第4章で多態性を手に入れたものの、敵の生成・破棄には生の new / delete を使っていました。本章では、生ポインタの解放漏れやダングリングポインタを設計レベルで撲滅するC++の金字塔「スマートポインタ（unique_ptr, shared_ptr, weak_ptr）」と「所有権（Ownership）」の規律を体得します。',
  umlDiagram: {
    diagramType: 'class',
    title: 'モダン第1章プログラムのUML設計書（所有権とスマートポインタ）',
    subtitle: 'unique_ptr（コンポジション）と shared_ptr（集約）の厳密な描き分け',
    description: '生new/deleteを撲滅したモダンC++設計書。単独所有（unique_ptr）は黒菱形（◆）、共有所有（shared_ptr）は白菱形（◇）、単なる観察参照（生ポインタ/weak_ptr）は通常の矢印（→）として設計図上で明確に区別されます。',
    classes: [
      {
        name: 'Player',
        attributes: [
          { name: 'm_hp', type: 'int', visibility: '-' },
          { name: 'm_drone', type: 'std::unique_ptr<BitDrone>', visibility: '-' },
          { name: 'm_sprite', type: 'std::shared_ptr<Texture>', visibility: '-' },
        ],
        operations: [
          { name: 'deployDrone()', type: 'void', visibility: '+' },
          { name: 'update()', type: 'void', visibility: '+' },
        ],
      },
      {
        name: 'BitDrone',
        attributes: [
          { name: 'm_orbitAngle', type: 'float', visibility: '-' },
        ],
        operations: [
          { name: 'fireSupportLaser()', type: 'void', visibility: '+' },
        ],
      },
      {
        name: 'Enemy',
        attributes: [
          { name: 'm_sprite', type: 'std::shared_ptr<Texture>', visibility: '-' },
          { name: 'm_target', type: 'Player*', visibility: '-' },
        ],
        operations: [
          { name: 'trackPlayer()', type: 'void', visibility: '+' },
        ],
      },
      {
        name: 'Texture',
        stereotype: 'resource',
        attributes: [
          { name: 'm_width', type: 'int', visibility: '-' },
          { name: 'm_height', type: 'int', visibility: '-' },
        ],
        operations: [
          { name: 'bind()', type: 'void', visibility: '+' },
        ],
      },
    ],
    relations: [
      {
        from: 'Player',
        to: 'BitDrone',
        type: 'composition',
        multiplicityFrom: '1',
        multiplicityTo: '0..1',
        label: '単独所有',
        cppMapping: 'std::unique_ptr<BitDrone> m_drone; // 寿命連動（親と運命を共にする）',
      },
      {
        from: 'Player',
        to: 'Texture',
        type: 'aggregation',
        label: '共有所有',
        cppMapping: 'std::shared_ptr<Texture> m_sprite; // 参照カウントによる共同所有',
      },
      {
        from: 'Enemy',
        to: 'Texture',
        type: 'aggregation',
        label: '共有所有',
        cppMapping: 'std::shared_ptr<Texture> m_sprite;',
      },
      {
        from: 'Enemy',
        to: 'Player',
        type: 'association',
        label: '追尾対象参照',
        cppMapping: 'Player* m_target; // 寿命には関与しない（非所有観察）',
      },
    ],
    codeMappingNotes: [
      '【黒菱形 ◆──> ＝ std::unique_ptr】: Playerが死亡すると、デストラクタで自動的に m_drone のヒープメモリが解放されます。二重解放やリークは100%発生しません。',
      '【白菱形 ◇──> ＝ std::shared_ptr】: 巨大な Texture リソースは Player と Enemy が共同で参照カウントを保持。最後の1人が死んだ瞬間に安全に解放されます。',
      '【開いた矢印 ──> ＝ 非所有参照】: Enemy は自機を追跡するためにポインタを持ちますが、Player の寿命には一切口出ししません。',
    ],
  },
  sections: [
    {
      id: 'sec5-raw-pointer-pitfalls',
      title: '5.1 生ポインタの悲劇：解放漏れ・二重解放・ダングリングポインタ',
      leadText: '「malloc/free を手作業で追跡していたC言語」から脱却したはずが、初期C++でも「new と delete の対応を手動で数える苦行」が続いていました。なぜ生ポインタの手動管理は破綻するのか、その物理的メカニズムを解剖します。',
      dialogueBefore: [
        {
          id: 'd5-1',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'ベン先生！第4章で敵のポリモーフィズムがバッチリ動きました！でも、敵を倒したときに `delete enemy; enemies.erase(it);` って毎回手で書くの、ちょっと緊張しますね……。'
        },
        {
          id: 'd5-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: 'その緊張感こそが正しいエンジニアの直感じゃ、ピピン！まさに現場で起こる重大クラッシュの8割は、その「手動の delete」から生まれておる！もし途中で return したり、erase だけして delete を忘れたらどうなる？'
        },
        {
          id: 'd5-3',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'えっ……ヒープに敵のメモリが残ったまま、二度と解放できなくなる「メモリリーク」ですね！逆に、delete した後のポインタを別の場所から触っちゃったら……？'
        },
        {
          id: 'd5-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'それこそが「ダングリングポインタ（墓場参照）」じゃ！すでに死んだメモリ番地を読み書きしてしまい、前触れなくOSから強制終了（セグフォ）を食らう。だが安心せい。モダンC++には【new も delete も1文字も書かない】究極の規律があるのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '生ポインタ手動管理 vs モダンC++スマートポインタ',
        cApproach: {
          title: '生ポインタによる手動管理（第4章までのコード）',
          code: `// 敵をヒープに手動生成
Enemy* enemy = new ShieldEnemy(10, 2);
enemies.push_back(enemy);

// 撃破時に手動で解放
delete enemy;          // ← もし書き忘れたら永久メモリリーク！
enemies.erase(it);     // ← 二重に delete すると二重解放クラッシュ！

// デストラクタでも全要素を手動 delete
for (auto e : enemies) {
    delete e;
}`,
          drawbacks: [
            'delete を書き忘れた瞬間にヒープメモリが永遠に漏れ続ける',
            'すでに delete されたアドレスを保持したポインタ（ダングリングポインタ）が残り、触るとクラッシュ',
            '同じポインタを誤って2回 delete すると Double Free 例外で即死',
            '例外発生や関数の途中 return で容易に解放処理がスキップされる'
          ]
        },
        cppApproach: {
          title: 'モダンC++：std::unique_ptr による完全自動寿命管理',
          code: `// std::make_unique で安全に生成（所有権が配列へ移動）
enemies.push_back(std::make_unique<ShieldEnemy>(10, 2));

// 撃破時：配列から erase するだけ！
enemies.erase(it);
// ↑ erase された瞬間、unique_ptr のデストラクタが自動起動し、
// ヒープ上のインスタンスが1バイトも漏れずに即座に delete される！

// デストラクタに手動解放コードは1行も不要（vectorクリアで全滅）`,
          benefits: [
            '手動の delete を1行も書く必要がない（メモリリーク発生率 0%）',
            '所有権が明確になり、二重解放やダングリングポインタが設計レベルで不可能',
            'スコープを抜けるとき、またはコンテナから除外された瞬間に確実にデストラクタ起動',
            '生ポインタと全く同じ実行速度とメモリ効率（オーバーヘッド 0バイト）'
          ]
        },
        paradigmShiftNotes: 'C言語では「プログラマの記憶力」に頼って malloc/free を管理していました。モダンC++では「オブジェクトのスコープとコンテナの生存期間」にメモリの寿命を委ねます。これが RAII（Resource Acquisition Is Initialization）の完成形です。'
      }
    },
    {
      id: 'sec5-unique-ptr-move',
      title: '5.2 std::unique_ptr と所有権の移動（ムーブセマンティクス）',
      leadText: 'なぜ unique_ptr はコピーできないのか？「唯一の所有者（Single Ownership）」という思想と、アイテムカプセルが敵からステージへ、そしてプレイヤーへ渡される「所有権の移動（std::move）」を学びます。',
      variables: [
        {
          name: 'std::vector<std::unique_ptr<Enemy>> m_enemies',
          type: 'private std::vector<std::unique_ptr<Enemy>>',
          scope: 'Gameクラス内部',
          description: '出現中の敵インスタンスの単独所有権リスト。各要素は世界で唯一の持ち主であり、vectorが保持する限り生存する。',
          cComparison: 'C言語の Enemy* 配列。C言語では誰が所有者なのか不明でどこからでも free できてしまった。'
        },
        {
          name: 'std::vector<std::unique_ptr<Item>> m_items',
          type: 'private std::vector<std::unique_ptr<Item>>',
          scope: 'Gameクラス内部',
          description: '敵撃破時にドロップしたアイテムカプセル群。プレイヤーに拾われるまでステージが所有権を保持する。',
          cComparison: 'C言語ではグローバルなアイテムバッファ。寿命管理が曖昧になりがちだった。'
        },
        {
          name: 'std::move()',
          type: 'C++標準ライブラリ（キャスト関数）',
          scope: '所有権の移転処理',
          description: 'オブジェクトの所有権を別ポインタへ譲渡する。移動元のポインタは自動的に nullptr になり、二重所有を防ぐ。',
          cComparison: 'C言語には所有権の概念が存在せず、ポインタ代入すると単にアドレスの別名（エイリアス）が増えるだけだった。'
        }
      ],
      explanationText: `### ■ なぜ unique_ptr はコピーできないのか？
\`std::unique_ptr\` の最大の特徴は、**コピーコンストラクタとコピー代入演算子が削除（= delete）されている**点です。

\`\`\`cpp
std::unique_ptr<Enemy> p1 = std::make_unique<NormalEnemy>(10, 2);
std::unique_ptr<Enemy> p2 = p1; // コンパイルエラー！コピーは絶対に禁止！
\`\`\`

もしこれが許可されていたら、\`p1\` と \`p2\` が同じヒープ実体を指してしまいます。するとスコープを抜けた際、**2回 delete** されてクラッシュ（二重解放）してしまいます。

### ■ 所有権の移動（Move Semantics）
コピーは禁止ですが、**「持ち主の変更（譲渡）」**は許可されています。それが \`std::move()\` です。

\`\`\`cpp
std::unique_ptr<Enemy> p2 = std::move(p1);
// p1 は nullptr になり、p2 が新たな唯一の所有者となる！
\`\`\`

ゲーム内では、敵を倒した瞬間に生成されたアイテムカプセルが：
1. 敵の内部で \`std::make_unique<Item>()\` される
2. ステージの \`m_items\` リストへ \`std::move()\` される
3. プレイヤーが触れた瞬間、プレイヤーへ引き渡される
という**「所有権のリレー」**が極めて安全に行われます。`,
      diagramType: 'smart_pointer_ownership'
    },
    {
      id: 'sec5-shared-ptr-weak',
      title: '5.3 std::shared_ptr と std::weak_ptr による共有リソース管理',
      leadText: '「どうしても複数のオブジェクトから同じ実体を同時に所有したい」場合はどうするのか？参照カウント方式の shared_ptr と、循環参照による永久メモリリークを防ぐ weak_ptr を解説します。',
      dialogueBefore: [
        {
          id: 'd5-5',
          speaker: 'penguin',
          emotion: 'question',
          text: '先生、unique_ptr の凄さはわかりました！でも、今回登場する「自機を護衛するビットドローン（子機）」は、自機（Player）も更新したいし、ステージ（Game）も当たり判定で参照したいです。こういう時はどうするんですか？'
        },
        {
          id: 'd5-6',
          speaker: 'shirokuma',
          emotion: 'happy',
          text: '良い質問じゃ！複数の持ち主で1つの実体をシェアしたい時こそ、【std::shared_ptr】の出番じゃ！内部に「参照カウンタ（use_count）」を持ち、所有者が1人増えるたびに +1、手放すたびに -1 され、最後の1人が手放した瞬間に自動破棄される！'
        },
        {
          id: 'd5-7',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '便利ですね！じゃあ全部 shared_ptr にしちゃえばいいんじゃないですか？'
        },
        {
          id: 'd5-8',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: 'バカ者ッ！それこそが初心者が陥る「循環参照の死の罠」じゃ！AがBを持ち、BがAを持つと、カウンタが永遠に0にならず、メモリが永久に解放されなくなる！だからこそ【監視するだけなら std::weak_ptr】で弱く繋ぐのじゃ！'
        }
      ],
      explanationText: `### ■ 管理ブロック（Control Block）と参照カウント
\`std::shared_ptr\` を作成すると、ヒープ領域に**「実体」**と**「管理ブロック」**の2つが確保されます。

- **use_count**: 現在の実体所有者数（これが 0 になると実体が \`delete\` される）
- **weak_count**: 監視中の \`std::weak_ptr\` の数（これも 0 になると管理ブロック自体が破棄される）

\`\`\`cpp
// プレイヤー周囲の護衛ビットドローンを生成
std::shared_ptr<BitDrone> drone = std::make_shared<BitDrone>(0.0f);
// use_count: 1

m_player.addDrone(drone); 
// プレイヤー内部の vector にコピー保存される → use_count: 2

// ゲームループで drone 変数のスコープが終わっても、
// m_player が所有権を持っているので use_count: 1 となり実体は生き続ける！
\`\`\`

### ■ 循環参照（死のロック）と weak_ptr の必然性
もし「ビット機」が親の「プレイヤー」へのポインタを \`shared_ptr<Player>\` で持ってしまうと：
- プレイヤーはビット機を所有（use_count = 1）
- ビット機はプレイヤーを所有（use_count = 1）
互いに参照し合っているため、ゲームが終わってもどちらの \`use_count\` も 0 にならず、**永遠にデストラクタが呼ばれない死のメモリリーク**が発生します。

これを防ぐため、逆参照や監視側には \`std::weak_ptr<Player>\` を使います。
\`weak_ptr\` は参照カウントを増やさず、使うときだけ \`drone->lock()\` して一時的な \`shared_ptr\` を取り出します。`
    },
    {
      id: 'sec5-gameloop-implementation',
      title: '5.4 手動 delete を1行も書かない完成されたゲームループ',
      leadText: '第5章の実機コードでは、コンストラクタ、ゲームループ、デストラクタのどこにも delete が現れません。erase するだけで中身が自動破棄される美しさを実感してください。',
      processSteps: [
        {
          stepNumber: 1,
          title: '初期化（std::make_unique による敵生成）',
          codeSnippet: 'm_enemies.push_back(std::make_unique<ShieldEnemy>(x, y));',
          description: 'ヒープ確保とスマートポインタ生成を std::make_unique でワンアクション実行。メモリ確保失敗時の例外安全性も100%保証。',
          impact: '生の new を書かずに安全にインスタンス化',
          designIntent: 'new の直後にスマートポインタへ代入する書き方は例外時にリークする恐れがあるため make_unique がC++標準の推奨。'
        },
        {
          stepNumber: 2,
          title: 'プレイヤー＆共有ビット機の連動更新',
          codeSnippet: 'm_player.update(); // 従属ドローンを旋回計算',
          description: 'プレイヤーが所有する shared_ptr<BitDrone> の旋回角度と現在座標を自機の移動に合わせて再計算。',
          impact: '自機の周囲をシアン色のビット機が美しく旋回',
          designIntent: 'ビット機の寿命をプレイヤーと同期させ、プレイヤーが倒れたときはビット機も自動連鎖消滅させる。'
        },
        {
          stepNumber: 3,
          title: '撃破時のアイテム動的生成と所有権移動',
          codeSnippet: 'm_items.push_back(std::make_unique<Item>(x, y, ItemType::Power));',
          description: 'シールド敵やUFO撃破時、その座標にアイテムカプセルを動的生成してステージの所有権リスト m_items へ格納。',
          impact: '敵が倒れた場所に P や B のカプセルが出現し落下',
          designIntent: 'アイテムの生成と管理をステージが一元管理し、プレイヤー接触時に安全に効能を適用。'
        },
        {
          stepNumber: 4,
          title: '不要オブジェクトの安全な自動消滅（erase-remove）',
          codeSnippet: 'm_enemies.erase(std::remove_if(..., !e->isAlive()), m_enemies.end());',
          description: '死んだ敵や拾われたアイテムを vector から erase する。コンテナから外れた瞬間に unique_ptr のデストラクタが走り、ヒープ実体が即座に解放される。',
          impact: 'delete を1回も呼ばずにメモリが完全に清掃される',
          designIntent: 'メモリ解放の責任を「プログラマの記述」から「コンテナとスマートポインタのライフサイクル」へ100%委譲。'
        }
      ],
      codeFiles: [
        {
          filename: 'Game.h',
          language: 'cpp',
          description: 'スマートポインタで統括されたゲームマネージャークラス',
          isMain: true,
          code: `#pragma once
#include <vector>
#include <memory>
#include <string>
#include "Common.h"
#include "Player.h"
#include "Enemy.h"
#include "Item.h"
#include "Bullet.h"
#include "Particle.h"

class Game {
private:
    // 【モダンC++の極致】生ポインタはゼロ！すべてスマートポインタで管理
    std::vector<std::unique_ptr<Enemy>> m_enemies;  // 敵の単独所有
    std::vector<std::unique_ptr<Item>>  m_items;    // ドロップアイテムの単独所有
    std::vector<Bullet>                 m_bullets;  // 弾丸
    std::vector<Particle>               m_particles;// 火花粒子
    Player                              m_player;   // 自機

    int  m_enemyDir;
    int  m_enemyMoveTimer;
    int  m_ufoTimer;
    int  m_score;
    bool m_gameOver;
    bool m_gameClear;

public:
    Game();
    // デストラクタに手動 delete ループは1行も不要！
    // vector破棄に伴い、各 unique_ptr が派生クラスの仮想デストラクタを自動起動
    ~Game() = default;

    void init();
    void processInput();
    void update();
    void render();
};`,
          lineExplanations: [
            {
              line: 3,
              title: 'スマートポインタヘッダの読み込み',
              summary: 'std::unique_ptr や std::shared_ptr、std::make_unique などの標準メモリ管理機能を使用するためにインクルードします。',
              tokens: [
                { token: '#include', explanation: 'プリプロセッサによる外部ヘッダ取り込み' },
                { token: '<memory>', explanation: 'C++標準ライブラリのスマートポインタ定義ヘッダ' }
              ]
            },
            {
              line: 15,
              title: '多態的オブジェクトの単独所有（生ポインタ撲滅）',
              summary: '抽象基底クラス Enemy を継承した多彩な敵を、単独所有権（unique_ptr）付きで1つの動的配列に格納します。手動 delete は完全不要。',
              tokens: [
                { token: 'std::vector<...>', explanation: '動的配列コンテナ' },
                { token: 'std::unique_ptr<Enemy>', explanation: '所有権を1箇所だけで保持するスマートポインタ。不要化時に自動 delete される' },
                { token: 'm_enemies', explanation: '敵オブジェクト群を所有するメンバ変数' }
              ],
              pitfall: '第4章の生ポインタ（std::vector<Enemy*>）では delete ループの書き忘れで即リークしていましたが、unique_ptr なら破棄が100%自動保証されます。'
            },
            {
              line: 16,
              title: 'アイテムの単独所有コンテナ',
              summary: '敵撃破時にドロップするアイテムカプセルを unique_ptr で管理。取得時や画面外消滅時に安全に寿命を全うします。',
              tokens: [
                { token: 'std::unique_ptr<Item>', explanation: 'Itemインスタンスの排他的所有権' }
              ]
            },
            {
              line: 32,
              title: '= default によるデフォルトデストラクタ宣言',
              summary: 'コンパイラに標準のデストラクタを自動生成させます。メンバ変数（unique_ptr群）が自動でクリーンアップされるため、解放ループは1行も不要です。',
              tokens: [
                { token: '~Game()', explanation: 'Gameクラスのデストラクタ' },
                { token: '= default;', explanation: 'コンパイラ最適化されたデフォルト実装を要求する構文（C++11〜）' }
              ],
              pitfall: '手動でデストラクタ内に delete を書こうとすると、Rule of Zero（メンバ変数のRAIIに任せる原則）が崩れ、二重解放や解放漏れの温床になります。'
            }
          ]
        },
        {
          filename: 'Player.h',
          language: 'cpp',
          description: '共有ビット機を保持し3WAYショットを放つプレイヤー',
          code: `#pragma once
#include <vector>
#include <memory>
#include <string>
#include "Common.h"
#include "Bullet.h"
#include "BitDrone.h"

class Player {
private:
    int  m_x;
    int  m_y;
    bool m_hasTripleShot;
    // 護衛ビットドローンを共有所有（shared_ptr）
    std::vector<std::shared_ptr<BitDrone>> m_drones;

public:
    Player(int startX, int startY);
    ~Player() = default;

    void moveLeft();
    void moveRight();
    void update();
    void draw(std::vector<std::string>& buffer) const;

    // 弾を発射（3WAYやビット連動）
    void shoot(std::vector<Bullet>& bullets) const;

    void enableTripleShot() { m_hasTripleShot = true; }
    void addDrone(std::shared_ptr<BitDrone> drone);
    int  getDroneCount() const { return static_cast<int>(m_drones.size()); }
};`,
          lineExplanations: [
            {
              line: 15,
              title: 'std::shared_ptr による共有所有（参照カウント管理）',
              summary: '護衛ビットドローンを複数箇所（PlayerとGameなど）から同時に参照・所有できるよう、参照カウント方式の shared_ptr で保持します。',
              tokens: [
                { token: 'std::shared_ptr<BitDrone>', explanation: '所有者が増えるとカウント+1、減ると-1され、0になった瞬間に自動消滅するスマートポインタ' },
                { token: 'm_drones', explanation: '自機に従属するビット機の配列' }
              ],
              pitfall: '双方向で shared_ptr を持ち合うと「循環参照」になり永遠にメモリが解放されなくなります。親への逆参照や監視には std::weak_ptr を使いましょう。'
            },
            {
              line: 30,
              title: 'shared_ptr の引数受け取り（所有権の共有参加）',
              summary: '生成されたビット機の shared_ptr を受け取り、自機のメンバ配列に push_back して共同所有者（use_count + 1）になります。',
              tokens: [
                { token: 'std::shared_ptr<BitDrone> drone', explanation: '共有スマートポインタの値渡し。コピーに伴い参照カウントが安全にインクリメントされる' }
              ]
            }
          ]
        },
        {
          filename: 'Item.h',
          language: 'cpp',
          description: '敵撃破時にドロップするカプセルクラス',
          code: `#pragma once
#include <vector>
#include <string>
#include "Common.h"

enum class ItemType {
    Power, // 3WAYレーザー化 ('P')
    Bit    // 援護ビットドローン追加 ('B')
};

class Item {
private:
    float    m_x;
    float    m_y;
    ItemType m_type;
    bool     m_active;

public:
    Item(float x, float y, ItemType type);
    ~Item() = default;

    void update();
    void draw(std::vector<std::string>& buffer) const;

    float getX() const { return m_x; }
    float getY() const { return m_y; }
    ItemType getType() const { return m_type; }
    bool isActive() const { return m_active; }
    void deactivate() { m_active = false; }
};`
        }
      ],
      dialogueAfter: [
        {
          id: 'd5-9',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'うわぁぁ！デストラクタの中にあった `for (auto e : enemies) delete e;` が完全に消え去りました！erase() を呼んだだけで勝手に片付いてくれるなんて、まるで魔法ですね！'
        },
        {
          id: 'd5-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '魔法ではない、これぞ「RAIIの必然」じゃ！スマートポインタという小さな器がスタック上で破棄される時、そのデストラクタがヒープ実体を確実に道連れにして解放する。これこそが、プログラマが人間である限り不可避だったメモリリークを根絶したC++の英知なのじゃ！'
        }
      ],
      takeaways: [
        {
          title: '9割の設計は std::unique_ptr で完結せよ',
          description: 'オーバーヘッドゼロで生のポインタと同一速度。唯一の所有権を明確にし、安易な shared_ptr 乱用を避けるのがモダンC++の鉄則です。'
        },
        {
          title: 'std::make_unique / std::make_shared を使え',
          description: 'new を書かずにヘルパー関数を使うことで、例外発生時のメモリリークを防ぎ、コードを簡潔にします。'
        },
        {
          title: '共有が必要な時だけ std::shared_ptr、逆参照には std::weak_ptr',
          description: '複数の持ち主がいるリソースには参照カウントを使い、相互参照による循環参照リークは weak_ptr で断ち切ります。'
        },
        {
          title: 'コンテナの消去とメモリ解放の同期',
          description: 'vector<unique_ptr<T>> から erase するだけでヒープ実体も即時自動解放され、手動 delete が1行も要らなくなります。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q5-1',
      question: 'std::unique_ptr で「コピー（代入や引数の値渡し）」がコンパイルエラーになる最大の理由は何ですか？',
      options: [
        'コンパイラがコピー用のメモリを確保するのに時間がかかるから',
        '2つのポインタが同じ実体を指すと、破棄時に2回 delete（二重解放）されてクラッシュするから',
        'C++11以降ではすべてのクラスでコピーが禁止されたから',
        '仮想関数テーブル（vtable）のサイズが2倍になってしまうから'
      ],
      correctIndex: 1,
      explanation: '正解は「2つのポインタが同じ実体を指すと、破棄時に2回 delete（二重解放）されてクラッシュするから」です。unique_ptr は「唯一の所有者」であることを保証するためコピーコンストラクタが削除されています。所有権を渡すには std::move() を用います。'
    },
    {
      id: 'q5-2',
      question: 'std::unique_ptr<Enemy> p2 = std::move(p1); を実行した直後、元の変数 p1 の値はどうなりますか？',
      options: [
        'p2 と同じヒープアドレスを指し続ける',
        '自動的に delete されて未定義の不正ポインタになる',
        'nullptr（空ポインタ）になる',
        'コンパイルエラーになり実行できない'
      ],
      correctIndex: 2,
      explanation: '正解は「nullptr（空ポインタ）になる」です。ムーブによって所有権が p2 に完全に移譲されるため、元の p1 は安全にリセット（nullptr）され、二重解放や誤操作を防ぎます。'
    },
    {
      id: 'q5-3',
      question: 'std::shared_ptr<T> がヒープ上の実体を delete 解放するのはどのタイミングですか？',
      options: [
        'プログラム全体（main関数）が終了したとき',
        'いずれか1つの shared_ptr がスコープを抜けたとき',
        'その実体を指すすべての shared_ptr が破棄され、参照カウント（use_count）が 0 になったとき',
        'ガベージコレクタが定期巡回して回収したとき'
      ],
      correctIndex: 2,
      explanation: '正解は「参照カウント（use_count）が 0 になったとき」です。最後の所有者がスコープを抜けてカウントが 0 になった瞬間に、即座に実体のデストラクタが呼ばれてメモリが返却されます。'
    },
    {
      id: 'q5-4',
      question: 'オブジェクトAとオブジェクトBが互いに shared_ptr で所有し合うことで、メモリが永遠に解放されなくなる現象を何と呼び、どう解決しますか？',
      options: [
        '循環参照（Cyclic Reference）。片方を std::weak_ptr にして所有権の輪を断ち切る。',
        'ダングリングポインタ。両方に raw ポインタを使うことで解決する。',
        'メモリフラグメンテーション。std::make_shared を使うことで解決する。',
        '二重解放。基底クラスのデストラクタを virtual にすることで解決する。'
      ],
      correctIndex: 0,
      explanation: '正解は「循環参照（Cyclic Reference）。片方を std::weak_ptr にして所有権の輪を断ち切る」です。weak_ptr は参照カウンタを増やさない「見守り専用」のポインタであるため、循環参照による死のロックを完全に防ぐことができます。'
    }
  ],
  nextChapterSlug: 'chapter-modern-2-move-semantics'
};

