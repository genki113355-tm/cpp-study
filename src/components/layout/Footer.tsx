import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#070b14] py-10 text-center text-sm text-slate-400 font-mono">
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold flex-wrap">
          <span>🐻‍❄️ シロクマC++ラボ</span>
          <span>•</span>
          <span className="text-slate-400 font-normal">〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜</span>
        </div>
        <p className="text-slate-500 flex items-center justify-center gap-1 text-xs">
          <span>© 2026 シロクマC++ラボ (shirokuma-cpp.jp). All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};
