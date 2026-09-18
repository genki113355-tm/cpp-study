import React from "react";
import { UmlStateTransition } from "../../../types/curriculum";

interface UmlStateSvgDiagramProps {
  transitions?: UmlStateTransition[];
  title?: string;
  subtitle?: string;
}

interface StateNode {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  stereotype?: string;
}

export const UmlStateSvgDiagram: React.FC<UmlStateSvgDiagramProps> = ({
  transitions = [],
  title,
  subtitle,
}) => {
  // 標準的なゲームステートノードの座標レイアウト
  // ViewBox: 800 x 360
  const svgWidth = 840;
  const svgHeight = 360;

  const stateNodes: Record<string, StateNode> = {
    Title: {
      name: "Title",
      x: 100,
      y: 120,
      width: 140,
      height: 64,
      color: "#38bdf8", // sky
    },
    Playing: {
      name: "Playing",
      x: 350,
      y: 120,
      width: 150,
      height: 64,
      color: "#10b981", // emerald
    },
    Pause: {
      name: "Pause",
      x: 350,
      y: 260,
      width: 150,
      height: 60,
      color: "#a855f7", // purple
    },
    GameOver: {
      name: "GameOver",
      x: 620,
      y: 120,
      width: 150,
      height: 64,
      color: "#ef4444", // red
    },
  };

  return (
    <div className="w-full max-w-full my-6 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl p-4 sm:p-6 overflow-x-auto backdrop-blur-md">
      {(title || subtitle) && (
        <div className="border-b border-slate-800 pb-4 mb-4">
          {title && <h4 className="text-lg sm:text-xl font-bold text-white font-mono">{title}</h4>}
          {subtitle && <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="min-w-[780px] flex justify-center">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="overflow-visible"
        >
          <defs>
            <marker
              id="state-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <polygon points="0 1, 9 5, 0 9" fill="#06b6d4" />
            </marker>
            <marker
              id="state-arrow-return"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <polygon points="0 1, 9 5, 0 9" fill="#a855f7" />
            </marker>
          </defs>

          {/* 1. 開始疑似状態 (Initial Pseudo-State: 黒丸 ●) */}
          <circle cx="40" cy="152" r="12" fill="#38bdf8" />
          <circle cx="40" cy="152" r="16" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.4" />
          {/* 開始からTitleへの矢印 */}
          <line
            x1="56"
            y1="152"
            x2="95"
            y2="152"
            stroke="#38bdf8"
            strokeWidth="2"
            markerEnd="url(#state-arrow)"
          />

          {/* 2. 遷移パス (ベジェ曲線と直線) */}

          {/* Title -> Playing */}
          <path
            d="M 240 152 L 342 152"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            markerEnd="url(#state-arrow)"
          />
          <text
            x="290"
            y="142"
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            スペースキー押下
          </text>

          {/* Playing -> GameOver */}
          <path
            d="M 500 152 L 612 152"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            markerEnd="url(#state-arrow)"
          />
          <text
            x="556"
            y="136"
            textAnchor="middle"
            fill="#fca5a5"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            被弾時
          </text>
          <text
            x="556"
            y="148"
            textAnchor="middle"
            fill="#f87171"
            fontSize="9"
            fontFamily="monospace"
          >
            [m_hp &lt;= 0]
          </text>

          {/* Playing -> Pause (下向きカーブ) */}
          <path
            d="M 400 184 Q 380 220 400 252"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.5"
            markerEnd="url(#state-arrow-return)"
          />
          <text
            x="360"
            y="222"
            textAnchor="middle"
            fill="#d8b4fe"
            fontSize="9"
            fontFamily="monospace"
          >
            Pキー押下
          </text>

          {/* Pause -> Playing (上向きカーブ) */}
          <path
            d="M 450 260 Q 470 220 450 192"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#state-arrow)"
          />
          <text
            x="490"
            y="222"
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="9"
            fontFamily="monospace"
          >
            Pキー再開
          </text>

          {/* GameOver -> Title (リトライ：上部を大きく周回するアーチ曲線) */}
          <path
            d="M 695 120 C 695 40, 170 40, 170 112"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="6,4"
            markerEnd="url(#state-arrow)"
          />
          <text
            x="430"
            y="44"
            textAnchor="middle"
            fill="#fcd34d"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Rキー押下 / リトライ
          </text>

          {/* 3. 状態ノード (丸角矩形) */}
          {Object.values(stateNodes).map((node) => (
            <g key={node.name} className="transition-all hover:scale-105 origin-center">
              {/* 外枠 */}
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx="14"
                fill="#0f172a"
                stroke={node.color}
                strokeWidth="2"
                filter="drop-shadow(0 6px 10px rgba(0,0,0,0.5))"
              />
              {/* 区切り線 */}
              <line
                x1={node.x}
                y1={node.y + 26}
                x2={node.x + node.width}
                y2={node.y + 26}
                stroke="#334155"
                strokeWidth="1"
              />
              {/* 状態名 */}
              <text
                x={node.x + node.width / 2}
                y={node.y + 18}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {node.name}
              </text>
              {/* 内部アクション / 振る舞い */}
              <text
                x={node.x + 12}
                y={node.y + 44}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
              >
                entry / enterState()
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 状態遷移表（トランジションリスト）の付記 */}
      {transitions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-mono font-bold text-slate-400 block mb-2 uppercase tracking-wider">
            状態遷移仕様一覧 (Events &amp; Guards)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
            {transitions.map((t, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="text-cyan-400">{t.from}</span>
                  <span className="text-slate-500">──&gt;</span>
                  <span className="text-emerald-400">{t.to}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-500">Evt: </span>{t.event}
                </div>
                {t.guard && (
                  <div className="text-[10px] text-amber-300">
                    <span className="text-slate-500">Grd: </span>[{t.guard}]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

