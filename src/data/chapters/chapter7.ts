import { Chapter } from '../../types/curriculum';

export const chapter7: Chapter = {
  id: 7,
  slug: 'chapter-7-modern-cpp-ecs',
  courseTrack: 'modern',
  courseChapterCode: 'M10',
  title: 'モダン第10章：【C++17】継承より合成とECS（データ指向設計とキャッシュ効率）',
  subtitle: '「継承より合成」の真髄、型安全なコンポーネント着脱、そして近代ゲーム設計',
  badge: 'モダンC++ M10【C++17】：ECS・データ指向',
  gameVersion: 'v7_ecs_final',
  description: 'オブジェクト指向の強力な武器「クラスの継承」ですが、ゲーム開発が大規模化すると「菱形継承（Diamond Inheritance）」「基底クラスの神格化（God Class）」「クラス爆発」という致命的な壁に直面します。最終章では、近代ゲームエンジン（Unity, Unreal, Bevy等）の設計標準である「継承より合成（Composition over Inheritance）」と、C++テンプレートを活用した「ECS（Entity Component System）」を構築。全7章の学びを結実させ、全弾幕ボスを撃破して卒業の時を迎えます！',
  sections: [
    {
      id: 'sec7-inheritance-limitations',
      title: '7.1 継承の限界：菱形継承・クラス爆発・基底クラスの神格化',
      leadText: '「敵だから Enemy を継承」「動くから Movable を継承」……その直感的な継承関係は、ゲーム仕様が複雑化した瞬間に破綻します。なぜ大規模開発では「深いクラス継承ツリー」が禁止されるのか、その理由を解明します。',
      dialogueBefore: [
        {
          id: 'd7-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！最終ステージ用に「巨大母艦ボス」を作りたいんです！ボスは「敵（Enemy）」であり、「弾を撃ち（Shooter）」、「シールドを持ち（Shielded）」、「アイテムを落とし（ItemDropper）」、「画面外に出ない（Bounded）」……これを全部多重継承したら、コンパイラから「曖昧な基底クラス」だと怒られました……！'
        },
        {
          id: 'd7-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: 'ガハハ！それこそがオブジェクト指向の禁忌【菱形多重継承の死のダイヤモンド】じゃ！Enemy も Shooter も同じ BaseObject を継承しているから、ボスの中に同じ基底クラスのデータが2重に紛れ込んで衝突したのじゃ！'
        },
        {
          id: 'd7-3',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'うう……じゃあ多重継承をやめて、全部の機能を一番親の Enemy クラスに突っ込めばいいんでしょうか……？'
        },
        {
          id: 'd7-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '絶対にいかん！それをやると Enemy クラスが数千行の【ゴッドクラス（神クラス）】になり、ただのザコ敵インベーダーまで巨大ボスのビーム砲タイマーを持つハメになる！今こそオブジェクト指向の最重要格言、【継承より合成（Composition over Inheritance）】の真理を知る時じゃ！'
        }
      ],
      paradigmComparison: {
        title: '深いクラス継承ツリー（is-a関係） vs コンポーネント合成（has-a関係）',
        cApproach: {
          title: '深いクラス階層による継承（is-a: 〜は〜である）',
          code: `// 継承の連鎖
class Entity {};
class MovableEntity : public Entity {};
class ShooterEntity : public MovableEntity {};
class FlyingShooterBoss : public ShooterEntity, public ShieldEntity {
    // 菱形継承の発生！
    // ShooterEntity と ShieldEntity が共通の基底を持つと
    // 仮想関数テーブルやメンバ変数が重複してメモリ配置がカオスに！
};`,
          drawbacks: [
            '「飛ぶけど撃たない敵」「撃つけど動かない砲台」など、バリエーションの数だけ新しい派生クラスが必要になる（クラス爆発）',
            '親クラスの修正が、全く意図しない数百個の派生クラスに波及して破壊的バグを引き起こす',
            '実行中に「敵にシールド能力を後付けする」「自機にビット護衛機を合体させる」といった動的な機能変更ができない',
            '基底クラスが全派生クラスの都合を抱え込み、数百本のメンバ変数を持つ神クラス（God Class）に肥大化'
          ]
        },
        cppApproach: {
          title: 'モダンC++：ECS コンポーネント合成（has-a: 〜を持っている）',
          code: `// 汎用エンティティ（空っぽのIDコンテナ）
class Entity;

// 部品（Component）をブロックのように自由に合成！
auto boss = std::make_shared<Entity>(100, "boss");
boss->addComponent<TransformComponent>(13.0f, 2.0f);
boss->addComponent<RenderComponent>('B', "\\033[31;1m", 3); // 巨大幅3
boss->addComponent<HealthComponent>(12);                   // 耐久値12
boss->addComponent<MovementComponent>(1, 6, false);        // 移動挙動

// 自機にも同じ部品を合成するだけ！
auto player = std::make_shared<Entity>(1, "player");
player->addComponent<TransformComponent>(14.0f, 13.0f);
player->addComponent<RenderComponent>('A', "\\033[36;1m");
player->addComponent<HealthComponent>(3);
player->addComponent<ShooterComponent>(3, true);            // 3WAY弾`,
          benefits: [
            '「敵クラス」「自機クラス」「弾クラス」すら不要！部品の組み合わせだけであらゆるゲームキャラを生成可能',
            '実行時に \`entity->addComponent<ShieldComponent>()\` を呼ぶだけで、動的にシールド能力を装着・脱着できる',
            'コンポーネント同士が完全に独立したデータ構造（POD）のため、メモリ効率とキャッシュ局所性が劇的に向上',
            '菱形継承や神クラスが物理的に発生せず、Unity や Unreal Engine と同じプロフェッショナルな設計思想に到達'
          ]
        },
        paradigmShiftNotes: '「オブジェクトは何者か（is-a）」で分類しようとすると破綻します。ゲームの世界では「オブジェクトは何を持っているか（has-a）」で組み立てるのが正解です。これが現代ソフトウェア工学の結論「継承より合成」です。'
      }
    },
    {
      id: 'sec7-templates-and-type-safety',
      title: '7.2 C++テンプレートと型安全性：`entity.get<T>()` の極意',
      leadText: 'コンポーネントを自由に着脱できるようにしながら、実行時キャストのオーバーヘッド（dynamic_cast）を排除し、完全な型安全性を両立するC++テンプレートの技法を学びます。',
      diagramType: 'ecs_composition_template',
      variables: [
        {
          name: 'std::unordered_map<std::type_index, std::unique_ptr<Component>> components',
          type: 'private std::unordered_map<std::type_index, std::unique_ptr<Component>>',
          scope: 'Entityクラス内部',
          description: 'C++の型情報（std::type_index）をキーにして、各コンポーネントの所有権を一元保持するコンテナ。',
          cComparison: 'C言語の void* components[16]。C言語では型が消失し、間違った型にキャストして即メモリ破壊を起こした。'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'Component 基底構造体の定義',
          description: '仮想デストラクタを持つ最小限の基底クラス struct Component を定義します。',
          impact: 'すべてのコンポーネントが統一的な基底を持つ',
          codeSnippet: 'struct Component { virtual ~Component() = default; };',
          designIntent: 'ポリモーフィックなメモリ破棄を保証しつつ、データそのものは派生側に持たせる。'
        },
        {
          stepNumber: 2,
          title: 'データ専用コンポーネントの作成',
          description: 'Transform, Render, Health, Movement, Shooter など、ロジックを持たない純粋データ構造（POD）を定義します。',
          impact: '機能ごとにデータが美しく細分化される',
          codeSnippet: 'struct TransformComponent : public Component { float x, y; };',
          designIntent: '神クラスを作らず、必要な能力だけを後から合成可能にする。'
        },
        {
          stepNumber: 3,
          title: 'Entity テンプレートメソッドの実装',
          description: 'template<typename T> を駆使し、std::type_index を照合して安全にポインタを返します。',
          impact: 'entity->getComponent<TransformComponent>() で高速・型安全に取得',
          codeSnippet: 'template<typename T> T* getComponent();',
          designIntent: '重い dynamic_cast を排し、コンパイル時型推論と typeid による極めて高速なアクセスを実現。'
        }
      ]
    },
    {
      id: 'sec7-ecs-architecture-systems',
      title: '7.3 ECS（Entity Component System）：データと処理の完全分離',
      leadText: 'Entity（IDのみ）、Component（データのみ）、System（処理のみ）。この3位一体がなぜ現代のゲーム開発を席巻しているのか、各システムの協調動作から紐解きます。',
      variables: [
        {
          name: 'std::vector<std::shared_ptr<Entity>> entities',
          type: 'private std::vector<std::shared_ptr<Entity>>',
          scope: 'Gameクラス内部',
          description: '世界に存在するすべての能動的エンティティ（自機・ボス・護衛・弾丸・アイテム）のフラットな配列。',
          cComparison: 'C言語の構造体配列。ECSではオブジェクトごとの分岐（if type == BOSS）をシステム全体から一掃する。'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'MovementSystem の設計',
          description: 'Transform と Movement の両方を持つエンティティだけを走査し、位置を更新。敵の種類に関係なく画一的に移動処理を実行します。',
          impact: 'ボスの巨大移動もエリートの蛇行も同一システムで処理',
          codeSnippet: 'MovementSystem::update(entities, frameCount);',
          designIntent: '敵の種類による分岐を全廃し、コンポーネントの有無だけで走査。'
        },
        {
          stepNumber: 2,
          title: 'CombatSystem の設計',
          description: 'Bullet と Health を持つエンティティの座標を照合。当たれば HP を減らし、HP が 0 になれば destroy() を呼びます。',
          impact: '当たり判定と被弾・撃破処理が1箇所に集約',
          codeSnippet: 'CombatSystem::update(entities, score, killCount);',
          designIntent: '自機弾・敵弾・爆弾すべての衝突ルールを一元管理。'
        },
        {
          stepNumber: 3,
          title: 'RenderSystem の設計',
          description: 'Transform と Render を持つエンティティをコンソールバッファにプロット。キャラの身元（ボスか雑魚か）を知る必要は一切ありません。',
          impact: '描画ロジックがゲームロジックから完全に分離',
          codeSnippet: 'RenderSystem::render(entities, score);',
          designIntent: 'コンソール表示からDirectX/OpenGL/WebGLへ移行する際も、このシステムを差し替えるだけで済む。'
        }
      ]
    },
    {
      id: 'sec7-graduation-ceremony',
      title: '7.4 全7章の完結：C言語のメモリ不安からモダンC++の地平へ',
      leadText: '第1章の「1ファイル・生ポインタ・スパゲティ」から始まった冒険は、ついに最先端のECSアーキテクチャへと到達しました。私たちが登ってきた進化の軌跡を振り返ります。',
      dialogueBefore: [
        {
          id: 'd7-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'やったあああ！ボス母艦 [ B ] と弾幕エリート [ E ] を撃破しました！3WAYレーザーもコンポーネントを足しただけで動いたし、コードがめちゃくちゃすっきりしてて、全然バグが出ません！'
        },
        {
          id: 'd7-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '見事じゃ、ピピン！お主はついに成し遂げたのじゃ！第1章で「free() を忘れたらどうしよう」「ポインタの矢印が怖い」と震えておったC言語プログラマが、今やスマートポインタを操り、StateとObserverで疎結合にし、テンプレートECSまで実装したのじゃ！'
        },
        {
          id: 'd7-7',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ううっ……ベン先生、ありがとうございます……！「なぜクラスにするのか」「なぜ生ポインタを使ってはいけないのか」「なぜ継承ではなく合成なのか」、理由が全部腑に落ちました！'
        },
        {
          id: 'd7-8',
          speaker: 'shirokuma',
          emotion: 'happy',
          text: 'うむ！道具（構文）を覚えるだけなら誰でもできる。じゃが「なぜこの設計にするのかという必然性」を魂で理解したお主は、もう立派なC++エンジニアじゃ！胸を張って、世界中の巨大プロジェクトへ羽ばたくがよい！卒業おめでとう！🎓🎉'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '第1章〜第3章：構造化からクラス、そして動的配列へ',
          description: 'C言語の関数・構造体設計から、データと処理を束ねるカプセル化（クラス）、std::vector によるバッファオーバーラン撲滅を体得しました。',
          impact: 'C言語プログラマの第1の壁を突破',
          codeSnippet: 'std::vector<Particle> particles;',
          designIntent: '手動メモリ管理の恐怖から解放され、安全な配列操作を標準化。'
        },
        {
          stepNumber: 2,
          title: '第4章〜第5章：ポリモーフィズムとスマートポインタ（RAII）',
          description: '仮想関数による多態性と、生new/deleteを撲滅する std::unique_ptr / std::shared_ptr による絶対的なメモリ安全性を確立しました。',
          impact: 'オブジェクト指向の核心と近代メモリ管理を完全制覇',
          codeSnippet: 'std::unique_ptr<Enemy> enemy = std::make_unique<ShieldEnemy>();',
          designIntent: '所有権の明確化により、メモリリークとダングリングポインタを撲滅。'
        },
        {
          stepNumber: 3,
          title: '第6章〜第7章：デザインパターンからテンプレートECS完結へ',
          description: '巨大switchを排除する State、疎結合通知の Observer、そして「継承より合成」を体現する ECS アーキテクチャで最高峰の設計力を手に入れました。',
          impact: '商用ゲームエンジンと同等のアーキテクチャ思考を獲得',
          codeSnippet: 'entity->addComponent<ShooterComponent>(3, true);',
          designIntent: '仕様変更や拡張に無限に耐えうる、プロフェッショナルな設計思想の完成。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q7-1',
      question: '大規模オブジェクト指向設計において「継承より合成（Composition over Inheritance）」が強く推奨される決定的な理由は何ですか？',
      options: [
        '継承を使うとコンパイラの最適化が一切効かなくなるから',
        '深い継承ツリーは菱形継承や神クラス（God Class）を生み、仕様変更で破綻しやすいが、合成なら部品の組み合わせで柔軟に機能を追加・着脱できるから',
        'C++17以降では言語仕様として class の継承構文が非推奨になったから',
        '合成を使うとプログラムのバイナリサイズが常に半分以下になるから'
      ],
      correctIndex: 1,
      explanation: '正解は「深い継承ツリーは菱形継承や神クラスを生み、仕様変更で破綻しやすいが、合成なら部品の組み合わせで柔軟に機能を追加・着脱できるから」です。「A is-a B（AはBである）」という静的な親子関係よりも、「A has-a B（AはBを持っている）」という動的な部品合成の方が、要求の変化に圧倒的に強い設計になります。'
    },
    {
      id: 'q7-2',
      question: 'ECS（Entity Component System）における「3つの要素の責務」として正しい組み合わせはどれですか？',
      options: [
        'Entity: データベース通信 / Component: 画面描画 / System: キーボード入力',
        'Entity: 単なる識別ID / Component: 純粋なデータ保持（ロジックなし） / System: 振る舞い・更新処理の実行（データなし）',
        'Entity: すべての基底クラス / Component: 派生クラス / System: main関数',
        'Entity: スマートポインタ / Component: ガベージコレクタ / System: コンパイラ'
      ],
      correctIndex: 1,
      explanation: '正解は「Entity: 単なる識別ID / Component: 純粋なデータ保持（ロジックなし） / System: 振る舞い・更新処理の実行（データなし）」です。データと処理を完全に分離することで、メモリ局所性の向上、高いテスト容易性、コードの再利用性を実現します。'
    },
    {
      id: 'q7-3',
      question: '`entity->getComponent<TransformComponent>()` のようなC++テンプレート設計において、dynamic_cast ではなく typeid（std::type_index）を活用する主な利点は何ですか？',
      options: [
        'RTTI（実行時型情報）による重いクラス階層の動的探索コストを回避し、高速なテーブル引き（ハッシュマップ検索）で型安全にポインタを取得できるから',
        '仮想関数テーブル（vtable）を持たないクラスでも dynamic_cast が動くようにするため',
        'ポインタではなく参照しか返せなくなる制約を回避するため',
        'コンパイルエラーをすべて実行時エラーに遅延させるため'
      ],
      correctIndex: 0,
      explanation: '正解は「RTTIによる重いクラス階層の動的探索コストを回避し、高速なテーブル引きで型安全にポインタを取得できるから」です。基底コンポーネントに仮想デストラクタを持たせつつ、型ごとに固有の std::type_index をキーにすることで、毎フレーム数千回呼ばれるゲームループでも高速に動作します。'
    },
    {
      id: 'q7-4',
      question: '本カリキュラム全7章を通じて学んだ「C言語（手続き型）からモダンC++（オブジェクト指向・ECS）へのパラダイムシフト」の本質とは何ですか？',
      options: [
        '関数をできる限り長く書き、グローバル変数で全てを共有すること',
        'malloc/free や巨大switchのような「プログラマの注意力に依存した手作業」を排除し、RAII・カプセル化・型システム・疎結合設計によって「バグの発生を構造的に不可能にする」こと',
        'すべての変数をポインタにし、ヒープメモリを直接手動で管理すること',
        'クラスやテンプレートを使わず、マクロだけで高速化すること'
      ],
      correctIndex: 1,
      explanation: '正解は「malloc/free や巨大switchのような『プログラマの注意力に依存した手作業』を排除し、RAII・カプセル化・型システム・疎結合設計によって『バグの発生を構造的に不可能にする』こと」です。モダンC++の設計とは、人間がミスをする余地をアーキテクチャの力で撲滅することにあります。全7章の完結、心からおめでとうございます！'
    }
  ],
  prevChapterSlug: 'chapter-modern-9-filesystem',
  nextChapterSlug: 'chapter-modern-6-concepts'
};
