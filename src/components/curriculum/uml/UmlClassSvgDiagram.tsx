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
  const cardWidth = 240;
  const cardHeight = 230;

  // ガイド（5クラス）用の最適レイアウト判定
  const isSpecialGuideLayout =
    classes.some((c) => c.name === "GameEngine") &&
    classes.some((c) => c.name === "Player") &&
    classes.some((c) => c.name === "Weapon");

  // 余裕を持ったキャンバス寸法（横の隙間: 140px、縦の隙間: 110px）
  const totalWidth = isSpecialGuideLayout ? 1080 : Math.max(820, 60 + 3 * (cardWidth + 130));
  const totalHeight = isSpecialGuideLayout ? 670 : Math.max(360, 60 + 2 * (cardHeight + 110));

  // クラス名に基づく座標配置マップ
  const getNodeLayout = (className: string, idx: number): NodeLayout => {
    if (isSpecialGuideLayout) {
      switch (className) {
        case "GameEngine":
          return { x: 40, y: 50, width: cardWidth, height: cardHeight };
        case "Player":
          return { x: 420, y: 50, width: cardWidth, height: cardHeight };
        case "Weapon":
          return { x: 800, y: 50, width: cardWidth, height: cardHeight };
        case "Enemy":
          return { x: 420, y: 390, width: cardWidth, height: cardHeight };
        case "BossEnemy":
          return { x: 800, y: 390, width: cardWidth, height: cardHeight };
        default:
          break;
      }
    }

    // 汎用グリッド配置
    const cols = classes.length <= 2 ? classes.length : 3;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return {
      x: 40 + col * (cardWidth + 140),
      y: 50 + row * (cardHeight + 110),
      width: cardWidth,
      height: cardHeight,
    };
  };

  // 各クラスのレイアウトマップ
  const nodeMap = new Map<string, NodeLayout>();
  classes.forEach((cls, idx) => {
    nodeMap.set(cls.name, getNodeLayout(cls.name, idx));
  });

  return (
    <div className="relative w-full rounded-3xl bg-[#070b14] border border-cyan-500/30 overflow-x-auto shadow-2xl p-4 sm:p-6 backdrop-blur-md">
      <div className="relative mx-auto" style={{ width: totalWidth, height: totalHeight }}>
        {/* 背景SVGレイヤー：すべてのリレーション線・矢印ポリゴン・ラベルを描画 */}
        <svg
          width={totalWidth}
          height={totalHeight}
          className="absolute inset-0 pointer-events-none z-10 overflow-visible"
        >
          {relations.map((rel, rIdx) => {
            const fromNode = nodeMap.get(rel.from);
            const toNode = nodeMap.get(rel.to);
            if (!fromNode || !toNode) return null;

            const fromCenter = {
              x: fromNode.x + fromNode.width / 2,
              y: fromNode.y + fromNode.height / 2,
            };
            const toCenter = {
              x: toNode.x + toNode.width / 2,
              y: toNode.y + toNode.height / 2,
            };

            const dx = toCenter.x - fromCenter.x;
            const dy = toCenter.y - fromCenter.y;
            const isHorizontal = Math.abs(dx) > Math.abs(dy);

            let strokeColor = "#38bdf8"; // sky
            let isDashed = false;
            if (rel.type === "generalization") strokeColor = "#f59e0b"; // amber
            else if (rel.type === "realization") {
              strokeColor = "#a855f7";
              isDashed = true;
            } else if (rel.type === "composition") strokeColor = "#10b981"; // emerald
            else if (rel.type === "aggregation") strokeColor = "#06b6d4"; // cyan

            if (isHorizontal) {
              // 水平方向の接続（左から右、または右から左）
              const isLeftToRight = dx > 0;
              const y = fromCenter.y;

              const x1 = isLeftToRight ? fromNode.x + fromNode.width : fromNode.x;
              const x2 = isLeftToRight ? toNode.x : toNode.x + toNode.width;

              // 線分の開始・終了点（マーカーのサイズ分オフセット）
              let lineStartX = x1;
              let lineEndX = x2;

              let startMarkerElement: React.ReactNode = null;
              let endMarkerElement: React.ReactNode = null;

              if (rel.type === "composition") {
                // 親側に黒塗り菱形 ◆
                if (isLeftToRight) {
                  startMarkerElement = (
                    <polygon
                      points={`${x1},${y} ${x1 + 8},${y - 5} ${x1 + 16},${y} ${x1 + 8},${y + 5}`}
                      fill={strokeColor}
                      stroke={strokeColor}
                      strokeWidth="1.5"
                    />
                  );
                  lineStartX = x1 + 16;
                  // 子側に開いた矢印ヘッド
                  endMarkerElement = (
                    <polyline
                      points={`${x2 - 8},${y - 5} ${x2},${y} ${x2 - 8},${y + 5}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndX = x2 - 2;
                } else {
                  startMarkerElement = (
                    <polygon
                      points={`${x1},${y} ${x1 - 8},${y - 5} ${x1 - 16},${y} ${x1 - 8},${y + 5}`}
                      fill={strokeColor}
                      stroke={strokeColor}
                      strokeWidth="1.5"
                    />
                  );
                  lineStartX = x1 - 16;
                  endMarkerElement = (
                    <polyline
                      points={`${x2 + 8},${y - 5} ${x2},${y} ${x2 + 8},${y + 5}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndX = x2 + 2;
                }
              } else if (rel.type === "aggregation") {
                // 親側に白抜き菱形 ◇
                if (isLeftToRight) {
                  startMarkerElement = (
                    <polygon
                      points={`${x1},${y} ${x1 + 8},${y - 5} ${x1 + 16},${y} ${x1 + 8},${y + 5}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineStartX = x1 + 16;
                  endMarkerElement = (
                    <polyline
                      points={`${x2 - 8},${y - 5} ${x2},${y} ${x2 - 8},${y + 5}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndX = x2 - 2;
                } else {
                  startMarkerElement = (
                    <polygon
                      points={`${x1},${y} ${x1 - 8},${y - 5} ${x1 - 16},${y} ${x1 - 8},${y + 5}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineStartX = x1 - 16;
                  endMarkerElement = (
                    <polyline
                      points={`${x2 + 8},${y - 5} ${x2},${y} ${x2 + 8},${y + 5}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndX = x2 + 2;
                }
              } else if (rel.type === "generalization" || rel.type === "realization") {
                // 基底クラス側に白抜き三角 ◁
                if (isLeftToRight) {
                  endMarkerElement = (
                    <polygon
                      points={`${x2},${y} ${x2 - 14},${y - 7} ${x2 - 14},${y + 7}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineEndX = x2 - 14;
                } else {
                  endMarkerElement = (
                    <polygon
                      points={`${x2},${y} ${x2 + 14},${y - 7} ${x2 + 14},${y + 7}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineEndX = x2 + 14;
                }
              } else {
                // 通常関連 ───>
                if (isLeftToRight) {
                  endMarkerElement = (
                    <polyline
                      points={`${x2 - 8},${y - 5} ${x2},${y} ${x2 - 8},${y + 5}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndX = x2 - 2;
                } else {
                  endMarkerElement = (
                    <polyline
                      points={`${x2 + 8},${y - 5} ${x2},${y} ${x2 + 8},${y + 5}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndX = x2 + 2;
                }
              }

              const midX = (x1 + x2) / 2;
              // ラベルは線より【20px 上】に配置し、線やマーカーと一切重ならない！
              const labelY = y - 20;

              return (
                <g key={`rel-${rIdx}`}>
                  {/* メイン線 */}
                  <line
                    x1={lineStartX}
                    y1={y}
                    x2={lineEndX}
                    y2={y}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray={isDashed ? "6,5" : undefined}
                  />
                  {/* マーカー図形 */}
                  {startMarkerElement}
                  {endMarkerElement}

                  {/* ラベルバッジ（線の上に独立して配置） */}
                  <g transform={`translate(${midX}, ${labelY})`}>
                    <rect
                      x="-35"
                      y="-10"
                      width="70"
                      height="20"
                      rx="6"
                      fill="#0b1120"
                      stroke={strokeColor}
                      strokeWidth="1.2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {rel.label || rel.type}
                    </text>
                  </g>
                </g>
              );
            } else {
              // 垂直方向の接続（上から下、または下から上）
              const isTopToBottom = dy > 0;
              const x = fromCenter.x;

              const y1 = isTopToBottom ? fromNode.y + fromNode.height : fromNode.y;
              const y2 = isTopToBottom ? toNode.y : toNode.y + toNode.height;

              let lineStartY = y1;
              let lineEndY = y2;
              let endMarkerElement: React.ReactNode = null;

              if (rel.type === "generalization" || rel.type === "realization") {
                if (isTopToBottom) {
                  endMarkerElement = (
                    <polygon
                      points={`${x},${y2} ${x - 7},${y2 - 14} ${x + 7},${y2 - 14}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineEndY = y2 - 14;
                } else {
                  endMarkerElement = (
                    <polygon
                      points={`${x},${y2} ${x - 7},${y2 + 14} ${x + 7},${y2 + 14}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineEndY = y2 + 14;
                }
              } else {
                if (isTopToBottom) {
                  endMarkerElement = (
                    <polyline
                      points={`${x - 5},${y2 - 8} ${x},${y2} ${x + 5},${y2 - 8}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndY = y2 - 2;
                } else {
                  endMarkerElement = (
                    <polyline
                      points={`${x - 5},${y2 + 8} ${x},${y2} ${x + 5},${y2 + 8}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                  lineEndY = y2 + 2;
                }
              }

              const midY = (y1 + y2) / 2;

              return (
                <g key={`rel-${rIdx}`}>
                  {/* メイン線 */}
                  <line
                    x1={x}
                    y1={lineStartY}
                    x2={x}
                    y2={lineEndY}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray={isDashed ? "6,5" : undefined}
                  />
                  {endMarkerElement}

                  {/* ラベルバッジ（垂直線の中央にソリッドな背景で重ねる） */}
                  <g transform={`translate(${x}, ${midY})`}>
                    <rect
                      x="-40"
                      y="-11"
                      width="80"
                      height="22"
                      rx="7"
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="1.2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {rel.label || rel.type}
                    </text>
                  </g>
                </g>
              );
            }
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