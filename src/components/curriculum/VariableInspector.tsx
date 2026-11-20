import React, { useState } from 'react';
import { VariableDoc } from '../../types/curriculum';
import { LayoutGrid, Table as TableIcon, Code2, AlertTriangle, ShieldCheck, ChevronDown } from 'lucide-react';

interface VariableInspectorProps {
  variables: VariableDoc[];
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({ variables }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isOpen, setIsOpen] = useState<boolean>(variables.length <= 3);

  return (
    <div className="rounded-2xl border border-sky-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1222] shadow-md overflow-hidden my-6 w-full">
      {/* ツールバーヘッダー */}
      <div className="px-4 sm:px-5 py-3.5 bg-slate-50/90 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono tracking-tight flex items-center gap-2 flex-wrap group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
              <span>データ構造 &amp; 変数インスペクター</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30 font-semibold font-sans">
                {variables.length} 件の定義
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-cyan-700 dark:text-cyan-400">
                <span>{isOpen ? '閉じる' : '詳細を見る'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </span>
            </h4>
          </div>
        </button>

        {/* 表示モード切り替え（展開時のみ表示） */}
        {isOpen && (
        <div role="radiogroup" aria-label="変数表示形式選択" className="flex items-center bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs shadow-xs">
          <button
            role="radio"
            aria-checked={viewMode === 'table'}
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none ${
              viewMode === 'table'
                ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-200 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>一覧表</span>
          </button>
          <button
            role="radio"
            aria-checked={viewMode === 'cards'}
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none ${
              viewMode === 'cards'
                ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-200 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>カード</span>
          </button>
        </div>
        )}
      </div>

      {/* 本体（展開時のみ描画） */}
      {isOpen && (
      viewMode === 'cards' ? (
        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-gradient-to-b dark:from-[#090d18] dark:to-[#0c1222]">
          {variables.map((v, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all duration-200 p-6 flex flex-col justify-between shadow-xl group hover:shadow-cyan-950/40"
            >
              <div>
                {/* カード上部：変数名とバッジ類 */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <div className="font-mono font-bold text-cyan-800 dark:text-cyan-300 text-lg sm:text-xl tracking-wide group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors">
                    <code>{v.name}</code>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-mono font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500/40 shadow-sm whitespace-nowrap">
                      {v.type}
                    </span>
                    <span className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap">
                      {v.scope}
                    </span>
                  </div>
                </div>

                {/* 役割と動作の解説 */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>役割と挙動：</span>
                  </span>
                  <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {v.description}
                  </p>
                </div>
              </div>

              {/* C言語との対比ブロック（下部） */}
              {v.cComparison && (
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-gradient-to-r dark:from-amber-950/30 dark:via-slate-900/40 dark:to-slate-900/20 border border-amber-200 dark:border-amber-500/30">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-900 dark:text-amber-300 mb-1.5">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                      <span>C言語との対比 / 設計の落とし穴</span>
                    </div>
                    <p className="text-sm sm:text-base text-amber-950 dark:text-amber-100/90 leading-relaxed font-sans pl-7">
                      {v.cComparison}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* テーブル表示モード（重なり防止・折り返し許可） */
        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300 font-mono text-sm">
                <th className="py-3.5 px-4 w-[18%] font-bold">変数・メンバ名</th>
                <th className="py-3.5 px-4 w-[14%] font-bold">型</th>
                <th className="py-3.5 px-4 w-[20%] font-bold">スコープ / 状態</th>
                <th className="py-3.5 px-4 w-[26%] font-bold">役割と動作の解説</th>
                <th className="py-3.5 px-4 w-[22%] font-bold text-amber-800 dark:text-amber-300">C言語との対比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 font-sans text-sm">
              {variables.map((v, vIdx) => (
                <tr key={vIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-800 dark:text-cyan-300 break-words align-top text-sm sm:text-base">
                    {v.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-800 dark:text-amber-300 align-top">
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/50 dark:border-amber-500/30 dark:text-amber-300 text-xs font-semibold break-words">
                      {v.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200 align-top">
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800/90 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs break-words">
                      {v.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 leading-relaxed align-top text-sm sm:text-base">
                    {v.description}
                  </td>
                  <td className="py-3.5 px-4 text-amber-950 dark:text-amber-100/90 leading-relaxed text-sm bg-amber-50/50 dark:bg-amber-950/15 border-l border-slate-200 dark:border-slate-800 align-top font-sans">
                    {v.cComparison || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      )}
    </div>
  );
};
