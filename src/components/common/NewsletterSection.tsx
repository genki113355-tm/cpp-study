import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Mail,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Send,
  ShoppingCart,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import {
  AFFILIATE_ITEMS,
  CPP_RECOMMENDED_PRODUCTS,
  NEWSLETTER_SAMPLES
} from '../../data/newsletterAndAffiliate';
import { AffiliateProductCard } from './AffiliateProductCard';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'newsletter' | 'books' | 'services'>('newsletter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const stored = JSON.parse(localStorage.getItem('shirokuma_newsletter_emails') || '[]');
      if (!stored.includes(email)) {
        stored.push(email);
        localStorage.setItem('shirokuma_newsletter_emails', JSON.stringify(stored));
      }
    } catch {}

    try {
      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, topics: ['cpp'], source: 'cpp', timestamp: new Date().toISOString() }),
      }).catch(() => {});
    } catch {}

    setIsSubscribed(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.85 },
    });
  };

  const currentSample = NEWSLETTER_SAMPLES[selectedDayIdx];

  return (
    <section className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
      {/* セクションタイトル */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Learning Support & Recommended Books</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono">
            学習補助サポート ＆ 推奨C++技術書
          </h3>
        </div>

        {/* タブ切り替え */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'newsletter'
                ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>毎朝の無料メルマガ</span>
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'books'
                ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>推奨書籍・テキスト</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>提携リンク・楽天市場</span>
          </button>
        </div>
      </div>

      {/* タブ 1: 毎朝3分メルマガ */}
      {activeTab === 'newsletter' && (
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 text-[11px] font-mono font-black border border-cyan-300 dark:border-cyan-700">
                  <Mail className="w-3 h-3 text-cyan-700 dark:text-cyan-400" />
                  <span>【公式】無料メールマガジン</span>
                </span>
                <span className="text-[11px] text-cyan-700 dark:text-cyan-300 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-700">
                  毎朝 7:00 配信・完全無料
                </span>
              </div>
              <h4 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug font-mono">
                毎朝7:00にメールで届く！{' '}
                <span className="text-cyan-600 dark:text-cyan-400">「モダンC++20設計ミニドリル」</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                通勤中や始業前のスキマ時間（約3分）で読める無料メールマガジンです。スマートポインタの使い分け、所有権ムーブ、デザインパターンの現代的実装を毎朝1問ずつあなたのメールボックスにお届けします。
              </p>
            </div>

            {/* 登録フォーム */}
            <div className="w-full lg:w-auto lg:min-w-[340px]">
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="配信先メールアドレスを入力"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 font-mono"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>無料メルマガを受け取る（明朝7:00〜）</span>
                  </button>
                </form>
              ) : (
                <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl text-xs sm:text-sm text-cyan-950 dark:text-cyan-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-900 dark:text-cyan-200">
                    <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>無料メールマガジンの登録を受け付けました！</span>
                  </div>
                  <p className="text-xs text-cyan-900/80 dark:text-cyan-300/80 leading-relaxed pl-6">
                    ご入力いただいたメールアドレス宛に第1回（Day 01 unique_ptr編）をお送りしました。明朝7:00より日刊ミニドリルをお届けします！
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 実際の配信メール プレビュー枠 */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>実際の配信メール サンプルプレビュー（タップで切替）:</span>
              </span>
              <div className="flex gap-1">
                {NEWSLETTER_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer font-mono ${
                      selectedDayIdx === idx
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sample.day}
                  </button>
                ))}
              </div>
            </div>

            {/* メール画面風カード */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
              <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                  <h5 className="font-black text-slate-900 dark:text-white text-sm sm:text-base font-mono">
                    {currentSample.previewSubject}
                  </h5>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    毎朝 7:00 配信
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  差出人: <span className="text-cyan-700 dark:text-cyan-400 font-semibold">{currentSample.sender}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                {currentSample.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>

              <div className="bg-cyan-50/90 dark:bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-200 dark:border-cyan-800 space-y-1.5 font-mono">
                <div className="text-xs font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{currentSample.quizQuestion}</span>
                </div>
                <div className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 pl-5">
                  {currentSample.quizAnswer}
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
                <span>※ このような実践コード・解説が毎朝7:00に届きます（スキマ時間3分で読了）</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">完全無料 • いつでも配信解除可能</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* タブ 2: 推奨書籍 */}
      {activeTab === 'books' && (
        <div className="space-y-3 animate-fadeIn">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            独学を加速させる定評あるC++設計本・名著です。（※Amazon・楽天アフィリエイトリンク）
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CPP_RECOMMENDED_PRODUCTS.map((prod) => (
              <AffiliateProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* タブ 3: 提携講座・楽天市場 */}
      {activeTab === 'services' && (
        <div className="space-y-3 animate-fadeIn">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            シロクマTechおすすめの公式提携リンクです。（※A8.net公式アフィリエイトリンク）
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AFFILIATE_ITEMS.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                      {service.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors mb-1.5">
                    {service.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <div className="text-[11px] bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    <span className="font-bold block text-[10px] text-slate-800 dark:text-slate-200 mb-0.5">💡 推奨ポイント:</span>
                    {service.recommendPoint}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {service.priceNote && (
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {service.priceNote}
                    </span>
                  )}
                  <a
                    href={service.linkUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer font-mono"
                  >
                    <span>公式サイトを見る</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                {service.trackingPixelUrl && (
                  <img
                    src={service.trackingPixelUrl}
                    width="1"
                    height="1"
                    alt=""
                    className="hidden"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
