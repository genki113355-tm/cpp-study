import React from "react";
import { UmlClassItem, UmlRelation, UmlClassMember } from "../../../types/curriculum";

interface UmlClassSvgDiagramProps {
  classes: UmlClassItem[];
  relations: UmlRelation[];
  onSelectMember?: (member: UmlClassMember, cls: UmlClassItem) => void;
}

interface NodeLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const UmlClassSvgDiagram: React.FC<UmlClassSvgDiagramProps> = ({
  classes,
  relations,
  onSelectMember,
}) => {
  // クラスボックスの基本寸法
  const cardWidth = 250;
  const cardHeight = 230;
  const colGap = 80;
  const rowGap = 70;

  // クラス数に応じた列数とキャンバスサイズの自動算出
  const isSpecialGuideLayout =
    classes.some((c) => c.name === "GameEngine") &&
    classes.some((c) => c.name === "Player") &&
    classes.some((c) => c.name === "Weapon");

  const cols = classes.length <= 2 ? classes.length : 3;
  const rows = Math.ceil(classes.length / cols);

  const totalWidth = isSpecialGuideLayout ? 1000 : Math.max(760, 60 + cols * (cardWidth + colGap));
  const totalHeight = isSpecialGuideLayout ? 640 : Math.max(340, 50 + rows * (cardHeight + rowGap));

  // クラス名に基づく固定/スマート座標配置マップ
  const getNodeLayout = (className: string, idx: number): NodeLayout => {
    if (isSpecialGuideLayout) {
      switch (className) {
        case "GameEngine":
          return { x: 50, y: 50, width: cardWidth, height: cardHeight };
        case "Player":
          return { x: 380, y: 50, width: cardWidth, height: cardHeight };
        case "Weapon":
          return { x: 710, y: 50, width: cardWidth, height: cardHeight };
        case "Enemy":
          return { x: 380, y: 350, width: cardWidth, height: cardHeight };
        case "BossEnemy":
          return { x: 710, y: 350, width: cardWidth, height: cardHeight };
        default:
          break;
      }
    }

    // 汎用グリッド配置
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return {
      x: 50 + col * (cardWidth + colGap),
      y: 50 + row * (cardHeight + rowGap),
      width: cardWidth,
      height: cardHeight,
    };
  };

  // 各クラスのレイアウトマップ
  const nodeMap = new Map<string, NodeLayout>();
  classes.forEach((cls, idx) => {
    nodeMap.set(cls.name, getNodeLayout(cls.name, idx));
  });

  // 2つのノード間の最適な接続点（ポート）と直交/直線パスを計算
  const calculateConnection = (fromNode: NodeLayout, toNode: NodeLayout) => {
    const fromCenter = { x: fromNode.x + fromNode.width / 2, y: fromNode.y + fromNode.height / 2 };
    const toCenter = { x: toNode.x + toNode.width / 2, y: toNode.y + toNode.height / 2 };

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    let startX = fromCenter.x;
    let startY = fromCenter.y;
    let endX = toCenter.x;
    let endY = toCenter.y;

    // 主たる方向（水平 vs 垂直）判定
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        startX = fromNode.x + fromNode.width;
        endX = toNode.x;
      } else {
        startX = fromNode.x;
        endX = toNode.x + toNode.width;
      }
      startY = fromCenter.y;
      endY = toCenter.y;
    } else {
      if (dy > 0) {
        startY = fromNode.y + fromNode.height;
        endY = toNode.y;
      } else {
        startY = fromNode.y;
        endY = toNode.y + toNode.height;
      }
      startX = fromCenter.x;
      endX = toCenter.x;
    }

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

    return { startX, startY, endX, endY, midX, midY, pathData };
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#070b14] border border-cyan-500/30 overflow-x-auto shadow-2xl p-4 sm:p-6 backdrop-blur-md">
      <div className="relative mx-auto" style={{ width: totalWidth, height: totalHeight }}>
        {/* 背景SVGレイヤー：すべてのリレーション線とUML幾何マーカーを描画 */}
        <svg
          width={totalWidth}
          height={totalHeight}
          className="absolute inset-0 pointer-events-none z-10 overflow-visible"
        >
          <defs>
            {/* 白抜き三角マーカー (汎化・継承) */}
            <marker
              id="class-marker-triangle"
              viewBox="0 0 16 16"
              refX="15"
              refY="8"
              markerWidth="14"
              markerHeight="14"
              orient="auto-start-reverse"
            >
              <polygon points="1 1, 15 8, 1 15" fill="#070b14" stroke="#f59e0b" strokeWidth="2" />
            </marker>

            {/* 黒塗り菱形マーカー (コンポジション) */}
            <marker
              id="class-marker-composition"
              viewBox="0 0 20 12"
              refX="1"
              refY="6"
              markerWidth="16"
              markerHeight="12"
              orient="auto"
            >
              <polygon points="1 6, 10 1, 19 6, 10 11" fill="#10b981" stroke="#10b981" strokeWidth="1" />
            </marker>

            {/* 白抜き菱形マーカー (集約) */}
            <marker
              id="class-marker-aggregation"
              viewBox="0 0 20 12"
              refX="1"
              refY="6"
              markerWidth="16"
              markerHeight="12"
              orient="auto"
            >
              <polygon points="1 6, 10 1, 19 6, 10 11" fill="#070b14" stroke="#06b6d4" strokeWidth="2" />
            </marker>

            {/* 開いた矢印マーカー (関連) */}
            <marker
              id="class-marker-arrow"
              viewBox="0 0 12 12"
              refX="10"
              refY="6"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <polyline
                points="2 1, 10 6, 2 11"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {/* 各リレーションの幾何ベクトル線 */}
          {relations.map((rel, rIdx) => {
            const fromNode = nodeMap.get(rel.from);
            const toNode = nodeMap.get(rel.to);
            if (!fromNode || !toNode) return null;

            const conn = calculateConnection(fromNode, toNode);

            // 線のスタイル & 色
            let strokeColor = "#38bdf8";
            let markerStart: string | undefined;
            let markerEnd: string | undefined;
            let isDashed = false;

            switch (rel.type) {
              case "generalization":
                strokeColor = "#f59e0b"; // amber
                markerEnd = "url(#class-marker-triangle)";
                break;
              case "realization":
                strokeColor = "#a855f7"; // purple
                markerEnd = "url(#class-marker-triangle)";
                isDashed = true;
                break;
              case "composition":
                strokeColor = "#10b981"; // emerald
                markerStart = "url(#class-marker-composition)";
                markerEnd = "url(#class-marker-arrow)";
                break;
              case "aggregation":
                strokeColor = "#06b6d4"; // cyan
                markerStart = "url(#class-marker-aggregation)";
                markerEnd = "url(#class-marker-arrow)";
                break;
              case "association":
              default:
                strokeColor = "#38bdf8"; // sky
                markerEnd = "url(#class-marker-arrow)";
                break;
            }

            return (
              <g key={`rel-${rIdx}`}>
                {/* 影・グロー効果 */}
                <path
                  d={conn.pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="6"
                  opacity="0.2"
                  strokeLinecap="round"
                />
                {/* メインの接続線 */}
                <path
                  d={conn.pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeDasharray={isDashed ? "6,5" : undefined}
                  markerStart={markerStart}
                  markerEnd={markerEnd}
                />
                {/* ラベル & 多重度 */}
                <g transform={`translate(${conn.midX}, ${conn.midY - 14})`}>
                  <rect
                    x="-45"
                    y="-10"
                    width="90"
                    height="20"
                    rx="6"
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {rel.label || rel.type}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* 前面HTMLレイヤー：クリック可能なクラスボックスコンパートメント */}
        {classes.map((cls) => {
          const layout = nodeMap.get(cls.name);
          if (!layout) return null;

          return (
            <div
              key={cls.name}
              className={`absolute rounded-2xl border bg-slate-900/95 overflow-hidden shadow-2xl transition-all duration-200 hover:scale-[1.02] hover:z-30 z-20 ${
                cls.isAbstract
                  ? "border-amber-500/60 shadow-amber-950/30"
                  : "border-slate-700/80 hover:border-cyan-500/70"
              }`}
              style={{
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
              }}
            >
              {/* 1段目：クラス名ヘッダー */}
              <div
                className={`p-2.5 text-center border-b font-mono ${
                  cls.isAbstract
                    ? "bg-amber-950/40 border-amber-500/40"
                    : "bg-slate-800/90 border-slate-700"
                }`}
              >
                {cls.stereotype && (
                  <span className="text-[9px] text-cyan-300 block uppercase tracking-wider font-sans">
                    &laquo;{cls.stereotype}&raquo;
                  </span>
                )}
                <h4
                  className={`text-sm font-bold text-white ${
                    cls.isAbstract ? "italic text-amber-300" : ""
                  }`}
                >
                  {cls.name}
                </h4>
              </div>

              {/* 2段目：属性 (Attributes) */}
              <div className="p-2 border-b border-slate-800/80 bg-slate-950/60 space-y-1 h-[84px] overflow-y-auto">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                  Attributes
                </span>
                {cls.attributes.length > 0 ? (
                  cls.attributes.map((attr, aIdx) => (
                    <div
                      key={aIdx}
                      onClick={() => onSelectMember?.(attr, cls)}
                      className="text-[11px] font-mono flex items-center justify-between gap-1 p-0.5 rounded cursor-pointer hover:bg-cyan-950/80 transition-colors"
                      title={attr.codeLineRef ? `コード行へジャンプ: L${attr.codeLineRef.line}` : undefined}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span
                          className={`w-3 h-3 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                            attr.visibility === "-"
                              ? "text-red-400 bg-red-950"
                              : attr.visibility === "+"
                              ? "text-emerald-400 bg-emerald-950"
                              : "text-amber-400 bg-amber-950"
                          }`}
                        >
                          {attr.visibility}
                        </span>
                        <span className="text-slate-200 truncate">{attr.name}</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-cyan-400 truncate">{attr.type}</span>
                      </div>
                      {attr.codeLineRef && (
                        <span className="text-[9px] text-cyan-400 font-mono shrink-0">
                          L{attr.codeLineRef.line}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-600 italic">（なし）</span>
                )}
              </div>

              {/* 3段目：操作 (Operations) */}
              <div className="p-2 bg-slate-950/30 space-y-1 h-[86px] overflow-y-auto">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                  Operations
                </span>
                {cls.operations.map((op, oIdx) => (
                  <div
                    key={oIdx}
                    onClick={() => onSelectMember?.(op, cls)}
                    className="text-[11px] font-mono flex items-center justify-between gap-1 p-0.5 rounded cursor-pointer hover:bg-cyan-950/80 transition-colors"
                    title={op.codeLineRef ? `コード行へジャンプ: L${op.codeLineRef.line}` : undefined}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <span
                        className={`w-3 h-3 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          op.visibility === "+"
                            ? "text-emerald-400 bg-emerald-950"
                            : op.visibility === "-"
                            ? "text-red-400 bg-red-950"
                            : "text-amber-400 bg-amber-950"
                        }`}
                      >
                        {op.visibility}
                      </span>
                      <span
                        className={`text-slate-200 truncate ${
                          op.isVirtual ? "italic text-amber-200" : ""
                        }`}
                      >
                        {op.name}
                      </span>
                      <span className="text-slate-500">:</span>
                      <span className="text-cyan-400 truncate">{op.type}</span>
                    </div>
                    {op.codeLineRef && (
                      <span className="text-[9px] text-cyan-400 font-mono shrink-0">
                        L{op.codeLineRef.line}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

