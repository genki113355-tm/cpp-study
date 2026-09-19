import React from 'react';
import { X, Shield, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#070b16] border-2 border-cyan-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md text-base">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-sans leading-tight">
                プライバシーポリシー ＆ 免責事項
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                シロクマC++ラボにおける利用者情報の取扱い・広告配信・著作権指針
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 本文エリア */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {/* 第1条: 広告配信について */}
          <section className="space-y-2 rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>1. 広告の配信（Google AdSense 等）について</span>
            </h3>
            <p>
              当サイト（シロクマC++ラボ：https://shirokuma-cpp.jp）では、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。
            </p>
            <p>
              Google などの第三者広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他のウェブサイトへのアクセス情報に基づき「Cookie（クッキー）」を使用することがあります。Cookieには氏名、住所、メールアドレス、電話番号などの個人を特定する情報は含まれません。
            </p>
            <p>
              Cookie を無効にする方法や Google AdSense に関する詳細・パーソナライズ広告の無効化（オプトアウト）については、
              <a 
                href="https://adssettings.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline mx-1 font-semibold"
              >
                Google 広告設定
              </a>
              または
              <a 
                href="https://www.aboutads.info/choices/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline mx-1 font-semibold"
              >
                www.aboutads.info
              </a>
              をご参照ください。
            </p>
          </section>

          {/* 第2条: アクセス解析ツールについて */}
          <section className="space-y-2 rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>2. アクセス解析ツール（Google アナリティクス）について</span>
            </h3>
            <p>
              当サイトでは、サイトの利用状況を把握し、教材コンテンツの品質向上を図るため、Google によるアクセス解析ツール「Google アナリティクス」を使用しています。
            </p>
            <p>
              Google アナリティクスはトラフィックデータの収集のために Cookie を使用しています。このデータは匿名で収集されており、個人を特定するものではありません。ブラウザの設定で Cookie を無効にすることで、データ収集を拒否することが可能です。
            </p>
          </section>

          {/* 第3条: 免責事項 */}
          <section className="space-y-2 rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>3. 免責事項</span>
            </h3>
            <p>
              当サイトに掲載されている情報・プログラムコード・解説については、可能な限り正確を期して作成しておりますが、その正確性、安全性、有用性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
            </p>
            <p>
              当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
            </p>
          </section>

          {/* 第4条: 著作権・商標について */}
          <section className="space-y-2 rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>4. 著作権・商標について</span>
            </h3>
            <p>
              当サイトに掲載されている文章、画像、教材プログラムの著作権は、当サイト運営者に帰属します。私的使用その他法律によって明示的に認められる範囲を超えて、無断転載・複製・二次利用することを禁止します。
            </p>
            <p className="text-slate-400 text-xs">
              ※「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する「RETRO SPACE SHOOTER」等のプログラムおよび解説は、古典的な固定画面シューティングゲームのアルゴリズムやオブジェクト指向設計を自作・学習するための完全オリジナルの教育コンテンツであり、株式会社タイトーとは一切関係ありません。
            </p>
          </section>

          {/* 第5条: 運営者・技術監修体制（E-E-A-T）及び教材コードの利用について */}
          <section className="space-y-2 rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>5. 技術監修体制（E-E-A-T）及び教材コードの利用について</span>
            </h3>
            <p>
              当サイトのカリキュラムおよび教材プログラムは、現役の組込みソフトウェア・制御システム開発に従事するC++エンジニアが技術監修を行っています。
            </p>
            <p>
              組込み現場で厳格に求められるメモリ管理・リソース解放（RAII）・例外安全性・ポインタの堅牢な取扱いといった本質的な技術を、直感的に理解しやすいゲーム開発の過程を通して実践的に体得できるようカリキュラムを設計しています。
            </p>
            <p>
              掲載されているモダンC++コードは、主要3大コンパイラ（GCC 13+、Clang 17+、MSVC 2022）においてC++11〜C++20標準規格に準拠したビルドおよび動作検証を行っています。
            </p>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-300">⚠️ 教材用アンチパターンコードの取扱い：</span><br />
              クラシック基礎編等に掲載されている「C言語的アプローチ」や「第1章〜第4章のレガシーコード」は、設計の破綻やメモリリーク・スパゲティ構造を体感していただくための【反面教師としての学習用アンチパターン】です。これらを商用・実務プロダクション環境へ転用・コピペしたことにより生じたバグや損害について、当サイト運営チームは一切の責任を負いかねます。実務開発においては、各章で推奨しているモダンC++設計（RAII、スマートポインタ等）をご採用ください。
            </div>
          </section>

          {/* 制定日 */}
          <div className="pt-2 text-right text-xs text-slate-500 font-mono">
            制定日：2026年9月19日<br />
            運営者：シロクマC++ラボ 技術編集部
          </div>
        </div>

        {/* フッター閉じるボタン */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
