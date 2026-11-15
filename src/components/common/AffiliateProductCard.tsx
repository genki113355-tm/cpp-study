import React from 'react';
import { BookItem, getAmazonSearchUrl, getRakutenSearchUrl, A8_RAKUTEN_TOP_PIXEL } from '../../data/newsletterAndAffiliate';
import { ShoppingBag, Box, Tag } from 'lucide-react';

interface AffiliateProductCardProps {
  product: BookItem;
}

export const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({ product }) => {
  const amazonUrl = getAmazonSearchUrl(product.isbnOrKeyword);
  const rakutenUrl = getRakutenSearchUrl(product.isbnOrKeyword);

  return (
    <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-md transition-all group">
      <div>
        {/* ヘッダー・カテゴリ */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-sky-50 to-cyan-50 dark:from-cyan-950/40 dark:via-slate-800 dark:to-cyan-950/20 p-3.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{product.icon}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-600 text-white shadow-2xs font-mono">
              {product.category}
            </span>
          </div>
          {product.priceHint && (
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              {product.priceHint}
            </span>
          )}
        </div>

        {/* 本文エリア */}
        <div className="p-4 space-y-2.5">
          <div className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{product.tag}</span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors font-mono">
            {product.title}
          </h4>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{product.author}</span> {product.publisher && <span>・ {product.publisher}</span>}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {product.description}
          </p>

          <div className="text-[11px] bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 mt-2">
            <span className="font-bold block text-[10px] text-amber-900 dark:text-amber-300 mb-0.5">💡 シロクマ推奨ポイント:</span>
            {product.recommendPoint}
          </div>
        </div>
      </div>

      {/* 2大ECサイト ボタンエリア */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2">
          {/* 楽天市場で探す (A8.net 経由) */}
          <a
            href={rakutenUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#bf0000] hover:bg-[#a60000] text-white text-xs font-bold shadow-xs hover:shadow transition-all text-center cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>楽天で探す</span>
          </a>

          {/* Amazonで探す */}
          <a
            href={amazonUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 text-xs font-bold shadow-xs hover:shadow transition-all text-center cursor-pointer"
          >
            <Box className="w-3.5 h-3.5 shrink-0" />
            <span>Amazonで探す</span>
          </a>
        </div>

        {/* トラッキングピクセル */}
        <img
          src={A8_RAKUTEN_TOP_PIXEL}
          width="1"
          height="1"
          alt=""
          className="hidden"
        />
      </div>
    </div>
  );
};
