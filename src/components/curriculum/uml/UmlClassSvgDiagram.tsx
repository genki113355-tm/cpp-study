import React, { useMemo } from "react";
import {
  UmlClassItem,
  UmlRelation,
  UmlClassMember,
} from "../../../types/curriculum";

interface UmlClassSvgDiagramProps {
  classes: UmlClassItem[];
  relations: UmlRelation[];
  selectedMember?: UmlClassMember | null;
  selectedClass?: UmlClassItem | null;
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
  selectedMember,
  selectedClass,
  onSelectMember,
}) => {

  // クラスボックスの基本寸法（300pxで長い型名や引数付きメソッドも余裕を持って収める）
  const cardWidth = 300;
  const colSpacing = 130;
  const rowGap = 130;

  // ガイド（5クラス）用の最適レイアウト判定
  const isSpecialGuideLayout =
    classes.some((c) => c.name === "GameEngine") &&
    classes.some((c) => c.name === "Player") &&
    classes.some((c) => c.name === "Weapon");

  // 各クラスの必要高さを動的計算
  const calculateClassCardHeight = (cls: UmlClassItem) => {
    const headerH = cls.stereotype ? 58 : 46;
    const attrCount = cls.attributes.length;
    const attrH = 24 + (attrCount > 0 ? attrCount * 28 : 24) + 12;
    const opCount = cls.operations.length;
    const opH = 24 + (opCount > 0 ? opCount * 28 : 24) + 12;
    return headerH + attrH + opH + 16;
  };

  // スペシャルガイド用の行高さ計算
  const guideRow0Classes = classes.filter((c) =>
    ["GameEngine", "Player", "Weapon"].includes(c.name)
  );
  const guideRow1Classes = classes.filter((c) =>
    ["Enemy", "BossEnemy"].includes(c.name)
  );
  const guideRow0Height = Math.max(
    240,
    ...(guideRow0Classes.length > 0
      ? guideRow0Classes.map(calculateClassCardHeight)
      : [240])
  );
  const guideRow1Height = Math.max(
    240,
    ...(guideRow1Classes.length > 0
      ? guideRow1Classes.map(calculateClassCardHeight)
      : [240])
  );

  // 汎用グリッド配置用の計算
  const cols = classes.length <= 2 ? classes.length : 3;
  const rowCount = Math.ceil(classes.length / cols);
  const rowHeights: number[] = [];

  for (let r = 0; r < rowCount; r++) {
    const classesInThisRow = classes.slice(r * cols, (r + 1) * cols);
    const maxH = Math.max(
      240,
      ...classesInThisRow.map(calculateClassCardHeight)
    );
    rowHeights.push(maxH);
  }

  const rowYPositions: number[] = [];
  let curY = 50;
  for (let r = 0; r < rowCount; r++) {
    rowYPositions.push(curY);
    curY += rowHeights[r] + rowGap;
  }

  // キャンバス寸法（横幅・縦幅）
  const totalWidth = isSpecialGuideLayout
    ? 40 + 3 * cardWidth + 2 * colSpacing + 40 // 1260px
    : Math.max(840, 40 + cols * cardWidth + (cols - 1) * colSpacing + 40);

  // ポップアップが収まる十分な高さを確保
  const totalHeight = Math.max(
    480,
    isSpecialGuideLayout
      ? 50 + guideRow0Height + rowGap + guideRow1Height + 60
      : curY - rowGap + 60
  );

  // クラス名に基づく座標配置マップ
  const getNodeLayout = (className: string, idx: number): NodeLayout => {
    if (isSpecialGuideLayout) {
      const x0 = 40;
      const x1 = 40 + cardWidth + colSpacing;
      const x2 = 40 + 2 * (cardWidth + colSpacing);
      const y0 = 50;
      const y1 = 50 + guideRow0Height + rowGap;

      switch (className) {
        case "GameEngine":
          return { x: x0, y: y0, width: cardWidth, height: guideRow0Height };
        case "Player":
          return { x: x1, y: y0, width: cardWidth, height: guideRow0Height };
        case "Weapon":
          return { x: x2, y: y0, width: cardWidth, height: guideRow0Height };
        case "Enemy":
          return { x: x1, y: y1, width: cardWidth, height: guideRow1Height };
        case "BossEnemy":
          return { x: x2, y: y1, width: cardWidth, height: guideRow1Height };
        default:
          break;
      }
    }

    // 汎用グリッド配置
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return {
      x: 40 + col * (cardWidth + colSpacing),
      y: rowYPositions[row],
      width: cardWidth,
      height: rowHeights[row],
    };
  };

  // 各クラスのレイアウトマップ
  const nodeMap = useMemo(() => {
    const map = new Map<string, NodeLayout>();
    classes.forEach((cls, idx) => {
      map.set(cls.name, getNodeLayout(cls.name, idx));
    });
    return map;
  }, [classes, totalWidth, totalHeight]);



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
            // 同じ行にある場合は水平接続、行が異なる場合は垂直／ステップ接続
            const isHorizontal = Math.abs(fromNode.y - toNode.y) < 30;

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
                // 白抜き三角 ◁───
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
                      x="-38"
                      y="-10"
                      width="76"
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
              // 垂直／ステップ接続（異なる行間）
              const isTopToBottom = dy > 0;
              const x1 = fromCenter.x;
              const x2 = toCenter.x;
              const y1 = isTopToBottom ? fromNode.y + fromNode.height : fromNode.y;
              const y2 = isTopToBottom ? toNode.y : toNode.y + toNode.height;

              let lineStartY = y1;
              let lineEndY = y2;
              let endMarkerElement: React.ReactNode = null;

              if (rel.type === "generalization" || rel.type === "realization") {
                if (isTopToBottom) {
                  endMarkerElement = (
                    <polygon
                      points={`${x2},${y2} ${x2 - 7},${y2 - 14} ${x2 + 7},${y2 - 14}`}
                      fill="#070b14"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  );
                  lineEndY = y2 - 14;
                } else {
                  endMarkerElement = (
                    <polygon
                      points={`${x2},${y2} ${x2 - 7},${y2 + 14} ${x2 + 7},${y2 + 14}`}
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
                      points={`${x2 - 5},${y2 - 8} ${x2},${y2} ${x2 + 5},${y2 - 8}`}
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
                      points={`${x2 - 5},${y2 + 8} ${x2},${y2} ${x2 + 5},${y2 + 8}`}
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
              const isStraight = Math.abs(x1 - x2) < 5;
              const pathD = isStraight
                ? `M ${x1} ${lineStartY} V ${lineEndY}`
                : `M ${x1} ${lineStartY} V ${midY} H ${x2} V ${lineEndY}`;

              const labelX = (x1 + x2) / 2;

              return (
                <g key={`rel-${rIdx}`}>
                  {/* メイン線（直角ステップまたは垂直直線） */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray={isDashed ? "6,5" : undefined}
                  />
                  {endMarkerElement}

                  {/* ラベルバッジ */}
                  <g transform={`translate(${labelX}, ${midY})`}>
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
              className={`absolute rounded-2xl border bg-slate-900/95 shadow-2xl transition-all duration-200 hover:scale-[1.01] hover:z-30 z-20 flex flex-col overflow-hidden ${
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
                className={`p-2.5 text-center border-b font-mono shrink-0 ${
                  cls.isAbstract
                    ? "bg-amber-950/40 border-amber-500/40"
                    : "bg-slate-800/90 border-slate-700"
                }`}
              >
                {cls.stereotype && (
                  <span className="text-[9.5px] text-cyan-300 block uppercase tracking-wider font-sans font-bold">
                    &laquo;{cls.stereotype}&raquo;
                  </span>
                )}
                <h4
                  className={`text-sm font-bold text-white tracking-wide ${
                    cls.isAbstract ? "italic text-amber-300" : ""
                  }`}
                >
                  {cls.name}
                </h4>
              </div>

              {/* 2段目：属性 (Attributes) */}
              <div className="p-2.5 border-b border-slate-800/80 bg-slate-950/60 space-y-1 shrink-0">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                  Attributes
                </span>
                {cls.attributes.length > 0 ? (
                  cls.attributes.map((attr, aIdx) => {
                    const isSelected =
                      selectedClass?.name === cls.name &&
                      selectedMember?.name === attr.name;

                    return (
                      <div
                        key={aIdx}
                        onClick={() => onSelectMember?.(attr, cls)}
                        className={`text-[11px] font-mono flex items-center justify-between gap-1.5 px-1.5 py-1 rounded-lg cursor-pointer transition-all group ${
                          isSelected
                            ? "bg-cyan-950/90 border border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400"
                            : "hover:bg-cyan-950/80 hover:border-cyan-500/40 border border-transparent"
                        }`}
                        title={
                          attr.codeLineRef
                            ? `クリックでC++実装（L${attr.codeLineRef.line}）を並列表示`
                            : `クリックでメンバ詳細を並列表示`
                        }
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                              attr.visibility === "-"
                                ? "text-red-400 bg-red-950/90 border border-red-800/50"
                                : attr.visibility === "+"
                                ? "text-emerald-400 bg-emerald-950/90 border border-emerald-800/50"
                                : "text-amber-400 bg-amber-950/90 border border-amber-800/50"
                            }`}
                          >
                            {attr.visibility}
                          </span>
                          <span
                            className={`font-medium transition-colors shrink-0 ${
                              isSelected
                                ? "text-cyan-200 font-bold"
                                : "text-slate-200 group-hover:text-cyan-200"
                            }`}
                          >
                            {attr.name}
                          </span>
                          <span className="text-slate-500 shrink-0">:</span>
                          <span className="text-cyan-400 font-normal truncate group-hover:text-cyan-300">
                            {attr.type}
                          </span>
                        </div>
                        {attr.codeLineRef && (
                          <span
                            className={`text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded border transition-all flex items-center gap-1 ${
                              isSelected
                                ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400"
                                : "bg-cyan-950/60 text-cyan-400 border-cyan-800/40 group-hover:bg-cyan-900 group-hover:border-cyan-400"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                            )}
                            <span>L{attr.codeLineRef.line}</span>
                            {isSelected && <span>表示中</span>}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[10px] text-slate-600 italic block py-0.5">（なし）</span>
                )}
              </div>

              {/* 3段目：操作 (Operations) */}
              <div className="p-2.5 bg-slate-950/30 space-y-1 flex-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                  Operations
                </span>
                {cls.operations.length > 0 ? (
                  cls.operations.map((op, oIdx) => {
                    const isSelected =
                      selectedClass?.name === cls.name &&
                      selectedMember?.name === op.name;

                    return (
                      <div
                        key={oIdx}
                        onClick={() => onSelectMember?.(op, cls)}
                        className={`text-[11px] font-mono flex items-center justify-between gap-1.5 px-1.5 py-1 rounded-lg cursor-pointer transition-all group ${
                          isSelected
                            ? "bg-cyan-950/90 border border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400"
                            : "hover:bg-cyan-950/80 hover:border-cyan-500/40 border border-transparent"
                        }`}
                        title={
                          op.codeLineRef
                            ? `クリックでC++実装（L${op.codeLineRef.line}）を並列表示`
                            : `クリックでメンバ詳細を並列表示`
                        }
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                              op.visibility === "+"
                                ? "text-emerald-400 bg-emerald-950/90 border border-emerald-800/50"
                                : op.visibility === "-"
                                ? "text-red-400 bg-red-950/90 border border-red-800/50"
                                : "text-amber-400 bg-amber-950/90 border border-amber-800/50"
                            }`}
                          >
                            {op.visibility}
                          </span>
                          <span
                            className={`font-medium transition-colors shrink-0 ${
                              isSelected
                                ? "text-cyan-200 font-bold"
                                : "text-slate-200 group-hover:text-cyan-200"
                            } ${op.isVirtual ? "italic text-amber-200" : ""}`}
                          >
                            {op.name}
                          </span>
                          <span className="text-slate-500 shrink-0">:</span>
                          <span className="text-cyan-400 font-normal truncate group-hover:text-cyan-300">
                            {op.type}
                          </span>
                        </div>
                        {op.codeLineRef && (
                          <span
                            className={`text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded border transition-all flex items-center gap-1 ${
                              isSelected
                                ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400"
                                : "bg-cyan-950/60 text-cyan-400 border-cyan-800/40 group-hover:bg-cyan-900 group-hover:border-cyan-400"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                            )}
                            <span>L{op.codeLineRef.line}</span>
                            {isSelected && <span>表示中</span>}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[10px] text-slate-600 italic block py-0.5">（なし）</span>
                )}
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
};