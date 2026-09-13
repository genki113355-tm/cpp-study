import React, { useState } from "react";
import {
  UmlDiagramDoc,
  UmlRelation,
  UmlClassMember,
  UmlClassItem,
  CodeFile,
  CodeHighlightTarget,
} from "../../types/curriculum";
import { Layers, Share2, Sparkles, CheckCircle } from "lucide-react";
import { UmlClassSvgDiagram } from "./uml/UmlClassSvgDiagram";
import { UmlCodeInspector } from "./uml/UmlCodeInspector";
import { UmlSequenceSvgDiagram } from "./uml/UmlSequenceSvgDiagram";
import { UmlStateSvgDiagram } from "./uml/UmlStateSvgDiagram";

interface UmlDiagramViewerProps {
  data: UmlDiagramDoc;
  codeFiles?: CodeFile[];
  onSelectMember?: (member: UmlClassMember, cls: UmlClassItem) => void;
  onJumpToEditor?: (target: CodeHighlightTarget) => void;
}

export const UmlDiagramViewer: React.FC<UmlDiagramViewerProps> = ({
  data,
  codeFiles = [],
  onSelectMember,
  onJumpToEditor,
}) => {
  const [selectedMemberInfo, setSelectedMemberInfo] = useState<{
    member: UmlClassMember;
    cls: UmlClassItem;
  } | null>(null);

  const handleSelectMember = (member: UmlClassMember, cls: UmlClassItem) => {
    setSelectedMemberInfo({ member, cls });
    onSelectMember?.(member, cls);
  };

  const getRelationBadge = (relation: UmlRelation) => {
    switch (relation.type) {
      case "composition":
        return {
          symbol: "◆──>",
          label: "コンポジション (強固な所有・寿命連動)",
          color: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
        };
      case "aggregation":
        return {
          symbol: "◇──>",
          label: "集約 (共有所有・寿命独立)",
          color: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
        };
      case "generalization":
        return {
          symbol: "◁───",
          label: "汎化・継承 (is-a 関係)",
          color: "bg-amber-950 text-amber-300 border-amber-500/40",
        };
      case "realization":
        return {
          symbol: "◁- - -",
          label: "実現 (インターフェース実装)",
          color: "bg-purple-950 text-purple-300 border-purple-500/40",
        };
      case "association":
      default:
        return {
          symbol: "───>",
          label: "関連 (単なる参照・利用)",
          color: "bg-slate-900 text-slate-300 border-slate-700",
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
              {data.diagramType === "class" && "UML CLASS DIAGRAM : クラス設計図 (幾何描画)"}
              {data.diagramType === "sequence" && "UML SEQUENCE DIAGRAM : 時系列呼び出し設計図 (幾何描画)"}
              {data.diagramType === "state" && "UML STATE MACHINE : 状態遷移設計図 (幾何描画)"}
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
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1.5 rounded-xl border border-cyan-500/30 self-start sm:self-auto shadow-sm">
          幾何ベクトル描画 ＆ C++コード並列同期
        </span>
      </div>

      {/* 設計書の概要リード */}
      <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
        {data.description}
      </div>

      {/* メインダイアグラム表示エリア */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* ① クラス図モード：SVG幾何パス＋HTMLコンパートメント */}
        {data.diagramType === "class" && data.classes && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-2.5 rounded-xl">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>💡 クラス図内の属性・操作をクリックすると、画面左端（サイドメニュー上）にC++コードが並んでポップアップします</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80 hidden sm:inline">UML ↔ Floating Inspector</span>
            </div>

            {/* 幾何座標計算によるSVGクラス図 */}
            <UmlClassSvgDiagram
              classes={data.classes}
              relations={data.relations || []}
              selectedMember={selectedMemberInfo?.member}
              selectedClass={selectedMemberInfo?.cls}
              onSelectMember={handleSelectMember}
            />

            {/* クラス図に重ねず、画面左端（サイドメニュー上）にフロートするC++コードインスペクタ */}
            {selectedMemberInfo && (
              <UmlCodeInspector
                member={selectedMemberInfo.member}
                cls={selectedMemberInfo.cls}
                codeFiles={codeFiles}
                onClose={() => setSelectedMemberInfo(null)}
                onJumpToEditor={onJumpToEditor}
              />
            )}

            {/* クラス間の関係性リスト (Relations & C++ Mapping) */}
            {data.relations && data.relations.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>各リレーションのUML記号 ＆ C++実装仕様対応表</span>
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

        {/* ② シーケンス図モード：SVG座標計算ライフライン＆メッセージ水平線 */}
        {data.diagramType === "sequence" && (
          <div className="space-y-4">
            <UmlSequenceSvgDiagram
              participants={data.sequenceParticipants || ["MainLoop", "Player", "Bullet"]}
              messages={data.sequenceMessages || []}
            />
          </div>
        )}

        {/* ③ ステートマシン図モード：SVG状態ノード＆曲線遷移パス */}
        {data.diagramType === "state" && (
          <div className="space-y-4">
            <UmlStateSvgDiagram
              transitions={data.stateTransitions}
            />
          </div>
        )}

        {/* ④ 設計書とC++コードの対応ポイント解説 (Code Mapping Notes) */}
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
