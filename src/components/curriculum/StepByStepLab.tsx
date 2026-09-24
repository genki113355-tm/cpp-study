import React, { useState } from 'react';
import { getLabScenario, LabStep } from '../../data/stepByStepLabs';
import { DialogueBubble } from './DialogueBubble';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  ShieldCheck,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StepByStepLabProps {
  chapterSlug: string;
}

export const StepByStepLab: React.FC<StepByStepLabProps> = ({ chapterSlug }) => {
  const scenario = getLabScenario(chapterSlug);

  // シナリオが未定義のチャプターでは何も表示しない
  if (!scenario) return null;

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [executedSteps, setExecutedSteps] = useState<Record<number, boolean>>({});
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentStep: LabStep = scenario.steps[currentStepIdx];
  const isStepExecuted = !!executedSteps[currentStepIdx];

  const handleRunStep = async () => {
    if (isExecuting) return;
    setIsExecuting(true);

    // 臨場感のあるシミュレーションディレイ（450ms）
    await new Promise((resolve) => setTimeout(resolve, 450));

    const nextExecuted = { ...executedSteps, [currentStepIdx]: true };
    setExecutedSteps(nextExecuted);
    setIsExecuting(false);

    // 最終ステップ完了時の演出
    if (currentStepIdx === scenario.steps.length - 1) {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6']
        });
      } catch {
        // ignore
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < scenario.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setExecutedSteps({});
    setIsCompleted(false);
  };

  return (
    <section 
      id="chapter-step-lab" 
      aria-label="ステップバイステップ設計演習"
      className="my-14 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-indigo-500/30 p-5 sm:p-7 lg:p-9 shadow-2xl relative overflow-hidden"
    >
      {/* 背景装飾グロー */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* ヘッダーエリア */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Sparkles size={13} className="text-indigo-400" />
            {scenario.chapterBadge}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-fadeIn">
              <CheckCircle2 size={13} className="text-emerald-400" />
              演習クリア達成 🏆
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
            <Cpu size={13} className="text-cyan-400" />
            ステップバイステップ対話型演習
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          {scenario.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          {scenario.subtitle}
        </p>

        {/* メンタルモデル（全体像）バナー */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 shrink-0 uppercase tracking-wider">
            <BookOpen size={15} className="text-cyan-400" />
            【全体設計フロー】
          </div>
          <div className="text-xs sm:text-sm font-mono text-slate-200 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-indigo-500/20 flex-1 leading-relaxed">
            {scenario.mentalModel}
          </div>
        </div>
      </div>

      {/* ステップナビゲーション（3ステップ進行バー） */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8">
        {scenario.steps.map((st, idx) => {
          const isActive = idx === currentStepIdx;
          const isDone = !!executedSteps[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStepIdx(idx)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-lg shadow-indigo-950/40'
                  : isDone
                  ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold tracking-wider uppercase ${
                  isActive ? 'text-indigo-300' : isDone ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {st.badge}
                </span>
                {isDone ? (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`} />
                )}
              </div>
              <div className="text-xs sm:text-[13px] font-bold truncate">
                {st.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* ステップ本体コンテンツ */}
      <div className="relative z-10 space-y-6">
        {/* ステップ概要カード */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              {currentStep.stepNumber}
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {currentStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentStep.instruction}
              </p>
            </div>
          </div>
        </div>

        {/* C++コードエディタ風プレビュー */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-xl">
          {/* ウィンドウヘッダー */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <Code2 size={13} className="text-indigo-400" />
                {currentStep.codeFilename}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">C++20</span>
          </div>

          {/* コード本文 */}
          <pre className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 overflow-x-auto selection:bg-indigo-500/30">
            <code>{currentStep.code}</code>
          </pre>
        </div>

        {/* アクション実行ボタン */}
        {!isStepExecuted ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleRunStep}
              disabled={isExecuting}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>コンパイル＆シミュレーション実行中...</span>
                </>
              ) : (
                <>
                  <Play size={17} className="fill-white" />
                  <span>{currentStep.actionButtonText}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* 実行後の結果・解説エリア（アニメーションで展開） */
          <div className="space-y-6 pt-2 animate-fadeIn">
            {/* ターミナル風シミュレート出力 */}
            <div className="rounded-2xl border border-slate-700/80 bg-black/95 p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-2xl">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-slate-400 text-xs">
                <Terminal size={14} className="text-cyan-400" />
                <span>TERMINAL OUTPUT</span>
                {currentStep.simulatedOutput.type === 'error' && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/50">
                    <AlertTriangle size={12} /> CRASH / ERROR
                  </span>
                )}
                {currentStep.simulatedOutput.type === 'warning' && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/50">
                    <AlertTriangle size={12} /> WARNING
                  </span>
                )}
                {currentStep.simulatedOutput.type === 'success' && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                    <CheckCircle2 size={12} /> PASSED
                  </span>
                )}
              </div>

              <div className="space-y-1.5 leading-relaxed">
                {currentStep.simulatedOutput.lines.map((line, lIdx) => {
                  let lineStyle = 'text-slate-300';
                  if (line.startsWith('$')) {
                    lineStyle = 'text-cyan-300 font-bold';
                  } else if (line.includes('ERROR') || line.includes('SIGSEGV') || line.includes('Crash') || line.includes('assert failed')) {
                    lineStyle = 'text-rose-400 font-bold';
                  } else if (line.includes('PASSED') || line.includes('SUCCESS') || line.includes('🎉') || line.includes('SAFE')) {
                    lineStyle = 'text-emerald-400 font-bold';
                  } else if (line.includes('warning') || line.includes('LEAK')) {
                    lineStyle = 'text-amber-400';
                  }
                  return (
                    <div key={lIdx} className={lineStyle}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* シロクマ先生 or ペンギン先輩の対話解説吹き出し */}
            <div className="my-2">
              <DialogueBubble
                dialogue={{
                  id: `lab-step-${currentStepIdx}`,
                  speaker: currentStep.dialogue.speaker,
                  emotion: currentStep.dialogue.emotion,
                  text: currentStep.dialogue.text,
                  sideNote: '💡 演習ステップの裏側メカニズム解説'
                }}
              />
            </div>

            {/* このステップのTakeaway（学びの要点） */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
              <ShieldCheck size={20} className="text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase block">
                  KEY TAKEAWAY（設計の核心）
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {currentStep.takeaway}
                </p>
              </div>
            </div>

            {/* 次のステップへ進む / 完了リセットボタン */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {currentStepIdx < scenario.steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
                >
                  <span>次のステップ（STEP {currentStepIdx + 2}）に進む</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">
                        🎉 全3ステップの設計演習を完全クリア！
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        破綻の再現から安全な設計へのリファクタリング、その効果の検証まで体得しました。
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors shrink-0 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    もう一度最初から体験する
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
