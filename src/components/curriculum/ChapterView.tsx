import React, { useState, useEffect, useMemo } from 'react';
import { Chapter, CodeHighlightTarget, CodeFile } from '../../types/curriculum';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS } from '../../data/chapters';
import { DialogueBubble } from './DialogueBubble';
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
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AffiliatePromoBanner } from '../affiliate/AffiliatePromoBanner';
import { ShareButtons } from '../common/ShareButtons';
import { CodeChallengeRunner } from '../playground/CodeChallengeRunner';
import { CODING_CHALLENGES } from '../../data/codingChallenges';
import { getChapterEvolution } from '../../data/chapterEvolution';
import { getChapterMeta } from '../../data/chapterMetadata';

type ViewMode = 'all' | 'learn' | 'code' | 'practice';

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
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // 章切り替え時に表示モードをデフォルト（すべて表示）にリセット
  useEffect(() => {
    setViewMode('all');
  }, [chapter.slug]);

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

  // 表示形式（ラジオボタン or プルダウンリスト）の設定（localStorageに保持）
  const [selectorStyle, setSelectorStyle] = useState<'radio' | 'dropdown'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chapter_view_selector_style');
      if (saved === 'radio' || saved === 'dropdown') return saved;
    }
    return 'radio';
  });

  const handleSelectorStyleChange = (style: 'radio' | 'dropdown') => {
    setSelectorStyle(style);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chapter_view_selector_style', style);
    }
  };

  const viewModeOptions = useMemo(() => [
    {
      id: 'all' as ViewMode,
      icon: '📖',
      label: 'すべて表示',
      desc: '全セクションを通読中',
    },
    {
      id: 'learn' as ViewMode,
      icon: '📝',
      label: '解説・設計',
      count: `${chapter.sections.length}節`,
      desc: '概念解説・UML設計図・メモリ図に集中',
    },
    ...(allCodeFiles.length > 0 ? [{
      id: 'code' as ViewMode,
      icon: '💻',
      label: 'コード',
      count: `${allCodeFiles.length}ファイル`,
      desc: 'C++実装コードと差分のみ表示',
    }] : []),
    {
      id: 'practice' as ViewMode,
      icon: '🎮',
      label: 'ゲーム・演習',
      count: chapter.quiz && chapter.quiz.length > 0 ? `クイズ${chapter.quiz.length}問` : undefined,
      desc: '実機ゲーム・理解度クイズ・演習道場',
    },
  ], [chapter, allCodeFiles]);

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

  const isClassic = chapter.courseTrack === 'classic';
  const isReading = chapter.courseTrack === 'reading';
  const isGuide = chapter.courseTrack === 'guide' || chapter.category === 'guide' || chapter.category === 'column';
  const code = chapter.courseChapterCode || `Ch.${chapter.id}`;

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
              <span className="text-xs sm:text-sm font-mono text-slate-300 font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
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
          <div className="space-y-2">
            <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight break-words">
              {chapter.title}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-cyan-300 font-medium leading-snug break-words">
              {chapter.subtitle}
            </p>
          </div>

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

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-sans max-w-5xl">
            {chapter.description}
          </p>
        </div>
      </div>

      {/* 🧭 表示モード切替（選択式であることを明確化したラジオボタン ＆ プルダウンリスト） */}
      <div className="sticky top-18 z-30 -my-4 py-3 bg-[#090d16]/95 backdrop-blur-md border-y border-slate-800/80">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* 左側：選択コントロール群 ＆ 形式切替 */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 形式切り替え（ラジオ ⇄ プルダウン）ボタン */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] font-mono shrink-0 shadow-inner">
              <button
                type="button"
                onClick={() => handleSelectorStyleChange('radio')}
                title="ラジオボタン形式で選択（1クリックで直感切り替え）"
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer select-none ${
                  selectorStyle === 'radio'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🔘</span>
                <span className="hidden sm:inline">ラジオ</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectorStyleChange('dropdown')}
                title="プルダウンリスト形式で選択（省スペースなドロップダウン）"
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer select-none ${
                  selectorStyle === 'dropdown'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>▾</span>
                <span className="hidden sm:inline">プルダウン</span>
              </button>
            </div>

            {/* ① ラジオボタン形式 */}
            {selectorStyle === 'radio' ? (
              <div
                role="radiogroup"
                aria-label="表示モード選択"
                className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-mono flex-wrap shadow-inner"
              >
                <span className="text-slate-400 text-xs px-2 hidden md:flex items-center gap-1 font-semibold">
                  <span className="text-cyan-400 font-bold">🔘</span> 表示選択:
                </span>
                {viewModeOptions.map((option) => {
                  const isSelected = viewMode === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-md shadow-cyan-500/10 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent font-medium'
                      }`}
                    >
                      <input
                        type="radio"
                        name="chapter-view-mode"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setViewMode(option.id)}
                        className="sr-only"
                      />
                      {/* ラジオボタン円（外枠＋選択時の中央ドット） */}
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition shrink-0 ${
                          isSelected
                            ? 'border-cyan-400 bg-slate-950 ring-2 ring-cyan-500/40'
                            : 'border-slate-500 bg-slate-800/80 group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                        {option.count && (
                          <span
                            className={`text-[10px] ${
                              isSelected ? 'text-cyan-300/80' : 'text-slate-500'
                            }`}
                          >
                            ({option.count})
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              /* ② プルダウンリスト形式 */
              <div className="flex items-center gap-2">
                <label
                  htmlFor="chapter-view-mode-select"
                  className="text-xs font-mono font-bold text-slate-300 shrink-0 flex items-center gap-1"
                >
                  <span className="text-cyan-400">▾</span> 表示モード選択:
                </label>
                <div className="relative inline-block">
                  <select
                    id="chapter-view-mode-select"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as ViewMode)}
                    className="bg-slate-900 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none cursor-pointer shadow-md shadow-cyan-500/10 transition"
                  >
                    {viewModeOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200 py-1">
                        {opt.icon} {opt.label}{opt.count ? ` (${opt.count})` : ''} - {opt.desc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-cyan-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右側：現在の表示ステータス */}
          <div className="text-xs font-mono text-slate-400 hidden lg:flex items-center gap-2">
            <span>表示状態:</span>
            <span className="text-cyan-400 font-bold">
              {viewModeOptions.find((opt) => opt.id === viewMode)?.desc}
            </span>
          </div>
        </div>
      </div>

      {/* 🚀 実機ゲームステーション（大画面ポップアップ起動 ＆ インライン切替） */}
      {(viewMode === 'all' || viewMode === 'practice') && chapter.gameVersion && chapter.gameVersion !== 'none' && (() => {
        const evolution = getChapterEvolution(code, chapter.gameVersion);
        const isFirstChapter = Boolean(
          evolution.isFirstChapter ||
          code === 'L1' ||
          code === 'C1' ||
          chapter.gameVersion === 'v1_spaghetti' ||
          evolution.previousChapter.includes('なし')
        );

        return (
          <section className="space-y-3">
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

                  <h3 className="text-lg sm:text-2xl font-black text-white font-mono flex items-center justify-center gap-2">
                    <span className="text-cyan-400">👾</span>
                    <span>RETRO SPACE SHOOTER : {code} {chapter.title}</span>
                  </h3>

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
                    version={chapter.gameVersion}
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
                  version={chapter.gameVersion}
                  chapterCode={code}
                  chapterTitle={chapter.title}
                  isModal={true}
                  onClose={() => setIsGameModalOpen(false)}
                />
              </React.Suspense>
            )}
          </section>
        );
      })()}

      {/* 📐 この章のプログラムに対応する公式UML設計書 */}
      {(viewMode === 'all' || viewMode === 'learn') && chapter.umlDiagram && (
        <section>
          <UmlDiagramViewer
            data={chapter.umlDiagram}
            codeFiles={allCodeFiles}
            onJumpToEditor={(target) => setCodeHighlight(target)}
          />
        </section>
      )}

      {/* 各セクションの展開（practiceモード時は演習に特化するため非表示） */}
      {viewMode !== 'practice' && chapter.sections.map((section, sIdx) => {
        // "1.1 タイトル" 形式の分解
        const titleMatch = section.title.match(/^(\d+\.\d+)\s*(.*)/);
        const sectionNum = titleMatch ? titleMatch[1] : null;
        const sectionTitle = titleMatch ? titleMatch[2] : section.title;

        // セクション中間判定（セクションが2つ以上ある場合は中間に時短PRを挿入）
        const isMiddleSection = sIdx === Math.floor((chapter.sections.length - 1) / 2);

        return (
          <React.Fragment key={section.id}>
            <section className="space-y-6 pt-12 pb-8 border-t border-slate-800/80">
            <div>
              <div className="flex items-center gap-3.5 flex-wrap">
                {sectionNum && (
                  <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-bold text-sm sm:text-base shadow-sm">
                    {sectionNum}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {sectionTitle}
                </h2>
              </div>
              {/* セクションリード文（解説モードまたはすべて表示時） */}
              {(viewMode === 'all' || viewMode === 'learn') && section.leadText && (
                <p className="text-lg sm:text-xl text-slate-300 mt-4 leading-relaxed font-sans">
                  {section.leadText}
                </p>
              )}
            </div>

          {/* セクション前の会話 */}
          {(viewMode === 'all' || viewMode === 'learn') && section.dialogueBefore && section.dialogueBefore.length > 0 && (
            <div className="space-y-3.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
              {section.dialogueBefore.map((dialogue) => (
                <DialogueBubble key={dialogue.id} dialogue={dialogue} />
              ))}
            </div>
          )}

          {/* 概念解説テキスト（リッチマークダウンレンダラー） */}
          {(viewMode === 'all' || viewMode === 'learn') && section.explanationText && (
            <RichExplanation content={section.explanationText} />
          )}

          {/* C言語 vs C++ パラダイム対比 */}
          {(viewMode === 'all' || viewMode === 'learn') && section.paradigmComparison && (
            <ParadigmComparisonView data={section.paradigmComparison} />
          )}

          {/* スタック・ヒープ メモリ可視化 */}
          {(viewMode === 'all' || viewMode === 'learn') && section.memoryMap && (
            <MemoryVisualizer memoryMap={section.memoryMap} />
          )}

          {/* 変数・クラスメンバ一覧インスペクター（カード / 最適化テーブル） */}
          {(viewMode === 'all' || viewMode === 'learn') && section.variables && section.variables.length > 0 && (
            <VariableInspector variables={section.variables} />
          )}

          {/* 処理フロー（ステップバイステップ実況解説＆設計意図） */}
          {(viewMode === 'all' || viewMode === 'learn') && section.processSteps && section.processSteps.length > 0 && (
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
                        <h4 className="font-bold text-base sm:text-lg text-slate-100 font-sans">
                          {step.title}
                        </h4>
                      </div>
                      {step.codeSnippet && (
                        <code className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                          {step.codeSnippet}
                        </code>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-10 font-sans">
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
          {(viewMode === 'all' || viewMode === 'learn') && section.diagramType && (
            <ConceptDiagram type={section.diagramType} />
          )}

          {/* セクション固有のUML設計書 */}
          {(viewMode === 'all' || viewMode === 'learn') && section.umlDiagram && (
            <UmlDiagramViewer
              data={section.umlDiagram}
              codeFiles={section.codeFiles && section.codeFiles.length > 0 ? section.codeFiles : allCodeFiles}
              onJumpToEditor={(target) => setCodeHighlight(target)}
            />
          )}

          {/* C++コードビューア（コードモードまたはすべて表示時） */}
          {(viewMode === 'all' || viewMode === 'code') && section.codeFiles && section.codeFiles.length > 0 && (
            <div className="my-6">
              <div className="text-sm font-mono text-slate-400 mb-2.5 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">SOURCE CODE</span>
                <span>（タブをクリックしてファイルを切り替え・コピーできます。クラス図メンバと双方向連動）</span>
              </div>
              <CodeViewer files={section.codeFiles} targetHighlight={codeHighlight} />
            </div>
          )}

          {/* セクション後の会話 */}
          {(viewMode === 'all' || viewMode === 'learn') && section.dialogueAfter && section.dialogueAfter.length > 0 && (
            <div className="space-y-3.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
              {section.dialogueAfter.map((dialogue) => (
                <DialogueBubble key={dialogue.id} dialogue={dialogue} />
              ))}
            </div>
          )}

          {/* キーポイント・まとめ */}
          {(viewMode === 'all' || viewMode === 'learn') && section.takeaways && section.takeaways.length > 0 && (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 my-6">
              <h3 className="text-base sm:text-lg font-mono font-bold text-cyan-400 flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5" />
                <span>シロクマ先生の重要ポイントまとめ</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.takeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2"
                  >
                    <div className="text-sm sm:text-base font-bold text-slate-100">
                      {takeaway.title}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {takeaway.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        {isMiddleSection && viewMode === 'all' && (
          <AffiliatePromoBanner type="busy" />
        )}
      </React.Fragment>
    );
  })}

      {/* 実践ハンズオン演習道場（コーディング課題が定義されている章で自動表示） */}
      {(viewMode === 'all' || viewMode === 'practice') && CODING_CHALLENGES[chapter.slug] && (
        <section>
          <CodeChallengeRunner challenge={CODING_CHALLENGES[chapter.slug]} />
        </section>
      )}

      {/* 理解度確認クイズ */}
      {(viewMode === 'all' || viewMode === 'practice') && chapter.quiz && chapter.quiz.length > 0 && (
        <section className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-10 space-y-8 shadow-2xl my-8">
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
                            src="/images/characters_victory.png"
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
                  onClick={() => onNavigate('chapter-5-smart-pointers-raii')}
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
    </div>
  );
};
