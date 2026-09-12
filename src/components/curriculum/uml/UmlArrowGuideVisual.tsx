import React from "react";

interface ArrowSpec {
  id: string;
  name: string;
  meaning: string;
  umlName: string;
  cppCode: string;
  memoryNote: string;
  lineStyle: "solid" | "dashed";
  headType: "closed-triangle" | "filled-diamond" | "empty-diamond" | "open-arrow" | "closed-triangle-dashed";
  accentColor: string;
}

const ARROW_SPECS: ArrowSpec[] = [
  {
    id: "generalization",
    name: "汎化 (継承 / is-a)",
    umlName: "Generalization",
    meaning: "派生クラスが基底クラスの仕様・実装を引き継ぐ関係",
    cppCode: "class BossEnemy : public Enemy { ... };",
    memoryNote: "基底クラスのメモリレイアウトを派生クラスが内包（vptr経由の多態性）",
    lineStyle: "solid",
    headType: "closed-triangle",
    accentColor: "#f59e0b", // amber
  },
  {
    id: "realization",
    name: "実現 (インターフェース実装)",
    umlName: "Realization",
    meaning: "純粋仮想関数（インターフェース）の契約を具体的に実装する関係",
    cppCode: "class OpenGLRenderer : public IRenderer { ... };",
    memoryNote: "vtable上の関数ポインタテーブルを派生クラスの実装で満たす",
    lineStyle: "dashed",
    headType: "closed-triangle-dashed",
    accentColor: "#a855f7", // purple
  },
  {
    id: "composition",
    name: "コンポジション (強固な所有)",
    umlName: "Composition",
    meaning: "親が子を独占所有し、寿命が完全に連動（道連れ破棄）する関係",
    cppCode: "Weapon m_weapon; // または std::unique_ptr<Weapon> m_weapon;",
    memoryNote: "親のデストラクタ呼び出しと同時に子も確実に解放される",
    lineStyle: "solid",
    headType: "filled-diamond",
    accentColor: "#10b981", // emerald
  },
  {
    id: "aggregation",
    name: "集約 (共有所有)",
    umlName: "Aggregation",
    meaning: "親と子が全体-部分関係にあるが、寿命は独立（他者と共有可能）",
    cppCode: "std::shared_ptr<SoundData> m_bgmSound;",
    memoryNote: "参照カウント方式で管理され、親が死んでも他が参照していれば生き続ける",
    lineStyle: "solid",
    headType: "empty-diamond",
    accentColor: "#06b6d4", // cyan
  },
  {
    id: "association",
    name: "関連 (単なる参照・利用)",
    umlName: "Association",
    meaning: "相手の存在を知っており、メソッドを呼んだり参照する関係",
    cppCode: "Enemy* m_target; // または const Enemy& m_target;",
    memoryNote: "相手の寿命には責任を持たない（先に死なれるとダングリングの危険）",
    lineStyle: "solid",
    headType: "open-arrow",
    accentColor: "#38bdf8", // sky
  },
  {
    id: "dependency",
    name: "依存 (一時的な利用)",
    umlName: "Dependency",
    meaning: "関数引数やローカル変数として一時的に相手を使用する関係",
    cppCode: "void fire(const SoundSystem& snd) { snd.play(); }",
    memoryNote: "メンバ変数としては保持せず、関数呼び出しスタックの期間のみ依存",
    lineStyle: "dashed",
    headType: "open-arrow",
    accentColor: "#94a3b8", // slate
  },
];

export const UmlArrowGuideVisual: React.FC = () => {
  return (
    <div className="my-8 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            UML 2.5 Specification Master Visual
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            UML 5大関連矢印 ＆ C++メモリモデル完全リファレンス
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hidden sm:inline">
          SVG幾何ベクトル描画
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ARROW_SPECS.map((spec) => (
          <div
            key={spec.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between gap-4 shadow-lg"
          >
            {/* 上部：タイトル & 意味 */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: spec.accentColor }}
                  />
                  <span>{spec.name}</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {spec.umlName}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {spec.meaning}
              </p>
            </div>

            {/* 中央：厳密な座標計算によるSVG図形描画 */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-center">
              <svg width="100%" height="46" viewBox="0 0 340 46" className="overflow-visible">
                <defs>
                  {/* 白抜き三角マーカー (汎化・継承) */}
                  <marker
                    id={`marker-triangle-${spec.id}`}
                    viewBox="0 0 16 16"
                    refX="16"
                    refY="8"
                    markerWidth="14"
                    markerHeight="14"
                    orient="auto-start-reverse"
                  >
                    <polygon
                      points="0 1, 16 8, 0 15"
                      fill="#0f172a"
                      stroke={spec.accentColor}
                      strokeWidth="2"
                    />
                  </marker>

                  {/* 黒塗り菱形マーカー (コンポジション) */}
                  <marker
                    id={`marker-filled-diamond-${spec.id}`}
                    viewBox="0 0 20 12"
                    refX="0"
                    refY="6"
                    markerWidth="16"
                    markerHeight="12"
                    orient="auto"
                  >
                    <polygon
                      points="0 6, 10 0, 20 6, 10 12"
                      fill={spec.accentColor}
                      stroke={spec.accentColor}
                      strokeWidth="1.5"
                    />
                  </marker>

                  {/* 白抜き菱形マーカー (集約) */}
                  <marker
                    id={`marker-empty-diamond-${spec.id}`}
                    viewBox="0 0 20 12"
                    refX="0"
                    refY="6"
                    markerWidth="16"
                    markerHeight="12"
                    orient="auto"
                  >
                    <polygon
                      points="0 6, 10 0, 20 6, 10 12"
                      fill="#0f172a"
                      stroke={spec.accentColor}
                      strokeWidth="2"
                    />
                  </marker>

                  {/* 開いた矢印マーカー (関連・依存) */}
                  <marker
                    id={`marker-open-arrow-${spec.id}`}
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
                      stroke={spec.accentColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </marker>
                </defs>

                {/* 左ノード (From) */}
                <rect
                  x="10"
                  y="8"
                  width="70"
                  height="30"
                  rx="6"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text
                  x="45"
                  y="28"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  From
                </text>

                {/* 接続線と矢印 */}
                {spec.headType === "closed-triangle" || spec.headType === "closed-triangle-dashed" ? (
                  // 汎化・実現：右(Base)へ向かって白抜き三角
                  <line
                    x1="80"
                    y1="23"
                    x2="245"
                    y2="23"
                    stroke={spec.accentColor}
                    strokeWidth="2.5"
                    strokeDasharray={spec.lineStyle === "dashed" ? "6,5" : undefined}
                    markerEnd={`url(#marker-triangle-${spec.id})`}
                  />
                ) : spec.headType === "filled-diamond" ? (
                  // コンポジション：左(親)側に黒菱形、右(子)側に矢印
                  <line
                    x1="80"
                    y1="23"
                    x2="245"
                    y2="23"
                    stroke={spec.accentColor}
                    strokeWidth="2.5"
                    markerStart={`url(#marker-filled-diamond-${spec.id})`}
                    markerEnd={`url(#marker-open-arrow-${spec.id})`}
                  />
                ) : spec.headType === "empty-diamond" ? (
                  // 集約：左(親)側に白菱形、右(子)側に矢印
                  <line
                    x1="80"
                    y1="23"
                    x2="245"
                    y2="23"
                    stroke={spec.accentColor}
                    strokeWidth="2.5"
                    markerStart={`url(#marker-empty-diamond-${spec.id})`}
                    markerEnd={`url(#marker-open-arrow-${spec.id})`}
                  />
                ) : (
                  // 関連・依存：右側へ開いた矢印
                  <line
                    x1="80"
                    y1="23"
                    x2="245"
                    y2="23"
                    stroke={spec.accentColor}
                    strokeWidth="2.5"
                    strokeDasharray={spec.lineStyle === "dashed" ? "6,5" : undefined}
                    markerEnd={`url(#marker-open-arrow-${spec.id})`}
                  />
                )}

                {/* 右ノード (To) */}
                <rect
                  x="260"
                  y="8"
                  width="70"
                  height="30"
                  rx="6"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text
                  x="295"
                  y="28"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  To
                </text>
              </svg>
            </div>

            {/* 下部：C++対応コード ＆ メモリノート */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                <code>{spec.cppCode}</code>
              </div>
              <div className="text-[11px] font-sans text-slate-400 bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-800/60 flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold shrink-0">?? メモリ:</span>
                <span>{spec.memoryNote}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

