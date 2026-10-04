import React from 'react';
import { Sparkles, Code2, Cpu, CheckCircle2, ArrowLeft, Target, HeartHandshake } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetPath';

interface AboutPageProps {
  onNavigate: (slug: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10 font-sans text-slate-800 dark:text-slate-200">
      {/* パンくずリスト */}
      <nav aria-label="パンくずナビゲーション" className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onNavigate('top')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1 cursor-pointer"
        >
          <span>TOP</span>
        </button>
        <span>/</span>
        <span className="text-cyan-700 dark:text-cyan-400 font-semibold">当サイトについて (About)</span>
      </nav>

      {/* ページタイトルヘッダー */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>ABOUT SHIROKUMA C++ LAB</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          シロクマC++ラボについて
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          〜ゲーム開発の実践を通じて学ぶオブジェクト指向設計 レガシー生ポインタからモダンC++17/20・ECS・TDDまで〜
        </p>
      </header>

      {/* 理念とミッション */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-700 dark:text-cyan-400 font-mono text-sm font-bold">
          <Target className="w-4 h-4" />
          <span>MISSION & PHILOSOPHY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          現場で勝てる「真のC++設計力」を、誰もが楽しく体得できるように
        </h2>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 leading-relaxed text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-md">
          <p>
            C++はゲームエンジン、自動運転、金融高頻度取引、組込みリアルタイム制御など、世界の最前線インフラを支え続ける至高のプログラミング言語です。しかしその一方で、学習難易度の高さや「生ポインタの解放漏れによるメモリリーク」「スパゲティ化した手続き型構造」など、初学者や現場エンジニアを悩ませる数多くの罠が存在します。
          </p>
          <p>
            当メディア「シロクマC++ラボ」は、単なる文法暗記ではなく、<strong className="text-slate-900 dark:text-white font-bold">「1本のインベーダー風シューティングゲーム（RETRO SPACE SHOOTER）」を多段階でリファクタリングしながら進化させていく実践カリキュラム</strong>を通じて、オブジェクト指向の神髄とモダンC++設計を体系的にマスターできる学習プラットフォームです。
          </p>
        </div>
      </section>

      {/* キャラクター紹介 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-700 dark:text-cyan-400 font-mono text-sm font-bold">
          <HeartHandshake className="w-4 h-4" />
          <span>GUIDE CHARACTERS</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          ナビゲーター紹介
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-cyan-300 dark:border-cyan-500/30 flex items-start gap-4 shadow-sm dark:shadow-md">
            <img
              src={getAssetUrl('/images/characters/shirokuma_sensei.png')}
              alt="シロクマ先生"
              className="w-16 h-16 rounded-2xl border-2 border-cyan-400 object-cover flex-shrink-0 bg-slate-100 dark:bg-slate-950 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">シロクマ先生</span>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 font-bold">
                  Mentor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                低レイヤ・組込みアーキテクチャおよび数理アルゴリズムの専門家。メモリの無駄遣いと二重解放（Double Free）を決して見逃さないが、教え方は温厚で超ロジカル。
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm dark:shadow-md">
            <img
              src={getAssetUrl('/images/characters/penguin_student.jpg')}
              alt="ペンギン生徒"
              className="w-16 h-16 rounded-2xl border-2 border-slate-400 dark:border-slate-600 object-cover flex-shrink-0 bg-slate-100 dark:bg-slate-950 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">ペンギン生徒</span>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  Learner
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                現場のレガシーコードと格闘する若手エンジニア。「とりあえず動けばいいや」とグローバル変数や生ポインタを乱用しては、シロクマ先生に優しくツッコまれる。読者の代弁者。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E-E-A-T: 運営体制と技術監修 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-700 dark:text-cyan-400 font-mono text-sm font-bold">
          <Code2 className="w-4 h-4" />
          <span>E-E-A-T & EDITORIAL TEAM</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          運営体制・執筆陣の専門性（E-E-A-T）
        </h2>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 leading-relaxed text-slate-700 dark:text-slate-300 text-sm shadow-sm dark:shadow-md">
          <p>
            当メディアの記事・教材プログラムは、<strong className="text-cyan-700 dark:text-cyan-300">「シロクマC++ラボ 技術編集部」</strong>が責任を持って執筆・監修しています。
          </p>
          <ul className="space-y-2 list-none p-0">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>実務経験に基づく知見:</strong> リアルタイム通信基盤、車載制御ユニット、高精度センサ処理など、安全確実なリソース管理が求められるプロダクション実務で培ったC++設計ノウハウを凝縮。</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>生ポインタの撲滅とRAII原則:</strong> C++11以降のスマートポインタ（std::unique_ptr, std::shared_ptr）を用いたゼロリーク設計を徹底指導。</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>テスト駆動開発（TDD）の普及:</strong> GoogleTestを活用し、ゲームロジックを安全かつ継続的にリファクタリングする品質保証体制を実践。</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 検証環境・品質保証 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-700 dark:text-cyan-400 font-mono text-sm font-bold">
          <Cpu className="w-4 h-4" />
          <span>VERIFICATION ENVIRONMENT</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          全コードのビルド検証環境
        </h2>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 leading-relaxed text-slate-700 dark:text-slate-300 text-sm shadow-sm dark:shadow-md">
          <p>
            教材に含まれる全てのC++コードは、主要3大コンパイラ（C++11〜C++20標準規格）において厳格な警告オプション（<code className="text-cyan-800 dark:text-cyan-300 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-800">-Wall -Wextra -Wpedantic</code>）を付与した検証を実施しています。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-cyan-700 dark:text-cyan-400 font-bold">GCC</div>
              <div className="text-slate-800 dark:text-slate-300 mt-1">GCC 13.2+</div>
              <div className="text-slate-500 text-xs">Linux / MinGW</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-cyan-700 dark:text-cyan-400 font-bold">Clang</div>
              <div className="text-slate-800 dark:text-slate-300 mt-1">LLVM Clang 17.0+</div>
              <div className="text-slate-500 text-xs">macOS / Ubuntu</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-cyan-700 dark:text-cyan-400 font-bold">MSVC</div>
              <div className="text-slate-800 dark:text-slate-300 mt-1">Visual Studio 2022</div>
              <div className="text-slate-500 text-xs">Windows x64</div>
            </div>
          </div>
        </div>
      </section>

      {/* フッターナビゲーション */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => onNavigate('top')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-sm font-semibold transition cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>TOPへ戻る</span>
        </button>
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => onNavigate('sitemap')}
            className="text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            サイトマップ（Sitemap） ➔
          </button>
          <span className="text-slate-600 dark:text-slate-400 dark:text-slate-600">|</span>
          <button
            onClick={() => onNavigate('contact')}
            className="text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            お問い合わせ（Contact） ➔
          </button>
        </div>
      </div>
    </div>
  );
};
