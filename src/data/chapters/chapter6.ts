import { Chapter } from '../../types/curriculum';

export const chapter6: Chapter = {
  id: 6,
  slug: 'chapter-6-design-patterns',
  courseTrack: 'classic',
  courseChapterCode: 'C5',
  title: 'レガシー第5章：クラシック・ゲームデザインパターン（State & Observer）',
  subtitle: '肥大化するswitch文の撲滅と、疎結合なイベント通知アーキテクチャ',
  badge: 'レガシーC++ C5：ゲームデザインパターン',
  gameVersion: 'v6_patterns',
  description: 'ゲームが本格化すると、タイトル画面・プレイ中・ポーズ・ゲームオーバーといった「シーン遷移」や、実績解除・スコア集計・音効といった「イベント通知」が絡み合い、コードは巨大な switch 文と相互依存スパゲティに逆戻りします。本章では、GoFデザインパターンの精髄である「State パターン」と「Observer パターン」を実践し、真に拡張性の高いゲームアーキテクチャを構築します。',
  umlDiagram: {
    diagramType: 'state',
    title: '第5章プログラムのUML状態遷移設計書（State Machine）',
    subtitle: 'Stateパターンによってクラス化された画面遷移とイベントフロー',
    description: '巨大な switch(scene) 文を排除し、各状態を独立したクラスへ昇華させたステートマシン設計書です。イベントとガード条件によって状態が厳密に制御され、不正な画面遷移（ポーズ中にゲームオーバーなど）が物理的に起きない構造を保証します。',
    stateTransitions: [
      {
        from: 'TitleState',
        to: 'PlayState',
        event: 'SPACEキー押下',
        action: 'ゲームリセット & BGM再生',
      },
      {
        from: 'PlayState',
        to: 'PauseState',
        event: 'Pキー押下',
        action: 'タイマー一時停止',
      },
      {
        from: 'PauseState',
        to: 'PlayState',
        event: 'Pキー押下',
        action: 'タイマー再開',
      },
      {
        from: 'PlayState',
        to: 'GameOverState',
        event: '自機被弾',
        guard: 'Player.HP <= 0',
        action: 'ハイスコア判定',
      },
      {
        from: 'GameOverState',
        to: 'TitleState',
        event: 'Rキー押下',
        action: '初期画面へ復帰',
      },
    ],
    codeMappingNotes: [
      '【状態のクラス化】: 設計書内の各状態ノード（TitleState, PlayState, PauseState, GameOverState）は、すべて基底クラス GameState を継承するC++クラスとして実装されています。',
      '【ガード条件 [Player.HP <= 0]】: 設計書の角括弧 [条件] は、C++の if (m_player.getHp() <= 0) という分岐条件に1対1で対応します。',
      '【アクション（/処理）】: 遷移の瞬間に実行されるアクションは、各 State の onEnter() および onExit() ライフサイクルフック関数として実行されます。',
    ],
  },
  sections: [
    {
      id: 'sec6-giant-switch-pitfalls',
      title: '6.1 巨大switch文の悲劇：状態追加で破綻する手続き型ゲームループ',
      leadText: 'C言語や初期の設計で誰もが通る「enum SceneState { TITLE, PLAY, PAUSE, GAMEOVER }」と「巨大な switch-case」。なぜこの設計はプロジェクトの中盤で必ず炎上するのか、その構造的欠陥を暴きます。',
      dialogueBefore: [
        {
          id: 'd6-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生……ゲームに「ポーズ機能」と「タイトル画面」を追加しようとしたら、mainループが `switch (currentScene)` だらけになって、1つの関数が500行を超えてしまいました……！'
        },
        {
          id: 'd6-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉふぉふぉ、誰もが一度は通る「巨大switchの樹海」じゃな！タイトル用変数、プレイ用タイマー、ポーズ用フラグが全部グローバルやGameクラスに混ざり合って、どの変数がどの画面で使われているのか追えなくなっておるじゃろ？'
        },
        {
          id: 'd6-3',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'まさにその通りです！ポーズ画面をいじっていたら、なぜかタイトル画面の文字化けが起きたりして……もうどこを直せばいいのかわかりません！'
        },
        {
          id: 'd6-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それが「開閉原則（OCP: Open-Closed Principle）」違反の代償じゃ。新しい画面を1つ足すたびに、既存の巨大関数に手を入れるからバグが伝播する。そこで登場するのが【State パターン】じゃ！状態そのものを独立したオブジェクトにするのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '手続き型 switch-case 分岐 vs オブジェクト指向 State パターン',
        cApproach: {
          title: 'C言語／手続き型：巨大な switch-case による状態分岐',
          code: `enum Scene { TITLE, PLAYING, PAUSED, GAMEOVER };
enum Scene currentScene = TITLE;

void updateGame() {
    switch (currentScene) {
        case TITLE:
            if (key == SPACE) currentScene = PLAYING;
            break;
        case PLAYING:
            updateEnemies();
            if (key == 'P') currentScene = PAUSED;
            if (checkGameOver()) currentScene = GAMEOVER;
            break;
        case PAUSED:
            if (key == 'P') currentScene = PLAYING;
            break;
        case GAMEOVER:
            if (key == 'R') currentScene = TITLE;
            break;
    }
}
// 描画関数 renderGame() にも全く同じ switch (currentScene) が出現！
// 入力処理 handleInput() にも全く同じ switch (currentScene) が出現！`,
          drawbacks: [
            '「シーンの追加」を行うたび、update, render, handleInput すべての switch に case を追記しなければならない',
            '各シーン専用の局所変数（ポーズタイマーやタイトル点滅カウンタ等）が Game クラス全体に漏れ出して汚染する',
            'case の書き忘れや break の脱落で、意図しない画面コードが暴走する危険',
            'シーンごとの単体テストや切り離しが不可能'
          ]
        },
        cppApproach: {
          title: 'C++（クラシックOOP）：State パターンによる状態のカプセル化',
          code: `// 抽象基底クラス（仮想デストラクタを完備）
class GameState {
public:
    virtual ~GameState() {}
    virtual void enter(Game& game) {}
    virtual void update(Game& game) = 0;
    virtual void render(const Game& game) = 0;
    virtual void handleInput(Game& game, char input) = 0;
    virtual void exit(Game& game) {}
};

// ゲーム本体は switch を持たず、現在の状態ポインタに丸投げするだけ！
class Game {
    GameState* currentState; // クラシックOOP：生ポインタで状態を管理
public:
    Game() : currentState(NULL) {}
    ~Game() { delete currentState; }

    void update() { if (currentState) currentState->update(*this); }
    void render() { if (currentState) currentState->render(*this); }

    void changeState(GameState* newState) {
        if (currentState) {
            currentState->exit(*this);
            delete currentState; // 古典C++：旧状態を確実にdelete！
        }
        currentState = newState;
        if (currentState) currentState->enter(*this);
    }
};`,
          benefits: [
            'switch 文がコード全体から完全に消滅する（ポリモーフィズムによる動的ディスパッチ）',
            '新シーン（例: ShopState）の追加時、既存コードを一切修正せず新クラスを作るだけで完了（開閉原則の遵守）',
            'enter() / exit() により、シーン開始・終了時のリソース初期化と後始末が自動保証される',
            'シーンごとの内部状態変数がその State クラス内に閉じ込められ、他画面に影響を与えない'
          ]
        },
        paradigmShiftNotes: 'C言語では「データの状態（enum）」を見て「関数」が条件分岐していました。オブジェクト指向の State パターンでは「状態そのものを振る舞いを持つクラス」に昇格させます。これにより、Game本体は「今が何画面か」を知る必要すらなくなります。'
      }
    },
    {
      id: 'sec6-state-pattern-impl',
      title: '6.2 State パターンの実践：Title ⇄ Play ⇄ Pause ⇄ GameOver',
      leadText: 'TitleState, PlayState, PauseState, GameOverState の4つのクラスを作り、状態間の遷移（遷移マトリクス）とライフサイクル（enter / exit）を実装します。',
      diagramType: 'state_observer_pattern',
      variables: [
        {
          name: 'GameState* currentState',
          type: 'private GameState*',
          scope: 'Gameクラス内部',
          description: '現在アクティブなゲーム状態を指すポインタ。changeState() によって旧状態を delete 解放し、新状態へ切り替える。',
          cComparison: 'C言語の enum Scene currentScene。数値でしかなく、振る舞いを持たなかった。'
        },
        {
          name: 'void enter(Game& game) / void exit(Game& game)',
          type: 'virtual void (GameState基底クラス)',
          scope: 'GameState派生クラス',
          description: '状態進入・離脱のフック。BGMの再生停止やタイマーのリセット、画面遷移イベントの自動発行を担う。',
          cComparison: 'C言語では状態変更の直前直後に手動で initTitle() や cleanupPlay() を呼び忘れるバグが頻発した。'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '抽象基底クラス GameState の定義',
          description: 'enter, update, render, handleInput, exit の純粋仮想関数を宣言し、すべてのシーンが満たすべき契約を策定します。',
          impact: 'すべての画面が共通のインターフェースを持つ',
          codeSnippet: 'virtual void update(Game& game) = 0;',
          designIntent: 'ポリモーフィズムにより、Game本体が現在シーンの種類を判定するswitch文を完全に不要にする。'
        },
        {
          stepNumber: 2,
          title: '各シーンクラスの実装（Title, Play, Pause, GameOver）',
          description: 'PlayState は敵や弾の更新に専念し、PauseState は何も更新せず「再開案内」の描画だけを行います。',
          impact: '画面ごとの責務が独立し、バグの波及がゼロになる',
          codeSnippet: 'void PauseState::update(Game& game) { /* 何も更新しない */ }',
          designIntent: 'ポーズ中の更新停止を if (isPaused) フラグではなく「空のupdate」という振る舞いで実現。'
        },
        {
          stepNumber: 3,
          title: 'changeState による状態切り替え',
          description: '旧状態の exit() を実行・delete 解放した後、新状態のポインタを保持して enter() を呼び出します。',
          impact: 'BGMやタイマーの初期化・後始末が確実に自動実行される',
          codeSnippet: 'game.changeState(new PauseState());',
          designIntent: '画面遷移の前後処理を一箇所に集約し、シーン遷移時のリソース後始末漏れを物理的に防止。'
        }
      ]
    },
    {
      id: 'sec6-observer-pattern-decoupling',
      title: '6.3 密結合の罠と Observer パターン：イベント通知の疎結合化',
      leadText: '「敵を倒した瞬間」にスコアを加算し、SEを鳴らし、実績「UFOハンター」を解除し、パーティクルを飛ばす……これを敵撃破処理の中に直接ベタ書きすると、クラス間の結合度が爆発します。Observer パターンでこの依存関係を完全に断ち切ります。',
      dialogueBefore: [
        {
          id: 'd6-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: '先生！UFOを撃墜したときに「実績解除：UFOハンター！」って文字を出したいんですが、Enemy クラスから AchievementManager や UIManager を呼び出そうとすると、ヘッダファイルの相互インクルード（循環参照）エラーでビルドが通りません！'
        },
        {
          id: 'd6-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '見事な罠にハマったの！「敵が死んだ」という低レベルなゲームプレイ事実が、「実績システム」や「UI描画」という高レベルなシステムの詳細を知ろうとするからそうなる。敵側は【誰が聞いているか知らんが、今UFOが倒されたぞ！】と叫ぶだけで十分なのじゃ！'
        },
        {
          id: 'd6-7',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'ああっ！学校の校内放送みたいなものですね！放送室（発信者）は、どの教室で誰が放送を聞いているか（受信者）を個別に知る必要がない！'
        },
        {
          id: 'd6-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！それが【Observer パターン（Publish-Subscribe）】じゃ！Game はイベントを発行する「Subject（被監視者）」となり、実績クラスやスコアクラスは「IObserver」インターフェースを通じて受信する。互いに相手の実装を1文字も知らずに連携できるのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '直接関数呼び出し（密結合） vs Observer パターン（疎結合）',
        cApproach: {
          title: '密結合：撃破処理の中にすべての通知先を直接ベタ書き',
          code: `void onEnemyKilled(Enemy* e) {
    // 敵のコードの中に、無関係なシステムの呼び出しが山積み！
    ScoreManager_AddScore(e->score);
    SoundSystem_PlaySound(SE_EXPLOSION);
    AchievementManager_CheckUfoKill(e);
    EffectManager_SpawnExplosion(e->x, e->y);
    NetworkManager_SendKillReport(e->id);
    // ↑ 新しいシステム（例: 実績、クエスト）を増やすたびに
    // この撃破処理を書き換える必要があり、結合度が破綻する！
}`,
          drawbacks: [
            'Enemy や Game が Sound, Achievement, Network すべてのヘッダをインクルードしなければならず、コンパイル時間が爆発',
            'ヘッダの相互参照（Circular Dependency）が多発し、リンクエラーの温床に',
            '「実績システムを無効化したテスト」や「音の出ないヘッドレス実行」が不可能',
            '担当者が複数人いる場合、撃破処理ファイルにコンフリクトが集中する'
          ]
        },
        cppApproach: {
          title: 'C++（クラシックOOP）：Observer パターンによる疎結合イベント配信',
          code: `// 監視者インターフェース
class IObserver {
public:
    virtual ~IObserver() {}
    virtual void onNotify(GameEvent event, int value, const std::string& msg) = 0;
};

// Game（Subject）は IObserver のリストを持つだけ！
void Game::notify(GameEvent event, int value, const std::string& msg) {
    for (size_t i = 0; i < observers.size(); ++i) {
        observers[i]->onNotify(event, value, msg);
    }
}

// 敵撃破時はイベントを叫ぶだけ（誰が購読しているか Game は知らない）
game.notify(GameEvent::ENEMY_DEFEATED, 100, "Normal enemy defeated");`,
          benefits: [
            'Game クラスは AchievementObserver の存在すら知らない（依存関係の完全な逆転・分離）',
            '実績システム、スコアシステム、リプレイログ保存など、新機能を後から何個でも安全に追加・着脱可能',
            '単体テスト時はモックObserverを登録するだけで、意図したイベントが発行されたか検証できる',
            '保守性が圧倒的に向上し、大規模ゲーム開発チームの分業が可能になる'
          ]
        },
        paradigmShiftNotes: 'C言語では「AがBを直接呼ぶ」という直接的な主従関係でした。C++のObserverパターンでは「Aはインターフェースに向けて出来事を叫び、Bはそれを勝手に購読する」という間接的な関係へ進化します。これが現代GUIやゲームエンジンの基礎です。'
      }
    },
    {
      id: 'sec6-game-architecture-mastery',
      title: '6.4 実装完成：拡張に強いアーキテクチャの全貌',
      leadText: 'State パターンと Observer パターンが合体することで、ゲームエンジンは「メインループの安定性」と「機能追加の柔軟性」を同時に獲得します。その美しい全体像を総括します。',
      variables: [
        {
          name: 'std::vector<IObserver*> observers',
          type: 'private std::vector<IObserver*>',
          scope: 'Gameクラス内部',
          description: '登録されたイベント監視者のポインタリスト。AchievementObserver や ScoreObserver がここに同居する。',
          cComparison: 'C言語の関数ポインタ配列。C++では状態を持てるクラス（Functorやインターフェース）として安全に扱える。'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'GameEvent 列挙型の定義',
          description: 'ENEMY_DEFEATED, UFO_DEFEATED, ELITE_DEFEATED, GAME_CLEAR, GAME_OVER など、ゲーム内で発生するすべての重大事実を定義します。',
          impact: 'ゲーム内の出来事を型安全な定数として一元化',
          codeSnippet: 'enum class GameEvent { ENEMY_DEFEATED, ... };',
          designIntent: '文字列ではなくenum classを使うことで、誤字や未定義イベントの発行をコンパイル時に検知。'
        },
        {
          stepNumber: 2,
          title: 'AchievementObserver の実装',
          description: 'トータル撃破数や特定イベントを監視し、条件達成時に「🏆 実績解除」ログを自立して発行します。',
          impact: '実績解除ロジックがゲーム本体から100%独立',
          codeSnippet: 'void onNotify(GameEvent event, int value, const std::string& msg);',
          designIntent: '実績の追加・変更時に敵の撃破コードを1行も弄らなくて済む開閉原則の実現。'
        },
        {
          stepNumber: 3,
          title: 'main 関数での依存性注入（Dependency Injection）',
          description: '`game.addObserver(&achievementSys);` のように外部から監視者を登録し、Game 本体のコードを1行も弄らずに拡張します。',
          impact: 'システムの着脱・差し替えが自由自在になる',
          codeSnippet: 'game.addObserver(&achievementSys);',
          designIntent: 'テスト時はモックObserverを登録でき、単体テスト容易性（Testability）が飛躍的に向上。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q6-1',
      question: 'ゲームの状態管理を「enum と巨大な switch-case」で行う最大の弱点は何ですか？',
      options: [
        'CPUの switch 命令の実行速度が if 文より著しく遅いから',
        '新しい状態（シーン）を1つ追加するたびに、update や render など複数の switch 文すべてに手を入れる必要があり、既存コードを破壊しやすいから',
        'C++では switch 文の中でポインタを使用することが禁止されているから',
        'switch 文を使うとコンパイラが仮想関数テーブルを生成できなくなるから'
      ],
      correctIndex: 1,
      explanation: '正解は「新しい状態（シーン）を1つ追加するたびに、update や render など複数の switch 文すべてに手を入れる必要があり、既存コードを破壊しやすいから」です。これはオブジェクト指向の最重要原則「開閉原則（OCP: 拡張に対して開いており、修正に対して閉じているべき）」に違反します。State パターンを使えば新クラスを追加するだけで済みます。'
    },
    {
      id: 'q6-2',
      question: 'State パターンにおいて、GameState 抽象クラスに `enter(Game&)` と `exit(Game&)` メソッドを用意する最大の目的は何ですか？',
      options: [
        '状態が切り替わる瞬間に、BGMの変更やタイマーのリセットなどの初期化・後始末処理を確実に自動実行させるため',
        'プログラムの起動時にすべての状態をメモリ上に常駐させるため',
        'すべての変数をグローバル変数に書き戻すため',
        'ガベージコレクションを強制実行するため'
      ],
      correctIndex: 0,
      explanation: '正解は「状態が切り替わる瞬間に、BGMの変更やタイマーのリセットなどの初期化・後始末処理を確実に自動実行させるため」です。状態遷移関数（changeState）内部で `oldState->exit(); newState->enter();` と順次呼ぶことで、画面切り替え時のリソース後始末漏れを物理的に防ぐことができます。'
    },
    {
      id: 'q6-3',
      question: 'Observer パターンを導入することで、Game クラスと Achievement クラス（実績システム）の関係はどう変化しますか？',
      options: [
        'Game クラスが Achievement クラスを継承する強い親子関係になる',
        'Game クラスは抽象インターフェース（IObserver）だけを知り、Achievement クラスの具象実装を一切知らなくてよい疎結合になる',
        'Achievement クラスが Game クラスのすべての private 変数を直接書き換えられるようになる',
        '双方が互いのヘッダファイルを直接インクルードし合う密結合になる'
      ],
      correctIndex: 1,
      explanation: '正解は「Game クラスは抽象インターフェース（IObserver）だけを知り、Achievement クラスの具象実装を一切知らなくてよい疎結合になる」です。これにより、実績システムを書き換えたり削除したりしても、ゲーム本体のロジックには一切影響が及びません。'
    },
    {
      id: 'q6-4',
      question: 'ゲーム開発現場で「ポーズ機能（一時停止）」を実装する際、State パターンが極めて強力である決定的な理由は何ですか？',
      options: [
        'PauseState クラスの update() を空実装（何もしない）にするだけで、ゲームループの更新処理が完全に停止し、if (isPaused) による分岐が不要になるから',
        'ポーズ中はCPUのクロック周波数が自動的に下がるから',
        'マルチスレッドの同期排他制御が不要になるから',
        'ポーズ画面のメモリ使用量が自動的に 0 バイトになるから'
      ],
      correctIndex: 0,
      explanation: '正解は「PauseState クラスの update() を空実装（何もしない）にするだけで、ゲームループの更新処理が完全に停止し、if (isPaused) による分岐が不要になるから」です。手続き型ではゲーム中のあらゆる移動・タイマー処理に `if (!isPaused)` を書き足す必要がありましたが、State パターンなら更新ロジックそのものが呼ばれなくなるため、極めて堅牢です。'
    }
  ],
  prevChapterSlug: 'chapter-4-inheritance-polymorphism',
  nextChapterSlug: 'chapter-6-operator-overload-vector'
};
