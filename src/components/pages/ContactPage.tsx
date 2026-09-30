import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (slug: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '教材の誤植・誤字報告',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 擬似送信完了処理
    setSubmitted(true);
  };

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
        <span className="text-cyan-400 font-semibold">お問い合わせ (Contact)</span>
      </nav>

      {/* ページタイトルヘッダー */}
      <header className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
          <Mail className="w-3.5 h-3.5" />
          <span>INQUIRY & CONTACT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          お問い合わせ窓口
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          シロクマC++ラボに関するご質問、教材コードの誤植・改善要望、技術的なフィードバック、取材・提携のお問い合わせはこちらから受け付けております。
        </p>
      </header>

      {/* お問い合わせ方法の選択肢 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GitHub Issue */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-cyan-400 font-bold">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="text-base text-white">GitHub Issue / Discussions</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              コードの不具合、ビルドエラー、各章の設計に関する技術的な議論は、GitHub リポジトリ上でも広く受け付けています。公開での改善提案はこちらが最速です。
            </p>
          </div>
          <a
            href="https://github.com/genki113355-tm/cpp-study/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold border border-slate-700 transition"
          >
            <span>GitHub Issue を作成する</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>

        {/* 運営への直接連絡 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-cyan-400 font-bold">
              <Mail className="w-5 h-5" />
              <span className="text-base text-white">Webフォームからの直接連絡</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              非公開でのご意見、業務提携、教育機関での活用相談などは、下記のWebフォームよりお気軽にご送信ください。通常2〜3営業日以内に確認いたします。
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            運営: シロクマC++ラボ 技術編集部
          </div>
        </div>
      </div>

      {/* Webお問い合わせフォーム */}
      <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <span>お問い合わせフォーム</span>
        </h2>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-300">送信が完了しました</h3>
              <p className="text-xs text-slate-300">
                お問い合わせいただきありがとうございます。内容を確認の上、必要に応じて返信いたします。
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', category: '教材の誤植・誤字報告', subject: '', message: '' });
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition"
            >
              別のお問い合わせを送信する
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  お名前（またはハンドルネーム） <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: シロクマ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  メールアドレス <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="例: your-email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">お問い合わせ種別</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="教材の誤植・誤字報告">教材の誤植・誤字報告</option>
                <option value="コードの動作不具合・ビルドエラー">コードの動作不具合・ビルドエラー</option>
                <option value="解説内容への質問・リクエスト">解説内容への質問・リクエスト</option>
                <option value="著作権・リンク・引用について">著作権・リンク・引用について</option>
                <option value="業務提携・執筆依頼・その他">業務提携・執筆依頼・その他</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">件名</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="例: 第3章のメモリ解放コードに関する質問"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">
                お問い合わせ内容 <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="具体的な章名やコード箇所、ご質問内容を記載してください。"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition resize-y"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold font-mono text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>送信する</span>
              </button>
            </div>
          </form>
        )}
      </section>

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
            onClick={() => onNavigate('privacy')}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            プライバシーポリシー ➔
          </button>
        </div>
      </div>
    </div>
  );
};
