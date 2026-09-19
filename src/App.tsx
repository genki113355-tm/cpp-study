import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS, getChapterBySlug } from './data/chapters';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { useSEO } from './hooks/useSEO';

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

const PageLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-cyan-400 font-mono">
    <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    <span className="text-sm tracking-widest text-slate-400">LOADING CURRICULUM...</span>
  </div>
);

export const App: React.FC = () => {
  const [currentSlug, setCurrentSlug] = useState<string>(() => {
    // 1. パスルーティングを優先（例: /chapter-1-spaghetti-to-oop）
    const pathSlug = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    if (pathSlug && getChapterBySlug(pathSlug)) return pathSlug;

    // 2. 後方互換性のためハッシュもフォールバック判定
    const hash = window.location.hash.replace('#', '');
    if (hash && getChapterBySlug(hash)) return hash;

    return 'top';
  });

  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cpp_completed_chapters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [isPlaygroundModalOpen, setIsPlaygroundModalOpen] = useState<boolean>(false);

  // 初回ロード時のURL正規化（旧ハッシュURLで訪問された場合にクリーンパスへ補正）
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && getChapterBySlug(hash)) {
      window.history.replaceState(null, '', `/${hash}`);
    } else if (currentSlug === 'top' && window.location.hash) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  // ブラウザの「戻る」「進む」キー操作（popstate）対応
  useEffect(() => {
    const handlePopState = () => {
      const pathSlug = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      if (pathSlug && getChapterBySlug(pathSlug)) {
        setCurrentSlug(pathSlug);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash && getChapterBySlug(hash)) {
          setCurrentSlug(hash);
        } else {
          setCurrentSlug('top');
        }
      }
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

  // 完了状態の保存
  const handleToggleComplete = (id: number) => {
    setCompletedChapters((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem('cpp_completed_chapters', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleMarkComplete = (id: number) => {
    setCompletedChapters((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('cpp_completed_chapters', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const activeChapter = currentChapter || ALL_CHAPTERS[0];
  const currentChapterId = currentSlug === 'top' ? 0 : activeChapter.id;

  // 章選択時のクリーンURL遷移（HTML5 pushState）
  const handleSelectChapter = (slug: string) => {
    setCurrentSlug(slug);
    const targetPath = slug === 'top' ? '/' : `/${slug}`;
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
        />

        <main className="flex-1 min-w-0 pb-20 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
          <React.Suspense fallback={<PageLoadingFallback />}>
            {currentSlug === 'top' ? (
              <TopPageView
                onSelectChapter={handleSelectChapter}
                completedChapters={completedChapters}
                onOpenPlaygroundModal={() => setIsPlaygroundModalOpen(true)}
              />
            ) : (
              <ChapterView
                chapter={activeChapter}
                onNavigate={handleSelectChapter}
                onComplete={handleMarkComplete}
                isCompleted={completedChapters.includes(activeChapter.id)}
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
    </div>
  );
};
export default App;

