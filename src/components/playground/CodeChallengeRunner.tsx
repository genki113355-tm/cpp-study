import React, { useState } from 'react';
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
  Eye 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodingChallenge } from '../../data/codingChallenges';
import { compileCppCode, createGodboltUrl, CompileResult } from '../../services/cppCompilerService';
import { InteractiveCodeEditor } from './InteractiveCodeEditor';

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
              src="/images/characters_mission.jpg"
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
            <span className="text-slate-400">💡 迷ったときは、右下の「ヒント」を見るか、模範解答を直接セットして試せます：</span>
            <button
              onClick={() => {
                setCode(challenge.solutionCode);
                setResult(null);
                setIsPassed(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-bold font-mono text-xs cursor-pointer bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30"
            >
              <span>🔑 模範解答コードをエディタにセットする</span>
            </button>
          </div>
        </div>
      </div>

      {/* コードエディタ本体 */}
      <div className="relative z-10 my-6">
        <InteractiveCodeEditor
          value={code}
          onChange={setCode}
          onReset={handleReset}
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
                  src="/images/characters_victory.png"
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
