import React from 'react';
import { Network, ArrowLeft, ChevronRight } from 'lucide-react';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, SPECIAL_GUIDES } from '../../data/chapters';

interface SiteMapPageProps {
  onNavigate: (slug: string) => void;
}

export const SiteMapPage: React.FC<SiteMapPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10 font-sans text-slate-800 dark:text-slate-200">
      {/* パンくずリスト */}
      <nav aria-label="パンくずナビゲーション" className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onNavigate('top')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1 cursor-pointer"
        >
          <span>TOP</span>
        </button>
        <span>/</span>
        <span className="text-cyan-700 dark:text-cyan-400 font-semibold">サイトマップ (HTML Sitemap)</span>
      </nav>

      {/* ページタイトルヘッダー */}
      <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-bold">
          <Network className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>CURRICULUM INDEX & SITEMAP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          サイトマップ（全カリキュラム目録）
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
          シロクマC++ラボで公開中の全52記事（クラシックC++編12章、モダンC++編14章、現場コード読解編13章、特集解説13編）および主要固定ページの一覧です。
        </p>
      </header>

      {/* 主要固定ページ */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
          <span>🏛️</span>
          <span>サイト基本情報・ポリシー</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <button
            onClick={() => onNavigate('top')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <div className="font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-slate-900 dark:group-hover:text-white">TOPページ</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">総合カリキュラム案内</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <div className="font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-slate-900 dark:group-hover:text-white">当サイトについて</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">理念・E-E-A-T・検証体制</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <div className="font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-slate-900 dark:group-hover:text-white">プライバシーポリシー</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">広告・免責事項・規約</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <div className="font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-slate-900 dark:group-hover:text-white">お問い合わせ窓口</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">誤植報告・技術相談</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
          </button>
        </div>
      </section>

      {/* トラック1: レガシーC++編 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-amber-300 dark:border-amber-500/30 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <span>🏛️</span>
            <span>レガシーC++編（全12章・生ポインタと手続き型の限界を体感）</span>
          </h2>
          <span className="text-xs font-mono text-amber-700 dark:text-amber-400/80">L1 〜 L12</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {CLASSIC_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => onNavigate(ch.slug)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 text-left transition flex items-start gap-2.5 group cursor-pointer shadow-sm dark:shadow-none"
            >
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-mono font-bold flex-shrink-0">
                L{idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-800 dark:group-hover:text-amber-200 truncate">
                  {ch.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5">
                  {ch.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* トラック2: モダンC++編 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-cyan-300 dark:border-cyan-500/30 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
            <span>🚀</span>
            <span>モダンC++編（全14章・RAII・ECS・C++17/20実践設計）</span>
          </h2>
          <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400/80">M1 〜 M14</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {MODERN_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => onNavigate(ch.slug)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500/40 text-left transition flex items-start gap-2.5 group cursor-pointer shadow-sm dark:shadow-none"
            >
              <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 font-mono font-bold flex-shrink-0">
                M{idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-800 dark:group-hover:text-cyan-200 truncate">
                  {ch.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5">
                  {ch.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* トラック3: 読解演習トラック */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-purple-300 dark:border-purple-500/30 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2">
            <span>🧭</span>
            <span>読解演習トラック（全13ステップ・現場コードの鑑識眼）</span>
          </h2>
          <span className="text-xs font-mono text-purple-700 dark:text-purple-400/80">R1 〜 R13</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {READING_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => onNavigate(ch.slug)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 text-left transition flex items-start gap-2.5 group cursor-pointer shadow-sm dark:shadow-none"
            >
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 font-mono font-bold flex-shrink-0">
                R{idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-800 dark:group-hover:text-purple-200 truncate">
                  {ch.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5">
                  {ch.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* トラック4: 特集解説・リファレンス */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-300 dark:border-emerald-500/30 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span>📚</span>
            <span>特集コラム・文法チートシート・品質保証（全13編）</span>
          </h2>
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400/80">GUIDE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {SPECIAL_GUIDES.map((guide) => (
            <button
              key={guide.id}
              onClick={() => onNavigate(guide.slug)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/40 text-left transition flex items-start gap-2.5 group cursor-pointer shadow-sm dark:shadow-none"
            >
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-mono font-bold flex-shrink-0">
                GUIDE
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 truncate">
                  {guide.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5">
                  {guide.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* フッターナビゲーション */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => onNavigate('top')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-sm font-semibold transition cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>TOPへ戻る</span>
        </button>
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => onNavigate('privacy')}
            className="text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            プライバシーポリシー ➔
          </button>
        </div>
      </div>
    </div>
  );
};
