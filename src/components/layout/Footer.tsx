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

        {/* 姉妹メディア・相互リンク */}
        <div className="pt-3 pb-2 max-w-lg mx-auto">
          <a
            href="https://sonar-guide.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
                🌊
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">
                    姉妹サイト
                  </span>
                  <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition text-sm font-sans truncate">
                    水中音響・ソナー技術入門
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-0.5 truncate">
                  シロクマ先生と学ぶ、音・図解・数理シミュレーションで迫るソナー工学
                </p>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-cyan-400 transition font-mono text-sm pr-1">
              ↗
            </span>
          </a>
        </div>

        <p className="text-slate-500 flex items-center justify-center gap-1 text-xs pt-2">
          <span>© 2026 シロクマC++ラボ (shirokuma-cpp.jp). All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};
