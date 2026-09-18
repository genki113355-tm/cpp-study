import React from "react";
import { UmlSequenceMessage } from "../../../types/curriculum";

interface UmlSequenceSvgDiagramProps {
  participants: string[];
  messages: UmlSequenceMessage[];
  title?: string;
  subtitle?: string;
}

export const UmlSequenceSvgDiagram: React.FC<UmlSequenceSvgDiagramProps> = ({
  participants,
  messages,
  title,
  subtitle,
}) => {
  // レイアウト幾何パラメータの計算
  const participantWidth = 140;
  const participantHeight = 44;
  const colSpacing = 220; // 参加者間の横幅ピッチ
  const startX = 100;
  const startY = 40;
  const messagePitchY = 70; // 1メッセージあたりの縦ピッチ
  const totalWidth = Math.max(760, startX * 2 + (participants.length - 1) * colSpacing);
  const totalHeight = startY + participantHeight + (messages.length + 1) * messagePitchY + 60;

  // 参加者ごとのX中心座標マップ
  const participantXMap = new Map<string, number>();
  participants.forEach((p, idx) => {
    participantXMap.set(p, startX + idx * colSpacing);
  });

  const getParticipantX = (name: string): number => {
    if (participantXMap.has(name)) return participantXMap.get(name)!;
    // 見つからない場合のフォールバック（末尾）
    return startX + (participants.length - 1) * colSpacing;
  };

  const lifelineStartY = startY + participantHeight;
  const lifelineEndY = totalHeight - 30;

  return (
    <div className="w-full max-w-full my-6 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl p-4 sm:p-6 overflow-x-auto backdrop-blur-md">
      {(title || subtitle) && (
        <div className="border-b border-slate-800 pb-4 mb-4">
          {title && <h4 className="text-lg sm:text-xl font-bold text-white font-mono">{title}</h4>}
          {subtitle && <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="min-w-[720px] flex justify-center">
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="overflow-visible"
        >
          <defs>
            {/* 同期メッセージ用：中実矢印ヘッド */}
            <marker
              id="seq-arrow-sync"
              viewBox="0 0 12 12"
              refX="10"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <polygon points="0 2, 10 6, 0 10" fill="#38bdf8" />
            </marker>

            {/* 戻り値用：開いた矢印ヘッド */}
            <marker
              id="seq-arrow-return"
              viewBox="0 0 12 12"
              refX="10"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <polyline
                points="2 2, 10 6, 2 10"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {/* 1. 各参加者の垂直ライフライン（破線） */}
          {participants.map((p, idx) => {
            const centerX = getParticipantX(p);
            return (
              <g key={`lifeline-${idx}`}>
                <line
                  x1={centerX}
                  y1={lifelineStartY}
                  x2={centerX}
                  y2={lifelineEndY}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </g>
            );
          })}

          {/* 2. 各メッセージの水平SVG矢印 ＆ アクティベーションバー */}
          {messages.map((msg, idx) => {
            const msgY = lifelineStartY + (idx + 1) * messagePitchY;
            const fromX = getParticipantX(msg.from);
            const toX = getParticipantX(msg.to);
            const isLeftToRight = toX >= fromX;

            // アクティベーション矩形のオフセット考慮
            const activationWidth = 14;
            const x1 = isLeftToRight ? fromX + activationWidth / 2 : fromX - activationWidth / 2;
            const x2 = isLeftToRight ? toX - activationWidth / 2 : toX + activationWidth / 2;

            const textAnchorX = (x1 + x2) / 2;

            return (
              <g key={`msg-${idx}`} className="transition-all hover:opacity-100">
                {/* 呼び出し先のアクティベーションバー（実行区間矩形） */}
                <rect
                  x={toX - activationWidth / 2}
                  y={msgY - 6}
                  width={activationWidth}
                  height={messagePitchY * 0.8}
                  rx="3"
                  fill="#1e293b"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  className="shadow-sm"
                />

                {/* 呼び出し元のアクティベーションバー */}
                <rect
                  x={fromX - activationWidth / 2}
                  y={msgY - 10}
                  width={activationWidth}
                  height={messagePitchY * 0.9}
                  rx="3"
                  fill="#0f172a"
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* 水平メッセージ線 */}
                <line
                  x1={x1}
                  y1={msgY}
                  x2={x2}
                  y2={msgY}
                  stroke={msg.isReturn ? "#94a3b8" : "#38bdf8"}
                  strokeWidth="2"
                  strokeDasharray={msg.isReturn ? "6,4" : undefined}
                  markerEnd={msg.isReturn ? "url(#seq-arrow-return)" : "url(#seq-arrow-sync)"}
                />

                {/* メッセージ番号バッジ */}
                <circle
                  cx={isLeftToRight ? x1 + 16 : x1 - 16}
                  cy={msgY - 14}
                  r="8"
                  fill="#0369a1"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={isLeftToRight ? x1 + 16 : x1 - 16}
                  y={msgY - 11}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>

                {/* メッセージ名 */}
                <text
                  x={textAnchorX}
                  y={msgY - 10}
                  textAnchor="middle"
                  fill={msg.isReturn ? "#cbd5e1" : "#38bdf8"}
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {msg.message}
                </text>

                {/* 対応するC++コード */}
                {msg.cppCodeSnippet && (
                  <text
                    x={textAnchorX}
                    y={msgY + 16}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    // {msg.cppCodeSnippet}
                  </text>
                )}
              </g>
            );
          })}

          {/* 3. 参加者ヘッダー（ライフライン最上部の矩形ボックス） */}
          {participants.map((p, idx) => {
            const centerX = getParticipantX(p);
            return (
              <g key={`participant-${idx}`}>
                <rect
                  x={centerX - participantWidth / 2}
                  y={startY}
                  width={participantWidth}
                  height={participantHeight}
                  rx="10"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                />
                <text
                  x={centerX}
                  y={startY + 26}
                  textAnchor="middle"
                  fill="#e0f2fe"
                  fontSize="13"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  :{p}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

