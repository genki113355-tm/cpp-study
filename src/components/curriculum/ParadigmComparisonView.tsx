import React, { useState } from 'react';
import { ParadigmComparison } from '../../types/curriculum';
import { CheckCircle2, XCircle, Lightbulb, Copy, Check } from 'lucide-react';

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
        {/* 左側：C言語のアプローチ */}
        <div className="p-6 rounded-2xl bg-slate-950/85 border border-red-500/30 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-base sm:text-lg font-mono font-bold text-red-400 flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-red-950/90 border border-red-700 text-xs sm:text-sm font-bold">C言語</span>
                <span>{data.cApproach.title}</span>
              </span>
              <button
                onClick={() => handleCopy(data.cApproach.code, false)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition font-mono active:scale-95"
                title="C言語コードをコピー"
              >
                {copiedC ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>コピー</span>
                  </>
                )}
              </button>
            </div>

            {/* コードブロック */}
            <div className="relative group my-3">
              <pre className="p-4 rounded-xl bg-slate-900/90 text-sm sm:text-base font-mono text-slate-200 overflow-x-auto border border-slate-800 leading-relaxed">
                <code>{data.cApproach.code}</code>
              </pre>
            </div>

            {/* 課題・破綻点 */}
            <div className="space-y-2.5 mt-5">
              <span className="text-sm sm:text-base font-mono font-bold text-red-300 block">⚠️ 現場で起きる破綻：</span>
              {data.cApproach.drawbacks.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：C++のアプローチ */}
        <div className="p-6 rounded-2xl bg-slate-950/85 border border-cyan-500/40 flex flex-col justify-between shadow-xl shadow-cyan-950/30">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-base sm:text-lg font-mono font-bold text-cyan-400 flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-700 text-xs sm:text-sm font-bold">C++</span>
                <span>{data.cppApproach.title}</span>
              </span>
              <button
                onClick={() => handleCopy(data.cppApproach.code, true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 transition font-mono active:scale-95 shadow-sm"
                title="C++コードをコピー"
              >
                {copiedCpp ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>コピー</span>
                  </>
                )}
              </button>
            </div>

            {/* コードブロック */}
            <div className="relative group my-3">
              <pre className="p-4 rounded-xl bg-slate-900/90 text-sm sm:text-base font-mono text-cyan-200 overflow-x-auto border border-cyan-500/25 leading-relaxed">
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
