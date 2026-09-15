import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
  text?: string;
  hashtags?: string[];
  variant?: 'inline' | 'compact' | 'card';
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  text,
  hashtags = ['シロクマcpp', 'cpp', 'オブジェクト指向', 'ゲーム開発'],
  variant = 'inline',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://shirokuma-cpp.jp';
  };

  const finalUrl = getShareUrl();
  const shareText = text ? `${title}\n${text}` : title;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(finalUrl);
  const encodedTags = encodeURIComponent(hashtags.join(','));

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedTags}`;
  const hatenaShareUrl = `https://b.hatena.ne.jp/entry/${encodeURIComponent(finalUrl.replace(/^https?:\/\//, ''))}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(finalUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = finalUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="X (Twitter) でポストする"
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={handleCopy}
          title="リンクをコピー"
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700/60 flex items-center justify-center relative"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-cyan-500/20 shadow-lg ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">この記事が役に立ったらシェアしよう！</p>
              <p className="text-xs text-slate-400">学習の振り返りや知見の共有、ブックマークにぜひ活用してください</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={xShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-slate-900 text-white text-xs font-semibold border border-slate-700 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Xでシェア</span>
            </a>
            <a
              href={hatenaShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-[#00A4DE] hover:bg-[#0091c5] text-white text-xs font-bold transition shadow-sm"
              title="はてなブックマークに追加"
            >
              <span className="font-extrabold tracking-tighter">B!</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                copied
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>コピー完了！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>URLコピー</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // デフォルト: inline
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5 text-slate-400" />
        シェア:
      </span>
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 hover:bg-black text-white text-xs font-semibold border border-slate-700 transition"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>Xで共有</span>
      </a>
      <a
        href={hatenaShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-2 py-1 rounded-md bg-[#00A4DE] hover:bg-[#0091c5] text-white text-xs font-bold transition"
        title="はてなブックマークに追加"
      >
        <span className="font-extrabold tracking-tighter">B! ブックマーク</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition border ${
          copied
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
            : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-400" />
            <span>コピー済</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 text-slate-400" />
            <span>URLコピー</span>
          </>
        )}
      </button>
    </div>
  );
};
