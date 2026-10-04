import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ArcticBackground: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 transition-colors duration-500">
      {/* 🌌 オーロラ光彩レイヤー（画面上部） */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[1600px] h-[550px] rounded-full blur-[100px] transition-opacity duration-700 ${
          isLight
            ? 'opacity-80 bg-gradient-to-r from-cyan-200/40 via-sky-200/35 via-emerald-200/25 to-blue-200/30'
            : 'opacity-40 bg-gradient-to-r from-cyan-500/20 via-sky-600/15 via-emerald-500/10 to-indigo-600/20'
        }`}
      />

      {/* サブオーロラ光彩（右上の淡いゆらめき） */}
      <div
        className={`absolute top-20 right-[-10%] w-[700px] h-[400px] rounded-full blur-[90px] transition-opacity duration-700 ${
          isLight
            ? 'opacity-60 bg-gradient-to-br from-emerald-100/40 to-cyan-100/30'
            : 'opacity-25 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10'
        }`}
      />

      {/* 🏔️ 氷山シルエット（背景の幾何学ポリゴン） */}
      <svg
        className={`absolute bottom-0 left-0 w-full h-[360px] sm:h-[460px] md:h-[540px] transition-all duration-700 ${
          isLight ? 'opacity-90' : 'opacity-20'
        }`}
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ライトモード用の氷山グラデーション */}
          <linearGradient id="icebergPeak1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={isLight ? "0.12" : "0.08"} />
            <stop offset="100%" stopColor="#0284c7" stopOpacity={isLight ? "0.03" : "0.02"} />
          </linearGradient>
          <linearGradient id="icebergPeak2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={isLight ? "0.10" : "0.06"} />
            <stop offset="100%" stopColor="#0369a1" stopOpacity={isLight ? "0.02" : "0.01"} />
          </linearGradient>
          <linearGradient id="icebergBase" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity={isLight ? "0.35" : "0.05"} />
            <stop offset="100%" stopColor="#f0f9ff" stopOpacity={isLight ? "0.7" : "0.1"} />
          </linearGradient>
        </defs>

        {/* 遠景の氷山（大・中央〜左） */}
        <polygon
          points="180,400 360,140 460,220 540,170 720,400"
          fill="url(#icebergPeak1)"
          stroke={isLight ? "rgba(56, 189, 248, 0.22)" : "rgba(56, 189, 248, 0.12)"}
          strokeWidth="1.2"
        />
        {/* 遠景の氷山（光の当たる稜線ファセット） */}
        <polygon
          points="360,140 460,220 380,400"
          fill={isLight ? "rgba(224, 242, 254, 0.45)" : "rgba(30, 58, 138, 0.15)"}
        />

        {/* 遠景の氷山（右奥） */}
        <polygon
          points="880,400 1080,180 1200,260 1340,400"
          fill="url(#icebergPeak2)"
          stroke={isLight ? "rgba(6, 182, 212, 0.2)" : "rgba(6, 182, 212, 0.1)"}
          strokeWidth="1.2"
        />
        <polygon
          points="1080,180 1200,260 1140,400"
          fill={isLight ? "rgba(207, 250, 254, 0.4)" : "rgba(14, 116, 144, 0.12)"}
        />

        {/* 中景の氷山（左奥） */}
        <polygon
          points="-40,400 120,240 240,400"
          fill="url(#icebergPeak1)"
          stroke={isLight ? "rgba(56, 189, 248, 0.18)" : "rgba(56, 189, 248, 0.08)"}
          strokeWidth="1"
        />

        {/* 最下部の氷原グラデーション（コンテンツの背景に溶け込む） */}
        <rect
          x="0"
          y="280"
          width="1440"
          height="120"
          fill="url(#icebergBase)"
        />
      </svg>

      {/* ❄️ 淡い氷の結晶・きらめきドット（微細な装飾） */}
      <div className="absolute inset-0 opacity-40">
        <div className={`absolute top-1/4 left-[15%] w-1.5 h-1.5 rounded-full ${isLight ? 'bg-sky-400/60' : 'bg-cyan-300/40'}`} />
        <div className={`absolute top-1/3 left-[28%] w-1 h-1 rounded-full ${isLight ? 'bg-cyan-400/50' : 'bg-cyan-200/30'}`} />
        <div className={`absolute top-1/5 right-[20%] w-2 h-2 rounded-full blur-[0.5px] ${isLight ? 'bg-emerald-400/50' : 'bg-emerald-300/30'}`} />
        <div className={`absolute top-1/2 right-[12%] w-1.5 h-1.5 rounded-full ${isLight ? 'bg-sky-400/50' : 'bg-sky-300/30'}`} />
      </div>
    </div>
  );
};
