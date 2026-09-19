import React, { useState } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  CLASSIC_CHAPTERS, 
  MODERN_CHAPTERS, 
  READING_CHAPTERS, 
  SPECIAL_GUIDES
} from '../../data/chapters';
import { Chapter } from '../../types/curriculum';
import { AffiliatePromoBanner } from '../affiliate/AffiliatePromoBanner';

interface TopPageViewProps {
  onSelectChapter: (slug: string) => void;
  completedChapters: number[];
  onOpenPlaygroundModal?: () => void;
}

export const TopPageView: React.FC<TopPageViewProps> = ({
  onSelectChapter,
  completedChapters,
  onOpenPlaygroundModal: _onOpenPlaygroundModal,
}) => {
  const [activeTab, setActiveTab] = useState<'classic' | 'modern' | 'reading' | 'guides'>('classic');

  const getChapterCode = (ch: Chapter): string => {
    if (ch.courseChapterCode) return ch.courseChapterCode;
    if (ch.courseTrack === 'reading') {
      const idx = READING_CHAPTERS.findIndex(r => r.id === ch.id);
      return idx !== -1 ? `R${idx + 1}` : 'R';
    }
    if (ch.courseTrack === 'modern') {
      const idx = MODERN_CHAPTERS.findIndex(m => m.id === ch.id);
      return idx !== -1 ? `M${idx + 1}` : 'M';
    }
    if (ch.courseTrack === 'classic') {
      const idx = CLASSIC_CHAPTERS.findIndex(c => c.id === ch.id);
      return idx !== -1 ? `L${idx + 1}` : 'L';
    }
    if (ch.slug.includes('syntax')) return '文法';
    if (ch.slug.includes('tdd')) return 'TDD';
    if (ch.slug.includes('reading')) return '読解';
    if (ch.slug.includes('design-patterns')) return 'DP';
    if (ch.slug.includes('uml')) return 'UML';
    if (ch.slug.includes('great')) return '思想';
    if (ch.slug.includes('hard')) return '試練';
    if (ch.slug.includes('env')) return '環境';
    return 'G';
  };

  const currentList = 
    activeTab === 'classic' ? CLASSIC_CHAPTERS :
    activeTab === 'modern' ? MODERN_CHAPTERS :
    activeTab === 'reading' ? READING_CHAPTERS :
    SPECIAL_GUIDES;

  const classicCompleted = CLASSIC_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const modernCompleted = MODERN_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const readingCompleted = READING_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;


  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-12 sm:space-y-16">
      
      {/* 1. ヒーローセクション（サイトの存在意義・1秒で伝わるキャッチコピー） */}
      <section className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-[#070b14] to-[#040810] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ゲーム開発で学ぶ C++ オブジェクト指向＆実践設計メディア</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-tight">
            🐻‍❄️ シロクマC++ラボ
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300 leading-snug">
            動くだけのコードから、現場で生き抜く「一生モノの設計力」へ。
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            ブラウザで遊べるインベーダー風ゲームを段階的にリファクタリング！
            main関数500行のスパゲティコード（C言語）から、クラス化、動的メモリ、vtable、RAII、ECS、そして最新C++20まで。
            実戦に即した「なぜその設計が必要なのか」を体感しながらマスターできます。
          </p>

          {/* 実績バッジ群 */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono text-slate-300">
            <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">全44記事 公開中</span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">完全無料・登録不要</span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-cyan-300">🎮 Webエミュレータ搭載</span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-emerald-300">💻 ブラウザ実行演習完備</span>
          </div>
        </div>
      </section>

      {/* 2. 目的別クイックスタート（迷いをゼロにする最短ルート） */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
            目的から選ぶクイックスタート
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 初心者 */}
          <a
            href="/chapter-1-spaghetti-code"
            onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-1-spaghetti-code'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🐣</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">初級・原点</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">C++をゼロから学ぶ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">まずはここから！500行のスパゲティコードを動かして設計の限界を体感。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span>第1章（L1）へ進む</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* モダンC++ */}
          <a
            href="/chapter-5-smart-pointers-raii"
            onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-5-smart-pointers-raii'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🚀</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">C++11〜20</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">モダンC++を極める</h3>
              <p className="text-xs text-slate-400 leading-relaxed">スマポ、ムーブ、ラムダ、可変引数、ECSなど現代の実戦規格を一気習得。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
              <span>モダン第1章（M1）へ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* コード読解 */}
          <a
            href="/reading-step-1"
            onClick={(e) => { e.preventDefault(); onSelectChapter('reading-step-1'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔍</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">鑑識・実戦</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">他人のコードを読む</h3>
              <p className="text-xs text-slate-400 leading-relaxed">書く前に読む！巨大リポジトリ攻略、スレッド競合、メモリ破壊の鑑識法。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-purple-400">
              <span>読解Step 1（R1）へ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* 文法チートシート */}
          <a
            href="/guide-cpp-syntax-reference"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📖</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">逆引きリファレンス</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">文法急所チートシート</h3>
              <p className="text-xs text-slate-400 leading-relaxed">「ポインタと参照の違いは？」「cast4種は？」実務で迷うポイントを網羅。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
              <span>チートシートを開く</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </section>

      {/* 3. 4大メインコンテンツ（サイトの柱） */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOUR MAIN PILLARS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            シロクマC++ラボを構成する <span className="text-cyan-400">4大コンテンツ</span>
          </h2>
          <p className="text-sm text-slate-400 font-sans mt-1">
            学びたい目的に合わせて、最適な柱から学習を開始できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ピラー 1: クラシック基礎編 */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-amber-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                  全16章（L1〜L16）
                </span>
                <span className="text-xs font-mono text-slate-400">進捗: {classicCompleted} / 16 完了</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>🏛️ クラシックC++基礎編</span>
                </h3>
                <p className="text-xs font-mono text-amber-400 mt-0.5">C言語・C++03 / オブジェクト指向の原点と現場実務</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                main関数500行のベタ書きからスタートし、カプセル化、動的メモリ、継承・vtable、デザインパターンまで段階的にリファクタリング。組込み機器や既存システムの保守にも通じる、C++の基礎体力を鍛え上げます。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-amber-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#L1 構造化の限界</span>
                  <span>#L2 クラス化</span>
                  <span>#L3 動的配列</span>
                  <span>#L4 vtable多態性</span>
                  <span>#L5 State/Observer</span>
                  <span>#L10 CRTP</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/chapter-1-spaghetti-code"
                onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-1-spaghetti-code'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer no-underline"
              >
                <span>第1章（L1）からスタート</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('classic');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全16章の目次を見る ↓
              </button>
            </div>
          </div>

          {/* ピラー 2: モダン実践編 */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-cyan-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  全14章（M1〜M14）
                </span>
                <span className="text-xs font-mono text-slate-400">進捗: {modernCompleted} / 14 完了</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>🚀 モダンC++実践編</span>
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">C++11 / 14 / 17 / 20 規格体系化・ゼロオーバーヘッド設計</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                生ポインタの解放漏れや無駄なコピーを完全撲滅！RAIIスマートポインタ、ムーブセマンティクス、ラムダ、可変引数、string_view、そして新世代ECSアーキテクチャまで、現代のゲーム開発に必須の規格を体系的に網羅。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-cyan-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#M1 スマポ/RAII</span>
                  <span>#M2 ムーブ</span>
                  <span>#M3 ラムダ</span>
                  <span>#M5 マルチスレッド</span>
                  <span>#M6 string_view</span>
                  <span>#M10 ECS設計</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/chapter-5-smart-pointers-raii"
                onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-5-smart-pointers-raii'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer no-underline"
              >
                <span>モダン第1章（M1）からスタート</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('modern');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全14章の目次を見る ↓
              </button>
            </div>
          </div>

          {/* ピラー 3: コード読解演習 */}
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-purple-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                  全6ステップ（R1〜R6）
                </span>
                <span className="text-xs font-mono text-slate-400">進捗: {readingCompleted} / 6 完了</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>🧭 コード読解・現場鑑識演習</span>
                </h3>
                <p className="text-xs font-mono text-purple-400 mt-0.5">現場即戦力・OSS解読・競合＆メモリ破壊捜査</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                「動かないコード」「他人が書いた謎コード」に立ち向かうプロの眼を養成。Box2D物理エンジンの実地解読から、たまにしか起きないマルチスレッド競合（Data Race）、Use-After-FreeとAddressSanitizer解析まで徹底演習。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-purple-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#R1 データフロー</span>
                  <span>#R2 ヘッダ依存</span>
                  <span>#R3 動的多態性</span>
                  <span>#R4 スレッド競合</span>
                  <span>#R5 Box2D解読</span>
                  <span>#R6 メモリ破壊捜査</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/reading-step-1"
                onClick={(e) => { e.preventDefault(); onSelectChapter('reading-step-1'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer no-underline"
              >
                <span>読解Step 1（R1）からスタート</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reading');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全6章の目次を見る ↓
              </button>
            </div>
          </div>

          {/* ピラー 4: 現場特集・チートシート */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-emerald-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  全8ガイド・特別コラム
                </span>
                <span className="text-xs font-mono text-slate-400">現場リファレンス</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>📚 現場特集・実践チートシート</span>
                </h3>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">品質保証・設計ツール・言語思想・逆引き知識</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                カリキュラムの理解を加速させる実務の武器庫。迷ったときにすぐ引ける「C++基本文法チートシート」、テスト駆動開発を体感する「GoogleTest TDD入門」、GoFデザインパターン、UML設計書、言語思想コラムを完備。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-emerald-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#C++文法チートシート</span>
                  <span>#GoogleTest TDD</span>
                  <span>#GoFパターン</span>
                  <span>#UML設計</span>
                  <span>#C++を愛する理由</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/guide-cpp-syntax-reference"
                onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer no-underline"
              >
                <span>文法チートシートを開く</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('guides');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全8ガイドの目次を見る ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. カリキュラム全目次（コンパクト・ディレクトリ） */}
      <section id="curriculum-directory" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>CURRICULUM DIRECTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              カリキュラム全目次（全44章）
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              各章をクリックすると、詳細な解説・対比コード・ブラウザ演習ページが開きます。
            </p>
          </div>

          {/* タブ切り替えボタン */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('classic')}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'classic'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🏛️ クラシック基礎</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">16</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('modern')}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'modern'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🚀 モダン実践</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">14</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reading')}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🧭 コード読解</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">6</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guides'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>📚 現場特集</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">8</span>
            </button>
          </div>
        </div>

        {/* リスト表示 */}
        <div className="space-y-2.5">
          {currentList.map((ch) => {
            const isCompleted = completedChapters.includes(ch.id);
            const chapterCode = getChapterCode(ch);

            // テーマ色の決定
            const badgeStyle = 
              activeTab === 'classic'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                : activeTab === 'modern'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : activeTab === 'reading'
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';

            const hoverBorder =
              activeTab === 'classic'
                ? 'hover:border-amber-400/60'
                : activeTab === 'modern'
                ? 'hover:border-cyan-400/60'
                : activeTab === 'reading'
                ? 'hover:border-purple-400/60'
                : 'hover:border-emerald-400/60';

            return (
              <a
                key={ch.id}
                href={`/${ch.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectChapter(ch.slug);
                }}
                className={`group flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 ${hoverBorder} hover:bg-slate-900 transition-all cursor-pointer no-underline text-inherit`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm font-black border shrink-0 ${badgeStyle}`}>
                    {chapterCode}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {ch.title}
                      </h3>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          完了
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-sans">
                      {ch.subtitle || ch.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                    開く
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 5. サイトの4大特長（なぜゲーム開発で学ぶのか？） */}
      <section className="space-y-6 pt-4 border-t border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEARNING FEATURES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            シロクマC++ラボの <span className="text-cyan-400">4大特長</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            文法暗記ではなく、現場の課題解決と設計思想が体に染み込む学習体験を提供します。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl">
              🎮
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              体感型ゲームリファクタ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              理論だけでなく、画面内で実際に動くインベーダー風ゲームを進化させながら、オブジェクト指向やRAIIの威力を体感できます。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center justify-center text-xl">
              ⚖️
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              ビフォー・アフター徹底対比
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              現場の苦痛（メモリリーク、重複コード、スパゲティ）と、設計適用後の洗練されたコードを横並びで比較して学べます。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl">
              🔬
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              ブラウザ完結プレイグラウンド
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              環境構築は一切不要。ブラウザ内のWebAssemblyエミュレータと実行環境で、クリック1つですぐに動作確認が可能です。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xl">
              🛡️
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              現場鑑識とモダン規格
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              書く技術だけでなく、他人の巨大OSSコードを読み解く鑑識法や、スレッド競合・メモリ破壊の調査手順まで網羅。
            </p>
          </div>
        </div>
      </section>

      {/* 6. フッター前CTAセクション */}
      <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
          👾
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
            さあ、どちらのコースから始めますか？
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            現場の既存資産保守や基盤理解を深めるなら「クラシック基礎編」、モダンC++の新機能をマスターするなら「モダン実践編」。いつでも自由に行き来できます。
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onSelectChapter('chapter-1-spaghetti-code')}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-amber-500/20 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>🏛️ クラシック【L】第1章から開始</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectChapter('chapter-5-smart-pointers-raii')}
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-cyan-500/20 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>🚀 モダン【M】第1章から開始</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. 勉強を頑張った自分へのご褒美・お取り寄せグルメPR */}
      <AffiliatePromoBanner type="reward" limit={3} />

      {/* 8. 姉妹メディア案内セクション */}
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
