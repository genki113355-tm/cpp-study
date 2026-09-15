import React, { useState } from 'react';
import { 
  ArrowRight, 
  Workflow, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';

interface GameEvolutionRoadmapProps {
  onSelectChapter: (slug: string) => void;
}

interface EvolutionStage {
  stage: number;
  title: string;
  subtitle: string;
  tag: string;
  chapterSlug: string;
  chapterLabel: string;
  beforePain: string;
  afterSkill: string;
  storyQuote: {
    character: 'shirokuma' | 'penguin';
    text: string;
  };
  codeSnippetBefore: string;
  codeSnippetAfter: string;
}

export const GameEvolutionRoadmap: React.FC<GameEvolutionRoadmapProps> = ({ onSelectChapter }) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const stages: EvolutionStage[] = [
    {
      stage: 1,
      title: '動くゲームを作る（神クラス GameManager）',
      subtitle: 'まずは動いた！しかしmainと1クラスにすべてを詰め込んだ混沌の始まり',
      tag: 'C1: 構造化の限界',
      chapterSlug: 'chapter-1-spaghetti-to-oop',
      chapterLabel: 'Ch.1 (L1) へ進む',
      beforePain: '敵生成・当たり判定・描画・スコア・音効が全部1つのGameManagerに混在。500行を超え、変数1つ触るだけで全体が狂う恐怖。',
      afterSkill: '手続き型・グローバル状態の限界を自覚。「データと処理が分離している」ことがバグの根本原因だと理解する。',
      storyQuote: {
        character: 'shirokuma',
        text: '「やった！動いた動いた！全部GameManagerに書けば1箇所で管理できて最高じゃないですか？」'
      },
      codeSnippetBefore: `// Stage 1: 全部入り神クラス
class GameManager {
    int playerX, playerY;
    int enemyX[10], enemyY[10];
    int score;
    void run() {
        // キー入力、敵移動、弾発射、当たり判定、BGM、描画を全部この中で処理！
    }
};`,
      codeSnippetAfter: `// 改善の第一歩：責務を分離する意識
// 「描画」も「敵」も「自機」も、自分自身のことは自分で責任を持つべき！`
    },
    {
      stage: 2,
      title: 'クラス化と責務のカプセル化',
      subtitle: '自機・敵・弾を独立したオブジェクトとして産み落とす',
      tag: 'C2: カプセル化と分割',
      chapterSlug: 'chapter-2-classes-and-files',
      chapterLabel: 'Ch.2 (L2) へ進む',
      beforePain: '構造体のメンバ変数を外部から直接書き換え放題。意図しない座標破壊や不正なHP書き換えが多発。',
      afterSkill: 'アクセス指定子（private/public）で状態を保護。ヘッダ（.h）と実装（.cpp）を分割し、コンパイル依存を低減。',
      storyQuote: {
        character: 'penguin',
        text: '「シロクマ君、他人のクラスの変数を勝手に書き換えるな。自機の座標はPlayerクラス自身に守らせるんだ！」'
      },
      codeSnippetBefore: `// 外部から何でも触れてしまう危険な構造
struct Player { int x, y, hp; };
Player p;
p.hp = -9999; // 誰でも不正な値を直接代入できてしまう！`,
      codeSnippetAfter: `// カプセル化で不変性を死守
class Player {
private:
    int x_, y_, hp_;
public:
    void takeDamage(int dmg) {
        hp_ = std::max(0, hp_ - dmg); // 不正状態を絶対に許さない
    }
};`
    },
    {
      stage: 3,
      title: 'マネージャーの細分化とメモリ寿命',
      subtitle: 'GameManagerを解体し、動的配列で自律的なライフサイクルを築く',
      tag: 'C3: 動的メモリと寿命',
      chapterSlug: 'chapter-3-memory-management',
      chapterLabel: 'Ch.3 (L3) へ進む',
      beforePain: '固定長配列 MAX_ENEMIES=10 の上限オーバーフロー。敵が死んだときの穴埋め処理とメモリ管理に忙殺される。',
      afterSkill: 'std::vector による動的生成。オブジェクトの生成・解放のライフサイクルを単一責任のマネージャー群へ委譲。',
      storyQuote: {
        character: 'shirokuma',
        text: '「敵を100体出したら配列があふれてクラッシュしました……！どうやってメモリを管理すれば？」'
      },
      codeSnippetBefore: `// 固定長配列と手動フラグ管理の限界
Enemy enemies[10];
bool enemyAlive[10]; // 死亡フラグを自力で管理…探索も追加もO(N)でバグだらけ`,
      codeSnippetAfter: `// 動的コレクションと明確な寿命
std::vector<Enemy> enemies;
enemies.emplace_back(startX, startY); // 必要に応じて自動拡張、寿命管理も自動`
    },
    {
      stage: 4,
      title: '継承とポリモーフィズム（多態性）',
      subtitle: '敵の種類の爆発！巨大 switch(type) 文を捨て、仮想関数へ',
      tag: 'C4: 仮想関数とvtable',
      chapterSlug: 'chapter-4-inheritance-polymorphism',
      chapterLabel: 'Ch.4 (L4) へ進む',
      beforePain: '装甲敵、高速敵、ボス敵を足すたびに、update や draw の巨大 switch(type) 文すべてに修正が必要で既存の敵が巻き添えバグ。',
      afterSkill: 'Enemy基底クラスと仮想関数（virtual / override）。呼び出し側は enemy->update() を呼ぶだけで自律動作（開閉原則）。',
      storyQuote: {
        character: 'penguin',
        text: '「新しい敵を足すたびに既存のswitch文を10箇所も書き換えるのは素人のやることだ。基底クラスを作れ！」'
      },
      codeSnippetBefore: `// 巨大 switch 文の地獄
void updateEnemy(Enemy& e) {
    switch (e.type) {
        case ZAKO: updateZako(e); break;
        case BOSS: updateBoss(e); break;
        // 敵が増えるたびにここを修正！1つ忘れると大惨事
    }
}`,
      codeSnippetAfter: `// ポリモーフィズムで開閉原則を遵守
class Enemy {
public:
    virtual ~Enemy() = default;
    virtual void update() = 0; // 各敵が自律的に振る舞う
};
// 呼び出し側は敵の種類を知らなくてよい！
for (auto& enemy : enemies) enemy->update();`
    },
    {
      stage: 5,
      title: '「継承、これ本当に必要？」多重継承の罠',
      subtitle: 'ボスを作ろうとして継承を重ねた結果、「菱形継承の死」に直面する',
      tag: 'C9: 多重継承・菱形継承',
      chapterSlug: 'chapter-9-multiple-inheritance-diamond',
      chapterLabel: 'Ch.9 (L9) へ進む',
      beforePain: 'Flyable（飛べる）と Shootable（撃てる）を多重継承したら基底クラスが2重実体化！親クラスの変更で全派生クラスが崩壊。',
      afterSkill: '「is-a関係」の過信への反省。継承はコード再利用の道具ではなく「型による抽象化」のためだけにあると知る。',
      storyQuote: {
        character: 'shirokuma',
        text: '「飛べて、撃てて、シールドもある最強のボスを作ろうとしたら、基底クラスが2つできてコンパイルエラーで怒られました…」'
      },
      codeSnippetBefore: `// 菱形継承の悪夢 (Diamond of Death)
class Entity { int id; };
class FlyingEntity : public Entity { ... };
class ShootingEntity : public Entity { ... };
class Boss : public FlyingEntity, public ShootingEntity {
    // Entity::id が2重に存在して曖昧！
};`,
      codeSnippetAfter: `// 継承の乱用をやめる決意
// 「飛べる」「撃てる」は親子関係ではなく、「部品として持たせる」べきでは？`
    },
    {
      stage: 6,
      title: 'Composition（合成）へ：継承より合成',
      subtitle: '部品（コンポーネント）の組み合わせで、自由自在な振る舞いを獲得する',
      tag: 'M3: 継承より合成',
      chapterSlug: 'chapter-7-modern-architecture',
      chapterLabel: 'Ch.7 (M3) へ進む',
      beforePain: 'クラス階層が深くなりすぎて「ちょっとだけ弾も撃てるザコ敵」を作るのに階層構造全体を破壊しなければならない。',
      afterSkill: '「継承より合成（Composition over Inheritance）」。オブジェクトを機能コンポーネントの集合として設計（Has-A関係）。',
      storyQuote: {
        character: 'penguin',
        text: '「オブジェクト指向の金言を忘れるな。『継承するな、持たせろ』だ。欲しい機能は部品として装着すればいい！」'
      },
      codeSnippetBefore: `// 深すぎる継承階層（硬直した設計）
class Zako : public Enemy { ... };
class FlyingZako : public Zako { ... };
class ShootingFlyingZako : public FlyingZako { ... }; // もはや破綻寸前`,
      codeSnippetAfter: `// 部品の合成（柔軟な着脱）
class Actor {
    std::unique_ptr<MovementComponent> moveComp_;
    std::unique_ptr<AttackComponent> attackComp_; // 欲しい機能を持たせるだけ！
};`
    },
    {
      stage: 7,
      title: 'ゲームデザインパターンの必然性',
      subtitle: 'タイトル・戦闘・ゲームオーバーの画面遷移と疎結合イベント通知',
      tag: 'C5: State & Observer',
      chapterSlug: 'chapter-6-game-design-patterns',
      chapterLabel: 'Ch.5 (L5) へ進む',
      beforePain: 'ポーズ画面やタイトル画面を足すために main ループが巨大なフラグの迷宮（if isPaused && isTitle...）と化す。',
      afterSkill: 'Stateパターンによる画面状態の自律的カプセル化。Observerパターンによるスコア加算・実績通知の完全疎結合化。',
      storyQuote: {
        character: 'shirokuma',
        text: '「タイトル画面から戦闘画面へ行って、ポーズして、ゲームオーバーになる画面遷移、フラグだらけで頭がパンクしそうです！」'
      },
      codeSnippetBefore: `// 画面フラグ地雷原
if (inTitle) { ... }
else if (inGame) {
    if (isPaused) { ... }
    else if (isGameOver) { ... }
}`,
      codeSnippetAfter: `// State パターンによる画面カプセル化
class SceneManager {
    std::unique_ptr<IScene> currentScene_;
public:
    void changeScene(std::unique_ptr<IScene> next) {
        currentScene_ = std::move(next); // 画面ごとの処理が完全に独立！
    }
};`
    },
    {
      stage: 8,
      title: 'Modern C++ と RAII：生ポインタの完全撲滅',
      subtitle: '「誰がdeleteするのか？」問題に終止符を打つ所有権の規律',
      tag: 'M1: スマートポインタとRAII',
      chapterSlug: 'chapter-5-smart-pointers-raii',
      chapterLabel: 'Ch.5 (M1) へ進む',
      beforePain: 'Enemy* を誰が delete するのか分からず、二重解放（Double Free）で即死クラッシュ。あるいは解放忘れでメモリが枯渇。',
      afterSkill: '生 new/delete を 100% 撲滅！std::unique_ptr による単独所有権、std::move によるゼロコスト移譲、RAIIの絶対的安全性。',
      storyQuote: {
        character: 'penguin',
        text: '「現場で最も憎まれるのは二重解放クラッシュだ。現代のC++で生deleteを書くのは即刻禁止！unique_ptrに任せろ」'
      },
      codeSnippetBefore: `// 生ポインタの悲劇
Enemy* boss = new Enemy();
// 途中で例外や早期returnが起きると…
delete boss; // 呼ばれずにメモリリーク！また別の場所でdeleteしてDouble Freeクラッシュ！`,
      codeSnippetAfter: `// RAII と unique_ptr の絶対防壁
auto boss = std::make_unique<Enemy>();
// スコープを抜けた瞬間、100%自動で確実に解放。二重解放も物理的に不可能！`
    },
    {
      stage: 9,
      title: 'テスト可能な設計：依存性逆転とTDD',
      subtitle: '「ゲームを動かして手動プレイ確認」を脱却し、CIで自動テストできる設計へ',
      tag: '品質保証特集: GoogleTest',
      chapterSlug: 'guide-googletest-tdd',
      chapterLabel: '特集ガイドへ進む',
      beforePain: '当たり判定やスコア計算をテストするのに、毎回ゲームを起動して敵が出てくるまでキーボードを操作する重労働。',
      afterSkill: 'インターフェースへの依存（DIP）。描画や音効をモック化し、ゲームロジックだけをミリ秒単位でGoogleTest自動検証。',
      storyQuote: {
        character: 'shirokuma',
        text: '「修正するたびにステージ3まで手動で操作して確認するの、もう疲れました…」'
      },
      codeSnippetBefore: `// テスト不能な密結合コード
class Player {
    SoundEngine sound; // ハードウェアに直接依存！テスト実行時に音源初期化が必要
    void hit() { sound.playExplosion(); }
};`,
      codeSnippetAfter: `// インターフェースによる依存性注入 (DI)
class Player {
    IAudioService& audio_; // インターフェースに依存
public:
    Player(IAudioService& audio) : audio_(audio) {}
    // テスト時は MockAudio を渡すことで、ゲームを起動せずロジックだけ秒速テスト！
};`
    },
    {
      stage: 10,
      title: '最終アーキテクチャ：現代的ECSとクリーン設計',
      subtitle: '1ファイルの泥臭い神クラスから、商用ゲームエンジン同等の堅牢システムへ',
      tag: 'M3: 最先端ECS',
      chapterSlug: 'chapter-7-modern-architecture',
      chapterLabel: 'Ch.7 (M3) へ進む',
      beforePain: '「最初は何から何まで1つのファイルだったな…」',
      afterSkill: 'データ指向のECS（Entity-Component-System）、ゼロコスト抽象化、variant/optionalによる型安全。最高速かつ極限の保守性を獲得！',
      storyQuote: {
        character: 'penguin',
        text: '「見ろシロクマ君。最初のStage 1のコードと今のコードを見比べてみろ。これがソフトウェアアーキテクチャの力だ！」'
      },
      codeSnippetBefore: `// 【Stage 1】 混沌の原点
GameManager（グローバル状態、巨大switch、手動ポインタ、密結合）`,
      codeSnippetAfter: `// 【Stage 10】 現代の洗練
ECS World ＋ RAII ＋ Stateマシン ＋ ゼロコスト抽象化 ＋ 単体テスト網完備`
    }
  ];

  const currentStage = stages[selectedStageIndex];

  return (
    <section id="game-evolution" className="space-y-8">
      {/* セクションタイトル */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>10 STAGES GAME EVOLUTION ROADMAP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
            1つのゲームが育つ「C++設計進化の全10段階物語」
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            「最初は動けばいいと全部 <code className="text-amber-300 font-mono">GameManager</code> に書いた」。そこから直面する数々の破綻と苦痛を、C++のオブジェクト指向と設計パターンで1つずつ解決していく<strong className="text-cyan-300">成長ストーリー</strong>です。
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>クリックで各段階を探索 ↓</span>
        </div>
      </div>

      {/* ステージ番号クイック選択バー（横スクロール可能） */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {stages.map((s, idx) => {
          const isSelected = idx === selectedStageIndex;
          return (
            <button
              key={s.stage}
              onClick={() => setSelectedStageIndex(idx)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105 border-transparent'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>Stage {s.stage}</span>
            </button>
          );
        })}
      </div>

      {/* 選択されたステージの詳細カード */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#080e18] to-slate-950 border border-cyan-500/40 shadow-2xl space-y-8">
        {/* ヘッダー情報 */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-base shadow-inner">
                {currentStage.stage}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {currentStage.tag}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans">
              {currentStage.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              {currentStage.subtitle}
            </p>
          </div>

          <button
            onClick={() => onSelectChapter(currentStage.chapterSlug)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
          >
            <span>{currentStage.chapterLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 苦痛（Before） vs 解決（After） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 直面する苦痛（Before） */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>直面する苦痛・動くけどヤバいコード</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {currentStage.beforePain}
            </p>
          </div>

          {/* 身につく設計力（After） */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>解決する設計思想・必然性（なぜ？）</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {currentStage.afterSkill}
            </p>
          </div>
        </div>

        {/* シロクマ＆ペンギンのひとこと設計問答 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
          <span className="text-3xl">
            {currentStage.storyQuote.character === 'shirokuma' ? '🐻‍❄️' : '🐧'}
          </span>
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400">
              {currentStage.storyQuote.character === 'shirokuma' ? 'シロクマ君の素朴な疑問' : '先輩ペンギンの設計指南'}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans italic">
              {currentStage.storyQuote.text}
            </p>
          </div>
        </div>

        {/* コード対比スニペット */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>コードの進化スニペット</span>
            <span className="text-[10px] text-cyan-400">Before ➔ After</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-rose-500/30 bg-slate-950">
              <div className="px-3.5 py-1.5 bg-rose-950/50 border-b border-rose-500/20 text-[10px] font-mono font-bold text-rose-300">
                ❌ 問題のコード（または考え方）
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <code>{currentStage.codeSnippetBefore}</code>
              </pre>
            </div>
            <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-950">
              <div className="px-3.5 py-1.5 bg-emerald-950/50 border-b border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-300">
                ✨ 改善後の設計コード（または指針）
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                <code>{currentStage.codeSnippetAfter}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setSelectedStageIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedStageIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
              selectedStageIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ← 前のStage
          </button>
          <span className="text-xs font-mono text-slate-500">
            Stage {selectedStageIndex + 1} / 10
          </span>
          <button
            onClick={() => setSelectedStageIndex((prev) => Math.min(stages.length - 1, prev + 1))}
            disabled={selectedStageIndex === stages.length - 1}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
              selectedStageIndex === stages.length - 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900'
            }`}
          >
            次のStage →
          </button>
        </div>
      </div>
    </section>
  );
};
