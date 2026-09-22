import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Shield,
  Trophy,
  Play,
  Clock,
  AlertTriangle,
  Workflow,
  Search,
  Tag,
  X,
  Gamepad2
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
  { name: 'RAII / リソース管理', category: 'モダン設計', slug: 'chapter-5-smart-pointers-raii', badge: 'Ch.5 (M1)', desc: 'コンストラクタで確保しデストラクタで解放' },
  { name: 'スマートポインタ (unique_ptr)', category: 'モダン設計', slug: 'chapter-5-smart-pointers-raii', badge: 'Ch.5 (M1)', desc: '単独所有権・生deleteの完全撲滅' },
  { name: '共有ポインタ (shared_ptr)', category: 'モダン設計', slug: 'chapter-6-observer-pattern', badge: 'Ch.6 (M2)', desc: '循環参照なき共同所有と弱参照' },
  { name: '固定長メモリプール / アロケータ', category: '極限性能', slug: 'chapter-11-memory-pool', badge: 'Ch.11 (L11)', desc: '断片化撲滅・O(1)定数時間の高速メモリ切り売り' },
  { name: '動的多態性 / vtable / 仮想関数', category: 'OOP基礎', slug: 'chapter-4-inheritance-polymorphism', badge: 'Ch.4 (L4)', desc: 'switch分岐の破綻を解消する開閉原則' },
  { name: 'Observer パターン (イベント通知)', category: 'デザインパターン', slug: 'chapter-6-observer-pattern', badge: 'Ch.6 (M2)', desc: '実績解除・効果音とゲーム本体の完全疎結合' },
  { name: 'State パターン (シーン遷移)', category: 'デザインパターン', slug: 'chapter-6-observer-pattern', badge: 'Ch.6 (M2)', desc: '巨大if文を排除したゲームループ状態制御' },
  { name: 'Strategy パターン (アルゴリズム分離)', category: 'デザインパターン', slug: 'chapter-6-observer-pattern', badge: 'Ch.6 (M2)', desc: '敵の弾幕軌道やAIロジックを実行時に差し替え' },
  { name: 'ECS (Entity Component System)', category: '最先端設計', slug: 'chapter-7-ecs-architecture', badge: 'Ch.7 (M3)', desc: '深層多重継承を排し、データ指向で動的アセンブル' },
  { name: '静的多態性 / CRTP', category: '現場鑑識', slug: 'reading-step-3-crtp-static-polymorphism', badge: 'R3', desc: 'vtableテーブル参照コスト0の静的ポリモーフィズム' },
  { name: 'マルチスレッド競合 / Data Race鑑識', category: '現場鑑識', slug: 'reading-step-4-multithread-datarace', badge: 'R4', desc: 'スレッド競合の特定とstd::mutex / atomic排他制御' },
  { name: 'Use-After-Free / ASanメモリ鑑識', category: '現場鑑識', slug: 'reading-step-6-uaf-address-sanitizer', badge: 'R6', desc: '解放後メモリへのアクセス破壊とAddressSanitizer検知' },
  { name: 'TDD / GoogleTest (テスト駆動開発)', category: '開発手法', slug: 'guide-tdd-googletest', badge: 'G4', desc: 'テストファーストで壊れないC++リファクタリング' },
  { name: 'UML 設計図 (クラス図 / シーケンス図)', category: '設計図解', slug: 'guide-uml-design', badge: 'G3', desc: 'ゲームアーキテクチャの視覚化と実装への落とし込み' },
  { name: 'SOLID原則 (C++実践思想)', category: '設計思想', slug: 'column-solid-principles', badge: '思想', desc: '単一責任・開閉・リスコフ・インターフェース・依存性逆転' },
  { name: 'ゼロオーバーヘッド原則', category: '設計思想', slug: 'column-zero-overhead-principle', badge: '思想', desc: '使わない機能には1バイト・1クロックの代償も払わない' },
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
      const idx = READING_CHAPTERS.findIndex(r => r.id === ch.id);
      return idx !== -1 ? `R${idx + 1}` : 'R';
    }
    if (ch.courseChapterCode) return ch.courseChapterCode;
    if (ch.slug.includes('syntax')) return '文法';
    if (ch.slug.includes('tdd')) return 'TDD';
    if (ch.slug.includes('reading')) return '読解';
    if (ch.slug.includes('design-patterns')) return 'DP';
    if (ch.slug.includes('uml')) return 'UML';
    if (ch.slug.includes('great')) return '思想';
    if (ch.slug.includes('hard')) return '試練';
    if (ch.slug.includes('env')) return '環境';
    return 'G';
  };

  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'classic':
        return CLASSIC_CHAPTERS.filter(ch => ch.courseTrack === 'classic');
      case 'modern':
        return MODERN_CHAPTERS.filter(ch => ch.courseTrack === 'modern');
      case 'reading':
        return READING_CHAPTERS.filter(ch => ch.courseTrack === 'reading');
      case 'guides':
        return SPECIAL_GUIDES.filter(ch => ch.category === 'guide' || ch.category === 'column' || ch.courseTrack === 'guide');
      default:
        return CLASSIC_CHAPTERS.filter(ch => ch.courseTrack === 'classic');
    }
  }, [activeTab]);

  const classicCompleted = CLASSIC_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const modernCompleted = MODERN_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;
  const readingCompleted = READING_CHAPTERS.filter(c => completedChapters.includes(c.id)).length;


  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-12 sm:space-y-16">
      
      {/* 1. ヒーローセクション（サイトの存在意義・1秒で伝わるキャッチコピー） */}
      <section className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-[#070b14] to-[#040810] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 左側：キャッチコピー・解説・バッジ・CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ゲーム開発で学ぶ C++ オブジェクト指向＆実践設計メディア</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white font-sans leading-tight flex items-center gap-3.5 sm:gap-4 flex-wrap">
              <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-cyan-400/80 bg-slate-900 shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0 inline-flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl('/images/polar-bear-guide-pointing.png')}
                  alt="シロクマ先生"
                  className="w-full h-full object-cover"
                />
              </span>
              <span>シロクマC++ラボ</span>
            </h1>

            <p className="text-lg sm:text-xl xl:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300 leading-snug">
              動くだけのコードから、現場で生き抜く「一生モノの設計力」へ。
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              ブラウザで遊べるインベーダー風ゲームを題材に、組込み・リアルタイム現場で求められる「静的メモリ・構造化・クラシックOOPの正解」から、現代の大規模開発で威力を発揮する「RAII・vtable・ECS・最新C++20」まで。
              「なぜその環境でその設計が選ばれるのか」を体感しながらマスターできます。
            </p>

            {/* 実績バッジ群 */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">全44記事 公開中</span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">完全無料・登録不要</span>
              <button
                type="button"
                onClick={() => onOpenGameModal ? onOpenGameModal('v2_classes', 'L2', 'クラス化とファイル分割') : onSelectChapter('chapter-2-classes-and-files')}
                className="px-3 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 hover:text-cyan-100 transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                title="Webエミュレータを今すぐ起動して遊ぶ"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>🎮 Webエミュレータ起動</span>
              </button>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-emerald-300">💻 実行演習完備</span>
            </div>

            {/* 👾 すぐにゲームを遊ぶ（Webエミュレータ直接起動） */}
            {onOpenGameModal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenGameModal('v2_classes', 'L2', 'クラス化とファイル分割')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-sm sm:text-base transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] flex items-center justify-center gap-3 active:scale-95 cursor-pointer border-2 border-emerald-300/40 group"
                >
                  <Gamepad2 className="w-5 h-5 text-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  <span>👾 今すぐゲームを起動する ▶ [Webエミュレータ]</span>
                </button>
              </div>
            )}

            {/* 学習開始・再開 CTA ボタン（最初から学ぶ / 続きから学ぶ） */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. 最初から学ぶ */}
              <button
                type="button"
                onClick={() => onSelectChapter(ALL_CHAPTERS[0].slug)}
                className="py-3 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold font-mono text-xs sm:text-sm transition border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                <span>🚀 最初から学ぶ</span>
                <span className="text-[11px] text-slate-400 font-normal">（第1章）</span>
              </button>

              {/* 2. 続きから学ぶ */}
              {isAllCompleted ? (
                <button
                  type="button"
                  onClick={onOpenMilestoneModal}
                  className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black font-mono text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>👑 全課程制覇！修了証を確認</span>
                </button>
              ) : hasProgress ? (
                <button
                  type="button"
                  onClick={() => onSelectChapter(nextUncompletedChapter.slug)}
                  className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-xs sm:text-sm transition shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ 続きから学ぶ</span>
                  <span className="text-[11px] font-normal opacity-90 truncate max-w-[130px] sm:max-w-[180px]">
                    （{nextUncompletedChapter.courseChapterCode ? `第${nextUncompletedChapter.courseChapterCode.replace(/^[CML]/, '')}章` : nextUncompletedChapter.title.slice(0, 10)}）
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="py-3 px-5 rounded-2xl bg-slate-900/60 text-slate-600 border border-slate-800/80 font-mono text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                  title="まずは第1章から始めましょう！"
                >
                  <span>続きから学ぶ（未開始）</span>
                </button>
              )}
            </div>

            {/* 学習進捗 & 修了証への導線 */}
            {onOpenMilestoneModal && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex-1 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>学習進捗：</span>
                    <span className="text-cyan-300 font-bold">{completedChapters.length} / {ALL_CHAPTERS.length} 章完了</span>
                  </div>
                  <div className="text-cyan-400 font-bold">
                    {Math.round((completedChapters.length / ALL_CHAPTERS.length) * 100)}%
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenMilestoneModal}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold font-mono text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>🏆 公式修了証・進捗引継ぎ</span>
                </button>
              </div>
            )}
          </div>

          {/* 右側：サイトの意図に合った2頭身シロクマ先生＆ペンギン開発ラボイラスト */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div 
              onClick={() => onOpenGameModal && onOpenGameModal('v2_classes', 'L2', 'クラス化とファイル分割')}
              className="w-full max-w-md lg:max-w-none rounded-3xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/80 overflow-hidden relative group bg-slate-950/90 cursor-pointer"
              title="クリックしてゲームエミュレータを起動！"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={getAssetUrl('/images/shirokuma_chibi_game_lab.jpg')}
                  alt="シロクマ先生とペンギン生徒がレトロゲーム開発に熱中するC++ラボ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-mono font-black text-sm flex items-center gap-2 shadow-2xl shadow-cyan-500/50 scale-95 group-hover:scale-100 transition-transform">
                    <Gamepad2 className="w-5 h-5 text-slate-950" />
                    <span>ゲームを起動する ▶</span>
                  </span>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-900/90 border-t border-cyan-500/20">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    シロクマ先生＆ペンギンの開発ラボ
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>PLAY GAME</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                  「インベーダーゲームを動かしながら、壊れないC++設計を一緒にマスターしよう！」
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 【問題提起・課題駆動】「最初にこの設計の壁に答えられますか？」 */}
      <section className="space-y-5">
        <div className="border-l-4 border-amber-400 pl-4 space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>CHALLENGE-DRIVEN LEARNING / なぜ設計が必要なのか？</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white font-sans tracking-tight">
            最初に、この「4つの現場の壁」に答えられますか？
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            文法を知っているだけでは防げない。C++開発で誰もが一度は地獄を見るリアルな破綻と、それを解決するアーキテクチャの進化。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 問い 1 */}
          <div 
            onClick={() => onSelectChapter('chapter-4-inheritance-polymorphism')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1524] to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Q1. 拡張性の壁
                </span>
                <span className="text-xs font-mono text-slate-500">Ch.4 (L4)</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                「敵の種類を10種類に増やしたら、何が壊れる？」
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                更新・描画・当たり判定のいたる所に巨大な <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">switch(enemy.type)</code> が出現。敵を1体足すたびに既存コードを10箇所修正し、無関係な敵にバグが伝播する地獄。
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-mono font-bold text-amber-400 border-t border-slate-800/80 mt-3">
              <span>解決策：vtableと動的多態性（開閉原則）</span>
              <span className="group-hover:translate-x-1 transition-transform">解説へ →</span>
            </div>
          </div>

          {/* 問い 2 */}
          <div 
            onClick={() => onSelectChapter('chapter-5-smart-pointers-raii')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1524] to-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Q2. メモリ所有権の壁
                </span>
                <span className="text-xs font-mono text-slate-500">Ch.5 (M1)</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                「ステージ遷移時にボスが消えない。誰が解放の責任を持つ？」
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                生ポインタ <code className="text-cyan-300 font-mono bg-slate-950 px-1 py-0.5 rounded">Boss*</code> をGameManagerもSceneも保持。誰が <code className="text-cyan-300 font-mono bg-slate-950 px-1 py-0.5 rounded">delete</code> すべきか曖昧になり、二重解放（Double Free）即死クラッシュかメモリリークかの二者択一に。
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 border-t border-slate-800/80 mt-3">
              <span>解決策：std::unique_ptr と RAII 所有権モデル</span>
              <span className="group-hover:translate-x-1 transition-transform">解説へ →</span>
            </div>
          </div>

          {/* 問い 3 */}
          <div 
            onClick={() => onSelectChapter('chapter-6-game-design-patterns')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1524] to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Q3. 結合度の壁
                </span>
                <span className="text-xs font-mono text-slate-500">Ch.6 (L5)</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                「敵が死んだ瞬間、UIスコア加算と爆発音をどこに書く？」
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                EnemyクラスがSoundEngineやUIManagerに直接依存。音効や描画のない単体テストコードがリンクエラーで動かせなくなる泥沼密結合。
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-mono font-bold text-purple-400 border-t border-slate-800/80 mt-3">
              <span>解決策：Observer パターンと疎結合イベント通知</span>
              <span className="group-hover:translate-x-1 transition-transform">解説へ →</span>
            </div>
          </div>

          {/* 問い 4 */}
          <div 
            onClick={() => onSelectChapter('chapter-11-memory-pool-allocator')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1524] to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Q4. リアルタイム性能の壁
                </span>
                <span className="text-xs font-mono text-slate-500">Ch.11 (M11)</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                「弾を毎秒1000発撃ったら、なぜ突然ゲームがカクつく？」
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                毎フレームの <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">new / delete</code> によるヒープ断片化とOSカーネル呼び出しコスト。ガベージコレクションがないC++だからこそ、アロケーション戦略がフレームレートを左右する。
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 border-t border-slate-800/80 mt-3">
              <span>解決策：固定長ブロック・メモリプールアロケータ</span>
              <span className="group-hover:translate-x-1 transition-transform">解説へ →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 【主線コンテンツ】ゲーム設計進化ロードマップ（10段階の進化ストーリー） */}
      <section className="space-y-4">
        <div className="border-l-4 border-cyan-400 pl-4 space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
            <Workflow className="w-3.5 h-3.5 text-cyan-400" />
            <span>GAME REFACTORING STORY / 主線ロードマップ</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white font-sans tracking-tight">
            1本のゲームを10段階で進化させる「設計進化マップ」
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            動くだけのベタ書きコードから、現代の商用ゲームエンジン同等のECSアーキテクチャまで。各ステージの「Beforeの痛点」と「Afterのスキル」をクリックして対比できます。
          </p>
        </div>

        <GameEvolutionRoadmap onSelectChapter={onSelectChapter} onOpenGameModal={onOpenGameModal} />
      </section>

      {/* 4. 目的別クイックスタート（迷いをゼロにする最短ルート） */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
            目的から選ぶクイックスタート
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 初心者 */}
          <a
            href="/chapter-1-spaghetti-code"
            onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-1-spaghetti-code'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🐣</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">初級・原点</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">C++をゼロから学ぶ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">まずはここから！500行のスパゲティコードを動かして設計の限界を体感。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span>第1章（L1）へ進む</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* モダンC++ */}
          <a
            href="/chapter-5-smart-pointers-raii"
            onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-5-smart-pointers-raii'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🚀</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">C++11〜20</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">モダンC++を極める</h3>
              <p className="text-xs text-slate-400 leading-relaxed">スマポ、ムーブ、ラムダ、可変引数、ECSなど現代の実戦規格を一気習得。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
              <span>モダン第1章（M1）へ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* コード読解 */}
          <a
            href="/reading-step-1"
            onClick={(e) => { e.preventDefault(); onSelectChapter('reading-step-1'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔍</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">鑑識・実戦</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">他人のコードを読む</h3>
              <p className="text-xs text-slate-400 leading-relaxed">書く前に読む！巨大リポジトリ攻略、スレッド競合、メモリ破壊の鑑識法。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-purple-400">
              <span>読解Step 1（R1）へ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* 文法チートシート */}
          <a
            href="/guide-cpp-syntax-reference"
            onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group flex flex-col justify-between cursor-pointer no-underline text-inherit"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📖</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">逆引きリファレンス</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">文法急所チートシート</h3>
              <p className="text-xs text-slate-400 leading-relaxed">「ポインタと参照の違いは？」「cast4種は？」実務で迷うポイントを網羅。</p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
              <span>チートシートを開く</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </section>

      {/* 3. 4大メインコンテンツ（サイトの柱） */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOUR MAIN PILLARS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            シロクマC++ラボを構成する <span className="text-cyan-400">4大コンテンツ</span>
          </h2>
          <p className="text-sm text-slate-400 font-sans mt-1">
            学びたい目的に合わせて、最適な柱から学習を開始できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ピラー 1: クラシック基礎編 */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-amber-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                  全16章（L1〜L16）
                </span>
                <span className="text-xs font-mono text-slate-400">進捗: {classicCompleted} / 16 完了</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>🏛️ クラシックC++現場実務編</span>
                </h3>
                <p className="text-xs font-mono text-amber-400 mt-0.5">C言語・C++03 / 組込み・制約環境における【レガシーの正解】</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                動的メモリ禁止・MISRA準拠・決定論的リアルタイム応答など、今なお現場でレガシーが推奨される理由と、その制約下で破綻させない「静的オブジェクトプール」「不透明ポインタ」「クラシックOOP」の真の正解を習得します。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-amber-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#L1 構造化設計の正解</span>
                  <span>#L2 Opaqueポインタとクラス</span>
                  <span>#L3 静的プール設計</span>
                  <span>#L4 vtable多態性</span>
                  <span>#L5 State/Observer</span>
                  <span>#L11 メモリプール</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/chapter-1-spaghetti-code"
                onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-1-spaghetti-code'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer no-underline"
              >
                <span>第1章（L1）からスタート</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('classic');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全16章の目次を見る ↓
              </button>
            </div>
          </div>

          {/* ピラー 2: モダン実践編 */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-cyan-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  全14章（M1〜M14）
                </span>
                <span className="text-xs font-mono text-slate-400">進捗: {modernCompleted} / 14 完了</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>🚀 モダンC++実践編</span>
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">C++11 / 14 / 17 / 20 規格体系化・ゼロオーバーヘッド設計</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                生ポインタの解放漏れや無駄なコピーを完全撲滅！RAIIスマートポインタ、ムーブセマンティクス、ラムダ、可変引数、string_view、そして新世代ECSアーキテクチャまで、現代のゲーム開発に必須の規格を体系的に網羅。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-cyan-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#M1 スマポ/RAII</span>
                  <span>#M2 ムーブ</span>
                  <span>#M3 ラムダ</span>
                  <span>#M5 マルチスレッド</span>
                  <span>#M6 string_view</span>
                  <span>#M10 ECS設計</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/chapter-5-smart-pointers-raii"
                onClick={(e) => { e.preventDefault(); onSelectChapter('chapter-5-smart-pointers-raii'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer no-underline"
              >
                <span>モダン第1章（M1）からスタート</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('modern');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全14章の目次を見る ↓
              </button>
            </div>
          </div>

          {/* ピラー 3: コード読解演習 */}
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-purple-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                  全6ステップ（R1〜R6）
                </span>
                <span className="text-xs font-mono text-slate-400">進捗: {readingCompleted} / 6 完了</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>🧭 コード読解・現場鑑識演習</span>
                </h3>
                <p className="text-xs font-mono text-purple-400 mt-0.5">現場即戦力・OSS解読・競合＆メモリ破壊捜査</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                「動かないコード」「他人が書いた謎コード」に立ち向かうプロの眼を養成。Box2D物理エンジンの実地解読から、たまにしか起きないマルチスレッド競合（Data Race）、Use-After-FreeとAddressSanitizer解析まで徹底演習。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-purple-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#R1 データフロー</span>
                  <span>#R2 ヘッダ依存</span>
                  <span>#R3 動的多態性</span>
                  <span>#R4 スレッド競合</span>
                  <span>#R5 Box2D解読</span>
                  <span>#R6 メモリ破壊捜査</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/reading-step-1"
                onClick={(e) => { e.preventDefault(); onSelectChapter('reading-step-1'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer no-underline"
              >
                <span>読解Step 1（R1）からスタート</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reading');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全6章の目次を見る ↓
              </button>
            </div>
          </div>

          {/* ピラー 4: 現場特集・チートシート */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-emerald-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  全8ガイド・特別コラム
                </span>
                <span className="text-xs font-mono text-slate-400">現場リファレンス</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
                  <span>📚 現場特集・実践チートシート</span>
                </h3>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">品質保証・設計ツール・言語思想・逆引き知識</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                カリキュラムの理解を加速させる実務の武器庫。迷ったときにすぐ引ける「C++基本文法チートシート」、テスト駆動開発を体感する「GoogleTest TDD入門」、GoFデザインパターン、UML設計書、言語思想コラムを完備。
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">主なテーマ:</div>
                <div className="text-emerald-300 flex flex-wrap gap-x-3 gap-y-1">
                  <span>#C++文法チートシート</span>
                  <span>#GoogleTest TDD</span>
                  <span>#GoFパターン</span>
                  <span>#UML設計</span>
                  <span>#C++を愛する理由</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="/guide-cpp-syntax-reference"
                onClick={(e) => { e.preventDefault(); onSelectChapter('guide-cpp-syntax-reference'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer no-underline"
              >
                <span>文法チートシートを開く</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('guides');
                  document.getElementById('curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs text-center transition cursor-pointer"
              >
                全8ガイドの目次を見る ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 【SEO・回遊性】重要設計キーワード・逆引きインデックス ＆ クイック検索 */}
      <section className="space-y-4 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>KEYWORD INDEX / 用語・設計思想から探す</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
              重要設計キーワード・逆引きインデックス
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              全44記事の中から、現場で直面する技術課題や設計用語からダイレクトに解説章へアクセスできます。
            </p>
          </div>

          {/* クイック検索フォーム */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="技術用語を検索 (例: RAII, ECS, メモリ)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                title="クリア"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 検索中なら検索結果を表示 */}
        {searchQuery ? (
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>「{searchQuery}」の検索結果: {searchResults.length}件</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                検索をリセット
              </button>
            </div>
            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
                一致する章が見つかりませんでした。別の用語をお試しください。
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {searchResults.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => onSelectChapter(ch.slug)}
                    className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-sm group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                        {ch.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ch.courseChapterCode || `Ch.${ch.id}`}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-sans line-clamp-1">
                      {ch.title}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 通常時は逆引きキーワードタグ一覧 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            {KEYWORD_INDEX.map((kw, idx) => (
              <div
                key={idx}
                onClick={() => onSelectChapter(kw.slug)}
                className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between gap-2 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-semibold">
                      {kw.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      {kw.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 font-mono mt-1.5 transition-colors">
                    {kw.name}
                  </h3>
                </div>
                <p className="text-[10.5px] text-slate-400 font-sans leading-tight line-clamp-2">
                  {kw.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. カリキュラム全目次（コンパクト・ディレクトリ） */}
      <section id="curriculum-directory" className="space-y-6 pt-4">
        {/* セクションヘッダー */}
        <div className="border-b border-slate-800 pb-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>CURRICULUM DIRECTORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            カリキュラム全目次（全44章）
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            各章をクリックすると、詳細な解説・対比コード・ブラウザ演習ページが開きます。
          </p>
        </div>

        {/* コース選択コントロール（ラジオボタン ＆ ドロップダウンセレクター） */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          {/* ヘッダー部：説明ラベル ＆ ドロップダウンリスト（プルダウン） */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm sm:text-base font-bold text-white font-sans">
                表示コースを選択（ラジオボタン または プルダウンで切替）：
              </span>
            </div>

            {/* ドロップダウン選択リスト（プルダウン） */}
            <div className="flex items-center gap-2">
              <label htmlFor="course-select-dropdown" className="text-xs font-mono text-slate-400 whitespace-nowrap">
                プルダウン:
              </label>
              <select
                id="course-select-dropdown"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                aria-label="コース選択ドロップダウン"
                className="w-full sm:w-auto py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs cursor-pointer focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition shadow-inner font-bold"
              >
                <option value="classic">🏛️ クラシック基礎編 (全16章 / L1〜L16)</option>
                <option value="modern">🚀 モダン実践編 (全14章 / M1〜M14)</option>
                <option value="reading">🧭 コード読解演習 (全6章 / R1〜R6)</option>
                <option value="guides">📚 現場特集・チートシート (全8本 / G1〜G5, コラム)</option>
              </select>
            </div>
          </div>

          {/* ラジオボタン式 4-Way セレクターカード */}
          <div 
            role="radiogroup" 
            aria-label="表示コース選択ラジオボタン"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {/* 1. クラシック基礎 */}
            <button
              type="button"
              role="radio"
              aria-checked={activeTab === 'classic'}
              onClick={() => setActiveTab('classic')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                activeTab === 'classic'
                  ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    activeTab === 'classic' ? 'border-amber-400 bg-amber-950' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {activeTab === 'classic' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                  </span>
                  <span className={`text-sm font-bold font-sans truncate ${activeTab === 'classic' ? 'text-amber-300' : 'text-slate-300'}`}>
                    🏛️ クラシック基礎
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  activeTab === 'classic'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  16章
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6.5 font-sans truncate">
                L1〜L16 / C言語・OOPの原点
              </p>
            </button>

            {/* 2. モダン実践 */}
            <button
              type="button"
              role="radio"
              aria-checked={activeTab === 'modern'}
              onClick={() => setActiveTab('modern')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                activeTab === 'modern'
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    activeTab === 'modern' ? 'border-cyan-400 bg-cyan-950' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {activeTab === 'modern' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </span>
                  <span className={`text-sm font-bold font-sans truncate ${activeTab === 'modern' ? 'text-cyan-300' : 'text-slate-300'}`}>
                    🚀 モダン実践
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  activeTab === 'modern'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  14章
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6.5 font-sans truncate">
                M1〜M14 / C++11〜20実戦規格
              </p>
            </button>

            {/* 3. コード読解 */}
            <button
              type="button"
              role="radio"
              aria-checked={activeTab === 'reading'}
              onClick={() => setActiveTab('reading')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                activeTab === 'reading'
                  ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/50'
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    activeTab === 'reading' ? 'border-purple-400 bg-purple-950' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {activeTab === 'reading' && <span className="w-2 h-2 rounded-full bg-purple-400" />}
                  </span>
                  <span className={`text-sm font-bold font-sans truncate ${activeTab === 'reading' ? 'text-purple-300' : 'text-slate-300'}`}>
                    🧭 コード読解
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  activeTab === 'reading'
                    ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  6章
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6.5 font-sans truncate">
                R1〜R6 / 現場鑑識・OSS解読
              </p>
            </button>

            {/* 4. 現場特集 */}
            <button
              type="button"
              role="radio"
              aria-checked={activeTab === 'guides'}
              onClick={() => setActiveTab('guides')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                activeTab === 'guides'
                  ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    activeTab === 'guides' ? 'border-emerald-400 bg-emerald-950' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {activeTab === 'guides' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </span>
                  <span className={`text-sm font-bold font-sans truncate ${activeTab === 'guides' ? 'text-emerald-300' : 'text-slate-300'}`}>
                    📚 現場特集
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  activeTab === 'guides'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  8本
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6.5 font-sans truncate">
                G1〜G5, コラム / 現場特集
              </p>
            </button>
          </div>

          {/* 選択中コースの詳細説明バナー */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                activeTab === 'classic' ? 'bg-amber-400 shadow-sm shadow-amber-400/50' :
                activeTab === 'modern' ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' :
                activeTab === 'reading' ? 'bg-purple-400 shadow-sm shadow-purple-400/50' :
                'bg-emerald-400 shadow-sm shadow-emerald-400/50'
              }`} />
              <span className="text-slate-300 truncate">
                {activeTab === 'classic' && '🏛️ クラシック基礎編（全16章・L1〜L16）：500行スパゲティコードからクラス化、動的メモリ、vtable多態性まで徹底リファクタ'}
                {activeTab === 'modern' && '🚀 モダン実践編（全14章・M1〜M14）：スマートポインタ、ムーブ、ラムダ、ECS、C++20コルーチンまで現代実戦規格'}
                {activeTab === 'reading' && '🧭 コード読解演習（全6ステップ・R1〜R6）：OSS実地解読、マルチスレッド競合、メモリ破壊（ASan）のプロ鑑識法'}
                {activeTab === 'guides' && '📚 現場特集・実践チートシート（全8本）：実践ガイド（G1〜G5：環境構築・文法・読解・UML・GoogleTest）＋ 特別コラム3編'}
              </span>
            </div>
            <span className="text-slate-400 font-bold shrink-0 self-end sm:self-auto">
              全 {currentList.length} 件を表示中
            </span>
          </div>
        </div>

        {/* リスト表示 */}
        <div className="space-y-2.5">
          {currentList.map((ch) => {
            const isCompleted = completedChapters.includes(ch.id);
            const chapterCode = getChapterCode(ch);

            // トラックに応じたテーマ色
            const isClassic = ch.courseTrack === 'classic';
            const isModern = ch.courseTrack === 'modern';
            const isReading = ch.courseTrack === 'reading';

            const badgeStyle = 
              isClassic
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                : isModern
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : isReading
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';

            const hoverBorder =
              isClassic
                ? 'hover:border-amber-400/60'
                : isModern
                ? 'hover:border-cyan-400/60'
                : isReading
                ? 'hover:border-purple-400/60'
                : 'hover:border-emerald-400/60';

            const hoverTitle =
              isClassic
                ? 'group-hover:text-amber-300'
                : isModern
                ? 'group-hover:text-cyan-300'
                : isReading
                ? 'group-hover:text-purple-300'
                : 'group-hover:text-emerald-300';

            const meta = getChapterMeta(ch);

            return (
              <a
                key={`${activeTab}-${ch.id}-${ch.slug}`}
                href={`/${ch.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectChapter(ch.slug);
                }}
                className={`group flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 ${hoverBorder} hover:bg-slate-900 transition-all cursor-pointer no-underline text-inherit`}
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm font-black border shrink-0 mt-0.5 sm:mt-0 ${badgeStyle}`}>
                    {chapterCode}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm sm:text-base font-bold text-white ${hoverTitle} transition-colors truncate`}>
                        {ch.title}
                      </h3>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          完了
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-sans">
                      {ch.subtitle || ch.description}
                    </p>

                    {/* メタデータバッジ（目安時間・重要度・難易度） */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px] sm:text-[11px] font-mono">
                      {/* 目安時間 */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/80 text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{meta.readingTimeText}</span>
                      </span>

                      {/* 重要度 */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold ${meta.badgeClasses.importance}`}>
                        <span>{meta.importanceStars}</span>
                        <span>{meta.importanceLabel}</span>
                      </span>

                      {/* 難易度 */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${meta.badgeClasses.difficulty}`}>
                        <span>{meta.difficulty}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  <span className="hidden sm:inline-block text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                    開く
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 5. サイトの4大特長（なぜゲーム開発で学ぶのか？） */}
      <section className="space-y-6 pt-4 border-t border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEARNING FEATURES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            シロクマC++ラボの <span className="text-cyan-400">4大特長</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            文法暗記ではなく、現場の課題解決と設計思想が体に染み込む学習体験を提供します。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl">
              🎮
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              体感型ゲームリファクタ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              理論だけでなく、画面内で実際に動くインベーダー風ゲームを進化させながら、オブジェクト指向やRAIIの威力を体感できます。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center justify-center text-xl">
              ⚖️
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              ビフォー・アフター徹底対比
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              現場の苦痛（メモリリーク、重複コード、スパゲティ）と、設計適用後の洗練されたコードを横並びで比較して学べます。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl">
              🔬
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              ブラウザ完結プレイグラウンド
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              環境構築は一切不要。ブラウザ内のWebAssemblyエミュレータと実行環境で、クリック1つですぐに動作確認が可能です。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xl">
              🛡️
            </span>
            <h3 className="text-base font-bold text-white font-sans">
              現場鑑識とモダン規格
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              書く技術だけでなく、他人の巨大OSSコードを読み解く鑑識法や、スレッド競合・メモリ破壊の調査手順まで網羅。
            </p>
          </div>
        </div>
      </section>

      {/* 6. CHARACTER（2つの登場人物）セクション */}
      <section className="space-y-6 pt-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-wider font-mono">
            CHARACTER
          </h2>
          <p className="text-slate-400 text-sm mt-1">2つの登場人物</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* シロクマ先生 */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-500/30 transition-colors shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <img
              src={getAssetUrl('/images/polar-bear-guide-pointing.png')}
              alt="シロクマ先生"
              className="w-32 h-32 rounded-full border-4 border-cyan-500 bg-slate-900 mb-6 object-cover shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform group-hover:scale-105"
            />
            <h3 className="text-xl font-bold text-cyan-400 mb-2">シロクマ先生 (Sensei)</h3>
            <p className="text-sm text-cyan-100 italic mb-4">「自動化への投資は、君自身の時間をハックすることなんだよ」</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              2頭身の愛らしいシロクマ。見た目とは裏腹に、低レイヤ技術、数理アルゴリズム、Linuxインフラ、C++の堅牢な設計に深い造詣を持つ超専門家。
            </p>
          </div>

          {/* ペンギンくん */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-slate-400/30 transition-colors shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-30"></div>
            <img
              src={getAssetUrl('/images/penguin-guide-simple.jpg')}
              alt="ペンギンくん"
              className="w-32 h-32 rounded-full border-4 border-slate-500 bg-slate-900 mb-6 object-cover shadow-lg transition-transform group-hover:scale-105"
            />
            <h3 className="text-xl font-bold text-slate-100 mb-2">ペンギンくん (Penguin)</h3>
            <p className="text-sm text-slate-200 italic mb-4">「今日も手作業で定時が過ぎたっス！もっと楽してぇ〜！」</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              実務でC++コードの手動ビルドや目視評価に日々追われている若手エンジニア。過酷な現場で苦しむ読者の代弁者。
            </p>
          </div>
        </div>
      </section>

      {/* 7. フッター前CTAセクション */}
      <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
          👾
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
            さあ、どちらのコースから始めますか？
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            現場の既存資産保守や基盤理解を深めるなら「クラシック基礎編」、モダンC++の新機能をマスターするなら「モダン実践編」。いつでも自由に行き来できます。
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onSelectChapter('chapter-1-spaghetti-code')}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-amber-500/20 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>🏛️ クラシック【L】第1章から開始</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectChapter('chapter-5-smart-pointers-raii')}
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-cyan-500/20 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>🚀 モダン【M】第1章から開始</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. 勉強を頑張った自分へのご褒美・お取り寄せグルメPR */}
      <AffiliatePromoBanner type="reward" limit={3} />

      {/* 9. シロクマ技術学習エコシステム（4サイト連携ロードマップ） */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 shrink-0">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                4サイト連携エコシステム
              </span>
              <span className="text-xs text-slate-400 font-mono">Shirokuma Engineering Ecosystem</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mt-0.5">
              シロクマ技術学習エコシステム ＆ 姉妹サイト
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              4つの専門メディアが有機的に連携。C++設計の土台から実務HMI・CI/CD自動化・先端信号処理まで、実務エンジニアへのステップアップを完全支援します。
            </p>
          </div>
        </div>

        {/* 4ステップ連携パイプライン */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Workflow className="w-4 h-4" /> 4サイトを巡る実践エンジニア成長ロードマップ
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">基礎設計 ➔ 実務UI ➔ 品質自動化 ➔ 専門応用</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* STEP 1: 当サイト */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/70 shadow-lg shadow-cyan-500/10 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">STEP 1【当サイト】</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 animate-pulse">
                    現在地
                  </span>
                </div>
                <div className="text-sm font-bold text-white">シロクマC++ラボ</div>
                <div className="text-[11px] text-cyan-300/80 font-mono">C++設計 / OOP / RAII / ECS</div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  1本のゲームを題材に、生ポインタやswitch分岐を撲滅。「壊れない設計とモダンC++」の基礎体力を確立します。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-cyan-500/20 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <span>🎯 全44章のカリキュラム学習</span>
              </div>
            </div>

            {/* STEP 2: Qt×C++ */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 hover:border-emerald-500/60 transition flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-emerald-400 font-bold">STEP 2【UI / HMI】</div>
                <div className="text-sm font-bold text-white">シロクマQt×C++ラボ</div>
                <div className="text-[11px] text-emerald-300/80 font-mono">Qt / QML / Linux HMI</div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  設計したコアロジックを産業用計器やリアルタイムダッシュボードへ接続。GUIとワーカースレッドの分離を習得。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span>🖥️ 計器・可視化GUIの実装</span>
              </div>
            </div>

            {/* STEP 3: 自動化ラボ */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/30 hover:border-blue-500/60 transition flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-blue-400 font-bold">STEP 3【品質 / CI/CD】</div>
                <div className="text-sm font-bold text-white">シロクマC++自動化ラボ</div>
                <div className="text-[11px] text-blue-300/80 font-mono">Python / Docker / CI・テスト</div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  手動ビルド・目視テストを根絶。CMake・Docker・GitHub Actions・ASanで自動化パイプラインを構築。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-500/20 text-[10px] text-blue-400 font-mono flex items-center gap-1">
                <span>⚡ 開発・テスト工程の完全自動化</span>
              </div>
            </div>

            {/* STEP 4: ソナー入門 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/30 hover:border-indigo-500/60 transition flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-indigo-400 font-bold">STEP 4【先端応用】</div>
                <div className="text-sm font-bold text-white">水中音響・ソナー技術入門</div>
                <div className="text-[11px] text-indigo-300/80 font-mono">音響・FFT・LOFAR・TMA</div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  C++・GUI・自動化の技術を、最高難度の実世界リアルタイム信号処理・数理物理シミュレーションへ応用。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-500/20 text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                <span>🌊 実応用・信号処理の最前線</span>
              </div>
            </div>
          </div>
        </div>

        {/* 姉妹サイト3枚の詳細カード */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 1. シロクマQt×C++ラボ */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-[#071f1a] to-slate-950 p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-emerald-400/60 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
                  🖥️
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Linux × Qt GUI開発
                  </span>
                  <span className="text-xs font-mono text-slate-400">shirokuma-qt-cpp.jp</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                  シロクマQt×C++ラボ
                </h3>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">
                  Qt / QML / 産業用計器・リアルタイム描画
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Linux環境で動くHMIや産業用計器ソフトウェアをQtで構築！シグナル＆スロット、マルチスレッド下での安全なデータ転送、リアルタイム描画ダッシュボードを体系的に学びます。
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <a
                href="https://shirokuma-qt-cpp.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Qtラボを見る</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. シロクマC++自動化ラボ */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-[#071322] to-slate-950 p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-cyan-400/60 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 shrink-0">
                  ⚡
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    C++自動化・実務効率化
                  </span>
                  <span className="text-xs font-mono text-slate-400">shirokuma-auto-cpp.jp</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                  シロクマC++自動化ラボ
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  Docker / pybind11 / CI・テスト自動化
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Python、Docker、CMake、CI/CDを活用して現場のC++開発を自動化！手動ビルドや目視テストを撲滅し、数理アルゴリズムの自動評価パイプラインを構築します。
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <a
                href="https://shirokuma-auto-cpp.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>自動化ラボを見る</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 3. 水中音響・ソナー技術入門 */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-[#0a1528] to-slate-950 p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-indigo-400/60 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
                  🌊
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                    水中音響・信号処理
                  </span>
                  <span className="text-xs font-mono text-slate-400">sonar-guide.jp</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                  水中音響・ソナー技術入門
                </h3>
                <p className="text-xs font-mono text-indigo-400 mt-0.5">
                  波の物理 / FFT / LOFAR / 音響シミュレータ
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                シロクマ先生がナビゲート！波の物理からFFT・LOFAR・TMA信号処理まで、音・動的グラフ・物理シミュレーターで直感的に学べる本格技術教育サイトです。
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <a
                href="https://sonar-guide.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>ソナー入門を見る</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. 品質保証・技術監修体制（E-E-A-T）と商標に関する表示 */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base sm:text-lg font-bold text-white font-sans">
            品質保証・技術監修（E-E-A-T）および商標に関する表示
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 font-sans leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5 text-xs">
              <span>🛠️ 現役組込みエンジニア監修 ＆ 動作検証環境</span>
            </div>
            <p>
              シロクマC++ラボの全教材・解説コードは、現役の組込みソフトウェア・制御システム開発に従事するC++エンジニアが企画・執筆・技術監修を行っています。
            </p>
            <p className="text-slate-400 text-[11px]">
              組込み現場で厳格に求められる「メモリ安全性・生ポインタの撲滅・RAIIリソース管理」の本質を、直感的に動くゲーム教材を題材に体系化。主要3大コンパイラ（GCC 13+ / Clang 17+ / MSVC 2022, C++11〜C++20準拠）にて動作検証済みです。
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 font-mono flex items-center gap-1.5 text-xs">
              <span>⚖️ 商標に関する権利表示 ＆ 免責事項</span>
            </div>
            <p>
              「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する「RETRO SPACE SHOOTER」および各章の演習プログラムは、古典的シューティングゲームの基本原理とオブジェクト指向設計を習得するための完全独自開発による教育用コードです。株式会社タイトーとは一切関係ありません。
            </p>
            <p className="text-slate-400 text-[11px]">
              ※クラシック基礎編の初期章に含まれるスパゲティ・C言語的コードは設計比較のための学習用アンチパターンです。実務プロダクション環境へのコピペ転用はお控えください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
