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
            <span className="inline-flex items-center gap-2">
              <img
                src="/images/polar-bear-guide-pointing.png"
                alt="シロクマ先生"
                className="w-5 h-5 rounded-full border border-cyan-400/60 object-cover inline-block shadow-sm"
              />
              <span>シロクマC++ラボ</span>
            </span>
            <span>•</span>
            <span className="text-slate-400 font-normal">〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜</span>
          </div>

          {/* 姉妹メディア・相互リンク */}
          <div className="pt-3 pb-2 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. シロクマC++自動化ラボ */}
            <a
              href="https://shirokuma-auto-cpp.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                      姉妹サイト
                    </span>
                    <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition text-sm font-sans truncate">
                      シロクマC++自動化ラボ
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5 truncate">
                    Docker / pybind11 / 自動評価
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-cyan-400 transition font-mono text-sm pr-1">
                ↗
              </span>
            </a>

            {/* 2. シロクマQt×C++ラボ */}
            <a
              href="https://shirokuma-qt-cpp.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-lg text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
                  🖥️
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      姉妹サイト
                    </span>
                    <span className="font-bold text-slate-200 group-hover:text-emerald-300 transition text-sm font-sans truncate">
                      シロクマQt×C++ラボ
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5 truncate">
                    Linux / Qt / リアルタイム計器HMI
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-emerald-400 transition font-mono text-sm pr-1">
                ↗
              </span>
            </a>

            {/* 3. 水中音響・ソナー技術入門 */}
            <a
              href="https://sonar-guide.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 transition-all shadow-lg text-left"
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
                    波の物理 / FFT / 音響シミュレータ
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-cyan-400 transition font-mono text-sm pr-1">
                ↗
              </span>
            </a>
          </div>

          {/* 運営体制・技術監修（E-E-A-T）＆ 検証環境 */}
          <div className="pt-2 pb-1 max-w-2xl mx-auto text-xs text-slate-400 font-sans space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold flex-wrap">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px] font-mono">
                技術監修・品質保証
              </span>
              <span>シロクマC++ラボ 技術編集部</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              現役C++ソフトウェアエンジニア（組込み制御・システム開発実務経験）が全カリキュラムを設計・監修。<br className="hidden sm:inline" />
              現場で求められるメモリ管理・ポインタ安全性・RAIIモダン設計の知見を、直感的なゲーム教材として体系化。主要3大コンパイラ（GCC 13+ / Clang 17+ / MSVC 2022, C++11〜C++20準拠）にて動作検証済みです。
            </p>
          </div>

          {/* プライバシーポリシー ＆ 免責事項 リンク */}
          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-sans">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-slate-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>プライバシーポリシー ＆ 技術監修・免責事項</span>
            </button>
          </div>

          {/* 商標および免責事項 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 max-w-2xl mx-auto text-left space-y-1">
            <div className="text-[11px] font-bold text-slate-400 font-sans flex items-center gap-1">
              <span>⚖️ 商標および学習用教材に関する免責事項</span>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
              ※「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する教材および「RETRO SPACE SHOOTER」等のプログラムは、古典的な固定画面シューティングゲームのアルゴリズムやオブジェクト指向設計を自作・学習するための完全オリジナルの教育コンテンツであり、株式会社タイトーとは一切関係ありません。
            </p>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
              ※本カリキュラム内のクラシック基礎編等に含まれるレガシー/アンチパターンコードは、設計の破綻やメモリリークを体感するための教育用コードです。プロダクション環境へのコピペ転用はお控えください。
            </p>
          </div>

          <p className="text-slate-400 flex items-center justify-center gap-1 text-xs pt-1 font-mono">
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
