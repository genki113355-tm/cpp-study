import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ExternalLink, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  Sparkles,
  Compass,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodingChallenge, CodeStepNav } from '../../data/codingChallenges';
import { compileCppCode, createGodboltUrl, CompileResult } from '../../services/cppCompilerService';
import { InteractiveCodeEditor } from './InteractiveCodeEditor';
import { getAssetUrl } from '../../utils/assetPath';

interface CodeChallengeRunnerProps {
  challenge: CodingChallenge;
}

export const CodeChallengeRunner: React.FC<CodeChallengeRunnerProps> = ({ challenge }) => {
  const [code, setCode] = useState<string>(challenge.initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CompileResult | null>(null);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // 1行ステップナビゲーション用のステップ一覧（未定義の場合は自動フォールバック）
  const activeSteps: CodeStepNav[] = useMemo(() => {
    if (challenge.codeSteps && challenge.codeSteps.length > 0) {
      return challenge.codeSteps;
    }
    return [
      {
        stepNumber: 1,
        totalSteps: 1,
        title: '模範解答コードを適用',
        targetPlaceholder: challenge.initialCode,
        instruction: '課題の要件を満たすコードをエディタに反映させましょう。',
        codeToInsert: challenge.solutionCode,
        explanation: challenge.hint || '模範解答のコード構造を確認してテストを実行しましょう。'
      }
    ];
  }, [challenge]);

  const currentStep = activeSteps[stepIndex];
  const isAllStepsCompleted = stepIndex >= activeSteps.length;

  // Tabキー補完ハンドラー（1行ずつコードを挿入）
  const handleTabComplete = (): boolean => {
    if (stepIndex >= activeSteps.length) return false;
    const step = activeSteps[stepIndex];
    if (!step) return false;

    if (code.includes(step.targetPlaceholder)) {
      const nextCode = code.replace(step.targetPlaceholder, step.codeToInsert);
      setCode(nextCode);
      setResult(null);
      setIsPassed(false);
      setStepIndex(prev => Math.min(prev + 1, activeSteps.length));
      return true;
    } else {
      // 既に書き換えられている、または一致しない場合でも次へ
      setStepIndex(prev => Math.min(prev + 1, activeSteps.length));
      return true;
    }
  };

  // コンパイル＆テスト実行
  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const res = await compileCppCode(code, { stdVersion: 'c++23' });
      setResult(res);

      // 合格判定
      let passed = false;
      const combinedOutput = `${res.program_output || ''}\n${res.compiler_output || ''}`;

      if (typeof challenge.expectedOutputPattern === 'string') {
        passed = combinedOutput.includes(challenge.expectedOutputPattern);
      } else if (challenge.expectedOutputPattern instanceof RegExp) {
        passed = challenge.expectedOutputPattern.test(combinedOutput);
      }

      if (passed && res.isSuccess) {
        setIsPassed(true);
        // 紙吹雪エフェクト
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
          });
        } catch {}
      } else {
        setIsPassed(false);
      }
    } catch (e: any) {
      setResult({
        status: -1,
        compiler_error: `通信エラー: ${e.message || 'コンパイルに失敗しました'}`,
        isSuccess: false,
      });
      setIsPassed(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('初期コードに戻しますか？（現在の編集内容は破棄されます）')) {
      setCode(challenge.initialCode);
      setResult(null);
      setIsPassed(false);
      setStepIndex(0);
    }
  };

  const godboltUrl = createGodboltUrl(code);

  return (
    <div className="my-10 rounded-3xl bg-gradient-to-b from-[#080e1c] via-[#050a16] to-[#03060f] border-2 border-cyan-500/40 p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* 背景アクセント */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダーエリア */}
      <div className="relative z-10 space-y-4 pb-6 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-sm">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>【{challenge.chapterBadge} 実践ハンズオン演習】</span>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/30 font-bold">
            ⚡ 本物GCC (C++23) 即時実行
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
            {challenge.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed font-sans">
            {challenge.missionObjective}
          </p>
        </div>

        {/* シロクマ先生の助言吹き出し */}
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 flex-shrink-0 shadow-md">
            <img
              src={getAssetUrl('/images/characters_mission.jpg')}
              alt="シロクマ指導官"
              className="w-full h-full object-cover object-[20%_35%]"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-mono font-bold text-cyan-300 mr-2">シロクマ指導官の助言 :</span>
            <span className="font-sans leading-relaxed text-slate-300">{challenge.mentorAdvice}</span>
          </div>
        </div>

        {/* 🔰 実践ハンズオン演習の進め方（3ステップ・ガイド） */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 shadow-inner">
          <div className="font-bold text-cyan-300 flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/90 text-cyan-200 border border-cyan-400/40 text-[11px] font-mono font-bold">
              🔰 はじめての方へ：演習の進め方
            </span>
            <span className="text-xs text-slate-400 font-normal">（迷わず3ステップでクリアできます！）</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <div>
                <span className="font-bold text-white block text-xs sm:text-sm">ミッションを確認</span>
                <span className="text-[11px] text-slate-400 leading-relaxed block mt-1">上の「課題」と「指導官の助言」を読んで達成目標を掴みます。</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border-2 border-cyan-500/50 flex items-start gap-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <div>
                <span className="font-bold text-cyan-300 block text-xs sm:text-sm flex items-center gap-1.5">
                  <span>コードを直接編集</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">文字入力OK</span>
                </span>
                <span className="text-[11px] text-slate-300 leading-relaxed block mt-1">
                  下のエディタ内をクリックすると直接キーボード入力できます。<code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">// TODO:</code> の箇所を修正しましょう！
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <div>
                <span className="font-bold text-white block text-xs sm:text-sm">テストを実行！</span>
                <span className="text-[11px] text-slate-400 leading-relaxed block mt-1">下の「▶ コードをテスト実行する」を押すと本物のGCCコンパイラが自動判定します。</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-cyan-900/50 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-400">💡 迷ったときは「ヒント」を見るか、模範解答を直接セットして試せます：</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowHint((p) => !p)}
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-bold font-mono text-xs cursor-pointer bg-amber-950/70 hover:bg-amber-900/80 px-3 py-1 rounded-lg border border-amber-500/50 transition active:scale-95 shadow-sm"
                title="攻略のヒントを開閉"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>💡 ヒントを見る {showHint ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCode(challenge.solutionCode);
                  setResult(null);
                  setIsPassed(false);
                }}
                className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-bold font-mono text-xs cursor-pointer bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition active:scale-95"
                title="模範解答をエディタに自動入力"
              >
                <span>🔑 模範解答コードをセット</span>
              </button>
            </div>
          </div>

          {/* エディタ直上にも折りたたみヒントボックスを展開 */}
          {showHint && (
            <div className="mt-3 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs sm:text-sm text-amber-200/90 leading-relaxed font-sans animate-fadeIn">
              <div className="font-bold flex items-center gap-1.5 mb-1.5 text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>攻略のヒント:</span>
              </div>
              <p className="whitespace-pre-line">{challenge.hint}</p>
            </div>
          )}
        </div>
      </div>

      {/* 🧭 1行ステップナビゲーター（Tab補完＆1行ずつガイド） */}
      <div className="relative z-10 my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border-2 border-indigo-500/50 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Compass size={16} />
            </span>
            <span className="font-bold text-white text-xs sm:text-sm">
              🧭 1行ステップナビゲーター（Tab補完モード）
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40">
              進捗: {stepIndex} / {activeSteps.length} ステップ完了
            </span>
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCode(challenge.initialCode);
                  setStepIndex(0);
                  setResult(null);
                  setIsPassed(false);
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition"
                title="ステップを最初からやり直す"
              >
                <RotateCcw size={11} />
                <span>最初から</span>
              </button>
            )}
          </div>
        </div>

        {!isAllStepsCompleted && currentStep ? (
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  【ステップ {currentStep.stepNumber}/{currentStep.totalSteps}】
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {currentStep.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentStep.instruction}
              </p>
              {currentStep.explanation && (
                <p className="text-[11px] text-indigo-300/90 mt-1 font-sans">
                  💡 なぜ？: {currentStep.explanation}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-500 font-bold">挿入コード:</span>
                <code className="text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                  {currentStep.codeToInsert.trim().split('\n')[0]}...
                </code>
              </div>

              <button
                type="button"
                onClick={handleTabComplete}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-md shadow-indigo-500/25 transition active:scale-95 cursor-pointer shrink-0 animate-pulse hover:animate-none"
              >
                <Sparkles size={14} className="text-cyan-200" />
                <span>⇥ [Tab] キーでこの1行をコードに自動補完</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 flex-wrap animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-emerald-200 block">
                  🎉 全てのステップコードの補完が完了しました！
                </span>
                <span className="text-[11px] text-slate-300">
                  下の青い「▶ コードをテスト実行する」ボタンを押して、本物のGCCコンパイラで判定してみましょう！
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow transition active:scale-95 cursor-pointer shrink-0 font-mono"
            >
              今すぐテスト実行 ➔
            </button>
          </div>
        )}
      </div>

      {/* コードエディタ本体 */}
      <div className="relative z-10 my-4">
        <InteractiveCodeEditor
          value={code}
          onChange={setCode}
          onReset={handleReset}
          onTabComplete={!isAllStepsCompleted ? handleTabComplete : undefined}
          minHeight="340px"
        />
      </div>

      {/* アクションボタンバー */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 実行ボタン */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-mono text-sm transition shadow-xl active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span>コンパイルテスト実行中...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>▶ コードをテスト実行する</span>
              </>
            )}
          </button>

          {/* Godbolt 外部リンク */}
          <a
            href={godboltUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-mono transition border border-slate-700"
            title="Compiler Explorer (Godbolt) でアセンブリを確認"
          >
            <span>⚡ Godboltで開く</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* ヒント＆解答トグルボタン */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>ヒント {showHint ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}</span>
          </button>

          <button
            onClick={() => setShowSolution((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>模範解答 {showSolution ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}</span>
          </button>
        </div>
      </div>

      {/* 折りたたみヒント */}
      {showHint && (
        <div className="relative z-10 mt-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 leading-relaxed font-sans">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-400">
            <Lightbulb className="w-4 h-4" />
            <span>攻略のヒント:</span>
          </div>
          <p>{challenge.hint}</p>
        </div>
      )}

      {/* 折りたたみ模範解答 */}
      {showSolution && (
        <div className="relative z-10 mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
            <span>🔑 模範解答コード:</span>
            <button
              onClick={() => {
                setCode(challenge.solutionCode);
                setShowSolution(false);
              }}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>この解答をエディタにセットする</span>
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 overflow-x-auto whitespace-pre font-mono text-xs">
            <code>{challenge.solutionCode}</code>
          </pre>
        </div>
      )}

      {/* 実行結果コンソール */}
      {result && (
        <div className="relative z-10 mt-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>実行結果コンソール</span>
            </span>
            <span className="text-[11px]">
              終了コード: <span className={result.status === 0 ? 'text-emerald-400' : 'text-rose-400'}>{result.status}</span>
              {result.executionTimeMs !== undefined && ` (${result.executionTimeMs}ms)`}
            </span>
          </div>

          {/* 出力ターミナル */}
          <div className="rounded-2xl border border-slate-800 bg-[#040711] p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
            {/* コンパイルエラー */}
            {result.compiler_error && (
              <div className="text-rose-400 whitespace-pre-wrap leading-relaxed pb-2">
                <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-bold text-rose-300 mr-2">
                  COMPILER ERROR
                </span>
                {result.compiler_error}
              </div>
            )}

            {/* コンパイル警告 */}
            {result.compiler_output && !result.compiler_error && (
              <div className="text-amber-400 whitespace-pre-wrap leading-relaxed pb-2 opacity-80 text-xs">
                {result.compiler_output}
              </div>
            )}

            {/* プログラム標準出力 */}
            {result.program_output ? (
              <div className="text-cyan-200 whitespace-pre-wrap leading-relaxed">
                {result.program_output}
              </div>
            ) : (
              !result.compiler_error && (
                <div className="text-slate-500 italic">
                  (プログラムからの標準出力はありませんでした)
                </div>
              )
            )}

            {/* 実行時エラー */}
            {result.program_error && (
              <div className="text-rose-400 whitespace-pre-wrap leading-relaxed pt-2 border-t border-slate-800">
                <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-bold text-rose-300 mr-2">
                  RUNTIME ERROR
                </span>
                {result.program_error}
              </div>
            )}
          </div>

          {/* 合格・不合格バナー */}
          {isPassed ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-400 flex-shrink-0 shadow-lg hidden sm:block">
                <img
                  src={getAssetUrl('/images/characters_victory.png')}
                  alt="ハイタッチ！"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base sm:text-lg font-mono">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>ミッションクリア！正解です！🎉</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 font-sans leading-relaxed">
                  {challenge.successMessage}
                </p>
              </div>
            </div>
          ) : result.isSuccess ? (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                コードは正常に実行されましたが、期待されるテスト結果（{challenge.expectedOutputPattern.toString()}）と一致していません。もう一度コードを見直してみましょう！
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
