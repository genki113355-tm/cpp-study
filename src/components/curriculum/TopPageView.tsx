import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Trophy,
  Play,
  Clock,
  AlertTriangle,
  Workflow,
  Search,
  Tag,
  X,
  Gamepad2,
  Target,
  Compass,
  RotateCcw
} from 'lucide-react';
import {
  CLASSIC_CHAPTERS,
  MODERN_CHAPTERS,
  READING_CHAPTERS,
  SPECIAL_GUIDES,
  ALL_CHAPTERS
} from '../../data/chapters';
import { Chapter } from '../../types/curriculum';
import { getChapterMeta } from '../../data/chapterMetadata';
import { AffiliatePromoBanner } from '../affiliate/AffiliatePromoBanner';
import { NewsletterSection } from '../common/NewsletterSection';
import { GameEvolutionRoadmap } from './GameEvolutionRoadmap';
import { getAssetUrl } from '../../utils/assetPath';

interface KeywordIndexItem {
  name: string;
  category: string;
  slug: string;
  badge: string;
  desc: string;
}

const KEYWORD_INDEX: KeywordIndexItem[] = [
  { name: 'RAII / リソース管理', category: 'モダン設計', slug: 'chapter-modern-1-smart-pointers-raii', badge: 'M1', desc: 'コンストラクタで確保しデストラクタで自動解放' },
  { name: 'スマートポインタ (unique_ptr / shared_ptr)', category: 'モダン設計', slug: 'chapter-modern-1-smart-pointers-raii', badge: 'M1', desc: '所有権の明確化と生deleteの完全撲滅' },
  { name: 'ムーブセマンティクス (右辺値参照)', category: 'モダン設計', slug: 'chapter-modern-2-move-semantics', badge: 'M2', desc: '不要なディープコピーを省くゼロコピー移譲' },
  { name: '固定長メモリプール / アロケータ', category: '極限性能', slug: 'chapter-classic-11-memory-pool-allocator', badge: 'L11', desc: '断片化撲滅・O(1)定数時間の高速メモリ確保' },
  { name: '動的多態性 / vtable / 仮想関数', category: 'OOP基礎', slug: 'chapter-classic-4-inheritance-polymorphism', badge: 'L4', desc: 'switch分岐の破綻を解消する開閉原則' },
  { name: 'State / Observer パターン', category: 'デザインパターン', slug: 'chapter-classic-5-design-patterns', badge: 'L5', desc: 'シーン遷移制御とイベント通知の疎結合化' },
  { name: 'CRTP (静的ポリモーフィズム)', category: '極限性能', slug: 'chapter-classic-10-static-polymorphism-crtp', badge: 'L10', desc: '仮想関数テーブルコストゼロの静的多態性' },
  { name: 'ECS (Entity Component System)', category: '最先端設計', slug: 'chapter-modern-10-ecs', badge: 'M10', desc: '深層多重継承を排し、データ指向で動的アセンブル' },
  { name: 'マルチスレッド競合 / Data Race鑑識', category: '現場鑑識', slug: 'reading-step-4', badge: 'R4', desc: 'スレッド競合の特定とstd::mutex / atomic排他制御' },
  { name: 'Use-After-Free / ASanメモリ鑑識', category: '現場鑑識', slug: 'reading-step-6', badge: 'R6', desc: '解放後メモリへのアクセス破壊とAddressSanitizer検知' },
  { name: 'SFINAE / テンプレート型制約', category: '現場鑑識', slug: 'reading-step-7', badge: 'R7', desc: 'コンパイル時メタ言語とオーバーロード選別の解読' },
  { name: '神クラス解体 / 依存性逆転 (DIP)', category: '現場鑑識', slug: 'reading-step-10', badge: 'R10', desc: '前方宣言による物理依存切断と抽象インターフェース' },
  { name: 'TDD / GoogleTest (テスト駆動開発)', category: '開発手法', slug: 'guide-googletest-tdd', badge: 'G5', desc: 'テストファーストで壊れないC++リファクタリング' },
  { name: 'UML 設計図 (クラス図 / シーケンス図)', category: '設計図解', slug: 'guide-uml-design', badge: 'G4', desc: 'ゲームアーキテクチャの視覚化と実装への落とし込み' },
  { name: 'C++ 基本文法＆逆引きチートシート', category: 'リファレンス', slug: 'guide-cpp-syntax-reference', badge: 'G2', desc: 'ポインタ・参照・キャスト4種・constを素早く確認' },
  { name: 'GoF デザインパターン ＆ SOLID原則', category: '設計思想', slug: 'column-design-patterns', badge: 'COL1', desc: '現場で役立つ設計の知恵と5つの設計原則' },
];

interface TopPageViewProps {
  onSelectChapter: (slug: string) => void;
  completedChapters: number[];
  onOpenPlaygroundModal?: () => void;
  onOpenMilestoneModal?: () => void;
  onOpenGameModal?: (version?: any, code?: string, title?: string) => void;
}

export const TopPageView: React.FC<TopPageViewProps> = ({
  onSelectChapter,
  completedChapters,
  onOpenPlaygroundModal: _onOpenPlaygroundModal,
  onOpenMilestoneModal,
  onOpenGameModal,
}) => {
  const [activeTab, setActiveTab] = useState<'classic' | 'modern' | 'reading' | 'guides'>('classic');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showKeywords, setShowKeywords] = useState<boolean>(false);
  const [showDiagnosis, setShowDiagnosis] = useState<boolean>(false);
  const [showWalls, setShowWalls] = useState<boolean>(false);
  const [showRoadmap, setShowRoadmap] = useState<boolean>(false);
  const [showAllChapters, setShowAllChapters] = useState<boolean>(false);
  const [diagnosisStep, setDiagnosisStep] = useState<number>(1);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    slug: string;
    code: string;
    title: string;
    reason: string;
    track: 'classic' | 'modern' | 'reading';
  } | null>(null);

  const handleSelectTrackTab = (tab: 'classic' | 'modern' | 'reading' | 'guides') => {
    setActiveTab(tab);
    setShowAllChapters(false);
  };

  const handleSelectExperience = (exp: 'c_beginner' | 'c_ok' | 'cpp_ok') => {
    if (exp === 'c_beginner') {
      setDiagnosisResult({
        slug: 'chapter-classic-1-spaghetti-code',
        code: 'L1',
        title: 'レガシー第1章：構造化設計の限界',
        reason: 'まずは「main関数1つのコード」がなぜ破綻するのかを体感し、C言語とC++の境界線を学ぶのが最短ルートです！',
        track: 'classic',
      });
      setDiagnosisStep(3);
    } else if (exp === 'c_ok') {
      setDiagnosisResult({
        slug: 'chapter-classic-2-classes-and-files',
        code: 'L2',
        title: 'レガシー第2章：クラス化と責務のカプセル化',
        reason: 'C言語の構造体からC++のclass（privateカプセル化）への進化を、自機Playerクラスを通して直感的に理解できます！',
        track: 'classic',
      });
      setDiagnosisStep(3);
    } else {
      setDiagnosisStep(2);
    }
  };

  const handleSelectGoal = (goal: 'modern' | 'reading' | 'extreme') => {
    if (goal === 'modern') {
      setDiagnosisResult({
        slug: 'chapter-modern-1-smart-pointers-raii',
        code: 'M1',
        title: 'モダン第1章：スマートポインタとRAII',
        reason: '生deleteを完全に撲滅する unique_ptr / shared_ptr と決定論的寿命管理（RAII）から、現代C++の世界へ飛び込みましょう！',
        track: 'modern',
      });
    } else if (goal === 'reading') {
      setDiagnosisResult({
        slug: 'reading-step-1',
        code: 'R1',
        title: 'コード読解演習 Step 1：手続き型データフローの追跡',
        reason: '仕様書のない他人のコードをどう追跡するか、実務即戦力の鑑識眼を段階的に養成します！',
        track: 'reading',
      });
    } else {
      setDiagnosisResult({
        slug: 'chapter-classic-11-memory-pool-allocator',
        code: 'L11',
        title: 'レガシー第11章：独自メモリアロケータと固定長プール管理',
        reason: 'ヒープ断片化を撲滅し、毎フレームのnew/deleteをO(1)定数時間に変えるゲームエンジン極限アーキテクチャを学びます！',
        track: 'classic',
      });
    }
    setDiagnosisStep(3);
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_CHAPTERS.filter((ch) => {
      const matchTitle = ch.title.toLowerCase().includes(q);
      const matchSub = ch.subtitle.toLowerCase().includes(q);
      const matchDesc = ch.description.toLowerCase().includes(q);
      const matchSlug = ch.slug.toLowerCase().includes(q);
      const matchCode = (ch.courseChapterCode || '').toLowerCase().includes(q);
      return matchTitle || matchSub || matchDesc || matchSlug || matchCode;
    });
  }, [searchQuery]);

  const nextUncompletedChapter = useMemo(() => {
    return ALL_CHAPTERS.find((c) => !completedChapters.includes(c.id)) || ALL_CHAPTERS[0];
  }, [completedChapters]);

  const hasProgress = completedChapters.length > 0;
  const isAllCompleted = completedChapters.length >= ALL_CHAPTERS.length;

  const getChapterCode = (ch: Chapter): string => {
    if (ch.courseTrack === 'classic') {
      const chNum = (ch.courseChapterCode || `C${ch.id}`).replace(/^[CML]/, '');
      return `L${chNum}`;
    }
    if (ch.courseTrack === 'modern') {
      const chNum = (ch.courseChapterCode || `M${ch.id}`).replace(/^[CML]/, '');
      return `M${chNum}`;
    }
    if (ch.courseTrack === 'reading') {
      const idx = READING_CHAPTERS.findIndex((r) => r.id === ch.id);
      return idx !== -1 ? `R${idx + 1}` : 'R';
    }
    if (ch.courseChapterCode) return ch.courseChapterCode;
    if (ch.slug.includes('syntax')) return 'G2';
    if (ch.slug.includes('tdd')) return 'G5';
    if (ch.slug.includes('reading')) return 'G3';
    if (ch.slug.includes('design-patterns')) return 'COL1';
    if (ch.slug.includes('uml')) return 'G4';
    if (ch.slug.includes('great')) return 'COL3';
    if (ch.slug.includes('hard')) return 'COL2';
    if (ch.slug.includes('env')) return 'G1';
    return 'G';
  };

  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'classic':
        return CLASSIC_CHAPTERS.filter((ch) => ch.courseTrack === 'classic');
      case 'modern':
        return MODERN_CHAPTERS.filter((ch) => ch.courseTrack === 'modern');
      case 'reading':
        return READING_CHAPTERS.filter((ch) => ch.courseTrack === 'reading');
      case 'guides':
        return SPECIAL_GUIDES.filter((ch) => ch.category === 'guide' || ch.category === 'column' || ch.courseTrack === 'guide');
      default:
        return CLASSIC_CHAPTERS.filter((ch) => ch.courseTrack === 'classic');
    }
  }, [activeTab]);

  const classicCompleted = CLASSIC_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length;
  const modernCompleted = MODERN_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length;
  const readingCompleted = READING_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length;

  return (
    <div className="w-full max-w-6xl mx-auto py-5 sm:py-8 px-2 sm:px-4 space-y-8 sm:space-y-10">
      {/* 1. ヒーローセクション（シンプル＆余白のあるファーストビュー） */}
      <section className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-white/95 via-sky-50/70 to-white/90 dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-[#070b14] dark:to-[#040810] p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* 左側：キャッチコピー・解説・CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-400/50 text-cyan-900 dark:text-cyan-300 font-mono text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>ゲーム開発で学ぶ C++ オブジェクト指向＆実践設計メディア</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-sans leading-tight flex items-center gap-4 flex-wrap">
              <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-cyan-500 bg-white dark:bg-slate-900 shadow-md shrink-0 inline-flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl('/images/characters/shirokuma_sensei.png')}
                  alt="シロクマ先生"
                  className="w-full h-full object-cover"
                />
              </span>
              <span>シロクマC++ラボ</span>
            </h1>

            <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-cyan-700 to-emerald-700 dark:from-amber-300 dark:via-cyan-300 dark:to-emerald-300 leading-snug">
              動くだけのコードから、現場で生き抜く「一生モノの設計力」へ。
            </p>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              ブラウザで遊べるインベーダー風ゲームを題材に、500行のスパゲティコード（C言語）からクラス化、動的メモリ、vtable、RAII、ECS、最新C++20まで、「なぜその設計が必要か」を体感しながら習得できます。
            </p>

            {/* CTAボタン */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5">
              <button
                type="button"
                onClick={() => onSelectChapter(ALL_CHAPTERS[0].slug)}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:via-sky-300 hover:to-blue-400 text-slate-950 font-black font-mono text-base transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer border border-cyan-200/50"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>第1章から学ぶ（無料）</span>
              </button>

              {isAllCompleted ? (
                <button
                  type="button"
                  onClick={onOpenMilestoneModal}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black font-mono text-base transition shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Trophy className="w-5 h-5 text-slate-950" />
                  <span>修了証を確認する</span>
                </button>
              ) : hasProgress ? (
                <button
                  type="button"
                  onClick={() => onSelectChapter(nextUncompletedChapter.slug)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-800 dark:text-cyan-300 border-2 border-sky-300 dark:border-cyan-500/40 font-bold font-mono text-base transition shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>続きから学ぶ</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenGameModal ? onOpenGameModal('v2_classes', 'L2', 'クラス化とファイル分割') : onSelectChapter('chapter-classic-2-classes-and-files')}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-cyan-300 border-2 border-slate-300 dark:border-cyan-500/40 font-bold font-mono text-base transition shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Gamepad2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <span>まずゲームで遊ぶ</span>
                </button>
              )}
            </div>

            {/* 学習進捗バー（コンパクト1行） */}
            {onOpenMilestoneModal && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="py-2.5 px-4 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex items-center justify-between gap-3 text-sm font-mono">
                  <span className="text-slate-700 dark:text-slate-300">
                    学習進捗：<strong className="text-cyan-800 dark:text-cyan-300">{completedChapters.length} / {ALL_CHAPTERS.length} 章完了</strong>
                  </span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">
                    {Math.round((completedChapters.length / ALL_CHAPTERS.length) * 100)}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenMilestoneModal}
                  className="py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 font-bold font-mono text-sm transition flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>修了証・進捗管理</span>
                </button>
              </div>
            )}
          </div>

          {/* 右側：開発ラボイラスト（クリックでエミュレータ起動） */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              onClick={() => onOpenGameModal && onOpenGameModal('v2_classes', 'L2', 'クラス化とファイル分割')}
              className="w-full max-w-md lg:max-w-none rounded-3xl border-2 border-cyan-400 shadow-xl overflow-hidden relative group bg-white dark:bg-slate-950/90 cursor-pointer"
              title="クリックしてゲームエミュレータを起動！"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-sky-50 dark:bg-slate-950 relative flex items-center justify-center">
                <img
                  src={getAssetUrl('/images/shirokuma_chibi_game_lab.jpg')}
                  alt="シロクマ先生とペンギン生徒がレトロゲーム開発に熱中するC++ラボ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('characters_mission')) {
                      target.src = getAssetUrl('/images/characters_mission.jpg');
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <span className="px-5 py-2.5 rounded-2xl bg-cyan-400 text-slate-950 font-mono font-black text-base flex items-center gap-2 shadow-2xl">
                    <Gamepad2 className="w-5 h-5 text-slate-950" />
                    <span>ゲームを起動する ▶</span>
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-950 border-t border-sky-200 dark:border-cyan-500/20 flex items-center justify-between gap-2">
                <span className="text-sm font-mono font-bold text-cyan-900 dark:text-cyan-300">
                  ブラウザ内で動くC++学習教材ゲーム
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-400 border border-emerald-400/50 font-bold flex items-center gap-1 shrink-0">
                  <Play className="w-3 h-3 fill-current" />
                  <span>PLAY</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4大カリキュラムトラック（ゆとりのある2×2カード） */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-slate-800 border border-sky-300 dark:border-slate-700 text-sky-900 dark:text-slate-300 font-mono text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>4 LEARNING TRACKS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans" style={{ wordBreak: 'auto-phrase' }}>
              目的に合わせて選ぶ4つの学習トラック
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
              基礎から段階的に学ぶことも、気になる現代C++や読解演習から飛び込むこともできます。
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowDiagnosis((prev) => !prev);
              if (!diagnosisResult) setDiagnosisStep(1);
            }}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/80 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 font-mono font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{showDiagnosis ? 'ルート診断を閉じる ▲' : '迷ったら30秒ルート診断 ▼'}</span>
          </button>
        </div>

        {/* 折りたたみ式 30秒ルート診断（必要な人だけ開く） */}
        {showDiagnosis && (
          <div className="rounded-2xl bg-sky-50/60 dark:bg-slate-900 border-2 border-sky-300 dark:border-cyan-500/30 p-6 space-y-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-sans">
                🧭 あなたに最適なスタート地点診断
              </h3>
              {diagnosisStep > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setDiagnosisStep(1);
                    setDiagnosisResult(null);
                  }}
                  className="self-start sm:self-auto text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 hover:text-cyan-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>最初からやり直す</span>
                </button>
              )}
            </div>

            {diagnosisStep === 1 && (
              <div className="space-y-4">
                <div className="text-base font-bold text-cyan-900 dark:text-cyan-200">
                  Q1. 現在のプログラミング・C言語の経験値はどれくらいですか？
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectExperience('c_beginner')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-cyan-950/40 border border-sky-200 dark:border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-2xl block">🌱</span>
                      <div className="text-base font-bold text-slate-900 dark:text-white">完全初学者・C言語も不安</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        ポインタやメモリがよく分からない。まずは土台から着実に学びたい。
                      </p>
                    </div>
                    <div className="text-sm font-mono font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                      <span>選択する</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectExperience('c_ok')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-cyan-950/40 border border-sky-200 dark:border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-2xl block">🌿</span>
                      <div className="text-base font-bold text-slate-900 dark:text-white">C言語は基本わかる</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        構造体やポインタは知っているが、C++のクラスやOOPの必要性を体感したい。
                      </p>
                    </div>
                    <div className="text-sm font-mono font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                      <span>選択する</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectExperience('cpp_ok')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-cyan-950/40 border border-sky-200 dark:border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-2xl block">⚡</span>
                      <div className="text-base font-bold text-slate-900 dark:text-white">他言語経験者 / C++既習</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        文法の基本は把握している。モダン機能や実務コード読解へ進みたい。
                      </p>
                    </div>
                    <div className="text-sm font-mono font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                      <span>目的の選択へ進む</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {diagnosisStep === 2 && (
              <div className="space-y-4">
                <div className="text-base font-bold text-cyan-900 dark:text-cyan-200">
                  Q2. 今回もっとも身につけたいテーマは何ですか？
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectGoal('modern')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-sky-400 text-left transition cursor-pointer shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-2xl block">🛡️</span>
                      <div className="text-base font-bold text-slate-900 dark:text-white">現代的モダンC++を極める</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        スマートポインタ（RAII）やC++20 Ranges・Conceptsを学びたい。
                      </p>
                    </div>
                    <div className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                      <span>結果を見る</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectGoal('reading')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-left transition cursor-pointer shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-2xl block">🔍</span>
                      <div className="text-base font-bold text-slate-900 dark:text-white">実務コード読解・鑑識眼</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        巨大リポジトリや他人の難解コードをスラスラ読み解く力を鍛えたい。
                      </p>
                    </div>
                    <div className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <span>結果を見る</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectGoal('extreme')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-left transition cursor-pointer shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-2xl block">⚙️</span>
                      <div className="text-base font-bold text-slate-900 dark:text-white">極限低レイヤ・性能設計</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        メモリプール、キャッシュ効率化、マルチスレッドに挑みたい。
                      </p>
                    </div>
                    <div className="text-sm font-mono font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                      <span>結果を見る</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {diagnosisStep === 3 && diagnosisResult && (
              <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-950 border-2 border-cyan-400 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs sm:text-sm font-mono font-bold uppercase text-cyan-800 dark:text-cyan-400">
                      おすすめのスタート章
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-400/30">
                      {diagnosisResult.code}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {diagnosisResult.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-sans leading-relaxed max-w-2xl">
                    {diagnosisResult.reason}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectChapter(diagnosisResult.slug)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-bold text-sm sm:text-base shadow-md active:scale-95 transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
                >
                  <span>この章から始める</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* トラック 1: クラシック基礎編 */}
          <div className="rounded-3xl border border-amber-200 dark:border-amber-500/30 bg-white/95 dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-md hover:border-amber-400 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40">
                  全{CLASSIC_CHAPTERS.length}章（L1〜L{CLASSIC_CHAPTERS.length}）
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                  進捗: {classicCompleted} / {CLASSIC_CHAPTERS.length} 完了
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
                  🏛️ クラシックC++現場実務編
                </h3>
                <p className="text-xs sm:text-sm font-mono text-amber-800 dark:text-amber-400 font-bold mt-1">
                  C言語・C++03 / 組込み・制約環境の設計原理
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                動的メモリ禁止やリアルタイム応答が求められる現場で通用する「クラス化」「vtable多態性」「独自メモリプール」「自作エンジン統合」を段階的にマスターします。
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="/chapter-classic-1-spaghetti-code"
                onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-classic-1-spaghetti-code'); }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm text-center transition flex items-center justify-center gap-2 shadow-md cursor-pointer no-underline"
              >
                <span>第1章（L1）から開始</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  handleSelectTrackTab('classic');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'auto' });
                }}
                className="py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold text-sm text-center transition cursor-pointer"
              >
                目次を見る ↓
              </button>
            </div>
          </div>

          {/* トラック 2: モダン実践編 */}
          <div className="rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-md hover:border-cyan-400 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/40">
                  全{MODERN_CHAPTERS.length}章（M1〜M{MODERN_CHAPTERS.length}）
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                  進捗: {modernCompleted} / {MODERN_CHAPTERS.length} 完了
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
                  🚀 モダンC++実践編
                </h3>
                <p className="text-xs sm:text-sm font-mono text-cyan-800 dark:text-cyan-400 font-bold mt-1">
                  C++11〜20 現代規格・ゼロオーバーヘッド設計
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                生deleteや無駄なコピーを完全撲滅！スマートポインタ（RAII）、ムーブ、ラムダ式、データ指向ECS、C++20 Concepts・Coroutinesまで網羅します。
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="/chapter-modern-1-smart-pointers-raii"
                onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-modern-1-smart-pointers-raii'); }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm text-center transition flex items-center justify-center gap-2 shadow-md cursor-pointer no-underline"
              >
                <span>モダン第1章（M1）へ</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  handleSelectTrackTab('modern');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'auto' });
                }}
                className="py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold text-sm text-center transition cursor-pointer"
              >
                目次を見る ↓
              </button>
            </div>
          </div>

          {/* トラック 3: コード読解演習 */}
          <div className="rounded-3xl border border-purple-200 dark:border-purple-500/30 bg-white/95 dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-md hover:border-purple-400 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40">
                  全{READING_CHAPTERS.length}ステップ（R1〜R{READING_CHAPTERS.length}）
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                  進捗: {readingCompleted} / {READING_CHAPTERS.length} 完了
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
                  🧭 コード読解・現場鑑識演習
                </h3>
                <p className="text-xs sm:text-sm font-mono text-purple-800 dark:text-purple-400 font-bold mt-1">
                  実務即戦力・OSS解読・競合＆メモリ破壊捜査
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                他人が書いた巨大コードや実在OSS（Box2D等）の読み方から、マルチスレッド競合やUse-After-Free（ASan）、ダンプ解析まで実戦形式で鍛えます。
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="/reading-step-1"
                onClick={(e) => { e.preventDefault(); onSelectChapter('reading-step-1'); }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold font-mono text-sm text-center transition flex items-center justify-center gap-2 shadow-md cursor-pointer no-underline"
              >
                <span>読解Step 1（R1）へ</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  handleSelectTrackTab('reading');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'auto' });
                }}
                className="py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold text-sm text-center transition cursor-pointer"
              >
                目次を見る ↓
              </button>
            </div>
          </div>

          {/* トラック 4: 現場特集・チートシート */}
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-500/30 bg-white/95 dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-md hover:border-emerald-400 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40">
                  全{SPECIAL_GUIDES.length}本（ガイド・コラム）
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                  現場リファレンス
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
                  📚 現場特集・実践チートシート
                </h3>
                <p className="text-xs sm:text-sm font-mono text-emerald-800 dark:text-emerald-400 font-bold mt-1">
                  文法逆引き・GoogleTest TDD・UML設計・言語思想
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                開発環境構築から、困ったときにすぐ引ける「C++基本文法チートシート」、GoogleTest入門、UML設計図の読み書き、C++の哲学コラムまで完備しています。
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="/guide-cpp-syntax-reference"
                onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-sm text-center transition flex items-center justify-center gap-2 shadow-md cursor-pointer no-underline"
              >
                <span>文法チートシートへ</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  handleSelectTrackTab('guides');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'auto' });
                }}
                className="py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold text-sm text-center transition cursor-pointer"
              >
                目次を見る ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. オプション深掘りエリア（初期は1行バーに格納し、トップの縦長を抑制） */}
      <section className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* アコーディオントグル 1: 4つの現場の壁 */}
          <button
            type="button"
            onClick={() => setShowWalls((prev) => !prev)}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer shadow-sm ${
              showWalls
                ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 text-slate-900 dark:text-white'
                : 'bg-white/95 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">WHY ARCHITECTURE</div>
                <div className="text-sm sm:text-base font-bold truncate">設計が必須になる「4つの現場の壁」</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${showWalls ? 'rotate-180' : ''}`} />
          </button>

          {/* アコーディオントグル 2: 10段階設計進化マップ */}
          <button
            type="button"
            onClick={() => setShowRoadmap((prev) => !prev)}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer shadow-sm ${
              showRoadmap
                ? 'bg-cyan-50/90 dark:bg-cyan-950/40 border-cyan-400 text-slate-900 dark:text-white'
                : 'bg-white/95 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-cyan-400 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center shrink-0">
                <Workflow className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-400">EVOLUTION MAP</div>
                <div className="text-sm sm:text-base font-bold truncate">10段階リファクタリング進化マップ</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${showRoadmap ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 展開時: 4つの現場の壁 */}
        {showWalls && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-900/70 border border-amber-200 dark:border-amber-500/30">
            <div
              onClick={() => onSelectChapter('chapter-classic-4-inheritance-polymorphism')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 hover:border-amber-400 transition cursor-pointer group flex flex-col justify-between gap-2.5 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300">Q1. 拡張性の壁</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">L4</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  「敵を10種類に増やしたら、巨大 switch 文が壊れる」
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  仮想関数（vtable）と動的多態性で、既存コードを壊さず新種を追加できる開閉原則を学びます。
                </p>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-amber-700 dark:text-amber-400">解説（L4）へ →</span>
            </div>

            <div
              onClick={() => onSelectChapter('chapter-modern-1-smart-pointers-raii')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 hover:border-cyan-400 transition cursor-pointer group flex flex-col justify-between gap-2.5 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/15 text-cyan-900 dark:text-cyan-300">Q2. 所有権の壁</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">M1</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                  「誰が delete すべきか分からず二重解放で落ちる」
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  生ポインタ起因のメモリリークや二重解放クラッシュを unique_ptr と RAII で根絶します。
                </p>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-cyan-700 dark:text-cyan-400">解説（M1）へ →</span>
            </div>

            <div
              onClick={() => onSelectChapter('chapter-classic-5-design-patterns')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-800 hover:border-purple-400 transition cursor-pointer group flex flex-col justify-between gap-2.5 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/15 text-purple-900 dark:text-purple-300">Q3. 結合度の壁</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">L5</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  「撃破時のSEとスコア更新、どこに書けばいい？」
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  EnemyクラスがUIや音声に直接依存する密結合を State &amp; Observer パターンで切り離します。
                </p>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-purple-700 dark:text-purple-400">解説（L5）へ →</span>
            </div>

            <div
              onClick={() => onSelectChapter('chapter-classic-11-memory-pool-allocator')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 hover:border-emerald-400 transition cursor-pointer group flex flex-col justify-between gap-2.5 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300">Q4. 性能の壁</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">L11</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  「弾を毎秒1000発撃ったら、なぜ急にカクつく？」
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  毎フレームの new/delete によるヒープ断片化を固定長メモリプールで O(1) 定数時間化します。
                </p>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">解説（L11）へ →</span>
            </div>
          </div>
        )}

        {/* 展開時: 10段階設計進化マップ */}
        {showRoadmap && (
          <div className="pt-2">
            <GameEvolutionRoadmap onSelectChapter={onSelectChapter} onOpenGameModal={onOpenGameModal} />
          </div>
        )}
      </section>

      {/* 5. カリキュラム全目次 ＆ キーワード検索（スッキリ統合） */}
      <section id="curriculum-directory" className="space-y-6 pt-2">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-400/50 text-cyan-900 dark:text-cyan-300 font-mono text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>CURRICULUM DIRECTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
              カリキュラム全目次・キーワード検索（全{ALL_CHAPTERS.length}章）
            </h2>
          </div>

          {/* クイック検索 */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="用語・章を検索 (RAII, ECS...)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                title="クリア"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 検索中の表示 */}
        {searchQuery ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-mono text-slate-700 dark:text-slate-300">
              <span>「{searchQuery}」の検索結果: <strong>{searchResults.length}件</strong></span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-cyan-700 dark:text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                検索をリセット
              </button>
            </div>
            {searchResults.length === 0 ? (
              <div className="p-8 text-center text-sm font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                一致する章が見つかりませんでした。別の用語をお試しください。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => onSelectChapter(ch.slug)}
                    className="p-4 rounded-2xl bg-white hover:bg-sky-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 hover:border-cyan-400 dark:border-slate-800 shadow-sm transition cursor-pointer flex flex-col justify-between gap-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 font-bold">
                        {getChapterCode(ch)}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                        {ch.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 font-sans line-clamp-1">
                      {ch.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* コースタブ（1セットに一本化） */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectTrackTab('classic')}
                className={`py-2.5 px-3 rounded-xl text-sm font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'classic'
                    ? 'bg-white dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-2 border-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🏛️ クラシック ({CLASSIC_CHAPTERS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectTrackTab('modern')}
                className={`py-2.5 px-3 rounded-xl text-sm font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'modern'
                    ? 'bg-white dark:bg-cyan-950/70 text-cyan-900 dark:text-cyan-200 border-2 border-cyan-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🚀 モダン ({MODERN_CHAPTERS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectTrackTab('reading')}
                className={`py-2.5 px-3 rounded-xl text-sm font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'reading'
                    ? 'bg-white dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 border-2 border-purple-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🧭 コード読解 ({READING_CHAPTERS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectTrackTab('guides')}
                className={`py-2.5 px-3 rounded-xl text-sm font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'guides'
                    ? 'bg-white dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📚 特集・文法 ({SPECIAL_GUIDES.length})</span>
              </button>
            </div>

            {/* キーワード逆引きアコーディオン */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowKeywords((prev) => !prev)}
                className="w-full px-5 py-2.5 flex items-center justify-between text-sm font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>重要設計キーワードから逆引きで探す（{KEYWORD_INDEX.length}テーマ）</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showKeywords ? 'rotate-180' : ''}`} />
              </button>
              {showKeywords && (
                <div className="p-4 pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {KEYWORD_INDEX.map((kw, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectChapter(kw.slug)}
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-950/80 dark:hover:bg-slate-800 border border-slate-200 hover:border-cyan-400 dark:border-slate-800 transition cursor-pointer flex flex-col justify-between gap-1.5 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">{kw.category}</span>
                        <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">{kw.badge}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 font-mono">
                        {kw.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans line-clamp-2">
                        {kw.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 章リスト表示（コンパクト2カラム・初期6件＋もっと見る展開） */}
            {(() => {
              const INITIAL_COUNT = 6;
              const visibleChapters = showAllChapters ? currentList : currentList.slice(0, INITIAL_COUNT);
              const hiddenCount = Math.max(0, currentList.length - INITIAL_COUNT);

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visibleChapters.map((ch) => {
                      const isCompleted = completedChapters.includes(ch.id);
                      const chapterCode = getChapterCode(ch);

                      const isClassic = ch.courseTrack === 'classic';
                      const isModern = ch.courseTrack === 'modern';
                      const isReading = ch.courseTrack === 'reading';

                      const badgeStyle = isClassic
                        ? 'bg-amber-500 text-white dark:bg-amber-950 dark:text-amber-300 border-amber-600 dark:border-amber-500/40'
                        : isModern
                        ? 'bg-cyan-600 text-white dark:bg-cyan-950 dark:text-cyan-300 border-cyan-700 dark:border-cyan-500/40'
                        : isReading
                        ? 'bg-purple-600 text-white dark:bg-purple-950 dark:text-purple-300 border-purple-700 dark:border-purple-500/40'
                        : 'bg-emerald-600 text-white dark:bg-emerald-950 dark:text-emerald-300 border-emerald-700 dark:border-emerald-500/40';

                      const meta = getChapterMeta(ch);

                      return (
                        <a
                          key={`${activeTab}-${ch.id}-${ch.slug}`}
                          href={`/${ch.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectChapter(ch.slug);
                          }}
                          className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 hover:bg-sky-50/50 dark:hover:bg-slate-800/80 transition-all cursor-pointer no-underline text-inherit shadow-sm"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm font-black border shrink-0 shadow-sm ${badgeStyle}`}>
                              {chapterCode}
                            </span>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                                  {ch.title}
                                </h3>
                                {isCompleted && (
                                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                                    <CheckCircle2 className="w-3 h-3" />
                                    完了
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{meta.readingTimeText}</span>
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className={`font-semibold ${meta.badgeClasses.difficulty} px-1.5 py-0.2 rounded border`}>
                                  {meta.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                        </a>
                      );
                    })}
                  </div>

                  {hiddenCount > 0 && (
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAllChapters((prev) => !prev)}
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-sky-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-sm font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAllChapters ? 'rotate-180' : ''}`} />
                        <span>
                          {showAllChapters
                            ? `リストを折りたたむ（先頭${INITIAL_COUNT}章のみ表示）`
                            : `残りの ${hiddenCount} 章をすべて表示する（全${currentList.length}章）`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* 5. 学習サポート（メルマガ＆推奨書籍） ＆ コンパクトPR */}
      <div className="space-y-4">
        <NewsletterSection />
        <AffiliatePromoBanner defaultCategory="school" limit={2} showTabs={true} defaultExpanded={false} />
      </div>
    </div>
  );
};
