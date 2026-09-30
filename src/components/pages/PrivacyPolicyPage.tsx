import React from 'react';
import { Shield, Eye, Lock, FileText, CheckCircle2, ArrowLeft, ExternalLink, Calendar, Building, HelpCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (slug: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8 font-sans text-slate-200">
      {/* パンくずリスト */}
      <nav aria-label="パンくずナビゲーション" className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <button
          onClick={() => onNavigate('top')}
          className="hover:text-cyan-400 transition flex items-center gap-1 cursor-pointer"
        >
          <span>TOP</span>
        </button>
        <span>/</span>
        <span className="text-cyan-400 font-semibold">プライバシーポリシー ＆ 免責事項</span>
      </nav>

      {/* ページタイトルヘッダー */}
      <header className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>LEGAL & PRIVACY POLICY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          プライバシーポリシー ＆ 免責事項
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          シロクマC++ラボ（以下「当サイト」）における、利用者情報の取り扱い、第三者配信広告サービス（Google AdSense等）、アクセス解析ツール、著作権指針および教材コードの利用に関する免責事項を定めます。
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>最終改定日: 2026年9月30日（制定日: 2026年9月19日）</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span>運営者: シロクマC++ラボ 技術編集部</span>
          </span>
        </div>
      </header>

      {/* 本文エリア */}
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* 第1条: 広告の配信について (Google AdSense 規約完全準拠) */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              第1条 広告の配信（Google AdSense 等）について
            </h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <p>
              当サイト（<span className="text-cyan-300 font-mono font-semibold">https://shirokuma-cpp.jp</span>）では、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。
            </p>
            <p>
              Google などの第三者広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他のウェブサイトへのアクセス情報に基づき「Cookie（クッキー）」を使用することがあります。このCookieには、氏名、住所、メールアドレス、電話番号などの個人を特定できる情報は含まれません。
            </p>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs sm:text-sm space-y-2">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>パーソナライズ広告の無効化（オプトアウト）について</span>
              </div>
              <p className="text-slate-300">
                Cookie を使用したパーソナライズ広告の配信を望まない場合、または詳細な仕組みをご確認されたい場合は、以下のリンクより広告設定の管理やCookieの無効化を行うことができます：
              </p>
              <ul className="list-disc list-inside space-y-1 text-cyan-400 font-mono">
                <li>
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1"
                  >
                    <span>Google 広告設定（Google 公式）</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1"
                  >
                    <span>www.aboutads.info（Network Advertising Initiative）</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 第2条: アクセス解析ツールについて */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              第2条 アクセス解析ツール（Google アナリティクス）について
            </h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <p>
              当サイトでは、サイトの利用状況の把握、カリキュラム教材の品質向上、および読者体験の改善を目的として、Google 社が提供するアクセス解析ツール「Google アナリティクス（Google Analytics 4）」を利用しています。
            </p>
            <p>
              Google アナリティクスはデータの収集のために Cookie を使用しています。このデータは匿名で収集されており、個人を特定する情報は含まれません。利用者はブラウザの設定で Cookie を無効にすることにより、トラフィックデータの収集を拒否することができます。
            </p>
            <p className="text-xs text-slate-400">
              ※Google アナリティクスの利用規約およびプライバシーポリシーに関する詳細は、Google 社の
              <a
                href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline mx-1"
              >
                Google アナリティクス利用規約
              </a>
              および
              <a
                href="https://policies.google.com/technologies/partner-sites?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline mx-1"
              >
                Google ポリシーと規約
              </a>
              をご覧ください。
            </p>
          </div>
        </section>

        {/* 第3条: 免責事項 */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              第3条 免責事項
            </h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <p>
              当サイトに掲載されている情報、サンプルコード、設計解説、図解については、可能な限り正確を期して作成・検証しておりますが、その正確性、完全性、妥当性、特定の環境での動作を保証するものではありません。
            </p>
            <p>
              当サイトに掲載された内容によって生じた直接的・間接的な損害、プログラムの誤作動、データ損失等について、当サイト運営者は一切の責任を負いかねます。コードの採用・実行はお手元の環境にて十分なテストを行った上で、ご自身の責任において行ってください。
            </p>
            <p>
              当サイトからリンクやバナーなどによって移動された外部サイトにおいて提供される情報、サービス、商品等についても、当サイト運営者は一切の責任を負いません。
            </p>
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-300">⚠️ 学習用アンチパターンコードの取扱いに関する注意：</span><br />
              クラシック編の初期章等に掲載されている生ポインタ多用コードやスパゲティコードは、設計の破綻やメモリリーク・多重解放（Double Free）の危険性を体感するための【教育用アンチパターン】です。これらを商用プロダクション環境や実務システムへ直接転用・コピペすることはお控えください。
            </div>
          </div>
        </section>

        {/* 第4条: 著作権・知的財産権・商標について */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              第4条 著作権・商標について
            </h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <p>
              当サイトに掲載されている文章、画像、デザイン、教材プログラム、キャラクター意匠（シロクマ先生、ペンギン生徒等）の著作権は、当サイト運営チームに帰属します。
            </p>
            <p>
              私的使用その他著作権法によって明示的に認められる範囲を超えて、これらを無断で転載、複製、改変、スクレイピング、二次配布することは固く禁じます。
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
              ※「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する教材および「RETRO SPACE SHOOTER」プログラムは、古典的な固定画面シューティングゲームのアルゴリズムやオブジェクト指向設計を自作・学習するための完全オリジナルの教育コンテンツであり、株式会社タイトーとは一切関係ありません。
            </div>
          </div>
        </section>

        {/* 第5条: 運営者・技術監修体制（E-E-A-T） */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              第5条 運営者情報・技術監修体制（E-E-A-T）
            </h2>
          </div>
          <div className="space-y-3 text-slate-300 text-sm">
            <p>
              当サイトの教材コンテンツは、現役の組込み制御システム・リアルタイム通信基盤開発に従事するC++エンジニア陣が企画・執筆・技術監修を行っています。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">運営主体</div>
                <div>シロクマC++ラボ 技術編集部</div>
                <div className="text-slate-400 mt-0.5">所在地: 日本国内</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">検証コンパイラ</div>
                <div>GCC 13+ / Clang 17+ / MSVC 2022</div>
                <div className="text-slate-400 mt-0.5">C++11〜C++20 規格準拠</div>
              </div>
            </div>
          </div>
        </section>

        {/* 第6条: プライバシーポリシーの改定 */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-3 shadow-lg">
          <h2 className="text-lg font-bold text-white">
            第6条 本ポリシーの変更・改定
          </h2>
          <p className="text-slate-300">
            当サイトは、法令の改正、広告サービスの規約変更、またはコンテンツの追加に伴い、本プライバシーポリシーの内容を事前の予告なく変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載された時点で即時に効力を生じるものとします。
          </p>
        </section>
      </div>

      {/* フッターナビゲーション */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => onNavigate('top')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold transition cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>TOPへ戻る</span>
        </button>
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => onNavigate('about')}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            当サイトについて（About） ➔
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => onNavigate('contact')}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            お問い合わせ（Contact） ➔
          </button>
        </div>
      </div>
    </div>
  );
};
