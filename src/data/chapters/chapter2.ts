import { Chapter } from '../../types/curriculum';

export const chapter2: Chapter = {
  id: 2,
  slug: 'chapter-2-classes-and-files',
  courseTrack: 'classic',
  courseChapterCode: 'C2',
  title: 'レガシー第2章：クラス化とファイルの分割（アフター：カプセル化の意図）',
  subtitle: 'データと振る舞いを束ね、責務境界を物理ファイルで切り分ける',
  badge: 'レガシーC++ C2：カプセル化とファイル分割',
  description: 'グローバル変数を全廃！Player（自機）、Invader（敵）、Bullet（弾）をそれぞれヘッダ（.h）と実装（.cpp）に分離。C言語の「構造体ポインタを関数に渡す設計」とC++の「クラス」の決定的な違いと、カプセル化の真の意図を解き明かします。',
  gameVersion: 'v2_classes',
  prevChapterSlug: 'chapter-1-spaghetti-code',
  nextChapterSlug: 'chapter-3-dynamic-lifecycle',
  umlDiagram: {
    diagramType: 'class',
    title: '第2章プログラムのUMLクラス設計書',
    subtitle: '自機・敵・弾の3大クラスとカプセル化（public / private）境界',
    description: '第1章のグローバル変数スパゲティを解体し、Player・Invader・Bulletの3つの独立クラスに責務を分割した設計書です。private（-）によるデータ隠蔽と、public（+）による公開APIが明確に定義されています。',
    classes: [
      {
        name: 'Player',
        attributes: [
          { name: 'm_x', type: 'int', visibility: '-', codeLineRef: { filename: 'Player.h', line: 6 } },
          { name: 'm_y', type: 'int', visibility: '-', codeLineRef: { filename: 'Player.h', line: 7 } },
        ],
        operations: [
          { name: 'moveLeft()', type: 'void', visibility: '+', codeLineRef: { filename: 'Player.cpp', line: 6 } },
          { name: 'moveRight()', type: 'void', visibility: '+', codeLineRef: { filename: 'Player.cpp', line: 13 } },
          { name: 'shoot(bullet: Bullet&)', type: 'void', visibility: '+', codeLineRef: { filename: 'Player.cpp', line: 20 } },
          { name: 'getX() const', type: 'int', visibility: '+', codeLineRef: { filename: 'Player.h', line: 16 } },
          { name: 'getY() const', type: 'int', visibility: '+', codeLineRef: { filename: 'Player.h', line: 17 } },
        ],
      },
      {
        name: 'Bullet',
        attributes: [
          { name: 'm_x', type: 'int', visibility: '-', codeLineRef: { filename: 'Bullet.h', line: 6 } },
          { name: 'm_y', type: 'int', visibility: '-', codeLineRef: { filename: 'Bullet.h', line: 7 } },
          { name: 'm_active', type: 'bool', visibility: '-', codeLineRef: { filename: 'Bullet.h', line: 8 } },
        ],
        operations: [
          { name: 'spawn(x: int, y: int)', type: 'void', visibility: '+', codeLineRef: { filename: 'Bullet.cpp', line: 5 } },
          { name: 'update()', type: 'void', visibility: '+', codeLineRef: { filename: 'Bullet.cpp', line: 11 } },
          { name: 'isActive() const', type: 'bool', visibility: '+', codeLineRef: { filename: 'Bullet.h', line: 20 } },
        ],
      },
      {
        name: 'Invader',
        attributes: [
          { name: 'm_x', type: 'int', visibility: '-', codeLineRef: { filename: 'Invader.h', line: 6 } },
          { name: 'm_y', type: 'int', visibility: '-', codeLineRef: { filename: 'Invader.h', line: 7 } },
          { name: 'm_alive', type: 'bool', visibility: '-', codeLineRef: { filename: 'Invader.h', line: 8 } },
        ],
        operations: [
          { name: 'move(dx: int, dy: int)', type: 'void', visibility: '+', codeLineRef: { filename: 'Invader.cpp', line: 6 } },
          { name: 'destroy()', type: 'void', visibility: '+', codeLineRef: { filename: 'Invader.cpp', line: 12 } },
          { name: 'isAlive() const', type: 'bool', visibility: '+', codeLineRef: { filename: 'Invader.h', line: 19 } },
        ],
      },
    ],
    relations: [
      {
        from: 'Player',
        to: 'Bullet',
        type: 'association',
        label: '発射指示',
        cppMapping: 'void Player::shoot(Bullet& bullet); // 参照渡しによる操作',
      },
    ],
    codeMappingNotes: [
      '【- 記号（private）の実装】: 座標変数（m_x, m_y）はすべて private に配置され、外部から直接書き換えて画面外へ飛び出すバグを物理的に防止します。',
      '【+ 記号（public）の実装】: moveLeft() や moveRight() などの公開窓口関数のみを公開。関数内部で画面端の境界チェック（clamping）を実施します。',
      '【const メンバ関数の設計書表現】: getX() const は状態を変更しない読み取り専用アクセサとして公開されます。',
    ],
  },
  sections: [
    {
      id: 'sec2-paradigm-shift',
      title: '2.1 関数設計（C言語）vs クラス設計（C++）の決定的な違い',
      leadText: '「C言語でも struct を作ってポインタを渡せば同じじゃないか？」という疑問に、C言語におけるカプセル化の究極技法（不透明ポインタ）と、C++のクラス設計の必然性からお答えします。',
      dialogueBefore: [
        {
          id: 'd2-1',
          speaker: 'penguin',
          emotion: 'question',
          text: 'シロクマ指導官！第2章で「クラス」を作るって言ってますけど、C言語でも `struct Player { int x, y; };` って構造体を作って、`Player_Move(&player, -1);` ってポインタを渡せば同じことができますよね？\nなんでわざわざ C++ の `class` なんて小難しいものを使う必要があるんですか？',
          sideNote: '腕を組んで首をかしげるペンギン生徒'
        },
        {
          id: 'd2-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'まさにそこじゃ！その疑問こそ、C言語からC++へ渡る最大の架け橋じゃ。\n通常のC言語の構造体はヘッダにメンバが公開されておるから「データが野ざらし」になり、別の不注意な開発者が `player.x = -9999;` と直接代入する事故が防げん。\n実はC言語の現場でも、これを防ぐために【不透明ポインタ（Opaque Pointer）】というプロの技法を使っておるのじゃ！',
        },
        {
          id: 'd2-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'えっ！？C言語のままでもデータを隠蔽できるんですか！？',
        },
        {
          id: 'd2-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そうじゃ！ヘッダには `typedef struct Player Player;` と型名だけを前方宣言し、メンバの実体定義は `.c` ファイル内に隠す（Linuxカーネルや標準ライブラリの `FILE*` がまさにそれじゃ）。\nしかし、不透明ポインタはヒープ確保（malloc）や間接参照ポインタが必要になる。\nC++の `class` の凄さは、**【スタック上にインライン配置してゼロオーバーヘッドの高速性を保ったまま、言語仕様（private）で不正代入を物理的にブロックできる】**点にあるのじゃ！',
        }
      ],
      paradigmComparison: {
        title: 'C言語（不透明ポインタ / 構造体） vs C++（クラス＋カプセル化）',
        cApproach: {
          title: 'C言語の正解：不透明ポインタ（Opaque Pointer）による隠蔽',
          code: `// 【Player.h (公開ヘッダ)】
// 構造体の実体を見せず、不完全型として前方宣言
typedef struct Player Player;

Player* Player_Create(int x, int y);
void    Player_MoveLeft(Player* p);
int     Player_GetX(const Player* p);

// 【利用側 main.c】
Player* p = Player_Create(14, 20);
p->x = -9999; // コンパイルエラー！中身が見えないため不正代入不可！`,
          drawbacks: [
            '完全な隠蔽ができるが、必ずポインタ経由（malloc確保）になりがち',
            '構造体のサイズがヘッダで分からないため、スタックに値として置けない',
            '破棄関数（Player_Destroy）を手動で呼び忘れるとメモリリーク'
          ]
        },
        cppApproach: {
          title: 'C++の正解：クラスとアクセス指定子（値のインライン性と完全隠蔽）',
          code: `// 【Player.h】スタック上に直接確保でき、かつ外部からは不可侵！
class Player {
private:
    int m_x; // 外部からはアクセス不可（コンパイルエラー）！
    int m_y;

public:
    Player(int x, int y) : m_x(x), m_y(y) {}
    void moveLeft() {
        if (m_x > 1) m_x--; // 自機自身が境界を守る
    }
    int getX() const { return m_x; }
};

// 【利用側】スタック上に値として置ける（malloc不要・極限の高速性！）
Player player(14, 20);
player.moveLeft();`,
          benefits: [
            'privateメンバへの不正代入をコンパイラが100%遮断',
            'ポインタを使わずスタック上に直接配置可能（動的確保ゼロ・キャッシュ効率MAX）',
            'スコープを抜ければ自動で寿命が尽き、破棄忘れが起きない'
          ]
        },
        paradigmShiftNotes: 'C言語でも不透明ポインタを使えばカプセル化は可能ですが、ポインタ間接参照と動的確保のコストを伴います。C++のクラスは「C言語の構造体と同じゼロコストのメモリ効率」のまま「完全なアクセス制限（private）」を実現する、まさに現場のエンジニアのために生まれた実戦的武器なのです。'
      }
    },
    {
      id: 'sec2-file-split',
      title: '2.2 なぜヘッダ（.h）と実装（.cpp）に分けるのか？外部仕様書の意図',
      leadText: '「ヘッダファイル」は単なるお作法ではありません。C言語の「関数設計書における外部仕様書」そのものです。',
      dialogueBefore: [
        {
          id: 'd2-5',
          speaker: 'penguin',
          emotion: 'question',
          text: '先生、クラスを作るのは分かりましたが、なんで「Player.h」と「Player.cpp」の2つに分けるんですか？1つのファイルの中にクラス宣言も関数の処理も全部書いた方が楽じゃないですか？',
        },
        {
          id: 'd2-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ペンギン君、君がC言語で書いていた「関数設計書」を思い出してみよ。\n設計書には【外部仕様（関数名、引数、戻り値、何ができるか）】と【内部ロジック（アルゴリズムのフローチャート）】があったじゃろ？\nC++において、「.h」はまさにその【外部仕様書（約束）】、「.cpp」は【内部ロジック】なんじゃ！',
        }
      ],
      explanationText: `### ■ ヘッダと実装を分離する3大設計意図

1. **分割コンパイルとビルド時間の大幅短縮**
   - 巨大なゲームプロジェクトでは、全体のビルドに数十分〜数時間かかることがあります。
   - もし1ファイルに全て書いていたら、1文字修正しただけで数時間待ちになります。
   - \`.h\`（仕様）と \`.cpp\`（実装）に分かれていれば、**「変更された .cpp だけ」を数秒で再コンパイル**し、リンカが合体させるだけで済みます。
2. **依存関係の遮断（ブラックボックス化）**
   - 他のファイル（例えば main.cpp）は、\`Player.h\` の取扱説明書を読むだけで自機を操作できます。
   - 自機の内部移動アルゴリズムをいくら高速化・改変しても、\`Player.h\` の関数名が変わらない限り、**main.cpp を再コンパイルする必要すらありません**。
3. **チーム開発における並行作業の実現**
   - 先に \`Player.h\` の仕様（どんな関数を用意するか）さえ決めてコミットすれば、Aさんが \`Player.cpp\` を実装している間に、Bさんはそれを使って \`main.cpp\` を書くことができます。`
    },
    {
      id: 'sec2-classes-detail',
      title: '2.3 用意した3つのクラス：内部変数と公開メソッドの全容',
      variables: [
        {
          name: 'Player::m_x, m_y',
          type: 'private int',
          scope: 'Playerクラス内部（自機）',
          description: '自機の現在座標。private指定により、外部から直接の改ざんを完全にブロック。',
          cComparison: 'C言語の struct Player { int x, y; } のメンバに相当するが、言語レベルでアクセス制限がかけられている。'
        },
        {
          name: 'Player::moveLeft(), moveRight()',
          type: 'public void 関数',
          scope: 'Player公開窓口',
          description: '壁（X=1 や WIDTH-4）を超えないよう境界チェックを行いながら自ら移動する責任を持つ。',
          cComparison: 'C言語の void Player_MoveLeft(Player* p) と異なり、引数渡しが不要（暗黙の this ポインタが自身のメンバを操作）。'
        },
        {
          name: 'Player::shoot(Bullet& bullet)',
          type: 'public void 関数',
          scope: 'Player公開窓口',
          description: '弾の参照を受け取り、まだ撃たれていなければ自機の頭上から発射（spawn）させる。',
          cComparison: 'オブジェクト同士の連携。自機が弾に「飛べ！」とメッセージを送る設計。'
        },
        {
          name: 'Bullet::m_x, m_y, m_active',
          type: 'private int / bool',
          scope: 'Bulletクラス内部（弾）',
          description: '弾の現在座標と飛翔状態。弾自身が管理。',
          cComparison: '第1章のグローバル変数 bulletActive, bulletX, bulletY が Bullet クラスの私有財産としてカプセル化された。'
        },
        {
          name: 'Bullet::update()',
          type: 'public void 関数',
          scope: 'Bullet公開窓口',
          description: '毎フレーム Y-- し、天井（Y < 1）に達したら自ら m_active = false にする。',
          cComparison: 'main関数の中にあった弾の移動・天井消滅ロジックが、弾自身の責任として移譲された。'
        },
        {
          name: 'Invader::m_x, m_y, m_alive',
          type: 'private int / bool',
          scope: 'Invaderクラス内部（敵）',
          description: '敵個体の座標と生存フラグ。',
          cComparison: '第1章の invaderX[6], invaderY[6], invaderAlive[6] という配列の「添字 i」のデータが、1個の独立したオブジェクトに凝縮された。'
        },
        {
          name: 'Invader::move(dx, dy), destroy()',
          type: 'public void 関数',
          scope: 'Invader公開窓口',
          description: '生きている時だけ移動し、弾に当たったら destroy() で死亡状態に遷移する。',
          cComparison: '外部から invader.m_alive = false と書かせるのではなく、destroy() という意図を持った関数を呼ばせる。'
        }
      ]
    },
    {
      id: 'sec2-code',
      title: '2.4 第2章の教材コード：複数ファイル構成プロジェクト一式',
      leadText: 'ヘッダと実装に分割され、カプセル化された実戦的なコードです。タブを切り替えて各ファイルの役割を確認してください。',
      codeFiles: [
        {
          filename: 'Common.h',
          language: 'cpp',
          description: '共通定数の定義（インクルードガード #pragma once 付き）',
          code: `#pragma once

// ゲーム画面のサイズ定義
const int SCREEN_WIDTH = 30;
const int SCREEN_HEIGHT = 15;
`
        },
        {
          filename: 'Bullet.h',
          language: 'cpp',
          description: 'Bulletクラスの外部仕様書（ヘッダ）',
          code: `#pragma once
#include "Common.h"

class Bullet {
private:
    // 【カプセル化】外部からの改ざんを許さない非公開データ
    int m_x;
    int m_y;
    bool m_active;

public:
    Bullet();

    // 弾を発射する
    void spawn(int startX, int startY);

    // 弾を前進させ、画面外で自ら消滅する（責任の自己完結）
    void update();

    // 外部に安全に状態を教えるゲッター関数（const修飾で中身を変えないことを保証）
    bool isActive() const { return m_active; }
    void deactivate() { m_active = false; }
    int getX() const { return m_x; }
    int getY() const { return m_y; }
};
`
        },
        {
          filename: 'Bullet.cpp',
          language: 'cpp',
          description: 'Bulletクラスの内部ロジック実装',
          code: `#include "Bullet.h"

Bullet::Bullet() : m_x(0), m_y(0), m_active(false) {}

void Bullet::spawn(int startX, int startY) {
    m_x = startX;
    m_y = startY;
    m_active = true;
}

void Bullet::update() {
    if (!m_active) return;

    m_y--; // 上方向へ移動
    if (m_y < 1) {
        m_active = false; // 天井に達したら自ら消滅
    }
}
`
        },
        {
          filename: 'Player.h',
          language: 'cpp',
          description: '自機Playerクラスの外部仕様書（ヘッダ）',
          code: `#pragma once
#include "Bullet.h"

class Player {
private:
    int m_x;
    int m_y;

public:
    Player(int startX, int startY);

    void moveLeft();
    void moveRight();
    void shoot(Bullet& bullet);

    int getX() const { return m_x; }
    int getY() const { return m_y; }
};
`,
          lineExplanations: [
            {
              line: 1,
              title: '多重インクルード防止ガード',
              summary: 'このヘッダファイルが複数の .cpp から重複して読み込まれ、型が二重定義エラーを起こすのを防ぐコンパイラ指示文です。',
              tokens: [
                { token: '#pragma', explanation: 'コンパイラへの直接の特別指令記号' },
                { token: 'once', explanation: '「1回のビルドで1度だけ読み込め」という標準的指示' }
              ],
              pitfall: 'これを書かないと、複数のソースからインクルードされた際に「クラスの再定義エラー」となりビルドが失敗します。'
            },
            {
              line: 5,
              title: 'カプセル化（データ隠蔽境界）',
              summary: 'これより下に書かれた変数や関数は、クラスの外部（main関数など）から直接触ることが一切できなくなります。',
              tokens: [
                { token: 'private', explanation: 'アクセス指定子。クラス内部のメンバ関数からしかアクセスできない私有領域' },
                { token: ':', explanation: 'ここから非公開スコープが始まる区切り' }
              ],
              pitfall: 'もし公開（public）のままにしておくと、不注意なコードが player.m_x = -999; と画面外へワープさせてしまい、バグ調査で全コードを捜索する羽目になります。'
            },
            {
              line: 10,
              title: 'コンストラクタ宣言（生成時の初期状態を強制）',
              summary: 'Playerオブジェクトが生み出される瞬間に自動実行される特殊関数。初期座標（startX, startY）を受け取ることを義務付けます。',
              tokens: [
                { token: 'Player', explanation: '戻り値のない、クラス名と同名の特殊関数（コンストラクタ）' },
                { token: '(int startX, int startY)', explanation: '生成時に外部から渡されなければならない必須の初期パラメータ' }
              ],
              pitfall: '初期化関数を用意せずに放置すると、変数が不定値（メモリのゴミデータ）のまま動いてしまい、起動直後にクラッシュする原因になります。'
            },
            {
              line: 14,
              title: 'オブジェクト間協調（参照渡しによる直接操作）',
              summary: '弾（Bullet）の実体への参照を受け取り、自機の頭上から発射させます。弾のデータを無駄にコピーせず、元の実体を直接書き換えます。',
              tokens: [
                { token: 'Bullet&', explanation: '型名の後ろの & は「参照（エイリアス）」。巨大な実体をコピーせず呼び出し元の実体を直接指す' },
                { token: 'bullet', explanation: '操作対象となる弾オブジェクトの引数名' }
              ],
              pitfall: '& を付け忘れて値渡し（Bullet bullet）にすると、弾のコピーが作られて元の弾は発射されないという典型的なバグが発生します。'
            },
            {
              line: 16,
              title: 'const メンバ関数（読み取り専用ゲッター）',
              summary: 'private に隠された座標を外部が安全に知るための窓口。末尾の const は「この関数は内部変数を絶対に書き換えない」というコンパイラへの誓約です。',
              tokens: [
                { token: 'int getX()', explanation: 'X座標の数値を外部へ返す関数' },
                { token: 'const', explanation: '自身のメンバ変数を変更しないことを保証する修飾子' }
              ],
              pitfall: 'const を付け忘れると、const Player& など読み取り専用参照で受け取った関数の中で getX() が呼べなくなり、コンパイルエラーの原因になります。'
            }
          ]
        },
        {
          filename: 'Player.cpp',
          language: 'cpp',
          description: 'Playerクラスの実装（自律的な境界防衛）',
          code: `#include "Player.h"
#include "Common.h"

Player::Player(int startX, int startY) : m_x(startX), m_y(startY) {}

void Player::moveLeft() {
    // 境界チェックは自機クラスの責任！
    if (m_x > 1) {
        m_x--;
    }
}

void Player::moveRight() {
    // 壁の手前で自律的にストップ
    if (m_x < SCREEN_WIDTH - 4) {
        m_x++;
    }
}

void Player::shoot(Bullet& bullet) {
    // 弾オブジェクトに「発射せよ」とメッセージを送る
    if (!bullet.isActive()) {
        bullet.spawn(m_x + 1, m_y - 1);
    }
}
`,
          lineExplanations: [
            {
              line: 4,
              title: 'メンバ初期化子リスト（直接初期化の原則）',
              summary: '関数の本体 {} が始まる前に、メンバ変数を初期化するC++特有の強力な記法。代入ではなく直接初期化が行われます。',
              tokens: [
                { token: 'Player::', explanation: 'スコープ解決演算子。「Playerクラスに属する」ことを明示' },
                { token: ': m_x(startX), m_y(startY)', explanation: 'メンバ初期化子リスト。コロンの後に各変数の初期値を括弧で指定' },
                { token: '{}', explanation: '初期化完了後の追加処理。何もしなければ空のままでOK' }
              ],
              pitfall: '{ m_x = startX; } と代入で書くと、一度デフォルト構築された後に代入される2度手間になり、constメンバや参照型メンバは初期化できずコンパイルエラーになります。'
            },
            {
              line: 6,
              title: 'メンバ関数の定義（自律行動の実装）',
              summary: 'Playerクラスが自ら左へ移動する振る舞い。Player:: を冠することで、どのクラスのメソッドかを指定します。',
              tokens: [
                { token: 'void', explanation: '戻り値がないことを示す型' },
                { token: 'Player::moveLeft()', explanation: 'Playerクラスの moveLeft 関数本体の実装' }
              ]
            },
            {
              line: 8,
              title: '自律的な境界防衛（責任の自己完結）',
              summary: '自機自身が「画面の左端（壁）より内側にいるか」をチェックしてから座標を減らします。',
              tokens: [
                { token: 'if (m_x > 1)', explanation: '左壁（X=1）の内側か判定' },
                { token: 'm_x--;', explanation: '条件を満たす時だけ安全に左へ1マス前進' }
              ],
              pitfall: 'この判定をmain関数側で行うと、自機を動かすたびにプログラマが境界判定を書くことになり、書き忘れで壁突き抜けバグが再発します。'
            },
            {
              line: 20,
              title: 'オブジェクト間の協調（Tell, Don\'t Ask 原則）',
              summary: '自機が弾オブジェクトに対し「spawnせよ」とメッセージを送信。弾の状態を外から詮索せず、弾自身に発射させます。',
              tokens: [
                { token: 'void Player::shoot(...)', explanation: '弾を発射するメソッド' },
                { token: 'bullet.spawn(...)', explanation: '受け取った弾実体に対して直接発射命令を指示' }
              ]
            }
          ]
        },
        {
          filename: 'Invader.h',
          language: 'cpp',
          description: '敵Invaderクラスの外部仕様書',
          code: `#pragma once

class Invader {
private:
    int m_x;
    int m_y;
    bool m_alive;

public:
    Invader(int x, int y);

    void move(int dx, int dy);
    void destroy();

    int getX() const { return m_x; }
    int getY() const { return m_y; }
    bool isAlive() const { return m_alive; }
};
`
        },
        {
          filename: 'Invader.cpp',
          language: 'cpp',
          description: 'Invaderクラスの実装',
          code: `#include "Invader.h"

Invader::Invader(int x, int y) : m_x(x), m_y(y), m_alive(true) {}

void Invader::move(int dx, int dy) {
    if (!m_alive) return;
    m_x += dx;
    m_y += dy;
}

void Invader::destroy() {
    m_alive = false;
}
`
        },
        {
          filename: 'main.cpp',
          language: 'cpp',
          isMain: true,
          description: 'グローバル変数が一掃され、オブジェクトへの命令に徹したmain.cpp',
          code: `#include <iostream>
#include <windows.h>
#include <conio.h>

#include "Common.h"
#include "Player.h"
#include "Invader.h"
#include "Bullet.h"

void setCursorPosition(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

int main() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    // =========================================================
    // 【オブジェクトの実体化】グローバル変数は完全ゼロ！
    // =========================================================
    Player player(SCREEN_WIDTH / 2 - 1, SCREEN_HEIGHT - 2);
    Bullet bullet;

    const int INVADER_COUNT = 6;
    Invader invaders[INVADER_COUNT] = {
        Invader(4, 2),  Invader(8, 2),  Invader(12, 2),
        Invader(16, 2), Invader(20, 2), Invader(24, 2)
    };

    int invaderDir = 1;
    int moveTimer = 0;
    int score = 0;
    bool isRunning = true;
    bool gameClear = false;

    while (isRunning) {
        // --- 1. 入力受付：オブジェクトにメッセージを送るだけ ---
        if (_kbhit()) {
            char key = _getch();
            if (key == 'a' || key == 'A') player.moveLeft();
            if (key == 'd' || key == 'D') player.moveRight();
            if (key == ' ')               player.shoot(bullet);
            if (key == 'q' || key == 'Q') isRunning = false;
        }

        // --- 2. 弾の自律更新 ---
        bullet.update();

        // --- 3. 敵の移動 ---
        moveTimer++;
        if (moveTimer >= 5) {
            moveTimer = 0;
            bool hitWall = false;
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (!invaders[i].isAlive()) continue;
                if ((invaderDir == 1 && invaders[i].getX() >= SCREEN_WIDTH - 2) ||
                    (invaderDir == -1 && invaders[i].getX() <= 1)) {
                    hitWall = true;
                    break;
                }
            }

            if (hitWall) {
                invaderDir = -invaderDir;
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaders[i].move(0, 1);
                    if (invaders[i].isAlive() && invaders[i].getY() >= player.getY()) {
                        isRunning = false;
                    }
                }
            } else {
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaders[i].move(invaderDir, 0);
                }
            }
        }

        // --- 4. 当たり判定（安全なゲッターで問い合わせ） ---
        if (bullet.isActive()) {
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (invaders[i].isAlive() &&
                    bullet.getX() == invaders[i].getX() &&
                    bullet.getY() == invaders[i].getY()) {
                    invaders[i].destroy();
                    bullet.deactivate();
                    score += 100;
                    break;
                }
            }
        }

        // クリア判定
        bool hasAliveInvader = false;
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaders[i].isAlive()) { hasAliveInvader = true; break; }
        }
        if (!hasAliveInvader) {
            gameClear = true;
            break;
        }

        // --- 5. 描画処理 ---
        char buffer[SCREEN_HEIGHT][SCREEN_WIDTH];
        for (int y = 0; y < SCREEN_HEIGHT; y++) {
            for (int x = 0; x < SCREEN_WIDTH; x++) {
                buffer[y][x] = (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) ? '#' : ' ';
            }
        }

        // 各オブジェクトから現在位置を問い合わせて描画
        buffer[player.getY()][player.getX()] = '_';
        buffer[player.getY()][player.getX() + 1] = 'A';
        buffer[player.getY()][player.getX() + 2] = '_';

        if (bullet.isActive() && bullet.getY() > 0 && bullet.getY() < SCREEN_HEIGHT - 1) {
            buffer[bullet.getY()][bullet.getX()] = '|';
        }

        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaders[i].isAlive()) {
                buffer[invaders[i].getY()][invaders[i].getX()] = 'V';
            }
        }

        setCursorPosition(0, 0);
        for (int y = 0; y < SCREEN_HEIGHT; y++) {
            for (int x = 0; x < SCREEN_WIDTH; x++) {
                std::cout << buffer[y][x];
            }
            std::cout << "\\n";
        }
        std::cout << "SCORE: " << score << "  [第2章: クラス設計版]    \\n";

        Sleep(33);
    }

    setCursorPosition(0, SCREEN_HEIGHT + 1);
    std::cout << (gameClear ? "=== VICTORY! GAME CLEAR! ===\\n" : "=== GAME OVER ===\\n");
    return 0;
}`
        }
      ]
    },
    {
      id: 'sec2-encapsulation-intent',
      title: '2.5 カプセル化の真意：バグの局所化と防衛的プログラミング',
      diagramType: 'class_encapsulation',
      dialogueBefore: [
        {
          id: 'd2-7',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'うわぁ……！main.cpp を見ると、「player.moveLeft()」「player.shoot(bullet)」「bullet.update()」って、まるで英語の命令文を並べているみたいで、何をしているのか一瞬で頭に入ってきます！',
        },
        {
          id: 'd2-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そうじゃ！main関数は「各オブジェクトに仕事を割り振る指揮官」に専念しておる。\n自機の座標計算ロジックはPlayerの中、弾のロジックはBulletの中に閉じ込められておるから、もし「自機が壁を突き抜けるバグ」が出たら、見るべきは Player.cpp のたった10行だけじゃ！何百行ものmain関数を疑う必要は金輪際ないのじゃ！',
        }
      ],
      takeaways: [
        {
          title: 'カプセル化の真の目的＝バグの局所化',
          description: 'データと処理を1つのクラスに閉じ込めることで、不具合が起きた際の調査対象がクラス内部だけに限定され、デバッグ時間が激減します。'
        },
        {
          title: 'ヘッダファイルは外部仕様書（約束）',
          description: '他人が作ったクラスを使うときは、.cppの中身を読む必要はありません。.hに書かれたpublic関数（外部仕様）だけを見れば安全に使えます。'
        },
        {
          title: 'メッセージ送信による協調動作',
          description: '手続き型のように外から直接数値を書き換えるのではなく、「動け」「撃て」というメッセージ（関数呼び出し）を送ることで、オブジェクト同士が協調して動作します。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q2-1',
      question: 'C言語の「構造体を引数で渡す関数設計」に対して、C++の「クラス（カプセル化）」が持つ最大の技術的優位性はどれでしょう？',
      options: [
        '構造体よりもクラスの方がメモリ使用量が半分になること',
        'メンバ変数を private に隠蔽することで、外部コードからの不正な直接代入をコンパイラレベルで完全に防止し、バグの発生領域をクラス内に局所化できること',
        'C言語のポインタ演算が使えなくなること',
        '関数名にアンダースコア（_）を使わなくて済むこと'
      ],
      correctIndex: 1,
      explanation: '正解です！C言語の構造体は誰でも直接値を書き換えられるため、不正な状態になったときの原因追跡が困難です。C++のクラスは private によるアクセス制御により、クラスの設計者が意図した安全な操作（publicメソッド）以外をコンパイル時に完全に排除できます。'
    }
  ]
};
