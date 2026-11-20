import React, { useState } from 'react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { Shield, Sparkles, Mail, Network } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetPath';

interface FooterProps {
  onNavigate?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  return (
    <>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#070b14] py-10 text-center text-sm text-slate-600 dark:text-slate-400 font-mono transition-colors">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-slate-300 font-semibold flex-wrap">
            <span className="inline-flex items-center gap-2">
              <img
                src={getAssetUrl('/images/polar-bear-guide-pointing.png')}
                alt="シロクマ先生"
                className="w-5 h-5 rounded-full border border-cyan-400/60 object-cover inline-block shadow-sm"
              />
              <span>シロクマC++ラボ</span>
            </span>
            <span>•</span>
            <span className="text-slate-600 dark:text-slate-400 font-normal">〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜</span>
          </div>

          {/* 総合ポータル ＆ 姉妹メディア・相互リンク */}
          <div className="pt-3 pb-2 max-w-5xl mx-auto space-y-3">
            {/* 総合ポータルバナー */}
            <a
              href="https://shirokuma-tech.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sky-50/90 via-cyan-50/80 to-blue-50/90 dark:from-[#0a1526] dark:via-[#0b1b33] dark:to-[#071324] border border-cyan-300/80 dark:border-cyan-500/40 hover:border-cyan-400 dark:hover:border-cyan-300 transition-all duration-300 shadow-sm dark:shadow-xl hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex items-center -space-x-2 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-cyan-300 dark:border-cyan-500/40 shadow-inner flex-shrink-0">
                  <img
                    src={getAssetUrl('/images/characters/shirokuma_sensei.png')}
                    alt="シロクマ先生"
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400 shadow-sm"
                  />
                  <img
                    src={getAssetUrl('/images/characters/penguin_student.jpg')}
                    alt="ペンギン生徒"
                    className="w-8 h-8 rounded-full object-cover border border-amber-400 shadow-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40">
                      CAMPUS PORTAL
                    </span>
                    <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400">shirokuma-tech.jp</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition text-sm sm:text-base font-sans mt-0.5 block">
                    シロクマ技術総合ポータル（全ラボの学習記録を集約）
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                    C++設計・開発自動化・Qt GUI・ソナー音響・ネスペ対策・AIパスポートの総合学習プラットフォーム
                  </p>
                </div>
              </div>
              <span className="text-cyan-700 dark:text-cyan-400 text-sm font-bold font-mono group-hover:translate-x-1 transition hidden sm:inline-block">
                キャンバストップ ➔
              </span>
            </a>

            {/* 5つの姉妹ラボカード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. シロクマC++自動化ラボ */}
              <a
                href="https://shirokuma-tech.jp/auto/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/40 transition-all shadow-sm dark:shadow-lg text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                    ⚡
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-bold flex-shrink-0">
                        LAB 2
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition text-xs font-sans block">
                      シロクマ自動化ラボ
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5 truncate">
                      Docker / CI / 自動評価
                    </p>
                  </div>
                </div>
              </a>

              {/* 2. シロクマQt×C++ラボ */}
              <a
                href="https://shirokuma-tech.jp/qt/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all shadow-sm dark:shadow-lg text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                    🖥️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-bold flex-shrink-0">
                        LAB 3
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition text-xs font-sans block">
                      シロクマQt×C++ラボ
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5 truncate">
                      Linux / Qt / 計器HMI
                    </p>
                  </div>
                </div>
              </a>

              {/* 3. 水中音響・ソナー技術入門 */}
              <a
                href="https://shirokuma-tech.jp/sonar/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 transition-all shadow-sm dark:shadow-lg text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                    🌊
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30 font-bold flex-shrink-0">
                        LAB 4
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition text-xs font-sans block">
                      水中音響・ソナー入門
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5 truncate">
                      波の物理 / FFT / 解析
                    </p>
                  </div>
                </div>
              </a>

              {/* 4. ネスペ直前対策ナビ */}
              <a
                href="https://shirokuma-tech.jp/nw/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/40 transition-all shadow-sm dark:shadow-lg text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                    🛡️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 font-bold flex-shrink-0">
                        LAB 5
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition text-xs font-sans block">
                      ネスペ直前対策ナビ
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5 truncate">
                      午後記述 / DNS / 要点まとめ
                    </p>
                  </div>
                </div>
              </a>

              {/* 5. AIパスポートラボ */}
              <a
                href="https://shirokuma-tech.jp/ai-passport/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all shadow-sm dark:shadow-lg text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                    🤖
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 font-bold flex-shrink-0">
                        LAB 6
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition text-xs font-sans block">
                      AIパスポートラボ
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5 truncate">
                      生成AIシラバス / 過去問演習
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* 運営体制・技術監修（E-E-A-T）＆ 検証環境 */}
          <div className="pt-2 pb-1 max-w-2xl mx-auto text-xs text-slate-600 dark:text-slate-400 font-sans space-y-2">
            <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-slate-300 font-semibold flex-wrap">
              <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 text-xs font-mono font-bold">
                E-E-A-T 運営体制・技術監修
              </span>
              <span>シロクマC++ラボ 技術編集部</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              組込み制御ソフトウェア・リアルタイム通信システムの実務開発に従事する現役C++エンジニア陣が企画・執筆・技術監修を担当。<br className="hidden sm:inline" />
              現場で不可欠な「生ポインタ撲滅・RAIIリソース管理・ゼロオーバーヘッド原則」を体系化。主要3大コンパイラ（GCC 13+ / Clang 17+ / MSVC 2022, C++11〜C++20規格）にて全コードを実機動作検証済みです。
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono flex-wrap pt-0.5">
              <span>📍 運営拠点: 日本</span>
              <span>•</span>
              <a
                href="https://github.com/genki113355-tm/cpp-study"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1"
              >
                <span>GitHub リポジトリ / Issue報告</span>
                <span className="text-xs">↗</span>
              </a>
            </div>
          </div>

          {/* サイト主要ナビゲーションリンク（クローラー＆ユーザー向け静的アンカー） */}
          <nav aria-label="フッター主要ナビゲーション" className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-800/80">
            <ul className="flex items-center justify-center gap-x-6 gap-y-2 text-xs font-sans flex-wrap list-none p-0 m-0">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('about');
                    }
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>当サイトについて（About）</span>
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('privacy');
                    }
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>プライバシーポリシー ＆ 免責事項</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('contact');
                    }
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>お問い合わせ窓口</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('sitemap');
                    }
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition"
                >
                  <Network className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>サイトマップ</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* 商標および免責事項 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 max-w-2xl mx-auto text-left space-y-1 shadow-sm">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-300 font-sans flex items-center gap-1">
              <span>⚖️ 商標および学習用教材に関する免責事項</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              ※「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する教材および「RETRO SPACE SHOOTER」等のプログラムは、古典的な固定画面シューティングゲームのアルゴリズムやオブジェクト指向設計を自作・学習するための完全オリジナルの教育コンテンツであり、株式会社タイトーとは一切関係ありません。
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              ※本カリキュラム内のクラシック基礎編等に含まれるレガシー/アンチパターンコードは、設計の破綻やメモリリークを体感するための教育用コードです。プロダクション環境へのコピペ転用はお控えください。
            </p>
          </div>

          <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 text-xs pt-1 font-mono">
            <span>© 2026 シロクマC++ラボ (shirokuma-tech.jp/cpp). All rights reserved.</span>
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

