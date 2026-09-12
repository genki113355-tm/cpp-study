import React, { useState } from 'react';
import { MemoryMapDoc } from '../../types/curriculum';
import { Cpu, HardDrive, Sparkles, Layers, Terminal, LayoutDashboard } from 'lucide-react';

interface MemoryVisualizerProps {
  memoryMap: MemoryMapDoc;
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ memoryMap }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'ascii'>('visual');

  const isVtableMap = 
    memoryMap.title.includes('仮想関数テーブル') || 
    memoryMap.title.includes('vtable') ||
    memoryMap.heapItems?.some(item => item.lifecycle.includes('vtable'));

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-[#080d1a] shadow-2xl p-5 sm:p-6 my-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="font-mono font-bold text-base sm:text-xl text-white">
            {memoryMap.title}
          </h3>
        </div>

        {/* 表示モード切り替えタブ */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'visual'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>ビジュアル図解</span>
          </button>
          <button
            onClick={() => setViewMode('ascii')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'ascii'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>ターミナル (ASCII)</span>
          </button>
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 font-sans">
        {memoryMap.description}
      </p>

      {/* メインダイアグラム表示部 */}
      {viewMode === 'visual' ? (
        <div className="rounded-2xl bg-[#050b18] border border-emerald-500/30 p-4 sm:p-6 shadow-inner mb-6 space-y-6">
          {/* 第4章：多態性・vtable・ポインタ参照のビジュアルダイアグラム */}
          {isVtableMap ? (
            <div className="space-y-6">
              {/* 上段：スタック領域 ──► ヒープ領域 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* スタック領域 (4 cols) */}
                <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-cyan-400 font-mono font-bold text-xs sm:text-sm pb-2.5 mb-3 border-b border-cyan-500/20">
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span>[スタック領域 (Stack)]</span>
                      </span>
                      <span className="text-[11px] text-slate-500">0x7FFF0100〜</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm space-y-2.5">
                      <div className="text-slate-300 font-bold flex items-center justify-between pb-1 border-b border-slate-800">
                        <span>std::vector&lt;Enemy*&gt; enemies</span>
                        <span className="text-xs text-cyan-400">要素数: 3</span>
                      </div>

                      {/* 要素0 */}
                      <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-cyan-500/30 text-cyan-200">
                        <div>
                          <span className="text-slate-400 font-bold">enemies[0] : </span>
                          <span className="text-cyan-300 font-mono">0x10A0</span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          Normal ──►
                        </span>
                      </div>

                      {/* 要素1 */}
                      <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-cyan-500/30 text-cyan-200">
                        <div>
                          <span className="text-slate-400 font-bold">enemies[1] : </span>
                          <span className="text-cyan-300 font-mono">0x10F0</span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          Shield ──►
                        </span>
                      </div>

                      {/* 要素2 */}
                      <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-cyan-500/30 text-cyan-200">
                        <div>
                          <span className="text-slate-400 font-bold">enemies[2] : </span>
                          <span className="text-cyan-300 font-mono">0x1140</span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          Ufo ──►
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] sm:text-xs text-slate-400 font-sans leading-relaxed">
                    スタック上には8バイトのポインタ（アドレス値）だけが格納され、メモリ占有を最小限に抑えています。
                  </p>
                </div>

                {/* ヒープ領域 (7 cols) */}
                <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3.5">
                  <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-xs sm:text-sm pb-2.5 border-b border-emerald-500/20">
                    <span className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      <span>[ヒープ領域 (Heap) : 派生クラスのインスタンス実体]</span>
                    </span>
                    <span className="text-[11px] text-slate-500">動的配置 (new / delete)</span>
                  </div>

                  {/* NormalEnemy インスタンス */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/40 font-mono text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-500/30 text-[11px]">V</span>
                        <strong className="text-white">NormalEnemy</strong>
                      </div>
                      <span className="text-xs text-slate-500">Heap: 0x10A0</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-1.5 rounded bg-purple-950/50 border border-purple-500/40 text-purple-300 flex items-center justify-between">
                        <span>void* __vptr</span>
                        <span className="text-[10px] text-purple-400">─► &amp;vtable_Normal</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                        <span>m_x, m_y</span>
                        <span className="text-emerald-400">HP: 1</span>
                      </div>
                    </div>
                  </div>

                  {/* ShieldEnemy インスタンス */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/40 font-mono text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">S</span>
                        <strong className="text-white">ShieldEnemy</strong>
                      </div>
                      <span className="text-xs text-slate-500">Heap: 0x10F0</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-1.5 rounded bg-purple-950/50 border border-purple-500/40 text-purple-300 flex items-center justify-between">
                        <span>void* __vptr</span>
                        <span className="text-[10px] text-purple-400">─► &amp;vtable_Shield</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                        <span>m_x, m_y</span>
                        <span className="text-amber-400">m_shield: 2</span>
                      </div>
                    </div>
                  </div>

                  {/* UfoEnemy インスタンス */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/40 font-mono text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30 text-[11px]">U</span>
                        <strong className="text-white">UfoEnemy</strong>
                      </div>
                      <span className="text-xs text-slate-500">Heap: 0x1140</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-1.5 rounded bg-purple-950/50 border border-purple-500/40 text-purple-300 flex items-center justify-between">
                        <span>void* __vptr</span>
                        <span className="text-[10px] text-purple-400">─► &amp;vtable_Ufo</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                        <span>m_x, m_y</span>
                        <span className="text-cyan-400">bonus: 500pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 下段：静的データ領域 (vtable群) */}
              <div className="p-4 sm:p-5 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between text-purple-300 font-mono font-bold text-xs sm:text-sm pb-2.5 border-b border-purple-500/20">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>[静的データ領域 (Code/Data Section) : 各クラスの仮想関数テーブル群 (vtable)]</span>
                  </span>
                  <span className="text-[11px] text-slate-400">実行時に関数アドレスを逆引き</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  {/* Normal Enemy vtable */}
                  <div className="p-3 rounded-lg bg-slate-950/90 border border-purple-500/30 space-y-1.5">
                    <div className="text-purple-300 font-bold pb-1 border-b border-slate-800">
                      vtable_NormalEnemy
                    </div>
                    <div className="text-slate-300 space-y-1">
                      <div>[0] &amp;NormalEnemy::~NormalEnemy()</div>
                      <div>[1] &amp;NormalEnemy::update() <span className="text-blue-400 font-sans text-[10px]">左右往復</span></div>
                      <div>[2] &amp;NormalEnemy::draw() <span className="text-slate-400 font-sans text-[10px]">'V'</span></div>
                    </div>
                  </div>

                  {/* Shield Enemy vtable */}
                  <div className="p-3 rounded-lg bg-slate-950/90 border border-purple-500/30 space-y-1.5">
                    <div className="text-purple-300 font-bold pb-1 border-b border-slate-800">
                      vtable_ShieldEnemy
                    </div>
                    <div className="text-slate-300 space-y-1">
                      <div>[0] &amp;ShieldEnemy::~ShieldEnemy()</div>
                      <div>[1] &amp;ShieldEnemy::update() <span className="text-emerald-400 font-sans text-[10px]">低速重装甲</span></div>
                      <div>[2] &amp;ShieldEnemy::draw() <span className="text-emerald-400 font-sans text-[10px]">'S'/'s'</span></div>
                    </div>
                  </div>

                  {/* Ufo Enemy vtable */}
                  <div className="p-3 rounded-lg bg-slate-950/90 border border-purple-500/30 space-y-1.5">
                    <div className="text-purple-300 font-bold pb-1 border-b border-slate-800">
                      vtable_UfoEnemy
                    </div>
                    <div className="text-slate-300 space-y-1">
                      <div>[0] &amp;UfoEnemy::~UfoEnemy()</div>
                      <div>[1] &amp;UfoEnemy::update() <span className="text-amber-400 font-sans text-[10px]">高速直進</span></div>
                      <div>[2] &amp;UfoEnemy::draw() <span className="text-amber-400 font-sans text-[10px]">'U'</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 第3章：動的配列 vector<Particle> のビジュアルダイアグラム */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* スタック領域 */}
              <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-cyan-400 font-mono font-bold text-xs sm:text-sm pb-2.5 border-b border-cyan-500/20">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>[スタック領域 (Stack)]</span>
                  </span>
                  <span className="text-[11px] text-slate-500">0x7ffd0000</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm space-y-2">
                  <div className="text-slate-200 font-bold pb-1 border-b border-slate-800 flex justify-between">
                    <span>Game game</span>
                    <span className="text-xs text-slate-400">main() 内ローカル変数</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 text-slate-300">
                    Player m_player (int m_x, m_y)
                  </div>
                  <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 space-y-1">
                    <div className="font-bold text-cyan-300">std::vector&lt;Particle&gt; m_particles</div>
                    <div className="text-xs text-slate-300 pl-2">├─ Particle* _data : <span className="text-emerald-400">0x00a12000 ──►</span></div>
                    <div className="text-xs text-slate-300 pl-2">├─ size_t    _size : 10 (現在数)</div>
                    <div className="text-xs text-slate-300 pl-2">└─ size_t    _cap  : 16 (容量)</div>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-sans leading-relaxed">
                  std::vector 自体はスタック上にわずか24バイト（ポインタ3本）しか占有しません。
                </p>
              </div>

              {/* ヒープ領域 */}
              <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-xs sm:text-sm pb-2.5 border-b border-emerald-500/20">
                  <span className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    <span>[ヒープ領域 (Heap) : 連続動的バッファ]</span>
                  </span>
                  <span className="text-[11px] text-slate-500">0x00a12000</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
                  <div className="text-emerald-300 font-bold pb-1 border-b border-slate-800 flex justify-between">
                    <span>Particle[0] 〜 [9] 連続メモリブロック</span>
                    <span className="text-xs text-slate-400">各Particle: float x, y, vx, vy, int life</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 9].map((idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-emerald-500/20 text-slate-300 text-[11px]">
                        <div className="text-emerald-400 font-bold">Particle[{idx === 9 ? '...' : idx}]</div>
                        <div className="text-slate-400 text-[10px]">life: {8 - idx > 0 ? 8 - idx : 1}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 font-sans flex items-center justify-between">
                    <span>💥 敵撃破時に <code className="font-mono text-white">emplace_back()</code> で動的誕生</span>
                    <span>💨 寿命ゼロで <code className="font-mono text-white">erase()</code> で安全解放</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ターミナル風 ASCII アート表示 */
        <div className="rounded-xl bg-[#030712] border border-emerald-500/40 p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-normal shadow-inner mb-5 scanline">
          <pre 
            className="text-glow-green whitespace-pre"
            style={{ 
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              letterSpacing: '0px'
            }}
          >
            {memoryMap.asciiArt}
          </pre>
        </div>
      )}

      {/* メモリ詳細テーブル（スタック / ヒープ） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4 font-mono">
        {/* スタック領域 */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm sm:text-base mb-3 pb-2 border-b border-slate-800">
            <Layers className="w-5 h-5" />
            <span>スタック領域 (Stack: 高速・自動破棄)</span>
          </div>
          <div className="space-y-2.5">
            {memoryMap.stackItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="text-cyan-300 font-bold text-sm sm:text-base">{item.variable}</span>
                  <span className="text-xs text-slate-500">{item.address}</span>
                </div>
                <div className="text-xs sm:text-sm text-amber-300 mt-1 font-semibold">値: {item.value}</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans leading-relaxed">{item.notes}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ヒープ領域（動的確保） */}
        {memoryMap.heapItems && memoryMap.heapItems.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base mb-3 pb-2 border-b border-slate-800">
              <HardDrive className="w-5 h-5" />
              <span>ヒープ領域 (Heap: 動的配置・寿命管理)</span>
            </div>
            <div className="space-y-2.5">
              {memoryMap.heapItems.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-emerald-300 font-bold text-sm sm:text-base">{item.object}</span>
                    <span className="text-xs text-slate-500">{item.address}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">状態: {item.state}</div>
                  <div className="text-xs sm:text-sm text-emerald-400 mt-1.5 font-sans leading-relaxed">{item.lifecycle}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ライフサイクル解説 */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/70 border border-emerald-500/25 text-sm sm:text-base text-slate-200 leading-relaxed flex items-start gap-3 font-sans">
        <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-300 font-mono text-base block mb-1">【メモリ管理の意図とRAII原則】</strong>
          <p className="leading-relaxed">{memoryMap.lifecycleExplanation}</p>
        </div>
      </div>
    </div>
  );
};


