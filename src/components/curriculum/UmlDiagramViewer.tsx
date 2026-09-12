import React from 'react';
import { UmlDiagramDoc, UmlRelation, UmlClassMember, UmlClassItem } from '../../types/curriculum';
import { Layers, ArrowRight, Share2, Sparkles, CheckCircle } from 'lucide-react';

interface UmlDiagramViewerProps {
  data: UmlDiagramDoc;
  onSelectMember?: (member: UmlClassMember, cls: UmlClassItem) => void;
}

export const UmlDiagramViewer: React.FC<UmlDiagramViewerProps> = ({ data, onSelectMember }) => {
  const getRelationBadge = (relation: UmlRelation) => {
    switch (relation.type) {
      case 'composition':
        return {
          symbol: '◆──>',
          label: 'コンポジション (強固な所有・寿命連動)',
          color: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        };
      case 'aggregation':
        return {
          symbol: '◇──>',
          label: '集約 (共有所有・寿命独立)',
          color: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
        };
      case 'generalization':
        return {
          symbol: '◁───',
          label: '汎化・継承 (is-a 関係)',
          color: 'bg-amber-950 text-amber-300 border-amber-500/40',
        };
      case 'realization':
        return {
          symbol: '◁- - -',
          label: '実現 (インターフェース実装)',
          color: 'bg-purple-950 text-purple-300 border-purple-500/40',
        };
      case 'association':
      default:
        return {
          symbol: '───>',
          label: '関連 (単なる参照・利用)',
          color: 'bg-slate-900 text-slate-300 border-slate-700',
        };
    }
  };

  return (
    <div className="my-8 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* 設計書ヘッダー */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold mb-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {data.diagramType === 'class' && 'UML CLASS DIAGRAM : クラス設計図'}
              {data.diagramType === 'sequence' && 'UML SEQUENCE DIAGRAM : 時系列呼び出し設計図'}
              {data.diagramType === 'state' && 'UML STATE MACHINE : 状態遷移設計図'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="text-xs sm:text-sm font-mono text-cyan-300 mt-0.5">
              {data.subtitle}
            </p>
          )}
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          設計書 ⇄ C++コード完全同期
        </span>
      </div>

      {/* 設計書の概要リード */}
      <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
        {data.description}
      </div>

      {/* メインダイアグラム表示エリア */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* ① クラス図モード */}
        {data.diagramType === 'class' && data.classes && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-2.5 rounded-xl">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>💡 クラス図内の属性・操作をクリックすると、下のソースコード該当行へジャンプ＆点滅ハイライトします</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80 hidden sm:inline">UML ⇄ Code Sync</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.classes.map((cls, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border bg-slate-900/80 overflow-hidden shadow-lg transition-all hover:border-cyan-500/60 ${
                    cls.isAbstract ? 'border-amber-500/40' : 'border-slate-700/80'
                  }`}
                >
                  {/* クラス名ヘッダー */}
                  <div className={`p-3.5 text-center border-b font-mono ${
                    cls.isAbstract 
                      ? 'bg-amber-950/40 border-amber-500/30' 
                      : 'bg-slate-800/80 border-slate-700'
                  }`}>
                    {cls.stereotype && (
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                        &laquo;{cls.stereotype}&raquo;
                      </span>
                    )}
                    <h4 className={`text-base font-bold text-white ${cls.isAbstract ? 'italic text-amber-300' : ''}`}>
                      {cls.name}
                    </h4>
                  </div>

                  {/* 属性コンパートメント (Attributes / Member Variables) */}
                  <div className="p-3 border-b border-slate-800/80 bg-slate-950/50 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      Attributes (メンバ変数)
                    </span>
                    {cls.attributes.length > 0 ? (
                      cls.attributes.map((attr, aIdx) => {
                        const isClickable = Boolean(attr.codeLineRef || onSelectMember);
                        return (
                          <div
                            key={aIdx}
                            onClick={() => onSelectMember?.(attr, cls)}
                            className={`text-xs font-mono flex items-center justify-between gap-1.5 leading-snug p-1.5 rounded transition-all ${
                              isClickable
                                ? 'cursor-pointer hover:bg-cyan-950/70 hover:border-cyan-500/40 border border-transparent'
                                : ''
                            }`}
                            title={attr.codeLineRef ? `コード行へジャンプ: ${attr.codeLineRef.filename || ''} L${attr.codeLineRef.line || ''}` : 'クリックしてコード行へジャンプ'}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  attr.visibility === '-' ? 'text-red-400 bg-red-950/80' :
                                  attr.visibility === '+' ? 'text-emerald-400 bg-emerald-950/80' :
                                  'text-amber-400 bg-amber-950/80'
                                }`}
                                title={attr.visibility === '-' ? 'private' : attr.visibility === '+' ? 'public' : 'protected'}
                              >
                                {attr.visibility}
                              </span>
                              <span className="text-slate-200 truncate">{attr.name}</span>
                              <span className="text-slate-500">:</span>
                              <span className="text-cyan-400 truncate">{attr.type}</span>
                            </div>
                            {attr.codeLineRef && (
                              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/70 px-1.5 py-0.2 rounded border border-cyan-700/40 shrink-0">
                                L{attr.codeLineRef.line}
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-slate-600 font-mono italic">（なし / 隠蔽）</span>
                    )}
                  </div>

                  {/* 操作コンパートメント (Operations / Member Functions) */}
                  <div className="p-3 bg-slate-950/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      Operations (メンバ関数)
                    </span>
                    {cls.operations.map((op, oIdx) => {
                      const isClickable = Boolean(op.codeLineRef || onSelectMember);
                      return (
                        <div
                          key={oIdx}
                          onClick={() => onSelectMember?.(op, cls)}
                          className={`text-xs font-mono flex items-center justify-between gap-1.5 leading-snug p-1.5 rounded transition-all ${
                            isClickable
                              ? 'cursor-pointer hover:bg-cyan-950/70 hover:border-cyan-500/40 border border-transparent'
                              : ''
                          }`}
                          title={op.codeLineRef ? `コード行へジャンプ: ${op.codeLineRef.filename || ''} L${op.codeLineRef.line || ''}` : 'クリックしてコード行へジャンプ'}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                op.visibility === '+' ? 'text-emerald-400 bg-emerald-950/80' :
                                op.visibility === '-' ? 'text-red-400 bg-red-950/80' :
                                'text-amber-400 bg-amber-950/80'
                              }`}
                              title={op.visibility === '+' ? 'public' : op.visibility === '-' ? 'private' : 'protected'}
                            >
                              {op.visibility}
                            </span>
                            <span className={`text-slate-200 truncate ${op.isVirtual ? 'italic text-amber-200' : ''}`}>
                              {op.name}
                            </span>
                            <span className="text-slate-500">:</span>
                            <span className="text-cyan-400 truncate">{op.type}</span>
                          </div>
                          {op.codeLineRef && (
                            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/70 px-1.5 py-0.2 rounded border border-cyan-700/40 shrink-0">
                              L{op.codeLineRef.line}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* クラス間の関係性リスト (Relations) */}
            {data.relations && data.relations.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>クラス間の関係性とC++コードの対応仕様</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.relations.map((rel, rIdx) => {
                    const badge = getRelationBadge(rel);
                    return (
                      <div
                        key={rIdx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-center justify-between gap-2 font-mono text-xs">
                          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                            {rel.from}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold border ${badge.color}`}>
                            {badge.symbol}
                          </span>
                          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                            {rel.to}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-sans flex items-baseline justify-between gap-2">
                          <span className="font-semibold text-cyan-300">{badge.label}</span>
                          {rel.label && <span className="text-slate-400">({rel.label})</span>}
                        </div>
                        {rel.cppMapping && (
                          <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                            <code>{rel.cppMapping}</code>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ② シーケンス図モード */}
        {data.diagramType === 'sequence' && data.sequenceMessages && (
          <div className="space-y-4">
            {/* 参加者ヘッダー */}
            {data.sequenceParticipants && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pb-4 border-b border-slate-800">
                {data.sequenceParticipants.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-center font-mono text-xs sm:text-sm font-bold text-cyan-300 shadow-sm"
                  >
                    :{p}
                  </div>
                ))}
              </div>
            )}

            {/* 時系列メッセージリスト */}
            <div className="space-y-2.5 font-mono text-xs">
              {data.sequenceMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-slate-400 font-bold">{msg.from}</span>
                    <span className="text-cyan-400 font-bold">
                      {msg.isReturn ? '- - ->' : '──────>'}
                    </span>
                    <span className="text-slate-400 font-bold">{msg.to}</span>
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {msg.message}
                    </span>
                  </div>
                  {msg.cppCodeSnippet && (
                    <div className="text-[11px] text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                      <code>{msg.cppCodeSnippet}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ③ ステートマシン図モード */}
        {data.diagramType === 'state' && data.stateTransitions && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {data.stateTransitions.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 border border-amber-500/30 font-bold">
                      {st.from}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      {st.to}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-bold">Event:</span>
                      <span className="text-cyan-300 font-bold">{st.event}</span>
                    </div>
                    {st.guard && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold">Guard:</span>
                        <span className="text-amber-300">[{st.guard}]</span>
                      </div>
                    )}
                    {st.action && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold">Action:</span>
                        <span className="text-purple-300">/{st.action}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 💡 設計書とC++コードの対応ポイント解説 (Code Mapping Notes) */}
        {data.codeMappingNotes && data.codeMappingNotes.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>プロの視点：この設計書をC++コードに落とし込む際の着眼点</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
              {data.codeMappingNotes.map((note, nIdx) => (
                <li key={nIdx} className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
