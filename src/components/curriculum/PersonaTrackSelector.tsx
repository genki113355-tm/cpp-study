import React, { useState } from 'react';
import { 
  GraduationCap, 
  Wrench, 
  ArrowRight, 
  Sparkles, 
  Check 
} from 'lucide-react';

interface PersonaTrackSelectorProps {
  onSelectChapter: (slug: string) => void;
}

export const PersonaTrackSelector: React.FC<PersonaTrackSelectorProps> = ({ onSelectChapter }) => {
  const [activeTab, setActiveTab] = useState<'beginner' | 'experienced'>('beginner');
  
  // 経験者向け：コードスメル診断チェックリストの状態
  const [checkedSmells, setCheckedSmells] = useState<Record<string, boolean>>({
    godClass: true,
    hugeSwitch: true,
    rawPointer: false,
    deepInheritance: false,
    fragileBase: true,
  });

  const toggleSmell = (key: string) => {
    setCheckedSmells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const smellCount = Object.values(checkedSmells).filter(Boolean).length;

  return (
    <section className="space-y-6">
      {/* セクション見出し */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEARNING PATH BY PERSONA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            あなたの現在地はどこですか？ 2大ペルソナ別・学習ナビゲーション
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          「記事をただ眺める」から「自分の課題を解決する」学習体験へ
        </span>
      </div>

      {/* タブ切り替えボタン */}
      <div className="flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xl mx-auto shadow-lg">
        <button
          onClick={() => setActiveTab('beginner')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold font-mono text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'beginner'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50 scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-300" />
          <span>🐣 C++初心者・他言語経験者</span>
        </button>
        <button
          onClick={() => setActiveTab('experienced')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold font-mono text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'experienced'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950/50 scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-300" />
          <span>🛠️ C++経験者・現場エンジニア</span>
        </button>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'beginner' ? (
        /* 初心者向けパネル */
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a1816] to-slate-950 border border-emerald-500/40 shadow-2xl space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                <span>🔰 初心者ロードマップ：ゼロからゲームを育てる旅</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white font-sans tracking-tight">
                「文法は覚えた。でも、どうクラスを作ればいいか分からない」を完全解決。
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                変数やif文の教科書的な暗記はもう終わりです。
                「とりあえず1つのファイルに全部書いて動かす」泥臭い状態からスタートし、
                <strong>「なぜクラスに分割するのか？」「なぜ継承やスマートポインタが必要になるのか？」</strong>
                という理由（必然性）を体感しながら、1本のゲームを完成形へと育てていきます。
              </p>

              {/* シロクマ＆先輩のミニ掛け合い */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🐻‍❄️</span>
                  <div className="text-xs sm:text-sm text-slate-300 font-sans">
                    <strong className="text-emerald-300 font-mono">シロクマ君: </strong>
                    「C++って機能が多すぎてどこから手をつければいいか迷子になってました…」
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🐧</span>
                  <div className="text-xs sm:text-sm text-slate-300 font-sans">
                    <strong className="text-cyan-300 font-mono">先輩ペンギン: </strong>
                    「最初は全部GameManagerに書くところからでいいんだ。そこから『動くけどヤバいコード』を1つずつ直していけば、自然とオブジェクト指向の神髄が身につくぞ！」
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：学習ステップツリー */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>成長の6大ステップ</span>
                <span className="text-[10px] text-slate-400">Step by Step</span>
              </div>
              
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span className="text-slate-200">動くゲーム作成 & 手続き型の限界 (Ch.1)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span className="text-slate-200">クラス化と責務のカプセル化 (Ch.2)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span className="text-slate-200">動的配列とオブジェクトの寿命 (Ch.3)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">4</span>
                  <span className="text-slate-200">敵の多様化とポリモーフィズム (Ch.4)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">5</span>
                  <span className="text-slate-200">ゲーム画面遷移とデザインパターン (Ch.5)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">6</span>
                  <span className="text-slate-200">モダンC++のRAIIとスマートポインタ (Ch.6)</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onSelectChapter('chapter-1-spaghetti-to-oop')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold font-mono text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-98"
                >
                  <span>🚀 ゼロから設計を育てる旅を始める (Stage 1へ)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 経験者向けパネル：コードスメル診断 */
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#181008] to-slate-950 border border-amber-500/40 shadow-2xl space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                <span>⚠️ 経験者・現場リファクタリング診断</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white font-sans tracking-tight">
                「動いてはいるが、怖くて誰も触れない」コードを卒業する。
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                現場で何千行にも肥大化したレガシーC++や、手動の <code className="text-amber-300 font-mono">new/delete</code> で破綻しかけているコードベースに直面していませんか？
                右の診断チェックリストに当てはまるものがあれば、このカリキュラムがまさに特効薬です。
              </p>

              {/* 診断結果メッセージ */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-amber-400 font-bold">現在の危険度スコア:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                    {smellCount} / 5 項目該当
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  {smellCount >= 3 ? (
                    <span className="text-rose-400 font-semibold">
                      🚨 重度のレガシー・アンチパターン警戒警報！「神クラス解体」「多態性へのリファクタリング」「RAII」を今すぐ適用して技術的負債を解消しましょう。
                    </span>
                  ) : smellCount > 0 ? (
                    <span className="text-amber-300 font-semibold">
                      ⚠️ 潜伏バグの温床あり！仕様変更のたびにデグレが発生しやすい状態です。開閉原則（OCP）とスマートポインタを導入する絶好のタイミングです。
                    </span>
                  ) : (
                    <span className="text-emerald-300 font-semibold">
                      ✨ 素晴らしい！さらにワンランク上の「ゼロコスト抽象化」「モダンECS（Entity-Component-System）」へステップアップしましょう！
                    </span>
                  )}
                </p>
              </div>

              {/* 診断結果のX(Twitter)共有ボタン */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onSelectChapter('chapter-1-spaghetti-to-oop')}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold font-mono text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-98"
                >
                  <span>🏛️ レガシー脱却の旅へ (Stage 1へ)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {(() => {
                  const rankName = smellCount >= 3 ? '🚨 重度レガシー警戒級' : smellCount > 0 ? '⚠️ 潜伏負債あり級' : '✨ クリーンアーキテクト級';
                  const tweetText = `シロクマC++ラボの【現場C++コードスメル診断】を受けました！\n危険度スコア: ${smellCount} / 5 項目該当\n判定: 【${rankName}】\nあなたの現場のコードは大丈夫？`;
                  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://shirokuma-cpp.jp/')}&hashtags=${encodeURIComponent('シロクマcpp,cpp,オブジェクト指向,ゲーム開発')}`;
                  return (
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black hover:bg-slate-900 text-white font-semibold text-xs border border-slate-700 transition shadow-md active:scale-98"
                      title="診断結果をXでポスト"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>結果をXでポスト</span>
                    </a>
                  );
                })()}
              </div>
            </div>

            {/* 右側：現場あるあるアンチパターン診断インタラクティブチェックリスト */}
            <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>こんなコードを書いていませんか？（クリックで診断）</span>
                <span className="text-[10px] text-slate-500">コードスメル診断</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'godClass',
                    title: '1つの GameManager が3,000行を超えている',
                    desc: '描画・当たり判定・音・スコアを全部抱え込み、修正するたびに誰かとコンフリクトする。',
                  },
                  {
                    key: 'hugeSwitch',
                    title: '敵や武器を足すたびに、あちこちの switch(type) を修正する',
                    desc: '1箇所でも case の書き忘れがあると未定義の挙動やクラッシュを引き起こす。',
                  },
                  {
                    key: 'rawPointer',
                    title: '「この生ポインタ、誰が delete するんだっけ？」と悩む',
                    desc: 'オブジェクトの所有権が曖昧で、二重解放（Double Free）やメモリリークが常態化。',
                  },
                  {
                    key: 'deepInheritance',
                    title: '継承が深すぎて、親の変更で無関係な子クラスが壊れる',
                    desc: '「is-a関係」の乱用により、菱形継承や不要な肥大化メソッドの押し付けが発生。',
                  },
                  {
                    key: 'fragileBase',
                    title: '仕様変更のたびに既存コードの書き換えが必要になる',
                    desc: '「変更には閉じて拡張には開く」開閉原則（OCP）が破綻し、リグレッションテストが重労働。',
                  },
                ].map((item) => {
                  const isChecked = checkedSmells[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleSmell(item.key)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-amber-950/40 border-amber-500/50 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-amber-500 text-slate-950' : 'border border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className={`text-xs font-bold font-sans ${isChecked ? 'text-amber-200' : 'text-slate-300'}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans leading-tight">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
