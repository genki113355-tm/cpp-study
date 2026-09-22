import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, X, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { ALL_CHAPTERS, CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, SPECIAL_GUIDES, UPCOMING_CHAPTERS } from '../../data/chapters';
import { CourseTrack } from '../../types/curriculum';
import { getChapterMeta } from '../../data/chapterMetadata';
import { getAssetUrl } from '../../utils/assetPath';

interface SidebarProps {
  currentChapterSlug: string;
  onSelectChapter: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
  completedChapters: number[];
  onToggleComplete: (id: number) => void;
  onOpenMilestoneModal?: () => void;
}

const getCleanSidebarTitle = (title: string): string => {
  // 1. 先頭の「レガシー第1章：」や「モダン第1章：」などのプレフィックスを除去（最初のコロンまで）
  let clean = title.replace(/^[^：:]+[：:]\s*/, '');
  // 2. （ビフォー：...）や（アフター：...）の注記を除去して本質的なタイトルを残す
  clean = clean.replace(/（(?:ビフォー|アフター)[：:].*?）/g, '');
  // 3. （豪華さアップ...）や（敵のバリエーション...）など冗長な括弧注記を除去
  clean = clean.replace(/（(?:豪華さアップ|敵のバリエーション).*?）/g, '');
  return clean.trim();
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentChapterSlug,
  onSelectChapter,
  isOpen,
  onClose,
  completedChapters,
  onToggleComplete,
  onOpenMilestoneModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | CourseTrack>('all');
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState<boolean>(false);

  const [expandedCategories, setExpandedCategories] = useState<{
    classic: boolean;
    modern: boolean;
    reading: boolean;
    guide: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('cpp_study_sidebar_categories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      classic: true,
      modern: true,
      reading: true,
      guide: true,
    };
  });

  const toggleCategory = (key: 'classic' | 'modern' | 'reading' | 'guide') => {
    setExpandedCategories(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('cpp_study_sidebar_categories', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const areAllExpanded = Object.values(expandedCategories).every(Boolean);

  const toggleAllCategories = () => {
    const nextState = !areAllExpanded;
    const next = {
      classic: nextState,
      modern: nextState,
      reading: nextState,
      guide: nextState,
    };
    setExpandedCategories(next);
    try {
      localStorage.setItem('cpp_study_sidebar_categories', JSON.stringify(next));
    } catch (e) {}
  };

  // 閲覧中の章が属するカテゴリを自動展開
  useEffect(() => {
    if (!currentChapterSlug || currentChapterSlug === 'top') return;

    if (CLASSIC_CHAPTERS.some(ch => ch.slug === currentChapterSlug)) {
      setExpandedCategories(prev => (prev.classic ? prev : { ...prev, classic: true }));
    } else if (MODERN_CHAPTERS.some(ch => ch.slug === currentChapterSlug)) {
      setExpandedCategories(prev => (prev.modern ? prev : { ...prev, modern: true }));
    } else if (READING_CHAPTERS.some(ch => ch.slug === currentChapterSlug)) {
      setExpandedCategories(prev => (prev.reading ? prev : { ...prev, reading: true }));
    } else if (SPECIAL_GUIDES.some(g => g.slug === currentChapterSlug)) {
      setExpandedCategories(prev => (prev.guide ? prev : { ...prev, guide: true }));
    }
  }, [currentChapterSlug]);

  const classicCount = CLASSIC_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const modernCount = MODERN_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const readingCount = READING_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const guideCount = SPECIAL_GUIDES.filter(c => completedChapters.includes(c.id)).length;

  return (
    <>
      {/* モバイル用オーバーレイ背景 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`fixed md:sticky top-0 md:top-[4.5rem] z-50 md:z-20 h-screen md:h-[calc(100vh-4.5rem)] w-72 sm:w-80 max-w-[85vw] shrink-0 bg-[#0c121e] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain scrollbar-thin ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* モバイル時のヘッダー閉じるボタン */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 md:hidden">
          <span className="font-mono text-sm font-bold text-slate-200">カリキュラム目次</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 全体進捗バー（全体系総合） */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-sm mb-2 font-mono">
            <span className="text-slate-300 font-medium">カリキュラム達成率</span>
            <span className="text-cyan-400 font-bold text-base">
              {Math.round((completedChapters.length / ALL_CHAPTERS.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-purple-500 transition-all duration-300"
              style={{
                width: `${(completedChapters.length / ALL_CHAPTERS.length) * 100}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-3 text-[10px] text-slate-400 mt-2.5 font-mono gap-1 text-center">
            <span className="bg-slate-900/80 py-1 rounded border border-slate-800">🏛️ {classicCount}/{CLASSIC_CHAPTERS.length}</span>
            <span className="bg-slate-900/80 py-1 rounded border border-slate-800">🚀 {modernCount}/{MODERN_CHAPTERS.length}</span>
            <span className="bg-slate-900/80 py-1 rounded border border-slate-800">🧭 {readingCount}/{READING_CHAPTERS.length}</span>
          </div>

          {onOpenMilestoneModal && (
            <button
              onClick={onOpenMilestoneModal}
              className="mt-3 w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>🏆 修了証・進捗引継ぎ</span>
            </button>
          )}
        </div>

        {/* カリキュラム章リスト */}
        <div className="p-3 space-y-2">
          {/* コース切り替えタブボタン */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[9.5px] sm:text-[10px] font-mono whitespace-nowrap select-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-1 rounded-lg font-bold transition text-center whitespace-nowrap px-0.5 ${
                activeTab === 'all'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              全一覧
            </button>
            <button
              onClick={() => setActiveTab('classic')}
              className={`py-1 rounded-lg font-bold transition text-center whitespace-nowrap px-0.5 ${
                activeTab === 'classic'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              🏛️ 現場
            </button>
            <button
              onClick={() => setActiveTab('modern')}
              className={`py-1 rounded-lg font-bold transition text-center whitespace-nowrap px-0.5 ${
                activeTab === 'modern'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              🚀 モダン
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`py-1 rounded-lg font-bold transition text-center whitespace-nowrap px-0.5 ${
                activeTab === 'reading'
                  ? 'bg-purple-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              🧭 読解
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-1 rounded-lg font-bold transition text-center whitespace-nowrap px-0.5 ${
                activeTab === 'guide'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              📚 特集
            </button>
          </div>

          {/* TOPページ（概要・全章マップ） */}
          <div
            className={`group relative rounded-xl p-3 transition-all duration-150 cursor-pointer border flex items-center justify-between ${
              currentChapterSlug === 'top'
                ? 'bg-slate-800/95 border-cyan-500/60 shadow-lg shadow-cyan-950/40 text-cyan-300'
                : 'border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
            }`}
            onClick={() => {
              onSelectChapter('top');
              if (window.innerWidth < 768) onClose();
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🏠</span>
              <div>
                <span className="text-xs sm:text-sm font-bold font-sans block">
                  はじめに・全体ロードマップ
                </span>
                <span className="text-[11px] text-slate-400 font-mono block">
                  ラボ概要 ＆ コース対比ガイド
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500 group-hover:text-cyan-400 font-mono">▶</span>
          </div>

          {/* 一括開閉ツールバー（全一覧タブ時のみ表示） */}
          {activeTab === 'all' && (
            <div className="flex items-center justify-between px-1.5 pt-2 pb-0.5 text-[10.5px] font-mono text-slate-400 select-none">
              <span className="font-semibold text-slate-400">カテゴリ一覧</span>
              <button
                type="button"
                onClick={toggleAllCategories}
                className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{areAllExpanded ? 'すべて折りたたむ' : 'すべて展開'}</span>
                <ChevronDown
                  className={`w-3 h-3 text-cyan-400 transition-transform duration-200 ${
                    areAllExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          )}

          {/* 🏛️ レガシーC++コースセクション */}
          {(activeTab === 'all' || activeTab === 'classic') && (
            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => toggleCategory('classic')}
                className="w-full px-2 py-1.5 text-[11px] font-mono font-bold text-amber-400/90 uppercase tracking-wider flex items-center justify-between gap-1 rounded-lg hover:bg-amber-950/40 transition cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 transition-transform duration-200 shrink-0 ${
                      activeTab === 'classic' || expandedCategories.classic ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                  <span className="truncate">🏛️ レガシーC++（現場実務）</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {classicCount}/{CLASSIC_CHAPTERS.length}
                  </span>
                  <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    L1〜L{CLASSIC_CHAPTERS.length}
                  </span>
                </div>
              </button>

              {(activeTab === 'classic' || expandedCategories.classic) && (
                <div className="space-y-1.5">
                  {CLASSIC_CHAPTERS.map((ch) => {
                    const isActive = ch.slug === currentChapterSlug;
                    const isCompleted = completedChapters.includes(ch.id);
                    const chNum = (ch.courseChapterCode || `C${ch.id}`).replace(/^[CML]/, '');
                    const meta = getChapterMeta(ch);

                    return (
                      <div
                        key={ch.id}
                        className={`group relative rounded-xl p-2.5 transition-all duration-150 cursor-pointer border ${
                          isActive
                            ? 'bg-amber-950/30 border-amber-500/60 shadow-md shadow-amber-950/30'
                            : 'border-transparent hover:bg-slate-800/60 hover:border-slate-700/60'
                        }`}
                        onClick={() => {
                          onSelectChapter(ch.slug);
                          if (window.innerWidth < 768) onClose();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(ch.id);
                            }}
                            className="text-slate-500 hover:text-amber-400 transition flex-shrink-0"
                            title={isCompleted ? '未完了に戻す' : '完了にする'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-mono font-bold ${
                              isActive ? 'text-amber-300' : 'text-slate-200'
                            }`}
                          >
                            【L】第{chNum}章
                          </span>
                          <span className="ml-auto text-[10px] font-mono text-slate-500 group-hover:text-slate-400 shrink-0">
                            {meta.readingTimeMinutes}分
                          </span>
                        </div>

                        <div className="mt-1 pl-6">
                          <p
                            className={`text-xs font-medium leading-snug line-clamp-2 break-words ${
                              isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-slate-100'
                            }`}
                          >
                            {getCleanSidebarTitle(ch.title)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 🚀 モダンコースセクション */}
          {(activeTab === 'all' || activeTab === 'modern') && (
            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => toggleCategory('modern')}
                className="w-full px-2 py-1.5 text-[11px] font-mono font-bold text-cyan-400/90 uppercase tracking-wider flex items-center justify-between gap-1 rounded-lg hover:bg-cyan-950/40 transition cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-cyan-400/70 group-hover:text-cyan-300 transition-transform duration-200 shrink-0 ${
                      activeTab === 'modern' || expandedCategories.modern ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                  <span className="truncate">🚀 モダンC++（新世代）</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {modernCount}/{MODERN_CHAPTERS.length}
                  </span>
                  <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30 flex-shrink-0">
                    M1〜M{MODERN_CHAPTERS.length}
                  </span>
                </div>
              </button>

              {(activeTab === 'modern' || expandedCategories.modern) && (
                <div className="space-y-1.5">
                  {MODERN_CHAPTERS.map((ch) => {
                    const isActive = ch.slug === currentChapterSlug;
                    const isCompleted = completedChapters.includes(ch.id);
                    const chNum = (ch.courseChapterCode || `M${ch.id}`).replace(/^[CML]/, '');
                    const meta = getChapterMeta(ch);

                    return (
                      <div
                        key={ch.id}
                        className={`group relative rounded-xl p-2.5 transition-all duration-150 cursor-pointer border ${
                          isActive
                            ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                            : 'border-transparent hover:bg-slate-800/60 hover:border-slate-700/60'
                        }`}
                        onClick={() => {
                          onSelectChapter(ch.slug);
                          if (window.innerWidth < 768) onClose();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(ch.id);
                            }}
                            className="text-slate-500 hover:text-cyan-400 transition flex-shrink-0"
                            title={isCompleted ? '未完了に戻す' : '完了にする'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-mono font-bold ${
                              isActive ? 'text-cyan-300' : 'text-slate-200'
                            }`}
                          >
                            【M】第{chNum}章
                          </span>
                          <span className="ml-auto text-[10px] font-mono text-slate-500 group-hover:text-slate-400 shrink-0">
                            {meta.readingTimeMinutes}分
                          </span>
                        </div>

                        <div className="mt-1 pl-6">
                          <p
                            className={`text-xs font-medium leading-snug line-clamp-2 break-words ${
                              isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-slate-100'
                            }`}
                          >
                            {getCleanSidebarTitle(ch.title)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 🧭 コード読解演習トラックセクション */}
          {(activeTab === 'all' || activeTab === 'reading') && (
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => toggleCategory('reading')}
                className="w-full px-2 py-1.5 text-[11px] font-mono font-bold text-purple-400/90 uppercase tracking-wider flex items-center justify-between gap-1 rounded-lg hover:bg-purple-950/40 transition cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-purple-400/70 group-hover:text-purple-300 transition-transform duration-200 shrink-0 ${
                      activeTab === 'reading' || expandedCategories.reading ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                  <span className="truncate">🧭 コード読解（現場鑑識）</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {readingCount}/{READING_CHAPTERS.length}
                  </span>
                  <span className="text-[10px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 flex-shrink-0">
                    R1〜R{READING_CHAPTERS.length}
                  </span>
                </div>
              </button>

              {(activeTab === 'reading' || expandedCategories.reading) && (
                <div className="space-y-1.5">
                  {READING_CHAPTERS.map((ch) => {
                    const isActive = ch.slug === currentChapterSlug;
                    const isCompleted = completedChapters.includes(ch.id);
                    const chNum = (ch.courseChapterCode || `R${ch.id}`).replace(/^[CMR]/, '');
                    const meta = getChapterMeta(ch);

                    return (
                      <div
                        key={ch.id}
                        className={`group relative rounded-xl p-2.5 transition-all duration-150 cursor-pointer border ${
                          isActive
                            ? 'bg-purple-950/30 border-purple-500/60 shadow-md shadow-purple-950/30'
                            : 'border-transparent hover:bg-slate-800/60 hover:border-slate-700/60'
                        }`}
                        onClick={() => {
                          onSelectChapter(ch.slug);
                          if (window.innerWidth < 768) onClose();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(ch.id);
                            }}
                            className="text-slate-500 hover:text-purple-400 transition flex-shrink-0"
                            title={isCompleted ? '未完了に戻す' : '完了にする'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-mono font-bold ${
                              isActive ? 'text-purple-300' : 'text-slate-200'
                            }`}
                          >
                            【R】Step {chNum}
                          </span>
                          <span className="ml-auto text-[10px] font-mono text-slate-500 group-hover:text-slate-400 shrink-0">
                            {meta.readingTimeMinutes}分
                          </span>
                        </div>

                        <div className="mt-1 pl-6">
                          <p
                            className={`text-xs font-medium leading-snug line-clamp-2 break-words ${
                              isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-slate-100'
                            }`}
                          >
                            {getCleanSidebarTitle(ch.title)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 📚 特集ガイド＆実践コラムセクション */}
          {(activeTab === 'all' || activeTab === 'guide') && (
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => toggleCategory('guide')}
                className="w-full px-2 py-1.5 text-[11px] font-mono font-bold text-emerald-400/90 uppercase tracking-wider flex items-center justify-between gap-1 rounded-lg hover:bg-emerald-950/40 transition cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-emerald-400/70 group-hover:text-emerald-300 transition-transform duration-200 shrink-0 ${
                      activeTab === 'guide' || expandedCategories.guide ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                  <span className="truncate">📚 特集ガイド＆コラム</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {guideCount}/{SPECIAL_GUIDES.length}
                  </span>
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 flex-shrink-0">
                    現場手引き
                  </span>
                </div>
              </button>

              {(activeTab === 'guide' || expandedCategories.guide) && (
                <div className="space-y-1.5">
                  {SPECIAL_GUIDES.map((guide) => {
                    const isActive = guide.slug === currentChapterSlug;
                    const isCompleted = completedChapters.includes(guide.id);
                    const isColumn = guide.category === 'column';
                    const meta = getChapterMeta(guide);
                    const icon = guide.slug === 'guide-googletest-tdd'
                      ? '🧪'
                      : guide.slug === 'guide-code-reading' 
                      ? '🧭' 
                      : guide.slug === 'column-design-patterns'
                      ? '🧩'
                      : guide.slug === 'column-why-cpp-is-hard'
                      ? '🧠' 
                      : guide.slug === 'column-why-cpp-is-great'
                      ? '🔥'
                      : guide.slug === 'guide-uml-design'
                      ? '📐'
                      : '🛠️';

                    return (
                      <div
                        key={guide.id}
                        className={`group relative rounded-xl p-2.5 transition-all duration-150 cursor-pointer border ${
                          isActive
                            ? isColumn
                              ? 'bg-purple-950/30 border-purple-500/60 shadow-md shadow-purple-950/30'
                              : 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-950/30'
                            : 'border-transparent hover:bg-slate-800/60 hover:border-slate-700/60'
                        }`}
                        onClick={() => {
                          onSelectChapter(guide.slug);
                          if (window.innerWidth < 768) onClose();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(guide.id);
                            }}
                            className="text-slate-500 hover:text-emerald-400 transition flex-shrink-0"
                            title={isCompleted ? '未読了に戻す' : '読了にする'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span className="text-xs">{icon}</span>
                          <span
                            className={`text-xs font-mono font-bold ${
                              isActive 
                                ? isColumn ? 'text-purple-300' : 'text-emerald-300'
                                : 'text-slate-200'
                            }`}
                          >
                            {guide.badge}
                          </span>
                          <span className="ml-auto text-[10px] font-mono text-slate-500 group-hover:text-slate-400 shrink-0">
                            {meta.readingTimeMinutes}分
                          </span>
                        </div>

                        <div className="mt-1 pl-6">
                          <p
                            className={`text-xs font-medium leading-relaxed line-clamp-2 break-words ${
                              isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-slate-100'
                            }`}
                          >
                            {guide.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 続編ロードマップがある場合のみ表示（開閉アコーディオン） */}
        {UPCOMING_CHAPTERS.length > 0 && (
          <div className="p-3 mt-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
              className="w-full px-2 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center justify-between rounded-xl hover:bg-slate-900/60 transition"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>長期拡張構想 ({UPCOMING_CHAPTERS.length}章)</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                <span>{isUpcomingExpanded ? '閉じる' : '展開'}</span>
                {isUpcomingExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {isUpcomingExpanded && (
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {UPCOMING_CHAPTERS.map((futureCh) => {
                  const isClassic = futureCh.track === 'classic';
                  const isModern = futureCh.track === 'modern';
                  return (
                    <div
                      key={futureCh.id}
                      onClick={() => onSelectChapter('top')}
                      className={`rounded-xl p-2.5 bg-slate-900/40 border border-dashed text-slate-400 select-none hover:bg-slate-900 transition-colors cursor-pointer ${
                        isClassic
                          ? 'border-amber-500/20 hover:border-amber-500/50'
                          : isModern
                          ? 'border-cyan-500/20 hover:border-cyan-500/50'
                          : 'border-purple-500/20 hover:border-purple-500/50'
                      }`}
                      title="トップページのロードマップで詳細を確認"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-mono font-bold ${
                          isClassic ? 'text-amber-300' : isModern ? 'text-cyan-300' : 'text-purple-300'
                        }`}>
                          {futureCh.title.match(/【[A-Z0-9]+】/)?.[0] || '拡張'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                          {futureCh.badge.replace('（準備中）', '')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-0.5 font-sans font-medium line-clamp-1">
                        {futureCh.title.replace(/【[A-Z0-9]+】\s*/, '')}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 font-sans mt-0.5">
                        {futureCh.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4サイト連携エコシステムへの導線（サイトワイド外部リンクによるペナルティリスクを回避し、TOPの公式エコシステムへ誘導） */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => {
              onSelectChapter('top');
              onClose?.();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition flex items-center justify-between group cursor-pointer"
          >
            <span className="flex items-center gap-1.5 truncate">
              <span>🌐</span>
              <span>4サイト連携エコシステム</span>
            </span>
            <span className="text-slate-500 group-hover:text-cyan-400 font-mono text-xs">→</span>
          </button>
        </div>

        {/* キャラクター紹介（シロクマ先生 & ペンギンくん） */}
        <div className="mt-auto border-t border-cyan-500/20 p-4 pb-6 bg-[#080d1a]/80 space-y-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={getAssetUrl('/images/polar-bear-guide-pointing.png')}
              alt="シロクマ先生"
              className="w-10 h-10 rounded-full border-2 border-cyan-500 object-cover bg-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            />
            <div>
              <p className="text-sm font-bold text-white leading-none mb-1">シロクマ先生 (Sensei)</p>
              <p className="text-[10px] text-slate-400">低レイヤ・数理アルゴリズム専門家</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={getAssetUrl('/images/penguin-guide-simple.jpg')}
              alt="ペンギンくん"
              className="w-10 h-10 rounded-full border-2 border-slate-500 object-cover bg-slate-900 shadow"
            />
            <div>
              <p className="text-sm font-bold text-white leading-none mb-1">ペンギンくん (Penguin)</p>
              <p className="text-[10px] text-slate-400">手動評価に苦しむ若手エンジニア</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

