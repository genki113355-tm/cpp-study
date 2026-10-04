import React, { useRef, useEffect, useState } from 'react';
import { Download, Menu, BookOpen, Play, Volume2, VolumeX, Gamepad2, Sun, Moon } from 'lucide-react';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, SPECIAL_GUIDES } from '../../data/chapters';
import { audioManager } from '../../utils/audioManager';
import { getAssetUrl } from '../../utils/assetPath';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentChapterId: number;
  onSelectChapter: (slug: string) => void;
  onToggleSidebar: () => void;
  onOpenSourceModal: () => void;
  onOpenPlaygroundModal?: () => void;
  onOpenGameModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentChapterId,
  onSelectChapter,
  onToggleSidebar,
  onOpenSourceModal,
  onOpenPlaygroundModal,
  onOpenGameModal,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => audioManager.getIsMuted());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    return audioManager.subscribe(() => {
      setIsMuted(audioManager.getIsMuted());
    });
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audioManager.toggleMute();
    if (!nextMuted) {
      audioManager.play('powerup');
    }
  };

  // 章切り替え時にアクティブボタンが中央に見えるようにスムーズスクロール
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentChapterId]);

  // マウスホイールの縦回転で横スクロール可能にするUX向上
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/90 backdrop-blur-md shadow-sm transition-colors duration-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-18 py-3 flex items-center justify-between gap-4">
        {/* 左側：サイドバートグル & ロゴ */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="メニューを開く"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none flex-shrink-0" onClick={() => onSelectChapter('top')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-cyan-500 overflow-hidden bg-slate-900 shadow-md flex-shrink-0">
              <img
                src={getAssetUrl('/images/polar-bear-guide-pointing.png')}
                alt="シロクマ先生"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap leading-tight">
                <span className="font-extrabold text-base sm:text-lg lg:text-xl text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  シロクマC++ラボ
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30 font-bold leading-none flex-shrink-0">
                  Lab
                </span>
              </div>
              {/* PC・タブレット向けフルタイトル（改行なし） */}
              <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap leading-none mt-1">
                〜ゲーム開発で学ぶオブジェクト指向開発〜
              </span>
              {/* スマホ向けコンパクトキャッチコピー（1行に収まり改行ゼロ） */}
              <span className="block sm:hidden text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap leading-none mt-0.5">
                ゲーム開発で学ぶOOP設計
              </span>
            </div>
          </div>
        </div>

        {/* 中央：章クイック切り替えボタン（デスクトップ） */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto no-scrollbar min-w-0 flex-1 max-w-[calc(100vw-540px)] whitespace-nowrap select-none"
        >
          <button
            ref={currentChapterId === 0 ? activeItemRef : undefined}
            onClick={() => onSelectChapter('top')}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap cursor-pointer ${
              currentChapterId === 0
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>🏠</span>
            <span>TOP</span>
          </button>

          {/* レガシーC++コースグループ */}
          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800 flex-shrink-0">
            <span className="text-[10px] text-amber-400/80 font-bold px-1 select-none flex-shrink-0 whitespace-nowrap">🏛️ レガシー</span>
            {CLASSIC_CHAPTERS.map((ch) => {
              const isActive = ch.id === currentChapterId;
              const code = (ch.courseChapterCode || `C${ch.id}`).replace(/^C/, 'L');
              return (
                <button
                  key={ch.id}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={() => onSelectChapter(ch.slug)}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center justify-center min-w-[32px] flex-shrink-0 whitespace-nowrap font-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-200 hover:bg-slate-800'
                  }`}
                  title={ch.title}
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* モダンコースグループ */}
          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800 flex-shrink-0">
            <span className="text-[10px] text-cyan-400/80 font-bold px-1 select-none flex-shrink-0 whitespace-nowrap">🚀 モダン</span>
            {MODERN_CHAPTERS.map((ch) => {
              const isActive = ch.id === currentChapterId;
              const code = ch.courseChapterCode || `M${ch.id}`;
              return (
                <button
                  key={ch.id}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={() => onSelectChapter(ch.slug)}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center justify-center min-w-[32px] flex-shrink-0 whitespace-nowrap font-bold ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-cyan-200 hover:bg-slate-800'
                  }`}
                  title={ch.title}
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* 読解演習トラックグループ */}
          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800 flex-shrink-0">
            <span className="text-[10px] text-purple-400/80 font-bold px-1 select-none flex-shrink-0 whitespace-nowrap">🧭 読解</span>
            {READING_CHAPTERS.map((ch) => {
              const isActive = ch.id === currentChapterId;
              const code = ch.courseChapterCode || `R${ch.id}`;
              return (
                <button
                  key={ch.id}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={() => onSelectChapter(ch.slug)}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center justify-center min-w-[32px] flex-shrink-0 whitespace-nowrap font-bold ${
                    isActive
                      ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-200 hover:bg-slate-800'
                  }`}
                  title={ch.title}
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* 特集・品質保証グループ */}
          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800 flex-shrink-0">
            <span className="text-[10px] text-emerald-400/80 font-bold px-1 select-none flex-shrink-0 whitespace-nowrap">📚 特集</span>
            {SPECIAL_GUIDES.map((guide) => {
              const isActive = guide.id === currentChapterId;
              const isColumn = guide.category === 'column';
              const guideShortNames: Record<string, string> = {
                'guide-cpp-syntax-reference': '文法',
                'guide-googletest-tdd': 'TDD',
                'guide-code-reading': '読解術',
                'column-design-patterns': 'DP',
                'guide-uml-design': 'UML',
                'column-why-cpp-is-great': '魅力',
                'column-why-cpp-is-hard': '思想',
                'guide-environment-setup': '環境',
              };
              return (
                <button
                  key={guide.id}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={() => onSelectChapter(guide.slug)}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center justify-center flex-shrink-0 whitespace-nowrap text-[11px] font-sans font-bold ${
                    isActive
                      ? isColumn
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                        : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : isColumn
                        ? 'text-slate-600 dark:text-slate-400 hover:text-purple-200 hover:bg-slate-800'
                        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-200 hover:bg-slate-800'
                  }`}
                  title={guide.title}
                >
                  {guideShortNames[guide.slug] || guide.badge}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右側：テーマ切替 ＆ コード実行ラボ ＆ 音声切替 ＆ ソースコードダウンロード & ガイド */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* ☀️/🌙 ライト・ダークテーマ切り替えボタン */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-amber-400 shadow-sm"
            title={theme === 'dark' ? 'ライトモードに切り替え（白基調ですっきり読む）' : 'ダークモードに切り替え（黒基調のIDEスタイル）'}
            aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* グローバル音量・ミュートボタン */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
              isMuted
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                : 'bg-cyan-100 border-cyan-400 text-cyan-800 dark:bg-cyan-950/80 dark:border-cyan-500/50 dark:text-cyan-300 shadow-sm'
            }`}
            title={isMuted ? 'サウンドをONにする（オフィス・電車内配慮のため初期ミュート中）' : 'サウンドをミュート（消音）にする'}
            aria-label={isMuted ? '音声を有効化' : '音声をミュート'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
            )}
          </button>

          {/* 🎮 Webエミュレータ（ゲーム起動）クイックボタン */}
          {onOpenGameModal && (
            <button
              onClick={onOpenGameModal}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:via-teal-500/25 hover:to-cyan-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 dark:border-emerald-500/50 text-xs sm:text-sm font-mono font-bold transition shadow-sm active:scale-95 cursor-pointer"
              title="ブラウザでインベーダー風ゲーム（Webエミュレータ）を起動して遊ぶ"
            >
              <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="hidden min-[480px]:inline">ゲーム起動</span>
              <span className="inline min-[480px]:hidden">ゲーム</span>
            </button>
          )}

          {/* C++オンライン実行ラボ（Playground） */}
          {onOpenPlaygroundModal && (
            <button
              onClick={onOpenPlaygroundModal}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 hover:from-cyan-500/25 hover:to-blue-500/25 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40 text-xs sm:text-sm font-mono font-bold transition shadow-sm active:scale-95 cursor-pointer"
              title="ブラウザでC++コードを書いて即時実行する"
            >
              <Play className="w-3.5 h-3.5 fill-current text-cyan-600 dark:text-cyan-400" />
              <span className="hidden min-[420px]:inline">コード実行ラボ</span>
              <span className="inline min-[420px]:hidden">実行</span>
            </button>
          )}

          <button
            onClick={onOpenSourceModal}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:hover:text-white dark:border-slate-700 text-xs sm:text-sm font-mono font-bold transition active:scale-95 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">C++実機コード</span>
          </button>

          <a
            href="https://isocpp.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 text-sm flex items-center gap-1 transition"
            title="ISO C++ Standard"
          >
            <BookOpen className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
