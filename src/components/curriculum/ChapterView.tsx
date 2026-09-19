import React, { useState, useMemo } from 'react';
import { Chapter, CodeHighlightTarget, CodeFile } from '../../types/curriculum';
import { CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS } from '../../data/chapters';
import { DialogueBubble } from './DialogueBubble';
import { CodeViewer } from './CodeViewer';
import { ConceptDiagram } from './ConceptDiagram';
import { GameEmulator } from '../emulator/GameEmulator';
import { ParadigmComparisonView } from './ParadigmComparisonView';
import { MemoryVisualizer } from './MemoryVisualizer';
import { VariableInspector } from './VariableInspector';
import { RichExplanation } from './RichExplanation';
import { UmlDiagramViewer } from './UmlDiagramViewer';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Lightbulb, HelpCircle, GitCommit, Gamepad2, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AffiliatePromoBanner } from '../affiliate/AffiliatePromoBanner';
import { ShareButtons } from '../common/ShareButtons';
import { CodeChallengeRunner } from '../playground/CodeChallengeRunner';
import { CODING_CHALLENGES } from '../../data/codingChallenges';
import { getChapterEvolution } from '../../data/chapterEvolution';

interface ChapterViewProps {
  chapter: Chapter;
  onNavigate: (slug: string) => void;
  onComplete: (id: number) => void;
  isCompleted: boolean;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  onNavigate,
  onComplete,
  isCompleted,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [codeHighlight, setCodeHighlight] = useState<CodeHighlightTarget | undefined>();
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [showInlineGame, setShowInlineGame] = useState<boolean>(false);

  // この章に含まれるすべての教材コードファイルを抽出
  const allCodeFiles = useMemo(() => {
    const files: CodeFile[] = [];
    const seen = new Set<string>();

    chapter.sections.forEach((s) => {
      if (s.codeFiles) {
        s.codeFiles.forEach((f) => {
          if (!seen.has(f.filename)) {
            seen.add(f.filename);
            files.push(f);
          }
        });
      }
    });

    return files;
  }, [chapter]);

  const handleSelectOption = (questionId: string, optionIndex: number, correctIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));

    if (optionIndex === correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      onComplete(chapter.id);
    }
  };

  const isClassic = chapter.courseTrack === 'classic';
  const isReading = chapter.courseTrack === 'reading';
  const isGuide = chapter.courseTrack === 'guide' || chapter.category === 'guide' || chapter.category === 'column';
  const code = chapter.courseChapterCode || `Ch.${chapter.id}`;

  const getTrackBadge = () => {
    if (chapter.category === 'column') {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-purple-950/80 text-purple-300 border-purple-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-purple-400" />
          🧠 C++深掘り思想コラム
        </span>
      );
    }
    if (isGuide) {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-emerald-950/80 text-emerald-300 border-emerald-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-emerald-400" />
          🧭 実践手引き・現場ガイド
        </span>
      );
    }
    if (isReading) {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-purple-950/80 text-purple-300 border-purple-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-purple-400" />
          🧭 コード読解演習トラック 【R】Step {code.replace(/^[CMR]/, '')}
        </span>
      );
    }
    if (isClassic) {
      return (
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-amber-950/80 text-amber-300 border-amber-500/40">
          <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-amber-400" />
          🏛️ レガシーC++コース 【L】第{code.replace(/^[CML]/, '')}章
        </span>
      );
    }
    return (
      <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-2 shadow-sm bg-cyan-950/80 text-cyan-300 border-cyan-500/40">
        <span className="w-2.5 h-2.5 rounded-full animate-ping inline-block bg-cyan-400" />
        🚀 モダンコース 【M】第{code.replace(/^[CML]/, '')}章
      </span>
    );
  };

  const getBorderColor = () => {
    if (chapter.category === 'column' || isReading) return 'border-purple-500/30';
    if (isGuide) return 'border-emerald-500/30';
    if (isClassic) return 'border-amber-500/30';
    return 'border-cyan-500/30';
  };

  const getGlowColor = () => {
    if (chapter.category === 'column' || isReading) return 'bg-purple-500/10';
    if (isGuide) return 'bg-emerald-500/10';
    if (isClassic) return 'bg-amber-500/10';
    return 'bg-cyan-500/10';
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto py-6 sm:py-8 space-y-12">
      {/* 章ヘッダーバナー（司令室イラスト付き） */}
      <div className={`relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c121e] to-slate-950 p-4 sm:p-8 md:p-10 border shadow-2xl overflow-hidden ${getBorderColor()}`}>
        {/* 背景の淡いグロー */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${getGlowColor()}`} />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            {/* メインタイトル */}
            <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-tight break-words sm:break-keep">
              {chapter.title}
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-cyan-300 font-medium leading-snug break-words sm:break-keep">
              {chapter.subtitle}
            </p>

            {/* パンくずリスト & シェアボタン（タイトルの下に配置） */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <nav aria-label="パンくずリスト" className="flex items-center gap-2 text-xs sm:text-sm font-mono flex-wrap">
                <button
                  onClick={() => onNavigate('top')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition shadow-sm"
                  title="トップページへ戻る"
                >
                  <span>🏠</span>
                  <span>TOP</span>
                </button>
                <span className="text-slate-600">/</span>
                {getTrackBadge()}
                <span className="text-xs sm:text-sm font-mono text-slate-300 font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  {chapter.badge}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>完了済み</span>
                  </span>
                )}
              </nav>

              <ShareButtons
                title={`${chapter.title} - ${chapter.subtitle} | シロクマC++ラボ`}
                text={`C++オブジェクト指向設計カリキュラム：${chapter.description.slice(0, 60)}...`}
                variant="compact"
              />
            </div>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 pt-2 leading-relaxed font-sans">
              {chapter.description}
            </p>
          </div>

          {/* 司令室のシロクマ先生＆ペンギン生徒イラストバナー */}
          <div className="w-full lg:w-96 h-56 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/60 flex-shrink-0 relative group">
            <img
              src="/images/characters_mission.jpg"
              alt="シロクマ先生とペンギン生徒の作戦司令室"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-xs sm:text-sm font-mono text-emerald-300 flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                POLAR FLEET HQ : MISSION BRIEFING
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 実機ゲームステーション（大画面ポップアップ起動 ＆ インライン切替） */}
      {chapter.gameVersion && chapter.gameVersion !== 'none' && (() => {
        const evolution = getChapterEvolution(code, chapter.gameVersion);
        const isFirstChapter = Boolean(
          evolution.isFirstChapter ||
          code === 'L1' ||
          code === 'C1' ||
          chapter.gameVersion === 'v1_spaghetti' ||
          evolution.previousChapter.includes('なし')
        );

        return (
          <section className="space-y-3">
            <div className="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-[#070e1b] to-slate-950 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* 背景の淡いグリッド ＆ ネオングロー */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{code} 収録実機ゲーム</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      C++プログラム実行環境
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                    <span className="text-cyan-400">👾</span>
                    <span>SPACE INVADERS : {code} {chapter.title}</span>
                  </h3>

                  {/* L1以外の章のみ「前章からの進化点」を表示 */}
                  {!isFirstChapter ? (
                    <div className="flex items-start gap-2 text-xs sm:text-sm font-mono bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/30 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/40 flex-shrink-0 text-xs">
                        🔄 前章からの進化
                      </span>
                      <span className="leading-snug text-amber-100 font-medium pt-0.5">
                        {evolution.headline}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-300 font-mono bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/30">
                      🚀 <span className="text-cyan-300 font-bold">原点のインベーダー：</span>1ファイル・グローバル変数・単発射撃から始まるC++オブジェクト指向への旅！
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span>🎨 2Dグラフィック</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span>📟 CUI文字切替</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">キーボード/タッチ対応</span>
                  </div>
                </div>

                {/* 起動アクションボタン */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0 justify-center">
                  <button
                    onClick={() => setIsGameModalOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono font-black text-sm sm:text-base transition shadow-xl shadow-cyan-500/30 active:scale-95 flex items-center justify-center gap-2.5 group cursor-pointer"
                  >
                    <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>ゲームを起動する ▶</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950/20 text-slate-950 font-bold">大画面</span>
                  </button>

                  <button
                    onClick={() => setShowInlineGame((prev) => !prev)}
                    className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{showInlineGame ? '▲ ページ内表示を閉じる' : '▼ ページ内にインライン表示'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ページ内インライン展開（ユーザーが希望した場合のみ） */}
            {showInlineGame && (
              <div className="pt-2 animate-fadeIn">
                <GameEmulator
                  key={`${chapter.slug}-inline`}
                  version={chapter.gameVersion}
                  chapterCode={code}
                  chapterTitle={chapter.title}
                  isModal={false}
                />
              </div>
            )}

            {/* 🎮 大画面ポップアップモーダル */}
            {isGameModalOpen && (
              <GameEmulator
                key={`${chapter.slug}-modal`}
                version={chapter.gameVersion}
                chapterCode={code}
                chapterTitle={chapter.title}
                isModal={true}
                onClose={() => setIsGameModalOpen(false)}
              />
            )}
          </section>
        );
      })()}

      {/* 📐 この章のプログラムに対応する公式UML設計書 */}
      {chapter.umlDiagram && (
        <section>
          <UmlDiagramViewer
            data={chapter.umlDiagram}
            codeFiles={allCodeFiles}
            onJumpToEditor={(target) => setCodeHighlight(target)}
          />
        </section>
      )}

      {/* 各セクションの展開 */}
      {chapter.sections.map((section, sIdx) => {
        // "1.1 タイトル" 形式の分解
        const titleMatch = section.title.match(/^(\d+\.\d+)\s*(.*)/);
        const sectionNum = titleMatch ? titleMatch[1] : null;
        const sectionTitle = titleMatch ? titleMatch[2] : section.title;

        // セクション中間判定（セクションが2つ以上ある場合は中間に時短PRを挿入）
        const isMiddleSection = sIdx === Math.floor((chapter.sections.length - 1) / 2);

        return (
          <React.Fragment key={section.id}>
            <section className="space-y-6 pt-12 pb-8 border-t border-slate-800/80">
            <div>
              <div className="flex items-center gap-3.5 flex-wrap">
                {sectionNum && (
                  <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-bold text-sm sm:text-base shadow-sm">
                    {sectionNum}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {sectionTitle}
                </h2>
              </div>
              {section.leadText && (
                <p className="text-lg sm:text-xl text-slate-300 mt-4 leading-relaxed font-sans">
                  {section.leadText}
                </p>
              )}
            </div>

          {/* セクション前の会話 */}
          {section.dialogueBefore && section.dialogueBefore.length > 0 && (
            <div className="space-y-3.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
              {section.dialogueBefore.map((dialogue) => (
                <DialogueBubble key={dialogue.id} dialogue={dialogue} />
              ))}
            </div>
          )}

          {/* 概念解説テキスト（リッチマークダウンレンダラー） */}
          {section.explanationText && (
            <RichExplanation content={section.explanationText} />
          )}

          {/* C言語 vs C++ パラダイム対比 */}
          {section.paradigmComparison && (
            <ParadigmComparisonView data={section.paradigmComparison} />
          )}

          {/* スタック・ヒープ メモリ可視化 */}
          {section.memoryMap && (
            <MemoryVisualizer memoryMap={section.memoryMap} />
          )}

          {/* 変数・クラスメンバ一覧インスペクター（カード / 最適化テーブル） */}
          {section.variables && section.variables.length > 0 && (
            <VariableInspector variables={section.variables} />
          )}

          {/* 処理フロー（ステップバイステップ実況解説＆設計意図） */}
          {section.processSteps && section.processSteps.length > 0 && (
            <div className="space-y-4 my-6">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-400 px-1">
                <GitCommit className="w-5 h-5" />
                <span>1フレーム内の実行順序と設計の意図</span>
              </div>
              <div className="grid grid-cols-1 gap-3.5">
                {section.processSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm">
                          {step.stepNumber}
                        </span>
                        <h4 className="font-bold text-base sm:text-lg text-slate-100 font-sans">
                          {step.title}
                        </h4>
                      </div>
                      {step.codeSnippet && (
                        <code className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                          {step.codeSnippet}
                        </code>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-10 font-sans">
                      {step.description}
                    </p>
                    
                    <div className="mt-3 pl-10 flex flex-col sm:flex-row gap-2.5 text-xs sm:text-sm font-mono">
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 py-2 px-3 rounded-xl border border-emerald-500/20 flex-1">
                        <span className="text-slate-400 font-sans font-bold">動作効果:</span>
                        <span>{step.impact}</span>
                      </div>
                      {step.designIntent && (
                        <div className="flex items-center gap-2 text-cyan-300 bg-cyan-950/30 py-2 px-3 rounded-xl border border-cyan-500/20 flex-1">
                          <span className="text-slate-400 font-sans font-bold">設計意図:</span>
                          <span>{step.designIntent}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 概念図解 */}
          {section.diagramType && (
            <ConceptDiagram type={section.diagramType} />
          )}

          {/* セクション固有のUML設計書 */}
          {section.umlDiagram && (
            <UmlDiagramViewer
              data={section.umlDiagram}
              codeFiles={section.codeFiles && section.codeFiles.length > 0 ? section.codeFiles : allCodeFiles}
              onJumpToEditor={(target) => setCodeHighlight(target)}
            />
          )}

          {/* C++コードビューア */}
          {section.codeFiles && section.codeFiles.length > 0 && (
            <div className="my-6">
              <div className="text-sm font-mono text-slate-400 mb-2.5 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">SOURCE CODE</span>
                <span>（タブをクリックしてファイルを切り替え・コピーできます。クラス図メンバと双方向連動）</span>
              </div>
              <CodeViewer files={section.codeFiles} targetHighlight={codeHighlight} />
            </div>
          )}

          {/* セクション後の会話 */}
          {section.dialogueAfter && section.dialogueAfter.length > 0 && (
            <div className="space-y-3.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
              {section.dialogueAfter.map((dialogue) => (
                <DialogueBubble key={dialogue.id} dialogue={dialogue} />
              ))}
            </div>
          )}

          {/* キーポイント・まとめ */}
          {section.takeaways && section.takeaways.length > 0 && (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 my-6">
              <h3 className="text-base sm:text-lg font-mono font-bold text-cyan-400 flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5" />
                <span>シロクマ先生の重要ポイントまとめ</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.takeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2"
                  >
                    <div className="text-sm sm:text-base font-bold text-slate-100">
                      {takeaway.title}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {takeaway.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        {isMiddleSection && (
          <AffiliatePromoBanner type="busy" />
        )}
      </React.Fragment>
    );
  })}

      {/* 実践ハンズオン演習道場（コーディング課題が定義されている章で自動表示） */}
      {CODING_CHALLENGES[chapter.slug] && (
        <section>
          <CodeChallengeRunner challenge={CODING_CHALLENGES[chapter.slug]} />
        </section>
      )}

      {/* 理解度確認クイズ */}
      {chapter.quiz && chapter.quiz.length > 0 && (
        <section className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-10 space-y-8 shadow-2xl my-8">
          <div className="flex items-center gap-3 text-cyan-400 font-mono font-bold text-xl sm:text-2xl border-b border-slate-800 pb-4">
            <HelpCircle className="w-7 h-7" />
            <span>理解度チェッククイズ</span>
          </div>

          {chapter.quiz.map((q) => {
            const selected = selectedAnswers[q.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={q.id} className="space-y-4">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {q.question}
                </p>

                <div className="space-y-3">
                  {q.options.map((option, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    let btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40';
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => !isAnswered && handleSelectOption(q.id, optIdx, q.correctIndex)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-base sm:text-lg transition-all duration-150 flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        )}
                        {isAnswered && isOptionSelected && optIdx !== q.correctIndex && (
                          <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 解説ボックス */}
                {showExplanations[q.id] && (
                  <div
                    className={`p-5 rounded-2xl border text-sm sm:text-base leading-relaxed font-sans ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {isCorrect && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 flex-shrink-0 shadow-lg">
                          <img
                            src="/images/characters_victory.png"
                            alt="ハイタッチ！"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="font-bold mb-1 flex items-center gap-2 text-base sm:text-lg">
                          {isCorrect ? '🎉 正解！シロクマ先生とハイタッチ！' : '❌ おしい！'}
                        </div>
                        <div className="text-slate-200 leading-relaxed">{q.explanation}</div>
                        {isCorrect && (
                          <div className="pt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-emerald-300 font-mono font-bold">正解成果をシェア:</span>
                            <ShareButtons
                              title={`【正解クリア！】シロクマC++ラボ「${chapter.title}」のクイズを突破しました！`}
                              text={`シロクマ先生＆先輩ペンギンと一緒にオブジェクト指向ゲーム開発を修行中！`}
                              variant="compact"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* 記事シェアカード */}
      <ShareButtons
        title={`${chapter.title} - ${chapter.subtitle} | シロクマC++ラボ`}
        text={`インベーダーゲーム開発を通じて学ぶC++オブジェクト指向設計カリキュラム！\n${chapter.description.slice(0, 80)}...`}
        variant="card"
      />

      {/* 学習完了・達成のご褒美PRバナー（最下部） */}
      <AffiliatePromoBanner type="reward" limit={3} />

      {/* 章ナビゲーションフッター */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        {chapter.prevChapterSlug ? (
          <button
            onClick={() => onNavigate(chapter.prevChapterSlug!)}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-bold transition border border-slate-700 active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>前の章へ</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('top')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-bold transition border border-slate-700 active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TOP（全体ロードマップ）へ</span>
          </button>
        )}

        {chapter.nextChapterSlug ? (
          <button
            onClick={() => onNavigate(chapter.nextChapterSlug!)}
            className={`flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base font-mono transition shadow-xl active:scale-95 ml-auto text-slate-950 ${
              isReading
                ? 'bg-purple-500 hover:bg-purple-400 shadow-purple-500/30'
                : isClassic
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30'
            }`}
          >
            <span>次の章へ進む</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-mono font-bold">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                {isGuide
                  ? `🎉 本ガイド・コラムの読了お疲れ様でした！実践・学習にお役立てください！`
                  : isReading
                  ? `🧭 コード読解演習トラック（全${READING_CHAPTERS.length}ステップ）読了！現場鑑識の基礎を制覇しました！🎓`
                  : isClassic
                  ? `🏛️ レガシーC++コース（現行${CLASSIC_CHAPTERS.length}章）読破！お疲れ様でした！🎓`
                  : `🚀 モダンコース（現行${MODERN_CHAPTERS.length}章）読破！お疲れ様でした！🎓`}
              </span>
            </span>

            {/* ガイド以外の場合は他コースへの誘導ボタン */}
            {!isGuide && (
              isClassic ? (
                <button
                  onClick={() => onNavigate('chapter-5-smart-pointers-raii')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-cyan-500/30 active:scale-95"
                >
                  <span>🚀 モダン【M】第1章へ挑戦する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : isReading ? (
                <button
                  onClick={() => onNavigate('chapter-1-spaghetti-to-oop')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <span>🏛️ レガシー【L】第1章へ挑戦する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('chapter-1-spaghetti-to-oop')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <span>🏛️ レガシー【L】第1章へ挑戦する</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            )}

            <button
              onClick={() => onNavigate('top')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs sm:text-sm transition border border-slate-700 active:scale-95"
            >
              <span>TOPへ戻る</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
