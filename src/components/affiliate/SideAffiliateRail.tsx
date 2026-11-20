import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SIDE_PROMO_STORAGE_KEY = 'side_promo_closed_v1';

export const SideAffiliateRail: React.FC = () => {
  const [isClosed, setIsClosed] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SIDE_PROMO_STORAGE_KEY) === 'true') {
        setIsClosed(true);
      }
    } catch {}
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    try {
      sessionStorage.setItem(SIDE_PROMO_STORAGE_KEY, 'true');
    } catch {}
  };

  if (isClosed) {
    return null;
  }

  return (
    <aside
      aria-label="スポンサー広告"
      className="w-full xl:w-[144px] shrink-0 px-4 pb-8 xl:px-0 xl:pr-3 xl:py-6 flex justify-center xl:block"
    >
      <div className="xl:sticky xl:top-24 w-fit mx-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-2 shadow-sm flex flex-col items-center gap-1.5 relative">
        {/* PR表記 & 閉じるボタン */}
        <div className="w-full flex items-center justify-between px-0.5 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold leading-none">
            PR
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="広告を閉じる"
            aria-label="サイド広告を閉じる"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 楽天市場 A8.net スカイスクレイパーバナー (120x500) */}
        <a
          href="https://rpx.a8.net/svt/ejp?a8mat=4BABTG+1RPEIA+2HOM+65ME9&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26082247997_4BABTG_1RPEIA_2HOM_65ME9%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="block w-[120px] h-[500px] rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950"
        >
          <img
            src="https://hbb.afl.rakuten.co.jp/hsb/0ec09ba5.4d3660f9.0eb4bbaa.95151395/"
            width={120}
            height={500}
            alt="楽天市場 - スポンサー広告"
            className="block w-[120px] h-[500px]"
            style={{ border: 0 }}
          />
        </a>

        {/* インプレッション計測用 1x1 ビーコン */}
        <img
          width={1}
          height={1}
          src="https://www13.a8.net/0.gif?a8mat=4BABTG+1RPEIA+2HOM+65ME9"
          alt=""
          className="pointer-events-none opacity-0 absolute bottom-0 right-0"
          style={{ border: 0 }}
        />
      </div>
    </aside>
  );
};
