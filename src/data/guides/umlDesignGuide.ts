import { Chapter } from '../../types/curriculum';

export const UML_DESIGN_GUIDE: Chapter = {
  id: 108,
  slug: 'guide-uml-design',
  category: 'guide',
  courseTrack: 'guide',
  courseChapterCode: 'G4',
  title: 'C++プログラマのためのUML設計書入門',
  subtitle: '〜コードと設計図の相互変換を完全マスター〜',
  badge: '実践UML設計書',
  description: '「コードは書けるが設計書が書けない」「UMLの矢印の意味が分からない」というエンジニアへ。クラス図・シーケンス図・ステートマシン図の読み書きと、C++コードとの厳密な対応規則を徹底解説します。',
  gameVersion: 'none',
  umlDiagram: {
    diagramType: 'class',
    title: 'UML基本記号とC++コードの対応マスター図',
    subtitle: 'クラスの構成要素と5大関連矢印のすべて',
    description: '1枚のクラス図の中に、public/private属性、継承、コンポジション（実体所有）、集約（共有）、関連（ポインタ参照）のすべてを網羅したリファレンス設計図です。',
    classes: [
      {
        name: 'GameEngine',
        attributes: [
          { name: 'm_isRunning', type: 'bool', visibility: '-' },
          { name: 'm_fps', type: 'int', visibility: '-' },
        ],
        operations: [
          { name: 'run()', type: 'void', visibility: '+' },
          { name: 'update(dt: float)', type: 'void', visibility: '+' },
        ],
      },
      {
        name: 'Player',
        attributes: [
          { name: 'm_hp', type: 'int', visibility: '-' },
          { name: 'm_pos', type: 'Vec2D', visibility: '-' },
        ],
        operations: [
          { name: 'takeDamage(dmg: int)', type: 'void', visibility: '+' },
          { name: 'fire()', type: 'void', visibility: '+' },
        ],
      },
      {
        name: 'Weapon',
        attributes: [
          { name: 'm_power', type: 'int', visibility: '-' },
          { name: 'm_cooldown', type: 'float', visibility: '-' },
        ],
        operations: [
          { name: 'shoot()', type: 'void', visibility: '+' },
        ],
      },
      {
        name: 'Enemy',
        isAbstract: true,
        stereotype: 'abstract',
        attributes: [
          { name: 'm_hp', type: 'int', visibility: '#' },
        ],
        operations: [
          { name: 'update()', type: 'void', visibility: '+', isVirtual: true },
          { name: 'draw()', type: 'void', visibility: '+', isVirtual: true },
        ],
      },
      {
        name: 'BossEnemy',
        attributes: [
          { name: 'm_phase', type: 'int', visibility: '-' },
        ],
        operations: [
          { name: 'update()', type: 'void', visibility: '+' },
          { name: 'spawnMinions()', type: 'void', visibility: '+' },
        ],
      },
    ],
    relations: [
      {
        from: 'Player',
        to: 'Weapon',
        type: 'composition',
        multiplicityFrom: '1',
        multiplicityTo: '1',
        label: '所有',
        cppMapping: 'Weapon m_weapon; // 実体として所有（寿命連動）',
      },
      {
        from: 'BossEnemy',
        to: 'Enemy',
        type: 'generalization',
        label: '継承',
        cppMapping: 'class BossEnemy : public Enemy { ... };',
      },
      {
        from: 'GameEngine',
        to: 'Player',
        type: 'composition',
        label: '所有',
        cppMapping: 'std::unique_ptr<Player> m_player;',
      },
      {
        from: 'Player',
        to: 'Enemy',
        type: 'association',
        label: '標的参照',
        cppMapping: 'Enemy* m_target; // 単なる観察（非所有ポインタ）',
      },
    ],
    codeMappingNotes: [
      '「-」は private メンバ（外から直接触らせない）、「+」は public メンバ（公開API）を表します。',
      '「◆──>（黒菱形）」はコンポジション。C++では実体メンバ変数や std::unique_ptr で実装し、親の破棄と同時に道連れで破棄されます。',
      '「◁───（白三角）」は汎化（継承）。基底クラスの共通インターフェースを派生クラスが引き継ぎます。',
      '「───>（矢印）」は単なる関連。C++では生ポインタ（Enemy*）や参照（Enemy&）として保持し、寿命管理は行いません。',
    ],
  },
  sections: [
    {
      id: 'why-uml-needed',
      title: '1.1 なぜプログラマにUML設計書が必要なのか？',
      leadText: '「動くコードが正義なんだから、設計書なんて無駄では？」と思うかもしれません。しかし、プロジェクトが大きくなったとき、設計図を持たないチームは必ず崩壊します。',
      dialogueBefore: [
        {
          id: 'dlg-uml-1',
          speaker: 'penguin',
          emotion: 'question',
          text: '指導官！現場で「UMLのクラス図書いてレビュー出して」って言われたんですが、C++のコードさえ書ければ設計図なんていらないんじゃないですか？ 二度手間に感じちゃいます…！',
        },
        {
          id: 'dlg-uml-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！甘い、甘いぞピピン！家を建てる大工が「図面なしでとりあえず柱を立ててみるか」と言ったら誰が住むんじゃ？ コードは「1枚の壁のレンガ」、UMLは「家全体の建築青写真」なのじゃ！',
        },
      ],
      explanationText: `
### UML（Unified Modeling Language）がもたらす3大価値

1. **コードの森に入る前に「鳥瞰図（マクロ視点）」を共有できる**:
   何千行もあるソースコードを1行ずつ読んでクラス同士の関係性を把握するのは脳のメモリを浪費します。1枚のUML図があれば、5秒で「誰が誰を所有しているか」が全員に伝わります。
2. **手戻り（仕様変更・設計破綻）のコストを激減させる**:
   コードを書き終えてから「あ、この設計だと循環参照で解放できない」「多重継承で破綻した」と気づくと、修正に何日もかかります。設計図の段階なら、ホワイトボードの線を1本引き直すだけで解決します。
3. **チーム・テスター・発注元との共通言語になる**:
   C++の細かい文法（テンプレートの特殊化やポインタのキャスト）を知らないテスターやマネージャーでも、UMLのクラス図や状態遷移図ならシステムの振る舞いを正確に理解できます。
      `,
    },
    {
      id: 'class-diagram-basics',
      title: '1.2 クラス図の基本記号とC++アクセス指定子の完全対応',
      leadText: 'UMLクラス図は、世界共通の「3段ボックス」で描かれます。記号のルールさえ覚えれば、中学生でも読めるようになります。',
      explanationText: `
::uml-class-box::

### アクセス修飾子とUML記号の完全対応表

| UML記号 | 意味 | C++のアクセス指定子 | 現場での使われ方 |
| :---: | :--- | :--- | :--- |
| **\`+\`** | **public** (公開) | \`public:\` | 誰でも呼べる窓口。操作メソッドや外部公開インターフェース。 |
| **\`-\`** | **private** (隠蔽) | \`private:\` | そのクラス内だけ。メンバ変数は原則すべてこれ（カプセル化）。 |
| **\`#\`** | **protected** (保護) | \`protected:\` | 自分と派生クラスだけ。継承関係でのみ共有したいデータ。 |
| **\`~\`** | **package** (同パッケージ) | （C++には直接の対応物なし） | C++では \`friend\` 指定や同一無名名前空間に相当。 |

#### 型表記の順序の違い（C++と逆なので注意！）
- C++: \`int m_hp;\` / \`void takeDamage(int amount);\`
- UML: \`m_hp: int\` / \`takeDamage(amount: int): void\`
※UMLでは「名前が先、型が後（コロン区切り）」で記述します。PascalやRust、TypeScriptと同じスタイルです。
      `,
    },
    {
      id: 'the-five-arrows',
      title: '1.3 関係性を見抜く「5大矢印」の使い分け',
      leadText: 'UMLで最も重要なのが「矢印の形」です。矢印の種類によって、C++コードでのメモリ所有権やライフサイクルが全く異なります。',
      explanationText: `
::uml-arrow-guide::

### 1. 汎化・継承（Generalization）: \`◁────\`
- **矢印**: **白抜きの三角ヘッド ＋ 実線**
- **C++コード**: \`class Boss : public Enemy { ... };\`
- **意味**: 「Boss は Enemy の一種である（is-a関係）」。基底クラスの型で派生クラスを多態的に扱えます。

---

### 2. 実現（Realization）: \`◁- - - -\`
- **矢印**: **白抜きの三角ヘッド ＋ 破線**
- **C++コード**: 純粋仮想関数（\`= 0;\`）のみを持つインターフェースクラスの継承。
- **意味**: 契約（インターフェース）に定められた振る舞いを具体的に実装すること。

---

### 3. コンポジション（Composition）: \`◆────>\`
- **矢印**: **黒塗りの菱形 ＋ 実線**
- **C++コード**:
  - \`Weapon m_weapon;\`（実体メンバ）
  - \`std::unique_ptr<Weapon> m_weapon;\`（単独所有スマートポインタ）
- **意味**: **「強固な所有（道連れ関係）」**。親（Player）が死ぬと、子（Weapon）も確実に同時に消滅します。全体と部分が命運を共にします。

---

### 4. 集約（Aggregation）: \`◇────>\`
- **矢印**: **白抜きの菱形 ＋ 実線**
- **C++コード**:
  - \`std::shared_ptr<SoundData> m_sound;\`
- **意味**: **「共有所有」**。親が死んでも、子は他の誰かが使っている限り生き続けます。

---

### 5. 関連（Association）: \`─────>\`
- **矢印**: **開いた矢印 ＋ 実線**
- **C++コード**:
  - \`Enemy* m_target;\`（生ポインタによる参照）
  - \`const Map& m_map;\`（参照による観察）
- **意味**: **「単なる参照・利用」**。相手の寿命には一切責任を持ちません。相手が先に死ぬとダングリングポインタの危険があります。
      `,
      dialogueBefore: [
        {
          id: 'dlg-uml-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'うわぁ…！「黒菱形（コンポジション）」と「白菱形（集約）」の違いって、C++の \`unique_ptr\`（単独所有）と \`shared_ptr\`（共有所有）にそのまま直結していたんですね！',
        },
        {
          id: 'dlg-uml-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そうなんじゃ！設計書で黒菱形が描かれておるのに、C++側で生ポインタで雑に放置して解放を忘れたら「設計違反のメモリリーク」になる。設計図とコードは表裏一体なのじゃ！',
        },
      ],
    },
    {
      id: 'sequence-diagrams',
      title: '1.4 シーケンス図で動的な「時間軸の呼び出し」を可視化する',
      leadText: 'クラス図は「静的な構造（骨格）」を表しますが、「実行時に誰が誰を呼ぶのか（時間軸の流れ）」は表現できません。そこで登場するのがシーケンス図です。',
      explanationText: `
### シーケンス図の構成要素

::uml-sequence-sample::

- **ライフライン（点線の縦線）**: そのオブジェクトが生存している時間軸。
- **実行可能区間（アクティベーションバー）**: そのオブジェクトが処理を実行中の期間（長方形のバー）。
- **実線矢印（\`──>\`）**: 同期関数呼び出し（呼ばれた側が終わるまで呼び出し元は待つ）。
- **破線矢印（\`- - ->\`）**: 処理完了後の戻り値（return）。

ゲームの1フレーム更新処理（\`Input\` -> \`Player::update\` -> \`Collision::check\` -> \`Render\`）をシーケンス図で描くと、**「処理の順序依存（なぜ当たり判定の前に移動させなければならないのか）」**が一目瞭然になります。
      `,
    },
    {
      id: 'state-machine-diagrams',
      title: '1.5 ステートマシン図で「状態の矛盾」を撲滅する',
      leadText: '「ポーズ中に弾が動いてしまう」「ゲームオーバーなのに自機がキー入力に反応する」。そんなバグを根絶するための最強設計図です。',
      explanationText: `
### 状態遷移図（State Machine Diagram）の3大要素

::uml-state-sample::

1. **状態（State）**: 丸角の四角形で表す（例: \`Title\`, \`Playing\`, \`Pause\`, \`GameOver\`）。
2. **イベント（Event / 遷移トリガー）**: 矢印の上のラベル。何が起きたら状態が変わるか（キー入力、時間経過、衝突）。
3. **ガード条件（Guard \`[条件式]\`）**: そのイベントが起きても、この条件を満たさないと遷移しないガード（例: \`[hp <= 0]\`）。
4. **アクション（Action \`/処理\`）**: 遷移の瞬間に実行する処理（例: \`/playGameOverBgm()\`）。

第5章で学んだ **GoFのStateパターン** は、このステートマシン図の「各状態」をそのまま1つのC++クラスに落とし込んだものです。設計図が描ければ、コードは自動的に決まります。
      `,
    },
    {
      id: 'forward-reverse-engineering',
      title: '1.6 実践演習：設計書 ↔ C++コードの相互変換',
      leadText: '実務で最も役立つ「設計書からコードを起こす」「コードから設計書を描く」思考プロセスを実演します。',
      explanationText: `
### パターンA：設計書からコードを起こす（Forward Engineering）
設計書に \`Game 1 ◆─── * Enemy\` とあり、Enemyが \`+ virtual void move() = 0;\` と定義されている場合：

\`\`\`cpp
// 設計書通りのC++実装
class Enemy {
public:
    virtual ~Enemy() {}
    virtual void move() = 0; // 純粋仮想関数
};

class Game {
private:
    // 「◆─── *」はGameが複数のEnemyを完全所有していることを表す
    std::vector<std::unique_ptr<Enemy>> m_enemies;
};
\`\`\`

### パターンB：コードから設計書を描く（Reverse Engineering）
既存コードに \`void setTarget(Enemy* target);\` とあったら：
- 生ポインタで受け取っている ＝ 所有権は移譲されない。
- クラス図では **「関連（\`──>\`）」** の線を引き、多重度は \`0..1\`（ターゲットなし、または1体）と描きます。
      `,
      dialogueAfter: [
        {
          id: 'dlg-uml-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: '設計書とC++コードの行き来が、頭の中で完全に繋がりました！これなら「設計書を描いてからコードを組む」ことも、「人のコードを読んでクラス図に起こす」ことも両方できます！',
        },
        {
          id: 'dlg-uml-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'うむ！設計書が書けるエンジニアは、現場でアーキテクト（設計責任者）として最も重宝される。コードの打ち手で終わるか、設計の司令塔になるかの分水嶺がまさにこのUMLなのじゃ！',
        },
      ],
      takeaways: [
        {
          title: 'UMLはC++メモリモデルの写し絵',
          description: 'コンポジションは実体/unique_ptr、集約はshared_ptr、関連は生ポインタ。記号の意味を知れば、設計書はそのまま堅牢なC++コードになります。',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'uml-q1',
      question: 'UMLクラス図の属性表記で `- m_health: int` と書かれている場合、C++コードでの正しい実装はどれか？',
      options: [
        'public: int m_health;',
        'private: int m_health;',
        'protected: int m_health;',
        'inline int m_health = -1;',
      ],
      correctIndex: 1,
      explanation: 'UMLにおけるマイナス記号（`-`）は private アクセスを表し、外部からの改ざんを防ぐカプセル化されたメンバ変数に対応します。',
    },
    {
      id: 'uml-q2',
      question: 'クラスAからクラスBに向かって「黒塗りの菱形（◆──>）」の矢印が引かれている（コンポジション）場合、正しい説明はどれか？',
      options: [
        'A と B はお互いの存在を知らない疎結合である',
        'A は B を強く所有しており、A が破棄されると B も自動的に破棄される（寿命が連動する）',
        'B が A の基底クラスであり、A は B を継承している',
        'A は B の関数をマルチスレッドで非同期呼び出しする',
      ],
      correctIndex: 1,
      explanation: '黒塗りの菱形（コンポジション）は「強い所有」を表し、親の寿命が尽きたとき子も道連れで破棄されます。C++では実体メンバや std::unique_ptr に対応します。',
    },
    {
      id: 'uml-q3',
      question: 'C++の基底クラス `Enemy` を派生クラス `NormalEnemy` が継承（`class NormalEnemy : public Enemy`）している関係をUMLで表す正しい矢印はどれか？',
      options: [
        '黒塗りの菱形ヘッドの実線（◆──>）',
        '開いた矢印の破線（- - ->）',
        '白抜きの三角ヘッドの実線（◁───）',
        '白抜きの菱形ヘッドの実線（◇──>）',
      ],
      correctIndex: 2,
      explanation: 'UMLにおいて継承（汎化: Generalization）は「白抜きの三角矢印（◁───）」で表します。派生クラスから基底クラスに向かって矢印を引きます。',
    },
    {
      id: 'uml-q4',
      question: 'シーケンス図において、垂直に伸びる点線（ライフライン）が表しているものはどれか？',
      options: [
        'そのオブジェクトが占有しているメモリサイズ',
        'そのオブジェクトが存在（生存）している時間軸',
        'プログラムのコンパイル時間',
        'ネットワークの帯域幅',
      ],
      correctIndex: 1,
      explanation: 'シーケンス図のライフライン（点線の縦線）は、そのオブジェクトが生成されてから破棄されるまでの「時間軸」を表しています。',
    },
  ],
};
