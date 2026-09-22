import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_8: Chapter = {
  id: 208,
  slug: 'reading-step-8',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R8',
  title: 'コード読解演習 Step 8【魔境解体】：10年放置された「魔境レガシーコード」のリファクタリング読解',
  subtitle: 'マクロ汚染・暗黙型変換・グローバル乱立の安全な切り分けとキャラクタライゼーションテスト',
  badge: '読解演習 Step 8',
  description: '「仕様書も設計図もなく、10年前に退職した前任者が残した3000行の魔境関数」「ちょっと変数を1つリネームしただけで、無関係な画面でクラッシュが多発する」――実務の現場でエンジニアを最も苦しめるのが、この触るだけで崩壊するレガシーコードです。本章では、危険なマクロ関数や暗黙のグローバル変数依存を特定・無毒化し、現行の挙動を100%保護する「キャラクタライゼーションテスト（仕様化テスト）」を盾にした、安全なコード読解＆解体手術の全手順を伝授します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-7',
  nextChapterSlug: 'reading-step-9',
  sections: [
    {
      id: 'step8-legacy-nightmare',
      title: '8.1 「触るだけで世界が壊れる」魔境コードの解剖学',
      leadText: 'なぜレガシーコードは読む者を絶望させるのか？ 現場に潜む3大トラップ（マクロ・グローバル・暗黙型変換）の鑑識眼を養います。',
      dialogueBefore: [
        {
          id: 'dlg-r8-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生…！現場の古いゲームプロジェクトで「スコア計算の端数処理を直して」と頼まれたんですが、対象の関数を開いたら3000行のif文と謎のマクロだらけで、怖くて1文字も編集できません…！'
        },
        {
          id: 'dlg-r8-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: 'ガハハ！それぞ実務現場の洗礼、【魔境コード（Spaghetti Legacy）】じゃな！仕様書は存在せず、当時の担当者は既に転職し、テストコードは1行もない…まさに動いていること自体が奇跡の遺産じゃ！'
        },
        {
          id: 'dlg-r8-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '変数名をわかりやすく変えたり、関数を分割したいんですが、触ったらどこで何が壊れるか全く予想がつかないんです…'
        },
        {
          id: 'dlg-r8-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '丸腰で突撃しては絶対にいかん！魔境コードを解読・改修するには、プロならではの【防護盾】と【安全な鑑識手順】があるのじゃ。順を追って解体していこう！'
        }
      ],
      explanationText: `
### 魔境コードを形成する3大トラップ

多くのレガシーC/C++コードが「触れない怪物」と化す理由は、以下の3つの悪習に集約されます：

1. **マクロ汚染（Preprocessor Macro Hell）**:
   - 「#define CALC_SCORE(p, b) ...」のような危険なマクロがヘッダで定義され、型の安全性を破壊し、デバッガの追跡を遮断する。
2. **隠れたグローバル状態（Hidden Global State）**:
   - 関数の引数には渡されていないのに、関数内部で「g_CurrentPlayer」や「g_GameMode」などのグローバル変数を読み書きし、予測不能な副作用を生む。
3. **暗黙の型変換とマジックナンバー**:
   - 「int」と「bool」、浮動小数点型が型キャストなしで相互変換され、特定の数値（例: -999 や 0xFFFF）に特殊な仕様が埋め込まれている。

これらを「いきなり美しく書き直そう」とすると100%バグを混入させます。まずは「絶対に既存の挙動を変えない」防護策が必要です。
      `,
      takeaways: [
        {
          title: '魔境コードに「いきなりの美しさ」を求めてはならない',
          description: 'リファクタリングの第一原則は「外部から見た振る舞いを絶対に変えないこと」。理解が不完全な段階での性急な書き直しは惨事を招きます。'
        }
      ]
    },
    {
      id: 'step8-characterization-test',
      title: '8.2 防護盾を作る：「キャラクタライゼーションテスト（仕様化テスト）」',
      leadText: '仕様書がないなら「現在の振る舞い」そのものを仕様にする！ レガシーコード改善の絶対防壁。',
      dialogueBefore: [
        {
          id: 'dlg-r8-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'テストコードがないのに、どうやって「壊れていないこと」を確認すればいいんですか？正しい仕様が誰もわからないんですよ？'
        },
        {
          id: 'dlg-r8-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '「正しいかどうか」は後回しじゃ！まず必要なのは「現在のコードが、入力Aに対して出力Bを返すという事実」をそのまま記録する【仕様化テスト（Characterization Test）】なんじゃよ！'
        }
      ],
      explanationText: `
### キャラクタライゼーションテストの手順

仕様化テスト（ゴールデンマスターテスト）とは、**「現行システムがどのようなバグを含んでいようと、その現在の出力をそのまま正解データとして固定するテスト」**です。

1. **入力境界を見つける**:
   - 対象関数に渡されるパラメータ（通常値、境界値、異常値）をリストアップします。
2. **現行の出力を記録する**:
   - 現行コードを実行し、返り値や変更された状態のログ（CSVやJSON）を出力します。
3. **自動テスト化する**:
   - 「入力群を流し込んだ結果が、先ほど記録したログと1ビットも狂わず完全一致するか」を検証するテストを書きます。

このテストが通る限り、「自分のリファクタリングによって過去の挙動が壊れていない」ことが機械的に保証されるため、安心してコードの解体に専念できます。
      `,
      codeFiles: [
        {
          filename: 'CharacterizationTest.cpp',
          language: 'cpp',
          description: '魔境のスコア計算関数に対する現行仕様保護テスト',
          code: `// 魔境関数：誰も全貌を把握していないレガシーコード
int Legacy_CalculateBattleScore(int playerLevel, int enemyType, int killCombo, bool isHardMode);

// 🛡️ キャラクタライゼーションテスト（仕様化テスト）
void runScoreCharacterizationTest() {
    struct TestCase { int level, type, combo; bool hard; int expectedScore; };
    
    // 現行の実行結果をそのまま「正解値」として記録したゴールデンマスター
    const TestCase goldenMaster[] = {
        { 1, 0, 0, false, 100 },
        { 5, 2, 3, false, 850 },
        { 10, 9, 15, true, 14200 },
        { 99, 99, 50, true, 999999 }, // カンスト挙動などもそのまま記録！
        { 0, -1, 0, false, 0 }         // 異常入力時の現行の返り値
    };

    for (size_t i = 0; i < sizeof(goldenMaster)/sizeof(goldenMaster[0]); ++i) {
        const TestCase& tc = goldenMaster[i];
        int actual = Legacy_CalculateBattleScore(tc.level, tc.type, tc.combo, tc.hard);
        assert(actual == tc.expectedScore && "過去の仕様が破壊された！リファクタリングを中断せよ！");
    }
    printf("全仕様化テストをパス！リファクタリングの安全が確認されました。\\n");
}`
        }
      ],
      takeaways: [
        {
          title: '現行コードの「癖」ごとスナップショットを撮る',
          description: 'たとえ現行の挙動が不条理に見えても、他モジュールがその不条理に依存している可能性がある。まずは現状を完全固定することが外科手術の絶対条件です。'
        }
      ]
    },
    {
      id: 'step8-macro-sanitization',
      title: '8.3 危険なマクロの無毒化とスコープの局所化',
      leadText: '二重評価バグを引き起こすマクロ関数を、型安全なインライン関数やconstexprへ段階置換します。',
      explanationText: `
### マクロ関数の恐怖：二重評価（Double Evaluation）

レガシーコードで頻出する危険なマクロ：
「#define CALC_DAMAGE(atk, def) ((atk) * 2 - (def) > 0 ? (atk) * 2 - (def) : 0)」

もしこのマクロを「CALC_DAMAGE(currentAtk++, enemyDef)」のように呼び出すと、マクロは単なる文字列置換であるため、「currentAtk++」が1つの式の中で2回展開・評価されてしまいます！
その結果、攻撃力が意図せず2回インクリメントされ、摩訶不思議な進行不能バグを引き起こします。

さらに、Windows環境の「windows.h」が勝手に定義する「#define min(a,b)」や「#define max(a,b)」は、C++標準ライブラリの「std::min」「std::max」と衝突してコンパイルエラーを撒き散らします（これを防ぐのが「#define NOMINMAX」です）。
      `,
      codeFiles: [
        {
          filename: 'LegacyRefactorCompare.cpp',
          language: 'cpp',
          description: 'マクロ・グローバル地獄から型安全な関数設計への進化',
          code: `// ❌ 【解体前】危険なマクロと隠れたグローバル変数
#define BONUS_MULTIPLIER 1.5f
#define CALC_BONUS(score) ((int)((score) * BONUS_MULTIPLIER))
extern int g_StageDifficulty; // どこかで誰かが書き換える謎グローバル

int CalcFinalScore_Old(int baseScore) {
    if (g_StageDifficulty == 2) {
        return CALC_BONUS(baseScore) + 500;
    }
    return baseScore;
}

// -------------------------------------------------------------
// ⭕ 【解体後】型安全・スコープ隔離・依存性明示
namespace GameRules {
    constexpr float BonusMultiplier = 1.5f;

    // マクロを型安全な inline / constexpr 関数に置換（二重評価を完全根絶）
    constexpr int calculateBonus(int score) {
        return static_cast<int>(score * BonusMultiplier);
    }

    // グローバル変数を引数（コンテキスト）として明示的に受け取る
    int calculateFinalScore(int baseScore, int stageDifficulty) {
        if (stageDifficulty == 2) {
            return calculateBonus(baseScore) + 500;
        }
        return baseScore;
    }
}`
        }
      ],
      takeaways: [
        {
          title: '関数マクロは直ちに inline 関数 / constexpr へ昇格せよ',
          description: '二重評価バグの完全根絶とデバッガでのステップ実行を可能にするため、関数マクロは言語組み込みの関数へ置き換えます。'
        },
        {
          title: '隠れたグローバル変数は「引数」として表舞台へ引きずり出せ',
          description: '関数のシグネチャに必要な情報をすべて明示させることで、外部依存が可視化され、単体テストが極めて容易になります。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-r8-1',
      question: '仕様書やテストが存在しないレガシーコードを改修する際、最初に行うべき「キャラクタライゼーションテスト（仕様化テスト）」の主目的は何ですか？',
      options: [
        'コードの実行速度を10倍に高速化するため',
        '現行コードの「現在の入出力の振る舞い」をそのまま記録し、リファクタリングで過去の仕様が壊れていないか機械的に検知するため',
        'コード内のすべてのコメントを英語に翻訳するため',
        'マクロをすべてテンプレートに置換するため'
      ],
      correctIndex: 1,
      explanation: 'キャラクタライゼーションテストは、現行システムの入出力スナップショット（ゴールデンマスター）を保存し、リファクタリング作業によるデグレ（先祖返り・予期せぬ破壊）を防ぐための防壁です。'
    },
    {
      id: 'quiz-r8-2',
      question: '#define SQUARE(x) ((x) * (x)) というマクロ関数に SQUARE(n++) を渡した際に発生する重大なバグは何ですか？',
      options: [
        'コンパイルが永久に終わらなくなる',
        '引数 n++ が2回展開・評価され、変数 n が2重にインクリメントされて計算結果が狂う（二重評価バグ）',
        'メモリリークが100MB発生する',
        '関数の戻り値が常に0になる'
      ],
      correctIndex: 1,
      explanation: 'マクロは文字列置換であるため、式の中に副作用（++など）が含まれていると複数回評価されてしまい、意図しない値の変化やバグを引き起こします。'
    },
    {
      id: 'quiz-r8-3',
      question: '関数内部でグローバル変数を読み書きしている密結合コードを解体する第一歩として、最も安全な手法は何ですか？',
      options: [
        'グローバル変数を全部削除してコンパイルエラーを1つずつ直す',
        'グローバル変数を引数（またはContext構造体）として関数に明示的に渡すように変更し、関数の入出力を可視化する',
        'マルチスレッド化してアクセス速度を上げる',
        '関数を private にする'
      ],
      correctIndex: 1,
      explanation: '隠れたグローバル変数を関数の引数へ明示的に引き出すことで、関数の副作用が可視化され、外部から任意の値を注入してテストできるようになります。'
    },
    {
      id: 'quiz-r8-4',
      question: 'Windows環境の <windows.h> が原因で std::min や std::max がマクロとして誤認識されビルドエラーになる現象を防ぐ標準的なプリプロセッサ定義は何ですか？',
      options: [
        '#define DISABLE_WINDOWS',
        '#define NOMINMAX',
        '#define NO_STD_NAMESPACE',
        '#define IGNORE_MACRO_ERRORS'
      ],
      correctIndex: 1,
      explanation: 'windows.h をインクルードする前に #define NOMINMAX を宣言することで、Win32固有のレガシーな min/max マクロの展開を無効化し、C++標準ライブラリとの名前衝突を防げます。'
    }
  ]
};
