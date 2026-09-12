import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#070b14] py-10 text-center text-sm text-slate-400 font-mono">
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold flex-wrap">
          <span>👾 C++ Invader Academy</span>
          <span>•</span>
          <span>シロクマ先生 ＆ ペンギン生徒のオブジェクト指向冒険録</span>
        </div>
        <p className="text-slate-500 flex items-center justify-center gap-1 text-xs">
          <span>Designed with modern React, Tailwind CSS &amp; ISO C++17 Architecture</span>
        </p>
      </div>
    </footer>
  );
};
