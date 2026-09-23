import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS, getChapterBySlug, SLUG_REDIRECT_MAP } from './data/chapters';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { useSEO } from './hooks/useSEO';
import { loadCompletedChapters, saveCompletedChapters } from './utils/progressManager';

// カリキュラムに実在する有効な章ID一覧（不整合防御用）
const VALID_CHAPTER_IDS = ALL_CHAPTERS.map((c) => c.id);

// コード分割（Code Splitting）による初期読み込みの超軽量化
const TopPageView = React.lazy(() => 
  import('./components/curriculum/TopPageView').then((m) => ({ default: m.TopPageView }))
);
const ChapterView = React.lazy(() => 
  import('./components/curriculum/ChapterView').then((m) => ({ default: m.ChapterView }))
);
const SourceModal = React.lazy(() => 
  import('./components/layout/SourceModal').then((m) => ({ default: m.SourceModal }))
);
const OnlinePlaygroundModal = React.lazy(() => 
  import('./components/playground/OnlinePlaygroundModal').then((m) => ({ default: m.OnlinePlaygroundModal }))
);
const MilestoneModal = React.lazy(() => 
  import('./components/curriculum/MilestoneModal').then((m) => ({ default: m.MilestoneModal }))
);
const GameEmulator = React.lazy(() => 
  import('./components/emulator/GameEmulator').then((m) => ({ default: m.GameEmulator }))
);

type GlobalGameVersion = 'v1_spaghetti' | 'v2_classes' | 'v3_dynamic' | 'v4_polymorphism' | 'v5_smart_pointers' | 'v6_patterns' | 'v7_ecs_final';

const PageLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-cyan-400 font-mono">
    <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    <span className="text-sm tracking-widest text-slate-400">LOADING CURRICULUM...</span>
  </div>
);

const getSlugFromUrl = (): string => {
  let path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (path === 'cpp') return 'top';
  if (path.startsWith('cpp/')) path = path.slice(4);

  if (path && getChapterBySlug(path)) return path;

  const hash = window.location.hash.replace('#', '');
  if (hash && getChapterBySlug(hash)) return hash;

  return 'top';
};

export const App: React.FC = () => {
  const [currentSlug, setCurrentSlug] = useState<string>(getSlugFromUrl);

  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    return loadCompletedChapters(VALID_CHAPTER_IDS);
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [isPlaygroundModalOpen, setIsPlaygroundModalOpen] = useState<boolean>(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState<boolean>(false);
  const [isGlobalGameModalOpen, setIsGlobalGameModalOpen] = useState<boolean>(false);
  const [globalGameVersion, setGlobalGameVersion] = useState<GlobalGameVersion>('v2_classes');
  const [globalGameChapterCode, setGlobalGameChapterCode] = useState<string>('L2');
  const [globalGameChapterTitle, setGlobalGameChapterTitle] = useState<string>('クラス化とファイル分割');

  const handleOpenGameModal = (
    version?: GlobalGameVersion,
    code?: string,
    title?: string
  ) => {
    if (version) setGlobalGameVersion(version);
    if (code) setGlobalGameChapterCode(code);
    if (title) setGlobalGameChapterTitle(title);
    setIsGlobalGameModalOpen(true);
  };

  // 初回ロード時のURL正規化（旧ハッシュURLや旧スラグで訪問された場合に正規クリーンパスへ補正）
  useEffect(() => {
    const isSub = window.location.pathname.startsWith('/cpp');
    const prefix = isSub ? '/cpp' : '';
    const hash = window.location.hash.replace('#', '');

    let path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    if (path.startsWith('cpp/')) path = path.slice(4);

    // 旧スラグからの自動補正
    if (path && SLUG_REDIRECT_MAP[path]) {
      const canonicalSlug = SLUG_REDIRECT_MAP[path];
      window.history.replaceState(null, '', `${prefix}/${canonicalSlug}`);
      setCurrentSlug(canonicalSlug);
      return;
    }

    if (hash) {
      const resolvedSlug = SLUG_REDIRECT_MAP[hash] || hash;
      if (getChapterBySlug(resolvedSlug)) {
        window.history.replaceState(null, '', `${prefix}/${resolvedSlug}`);
        setCurrentSlug(resolvedSlug);
        return;
      }
    }

    if (currentSlug === 'top' && window.location.hash) {
      window.history.replaceState(null, '', prefix || '/');
    }
  }, []);

  // ブラウザの「戻る」「進む」キー操作（popstate）対応
  useEffect(() => {
    const handlePopState = () => {
      setCurrentSlug(getSlugFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentChapter = getChapterBySlug(currentSlug);

  // SEOメタ情報（title, description, OGP, canonical, JSON-LD）の動的同期
  useSEO({ currentSlug, chapter: currentChapter });

  // Google アナリティクス (GA4) ページビュー送信
  useEffect(() => {
    const siteBaseTitle = 'シロクマC++ラボ 〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜';
    const pageTitle = currentSlug === 'top' || !currentChapter
      ? siteBaseTitle
      : `${currentChapter.title} | シロクマC++ラボ`;

    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: currentSlug === 'top' ? '/' : `/${currentSlug}`,
      });
    }
  }, [currentSlug, currentChapter]);

  // 完了状態の保存（実在性バリデーション＆サニタイズ適用）
  const handleToggleComplete = (id: number) => {
    setCompletedChapters((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return saveCompletedChapters(next, VALID_CHAPTER_IDS);
    });
  };

  const handleMarkComplete = (id: number) => {
    setCompletedChapters((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      return saveCompletedChapters(next, VALID_CHAPTER_IDS);
    });
  };

  const activeChapter = currentChapter || ALL_CHAPTERS[0];
  const currentChapterId = currentSlug === 'top' ? 0 : activeChapter.id;

  // 章選択時のクリーンURL遷移（HTML5 pushState、/cpp/ サブディレクトリを自動考慮）
  const handleSelectChapter = (slug: string) => {
    setCurrentSlug(slug);
    const isSub = window.location.pathname.startsWith('/cpp');
    const prefix = isSub ? '/cpp' : '';
    const targetPath = slug === 'top' ? (prefix || '/') : `${prefix}/${slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans overflow-x-clip">
      {/* ナビゲーションバー */}
      <Navbar
        currentChapterId={currentChapterId}
        onSelectChapter={handleSelectChapter}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        onOpenPlaygroundModal={() => setIsPlaygroundModalOpen(true)}
        onOpenGameModal={() => handleOpenGameModal('v2_classes', 'L2', 'クラス化とファイル分割')}
      />

      {/* メインエリア：サイドバー ＋ 広々としたカリキュラム本文 */}
      <div className="flex-1 flex w-full min-w-0">
        <Sidebar
          currentChapterSlug={currentSlug}
          onSelectChapter={handleSelectChapter}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          completedChapters={completedChapters}
          onToggleComplete={handleToggleComplete}
          onOpenMilestoneModal={() => setIsMilestoneModalOpen(true)}
        />

        <main className="flex-1 min-w-0 pb-20 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
          <React.Suspense fallback={<PageLoadingFallback />}>
            {currentSlug === 'top' ? (
              <TopPageView
                onSelectChapter={handleSelectChapter}
                completedChapters={completedChapters}
                onOpenPlaygroundModal={() => setIsPlaygroundModalOpen(true)}
                onOpenMilestoneModal={() => setIsMilestoneModalOpen(true)}
                onOpenGameModal={handleOpenGameModal}
              />
            ) : (
              <ChapterView
                chapter={activeChapter}
                onNavigate={handleSelectChapter}
                onComplete={handleMarkComplete}
                onToggleComplete={handleToggleComplete}
                isCompleted={completedChapters.includes(activeChapter.id)}
                onOpenMilestoneModal={() => setIsMilestoneModalOpen(true)}
              />
            )}
          </React.Suspense>
        </main>
      </div>

      {/* フッター */}
      <Footer />

      {/* ソースコードガイドモーダル（開かれた時のみ遅延ロード） */}
      {isSourceModalOpen && (
        <React.Suspense fallback={null}>
          <SourceModal
            isOpen={isSourceModalOpen}
            onClose={() => setIsSourceModalOpen(false)}
          />
        </React.Suspense>
      )}

      {/* C++オンライン実行ラボ（Playground）モーダル（開かれた時のみ遅延ロード） */}
      {isPlaygroundModalOpen && (
        <React.Suspense fallback={null}>
          <OnlinePlaygroundModal
            isOpen={isPlaygroundModalOpen}
            onClose={() => setIsPlaygroundModalOpen(false)}
          />
        </React.Suspense>
      )}

      {/* 公式修了証・マイルストーン達成モーダル（開かれた時のみ遅延ロード） */}
      {isMilestoneModalOpen && (
        <React.Suspense fallback={null}>
          <MilestoneModal
            isOpen={isMilestoneModalOpen}
            onClose={() => setIsMilestoneModalOpen(false)}
            completedChapters={completedChapters}
            onImportProgress={(imported) => {
              const saved = saveCompletedChapters(imported, VALID_CHAPTER_IDS);
              setCompletedChapters(saved);
            }}
            onResetProgress={() => {
              const saved = saveCompletedChapters([], VALID_CHAPTER_IDS);
              setCompletedChapters(saved);
            }}
          />
        </React.Suspense>
      )}

      {/* 🎮 Webエミュレータ（ゲーム）大画面モーダル（グローバル起動対応） */}
      {isGlobalGameModalOpen && (
        <React.Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
            <div className="flex items-center gap-3 p-6 rounded-2xl bg-slate-900 border border-cyan-500/50 text-cyan-400 font-mono text-sm shadow-2xl">
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>RETRO SPACE SHOOTER 起動中...</span>
            </div>
          </div>
        }>
          <GameEmulator
            key={`global-game-${globalGameVersion}`}
            version={globalGameVersion}
            chapterCode={globalGameChapterCode}
            chapterTitle={globalGameChapterTitle}
            isModal={true}
            onClose={() => setIsGlobalGameModalOpen(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
};
export default App;

