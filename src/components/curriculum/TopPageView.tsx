import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Gamepad2, 
  Code2, 
  BrainCircuit, 
  Zap,
  Layers,
  Target,
  Compass,
  CheckSquare,
  Network,
  ShieldCheck,
  Cpu,
  Boxes,
  Workflow,
  BookOpen,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ALL_CHAPTERS, CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, UPCOMING_CHAPTERS } from '../../data/chapters';
import { CourseTrack } from '../../types/curriculum';
import { AffiliatePromoBanner } from '../affiliate/AffiliatePromoBanner';
import { PersonaTrackSelector } from './PersonaTrackSelector';
import { GameEvolutionRoadmap } from './GameEvolutionRoadmap';
import { BeforeAfterShowcase } from './BeforeAfterShowcase';

interface TopPageViewProps {
  onSelectChapter: (slug: string) => void;
  completedChapters: number[];
  onOpenPlaygroundModal?: () => void;
}

export const TopPageView: React.FC<TopPageViewProps> = ({
  onSelectChapter,
  completedChapters,
  onOpenPlaygroundModal,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<'all' | CourseTrack>('all');

  // 各章の「アーキテクチャ担当」「C言語の苦しみ」と「C++で身につく設計力」「ゲームの進化」のメタ情報
  const chapterDetails: Record<number, {
    architecturalRole: string;
    beforePain: string;
    afterSkill: string;
    gameEvolution: string;
    techKeywords: string[];
  }> = {
    1: {
      architecturalRole: 'アプリケーション骨格＆グローバル状態の解剖',
      beforePain: 'main関数が500行超え！グローバル変数が乱立し、誰がどこで値を書き換えているのか追えない恐怖。',
      afterSkill: '手続き型・構造化設計の限界の自覚。「データ」と「処理」が分離していることがバグの根本原因だと理解する。',
      gameEvolution: 'レトロな白黒テキストインベーダー（1行の弾、ぎこちない固定ループ）。',
      techKeywords: ['構造化設計の限界', 'グローバル変数汚染', 'スパゲティコード解剖'],
    },
    2: {
      architecturalRole: '責務境界のカプセル化＆物理ファイル分割',
      beforePain: '構造体のメンバを外部から直接書き換えられ、意図しない座標破壊や不正状態が多発する。',
      afterSkill: 'カプセル化とアクセス修飾子（private/public）。ヘッダ（.h）と実装（.cpp）の分割による結合度の低減。',
      gameEvolution: '自機・敵・弾が独立クラス化！プレイヤーがシアン、敵が赤で鮮やかに描画。',
      techKeywords: ['カプセル化', 'アクセス指定子', 'ヘッダ分離設計', '単一責任の原則'],
    },
    3: {
      architecturalRole: '動的メモリ管理＆ライフサイクル（Rule of Three）',
      beforePain: '固定長配列のバッファオーバーフローに怯え、malloc/free の対応確認に時間を奪われる。',
      afterSkill: '動的配列 std::vector の導入と生 new/delete・Rule of Three。オブジェクトの自律的なライフサイクル管理。',
      gameEvolution: '弾の3連射が可能に！敵撃破時に美しい火花パーティクル（動的粒子）が炸裂！',
      techKeywords: ['std::vector', '生new/delete', 'Rule of Three', 'パーティクル演出'],
    },
    4: {
      architecturalRole: '多態性（vtable）＆開閉原則（OCP）拡張レイヤー',
      beforePain: '新しい敵を1種類足すだけで、update や draw の巨大 switch(type) 文すべてに修正が必要で既存敵が壊れる。',
      afterSkill: '基底クラスと仮想関数によるポリモーフィズム。vtable（仮想関数テーブル）のメモリ構造と仮想デストラクタの絶対原則。',
      gameEvolution: 'シールド持ち装甲敵（HP2）、高速ボーナスUFOが襲来！多態的に自律動作。',
      techKeywords: ['仮想関数 / override', 'vtableのメモリ構造', '仮想デストラクタ', '開閉原則 (OCP)'],
    },
    6: {
      architecturalRole: '状態遷移マシン（State）＆疎結合イベント通知（Observer）',
      beforePain: 'タイトル画面・ポーズ・ゲームオーバーの追加で main ループが巨大 switch (scene) の樹海と化す。',
      afterSkill: 'GoFデザインパターン！状態をクラス化する State パターンと、実績や音効を疎結合に通知する Observer パターン。',
      gameEvolution: 'Title ⇄ Play ⇄ Pause ⇄ GameOver のシームレス画面遷移！Pキー一時停止＆実績解除トースト！',
      techKeywords: ['State パターン', 'Observer パターン', 'ライフサイクルフック', 'イベント駆動'],
    },
    9: {
      architecturalRole: '物理ベクトル演算エンジン＆不変値オブジェクト（Vec2D）',
      beforePain: 'Vec2_Add(&pos, Vec2_Scale(&vel, dt, &tmp), &pos) のように数式を関数呼び出しで記述し、引数順序ミスや可読性崩壊が起きる。',
      afterSkill: '演算子オーバーロード（operator+, operator*, operator+=）。数学の公式通りに物理演算を直感記述し、explicit で暗黙変換を遮断。',
      gameEvolution: '3WAY扇状拡散ショットや斜め弾道ベクトル、滑らかな慣性移動を直感的な数式で制御！',
      techKeywords: ['演算子オーバーロード', '値オブジェクト', 'explicit コンストラクタ', 'friend ストリーム出力'],
    },
    5: {
      architecturalRole: '生ポインタ完全撲滅＆RAIIメモリ安全管理レイヤー',
      beforePain: '生ポインタの解放漏れ（メモリリーク）、二重解放（Double Free）、死んだアドレスを触るダングリングポインタ。',
      afterSkill: '生 new/delete の完全撲滅！std::unique_ptr（単独所有権とムーブ）と std::shared_ptr（共有所有権）による絶対的メモリ安全性。',
      gameEvolution: '自機の周囲を護衛ビットドローンが旋回援護！撃破敵から強化アイテムカプセルが落下！',
      techKeywords: ['std::unique_ptr', 'std::shared_ptr', '所有権の規律', 'RAIIイディオム'],
    },
    8: {
      architecturalRole: 'ゼロコストムーブ移譲＆高階関数・ラムダエンジン',
      beforePain: '関数から巨大ベクターやテクスチャを返すたびに全要素コピーが発生し、不要なヒープ確保とCPU時間で画面がカクつく。',
      afterSkill: 'ムーブセマンティクス（T&&, std::move）によるゼロコスト所有権移譲。ラムダ式と型推論 auto による高階関数設計。',
      gameEvolution: '弾幕ベクターの瞬間ゼロコスト移譲！ラムダ式によるステージ内敵オブジェクトの高速条件付き走査！',
      techKeywords: ['右辺値参照 T&&', 'std::move', 'ラムダ式', 'ゼロコスト抽象化'],
    },
    7: {
      architecturalRole: '最先端ECS（Entity-Component-System）合成アーキテクチャ',
      beforePain: '巨大ボスを作ろうとして多重継承に走り、同じ基底が重複する「菱形継承の死」と肥大化した神クラスに破綻する。',
      afterSkill: '現代ソフトウェア工学の結論「継承より合成（Composition over Inheritance）」。C++テンプレートによる型安全ECS設計。',
      gameEvolution: '耐久値12の超巨大母艦ボス [B] ＆ 弾幕エリート敵！プレイヤーの3WAYショット！全編完結演出！',
      techKeywords: ['継承より合成', '可変長引数テンプレート', 'std::type_index', 'ECSアーキテクチャ'],
    },
    10: {
      architecturalRole: '現代的型システム（optional/variant）＆ゼロオーバーヘッド層',
      beforePain: '「値がない」ことを表すためにNULLポインタやエラーコードを返し、チェック忘れで即死クラッシュ。重い dynamic_cast の多用。',
      afterSkill: 'std::optional による値不在の型安全表現、std::variant + std::visit によるゼロコスト多態性、constexpr による事前計算。',
      gameEvolution: 'パワーアップ・シールド・全体ボムなど多彩なドロップアイテム取得効果をパターンマッチングで超高速ディスパッチ！',
      techKeywords: ['std::optional', 'std::variant', 'std::visit', 'constexpr コンパイル時計算'],
    },
    11: {
      architecturalRole: 'ポインタ演算＆ハードウェア境界・バイナリシリアライザ',
      beforePain: '構造体をそのまま fwrite / send してパディングやエンディアンの差異でセーブデータやパケットが壊れる。',
      afterSkill: 'メモリ配置（境界整列/アライメント）の理解。固定長ビットシフトによる移植性100%のバイナリパッキング。',
      gameEvolution: 'ハイスコアや自機座標をバイナリセーブデータとして破損なく安全に永続化！',
      techKeywords: ['構造体パディング', 'アライメント境界', 'エンディアン変換', 'バイナリシリアライズ'],
    },
    12: {
      architecturalRole: 'イベント駆動委譲＆メンバ関数ポインタ・Type Erasure',
      beforePain: 'C言語流 void* コールバックで型チェックが消滅しキャストミスで即死。メンバ関数の代入コンパイルエラー。',
      afterSkill: 'メンバ関数ポインタの物理構造（this調整オフセット）の解明。Delegateパターンによる型安全なイベント通知。',
      gameEvolution: 'UIボタンクリック、自機ボム発動、BGM再生が型安全な委譲システムで完全疎結合に連動！',
      techKeywords: ['関数ポインタ', 'メンバ関数ポインタ', 'Delegateパターン', '型安全コールバック'],
    },
    13: {
      architecturalRole: '多重継承の解剖＆thisポインタ調整オフセット・合成シフト',
      beforePain: 'ボスに飛行と射撃を多重継承させたらEntityが2重実体化し菱形継承で大炎上。ポインタのアドレスが勝手にズレる怪現象。',
      afterSkill: '多重継承時の物理メモリレイアウト（this調整）の解明。仮想継承の重い代償と「継承より合成（has-a）」への転換。',
      gameEvolution: '飛行・射撃・シールド能力を独立コンポーネントとして合成した最強の母艦ボスが誕生！',
      techKeywords: ['多重継承', '菱形継承 (Diamond)', 'thisポインタ調整', '仮想基底クラス (virtual)', '継承より合成'],
    },
    14: {
      architecturalRole: 'ゼロオーバーヘッド静的多態性＆CRTP・Mix-inエンジン',
      beforePain: '弾幕1万発やパーティクルで virtual を使ったら、vtable間接ジャンプとインライン展開阻害でFPSが壊滅。',
      afterSkill: 'CRTP（奇妙に再帰したテンプレート）によるコンパイル時ポリモーフィズム。vptr完全消滅と100%インライン展開。',
      gameEvolution: '超高密度な10万発の弾幕ストームが、関数呼び出しオーバーヘッドゼロで滑らかに乱舞！',
      techKeywords: ['CRTP', '静的ポリモーフィズム', 'インライン展開 (Inlining)', '静的Mix-in', 'ゼロオーバーヘッド'],
    },
    201: {
      architecturalRole: '手続き型データフロー＆状態変数ライフサイクルの解読',
      beforePain: '何百行もある手続き型コードで、変数がどこで宣言され、ループ内でどう書き換わっているか見失う。',
      afterSkill: '3ステップ・スキャン法。一時変数と永続状態変数の分類、メインループの実行順序を完全トレース。',
      gameEvolution: '探査ポッドの燃料消費と着陸速度のデータフローを正確に読み解く！',
      techKeywords: ['データフロートレース', '状態変数の寿命', 'ループ不変条件', '早期リターン'],
    },
    202: {
      architecturalRole: 'ヘッダAPI仕様＆クラス間依存関係（所有/参照）の解読',
      beforePain: 'いきなり.cppの複雑な実装行に飛び込み、クラス間の関係や全体像が掴めず遭難する。',
      afterSkill: 'ヘッダファイル群（.h）からクラス図を脳内復元。値保持（コンポジション）とポインタ参照（関連）を見抜く。',
      gameEvolution: '警備ロボットとセンサ・バッテリーの連携構造をUMLとコードで相互追跡！',
      techKeywords: ['ヘッダ先行スキャン', 'コンポジション vs 関連', 'API仕様抽出', 'UML双方向連動'],
    },
    203: {
      architecturalRole: '多態性・vtable・動的ディスパッチ＆イベント駆動の追跡',
      beforePain: 'cmd->execute() の定義へジャンプすると空の基底クラスに飛び、実際の実行先が不明で絶望する。',
      afterSkill: '動的ディスパッチを暴く3大テクニック。vtableの構造理解、インスタンス生成（Factory）逆引き術。',
      gameEvolution: 'コマンドパターンによるイベントキューの多態的ディスパッチを完全把握！',
      techKeywords: ['vtable / vptr', '動的ディスパッチ', '生成起点逆引き', '仮想デストラクタ検査'],
    },
  };

  const displayedChapters = selectedTrack === 'all'
    ? ALL_CHAPTERS
    : selectedTrack === 'classic'
    ? CLASSIC_CHAPTERS
    : selectedTrack === 'modern'
    ? MODERN_CHAPTERS
    : selectedTrack === 'reading'
    ? READING_CHAPTERS
    : ALL_CHAPTERS;

  const classicCompletedCount = CLASSIC_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const modernCompletedCount = MODERN_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const readingCompletedCount = READING_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-4 space-y-16">
      {/* ヒーローセクション */}
      <section className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-[#070b14] to-[#040810] p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* 左側：キャッチコピー ＆ 概要説明 */}
          <div className="lg:col-span-7 space-y-6">
            {/* メインタイトル */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white font-sans leading-[1.15]">
                <span className="inline-flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="inline-block">🐻‍❄️</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 whitespace-nowrap">
                    シロクマC++ラボ
                  </span>
                </span>
              </h1>

              <p className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 leading-snug">
                <span className="inline-block whitespace-nowrap">ゲーム開発で学ぶ</span>
                <span className="inline-block whitespace-nowrap">オブジェクト指向開発</span>
                <span className="block text-slate-300 text-base sm:text-xl lg:text-2xl font-bold mt-1">
                  〜レガシー設計からモダン設計まで〜
                </span>
              </p>
            </div>

            {/* パンくずリスト & メディアタグ（タイトルの下） */}
            <nav aria-label="パンくずリスト" className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-400 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-cyan-400 font-bold shadow-sm">
                <span>🏠</span>
                <span>TOP</span>
              </span>
              <span className="text-slate-600">/</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 shadow-sm">
                <span>🐻‍❄️ シロクマC++ラボ</span>
                <span className="text-slate-400 text-xs font-normal">| shirokuma-cpp.jp</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>公式技術実践メディア</span>
              </span>
            </nav>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              「データを引数で回すC言語の書き方」で苦しんできたすべてのエンジニアへ。
              現場の巨大レガシーコードを自在に解体・保守できる<strong className="text-amber-300">【レガシーC++コース（クラシックOOP・現場実務編）】</strong>と、
              生ポインタを撲滅し最先端ゲーム設計に挑む<strong className="text-cyan-300">【モダンコース（モダンC++・新世代設計編）】</strong>の
              2大コースをご用意しました。
            </p>

            {/* 新着・注目特集ピックアップバー */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                NEW 特集
              </span>
              {onOpenPlaygroundModal && (
                <button
                  type="button"
                  onClick={onOpenPlaygroundModal}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 border border-emerald-500/50 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>💻 C++実行ラボ (ブラウザで即実行)</span>
                </button>
              )}
              <a
                href="/guide-cpp-syntax-reference"
                onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/50 transition flex items-center gap-1.5 shadow-sm no-underline"
              >
                <span>📖 C++基本文法チートシート総覧</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <a
                href="/column-why-cpp-is-great"
                onClick={(e) => { e.preventDefault(); onSelectChapter('column-why-cpp-is-great'); }}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 transition flex items-center gap-1.5 shadow-sm no-underline"
              >
                <span>🔥 特別コラム: それでもC++を愛する理由</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* キャラクター対話ミニボックス */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400/60 flex-shrink-0 shadow-md">
                <img
                  src="/images/characters_mission.jpg"
                  alt="シロクマ指導官"
                  className="w-full h-full object-cover object-[20%_35%]"
                />
              </div>
              <div className="text-xs sm:text-sm space-y-1">
                <div className="font-bold font-mono text-cyan-300 flex items-center gap-2">
                  <span>シロクマ指導官 (Ben)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">指導方針</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  「現場では古いC++03の資産も、最新のC++17も両方動いておる！クラシックなクラス設計とメモリ管理の泥臭さを知ってこそ、モダンC++のありがたみが骨身に染みるのじゃ！」
                </p>
              </div>
            </div>

            {/* CTAボタン群 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectChapter('chapter-1-spaghetti-to-oop')}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-sm sm:text-base flex items-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <span>🏛️ レガシーC++から学ぶ (C1)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectChapter('chapter-5-smart-pointers-raii')}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm sm:text-base flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <span>🚀 モダンコースから学ぶ (M1)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenPlaygroundModal && (
                <button
                  type="button"
                  onClick={onOpenPlaygroundModal}
                  className="px-4 py-3.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 hover:text-emerald-100 border border-emerald-500/40 font-bold font-mono text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>💻 C++実行ラボ</span>
                </button>
              )}

              <a
                href="#roadmap"
                className="px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-mono text-xs sm:text-sm border border-slate-700 transition flex items-center gap-1.5"
              >
                <span>全章ロードマップ ↓</span>
              </a>
            </div>
          </div>

          {/* 右側：作戦会議ビジュアル ＆ 進捗カード */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20 relative group">
              <img
                src="/images/characters_mission.jpg"
                alt="シロクマ指導官とペンギン通信士の作戦会議"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-slate-300 flex justify-between items-center">
                <span className="text-cyan-300 font-bold">極地防衛艦隊 C++ アーキテクチャ作戦室</span>
                <span className="text-slate-400">Mission Ready</span>
              </div>
            </div>

            {/* コース別達成状況カード（3大体系） */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
                <div className="flex items-center gap-1 text-[11px] font-bold font-mono text-amber-300 mb-1">
                  <span>🏛️ レガシー</span>
                </div>
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-base font-bold text-amber-400">{classicCompletedCount}/{CLASSIC_CHAPTERS.length}</span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((classicCompletedCount / CLASSIC_CHAPTERS.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <div className="flex items-center gap-1 text-[11px] font-bold font-mono text-cyan-300 mb-1">
                  <span>🚀 モダン</span>
                </div>
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-base font-bold text-cyan-400">{modernCompletedCount}/{MODERN_CHAPTERS.length}</span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((modernCompletedCount / MODERN_CHAPTERS.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30">
                <div className="flex items-center gap-1 text-[11px] font-bold font-mono text-purple-300 mb-1">
                  <span>🧭 読解演習</span>
                </div>
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-base font-bold text-purple-400">{readingCompletedCount}/{READING_CHAPTERS.length}</span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((readingCompletedCount / READING_CHAPTERS.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 あなたの現在地はどこですか？ 2大ペルソナ別・学習ナビゲーション */}
      <PersonaTrackSelector onSelectChapter={onSelectChapter} />

      {/* 🚀 1つのゲームが育つ C++設計進化の全10段階物語 */}
      <GameEvolutionRoadmap onSelectChapter={onSelectChapter} />

      {/* ⚔️ 圧倒的進化を比較。「最初のコード」vs「10ステージ後のコード」 */}
      <BeforeAfterShowcase />

      {/* 📚 新規参入者・テスター・実践者向け：特集ガイド＆品質保証 */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold shadow-inner mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPECIAL GUIDES & TESTING SUITE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              設計だけじゃない。現場で生き抜くための「品質保証＆実践手引き」
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            基本文法チートシート・C++の魅力・品質保証・読解術・環境構築・UML
          </span>
        </div>

        {/* 🔥 最注目：新規追加の2大キラーコンテンツ（大型カード2連） */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* キラー1: C++基本文法＆チートシート総覧 */}
          <a
            href="/guide-cpp-syntax-reference"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
            className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#081720] to-slate-950 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden no-underline text-inherit"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-950/50 group-hover:scale-110 transition-transform">
                    📖
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                      付録・永久保存版
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      全C++学習者の座右の書
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm">
                  ✨ 必携チートシート
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors font-sans tracking-tight">
                  C++基本文法＆チートシート総覧
                </h3>
                <p className="text-sm text-cyan-400/90 font-mono mt-1 font-semibold">
                  〜型・制御構文・ポインタ/参照・クラス・STL・キャスト〜
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                「ポインタと参照ってどう使い分ける？」「vectorのeraseの注意点は？」「static_castとdynamic_castの違いは？」など、設計カリキュラムを学ぶ上で必要なC++文法の急所を網羅した逆引きリファレンス！
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-300">#基本型とauto</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-300">#ポインタと参照</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-300">#ラムダ式</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-300">#STLコンテナ</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-300">#キャスト4種</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-sm font-mono text-cyan-400 group-hover:translate-x-1 transition-transform relative z-10">
              <span className="font-bold flex items-center gap-1.5">
                <span>文法チートシートを開く</span>
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </a>

          {/* キラー2: それでも私たちがC++を愛する理由 */}
          <a
            href="/column-why-cpp-is-great"
            onClick={(e) => { e.preventDefault(); onSelectChapter('column-why-cpp-is-great'); }}
            className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#1a0c18] to-slate-950 border-2 border-rose-500/40 hover:border-rose-400 shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden no-underline text-inherit"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold text-2xl shadow-lg shadow-rose-950/50 group-hover:scale-110 transition-transform">
                    🔥
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block">
                      特別コラム・言語思想
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      情熱のエンジニアリング
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40 font-bold shadow-sm">
                  🚀 激動の40年と未来
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-rose-300 transition-colors font-sans tracking-tight">
                  それでも私たちがC++を愛する理由
                </h3>
                <p className="text-sm text-rose-400/90 font-mono mt-1 font-semibold">
                  〜なぜ世界は今もC++で動き続けるのか？〜
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Unreal Engine、火星探査機、Googleの検索基盤、LLM推論基盤、ブラウザエンジン。シリコンの極限性能と最高度の数学的抽象化を両立する「ゼロオーバーヘッド原則」と「決定論的宇宙（RAII）」の美学を熱く語る！
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-rose-500/30 text-rose-300">#ゼロコスト抽象化</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-rose-500/30 text-rose-300">#決定論的寿命(RAII)</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-rose-500/30 text-rose-300">#UnrealEngine</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-rose-500/30 text-rose-300">#AI推論基盤</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-rose-500/30 text-rose-300">#泥臭いシリコン制御</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-sm font-mono text-rose-400 group-hover:translate-x-1 transition-transform relative z-10">
              <span className="font-bold flex items-center gap-1.5">
                <span>特別コラムを読む</span>
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </a>
        </div>

        {/* 🛠️ 実践手引き・品質保証・設計ツール（5連グリッド） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* 特集0: GoogleTest & TDD実践 */}
          <a
            href="/guide-googletest-tdd"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-googletest-tdd'); }}
            className="p-5 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a1815] to-slate-950 border border-emerald-500/40 hover:border-emerald-400 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between no-underline text-inherit"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-950/50 group-hover:scale-110 transition-transform">
                  🧪
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                  品質保証・TDD
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-sans">
                  GoogleTest & TDD実践入門
                </h3>
                <p className="text-[11px] text-emerald-400/90 font-mono mt-1">
                  CI/CDで壊れない堅牢なC++設計
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                手動プレイの限界を突破！EXPECT_* vs ASSERT_*、Red-Green-Refactor、DIとモックで変更を恐れないコードへ。
              </p>

              <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">#gtest</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">#TDD</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">#モックDI</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span className="font-bold">テスト特集を見る</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
          {/* ガイド1: コード読解術 */}
          <a
            href="/guide-code-reading"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-code-reading'); }}
            className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a131a] to-slate-950 border border-emerald-500/30 hover:border-emerald-400/60 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between no-underline text-inherit"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-950/50 group-hover:scale-110 transition-transform">
                  🧭
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                  テスター・新人必見
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-sans">
                  テスター・新規参入者のためのC++コード読解術
                </h3>
                <p className="text-xs text-emerald-400/90 font-mono mt-1">
                  「設計図がない巨大リポジトリ」でも迷子にならない！
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                何万行もあるコードベースに配属されたとき、何から読むべきか？ mainの起点探索、ヘッダをAPI仕様書として読む技、状態変更の追跡、デバッガのコールスタック逆引き術を完全伝授。
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#起点探索</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#const仕様</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#コールスタック</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span className="font-bold">読解手引きを読む</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>

          {/* ガイド2: なぜC++は難しいのか */}
          <a
            href="/column-why-cpp-is-hard"
            onClick={(e) => { e.preventDefault(); onSelectChapter('column-why-cpp-is-hard'); }}
            className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#130a1f] to-slate-950 border border-purple-500/30 hover:border-purple-400/60 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between no-underline text-inherit"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-950/50 group-hover:scale-110 transition-transform">
                  🧠
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                  言語思想・歴史コラム
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors font-sans">
                  なぜC++は難しいと言われるのか？
                </h3>
                <p className="text-xs text-purple-400/90 font-mono mt-1">
                  〜40年の進化とゼロオーバーヘッドの代償〜
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                挫折の正体は理解力不足ではありません。40年積み重ねた絶対的下位互換性の地層、勝手な安全網を拒むゼロオーバーヘッド原則、未定義動作（UB）の地雷原。理由を知れば、恐怖は納得に変わります。
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#下位互換性</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#ゼロオーバーヘッド</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#未定義動作</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
              <span className="font-bold">思想コラムを読む</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>

          {/* ガイド3: 環境構築 */}
          <a
            href="/guide-environment-setup"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-environment-setup'); }}
            className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0c161d] to-slate-950 border border-cyan-500/30 hover:border-cyan-400/60 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between no-underline text-inherit"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-950/50 group-hover:scale-110 transition-transform">
                  🛠️
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  実践・実機デバッグ
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-sans">
                  実際に組んで動かす！環境構築ガイド
                </h3>
                <p className="text-xs text-cyan-400/90 font-mono mt-1">
                  〜VS Code ＋ CMake ＋ モダンコンパイラ〜
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                ブラウザを飛び出し、手元のPC（Win/Mac/Linux）でC++コードをコンパイル＆デバッグ実行！コピペで動く最小CMakeLists.txtと、初心者が直面する「2大ビルドエラー」の解決法を網羅。
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#VSCode</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#CMake入門</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#F5デバッグ</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span className="font-bold">環境構築手順を見る</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>

          {/* ガイド4: UML設計書入門 */}
          <a
            href="/guide-uml-design"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-uml-design'); }}
            className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0d1624] to-slate-950 border border-blue-500/30 hover:border-blue-400/60 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between no-underline text-inherit"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-blue-950 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-950/50 group-hover:scale-110 transition-transform">
                  📐
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">
                  設計書 ⇄ C++同期
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors font-sans">
                  C++プログラマのためのUML設計書入門
                </h3>
                <p className="text-xs text-blue-400/90 font-mono mt-1">
                  〜コードと設計図の相互変換を完全マスター〜
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                「コードは書けるが設計書が書けない」を卒業！クラス図の記号（+/-）、5大矢印（コンポジション/集約/汎化/関連）、シーケンス図、ステートマシン図の読み書きとC++コードの対応規則を徹底解説。
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#クラス図</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#矢印の使い分け</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">#シーケンス図</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-blue-400 group-hover:translate-x-1 transition-transform">
              <span className="font-bold">UML設計入門を読む</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        </div>
      </section>

      {/* 🧭 第2の柱：コード読解演習トラック（段階別実践解読） */}
      <section className="rounded-3xl border border-purple-500/40 bg-gradient-to-b from-slate-950 via-[#0e0a1a] to-slate-950 p-6 sm:p-10 lg:p-12 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-purple-500/20 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-semibold shadow-inner">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>PRACTICAL CODE READING WORKSHOP : 第2の柱</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
              「書く力」と並ぶ現場必須スキル。段階別コード読解演習
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
              現場で遭遇する「仕様書のないコード」「他人が書いた巨大クラス群」を恐れない！
              初級の手続き型から、中級のヘッダ依存、上級の多態性・vtable動的ディスパッチまで、
              シロクマ指導官のヒントとクイズで着眼点を鍛え上げます。
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-purple-300 bg-purple-950/70 px-4 py-2 rounded-xl border border-purple-500/30 shrink-0">
            <span>💡 UML設計書 ⇄ コード双方向連動対応</span>
          </div>
        </div>

        {/* 3段階ステップカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {READING_CHAPTERS.map((step, idx) => {
            const isCompleted = completedChapters.includes(step.id);
            const stepNum = idx + 1;
            return (
              <div
                key={step.id}
                onClick={() => onSelectChapter(step.slug)}
                className="rounded-2xl border border-purple-500/30 hover:border-purple-400 bg-slate-900/80 hover:bg-slate-900 p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-purple-950/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center font-mono font-bold text-sm">
                      Step {stepNum}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>読了済</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">クイズ4問付き</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors font-sans">
                      {step.title}
                    </h3>
                    <p className="text-xs text-purple-400/90 font-mono mt-1">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs font-mono text-purple-300 group-hover:translate-x-1 transition-transform">
                  <span className="font-bold">Step {stepNum} の演習を開始</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🎯 本講座の最終到達ゴール：全部学ぶと何ができるようになるのか？ */}
      <section className="space-y-8">
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>THE ULTIMATE ARCHITECTURAL GOAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
            「不具合の横展・トラブル集」で終わらせない。
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400">
              実践カリキュラムを通じて到達する「真の設計力」。
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            C++学習で最も危険なのは、「このバグが起きたらこの構文を使う」という対症療法（Tips）の暗記に終始してしまうことです。
            本ラボが約束するゴールは、1本のインベーダーゲームの完全な進化を通じて、
            <strong className="text-cyan-300">「商用ゲームエンジン同等の堅牢なC++ソフトウェアアーキテクチャ全体を、自力でゼロから設計・実装できる総合力」</strong>
            を獲得することです。
          </p>
        </div>

        {/* 2大到達ゴールカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* プロダクトとしてのゴール */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a101d] to-slate-950 border border-cyan-500/30 shadow-xl space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold shadow-lg shadow-cyan-950/50">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                プロダクトとしての完成形
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                商用ゲームエンジン同等の堅牢アーキテクチャ
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              1ファイルの白黒テキストスパゲティから出発し、最終的に
              <strong className="text-white">【Game Loop ＋ State画面遷移 ＋ Observerイベント通知 ＋ 不変値オブジェクト（Vec2D） ＋ RAIIメモリ安全 ＋ ECSデータ指向】</strong>
              が完璧に調和した完成形ゲームシステムをゼロから組み上げます。
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-semibold">
                ✓ 完全自立ビルド可能
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-semibold">
                ✓ 拡張・機能追加が容易
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-semibold">
                ✓ メモリリーク率 0%
              </span>
            </div>
          </div>

          {/* エンジニアとしてのゴール */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a101d] to-slate-950 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shadow-lg shadow-amber-950/50">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                エンジニアとしての獲得能力
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                現場のどんなC++コードベースも恐れない自立力
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              10万行規模の<strong className="text-amber-300">「レガシーC++（C++03）」</strong>を渡されてもメモリ配置と所有権を見抜いて安全に保守でき、新規プロジェクトでは<strong className="text-cyan-300">「モダンC++（C++17）のゼロコスト抽象化とECS」</strong>を用いて最高速・型安全なシステムを主導できる、現場で最も重宝される二刀流エンジニアになります。
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/30 font-semibold">
                ✓ レガシー保守・解体力
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/30 font-semibold">
                ✓ モダン新世代設計力
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/30 font-semibold">
                ✓ 必然性に基づく意思決定
              </span>
            </div>
          </div>
        </div>

        {/* 🗺️ 完成システムの全体アーキテクチャ設計図（Architecture Blueprint） */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Workflow className="w-4 h-4" />
                <span>SYSTEM ARCHITECTURE BLUEPRINT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                実践カリキュラムで組み上がる「完成形C++ゲームエンジン」全体図
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              各章が担当するモジュールを可視化
            </span>
          </div>

          {/* アーキテクチャ階層グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* レイヤー1: Application Core & Scene */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>1. アプリケーション基盤層</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                  Core
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Main Game Loop</span>
                  <span className="text-amber-400 font-bold">[C1]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Scene Manager (State)</span>
                  <span className="text-amber-400 font-bold">[C5]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Event Bus (Observer)</span>
                  <span className="text-amber-400 font-bold">[C5]</span>
                </div>
              </div>
            </div>

            {/* レイヤー2: Entity & ECS & Math */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <Boxes className="w-4 h-4" />
                  <span>2. ゲームオブジェクト＆演算層</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                  Entity
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Vector2D 値オブジェクト</span>
                  <span className="text-amber-400 font-bold">[C6]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Polymorphic Hierarchy (vtable)</span>
                  <span className="text-amber-400 font-bold">[C4]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Modern ECS (Entity-Component)</span>
                  <span className="text-cyan-400 font-bold">[M3]</span>
                </div>
              </div>
            </div>

            {/* レイヤー3: Safety & Memory & Types */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. メモリ安全＆型システム層</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                  Safety
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">RAII & Rule of Three</span>
                  <span className="text-amber-400 font-bold">[C3]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Smart Pointers & Move (T&&)</span>
                  <span className="text-cyan-400 font-bold">[M1, M2]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-200">Type-Safe (optional/variant)</span>
                  <span className="text-cyan-400 font-bold">[M4]</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center font-sans">
            ※各章を学ぶごとに、このアーキテクチャのモジュールが1つずつ確実に組み上がっていきます。
          </p>
        </div>

        {/* 🗺️ C++アーキテクチャ設計・完全網羅スキルマップ */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-[#080d1a] to-[#040810] border border-cyan-500/30 shadow-2xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>100% COMPREHENSIVE COVERAGE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              現場で一生役に立つ「C++設計4大必須領域」完全網羅マップ
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              「不具合の横展・トラブル集」ではなく、シニアC++アーキテクトに求められる必須知識を体系化。カリキュラムを通じて以下の全領域を確実にマスターできます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 領域1 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">領域 1</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30">C1, C3, M1, M2</span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">メモリ・寿命管理領域</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>スタックとヒープの物理配置</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>生new/deleteと手動寿命</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>コピー制御の3原則(Rule of Three)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>RAII(リソース取得は初期化)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>スマートポインタ所有権規律</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>ムーブセマンティクス(T&&)</span></li>
              </ul>
            </div>

            {/* 領域2 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-300">領域 2</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/30">C2, C6</span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">カプセル化・責務境界領域</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>ヘッダ(.h)と実装(.cpp)の分割</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>アクセス修飾子による不変性保護</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>単一責任の原則(自機/敵/弾)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>不変値オブジェクト(Vec2D)設計</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>演算子オーバーロード(+,-,*)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>explicit による暗黙変換遮断</span></li>
              </ul>
            </div>

            {/* 領域3 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-300">領域 3</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-400 border border-purple-500/30">C4, C5</span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">多態性・デザインパターン領域</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>抽象基底クラスと純粋仮想関数</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>仮想関数テーブル(vtable)構造</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>仮想デストラクタの絶対原則</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>開閉原則(OCP:無修正で敵追加)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>GoF Stateパターン(画面状態遷移)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>GoF Observerパターン(疎結合通知)</span></li>
              </ul>
            </div>

            {/* 領域4 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">領域 4</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">M2, M3, M4</span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">モダンゼロコスト・ECS領域</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>ラムダ式と型推論 auto</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>コンパイル時計算(constexpr)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>NULL安全(std::optional)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>型安全パターンマッチ(variant/visit)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>継承より合成(Composition)</span></li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-400">✓</span><span>新世代型安全ECSアーキテクチャ</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* コース対比ガイド：どちらから学ぶべきか？ */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>TWO DISTINCT TRACKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            現場のニーズに応える <span className="text-cyan-400">2つの学習トラック</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans">
            クラシックな手続き・OOP設計と、最先端のモダンC++設計。両者を理解することで、どんな現場でも通用する本質的なエンジニアになります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* レガシーC++コース解説カード */}
          <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <span>🏛️ レガシーC++コース（全6章）</span>
              </span>
              <span className="text-xs font-mono text-slate-400">C言語 〜 C++03 基準</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans flex items-center gap-2">
                <span>クラシックOOP・現場実務編</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                日本の組込み機器、車載システム、産業機器、老舗ゲームエンジンなど現場の膨大な既存コード資産はクラシックOOPが土台です。生ポインタの苦労、`malloc`/`free` や `new`/`delete` のライフサイクル、仮想関数テーブル（vtable）の物理メモリレイアウトを理解していないと、現場のトラブルシューティングやデバッグは不可能です。
              </p>
            </div>

            {/* 学べる章一覧 */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-300 block">カリキュラム構成 (L1〜L7) :</span>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L1:</span> 構造化設計の限界（巨大スパゲティコードの解剖）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L2:</span> クラス化とファイル分割（カプセル化と結合度低減）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L3:</span> 動的メモリと寿命管理（生new/delete・Rule of Three）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L4:</span> 継承とポリモーフィズム（仮想関数・vtable・OCP原則）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L5:</span> ゲームデザインパターン（State & Observerパターン）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L6:</span> 演算子オーバーロードと値オブジェクト（Math & 2Dベクトル）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">L7:</span> ポインタ演算と手動メモリアライメント（バイナリ通信・セーブデータ）
                </li>
              </ul>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setSelectedTrack('classic');
                  onSelectChapter('chapter-1-spaghetti-to-oop');
                }}
                className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold font-mono text-sm border border-amber-500/40 transition flex items-center justify-center gap-2"
              >
                <span>レガシーC++コースを【L】第1章から開始する</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* モダンコース解説カード */}
          <div className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <span>🚀 モダンコース（全4章）</span>
              </span>
              <span className="text-xs font-mono text-slate-400">C++11 〜 C++17 基準</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans flex items-center gap-2">
                <span>モダンC++・新世代設計編</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                スマートポインタによる「生new/deleteの完全撲滅」、巨大データのコピーをゼロコスト化する「ムーブセマンティクス（T&&）」、ラムダ式、そして深い継承ツリーの崩壊（菱形継承の死）を乗り越える最先端の「継承より合成（ECS）」まで、新世代のソフトウェアアーキテクチャを身につけます。
              </p>
            </div>

            {/* 学べる章一覧 */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-300 block">カリキュラム構成 (M1〜M4) :</span>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">M1:</span> スマートポインタとRAII（unique_ptr, shared_ptr, 所有権規律）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">M2:</span> ムーブセマンティクスとモダン機能（右辺値参照, std::move, ラムダ）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">M3:</span> 「継承より合成」と最先端ECS（神クラス解体・テンプレートECS）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">M4:</span> 現代的型システム（std::variant, optional, constexpr）
                </li>
              </ul>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setSelectedTrack('modern');
                  onSelectChapter('chapter-5-smart-pointers-raii');
                }}
                className="w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold font-mono text-sm border border-cyan-500/40 transition flex items-center justify-center gap-2"
              >
                <span>モダンコースを【M】第1章から開始する</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4つの学習アプローチ */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            本ラボが提供する <span className="text-cyan-400">4つの学習アプローチ</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans">
            ただ解説テキストを読むのではなく、動かし、比べ、視覚化することで、現場で一生使える設計判断力を養います。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-sans">リアルタイムWebエミュレータ</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              各章のコードをブラウザ上で即座に実行。設計の進化に合わせて、弾の連射、敵の多態性、ドローン旋回、巨大ボスへとゲームが進化します。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-sans">C言語 vs C++ 設計対比</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              「C言語の手続き型ではこう書いて破綻した」と「C++のオブジェクト指向ではこう解決する」を全章でコードレベルで対比解説。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-sans">崩れゼロのメモリ・構造図解</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              スタック、ヒープ、vtable（仮想関数テーブル）、スマートポインタの所有権、ムーブ、ECSコンポーネント構造をピクセル単位で正確に図解。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-purple-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-sans">実機用C++17プロジェクト同梱</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              ブラウザ上だけでなく、ローカルのWindows環境で即座にビルドできるCMakeLists.txtとrun.batを全章分同梱しています。
            </p>
          </div>
        </div>
      </section>

      {/* 忙しいあなたへの時短宅食・ミールキットPR（中間） */}
      <AffiliatePromoBanner type="busy" />

      {/* カリキュラムロードマップ ＆ コース切り替えタブ */}
      <section id="roadmap" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
            <span>CURRICULUM ROADMAP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            カリキュラム一覧：各章で学べること
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans">
            コースを選択して、自分に合った学習ロードマップを確認しましょう。
          </p>

          {/* コース切り替えタブ */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner mt-2 font-mono text-xs sm:text-sm flex-wrap justify-center gap-1">
            <button
              onClick={() => setSelectedTrack('all')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                selectedTrack === 'all'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌐 全一覧 ({ALL_CHAPTERS.length}章)</span>
            </button>
            <button
              onClick={() => setSelectedTrack('classic')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                selectedTrack === 'classic'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <span>🏛️ レガシー (L1〜L{CLASSIC_CHAPTERS.length})</span>
            </button>
            <button
              onClick={() => setSelectedTrack('modern')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                selectedTrack === 'modern'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <span>🚀 モダン (M1〜M{MODERN_CHAPTERS.length})</span>
            </button>
            <button
              onClick={() => setSelectedTrack('reading')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                selectedTrack === 'reading'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <span>🧭 読解演習 (R1〜R{READING_CHAPTERS.length})</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {displayedChapters.map((chapter) => {
            const details = chapterDetails[chapter.id];
            const isCompleted = completedChapters.includes(chapter.id);
            const isClassic = chapter.courseTrack === 'classic';
            const isReading = chapter.courseTrack === 'reading';
            const code = chapter.courseChapterCode || `Ch.${chapter.id}`;

            return (
              <div
                key={chapter.id}
                className={`group relative rounded-2xl border transition-all duration-200 shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-between ${
                  isReading
                    ? 'border-slate-800 hover:border-purple-500/50 bg-slate-900/70 hover:shadow-purple-950/20'
                    : isClassic
                    ? 'border-slate-800 hover:border-amber-500/50 bg-slate-900/70 hover:shadow-amber-950/20'
                    : 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/70 hover:shadow-cyan-950/30'
                }`}
              >
                {/* 左側：章情報 ＆ タイトル */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-mono text-xs px-3 py-1 rounded-lg border font-bold ${
                      isReading
                        ? 'bg-purple-950/80 border-purple-500/40 text-purple-300'
                        : isClassic
                        ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                        : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                    }`}>
                      {isReading
                        ? `🧭 読解 【R】${code}`
                        : isClassic
                        ? `🏛️ レガシー 【L】第${code.replace(/^[CM]/, '')}章`
                        : `🚀 モダン 【M】第${code.replace(/^[CM]/, '')}章`}
                    </span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {chapter.badge}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>修了済み</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-xl sm:text-2xl font-bold text-white font-sans transition-colors ${
                      isReading ? 'group-hover:text-purple-300' : isClassic ? 'group-hover:text-amber-300' : 'group-hover:text-cyan-300'
                    }`}>
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                      {chapter.subtitle}
                    </p>

                    {/* アーキテクチャ担当モジュールバッジ */}
                    {details?.architecturalRole && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 mt-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs font-mono">
                        <Network className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-400">担当領域:</span>
                        <span className="text-white font-bold">{details.architecturalRole}</span>
                      </div>
                    )}
                  </div>

                  {/* Before / After 対比グリッド */}
                  {details && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* 以前の設計・読解の苦しみ */}
                      <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-rose-300">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>【Before】現場での苦しみ</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                          {details.beforePain}
                        </p>
                      </div>

                      {/* 身につく力 */}
                      <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                        isReading
                          ? 'bg-purple-950/20 border-purple-500/30'
                          : isClassic
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-cyan-950/30 border-cyan-500/30'
                      }`}>
                        <div className={`flex items-center gap-1.5 text-xs font-bold font-mono ${
                          isReading ? 'text-purple-300' : isClassic ? 'text-amber-300' : 'text-cyan-300'
                        }`}>
                          <Zap className={`w-4 h-4 ${isReading ? 'text-purple-400' : isClassic ? 'text-amber-400' : 'text-cyan-400'}`} />
                          <span>【After】身につく{isReading ? '読解力' : '設計力'}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                          {details.afterSkill}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 解放されるゲーム機能 & キーワード */}
                  {details && (
                    <div className="flex items-center justify-between gap-4 flex-wrap pt-1 text-xs font-mono">
                      <div className="flex items-center gap-2 text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
                        <Gamepad2 className="w-4 h-4" />
                        <span>演習・進化: {details.gameEvolution}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {details.techKeywords.map((kw, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 右側：学習開始ボタン */}
                <div className="lg:self-center flex-shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
                  <button
                    onClick={() => onSelectChapter(chapter.slug)}
                    className={`w-full lg:w-auto px-6 py-3.5 rounded-xl text-slate-200 font-bold font-mono text-sm transition-all duration-200 flex items-center justify-center gap-2 border shadow-lg active:scale-95 ${
                      isReading
                        ? 'bg-slate-800 group-hover:bg-purple-500 group-hover:text-slate-950 border-slate-700 group-hover:border-purple-400'
                        : isClassic
                        ? 'bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 border-slate-700 group-hover:border-amber-400'
                        : 'bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 border-slate-700 group-hover:border-cyan-400'
                    }`}
                  >
                    <span>{isReading ? `${code}を解読する` : `第${code}章を学ぶ`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🗺️ 長期拡張ロードマップ構想（全20〜30章への道筋） */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold mb-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPANSION ROADMAP : 20〜30章拡張構想</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                今後予定している拡張カリキュラム（順次公開予定）
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
                現行の基礎・実践編から、さらに深く・広く。現場のあらゆる課題に対応できる20〜30章規模の総合プラットフォームへと継続拡充していきます。
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
              合計 {UPCOMING_CHAPTERS.length} 章の拡張予定
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPCOMING_CHAPTERS.map((futureCh) => {
              const isClassicFuture = futureCh.badge.includes('レガシー');
              const isModernFuture = futureCh.badge.includes('モダン');
              return (
                <div
                  key={futureCh.id}
                  className={`p-4 rounded-2xl border border-dashed bg-slate-950/60 transition-all ${
                    isClassicFuture
                      ? 'border-amber-500/30 hover:border-amber-500/60'
                      : isModernFuture
                      ? 'border-cyan-500/30 hover:border-cyan-500/60'
                      : 'border-purple-500/30 hover:border-purple-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isClassicFuture
                        ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                        : isModernFuture
                        ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30'
                        : 'bg-purple-950/70 text-purple-300 border-purple-500/30'
                    }`}>
                      {futureCh.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">準備中</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 font-sans leading-snug">
                    {futureCh.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
                    {futureCh.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* フッター前CTAセクション */}
      <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
          👾
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
            さあ、どちらのコースから始めますか？
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            現場の既存資産保守や基盤理解を深めるなら「レガシーC++コース」、モダンC++の新機能をマスターするなら「モダンコース」。いつでも両コースを自由に行き来できます。
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onSelectChapter('chapter-1-spaghetti-to-oop')}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-amber-500/20 active:scale-95 inline-flex items-center gap-2"
          >
            <span>🏛️ レガシー【L】第1章から開始</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectChapter('chapter-5-smart-pointers-raii')}
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-cyan-500/20 active:scale-95 inline-flex items-center gap-2"
          >
            <span>🚀 モダン【M】第1章から開始</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 勉強を頑張った自分へのご褒美・お取り寄せグルメPR（最下部） */}
      <AffiliatePromoBanner type="reward" limit={3} />

      {/* 姉妹メディア案内セクション */}
      <section className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-950 via-[#0a1528] to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 flex-shrink-0">
              🌊
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40">
                  姉妹メディア
                </span>
                <span className="text-xs font-mono text-slate-400">sonar-guide.jp</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                水中音響・ソナー技術入門
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
                シロクマ先生がナビゲート！波の物理からFFT・LOFAR・TMA信号処理まで、音・動的グラフ・物理シミュレーターで直感的に学べる本格技術教育サイトです。
              </p>
            </div>
          </div>

          <a
            href="https://sonar-guide.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2 flex-shrink-0"
          >
            <span>サイトを見る</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};
