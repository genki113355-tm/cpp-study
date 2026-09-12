import React from 'react';
import { Download, Menu, BookOpen } from 'lucide-react';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, SPECIAL_GUIDES } from '../../data/chapters';

interface NavbarProps {
  currentChapterId: number;
  onSelectChapter: (slug: string) => void;
  onToggleSidebar: () => void;
  onOpenSourceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentChapterId,
  onSelectChapter,
  onToggleSidebar,
  onOpenSourceModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-18 py-3 flex items-center justify-between gap-4">
        {/* 左側：サイドバートグル & ロゴ */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="メニューを開く"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectChapter('top')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <span className="text-xl">👾</span>
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center gap-2 font-sans">
                <span>C++ OOP Invader</span>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                  Lab
                </span>
              </span>
              <span className="text-xs text-slate-400 block -mt-0.5">
                インベーダー育成型オブジェクト指向講座
              </span>
            </div>
          </div>
        </div>

        {/* 中央：章クイック切り替えボタン（デスクトップ） */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => onSelectChapter('top')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              currentChapterId === 0
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>🏠</span>
            <span>TOP</span>
          </button>

          {/* レガシーC++コースグループ */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <span className="text-[10px] text-amber-400/80 font-bold px-1 select-none">🏛️ レガシー</span>
            {CLASSIC_CHAPTERS.map((ch) => {
              const isActive = ch.id === currentChapterId;
              const chapterShortNames: Record<string, string> = {
                L1: 'スパゲティ',
                L2: 'クラス化',
                L3: '寿命管理',
                L4: '継承・多態',
                L5: 'パターン',
                L6: 'ベクトル',
              };
              const code = (ch.courseChapterCode || `C${ch.id}`).replace(/^C/, 'L');
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChapter(ch.slug)}
                  className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                      : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800'
                  }`}
                  title={ch.title}
                >
                  <span className="font-bold">{code}</span>
                  <span className="text-[10px] opacity-80 font-sans hidden 2xl:inline">
                    {chapterShortNames[code] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* モダンコースグループ */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <span className="text-[10px] text-cyan-400/80 font-bold px-1 select-none">🚀 モダン</span>
            {MODERN_CHAPTERS.map((ch) => {
              const isActive = ch.id === currentChapterId;
              const chapterShortNames: Record<string, string> = {
                M1: 'スマポ',
                M2: 'ムーブ',
                M3: 'ECS合成',
                M4: '型安全',
              };
              const code = ch.courseChapterCode || `M${ch.id}`;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChapter(ch.slug)}
                  className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800'
                  }`}
                  title={ch.title}
                >
                  <span className="font-bold">{code}</span>
                  <span className="text-[10px] opacity-80 font-sans hidden 2xl:inline">
                    {chapterShortNames[code] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 読解演習トラックグループ */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <span className="text-[10px] text-purple-400/80 font-bold px-1 select-none">🧭 読解</span>
            {READING_CHAPTERS.map((ch) => {
              const isActive = ch.id === currentChapterId;
              const chapterShortNames: Record<string, string> = {
                R1: '初級フロー',
                R2: '中級ヘッダ',
                R3: '上級多態性',
              };
              const code = ch.courseChapterCode || `R${ch.id}`;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChapter(ch.slug)}
                  className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/30'
                      : 'text-slate-400 hover:text-purple-200 hover:bg-slate-800'
                  }`}
                  title={ch.title}
                >
                  <span className="font-bold">{code}</span>
                  <span className="text-[10px] opacity-80 font-sans hidden 2xl:inline">
                    {chapterShortNames[code] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 特集・品質保証グループ */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <span className="text-[10px] text-emerald-400/80 font-bold px-1 select-none">📚 特集</span>
            {SPECIAL_GUIDES.map((guide) => {
              const isActive = guide.id === currentChapterId;
              const guideShortNames: Record<string, string> = {
                'guide-googletest-tdd': '品質・TDD',
                'guide-code-reading': '読解術',
                'column-why-cpp-is-hard': '思想コラム',
                'guide-environment-setup': '環境構築',
                'guide-uml-design': 'UML設計',
              };
              return (
                <button
                  key={guide.id}
                  onClick={() => onSelectChapter(guide.slug)}
                  className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1 text-[11px] font-sans ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-emerald-200 hover:bg-slate-800'
                  }`}
                  title={guide.title}
                >
                  <span>{guideShortNames[guide.slug] || guide.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右側：ソースコードダウンロード & ガイド */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSourceModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-mono font-bold transition border border-slate-700 active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">C++実機コード</span>
          </button>

          <a
            href="https://isocpp.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm flex items-center gap-1"
            title="ISO C++ Standard"
          >
            <BookOpen className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
