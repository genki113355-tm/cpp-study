import React, { useState, useEffect, useMemo } from 'react';
import { Chapter, CodeHighlightTarget, CodeFile } from '../../types/curriculum';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS } from '../../data/chapters';
import { DialogueBubble } from './DialogueBubble';
import { Avatar } from '../common/Avatar';
import { CodeViewer } from './CodeViewer';
import { ConceptDiagram } from './ConceptDiagram';
import { ParadigmComparisonView } from './ParadigmComparisonView';

const GameEmulator = React.lazy(() => 
  import('../emulator/GameEmulator').then((m) => ({ default: m.GameEmulator }))
);
import { MemoryVisualizer } from './MemoryVisualizer';
import { VariableInspector } from './VariableInspector';
import { RichExplanation } from './RichExplanation';
import { UmlDiagramViewer } from './UmlDiagramViewer';
import { getAssetUrl } from '../../utils/assetPath';
import { 
  CheckCircle, 
  CheckCircle2,
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  HelpCircle, 
  GitCommit, 
  Gamepad2, 
  Terminal,
  Trophy,
  Clock,
  Flame,
  Target,
  ExternalLink,
  FolderCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AffiliatePromoBanner } from '../affiliate/AffiliatePromoBanner';
import { ShareButtons } from '../common/ShareButtons';
import { CodeChallengeRunner } from '../playground/CodeChallengeRunner';
import { CODING_CHALLENGES } from '../../data/codingChallenges';
import { getChapterEvolution } from '../../data/chapterEvolution';
import { getChapterMeta } from '../../data/chapterMetadata';
import { StepByStepLab } from './StepByStepLab';
import { getLabScenario } from '../../data/stepByStepLabs';
export type ChapterTab = 'game' | 'learn' | 'practice' | 'quiz' | 'all';

interface ParsedChapterHeading {
  prefix: string;
  cleanTitle: string;
  subNote?: string;
}

const parseChapterHeading = (title: string): ParsedChapterHeading => {
  if (!title) return { prefix: '', cleanTitle: '', subNote: undefined };

  let prefix = '';
  let rest = title.trim();

  // 1. コロン（全角/半角）で区切られたプレフィックス（例: "レガシー第1章", "モダン第2章"）
  const prefixMatch = rest.match(/^([^：:]+)[：:]\s*(.*)$/);
  if (prefixMatch) {
    prefix = prefixMatch[1].trim();
    rest = prefixMatch[2].trim();
  }

  // 2. 末尾の括弧（全角/半角）注記（例: "ビフォー：意図の不在", "ゼロコピー革命"）
  let cleanTitle = rest;
  let subNote: string | undefined = undefined;

  const bracketMatch = rest.match(/^(.*?)[（\(]([^）\)]+)[）\)]\s*$/);
  if (bracketMatch) {
    cleanTitle = bracketMatch[1].trim();
    subNote = bracketMatch[2].trim();
  }

  return {
    prefix,
    cleanTitle: cleanTitle || rest,
    subNote,
  };
};

const getGitHubCodeUrl = (slug: string): { url: string; label: string } => {
  const repoBase = 'https://github.com/genki113355-tm/cpp-study/tree/main/cpp-projects';
  if (slug === 'chapter-classic-1-spaghetti-code') {
    return { url: `${repoBase}/chapter1`, label: 'Ch.1 実機ソースコード（chapter1/）' };
  }
  if (slug === 'chapter-classic-2-classes-and-files') {
    return { url: `${repoBase}/chapter2`, label: 'Ch.2 実機ソースコード（chapter2/）' };
  }
  if (slug === 'chapter-classic-3-dynamic-lifecycle') {
    return { url: `${repoBase}/chapter3`, label: 'Ch.3 実機ソースコード（chapter3/）' };
  }
  if (slug === 'chapter-classic-4-inheritance-polymorphism') {
    return { url: `${repoBase}/chapter4`, label: 'Ch.4 実機ソースコード（chapter4/）' };
  }
  if (slug === 'chapter-modern-1-smart-pointers-raii') {
    return { url: `${repoBase}/chapter5`, label: 'Ch.5 実機ソースコード（chapter5/）' };
  }
  if (slug === 'chapter-classic-5-design-patterns') {
    return { url: `${repoBase}/chapter6`, label: 'Ch.6 実機ソースコード（chapter6/）' };
  }
  if (slug === 'chapter-modern-10-ecs') {
    return { url: `${repoBase}/chapter7`, label: 'Ch.7 実機ソースコード（chapter7/）' };
  }
  return { url: repoBase, label: 'GitHub実機プロジェクト一覧（cpp-projects/）' };
};

interface ChapterViewProps {
  chapter: Chapter;
  onNavigate: (slug: string) => void;
  onComplete: (id: number) => void;
  onToggleComplete?: (id: number) => void;
  isCompleted: boolean;
  onOpenMilestoneModal?: () => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  onNavigate,
  onComplete,
  onToggleComplete,
  isCompleted,
  onOpenMilestoneModal,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [codeHighlight, setCodeHighlight] = useState<CodeHighlightTarget | undefined>();
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [showInlineGame, setShowInlineGame] = useState<boolean>(false);
  // コーストラック・章コード
  const isClassic = chapter.courseTrack === 'classic';
  const isReading = chapter.courseTrack === 'reading';
  const isGuide = chapter.courseTrack === 'guide' || chapter.category === 'guide' || chapter.category === 'column';
  const code = chapter.courseChapterCode || `Ch.${chapter.id}`;

  // 章の各要素の有無
  const hasGame = Boolean(chapter.gameVersion && chapter.gameVersion !== 'none');
  const hasLab = Boolean(getLabScenario(chapter.slug));
  const hasChallenge = Boolean(CODING_CHALLENGES[chapter.slug]);
  const hasPractice = hasLab || hasChallenge;
  const hasQuiz = Boolean(chapter.quiz && chapter.quiz.length > 0);

  // 初期タブ（URLハッシュ尊重、デフォルトは 'learn'）
  const [activeTab, setActiveTab] = useState<ChapterTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#game') return 'game';
      if (hash === '#practice') return 'practice';
      if (hash === '#quiz') return 'quiz';
      if (hash === '#all') return 'all';
    }
    return 'learn';
  });
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // 記事読了スクロールプログレスの計算
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter.slug]);

  // 章切り替え時にタブをデフォルト（'learn'、またはURLハッシュ指定）にリセット
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#game' && hasGame) {
        setActiveTab('game');
        return;
      }
      if (hash === '#practice' && hasPractice) {
        setActiveTab('practice');
        return;
      }
      if (hash === '#quiz' && hasQuiz) {
        setActiveTab('quiz');
        return;
      }
      if (hash === '#all') {
        setActiveTab('all');
        return;
      }
    }
    setActiveTab('learn');
  }, [chapter.slug, hasGame, hasPractice, hasQuiz]);

  // タブ切り替え＆スムーズスクロールヘルパー
  const switchTab = (tab: ChapterTab, targetElementId?: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      if (tab !== 'learn') {
        window.history.replaceState(null, '', `#${tab}`);
      } else {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    setTimeout(() => {
      if (targetElementId) {
        document.getElementById(targetElementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const stepBarEl = document.getElementById('chapter-step-bar');
        if (stepBarEl) {
          stepBarEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 40);
  };

  // この章の学習メタデータ（所要時間・重要度・難易度・到達目標）
  const meta = useMemo(() => getChapterMeta(chapter), [chapter]);

  // この章に含まれるすべての教材コードファイルを抽出
  const allCodeFiles = useMemo(() => {
    const files: CodeFile[] = [];
    const seen = new Set<string>();

    chapter.sections.forEach((s) => {
      if (s.codeFiles) {
        s.codeFiles.forEach((f) => {
          if (!seen.has(f.filename)) {
            seen.add(f.filename);
            files.push(f);
          }
        });
      }
    });

    return files;
  }, [chapter]);

  // 学習ステップタブの構成定義
  const stepTabs = useMemo(() => {
    interface StepTabConfig {
      id: ChapterTab;
      stepNum?: string;
      icon: string;
      label: string;
      shortLabel: string;
      countBadge?: string;
      description: string;
    }

    const tabs: StepTabConfig[] = [];
    let counter = 1;
    const toCircled = (n: number) => ['①', '②', '③', '④', '⑤'][n - 1] || `${n}`;

    if (hasGame) {
      tabs.push({
        id: 'game',
        stepNum: toCircled(counter++),
        icon: '🎮',
        label: 'ゲーム体験',
        shortLabel: 'ゲーム',
        countBadge: code,
        description: '実機インベーダーゲームを体感プレイ',
      });
    }

    tabs.push({
      id: 'learn',
      stepNum: toCircled(counter++),
      icon: '📖',
      label: '本文解説・設計',
      shortLabel: '解説',
      countBadge: `${chapter.sections.length}節`,
      description: '概念解説・UML設計図・コード解剖',
    });

    if (hasPractice) {
      tabs.push({
        id: 'practice',
        stepNum: toCircled(counter++),
        icon: '🧪',
        label: '実践演習',
        shortLabel: '演習',
        countBadge: hasLab && hasChallenge ? '2演習' : '1演習',
        description: '対話型ターミナル設計ラボ＆GCC道場',
      });
    }

    if (hasQuiz) {
      tabs.push({
        id: 'quiz',
        stepNum: toCircled(counter++),
        icon: '🎯',
        label: '理解度クイズ',
        shortLabel: 'クイズ',
        countBadge: chapter.quiz ? `${chapter.quiz.length}問` : undefined,
        description: '理解度チェック・読了完了・合格証',
      });
    }

    tabs.push({
      id: 'all',
      icon: '📜',
      label: 'すべて表示',
      shortLabel: 'すべて',
      description: '全コンテンツを縦スクロールで一括通読',
    });

    return tabs;
  }, [hasGame, hasPractice, hasQuiz, code, chapter.sections.length, chapter.quiz, hasLab, hasChallenge]);

  const handleSelectOption = (questionId: string, optionIndex: number, correctIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));

    if (optionIndex === correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      onComplete(chapter.id);
    }
  };

  const getTrackBadge = () => {
    if (chapter.category === 'column') {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-purple-950/80 text-purple-300 border-purple-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-purple-400" />
          🧠 C++深掘り思想コラム
        </span>
      );
    }
    if (isGuide) {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-emerald-950/80 text-emerald-300 border-emerald-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-emerald-400" />
          🧭 実践手引き・現場ガイド
        </span>
      );
    }
    if (isReading) {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-purple-950/80 text-purple-300 border-purple-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-purple-400" />
          🧭 コード読解演習トラック 【R】Step {code.replace(/^[CMR]/, '')}
        </span>
      );
    }
    if (isClassic) {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-amber-950/80 text-amber-300 border-amber-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-amber-400" />
          🏛️ レガシーC++コース 【L】第{code.replace(/^[CML]/, '')}章
        </span>
      );
    }
    return (
      <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-cyan-950/80 text-cyan-300 border-cyan-500/40">
        <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-cyan-400" />
        🚀 モダンコース 【M】第{code.replace(/^[CML]/, '')}章
      </span>
    );
  };

  const getBorderColor = () => {
    if (chapter.category === 'column' || isReading) return 'border-purple-500/30';
    if (isGuide) return 'border-emerald-500/30';
    if (isClassic) return 'border-amber-500/30';
    return 'border-cyan-500/30';
  };

  const getGlowColor = () => {
    if (chapter.category === 'column' || isReading) return 'bg-purple-500/10';
    if (isGuide) return 'bg-emerald-500/10';
    if (isClassic) return 'bg-amber-500/10';
    return 'bg-cyan-500/10';
  };

  return (
    <>
      {/* 読了スクロールプログレスバー（最上部固定） */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-950/40 pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="w-full max-w-[1500px] mx-auto py-6 sm:py-8 space-y-12">
      {/* 章ヘッダーバナー（タイトル・学習メタデータ・到達目標・解説） */}
      <div className={`relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c121e] to-slate-950 p-5 sm:p-8 md:p-10 border shadow-2xl overflow-hidden ${getBorderColor()}`}>
        {/* 背景の淡いグロー */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${getGlowColor()}`} />

        <div className="relative z-10 space-y-5">
          {/* パンくずリスト & シェアボタン（最上部に配置して操作性を向上） */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="パンくずリスト" className="flex items-center gap-2 text-xs sm:text-sm font-mono flex-wrap">
              <button
                onClick={() => onNavigate('top')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition shadow-sm cursor-pointer"
                title="トップページへ戻る"
              >
                <span>🏠</span>
                <span>TOP</span>
              </button>
              <span className="text-slate-600">/</span>
              {getTrackBadge()}
              <span className="text-xs sm:text-sm font-mono text-slate-300 font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 truncate max-w-[140px] sm:max-w-none" title={chapter.badge}>
                {chapter.badge}
              </span>
              <button
                type="button"
                onClick={() => onToggleComplete ? onToggleComplete(chapter.id) : onComplete(chapter.id)}
                className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono px-3 py-1 rounded-full border font-bold transition cursor-pointer active:scale-95 ${
                  isCompleted
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20 hover:bg-emerald-900/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-700'
                }`}
                title={isCompleted ? '読了済み（クリックで未読了に戻す）' : '未読了（クリックで読了完了にする）'}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{isCompleted ? '読了完了' : '未読了（完了にする）'}</span>
              </button>
            </nav>

            <ShareButtons
              title={`${chapter.title} - ${chapter.subtitle} | シロクマC++ラボ`}
              text={`C++オブジェクト指向設計カリキュラム：${chapter.description.slice(0, 60)}...`}
              variant="compact"
            />
          </div>

          {/* メインタイトル */}
          {(() => {
            const heading = parseChapterHeading(chapter.title);
            return (
              <div className="space-y-3">
                {/* プレフィックスバッジ（章番号やトラック） */}
                {heading.prefix && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 tracking-wide shadow-sm">
                      <span>📖</span>
                      <span>{heading.prefix}</span>
                    </span>
                    {chapter.courseChapterCode && (
                      <span className="text-xs font-mono font-bold text-slate-400">
                        [{chapter.courseChapterCode}]
                      </span>
                    )}
                  </div>
                )}

                {/* 主見出し H1 */}
                <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-black text-white tracking-tight leading-snug [text-wrap:balance]">
                  <span className="inline-block break-words sm:break-keep">{heading.cleanTitle}</span>
                  {heading.subNote && (
                    <span className="inline-block text-cyan-300/90 text-lg sm:text-2xl md:text-3xl font-bold ml-0 sm:ml-3 mt-1 sm:mt-0 font-sans break-words sm:break-keep">
                      （{heading.subNote}）
                    </span>
                  )}
                </h1>

                {/* サブタイトル */}
                {chapter.subtitle && (
                  <p className="text-base sm:text-xl md:text-2xl text-cyan-300 font-medium leading-snug [text-wrap:pretty]">
                    {chapter.subtitle}
                  </p>
                )}
              </div>
            );
          })()}

          {/* 学習メタデータ・ステータスバー（目安時間・重要度・難易度・到達目標） */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-mono">
              {/* 読了・演習目安時間 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>目安: <strong>{meta.readingTimeText}</strong></span>
              </div>

              {/* 重要度 */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold ${meta.badgeClasses.importance}`}>
                <Flame className="w-3.5 h-3.5 text-current" />
                <span>重要度: {meta.importanceStars}（{meta.importanceLabel}）</span>
              </div>

              {/* 難易度 */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold ${meta.badgeClasses.difficulty}`}>
                <Target className="w-3.5 h-3.5 text-current" />
                <span>難易度: {meta.difficulty}</span>
              </div>

              {/* クイズ有無 */}
              {chapter.quiz && chapter.quiz.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 font-semibold">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>クイズ{chapter.quiz.length}問あり</span>
                </div>
              )}
            </div>

            {meta.keyTakeaway && (
              <div className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-amber-400 font-bold shrink-0 font-mono">🎯 到達目標:</span>
                <span className="font-sans leading-relaxed text-slate-300">{meta.keyTakeaway}</span>
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-sans max-w-5xl [text-wrap:pretty]">
            {chapter.description}
          </p>

          {/* 📂 GitHubコードスナップショット導線（タイポ時・ビルド確認用） */}
          {(() => {
            const githubInfo = getGitHubCodeUrl(chapter.slug);
            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <FolderCode className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <span>GitHub ソースコード・完成状態</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40 text-cyan-200">公式リポジトリ</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">
                      「タイポしてビルドが通らない」「完成状態のコードと見比べたい」場合は、GitHubの実機コードを参照してください。
                    </p>
                  </div>
                </div>

                <a
                  href={githubInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white font-mono font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 cursor-pointer"
                  title="GitHubでソースコードを閲覧（新しいタブで開く）"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{githubInfo.label} →</span>
                </a>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 📌 目次（クイックジャンプナビゲーション） */}
      {chapter.sections && chapter.sections.length > 0 && (
        <nav aria-label="章内目次" className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a101d] to-slate-900/90 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg backdrop-blur-sm -my-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <span className="text-cyan-400">📌</span>
              <span>この章の目次（クイックジャンプ）</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              全{chapter.sections.length}セクション {hasPractice ? '+ 実践演習' : ''} {hasQuiz && chapter.quiz ? `+ クイズ(${chapter.quiz.length}問)` : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {chapter.sections.map((sec, idx) => {
              const titleMatch = sec.title.match(/^(\d+\.\d+)\s*(.*)/);
              const secNum = titleMatch ? titleMatch[1] : `${idx + 1}`;
              const secTitle = titleMatch ? titleMatch[2] : sec.title;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    if (activeTab !== 'learn' && activeTab !== 'all') {
                      switchTab('learn', sec.id);
                    } else {
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  title={`${secNum} ${secTitle} へスクロール`}
                >
                  <span className="text-cyan-400 font-bold">{secNum}</span>
                  <span className="truncate max-w-[180px] sm:max-w-[240px] font-sans">{secTitle}</span>
                </button>
              );
            })}
            {hasPractice && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab !== 'practice' && activeTab !== 'all') {
                    switchTab('practice', hasLab ? 'chapter-step-lab' : 'chapter-code-challenge');
                  } else {
                    const targetId = hasLab ? 'chapter-step-lab' : 'chapter-code-challenge';
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-2.5 py-1 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="実践演習へスクロール"
              >
                <span>🧪</span>
                <span className="font-bold">実践演習</span>
              </button>
            )}
            {hasQuiz && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab !== 'quiz' && activeTab !== 'all') {
                    switchTab('quiz', 'chapter-quiz');
                  } else {
                    document.getElementById('chapter-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 hover:border-purple-400 text-purple-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 sm:ml-auto"
                title="理解度チェッククイズへスクロール"
              >
                <span>🎯</span>
                <span className="font-bold">理解度クイズ ({chapter.quiz?.length || 0}問)</span>
              </button>
            )}
          </div>
        </nav>
      )}

      {/* 🧭 学習進捗ステップバー（①ゲーム ➔ ②解説 ➔ ③演習 ➔ ④クイズ ＋ すべて表示） */}
      <div id="chapter-step-bar" className="sticky top-18 z-30 -my-4 py-3 bg-[#090d16]/95 backdrop-blur-md border-y border-slate-800/80">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* ステップ切り替えタブ群（横スクロール対応） */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
            {stepTabs.map((tab, idx) => {
              const isSelected = activeTab === tab.id;
              const isSpecialAll = tab.id === 'all';

              return (
                <React.Fragment key={tab.id}>
                  {/* デスクトップ用ステップ矢印（allの手前を除く） */}
                  {idx > 0 && !isSpecialAll && (
                    <span className="hidden md:inline-block text-slate-600 text-xs px-0.5 select-none" aria-hidden="true">
                      ➔
                    </span>
                  )}
                  {/* 'all'の手前にある区切り線 */}
                  {isSpecialAll && (
                    <span className="hidden sm:inline-block w-px h-5 bg-slate-800 mx-1" aria-hidden="true" />
                  )}

                  <button
                    type="button"
                    onClick={() => switchTab(tab.id)}
                    className={`group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl cursor-pointer transition select-none shrink-0 text-xs font-mono ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-cyan-500/25 text-white border-2 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold ring-2 ring-cyan-500/20'
                        : 'bg-slate-900/85 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800 font-medium'
                    }`}
                    title={tab.description}
                  >
                    {/* ステップ丸バッジ */}
                    {tab.stepNum ? (
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                        }`}
                      >
                        {tab.stepNum}
                      </span>
                    ) : (
                      <span className="text-sm shrink-0">{tab.icon}</span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <span className="hidden min-[480px]:inline">{tab.label}</span>
                      <span className="inline min-[480px]:hidden">{tab.shortLabel}</span>
                      {tab.countBadge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                            isSelected
                              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {tab.countBadge}
                        </span>
                      )}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* 右側：ゲーム即時起動ボタン & 現在のモード説明 */}
          <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-2.5">
            {hasGame && (
              <button
                type="button"
                onClick={() => setIsGameModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                title="この章のゲームを大画面で起動する"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ゲーム即時起動</span>
              </button>
            )}
            <div className="hidden xl:flex items-center gap-1.5">
              <span className="text-slate-500">モード:</span>
              <span className="text-cyan-400 font-bold">
                {stepTabs.find((t) => t.id === activeTab)?.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 実機ゲームステーション（大画面ポップアップ起動 ＆ インライン切替） */}
      {(activeTab === 'all' || activeTab === 'game') && hasGame && (() => {
        const evolution = getChapterEvolution(code, chapter.gameVersion!);
        const isFirstChapter = Boolean(
          evolution.isFirstChapter ||
          code === 'L1' ||
          code === 'C1' ||
          chapter.gameVersion === 'v1_spaghetti' ||
          evolution.previousChapter.includes('なし')
        );

        return (
          <section className="space-y-4">
            <div className="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-[#070e1b] to-slate-950 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* 背景の淡いグリッド ＆ ネオングロー */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-5">
                {/* 上部ヘッダー情報 */}
                <div className="space-y-2.5 max-w-2xl flex flex-col items-center">
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{code} 収録：インベーダーゲーム風シューティング</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      C++プログラム実行環境
                    </span>
                  </div>

                  {/* ゲームステーション見出し */}
                  {(() => {
                    const heading = parseChapterHeading(chapter.title);
                    return (
                      <div className="space-y-1.5 text-center">
                        <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3.5 py-1 rounded-full border border-cyan-500/30 shadow-sm">
                          <span>👾</span>
                          <span>RETRO SPACE SHOOTER</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-cyan-300">{code}</span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-white [text-wrap:balance] tracking-tight">
                          <span className="inline-block break-keep">{heading.cleanTitle}</span>
                        </h3>
                      </div>
                    );
                  })()}

                  {/* L1以外の章のみ「前章からの進化点」を表示 */}
                  {!isFirstChapter ? (
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono bg-slate-900/90 px-3.5 py-2 rounded-xl border border-amber-500/30 text-slate-300 max-w-xl text-left">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/40 flex-shrink-0 text-xs">
                        🔄 前章からの進化
                      </span>
                      <span className="leading-snug text-amber-100 font-medium">
                        {evolution.headline}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-300 font-mono bg-slate-900/80 px-3.5 py-2 rounded-xl border border-cyan-500/30 max-w-xl">
                      🚀 <span className="text-cyan-300 font-bold">原点の固定画面シューティング：</span>1ファイル・グローバル変数・単発射撃から始まるC++オブジェクト指向への旅！
                    </div>
                  )}
                </div>

                {/* 中央：縦4cm × 横5cm (約150px × 200px) の超目立つ起動ボタン */}
                <div className="flex flex-col items-center justify-center gap-3 my-1">
                  <button
                    onClick={() => setIsGameModalOpen(true)}
                    className="w-[200px] h-[150px] rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 hover:from-cyan-400 hover:via-sky-400 hover:to-emerald-400 text-slate-950 font-mono font-black transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:shadow-[0_0_55px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2.5 group cursor-pointer border-2 border-cyan-200/50"
                    title="ゲームを起動する"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-950/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <Gamepad2 className="w-10 h-10 text-slate-950" />
                    </div>
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-base sm:text-lg font-black tracking-wide text-slate-950">ゲームを起動する</span>
                      <span className="text-xs font-bold text-slate-900/80 font-mono tracking-wider mt-0.5">▶ PLAY GAME</span>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1 flex-wrap justify-center">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span>🎨 2Dグラフィック</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span>📟 CUI文字切替</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">キーボード/タッチ対応</span>
                  </div>
                </div>

                {/* 下部：インライン表示の切り替え */}
                <div className="pt-2 border-t border-slate-800/80 w-full flex justify-center">
                  <button
                    onClick={() => setShowInlineGame((prev) => !prev)}
                    className="text-xs text-slate-400 hover:text-cyan-300 font-mono transition flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-800/60 cursor-pointer"
                  >
                    <span>{showInlineGame ? '▲ ページ内表示を閉じる' : '▼ ページ内にインライン表示する'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ページ内インライン展開（ユーザーが希望した場合のみ） */}
            {showInlineGame && (
              <div className="pt-2 animate-fadeIn">
                <React.Suspense fallback={
                  <div className="flex items-center justify-center p-12 rounded-2xl bg-slate-950 border border-cyan-500/30 text-cyan-400 font-mono text-sm gap-3">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>アーケードエミュレータを準備中...</span>
                  </div>
                }>
                  <GameEmulator
                    key={`${chapter.slug}-inline`}
                    version={chapter.gameVersion as any}
                    chapterCode={code}
                    chapterTitle={chapter.title}
                    isModal={false}
                  />
                </React.Suspense>
              </div>
            )}

            {/* 🎮 大画面ポップアップモーダル */}
            {isGameModalOpen && (
              <React.Suspense fallback={
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
                  <div className="flex items-center gap-3 p-6 rounded-2xl bg-slate-900 border border-cyan-500/50 text-cyan-400 font-mono text-sm shadow-2xl">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>RETRO SPACE SHOOTER 起動中...</span>
                  </div>
                </div>
              }>
                <GameEmulator
                  key={`${chapter.slug}-modal`}
                  version={chapter.gameVersion as any}
                  chapterCode={code}
                  chapterTitle={chapter.title}
                  isModal={true}
                  onClose={() => setIsGameModalOpen(false)}
                />
              </React.Suspense>
            )}

            {/* 🎮 ゲーム体験タブ（STEP 1）完了時の次ステップ導線 */}
            {activeTab === 'game' && (
              <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-2 border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 animate-fadeIn">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-cyan-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                    <span>STEP 1 🎮 ゲームの挙動を体感しました！</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white font-sans">
                    次はコードの構造とオブジェクト指向の仕組みを解剖しよう
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans">
                    ゲームが裏でどのように動いているのか、UML図やメモリ可視化と共に詳しく学びます。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => switchTab('learn')}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-sm sm:text-base transition flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer shrink-0"
                >
                  <span>② 本文解説へ進む</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        );
      })()}

      {/* 📖 本文解説・公式設計書・ソースコード（activeTab: 'all' または 'learn'） */}
      {(activeTab === 'all' || activeTab === 'learn') && (
        <>
          {/* 📐 この章のプログラムに対応する公式UML設計書 */}
          {chapter.umlDiagram && (
            <section>
              <UmlDiagramViewer
                data={chapter.umlDiagram}
                codeFiles={allCodeFiles}
                onJumpToEditor={(target) => setCodeHighlight(target)}
              />
            </section>
          )}

          {/* 各セクションの展開 */}
          {chapter.sections.map((section) => {
            // "1.1 タイトル" 形式の分解
            const titleMatch = section.title.match(/^(\d+\.\d+)\s*(.*)/);
            const sectionNum = titleMatch ? titleMatch[1] : null;
            const sectionTitle = titleMatch ? titleMatch[2] : section.title;

            return (
              <React.Fragment key={section.id}>
                <section id={section.id} className="space-y-6 pt-12 pb-8 border-t border-slate-800/80 scroll-mt-24">
                  <div>
                    <div className="flex items-center gap-3.5 flex-wrap">
                      {sectionNum && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-bold text-sm sm:text-base shadow-sm">
                          {sectionNum}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
                        {sectionTitle}
                      </h2>
                    </div>
                    {/* セクションリード文 */}
                    {section.leadText && (
                      <p className="text-lg sm:text-xl text-slate-300 mt-4 leading-relaxed font-sans [text-wrap:pretty]">
                        {section.leadText}
                      </p>
                    )}
                  </div>

                  {/* セクション前の会話 */}
                  {section.dialogueBefore && section.dialogueBefore.length > 0 && (
                    <div className="space-y-3.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
                      {section.dialogueBefore.map((dialogue) => (
                        <DialogueBubble key={dialogue.id} dialogue={dialogue} />
                      ))}
                    </div>
                  )}

                  {/* 概念解説テキスト（リッチマークダウンレンダラー） */}
                  {section.explanationText && (
                    <RichExplanation content={section.explanationText} />
                  )}

                  {/* C言語 vs C++ パラダイム対比 */}
                  {section.paradigmComparison && (
                    <ParadigmComparisonView data={section.paradigmComparison} />
                  )}

                  {/* スタック・ヒープ メモリ可視化 */}
                  {section.memoryMap && (
                    <MemoryVisualizer memoryMap={section.memoryMap} />
                  )}

                  {/* 変数・クラスメンバ一覧インスペクター（カード / 最適化テーブル） */}
                  {section.variables && section.variables.length > 0 && (
                    <VariableInspector variables={section.variables} />
                  )}

                  {/* 処理フロー（ステップバイステップ実況解説＆設計意図） */}
                  {section.processSteps && section.processSteps.length > 0 && (
                    <div className="space-y-4 my-6">
                      <div className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-400 px-1">
                        <GitCommit className="w-5 h-5" />
                        <span>1フレーム内の実行順序と設計の意図</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3.5">
                        {section.processSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-md"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2.5 flex-wrap">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm">
                                  {step.stepNumber}
                                </span>
                                <h4 className="font-bold text-base sm:text-lg text-slate-100 font-sans [text-wrap:balance]">
                                  {step.title}
                                </h4>
                              </div>
                              {step.codeSnippet && (
                                <code className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                                  {step.codeSnippet}
                                </code>
                              )}
                            </div>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-10 font-sans [text-wrap:pretty]">
                              {step.description}
                            </p>
                            
                            <div className="mt-3 pl-10 flex flex-col sm:flex-row gap-2.5 text-xs sm:text-sm font-mono">
                              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 py-2 px-3 rounded-xl border border-emerald-500/20 flex-1">
                                <span className="text-slate-400 font-sans font-bold">動作効果:</span>
                                <span>{step.impact}</span>
                              </div>
                              {step.designIntent && (
                                <div className="flex items-center gap-2 text-cyan-300 bg-cyan-950/30 py-2 px-3 rounded-xl border border-cyan-500/20 flex-1">
                                  <span className="text-slate-400 font-sans font-bold">設計意図:</span>
                                  <span>{step.designIntent}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 概念図解 */}
                  {section.diagramType && (
                    <ConceptDiagram type={section.diagramType} />
                  )}

                  {/* セクション固有のUML設計書 */}
                  {section.umlDiagram && (
                    <UmlDiagramViewer
                      data={section.umlDiagram}
                      codeFiles={section.codeFiles && section.codeFiles.length > 0 ? section.codeFiles : allCodeFiles}
                      onJumpToEditor={(target) => setCodeHighlight(target)}
                    />
                  )}

                  {/* C++コードビューア */}
                  {section.codeFiles && section.codeFiles.length > 0 && (
                    <div className="my-6">
                      <div className="text-sm font-mono text-slate-400 mb-2.5 flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">SOURCE CODE</span>
                        <span>（タブをクリックしてファイルを切り替え・コピーできます。クラス図メンバと双方向連動）</span>
                      </div>
                      <CodeViewer files={section.codeFiles} targetHighlight={codeHighlight} />
                    </div>
                  )}

                  {/* セクション後の会話 */}
                  {section.dialogueAfter && section.dialogueAfter.length > 0 && (
                    <div className="space-y-3.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
                      {section.dialogueAfter.map((dialogue) => (
                        <DialogueBubble key={dialogue.id} dialogue={dialogue} />
                      ))}
                    </div>
                  )}

                  {/* キーポイント・シロクマ先生の指導吹き出し */}
                  {section.takeaways && section.takeaways.length > 0 && (
                    <div className="my-7 flex items-start gap-3 sm:gap-4.5">
                      {/* シロクマ先生アバター ＆ ネームタグ */}
                      <div className="flex flex-col items-center shrink-0">
                        <Avatar character="shirokuma" emotion="teaching" size="md" />
                        <span className="text-[11px] font-bold font-mono mt-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 whitespace-nowrap shadow-sm">
                          シロクマ先生
                        </span>
                      </div>

                      {/* 吹き出し本体 */}
                      <div className="flex-1 min-w-0 rounded-3xl rounded-tl-sm bg-gradient-to-br from-[#0c1424] via-[#090f1d] to-[#050811] border-2 border-cyan-500/40 p-5 sm:p-6 shadow-xl shadow-cyan-950/30 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                          <Lightbulb className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>指導官の重要ポイントまとめ</span>
                        </div>

                        <div className="space-y-3.5 pt-1">
                          {section.takeaways.map((takeaway, idx, arr) => (
                            <div
                              key={idx}
                              className={idx > 0 ? "pt-3.5 border-t border-cyan-900/40 space-y-1.5" : "space-y-1.5"}
                            >
                              <div className="flex items-center gap-2">
                                {arr.length > 1 && (
                                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold shrink-0">
                                    {idx + 1}
                                  </span>
                                )}
                                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight [text-wrap:balance]">
                                  {takeaway.title}
                                </h4>
                              </div>
                              <p className={`text-sm sm:text-base text-slate-200 leading-relaxed font-sans [text-wrap:pretty] ${arr.length > 1 ? 'pl-0 sm:pl-7' : ''}`}>
                                {takeaway.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </React.Fragment>
            );
          })}

          {/* 📖 本文解説タブ（STEP 2）完了時の次ステップ導線 */}
          {activeTab === 'learn' && (
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 animate-fadeIn">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-indigo-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>STEP {hasGame ? '2' : '1'} 📖 本文解説のインプット完了！</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white font-sans">
                  {hasPractice ? '学んだ知識を定着させる実践演習に挑戦しよう' : '理解度クイズで知識をチェックしよう'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  {hasPractice 
                    ? '対話型ターミナル演習とGCCコンパイラ演習で、実際に手を動かしてコードを完成させます。' 
                    : 'この章で学んだ設計思想やキーワードを4択クイズで総復習しましょう。'}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 flex-wrap justify-end">
                {hasGame && (
                  <button
                    type="button"
                    onClick={() => switchTab('game')}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>① ゲームに戻る</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => switchTab(hasPractice ? 'practice' : 'quiz')}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black font-mono text-sm sm:text-base transition flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
                >
                  <span>{hasPractice ? `${hasGame ? '③' : '②'} 実践演習へ進む` : `${hasGame ? '④' : '③'} 理解度クイズへ進む`}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 🧪 実践演習（対話型設計ラボ ＆ GCC演習道場） */}
      {(activeTab === 'all' || activeTab === 'practice') && (
        <section className="space-y-12">
          {/* ステップバイステップ設計演習（対話型ハンズオン） */}
          <StepByStepLab chapterSlug={chapter.slug} />

          {/* 実践ハンズオン演習道場（コーディング課題が定義されている章で自動表示） */}
          {CODING_CHALLENGES[chapter.slug] && (
            <div id="chapter-code-challenge">
              <CodeChallengeRunner challenge={CODING_CHALLENGES[chapter.slug]} />
            </div>
          )}

          {/* 演習タブ（STEP 3）完了時の次ステップ導線 */}
          {activeTab === 'practice' && (
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-2 border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 animate-fadeIn">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-purple-400 font-bold">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>STEP {hasGame ? '3' : '2'} 🧪 手を動かしてコードを書きました！</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white font-sans">
                  最後の関門！理解度チェッククイズで章を完全攻略
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  クイズに正解してシロクマ先生とハイタッチ！章の読了バッジを獲得しましょう。
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => switchTab('learn')}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{hasGame ? '②' : '①'} 解説を見直す</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('quiz')}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-black font-mono text-sm sm:text-base transition flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/25 active:scale-95 cursor-pointer"
                >
                  <span>{hasGame ? '④' : '③'} 理解度クイズへ進む</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 🎯 理解度クイズ ＆ ゴール達成（activeTab: 'all' または 'quiz'） */}
      {(activeTab === 'all' || activeTab === 'quiz') && (
        <>
          {/* クイズタブ選択時の上部戻るナビ */}
          {activeTab === 'quiz' && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono mb-6">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-purple-400 font-bold">🎯</span>
                <span>STEP {hasGame ? (hasPractice ? '4' : '3') : (hasPractice ? '3' : '2')}: 理解度チェック ＆ 章修了</span>
              </div>
              <div className="flex items-center gap-2">
                {hasPractice && (
                  <button
                    type="button"
                    onClick={() => switchTab('practice')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>演習に戻る</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => switchTab('learn')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>解説に戻る</span>
                </button>
              </div>
            </div>
          )}

          {/* 理解度確認クイズ */}
          {chapter.quiz && chapter.quiz.length > 0 && (
            <section id="chapter-quiz" className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-10 space-y-8 shadow-2xl my-8 scroll-mt-24">
          <div className="flex items-center gap-3 text-cyan-400 font-mono font-bold text-xl sm:text-2xl border-b border-slate-800 pb-4">
            <HelpCircle className="w-7 h-7" />
            <span>理解度チェッククイズ</span>
          </div>

          {chapter.quiz.map((q) => {
            const selected = selectedAnswers[q.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={q.id} className="space-y-4">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {q.question}
                </p>

                <div className="space-y-3">
                  {q.options.map((option, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    let btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40';
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => !isAnswered && handleSelectOption(q.id, optIdx, q.correctIndex)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-base sm:text-lg transition-all duration-150 flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        )}
                        {isAnswered && isOptionSelected && optIdx !== q.correctIndex && (
                          <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 解説ボックス */}
                {showExplanations[q.id] && (
                  <div
                    className={`p-5 rounded-2xl border text-sm sm:text-base leading-relaxed font-sans ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {isCorrect && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 flex-shrink-0 shadow-lg">
                          <img
                            src={getAssetUrl('/images/characters_victory.png')}
                            alt="ハイタッチ！"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="font-bold mb-1 flex items-center gap-2 text-base sm:text-lg">
                          {isCorrect ? '🎉 正解！シロクマ先生とハイタッチ！' : '❌ おしい！'}
                        </div>
                        <div className="text-slate-200 leading-relaxed">{q.explanation}</div>
                        {isCorrect && (
                          <div className="pt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-emerald-300 font-mono font-bold">正解成果をシェア:</span>
                            <ShareButtons
                              title={`【正解クリア！】シロクマC++ラボ「${chapter.title}」のクイズを突破しました！`}
                              text={`シロクマ先生＆先輩ペンギンと一緒にオブジェクト指向ゲーム開発を修行中！`}
                              variant="compact"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* 記事シェアカード */}
      <ShareButtons
        title={`${chapter.title} - ${chapter.subtitle} | シロクマC++ラボ`}
        text={`インベーダーゲーム風シューティング（RETRO SPACE SHOOTER）開発を通じて学ぶC++オブジェクト指向設計カリキュラム！\n${chapter.description.slice(0, 80)}...`}
        variant="card"
      />

      {/* 学習完了・達成のご褒美PRバナー（最下部） */}
      <AffiliatePromoBanner type="reward" limit={3} />

      {/* 読了・進捗完了アクションバー */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1222] to-slate-900 border-2 border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 my-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 ${
            isCompleted 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10' 
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-500/10'
          }`}>
            {isCompleted ? '🎉' : '🎯'}
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2 flex-wrap">
              <span>{isCompleted ? 'この章は読了完了しています！' : 'この章の学習は完了しましたか？'}</span>
              {isCompleted ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  COMPLETED
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  UNFINISHED
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 leading-relaxed">
              {isCompleted
                ? '素晴らしい進捗です！復習するか、次の章へ進んで更なる高みを目指しましょう。'
                : '完了ボタンを押すと進捗が自動保存され、マイルストーン修了証の取得にカウントされます。'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end w-full sm:w-auto flex-shrink-0">
          {!isCompleted ? (
            <>
              <button
                onClick={() => {
                  onComplete(chapter.id);
                  confetti({
                    particleCount: 70,
                    spread: 60,
                    origin: { y: 0.7 },
                  });
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-bold font-mono text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✅ この章を完了にする</span>
              </button>

              {chapter.nextChapterSlug && (
                <button
                  onClick={() => {
                    onComplete(chapter.id);
                    confetti({
                      particleCount: 70,
                      spread: 60,
                      origin: { y: 0.7 },
                    });
                    setTimeout(() => {
                      onNavigate(chapter.nextChapterSlug!);
                    }, 350);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 cursor-pointer"
                >
                  <span>✅ 完了にして次の章へ進む</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>読了進捗に記録済み</span>
              </span>
              <button
                onClick={() => onToggleComplete ? onToggleComplete(chapter.id) : onComplete(chapter.id)}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                title="未読了に戻す"
              >
                未読了に戻す
              </button>
            </div>
          )}
        </div>
      {/* 4ラボ循環バトンタッチカード（最終章・コース読破時） */}
      {!chapter.nextChapterSlug && (
        <div className="my-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-[#1a1205] border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-amber-300 font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40">NEXT STAGE ⚡</span>
              <span>シロクマ技術探検隊・第2ステージ</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-white">
              C++設計を極めたら、次は【開発自動化ラボ】で手作業を全自動化！
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              手動ビルドや泥臭いテストを根絶！CMakeビルド自動化、Dockerコンテナ化、Python(pytest)、AddressSanitizer、GitHub ActionsによるCI/CD完全構築ガイド。
            </p>
          </div>
          <a
            href="/auto/"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm whitespace-nowrap shadow-xl hover:shadow-amber-500/25 transition transform hover:scale-105 active:scale-95 flex items-center gap-2 flex-shrink-0 relative z-10"
          >
            <span>開発自動化ラボへ進む</span>
            <span>➔</span>
          </a>
        </div>
      )}
      </div>

      {/* 章ナビゲーションフッター */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        {chapter.prevChapterSlug ? (
          <button
            onClick={() => onNavigate(chapter.prevChapterSlug!)}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-bold transition border border-slate-700 active:scale-95 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>前の章へ</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('top')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-bold transition border border-slate-700 active:scale-95 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TOP（全体ロードマップ）へ</span>
          </button>
        )}

        {chapter.nextChapterSlug ? (
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            {!isCompleted && (
              <button
                onClick={() => onNavigate(chapter.nextChapterSlug!)}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer px-2 py-1"
                title="進捗を完了にせずスキップ"
              >
                未完了のままスキップ →
              </button>
            )}

            <button
              onClick={() => {
                if (!isCompleted) {
                  onComplete(chapter.id);
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                }
                onNavigate(chapter.nextChapterSlug!);
              }}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base font-mono transition shadow-xl active:scale-95 text-slate-950 cursor-pointer ${
                isReading
                  ? 'bg-purple-500 hover:bg-purple-400 shadow-purple-500/30'
                  : isClassic
                  ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30'
              }`}
            >
              <span>次の章へ進む</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-mono font-bold">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                {isGuide
                  ? `🎉 本ガイド・コラムの読了お疲れ様でした！実践・学習にお役立てください！`
                  : isReading
                  ? `🧭 コード読解演習トラック（全${READING_CHAPTERS.length}ステップ）読了！現場鑑識の基礎を制覇しました！🎓`
                  : isClassic
                  ? `🏛️ レガシーC++コース（現行${CLASSIC_CHAPTERS.length}章）読破！お疲れ様でした！🎓`
                  : `🚀 モダンコース（現行${MODERN_CHAPTERS.length}章）読破！お疲れ様でした！🎓`}
              </span>
            </span>

            {/* ガイド以外の場合は他コースへの誘導ボタン */}
            {!isGuide && (
              isClassic ? (
                <button
                  onClick={() => onNavigate('chapter-modern-1-smart-pointers-raii')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-cyan-500/30 active:scale-95 cursor-pointer"
                >
                  <span>🚀 モダン【M】第1章へ挑戦する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : isReading ? (
                <button
                  onClick={() => onNavigate('chapter-1-spaghetti-to-oop')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <span>🏛️ レガシー【L】第1章へ挑戦する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('chapter-1-spaghetti-to-oop')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <span>🏛️ レガシー【L】第1章へ挑戦する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            )}

            {onOpenMilestoneModal && (
              <button
                onClick={onOpenMilestoneModal}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>🏆 公式修了証を確認する</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('top')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs sm:text-sm transition border border-slate-700 active:scale-95 cursor-pointer"
            >
              <span>TOPへ戻る</span>
            </button>
          </div>
        )}
      </div>
        </>
      )}

      {/* 途中のタブ（ゲーム・解説・演習）でも即座に前後の章やクイズへ行けるミニナビゲーション */}
      {activeTab !== 'all' && activeTab !== 'quiz' && (
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
          {chapter.prevChapterSlug ? (
            <button
              type="button"
              onClick={() => onNavigate(chapter.prevChapterSlug!)}
              className="hover:text-slate-300 transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>前の章へ</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('top')}
              className="hover:text-slate-300 transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>TOPへ戻る</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => switchTab('quiz')}
            className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>クイズ・章の完了へスキップ ➔</span>
          </button>
        </div>
      )}
    </div>
    </>
  );
};
