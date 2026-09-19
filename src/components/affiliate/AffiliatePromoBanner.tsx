import React, { useState, useEffect } from 'react';
import { BUSY_BANNERS, REWARD_BANNERS, A8BannerItem } from '../../data/affiliateBanners';
import { Sparkles, Utensils, HeartHandshake, X } from 'lucide-react';

interface AffiliatePromoBannerProps {
  type: 'busy' | 'reward';
  className?: string;
  limit?: number; // 表示個数の制限（指定がなければ全件、またはデフォルト3件など）
}

export const AffiliatePromoBanner: React.FC<AffiliatePromoBannerProps> = ({
  type,
  className = '',
  limit,
}) => {
  const [isClosed, setIsClosed] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(`promo_banner_closed_${type}`) === 'true') {
        setIsClosed(true);
      }
    } catch {}
  }, [type]);

  const handleClose = () => {
    setIsClosed(true);
    try {
      sessionStorage.setItem(`promo_banner_closed_${type}`, 'true');
    } catch {}
  };

  const group = type === 'busy' ? BUSY_BANNERS : REWARD_BANNERS;
  const isBusy = type === 'busy';
  const displayedBanners: A8BannerItem[] = limit ? group.banners.slice(0, limit) : group.banners;

  if (isClosed) {
    return null;
  }

  return (
    <div
      className={`my-10 rounded-3xl border bg-gradient-to-b from-[#0b1322]/90 via-[#070c18]/95 to-[#050811] p-3.5 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden ${
        isBusy
          ? 'border-cyan-500/30 shadow-cyan-950/20'
          : 'border-amber-500/30 shadow-amber-950/20'
      } ${className}`}
    >
      {/* 背景装飾アクセント */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isBusy ? 'bg-cyan-500/10' : 'bg-amber-500/10'
        }`}
      />

      {/* ヘッダーエリア：PR表記 ＆ タイトル ＆ 閉じるボタン */}
      <div className="relative z-10 space-y-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm border bg-slate-900/90 text-slate-300 border-slate-700">
            {isBusy ? (
              <Utensils className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isBusy ? '開発・学習サポート特集' : '学習達成ご褒美セレクション'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              [PR] スポンサーリンク
            </span>

            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-sans text-slate-400 hover:text-rose-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 transition active:scale-95 cursor-pointer shadow-sm group"
              title="この広告を閉じる"
              aria-label="広告を閉じる"
            >
              <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
              <span className="text-[11px] group-hover:text-rose-200 transition-colors">広告を閉じる</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white font-sans tracking-tight">
            {group.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans leading-relaxed">
            {group.subtitle}
          </p>
        </div>

        {/* マスコットキャラクターの応援ひとこと */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 shadow-sm">
            <img
              src="/images/characters_mission.jpg"
              alt={isBusy ? 'シロクマ指導官' : 'ペンギン通信士'}
              className={`w-full h-full object-cover ${
                isBusy ? 'object-[20%_35%]' : 'object-[85%_55%]'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className={`font-mono font-bold mr-1.5 ${
                isBusy ? 'text-cyan-300' : 'text-amber-300'
              }`}
            >
              {isBusy ? 'シロクマ指導官 :' : 'ペンギン通信士 :'}
            </span>
            <span className="font-sans leading-relaxed">{group.mascotComment}</span>
          </div>
        </div>
      </div>

      {/* バナー一覧グリッド（300x250 レクタングルサイズ対応） */}
      <div className="relative z-10 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          {displayedBanners.map((banner) => (
            <div
              key={banner.id}
              className="flex flex-col items-center justify-center rounded-2xl bg-[#090e1a] p-2 sm:p-2.5 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-[1.01] group w-full max-w-[320px]"
            >
              <div className="w-[300px] max-w-full h-[250px] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center relative">
                {/* A8.net公式アフィリエイトリンク ＆ バナー画像 */}
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
                    alt="スポンサー広告"
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

              <div className="w-full pt-2 flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <HeartHandshake className="w-3 h-3 text-cyan-400/80" />
                  <span>おすすめサービス</span>
                </span>
                <span className="text-slate-500 group-hover:text-cyan-300 transition-colors flex items-center gap-0.5">
                  <span>詳細を見る</span>
                  <span>↗</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 下部：広告を閉じるリンク */}
        <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-end">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-rose-300 transition-colors cursor-pointer group"
            title="この広告を閉じる"
            aria-label="広告を閉じる"
          >
            <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span className="text-[11px] group-hover:underline">広告を閉じる</span>
          </button>
        </div>
      </div>
    </div>
  );
};
