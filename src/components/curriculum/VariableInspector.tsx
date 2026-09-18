import React, { useState } from 'react';
import { VariableDoc } from '../../types/curriculum';
import { LayoutGrid, Table as TableIcon, Code2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VariableInspectorProps {
  variables: VariableDoc[];
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({ variables }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0c1222] shadow-2xl overflow-hidden my-8 w-full">
      {/* ツールバーヘッダー */}
      <div className="px-6 py-4 bg-slate-900/95 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2.5">
              <span>データ構造 &amp; 変数インスペクター</span>
              <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold font-sans">
                {variables.length} 件の定義
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              各データの型・スコープ・役割、およびC言語の構造化設計との対比
            </p>
          </div>
        </div>

        {/* 表示モード切り替えトグル */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'cards'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>カード表示 (推奨)</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'table'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>テーブル表示</span>
          </button>
        </div>
      </div>

      {/* カード表示モード（広々とした2カラム・大文字・高可読性） */}
      {viewMode === 'cards' ? (
        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6 bg-gradient-to-b from-[#090d18] to-[#0c1222]">
          {variables.map((v, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 p-6 flex flex-col justify-between shadow-xl group hover:shadow-cyan-950/40"
            >
              <div>
                {/* カード上部：変数名とバッジ類 */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b border-slate-800 mb-4">
                  <div className="font-mono font-bold text-cyan-300 text-lg sm:text-xl tracking-wide group-hover:text-cyan-200 transition-colors">
                    <code>{v.name}</code>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-mono font-semibold px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/40 shadow-sm whitespace-nowrap">
                      {v.type}
                    </span>
                    <span className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 shadow-sm whitespace-nowrap">
                      {v.scope}
                    </span>
                  </div>
                </div>

                {/* 役割と動作の解説 */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>役割と挙動：</span>
                  </span>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
                    {v.description}
                  </p>
                </div>
              </div>

              {/* C言語との対比ブロック（下部） */}
              {v.cComparison && (
                <div className="mt-auto pt-4 border-t border-slate-800/80">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900/40 to-slate-900/20 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-300 mb-1.5">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                      <span>C言語との対比 / 設計の落とし穴</span>
                    </div>
                    <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-sans pl-7">
                      {v.cComparison}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* テーブル表示モード（大文字・折れ防止・均等幅配分） */
        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-300 font-mono text-sm">
                <th className="py-4 px-4 w-[22%] font-bold">変数・メンバ名</th>
                <th className="py-4 px-4 w-[16%] font-bold">型</th>
                <th className="py-4 px-4 w-[18%] font-bold">スコープ / 状態</th>
                <th className="py-4 px-4 w-[24%] font-bold">役割と動作の解説</th>
                <th className="py-4 px-4 w-[20%] font-bold text-amber-300">C言語との対比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-sm sm:text-base">
              {variables.map((v, vIdx) => (
                <tr key={vIdx} className="hover:bg-slate-900/60 transition">
                  <td className="py-4 px-4 font-mono font-bold text-cyan-300 break-words align-top text-base">
                    {v.name}
                  </td>
                  <td className="py-4 px-4 font-mono text-amber-300 align-top">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-xs sm:text-sm whitespace-nowrap font-semibold">
                      {v.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-200 align-top">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs sm:text-sm whitespace-nowrap">
                      {v.scope}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-200 leading-relaxed align-top text-base">
                    {v.description}
                  </td>
                  <td className="py-4 px-4 text-amber-100/90 leading-relaxed text-sm sm:text-base bg-amber-950/15 border-l border-slate-800 align-top font-sans">
                    {v.cComparison || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
