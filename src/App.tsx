import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS, getChapterBySlug } from './data/chapters';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ChapterView } from './components/curriculum/ChapterView';
import { TopPageView } from './components/curriculum/TopPageView';
import { SourceModal } from './components/layout/SourceModal';
import { OnlinePlaygroundModal } from './components/playground/OnlinePlaygroundModal';
import { useSEO } from './hooks/useSEO';

export const App: React.FC = () => {
  const [currentSlug, setCurrentSlug] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && getChapterBySlug(hash)) return hash;
    const pathSlug = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    if (pathSlug && getChapterBySlug(pathSlug)) return pathSlug;
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

  // URLハッシュ同期
  useEffect(() => {
    if (currentSlug === 'top') {
      if (window.location.hash && window.location.hash !== '#top') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = currentSlug;
    }
  }, [currentSlug]);

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
        page_path: window.location.pathname + (currentSlug === 'top' ? '' : '#' + currentSlug),
      });
    }
  }, [currentSlug, currentChapter]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'top') {
        setCurrentSlug('top');
      } else if (getChapterBySlug(hash)) {
        setCurrentSlug(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const handleSelectChapter = (slug: string) => {
    setCurrentSlug(slug);
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
        </main>
      </div>

      {/* フッター */}
      <Footer />

      {/* ソースコードガイドモーダル */}
      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />

      {/* C++オンライン実行ラボ（Playground）モーダル */}
      <OnlinePlaygroundModal
        isOpen={isPlaygroundModalOpen}
        onClose={() => setIsPlaygroundModalOpen(false)}
      />
    </div>
  );
};
export default App;

