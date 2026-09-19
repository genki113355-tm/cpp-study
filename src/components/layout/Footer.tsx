import React, { useState } from 'react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  return (
    <>
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

          {/* プライバシーポリシー ＆ 免責事項 リンク */}
          <div className="pt-1 flex items-center justify-center gap-4 text-xs font-sans">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-slate-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>プライバシーポリシー ＆ 免責事項</span>
            </button>
          </div>

          {/* 商標および免責事項 */}
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
            ※「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する教材および「RETRO SPACE SHOOTER」等のプログラムは、古典的な固定画面シューティングゲームのアルゴリズムやオブジェクト指向設計を自作・学習するための完全オリジナルの教育コンテンツであり、株式会社タイトーとは一切関係ありません。
          </p>

          <p className="text-slate-500 flex items-center justify-center gap-1 text-xs pt-2">
            <span>© 2026 シロクマC++ラボ (shirokuma-cpp.jp). All rights reserved.</span>
          </p>
        </div>
      </footer>

      {/* プライバシーポリシーモーダル */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};
