import React, { useState, useEffect } from 'react';
import {
  AFFILIATE_GROUPS,
  AffiliateCategory,
  A8BannerItem,
  BannerGroup,
} from '../../data/affiliateBanners';
import { GraduationCap, Briefcase, Plane, Sparkles, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// ポータブルな画像パス解決（/cpp, /qt などのリバースプロキシ環境にも自動対応）
const resolveAssetUrl = (path: string): string => {
  if (typeof window !== 'undefined') {
    const p = window.location.pathname;
    if (p.startsWith('/cpp') && !path.startsWith('/cpp')) return `/cpp${path}`;
    if (p.startsWith('/qt') && !path.startsWith('/qt')) return `/qt${path}`;
    if (p.startsWith('/auto') && !path.startsWith('/auto')) return `/auto${path}`;
    if (p.startsWith('/sonar') && !path.startsWith('/sonar')) return `/sonar${path}`;
    if (p.startsWith('/nw') && !path.startsWith('/nw')) return `/nw${path}`;
  }
  return path;
};

export interface AffiliatePromoBannerProps {
  category?: AffiliateCategory | 'all';
  type?: string; // 後方互換用 ('busy' | 'reward')
  defaultCategory?: AffiliateCategory;
  className?: string;
  limit?: number; // 1ジャンルあたりの初期表示件数（デフォルト: 3）
  showTabs?: boolean; // タブを表示するか（デフォルト: true）
}

export const AffiliatePromoBanner: React.FC<AffiliatePromoBannerProps> = ({
  category,
  type,
  defaultCategory,
  className = '',
  limit = 3,
  showTabs = true,
}) => {
  // 後方互換マッピング
  const resolveInitialCategory = (): AffiliateCategory => {
    if (defaultCategory) return defaultCategory;
    if (category && category !== 'all') return category;
    if (type === 'busy') return 'school';
    if (type === 'reward') return 'travel';
    return 'school';
  };

  const [activeTab, setActiveTab] = useState<AffiliateCategory>(resolveInitialCategory);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [showAllInTab, setShowAllInTab] = useState<Record<AffiliateCategory, boolean>>({
    school: false,
    career: false,
    travel: false,
  });

  const storageKey = 'promo_banner_closed_global';

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === 'true') {
        setIsClosed(true);
      }
    } catch {}
  }, [storageKey]);

  const handleClose = () => {
    setIsClosed(true);
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {}
  };

  const toggleShowAll = (cat: AffiliateCategory) => {
    setShowAllInTab((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  if (isClosed) {
    return null;
  }

  const currentGroup: BannerGroup = AFFILIATE_GROUPS[activeTab] || AFFILIATE_GROUPS.school;
  const isSchool = activeTab === 'school';
  const isCareer = activeTab === 'career';
  const isTravel = activeTab === 'travel';

  // 表示件数の決定
  const isExpanded = showAllInTab[activeTab];
  const allBanners = currentGroup.banners;
  const displayedBanners: A8BannerItem[] = isExpanded ? allBanners : allBanners.slice(0, limit);
  const hasMore = allBanners.length > limit;

  // テーマ別のアクセントカラー
  const themeClasses = {
    school: {
      accentBorder: 'border-cyan-400/40 dark:border-cyan-500/30',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/50',
      glow: 'bg-cyan-500/10',
      tabActive: 'bg-cyan-600 dark:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold',
      speakerColor: 'text-cyan-700 dark:text-cyan-300',
    },
    career: {
      accentBorder: 'border-emerald-400/40 dark:border-emerald-500/30',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50',
      glow: 'bg-emerald-500/10',
      tabActive: 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-bold',
      speakerColor: 'text-emerald-700 dark:text-emerald-300',
    },
    travel: {
      accentBorder: 'border-amber-400/40 dark:border-amber-500/30',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
      glow: 'bg-amber-500/10',
      tabActive: 'bg-amber-600 dark:bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold',
      speakerColor: 'text-amber-700 dark:text-amber-300',
    },
  }[activeTab];

  return (
    <aside
      aria-label="スポンサー広告・おすすめ情報"
      className={`my-10 rounded-3xl border bg-slate-50/95 dark:bg-gradient-to-b dark:from-[#0b1322]/95 dark:via-[#070c18]/95 dark:to-[#050811] p-4 sm:p-7 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300 ${themeClasses.accentBorder} ${className}`}
    >
      {/* 背景装飾アクセントグロー */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${themeClasses.glow}`}
      />

      {/* ヘッダーエリア：PR表記 ＆ タブ切り替え ＆ 閉じるボタン */}
      <div className="relative z-10 space-y-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* PRラベル＆ジャンルバッジ */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
              [PR] スポンサーリンク
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors ${themeClasses.badgeBg}`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{currentGroup.badge}</span>
            </span>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-sans text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 bg-white/80 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/40 transition active:scale-95 cursor-pointer shadow-sm group"
            title="このセクションを閉じる"
            aria-label="広告セクションを閉じる"
          >
            <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span className="text-[11px] group-hover:text-rose-600 dark:group-hover:text-rose-200 transition-colors">
              広告を閉じる
            </span>
          </button>
        </div>

        {/* 3ジャンル切り替えタブ */}
        {showTabs && (
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('school')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                isSchool
                  ? themeClasses.tabActive
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>🎓 スクール・学習</span>
              <span className="text-[10px] opacity-80 font-mono">(3)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('career')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                isCareer
                  ? themeClasses.tabActive
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>💼 転職・キャリア</span>
              <span className="text-[10px] opacity-80 font-mono">(2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('travel')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                isTravel
                  ? themeClasses.tabActive
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Plane className="w-4 h-4 shrink-0" />
              <span>🏖️ 週末旅行・宿泊</span>
              <span className="text-[10px] opacity-80 font-mono">(10)</span>
            </button>
          </div>
        )}

        {/* タイトル ＆ サブタイトル */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {currentGroup.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            {currentGroup.subtitle}
          </p>
        </div>

        {/* マスコットキャラクターの応援ひとこと */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 flex-shrink-0 shadow-sm">
            <img
              src={resolveAssetUrl('/images/characters_mission.jpg')}
              alt={isSchool ? 'シロクマ指導官' : 'ペンギン通信士'}
              className={`w-full h-full object-cover ${
                isSchool ? 'object-[20%_35%]' : 'object-[85%_55%]'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`font-mono font-bold mr-1.5 ${themeClasses.speakerColor}`}>
              {isSchool ? 'シロクマ指導官 :' : 'ペンギン通信士 :'}
            </span>
            <span className="font-sans leading-relaxed">{currentGroup.mascotComment}</span>
          </div>
        </div>
      </div>

      {/* バナー一覧グリッド（300x250 レクタングルサイズ） */}
      <div className="relative z-10 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          {displayedBanners.map((banner) => (
            <div
              key={banner.id}
              className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-[#090e1a] p-2.5 sm:p-3 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-md dark:shadow-xl hover:shadow-2xl hover:scale-[1.01] group w-full max-w-[324px]"
            >
              {/* バナーヘッダー（サービス名 ＆ バッジ） */}
              <div className="w-full pb-2 px-1 flex items-center justify-between text-xs">
                <span className="font-bold font-sans text-slate-800 dark:text-slate-200 truncate max-w-[190px]">
                  {banner.name}
                </span>
                {banner.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                    {banner.badge}
                  </span>
                )}
              </div>

              {/* 300x250 A8.net公式バナー描画エリア */}
              <div className="w-[300px] max-w-full h-[250px] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative border border-slate-100 dark:border-slate-900 shadow-inner">
                <a
                  href={banner.linkUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="block w-[300px] max-w-full h-[250px] flex items-center justify-center"
                >
                  <img
                    src={banner.bannerImgUrl}
                    width={banner.width}
                    height={banner.height}
                    alt={`${banner.name} - スポンサー広告`}
                    className="w-[300px] max-w-full h-[250px] object-cover transition-opacity duration-200 group-hover:opacity-95"
                    style={{ border: 0 }}
                  />
                </a>
                {/* 1x1 トラッキングインプレッションビーコン */}
                <img
                  src={banner.trackingPixelUrl}
                  width={1}
                  height={1}
                  alt=""
                  style={{ border: 0, position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                />
              </div>

              {/* バナー説明文 ＆ リンク案内 */}
              <div className="w-full pt-2.5 px-1 space-y-1.5">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed line-clamp-2">
                  {banner.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 dark:text-slate-500">外部公式サイト</span>
                  <a
                    href={banner.linkUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>公式サイトを見る</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 旅行などで3件以上ある場合の「もっと見る」トグル */}
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => toggleShowAll(activeTab)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-sans font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition active:scale-95 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>折りたたむ</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>他のおすすめプラン・ホテルを見る（残り {allBanners.length - limit} 件）</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 最下部：広告を閉じるリンク */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400 dark:text-slate-500">
          <span>掲載広告は A8.net 提携プログラムです</span>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-300 transition-colors cursor-pointer group"
            title="このセクションを閉じる"
          >
            <X className="w-3.5 h-3.5 group-hover:text-rose-500 transition-colors" />
            <span className="text-[11px] group-hover:underline">広告枠を閉じる</span>
          </button>
        </div>
      </div>
    </aside>
  );
};