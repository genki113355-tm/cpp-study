import { Chapter } from '../../types/curriculum';

export const chapter4: Chapter = {
  id: 4,
  slug: 'chapter-4-inheritance-and-polymorphism',
  courseTrack: 'classic',
  courseChapterCode: 'C4',
  title: 'レガシー第4章：継承とポリモーフィズム（敵のバリエーションと多態性）',
  subtitle: 'switch文の分岐地獄を打破する、オブジェクト指向最大の武器',
  badge: 'レガシーC++ C4：継承とポリモーフィズム',
  description: '通常インベーダーに加え、2回被弾が必要な装甲シールド敵（S）や、上空を高速横切るボーナスUFO（U）が登場！C言語の「巨大なswitch-case」による構造化設計の限界と破綻を暴き、C++の抽象基底クラス・純粋仮想関数・仮想関数テーブル（vtable）の驚異的な拡張性を徹底解説します。',
  gameVersion: 'v4_polymorphism',
  prevChapterSlug: 'chapter-3-dynamic-lifecycle',
  nextChapterSlug: 'chapter-6-design-patterns',
  umlDiagram: {
    diagramType: 'class',
    title: '第4章プログラムのUMLクラス設計書（ポリモーフィズム）',
    subtitle: '抽象基底クラス Enemy と 3大派生敵（Normal / Shield / UFO）の汎化構造',
    description: 'switch(enemy.type) 分岐を完全撲滅したオブジェクト指向の真骨頂。抽象基底クラス Enemy を頂点とし、白三角矢印（◁───）で結ばれた3つの派生クラスが多態的に振る舞う設計書です。',
    classes: [
      {
        name: 'Game',
        attributes: [
          { name: 'm_enemies', type: 'std::vector<Enemy*>', visibility: '-', codeLineRef: { filename: 'Game.h', line: 13 } },
        ],
        operations: [
          { name: 'update()', type: 'void', visibility: '+', codeLineRef: { filename: 'Game.cpp', line: 15 } },
          { name: 'draw()', type: 'void', visibility: '+', codeLineRef: { filename: 'Game.cpp', line: 55 } },
          { name: '~Game()', type: 'void', visibility: '+', codeLineRef: { filename: 'Game.cpp', line: 8 } },
        ],
      },
      {
        name: 'Enemy',
        isAbstract: true,
        stereotype: 'abstract',
        attributes: [
          { name: 'm_x', type: 'int', visibility: '#', codeLineRef: { filename: 'Enemy.h', line: 6 } },
          { name: 'm_y', type: 'int', visibility: '#', codeLineRef: { filename: 'Enemy.h', line: 7 } },
          { name: 'm_alive', type: 'bool', visibility: '#', codeLineRef: { filename: 'Enemy.h', line: 9 } },
        ],
        operations: [
          { name: '~Enemy()', type: 'void', visibility: '+', isVirtual: true, codeLineRef: { filename: 'Enemy.h', line: 17 } },
          { name: 'update()', type: 'void', visibility: '+', isVirtual: true, codeLineRef: { filename: 'Enemy.h', line: 21 } },
          { name: 'draw(buf: ScreenBuffer&)', type: 'void', visibility: '+', isVirtual: true, codeLineRef: { filename: 'Enemy.h', line: 22 } },
          { name: 'getScore() const', type: 'int', visibility: '+', isVirtual: true, codeLineRef: { filename: 'Enemy.h', line: 23 } },
        ],
      },
      {
        name: 'NormalEnemy',
        attributes: [],
        operations: [
          { name: 'update()', type: 'void', visibility: '+', codeLineRef: { filename: 'NormalEnemy.h', line: 9 } },
          { name: 'draw(buf: ScreenBuffer&)', type: 'void', visibility: '+', codeLineRef: { filename: 'NormalEnemy.h', line: 18 } },
          { name: 'getScore() const', type: 'int', visibility: '+', codeLineRef: { filename: 'NormalEnemy.h', line: 22 } },
        ],
      },
      {
        name: 'ShieldEnemy',
        attributes: [
          { name: 'm_shieldHp', type: 'int', visibility: '-', codeLineRef: { filename: 'ShieldEnemy.h', line: 7 } },
        ],
        operations: [
          { name: 'update()', type: 'void', visibility: '+', codeLineRef: { filename: 'ShieldEnemy.h', line: 9 } },
          { name: 'draw(buf: ScreenBuffer&)', type: 'void', visibility: '+', codeLineRef: { filename: 'ShieldEnemy.h', line: 19 } },
          { name: 'getScore() const', type: 'int', visibility: '+', codeLineRef: { filename: 'ShieldEnemy.h', line: 23 } },
        ],
      },
      {
        name: 'UfoEnemy',
        attributes: [
          { name: 'm_speed', type: 'int', visibility: '-', codeLineRef: { filename: 'UfoEnemy.h', line: 9 } },
        ],
        operations: [
          { name: 'update()', type: 'void', visibility: '+', codeLineRef: { filename: 'UfoEnemy.h', line: 16 } },
          { name: 'draw(buf: ScreenBuffer&)', type: 'void', visibility: '+', codeLineRef: { filename: 'UfoEnemy.h', line: 24 } },
          { name: 'getScore() const', type: 'int', visibility: '+', codeLineRef: { filename: 'UfoEnemy.h', line: 28 } },
        ],
      },
    ],
    relations: [
      {
        from: 'Game',
        to: 'Enemy',
        type: 'composition',
        multiplicityFrom: '1',
        multiplicityTo: '*',
        label: 'ポリモーフィック所有',
        cppMapping: 'std::vector<Enemy*> m_enemies; // 基底ポインタの動的配列',
      },
      {
        from: 'NormalEnemy',
        to: 'Enemy',
        type: 'generalization',
        label: '継承',
        cppMapping: 'class NormalEnemy : public Enemy',
      },
      {
        from: 'ShieldEnemy',
        to: 'Enemy',
        type: 'generalization',
        label: '継承',
        cppMapping: 'class ShieldEnemy : public Enemy',
      },
      {
        from: 'UfoEnemy',
        to: 'Enemy',
        type: 'generalization',
        label: '継承',
        cppMapping: 'class UfoEnemy : public Enemy',
      },
    ],
    codeMappingNotes: [
      '【白三角矢印（◁─── 汎化・継承）の実装】: class NormalEnemy : public Enemy という構文に対応します。派生クラスは基底クラスの型として振る舞うことができます。',
      '【イタリック体・abstract の実装】: Enemy は純粋仮想関数（virtual void update() = 0;）を持つため、設計書上でも斜体（abstract）として定義され、直接 new Enemy() することはコンパイラに禁止されます。',
      '【# 記号（protected）の実装】: 座標変数（m_x, m_y）は protected（#）に設定され、外部からの改ざんは防ぎつつ派生クラス（NormalEnemyなど）の中からは自由に計算できるよう設計されています。',
      '【仮想デストラクタの掟】: virtual ~Enemy() {} が定義されているため、Game が delete m_enemies[i]; した際に派生クラスのデストラクタが正しく呼び出されます。',
    ],
  },
  sections: [
    {
      id: 'sec4-switch-hell-vs-polymorphism',
      title: '4.1 多態性の設計対比：あえてswitchを選ぶ理由と、vtableによる拡張性',
      leadText: 'ゲームに新しい敵キャラクターを追加するとき、C言語プログラマはどう書くでしょうか？ enum で敵種別を定義し、switch-case 文で分岐させるのが典型です。実はこの手法、組込み現場では「極めて合理的な正解」として選ばれることもあります。それぞれの設計の必然性を解き明かします。',
      dialogueBefore: [
        {
          id: 'd4-1',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'シロクマ指導官！第3章で弾が当たった時の火花パーティクルが完成して、ゲームが凄く派手になりました！\nでも、敵が全部同じインベーダー（V）だけでちょっと単調です……！2回撃たないと壊れない頑丈な装甲敵とか、上空を猛スピードで横切るボーナスUFOとか、敵のバリエーションを増やしたいです！',
        },
        {
          id: 'd4-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！ゲームの奥深さは敵のバリエーションで決まる。ではピピン通信士よ、C言語なら新しい敵を追加するとき、プログラムをどう設計するかの？',
        },
        {
          id: 'd4-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'えーと……`enum EnemyType { TYPE_NORMAL, TYPE_SHIELD, TYPE_UFO };` って定義して、敵の構造体に `type` を持たせます！\nそして移動処理関数の中で `switch(enemy->type)` して、描画関数の中でも `switch(enemy->type)` して、当たり判定の中でも `switch(enemy->type)` して分岐させます！',
          sideNote: '胸を張ってC言語の定石を答えるペンギン生徒'
        },
        {
          id: 'd4-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'ほう！実はな、組込み機器や極限のゲームエンジンにおいて、その `switch(enemy->type)` は**【あえて推奨されるレガシーの正解】**となる場合もあるのじゃ！\nなぜなら、仮想関数（vtable）を使うとインスタンス毎に4〜8バイトのポインタ（vptr）を消費し、関数ポインタの間接呼び出しでCPUキャッシュミス（Instruction Cache Miss）を誘発するからじゃ。switchならコンパイラが連続ジャンプテーブルに最適化できるしの。',
        },
        {
          id: 'd4-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'えっ！？switch文って悪者じゃないんですか！？じゃあ僕の設計で大正解じゃないですか！',
        },
        {
          id: 'd4-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '早合点するな！罪深いのはswitch文そのものではなく、**【同じ switch 分岐があちこちのファイル・関数に散らばること（多重散乱）】**なんじゃ！\n移動、描画、当たり判定、被弾処理、スコア加算……10箇所に `switch(enemy->type)` が散乱したら、新しい敵を1体足すたびに10箇所すべてに `case TYPE_BOSS:` を書き足して回る羽目になる。1箇所でも忘れたらバグじゃ！\nそこで、C言語のままでも使える【関数ポインタテーブル】や、C++03の【抽象基底クラスとポリモーフィズム】という武器が必要になるのじゃ！',
        }
      ],
      paradigmComparison: {
        title: '多種多様な振る舞いの設計対比：switch(type)分岐 vs ポリモーフィズム',
        cApproach: {
          title: 'アンチパターン：switch(type)の多重散乱（新種追加で全壊）',
          code: `// C言語での敵種別による分岐
typedef enum { TYPE_NORMAL, TYPE_SHIELD, TYPE_UFO } EnemyType;

void updateEnemy(Enemy* e) {
    switch (e->type) {
        case TYPE_NORMAL:
            e->x += e->dir; // 左右往復
            break;
        case TYPE_SHIELD:
            e->x += e->dir * 0.5f; // 低速移動
            break;
        case TYPE_UFO:
            e->x += 2; // 高速直進
            break;
        // 現場の罠：新しい敵を追加するたび、
        // drawEnemy(), hitEnemy(), dropItem() など
        // プロジェクト中の全 switch 文を修正して回る地獄！
    }
}`,
          drawbacks: [
            'switch自体ではなく、移動・描画・当たり判定など10箇所に散乱することが破綻の原因',
            '新敵追加のたびに無数の既存関数を修正する必要があり、case書き忘れバグを誘発',
            '【補足：レガシーの正解】switchを使う場合は1箇所に局所化するか、C言語でも関数ポインタ構造体（Linuxのfile_operations方式）を使うのが定石'
          ]
        },
        cppApproach: {
          title: 'レガシーOOPの正解：抽象基底クラス ＋ 純粋仮想関数（ポリモーフィズム）',
          code: `// 共通インターフェース（抽象基底クラス）
class Enemy {
public:
    virtual ~Enemy() {}
    virtual void update() = 0; // 純粋仮想関数
    virtual char getGlyph() const = 0;
};

// 派生クラス（各敵が自分の責務をカプセル化）
class NormalEnemy : public Enemy { void update(); };
class ShieldEnemy : public Enemy { void update(); };
class UfoEnemy    : public Enemy { void update(); };

// 【メインループ側の洗練】
// 敵の種類を一切気にせず、1行で全種類の敵を更新！
for (size_t i = 0; i < enemies.size(); ++i) {
    enemies[i]->update(); // 実行時に正しい関数の実体が勝手に呼ばれる！
}`,
          benefits: [
            'メインループのコードを1行も書き換えずに、新しい敵クラスを自由に追加可能（OCP原則）',
            '各敵の挙動がそれぞれのクラス内に完全に閉じ込められ、影響範囲が局所化する',
            '基底クラスでインターフェースを強制するため、実装漏れがあればコンパイル時に検知'
          ]
        },
        paradigmShiftNotes: '組込みや極限ループでメモリとキャッシュ効率を最優先する場合は「局所化されたswitch」や「関数ポインタテーブル（C言語の正解）」が選ばれます。一方で、敵や武器の種類が頻繁に増えるゲームでは、このC++仮想関数によるポリモーフィズムが圧倒的な拡張性を発揮します。なお現代C++17では、vtableの間接参照コストを嫌って「std::variant + std::visit」というモダンな別解（参考資料）も登場しています。'
      }
    },
    {
      id: 'sec4-vtable-and-destructor',
      title: '4.2 仮想関数テーブル（vtable）のメモリ構造と仮想デストラクタの絶対原則',
      leadText: '「`virtual` を付けると、なぜ実行時に正しい関数が呼ばれるのか？」「なぜ基底クラスのデストラクタは `virtual` にしなければならないのか？」——C++プログラマが直面する最大の疑問を、メモリ（vtable / vptr）の内部構造から完全に解き明かします。',
      memoryMap: {
        title: '仮想関数テーブル（vtable）と暗黙のポインタ（__vptr）のメモリマップ',
        description: 'Enemyポインタの配列が、ヒープ上の各派生クラスインスタンスを指しています。各インスタンスの先頭には、コンパイラが自動生成した仮想関数テーブルへのポインタ（__vptr）が埋め込まれています。',
        asciiArt: `[ STACK: スタック領域 ]                            [ HEAP: ヒープ領域 (動的インスタンス) ]
+------------------------------------+
| std::vector<Enemy*> enemies        |
|  +-- enemies[0] (Enemy*) ----------+----------> +------------------------------------+
|  +-- enemies[1] (Enemy*) ------+   |            | NormalEnemy (Heap: 0x10A0)         |
|  +-- enemies[2] (Enemy*) --+   |   |            |  +-- void* __vptr ---------------+ |
+----------------------------+---+---+            |  +-- int m_x, m_y, m_hp          | |
                             |   |                +----------------------------------+-+
                             |   |                                                   |
                             |   +--------------> +------------------------------------+
                             |                    | ShieldEnemy (Heap: 0x10F0)         |
                             |                    |  +-- void* __vptr ---------------+ |
                             |                    |  +-- int m_x, m_y, m_shield      | |
                             |                    +----------------------------------+-+
                             |                                                       |
                             +------------------> +------------------------------------+
                                                  | UfoEnemy (Heap: 0x1140)            |
                                                  |  +-- void* __vptr ---------------+ |
                                                  |  +-- int m_x, m_y, m_bonus       | |
                                                  +----------------------------------+-+
                                                                                     |
[ STATIC: 静的データ領域 (仮想関数テーブル群) ]                                       |
+-------------------------------------------------------------+                      |
| vtable_NormalEnemy : [ 0: ~NormalEnemy(), 1: update() ]     | <--------------------+
| vtable_ShieldEnemy : [ 0: ~ShieldEnemy(), 1: update() ]     | <--------------------+
| vtable_UfoEnemy    : [ 0: ~UfoEnemy(),    1: update() ]     | <--------------------+
+-------------------------------------------------------------+`,
        stackItems: [
          {
            address: '0x7FFF0100',
            variable: 'enemies[0]',
            value: '0x10A0 (Enemy*)',
            notes: '型は Enemy* だが、実体は NormalEnemy を指す'
          },
          {
            address: '0x7FFF0108',
            variable: 'enemies[1]',
            value: '0x10F0 (Enemy*)',
            notes: '型は Enemy* だが、実体は ShieldEnemy を指す'
          },
          {
            address: '0x7FFF0110',
            variable: 'enemies[2]',
            value: '0x1140 (Enemy*)',
            notes: '型は Enemy* だが、実体は UfoEnemy を指す'
          }
        ],
        heapItems: [
          {
            address: '0x10A0',
            object: 'NormalEnemy',
            state: '生存 (HP: 1)',
            lifecycle: '__vptr 経由で vtable_NormalEnemy::update() を呼び出し'
          },
          {
            address: '0x10F0',
            object: 'ShieldEnemy',
            state: '装甲残存 (HP: 2)',
            lifecycle: '__vptr 経由で vtable_ShieldEnemy::update() を呼び出し'
          },
          {
            address: '0x1140',
            object: 'UfoEnemy',
            state: '高速飛行中',
            lifecycle: '__vptr 経由で vtable_UfoEnemy::update() を呼び出し'
          }
        ],
        lifecycleExplanation: 'プログラム実行時、`enemy->update()` が呼ばれると、CPUはインスタンス先頭の `__vptr` を参照し、対応する `vtable` の関数アドレスを取り出してジャンプします。これが「動的ディスパッチ（実行時多態性）」の物理的な仕組みです。わずか数ナノ秒のテーブル参照オーバーヘッドで、圧倒的な設計の柔軟性を獲得できます。'
      },
      diagramType: 'inheritance_vtable',
      explanationText: `### ■ なぜ仮想デストラクタ（virtual ~Enemy）が絶対に必須なのか？

C++でクラスの継承を扱う際、最も重篤なメモリリークを引き起こす初心者の罠が「**仮想デストラクタの付け忘れ**」です。

#### 1. 悲劇のコード（基底のデストラクタが非仮想の場合）
\`\`\`cpp
class Enemy {
public:
    ~Enemy() { /* virtual が付いていない！ */ }
};

class ShieldEnemy : public Enemy {
private:
    int* m_shieldData; // 動的確保したリソース
public:
    ShieldEnemy() { m_shieldData = new int[100]; }
    ~ShieldEnemy() { delete[] m_shieldData; } // 解放処理
};

// メイン処理
Enemy* e = new ShieldEnemy();
delete e; // 💥 大惨事発生！
\`\`\`

#### 2. なぜ大惨事になるのか？
\`delete e;\` を実行した際、コンパイラはポインタの静的な型（\`Enemy*\`）しか見ていません。
デストラクタに \`virtual\` が付いていないと、コンパイラは「Enemyのデストラクタ」だけを静的に呼び出し、**\`ShieldEnemy\` のデストラクタを完全に無視してメモリを解放します**。
その結果、\`ShieldEnemy\` 内部で確保した \`m_shieldData\` のメモリは永遠に解放されず、プログラムは確実にメモリリークで死にます！

#### 3. 解決策：基底クラスには必ず virtual を付ける！
\`\`\`cpp
class Enemy {
public:
    virtual ~Enemy() {} // これ1行で完全解決！
};
\`\`\`
デストラクタを \`virtual\` にすると、vtable経由で **派生クラスのデストラクタ（\`~ShieldEnemy\`）が最初に呼ばれ、その後に基底クラスのデストラクタ（\`~Enemy\`）が安全に逆順で呼ばれる** ようになります。`
    },
    {
      id: 'sec4-class-implementation',
      title: '4.3 実装解説：BaseEnemyから広がる通常敵・シールド敵・UFOのクラス設計',
      leadText: '実際に第4章のインベーダーゲームを動かしているC++（クラシックOOP）コードの全貌を公開します。1つの基底クラスから、いかにして多彩な敵キャラクターが生み出されるかを確認してください。',
      variables: [
        {
          name: 'Enemy (抽象基底クラス)',
          type: 'class (interface)',
          scope: '基底クラス',
          description: 'すべての敵キャラクターの共通の型。純粋仮想関数 update() = 0, getGlyph() = 0 を持ち、単体ではインスタンス化できない抽象クラス。',
          cComparison: 'C言語における汎用関数ポインタ構造体（struct EnemyInterface）に相当するが、コンパイラによる型安全性が100%保証される。'
        },
        {
          name: 'NormalEnemy',
          type: 'class : public Enemy',
          scope: '派生クラス',
          description: '通常インベーダー。左右に往復しながら下へと進軍する。HPは1、グリフは \'V\'、撃破スコアは100点。',
          cComparison: 'C言語の switch-case 内で記述されていた基本インベーダーの移動ルーチンを独立したクラスとして分離。'
        },
        {
          name: 'ShieldEnemy',
          type: 'class : public Enemy',
          scope: '派生クラス',
          description: '重装甲シールド敵。HPは2。1回目の被弾では外装が破損して小文字の \'s\' に変化し、2回目の被弾で完全撃破される。スコア200点。',
          cComparison: 'C言語なら「if (enemy->type == SHIELD && enemy->hp > 1)」と当たり判定関数側に分岐が増殖していたが、C++なら自身の hit() と getGlyph() の中で完結。'
        },
        {
          name: 'UfoEnemy',
          type: 'class : public Enemy',
          scope: '派生クラス',
          description: 'ボーナスUFO。編隊移動（左右往復）を無視し、最上段を高速で直進して画面外へ去る。撃破スコア500点。',
          cComparison: 'C言語では特殊な敵の動きはメインループの例外処理として書かれがちだったが、update() をオーバーライドするだけで完全に同一の枠組みで管理可能。'
        },
        {
          name: 'std::vector<Enemy*> m_enemies',
          type: 'std::vector<Enemy*>',
          scope: 'Game クラス メンバ',
          description: 'ポリモーフィズムの真価を発揮するコンテナ。通常敵・シールド敵・UFOすべてを「Enemy*」として1つの配列で一括管理。デストラクタで一括 delete 解放。',
          cComparison: 'C言語の Enemy* 配列では要素ごとに異なる型の実体を保持して安全に free() するのが極めて困難だった。'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'UFOのスポーン判定（定期出現）',
          codeSnippet: 'm_enemies.push_back(new UfoEnemy(1, 1));',
          description: 'タイマーカウンターに基づき、画面上にUFOが存在しない場合に限り、最上段に UfoEnemy インスタンスを動的生成してコンテナに追加。',
          impact: 'ボーナス敵が画面上を通過し、プレイヤーの狙いと緊張感が向上',
          designIntent: '特殊な敵であっても、通常敵と同じ m_enemies ベクターに push_back するだけで、以降の更新・描画ループに自動参加できる。'
        },
        {
          stepNumber: 2,
          title: '多態的移動更新（Polymorphic Update）',
          codeSnippet: 'for (size_t i = 0; i < m_enemies.size(); ++i) m_enemies[i]->update(dir, hitWall);',
          description: '基底クラスポインタ経由で update() を呼ぶ。NormalEnemyとShieldEnemyは編隊移動を行い、UfoEnemyは独自の高速直進を行う。',
          impact: 'すべての敵がそれぞれの個性に従って自律的に移動',
          designIntent: 'Gameクラスは敵が何種類いるか、どう動くかを一切知る必要がない（完全な関心の分離）。'
        },
        {
          stepNumber: 3,
          title: '多態的当たり判定とダメージ処理',
          codeSnippet: 'e->hit(); // 耐久減算 or 撃破',
          description: '弾が接触した際、e->hit() を呼び出す。ShieldEnemyなら耐久が2から1に減って耐え、通常敵やUFOなら一撃で撃破される。',
          impact: '敵の装甲に応じた多段ヒット演出とスコア加算',
          designIntent: '「被弾した時にどう振る舞うか」の判断を敵自身に任せることで、メイン処理の肥大化を防止。'
        },
        {
          stepNumber: 4,
          title: '多態的描画（Polymorphic Rendering）',
          codeSnippet: 'screen[e->getY()][e->getX()] = e->getGlyph();',
          description: 'e->getGlyph() を呼び出して画面バッファに書き込む。ShieldEnemyはHPに応じて \'S\' または \'s\' を返し、UfoEnemyは \'U\' を返す。',
          impact: '敵の状態や種類に応じた文字がコンソール画面に描画される',
          designIntent: '描画コードも1行。将来「ボス敵 \'B\'」が追加されても描画コードの修正は不要。'
        }
      ],
      codeFiles: [
        {
          filename: 'Enemy.h',
          language: 'cpp',
          description: '抽象基底クラス Enemy。純粋仮想関数と仮想デストラクタを定義。',
          code: `#pragma once

// 【第4章：抽象基底クラス Enemy】
// ポリモーフィズム（多態性）の根幹となるインターフェース定義
class Enemy {
protected:
    int m_x;
    int m_y;
    int m_hp;
    bool m_alive;

public:
    Enemy(int x, int y, int hp = 1)
        : m_x(x), m_y(y), m_hp(hp), m_alive(true) {}

    // 【重要：仮想デストラクタ】
    // 基底クラスポインタで破棄された際、派生クラスのデストラクタが必ず呼ばれるようにする
    virtual ~Enemy() {}

    // 【純粋仮想関数（= 0）】
    // 派生クラスに実装を強制する契約
    virtual void update(int dirX, bool moveDown) = 0;
    virtual char getGlyph() const = 0;
    virtual int getScore() const = 0;

    // 共通インターフェース
    virtual bool hit() {
        if (!m_alive) return false;
        m_hp--;
        if (m_hp <= 0) {
            m_alive = false;
        }
        return true;
    }

    bool isAlive() const { return m_alive; }
    int getX() const { return m_x; }
    int getY() const { return m_y; }
    int getHp() const { return m_hp; }
};`,
          lineExplanations: [
            {
              line: 6,
              title: 'protected アクセス指定子（派生クラスへの継承公開）',
              summary: '外部（mainなど）からは非公開（privateと同等）ですが、子クラス（NormalEnemy等）からだけは直接読み書きを許可する指定です。',
              tokens: [
                { token: 'protected', explanation: '自分自身および派生クラスからのアクセスのみを許可するアクセス制限' },
                { token: ':', explanation: 'ここから派生公開スコープが始まる区切り' }
              ],
              pitfall: 'private にすると子クラスが m_x を直接参照できなくなって不便になり、public にすると外部から改ざんされてカプセル化が崩壊します。'
            },
            {
              line: 13,
              title: 'デフォルト引数付き基底コンストラクタ',
              summary: '派生クラスが生成される際に共通して初期化する座標とHPを受け取ります。HPが省略された場合はデフォルト値 1 となります。',
              tokens: [
                { token: 'int hp = 1', explanation: 'デフォルト引数。第3引数を省略して呼び出した場合は 1 が使われる' },
                { token: ': m_x(x), m_y(y), m_hp(hp), m_alive(true)', explanation: 'メンバ初期化子リストによる直接初期化' }
              ]
            },
            {
              line: 18,
              title: '仮想デストラクタ（メモリリーク防止の必須宣言）',
              summary: '基底クラスのポインタ（Enemy*）経由で delete された際、正しい派生クラス（ShieldEnemy等）のデストラクタを逆順に実行させるための重要宣言です。',
              tokens: [
                { token: 'virtual', explanation: 'vtable経由の動的ディスパッチ（実行時型解決）を有効化' },
                { token: '~Enemy()', explanation: 'Enemyクラスのデストラクタ' },
                { token: '{}', explanation: '基底クラスでの破棄処理（空実装でOK）' }
              ],
              pitfall: '【超重要】virtual を付け忘れると、delete enemyPtr; した時に基底のデストラクタしか呼ばれず、子クラス側で確保したリソースが解放されない重大なメモリリークになります！'
            },
            {
              line: 22,
              title: '純粋仮想関数（インターフェース契約の強制）',
              summary: '末尾に = 0 を付けることで、「基底クラスでは処理を実装しない。派生クラスは必ず独自の処理をオーバーライドせよ」とコンパイラに義務付けます。',
              tokens: [
                { token: 'virtual', explanation: '実行時に実際のオブジェクト型に応じて呼び分けられる関数' },
                { token: '= 0', explanation: '純粋仮想関数（Pure Virtual）の印。このクラスは単独でインスタンス化できない抽象クラスとなる' }
              ],
              pitfall: '派生クラス側でこの関数の実装を書き忘れると、派生クラスも抽象クラス扱いとなりインスタンス生成時にコンパイルエラーになります。'
            }
          ]
        },
        {
          filename: 'NormalEnemy.h',
          language: 'cpp',
          description: '通常インベーダー。左右往復移動とグリフ \'V\' を提供。',
          code: `#pragma once
#include "Enemy.h"

// 通常インベーダー：標準的な左右往復移動
class NormalEnemy : public Enemy {
public:
    NormalEnemy(int x, int y) : Enemy(x, y, 1) {}

    void update(int dirX, bool moveDown) {
        if (!m_alive) return;
        if (moveDown) {
            m_y += 1;
        } else {
            m_x += dirX;
        }
    }

    char getGlyph() const {
        return 'V';
    }

    int getScore() const {
        return 100;
    }
};`
        },
        {
          filename: 'ShieldEnemy.h',
          language: 'cpp',
          description: 'シールド装甲敵。耐久2を持ち、被弾でグリフが \'S\' から \'s\' に変化。',
          code: `#pragma once
#include "Enemy.h"

// シールド敵：装甲耐久2。1発当たると外装が壊れて 's' になり、2発目で撃破！
class ShieldEnemy : public Enemy {
public:
    ShieldEnemy(int x, int y) : Enemy(x, y, 2) {}

    void update(int dirX, bool moveDown) {
        if (!m_alive) return;
        if (moveDown) {
            m_y += 1;
        } else {
            m_x += dirX;
        }
    }

    char getGlyph() const {
        // 耐久値に応じて見た目が変化（カプセル化された独自表現）
        return (m_hp > 1) ? 'S' : 's';
    }

    int getScore() const {
        return 200;
    }
};`,
          lineExplanations: [
            {
              line: 5,
              title: 'public 継承（基底クラスの仕様を引き継ぐ）',
              summary: 'Enemy クラスの性質（メンバ変数や仮想関数）をすべて継承し、Enemy の一種（is-a関係）として振る舞えるようにします。',
              tokens: [
                { token: 'class ShieldEnemy', explanation: '派生クラスの名前' },
                { token: ': public Enemy', explanation: 'Enemyクラスをpublic（公開関係）で継承。基底ポインタ Enemy* に安全に代入可能' }
              ],
              pitfall: 'public を書き忘れて class ShieldEnemy : Enemy と書くと、C++ではデフォルトで private 継承になり、基底ポインタへの暗黙変換ができなくなります。'
            },
            {
              line: 7,
              title: '基底クラスコンストラクタの明示的呼び出し',
              summary: '子クラスが構築される前に、まず親クラス（Enemy）のコンストラクタを引数（耐久値2）付きで呼び出して初期化します。',
              tokens: [
                { token: 'ShieldEnemy(int x, int y)', explanation: '子クラスのコンストラクタ' },
                { token: ': Enemy(x, y, 2)', explanation: '親クラス Enemy のコンストラクタ呼び出し。装甲HPに 2 を渡す' }
              ],
              pitfall: '親クラスに引数なしのデフォルトコンストラクタがない場合、ここで親のコンストラクタを明示的に呼ばないとコンパイルエラーになります。'
            },
            {
              line: 18,
              title: 'ポリモーフィックなグリフ表現（カプセル化された変化）',
              summary: 'シールドの残存耐久度に応じて、画面に描画される文字を自律的に切り替えます（HP2なら大文字S、HP1なら小文字s）。',
              tokens: [
                { token: 'return (m_hp > 1) ? \'S\' : \'s\';', explanation: '三項演算子で耐久度に応じた外観文字を返却' }
              ]
            }
          ]
        },
        {
          filename: 'UfoEnemy.h',
          language: 'cpp',
          description: 'ボーナスUFO。編隊移動を無視して最上段を高速直進。',
          code: `#pragma once
#include "Enemy.h"
#include "Common.h"

// ボーナスUFO：最上段を高速直進し、画面端で自滅する特別敵
class UfoEnemy : public Enemy {
private:
    int m_speed;

public:
    UfoEnemy(int x, int y)
        : Enemy(x, y, 1), m_speed(1) {}

    // 通常の編隊移動（dirXやmoveDown）を無視し、独自の飛行アルゴリズムを実行！
    void update(int /*dirX*/, bool /*moveDown*/) {
        if (!m_alive) return;
        m_x += m_speed;
        if (m_x >= SCREEN_WIDTH - 2) {
            m_alive = false; // 画面外離脱
        }
    }

    char getGlyph() const {
        return 'U';
    }

    int getScore() const {
        return 500;
    }
};`
        },
        {
          filename: 'Game.h',
          language: 'cpp',
          description: 'Gameクラス。std::vector<Enemy*> で全敵を多態的に一括管理。',
          code: `#pragma once
#include <vector>
#include "Player.h"
#include "Enemy.h"
#include "Bullet.h"
#include "Particle.h"

class Game {
private:
    Player m_player;
    // 【重要：基底クラスのポインタを管理するコンテナ】
    // NormalEnemy, ShieldEnemy, UfoEnemy すべてを多態的に一括保持！
    std::vector<Enemy*> m_enemies;
    std::vector<Bullet> m_bullets;
    std::vector<Particle> m_particles;

    int m_score;
    bool m_gameOver;
    bool m_gameClear;
    int m_enemyDir;
    int m_enemyMoveTimer;
    int m_ufoTimer;

    void processInput();
    void update();
    void render();
    void spawnExplosion(int x, int y, bool isUfo = false);

public:
    Game();
    ~Game(); // 動的確保した敵オブジェクトを一括解放
    void run();
};`
        },
        {
          filename: 'Game.cpp',
          language: 'cpp',
          description: 'Game実装。ポリモーフィックループによる敵の更新と描画。',
          code: `#include "Game.h"
#include "NormalEnemy.h"
#include "ShieldEnemy.h"
#include "UfoEnemy.h"
#include "Common.h"
#include <iostream>

Game::Game() : m_player(SCREEN_WIDTH / 2 - 1, SCREEN_HEIGHT - 2), m_score(0) {
    // 異なる種類の敵を同じベクターに追加！
    for (int col = 0; col < 6; col++) {
        int x = 4 + col * 4;
        if (col == 2 || col == 3) {
            m_enemies.push_back(new ShieldEnemy(x, 2));
        } else {
            m_enemies.push_back(new NormalEnemy(x, 2));
        }
    }
}

Game::~Game() {
    // 【重要：仮想デストラクタによる安全な解放】
    // Enemy* 経由で delete しても、仮想デストラクタにより各派生クラスが正しく破棄される
    for (size_t i = 0; i < m_enemies.size(); ++i) {
        delete m_enemies[i];
    }
}

void Game::update() {
    // 【多態的ディスパッチ】
    // 敵の種類を意識せず、基底ポインタ経由で update() を呼ぶだけで
    // 各敵固有の実装が自動実行される！
    for (size_t i = 0; i < m_enemies.size(); ++i) {
        if (m_enemies[i]->isAlive()) {
            m_enemies[i]->update(m_enemyDir, hitWall);
        }
    }
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'd4-7',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'うわぁぁ！すごい！エミュレータを動かしたら、中央に硬いシールド敵（S）がいて、上空には高速でUFO（U）が飛んできました！\nしかもGameクラスの中身を見たら、敵の種類で `if` や `switch` を一切書いていないのに、それぞれ勝手に違う動きをしてる…！これがポリモーフィズムの魔法なんですね！',
        },
        {
          id: 'd4-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '魔法ではない、科学じゃ！これが【開放閉鎖原則（Open-Closed Principle）】の威力じゃ。\n「機能拡張に対して開かれており（Open）、既存コードの修正に対して閉じている（Closed）」。\n新しい敵「ボスインベーダー」を作りたければ、`BossEnemy` クラスを1つ新規作成して `m_enemies` に突っ込むだけ。すでにテストが通って動いている `Game.cpp` を1文字も汚す必要がないのじゃ！',
        }
      ],
      takeaways: [
        {
          title: '【レガシーOOPの正解】開放閉鎖原則（OCP）と抽象基底クラス',
          description: '既存のGameクラスのループコードに一切手を触れずに、新しい敵クラスを追加するだけで機能拡張できる古典的オブジェクト指向の真骨頂。'
        },
        {
          title: '仮想デストラクタの絶対原則',
          description: '基底クラスポインタ経由で派生オブジェクトを安全にdeleteするために、基底クラスのデストラクタは必ず virtual にする。'
        },
        {
          title: '動的ディスパッチ（vtable / vptr）のコスト意識',
          description: 'インスタンス毎に4〜8バイトの__vptrを消費し間接呼び出しコストが生じるため、極限の省リソースでは「局所化されたswitch」や「関数ポインタテーブル」と適材適所で使い分ける。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q4-1',
      question: '基底クラス Enemy のデストラクタに「virtual」を付けずに、Enemy* ポインタ経由で派生クラス（ShieldEnemy）のインスタンスを delete した場合、何が起こるでしょうか？',
      options: [
        'コンパイルエラーになり、プログラムをビルドできない。',
        'ShieldEnemy のデストラクタが呼ばれず、Enemy のデストラクタしか実行されないため、メモリリーク等を引き起こす。',
        'C++が自動的に検知して、常に派生クラスのデストラクタを安全に呼び出してくれる。',
        'プログラム実行時にセグメンテーション違反で即座にクラッシュする。'
      ],
      correctIndex: 1,
      explanation: '基底クラスのデストラクタが非仮想の場合、静的な型（Enemy*）に基づいて基底クラスのデストラクタしか呼ばれません。派生クラスで確保したリソースの解放処理がスキップされて深刻なメモリリークになるため、基底クラスのデストラクタには必ず virtual を付けるのが絶対鉄則です。'
    },
    {
      id: 'q4-2',
      question: 'C++において「純粋仮想関数（Pure Virtual Function）」を1つ以上持つクラスに関する説明として、最も正確なものはどれですか？',
      options: [
        'そのクラスは抽象クラスとなり、単体でインスタンス化（new や変数宣言）することができなくなる。',
        'すべてのメンバ変数が private から protected に自動変更される。',
        '派生クラスでその関数をオーバーライドしてはならない。',
        '実行速度が通常の関数より100倍以上遅くなる。'
      ],
      correctIndex: 0,
      explanation: '「virtual void update() = 0;」のように末尾に「= 0」を付けた純粋仮想関数を持つクラスは「抽象クラス（Abstract Class）」と呼ばれ、直接インスタンスを生成できなくなります。派生クラスに対して「必ずこの関数を実装せよ」という厳格な契約を強制する役割を果たします。'
    },
    {
      id: 'q4-3',
      question: 'C++の仮想関数呼び出し（動的ディスパッチ）を裏側で支えている仕組みとして正しい組み合わせはどれですか？',
      options: [
        'mallocテーブル と freeスタック',
        '仮想関数テーブル（vtable）と 各インスタンスが持つテーブルポインタ（__vptr）',
        'RTTI（実行時型情報）による文字列一致検索',
        'switch-case 文による自動コード生成'
      ],
      correctIndex: 1,
      explanation: '仮想関数を持つクラスをコンパイルすると、クラスごとに仮想関数のアドレスを並べた「vtable（仮想関数テーブル）」が静的に生成されます。また、各インスタンスには先頭に隠しポインタ「__vptr」が埋め込まれ、実行時には __vptr を辿って vtable から該当関数を高速に呼び出します。'
    },
    {
      id: 'q4-4',
      question: 'オブジェクト指向設計の重要な原則である「開放閉鎖原則（Open-Closed Principle: OCP）」の意味として正しいものはどれですか？',
      options: [
        'ファイルは常に open() で開き、終了時に必ず close() で閉じなければならないという原則。',
        'すべてのメンバ変数は private（閉鎖）にし、メンバ関数は public（開放）にしなければならないという原則。',
        'ソフトウェアの構成要素は、機能拡張に対して開かれており（Open）、既存コードの修正に対して閉じている（Closed）べきであるという原則。',
        'ソースコードはオープンソースとして公開しなければならないという原則。'
      ],
      correctIndex: 2,
      explanation: '開放閉鎖原則（OCP）とは、「新機能を追加するとき、既存のテスト済みコードを書き換えることなく、新しいクラスを追加するだけで拡張できるように設計すべきである」という原則です。本章の Enemy 継承設計は、Game クラスのループに手を触れずに新敵を追加できるため、OCP の典型例です。'
    }
  ]
};

