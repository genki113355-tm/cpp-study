import React, { useState } from 'react';
import { X, Award, CheckCircle2, Share2, Sparkles, Shield, ChevronRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, SPECIAL_GUIDES, ALL_CHAPTERS } from '../../data/chapters';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedChapters: number[];
}

interface Milestone {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  trackName: string;
  total: number;
  completedCount: number;
  isUnlocked: boolean;
  skills: string[];
  description: string;
  badgeColor: string;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  onClose,
  completedChapters,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('シロクマ研究生');

  if (!isOpen) return null;

  const classicCount = CLASSIC_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length;
  const modernCount = MODERN_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length;
  const readingCount = READING_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length;
  const guidesCount = SPECIAL_GUIDES.filter((c) => completedChapters.includes(c.id)).length;
  const totalCount = completedChapters.length;

  const milestones: Milestone[] = [
    {
      id: 'classic',
      title: '🏛️ クラシックC++＆オブジェクト指向設計 マスター',
      shortTitle: 'クラシック基礎修了証',
      icon: '🏛️',
      trackName: 'クラシック基礎編 (L1〜L16)',
      total: CLASSIC_CHAPTERS.length,
      completedCount: classicCount,
      isUnlocked: classicCount >= CLASSIC_CHAPTERS.length,
      skills: [
        'C言語手続き型からC++オブジェクト指向への移行',
        'カプセル化（class/struct）とメンバ隠蔽',
        '継承と派生クラスの設計',
        '仮想関数・動的多態性（vtableとオーバーライド）',
        '動的メモリ確保（new/deleteの責任境界と落とし穴）',
      ],
      description: 'レガシーなC言語的ベタ書きコードから、クラス分割・仮想関数・メモリ管理の基礎を完全に習得した証明です。',
      badgeColor: 'from-amber-600 to-amber-800 border-amber-500/50 text-amber-300',
    },
    {
      id: 'modern',
      title: '🚀 モダンC++アーキテクト（C++11〜C++20規格）',
      shortTitle: 'モダン実践修了証',
      icon: '🚀',
      trackName: 'モダン実践編 (M1〜M14)',
      total: MODERN_CHAPTERS.length,
      completedCount: modernCount,
      isUnlocked: modernCount >= MODERN_CHAPTERS.length,
      skills: [
        'RAIIによるゼロリーク・リソース完全自動管理',
        'スマートポインタ（std::unique_ptr / std::shared_ptr）',
        '移動セマンティクスと完全転送（std::move / 右辺値参照）',
        'モダンSTLコンテナ・アルゴリズム・ラムダ式',
        'GoFデザインパターン（State, Strategy, Observer, ECS）の実戦適用',
      ],
      description: '生ポインタを徹底排除し、RAII・スマートポインタ・現代規格の設計美学をマスターした証明です。',
      badgeColor: 'from-cyan-600 to-blue-800 border-cyan-500/50 text-cyan-300',
    },
    {
      id: 'reading',
      title: '🧭 現場鑑識・プロフェッショナルコードインスペクター',
      shortTitle: 'コード読解修了証',
      icon: '🧭',
      trackName: 'コード読解演習 (R1〜R6)',
      total: READING_CHAPTERS.length,
      completedCount: readingCount,
      isUnlocked: readingCount >= READING_CHAPTERS.length,
      skills: [
        '既存巨大コードのデータフロー鑑識法',
        '巨大ヘッダ結合の切断とコンパイル高速化',
        '動的多態性と静的多態性（CRTP）の判別',
        'マルチスレッド競合（Data Race）の特定と排他制御',
        'Box2D物理エンジン解読 & Use-After-Free・ASan鑑識',
      ],
      description: '他人が書いた謎コードやOSSコードを読み解き、競合やメモリ破壊を捜査・解決できる現場即戦力の証明です。',
      badgeColor: 'from-purple-600 to-purple-900 border-purple-500/50 text-purple-300',
    },
    {
      id: 'guides',
      title: '📚 現場特集・設計ツール＆品質保証 マスター',
      shortTitle: '現場特集修了証',
      icon: '📚',
      trackName: '現場特集・特別コラム (G1〜G5, コラム)',
      total: SPECIAL_GUIDES.length,
      completedCount: guidesCount,
      isUnlocked: guidesCount >= SPECIAL_GUIDES.length,
      skills: [
        'ローカルC++ビルド環境構築とコンパイラ最適化',
        'C++基本文法・規格別機能（C++03〜20）のリファレンス運用',
        'UMLクラス図・シーケンス図の実装落とし込み',
        'GoogleTestによるTDD（テスト駆動開発）自動化',
        'GoFデザインパターンとC++言語思想の深い理解',
      ],
      description: '開発環境構築、UML設計、自動テストTDD、デザインパターン、言語哲学まで実務の武器庫を制覇した証明です。',
      badgeColor: 'from-emerald-600 to-teal-800 border-emerald-500/50 text-emerald-300',
    },
    {
      id: 'master',
      title: '👑 シロクマC++グランドマスター（全課程制覇）',
      shortTitle: '全カリキュラム総合修了証',
      icon: '👑',
      trackName: '全44章完全制覇',
      total: ALL_CHAPTERS.length,
      completedCount: totalCount,
      isUnlocked: totalCount >= ALL_CHAPTERS.length,
      skills: [
        'クラシックOOPからモダンC++20までの全パラダイムの体得',
        '組込み・ゲームエンジン水準の極限メモリ＆安全性設計',
        'GoogleTestによるTDD（テスト駆動開発）と品質保証',
        'ゼロオーバーヘッド原則に基づく設計選択能力',
      ],
      description: 'シロクマC++ラボの全カリキュラム（全44章）を走破し、現場のあらゆるC++開発に対応可能な卓越した技術を体得した最高栄誉です。',
      badgeColor: 'from-amber-500 via-rose-600 to-purple-700 border-amber-400/60 text-amber-200',
    },
  ];

  const activeMilestone = milestones.find((m) => m.id === selectedMilestoneId);

  const handleOpenCertificate = (m: Milestone) => {
    setSelectedMilestoneId(m.id);
    if (m.isUnlocked) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleShareOnX = (m: Milestone) => {
    const text = encodeURIComponent(
      `🏆 【シロクマC++ラボ】「${m.title}」の公式修了証を獲得しました！\nゲーム開発を通してレガシー設計からモダンC++（RAII・スマートポインタ・現場鑑識）まで走破！\n\n#cpp #シロクマCPPラボ #プログラミング学習`
    );
    const url = encodeURIComponent('https://shirokuma-cpp.jp');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#070b16] border-2 border-cyan-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/30 text-xl">
              🏆
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white font-sans leading-tight flex items-center gap-2">
                <span>学習マイルストーン ＆ 公式修了証</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                章を完了して技術バッジを集め、公式修了証（Certificate）を発行しよう
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

        {/* コンテンツエリア */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* 総合進捗バー */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>全カリキュラム総合進捗：</span>
                <span className="text-cyan-300">{totalCount} / {ALL_CHAPTERS.length} 章完了</span>
              </span>
              <span className="text-cyan-400 font-bold font-mono">
                {Math.round((totalCount / ALL_CHAPTERS.length) * 100)}% 達成
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${(totalCount / ALL_CHAPTERS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 証書プレビュー画面（選択中） */}
          {activeMilestone ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedMilestoneId(null)}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>← バッジ一覧に戻る</span>
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {activeMilestone.isUnlocked ? '✨ 修了証授与条件を達成しました' : '🔒 まだ未達成です'}
                </span>
              </div>

              {/* 格式ある公式修了証デザイン */}
              <div className="relative rounded-3xl p-6 sm:p-10 border-4 border-amber-500/60 bg-gradient-to-b from-[#0e1628] via-[#090e1b] to-[#060913] text-center shadow-2xl overflow-hidden space-y-6">
                {/* 飾り枠 & 背景グロー */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2">
                  <div className="text-xs sm:text-sm font-mono tracking-widest text-amber-400 uppercase font-bold">
                    CERTIFICATE OF COMPLETION
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-sans tracking-tight">
                    修 了 証
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                </div>

                {/* 氏名エリア */}
                <div className="py-2 space-y-1">
                  <p className="text-xs text-slate-400 font-sans">受講者氏名 / ハンドルネーム：</p>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-xl sm:text-2xl font-bold text-cyan-300 text-center bg-slate-900/60 border-b-2 border-cyan-500/60 px-4 py-1 rounded focus:outline-none focus:border-cyan-400 transition"
                    title="氏名を自由に変更できます"
                  />
                  <span className="text-slate-300 text-sm block">殿</span>
                </div>

                {/* 授与文 */}
                <div className="max-w-xl mx-auto space-y-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  <p>
                    あなたは、シロクマC++ラボが提供する本格的C++設計カリキュラムにおいて、以下の課程を修了し、極めて優秀な技術基準に達したことをここに証します。
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40 space-y-2">
                    <div className="text-base sm:text-lg font-bold text-amber-300 font-sans">
                      {activeMilestone.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      対象カリキュラム：{activeMilestone.trackName}（全{activeMilestone.total}章）
                    </div>
                  </div>
                </div>

                {/* 習得スキルリスト */}
                <div className="max-w-lg mx-auto text-left space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-400 text-center">
                    【習得が証明された中核技術】
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300 font-mono">
                    {activeMilestone.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-1.5 rounded bg-slate-900/70 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 公式認証印 ＆ 日付 */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                  <div>
                    発行日：2026年9月19日<br />
                    検証：主要3大コンパイラ (GCC / Clang / MSVC)
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl bg-amber-950/40 font-bold">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>シロクマC++ラボ 技術監修部 公認</span>
                  </div>
                </div>
              </div>

              {/* シェア＆操作ボタン */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {activeMilestone.isUnlocked ? (
                  <button
                    onClick={() => handleShareOnX(activeMilestone)}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>X（旧Twitter）で修了を報告する</span>
                  </button>
                ) : (
                  <div className="text-xs font-mono text-rose-300 bg-rose-950/50 px-4 py-2 rounded-xl border border-rose-500/30">
                    🔒 あと {activeMilestone.total - activeMilestone.completedCount} 章完了するとこの修了証が授与されます！
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 4大マイルストーンカード一覧 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((m) => {
                const percent = Math.min(100, Math.round((m.completedCount / m.total) * 100));

                return (
                  <div
                    key={m.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      m.isUnlocked
                        ? 'bg-gradient-to-br from-slate-900/90 to-slate-950 border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{m.icon}</span>
                        {m.isUnlocked ? (
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>修了証 獲得済</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>{m.completedCount} / {m.total} 章</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white font-sans leading-snug">
                          {m.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      {/* 進捗バー */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>進捗状況</span>
                          <span className={m.isUnlocked ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                            {percent}% ({m.completedCount}/{m.total})
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              m.isUnlocked ? 'bg-cyan-400' : 'bg-slate-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenCertificate(m)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        m.isUnlocked
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>{m.isUnlocked ? '修了証を表示・発行する' : '修了証の要件を見る'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* モーダルフッター */}
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
