import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Terminal, 
  ExternalLink, 
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Sparkles,
  Code2,
  BookOpen,
} from 'lucide-react';
import { PLAYGROUND_TEMPLATES, PlaygroundTemplate } from '../../data/codingChallenges';
import { compileCppCode, createGodboltUrl, CompileResult } from '../../services/cppCompilerService';
import { InteractiveCodeEditor } from './InteractiveCodeEditor';
import { getAssetUrl } from '../../utils/assetPath';

interface OnlinePlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const OnlinePlaygroundModal: React.FC<OnlinePlaygroundModalProps> = ({
  isOpen,
  onClose,
  initialCode,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PLAYGROUND_TEMPLATES[0].id);
  const [code, setCode] = useState<string>(() => initialCode || PLAYGROUND_TEMPLATES[0].code);
  const [stdin, setStdin] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CompileResult | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  const currentIndex = PLAYGROUND_TEMPLATES.findIndex((t) => t.id === selectedTemplateId);
  const currentTemplate = PLAYGROUND_TEMPLATES[currentIndex] || PLAYGROUND_TEMPLATES[0];
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= PLAYGROUND_TEMPLATES.length - 1;

  const categories = Array.from(new Set(PLAYGROUND_TEMPLATES.map((t) => t.category)));

  if (!isOpen) return null;

  const handleSelectTemplate = (template: PlaygroundTemplate) => {
    setSelectedTemplateId(template.id);
    setCode(template.code);
    setResult(null);
  };

  const handlePrevTemplate = () => {
    if (!isFirst) {
      handleSelectTemplate(PLAYGROUND_TEMPLATES[currentIndex - 1]);
    }
  };

  const handleNextTemplate = () => {
    if (!isLast) {
      handleSelectTemplate(PLAYGROUND_TEMPLATES[currentIndex + 1]);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const res = await compileCppCode(code, {
        stdVersion: 'c++23',
        stdin: showStdin ? stdin : undefined,
      });
      setResult(res);
    } catch (e: any) {
      setResult({
        status: -1,
        compiler_error: `通信エラー: ${e.message || '実行に失敗しました'}`,
        isSuccess: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const currentTemplate = PLAYGROUND_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (currentTemplate && window.confirm('現在のテンプレート初期コードに戻しますか？')) {
      setCode(currentTemplate.code);
      setResult(null);
    }
  };

  const godboltUrl = createGodboltUrl(code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* モーダルウィンドウ本体 */}
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#070b16] border-2 border-cyan-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex-wrap gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <img
              src={getAssetUrl('/images/characters/shirokuma_sensei.png')}
              alt="シロクマ先生"
              className="w-8 h-8 rounded-xl object-cover border border-cyan-400/50 shadow-md flex-shrink-0"
            />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-sans leading-tight">
                <span>C++オンライン実行ラボ</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  GCC C++23
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                ブラウザ上で即座にコンパイル・実行できる自由サンドボックス
              </p>
            </div>
          </div>

          {/* 右上アクション */}
          <div className="flex items-center gap-2">
            <a
              href={godboltUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition border border-slate-700"
              title="Compiler Explorerで開く"
            >
              <span>⚡ Godbolt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 演習テンプレート選択バー（カテゴリ別プルダウン ＋ 前後ナビ ＋ 解説トグル） */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#040812] border-b border-slate-800/80 flex items-center justify-between gap-3 flex-wrap select-none">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <span className="text-xs font-mono text-slate-300 font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>演習テンプレート:</span>
            </span>

            {/* カテゴリ別プルダウンメニュー */}
            <div className="relative flex-1 min-w-[240px] max-w-full sm:max-w-md">
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  const tmpl = PLAYGROUND_TEMPLATES.find((t) => t.id === e.target.value);
                  if (tmpl) handleSelectTemplate(tmpl);
                }}
                className="w-full bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-sm appearance-none pr-8 transition"
              >
                {categories.map((cat) => (
                  <optgroup key={cat} label={`【${cat}】`} className="bg-slate-900 text-cyan-400 font-bold font-mono">
                    {PLAYGROUND_TEMPLATES.filter((t) => t.category === cat).map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id} className="bg-slate-950 text-slate-200 font-normal">
                        [{tmpl.badge}] {tmpl.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-cyan-400 text-xs">
                ▼
              </div>
            </div>

            {/* 前後ナビゲーションボタン */}
            <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-0.5 border border-slate-800 flex-shrink-0">
              <button
                onClick={handlePrevTemplate}
                disabled={isFirst}
                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-25 disabled:hover:text-slate-400 transition cursor-pointer"
                title="前の演習へ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10.5px] font-mono text-slate-400 px-1.5 font-bold">
                {currentIndex + 1} / {PLAYGROUND_TEMPLATES.length}
              </span>
              <button
                onClick={handleNextTemplate}
                disabled={isLast}
                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-25 disabled:hover:text-slate-400 transition cursor-pointer"
                title="次の演習へ"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 解説パネル表示切り替えボタン */}
          <button
            onClick={() => setShowExplanation((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer flex-shrink-0 ${
              showExplanation
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showExplanation ? '解説パネルを閉じる' : '📋 コードの解説・実験ヒントを見る'}</span>
          </button>
        </div>

        {/* メインエリア：エディタ ＆ コンソール（デスクトップ2カラム、モバイル縦並び） */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* 左側：エディタ ＆ コード解説パネル */}
          <div className="flex-1 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-slate-800/80 overflow-hidden">
            {/* コード解説 ＆ 実験のヒントパネル */}
            {showExplanation && (
              <div className="bg-[#080e1d] border-b border-slate-800 p-3.5 sm:p-4 text-xs space-y-3 overflow-y-auto max-h-[36vh] select-text animate-fadeIn">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-[11px]">
                      [{currentTemplate.badge}] {currentTemplate.category}
                    </span>
                    <h3 className="font-bold text-white text-xs sm:text-sm font-sans">
                      {currentTemplate.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowExplanation(false)}
                    className="text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>閉じる</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 目的サマリー */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-[11.5px] leading-relaxed">
                  <span className="text-cyan-400 font-bold font-mono mr-1.5">🎯 このコードの目的:</span>
                  <span>{currentTemplate.summary}</span>
                </div>

                {/* 着眼点 & 実験ヒント */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>C++学習の注目ポイント:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 font-sans">
                      {currentTemplate.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-mono mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>やってみよう！実験ヒント:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-200/90 font-sans">
                      {currentTemplate.experimentTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-mono mt-0.5">▶</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <InteractiveCodeEditor
              value={code}
              onChange={setCode}
              onReset={handleReset}
              className="border-0 rounded-none flex-1 min-h-0"
              minHeight="260px"
            />
          </div>

          {/* 右側：実行操作 ＆ 出力コンソール */}
          <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col bg-[#040711] overflow-hidden">
            {/* 実行コントロールバー */}
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold font-mono text-sm transition shadow-lg active:scale-95 ${
                  isRunning
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <span>実行中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>▶ 実行する</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowStdin((p) => !p)}
                className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border transition ${
                  showStdin
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                標準入力 (stdin)
              </button>
            </div>

            {/* 標準入力ボックス（展開時） */}
            {showStdin && (
              <div className="p-3 bg-slate-950 border-b border-slate-800">
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  標準入力（cin に渡す値）:
                </label>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="例: 10 20 hoge"
                  rows={2}
                  className="w-full p-2 rounded-lg bg-[#060a14] border border-slate-700 text-xs font-mono text-slate-200 resize-none outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* 出力エリア */}
            <div className="flex-1 flex flex-col min-h-[220px] overflow-hidden">
              <div className="px-3 py-2 bg-[#02050d] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>コンソール出力</span>
                </span>
                {result && (
                  <span className="text-[11px]">
                    Status: <span className={result.status === 0 ? 'text-emerald-400' : 'text-rose-400'}>{result.status}</span>
                    {result.executionTimeMs !== undefined && ` (${result.executionTimeMs}ms)`}
                  </span>
                )}
              </div>

              <div className="flex-1 p-3.5 overflow-auto font-mono text-xs leading-relaxed space-y-2 select-text">
                {isRunning && (
                  <div className="text-cyan-400 animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Wandbox クラウド上でコンパイル＆実行中...</span>
                  </div>
                )}

                {result ? (
                  <>
                    {/* コンパイルエラー */}
                    {result.compiler_error && (
                      <div className="text-rose-400 whitespace-pre-wrap pb-2">
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-bold mr-1.5 text-rose-300">
                          COMPILE ERROR
                        </span>
                        {result.compiler_error}
                      </div>
                    )}

                    {/* 警告 */}
                    {result.compiler_output && !result.compiler_error && (
                      <div className="text-amber-400 whitespace-pre-wrap opacity-75 text-[11px] pb-1">
                        {result.compiler_output}
                      </div>
                    )}

                    {/* 出力 */}
                    {result.program_output ? (
                      <div className="text-cyan-100 whitespace-pre-wrap">
                        {result.program_output}
                      </div>
                    ) : (
                      !result.compiler_error && (
                        <div className="text-slate-500 italic">
                          (標準出力はありませんでした)
                        </div>
                      )
                    )}

                    {/* 実行時エラー */}
                    {result.program_error && (
                      <div className="text-rose-400 whitespace-pre-wrap pt-2 border-t border-slate-800">
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-bold mr-1.5 text-rose-300">
                          RUNTIME ERROR
                        </span>
                        {result.program_error}
                      </div>
                    )}
                  </>
                ) : (
                  !isRunning && (
                    <div className="text-slate-600 text-xs italic space-y-1">
                      <p>「▶ 実行する」を押すと、ここに結果が表示されます。</p>
                      <p>上のテンプレートを切り替えることで、各章の主要コードをすぐに試せます。</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* モーダルフッター（シロクマ先生のひとこと） */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans">
          <div className="flex items-center gap-2">
            <img
              src={getAssetUrl('/images/characters/shirokuma_sensei.png')}
              alt="シロクマ指導官"
              className="w-5 h-5 rounded-full object-cover border border-cyan-400/50 shadow flex-shrink-0"
            />
            <span className="text-slate-300">
              <b className="text-cyan-300 font-mono">シロクマ指導官 : </b>
              どんな実験をしても壊れない安全な環境じゃ！どんどんコードを書き換えてC++の挙動を体感するがよい！
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
