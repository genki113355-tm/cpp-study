import React, { useState } from 'react';
import { ParadigmComparison } from '../../types/curriculum';
import { CheckCircle2, XCircle, Lightbulb, Copy, Check, AlertTriangle } from 'lucide-react';

interface ParadigmComparisonViewProps {
  data: ParadigmComparison;
}

export const ParadigmComparisonView: React.FC<ParadigmComparisonViewProps> = ({ data }) => {
  const [copiedC, setCopiedC] = useState<boolean>(false);
  const [copiedCpp, setCopiedCpp] = useState<boolean>(false);

  const handleCopy = async (code: string, isCpp: boolean) => {
    try {
      await navigator.clipboard.writeText(code);
      if (isCpp) {
        setCopiedCpp(true);
        setTimeout(() => setCopiedCpp(false), 2000);
      } else {
        setCopiedC(true);
        setTimeout(() => setCopiedC(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] shadow-2xl p-5 my-6">
      {/* タイトルバー */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-mono font-bold text-white flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-cyan-400" />
          <span>{data.title}</span>
        </h3>
        <span className="text-xs sm:text-sm font-mono px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
          C言語 vs C++ 設計パラダイム対比
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：C言語のアプローチ（アンチパターン） */}
        <div className="p-6 rounded-2xl bg-slate-950/85 border-2 border-rose-500/40 flex flex-col justify-between shadow-xl shadow-rose-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-700 text-rose-300 text-xs sm:text-sm font-bold font-mono">C言語</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/60 text-[11px] font-bold font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>実務コピペ厳禁</span>
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-rose-200">{data.cApproach.title}</span>
              </div>
              <button
                onClick={() => handleCopy(data.cApproach.code, false)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-700/60 transition font-mono active:scale-95 cursor-pointer"
                title="C言語アンチパターンコードをコピー"
              >
                {copiedC ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 font-bold">⚠️ 転用非推奨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-rose-400" />
                    <span>コードをコピー</span>
                  </>
                )}
              </button>
            </div>

            {/* アンチパターン警告バナー */}
            <div className="px-3.5 py-2 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-sans flex items-center gap-2.5 my-2 shadow-inner">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span><strong>【学習用アンチパターン】</strong> 設計の破綻を体感するための教材用コードです。現場の実務コードへのコピペ転用は避けてください。</span>
            </div>

            {/* コードブロック */}
            <div className="relative group my-3">
              <pre className="p-4 rounded-xl bg-slate-900/90 text-sm sm:text-base font-mono text-rose-100 overflow-x-auto border border-rose-900/50 leading-relaxed">
                <code>{data.cApproach.code}</code>
              </pre>
            </div>

            {/* 課題・破綻点 */}
            <div className="space-y-2.5 mt-5">
              <span className="text-sm sm:text-base font-mono font-bold text-rose-300 block">⚠️ 現場で起きる破綻：</span>
              {data.cApproach.drawbacks.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：C++のアプローチ（推奨設計） */}
        <div className="p-6 rounded-2xl bg-slate-950/85 border-2 border-cyan-500/50 flex flex-col justify-between shadow-xl shadow-cyan-950/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs sm:text-sm font-bold font-mono">C++</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/60 text-[11px] font-bold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>推奨モダン設計</span>
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-cyan-200">{data.cppApproach.title}</span>
              </div>
              <button
                onClick={() => handleCopy(data.cppApproach.code, true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 transition font-mono active:scale-95 shadow-sm cursor-pointer"
                title="C++推奨設計コードをコピー"
              >
                {copiedCpp ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>コードをコピー</span>
                  </>
                )}
              </button>
            </div>

            {/* 推奨設計バナー */}
            <div className="px-3.5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-sans flex items-center gap-2.5 my-2 shadow-inner">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span><strong>【推奨設計】</strong> カプセル化とRAII（Resource Acquisition Is Initialization）により、安全かつ拡張性を高めた実務レベルの設計です。</span>
            </div>

            {/* コードブロック */}
            <div className="relative group my-3">
              <pre className="p-4 rounded-xl bg-slate-900/90 text-sm sm:text-base font-mono text-cyan-200 overflow-x-auto border border-cyan-500/35 leading-relaxed">
                <code>{data.cppApproach.code}</code>
              </pre>
            </div>

            {/* メリット */}
            <div className="space-y-2.5 mt-5">
              <span className="text-sm sm:text-base font-mono font-bold text-cyan-300 block">✨ オブジェクト指向の恩恵：</span>
              {data.cppApproach.benefits.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* パラダイムシフトの真意（設計意図） */}
      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950 border border-cyan-500/30 text-sm sm:text-base text-slate-200 leading-relaxed flex items-start gap-4">
        <Lightbulb className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 font-mono text-base sm:text-lg block mb-1.5">
            【シロクマ先生の設計意図：なぜこのパラダイムシフトが必要なのか】
          </strong>
          <p className="leading-relaxed font-sans">{data.paradigmShiftNotes}</p>
        </div>
      </div>
    </div>
  );
};
