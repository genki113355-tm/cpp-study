import React from 'react';
import { Shield, ShieldAlert, Sparkles, Layers } from 'lucide-react';

import { DiagramType } from '../../types/curriculum';

interface ConceptDiagramProps {
  type: DiagramType;
}

export const ConceptDiagram: React.FC<ConceptDiagramProps> = ({ type }) => {
  if (type === 'spaghetti_vs_modular') {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-red-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-5 text-red-400 font-bold text-base sm:text-lg">
          <ShieldAlert className="w-6 h-6" />
          <span>【構造図解】第1章：グローバル変数によるスパゲティ密結合地獄</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* グローバル変数の山 */}
          <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/25">
            <h4 className="text-xs sm:text-sm font-mono font-bold text-red-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>⚠️ むき出しのグローバル変数群</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs sm:text-sm text-red-200">
              <div className="bg-red-900/30 p-2 rounded-lg border border-red-700/40">int playerX</div>
              <div className="bg-red-900/30 p-2 rounded-lg border border-red-700/40">int bulletActive</div>
              <div className="bg-red-900/30 p-2 rounded-lg border border-red-700/40">int invaderX[6]</div>
              <div className="bg-red-900/30 p-2 rounded-lg border border-red-700/40">int invaderY[6]</div>
              <div className="bg-red-900/30 p-2 rounded-lg border border-red-700/40">int invaderAlive[6]</div>
              <div className="bg-red-900/30 p-2 rounded-lg border border-red-700/40">int score</div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-red-300/90 leading-relaxed font-sans">
              全変数が世界中に公開されているため、どこからでも自由に書き換えられてしまう。
            </p>
          </div>

          {/* main関数の中身 */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h4 className="text-xs sm:text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
              巨大な main() 関数 (100行以上)
            </h4>
            <div className="space-y-2 text-xs sm:text-sm font-mono">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border-l-3 border-red-500 flex items-center justify-between">
                <span>キー入力処理 (kbhit)</span>
                <span className="text-xs text-red-400 font-bold">playerXを直接変更</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border-l-3 border-red-500 flex items-center justify-between">
                <span>弾の移動 &amp; 画面外判定</span>
                <span className="text-xs text-red-400 font-bold">bulletActiveを直接変更</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border-l-3 border-red-500 flex items-center justify-between">
                <span>敵の移動 &amp; 壁バウンド</span>
                <span className="text-xs text-red-400 font-bold">invaderX/Yを直接変更</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border-l-3 border-red-500 flex items-center justify-between">
                <span>当たり判定 2重ループ</span>
                <span className="text-xs text-red-400 font-bold">全変数が絡み合う</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border-l-3 border-red-500 flex items-center justify-between">
                <span>文字バッファ描画 &amp; Sleep</span>
                <span className="text-xs text-red-400 font-bold">全変数を参照</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs sm:text-sm text-red-200 leading-relaxed font-sans">
          <strong>💥 破綻のメカニズム：</strong> 敵の種類を増やしたい、または弾を3連射にしたいだけで、main関数のすべてのブロックに手を加える必要があり、コードは一瞬で修正不可能なスパゲティと化します。
        </div>
      </div>
    );
  }

  if (type === 'class_encapsulation') {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-5 text-cyan-400 font-bold text-base sm:text-lg">
          <Shield className="w-6 h-6" />
          <span>【設計図解】第2章：カプセル化（public / private）と責任の分離</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {/* Player クラス */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40">
            <div className="text-sm font-bold text-cyan-300 pb-2 border-b border-cyan-500/20 flex items-center justify-between">
              <span>class Player</span>
              <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-sans">自機</span>
            </div>
            {/* private */}
            <div className="mt-3 p-3 rounded-lg bg-red-950/30 border border-red-500/30">
              <span className="text-xs font-bold text-red-400 block mb-1">🔒 private (隠蔽)</span>
              <div className="text-xs sm:text-sm text-slate-200">int m_x, m_y;</div>
              <span className="text-[11px] text-red-300/80 mt-1 block">※外部からの改ざん不可！</span>
            </div>
            {/* public */}
            <div className="mt-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400 block mb-1">🔓 public (公開窓口)</span>
              <div className="text-xs sm:text-sm text-slate-200">moveLeft()</div>
              <div className="text-xs sm:text-sm text-slate-200">moveRight()</div>
              <div className="text-xs sm:text-sm text-slate-200">shoot(bullet)</div>
              <div className="text-xs sm:text-sm text-emerald-400">getX(), getY()</div>
            </div>
          </div>

          {/* Invader クラス */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40">
            <div className="text-sm font-bold text-purple-300 pb-2 border-b border-purple-500/20 flex items-center justify-between">
              <span>class Invader</span>
              <span className="text-xs bg-purple-950 text-purple-400 px-2 py-0.5 rounded border border-purple-800 font-sans">敵</span>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-red-950/30 border border-red-500/30">
              <span className="text-xs font-bold text-red-400 block mb-1">🔒 private (隠蔽)</span>
              <div className="text-xs sm:text-sm text-slate-200">int m_x, m_y;</div>
              <div className="text-xs sm:text-sm text-slate-200">bool m_alive;</div>
            </div>
            <div className="mt-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400 block mb-1">🔓 public (公開窓口)</span>
              <div className="text-xs sm:text-sm text-slate-200">move(dx, dy)</div>
              <div className="text-xs sm:text-sm text-slate-200">destroy()</div>
              <div className="text-xs sm:text-sm text-emerald-400">isAlive(), getPos()</div>
            </div>
          </div>

          {/* Bullet クラス */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40">
            <div className="text-sm font-bold text-amber-300 pb-2 border-b border-amber-500/20 flex items-center justify-between">
              <span>class Bullet</span>
              <span className="text-xs bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800 font-sans">弾</span>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-red-950/30 border border-red-500/30">
              <span className="text-xs font-bold text-red-400 block mb-1">🔒 private (隠蔽)</span>
              <div className="text-xs sm:text-sm text-slate-200">int m_x, m_y;</div>
              <div className="text-xs sm:text-sm text-slate-200">bool m_active;</div>
            </div>
            <div className="mt-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400 block mb-1">🔓 public (公開窓口)</span>
              <div className="text-xs sm:text-sm text-slate-200">spawn(x, y)</div>
              <div className="text-xs sm:text-sm text-slate-200">update()</div>
              <div className="text-xs sm:text-sm text-emerald-400">isActive(), getPos()</div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 flex items-center gap-3 font-sans">
          <Layers className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span className="leading-relaxed"><strong>恩恵：</strong> 「.h」で約束されたpublic関数だけを使ってメイン処理を書くため、クラス内部の実装がどう変わっても呼び出し側は壊れません。</span>
        </div>
      </div>
    );
  }

  if (type === 'vector_memory_lifecycle') {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-5 text-emerald-400 font-bold text-base sm:text-lg">
          <Sparkles className="w-6 h-6" />
          <span>【動的メモリ図解】第3章：std::vector と パーティクルの寿命（Lifecycle）</span>
        </div>

        <div className="relative border-l-2 border-emerald-500/40 ml-4 pl-5 space-y-5">
          {/* フェーズ1: 誕生 */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-950 font-bold">
              1
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-emerald-300 mb-1">
                <span>【誕生】弾が敵にヒット！</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded">emplace_back()</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                敵の撃破座標から、角度と初速を変えて10個の <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">Particle</code> インスタンスを動的に生成し、<code className="text-emerald-400">m_particles</code> に追加。
              </p>
            </div>
          </div>

          {/* フェーズ2: 生存と活動 */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-cyan-500 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-950 font-bold">
              2
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-cyan-300 mb-1">
                <span>【活動 &amp; 老化】毎フレームの更新</span>
                <span className="text-xs bg-cyan-950 text-cyan-400 px-2.5 py-0.5 rounded">p.update()</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                速度に応じて座標が移動（<code className="text-cyan-400">x += vx, y += vy</code>）。同時に寿命カウンターが減算（<code className="text-amber-400">lifetime--</code>）。
              </p>
            </div>
          </div>

          {/* フェーズ3: 消滅 */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-950 font-bold">
              3
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-rose-300 mb-1">
                <span>【消滅】寿命到達 &amp; 安全なメモリ解放</span>
                <span className="text-xs bg-rose-950 text-rose-400 px-2.5 py-0.5 rounded">erase-remove</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <code className="text-rose-400">lifetime &lt;= 0</code> となった火花は、デストラクタが呼ばれてメモリからきれいに消去されます。メモリリークは一切発生しません！
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 第4章：継承・ポリモーフィズム・vtable（仮想関数テーブル）の内部構造
  if (type === 'inheritance_vtable') {
    return (
    <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-purple-500/35 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5 text-purple-400 font-bold text-base sm:text-lg">
          <Layers className="w-6 h-6" />
          <span>【構造図解】第4章：仮想関数テーブル（vtable）と動的ディスパッチの舞台裏</span>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-semibold">
          vptr &amp; vtable メモリ構造
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：クラス階層とインスタンスのメモリ配置 */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono font-bold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-4 bg-purple-400 rounded-sm" />
            <span>1. 派生クラス実体のメモリ配置（暗黙の `__vptr` を含む）</span>
          </h4>

          {/* NormalEnemy 実体 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 font-mono text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-bold pb-1.5 border-b border-slate-800">
              <span>インスタンス: NormalEnemy</span>
              <span className="text-xs text-slate-500">Heap: 0x10A0</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-purple-950/40 p-2 rounded border border-purple-500/40 text-purple-300">
                <span className="font-bold block">void* __vptr</span>
                <span className="text-[11px] text-slate-400">─► &amp;vtable_NormalEnemy</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                <span className="text-slate-400 block">int m_x, m_y</span>
                <span>(10, 4)</span>
              </div>
            </div>
          </div>

          {/* ShieldEnemy 実体 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between text-emerald-300 font-bold pb-1.5 border-b border-slate-800">
              <span>インスタンス: ShieldEnemy</span>
              <span className="text-xs text-slate-500">Heap: 0x10F0</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-purple-950/40 p-2 rounded border border-purple-500/40 text-purple-300">
                <span className="font-bold block">void* __vptr</span>
                <span className="text-[10px] text-slate-400">─► &amp;vtable_Shield</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                <span className="text-slate-400 block">m_x, m_y</span>
                <span>(18, 2)</span>
              </div>
              <div className="bg-amber-950/30 p-2 rounded border border-amber-500/30 text-amber-300">
                <span className="text-amber-400 block">int m_shield</span>
                <span>HP: 2</span>
              </div>
            </div>
          </div>

          {/* UfoEnemy 実体 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 font-mono text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between text-amber-300 font-bold pb-1.5 border-b border-slate-800">
              <span>インスタンス: UfoEnemy (ボーナス)</span>
              <span className="text-xs text-slate-500">Heap: 0x1140</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-purple-950/40 p-2 rounded border border-purple-500/40 text-purple-300">
                <span className="font-bold block">void* __vptr</span>
                <span className="text-[10px] text-slate-400">─► &amp;vtable_Ufo</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                <span className="text-slate-400 block">m_x, m_y</span>
                <span>(1, 1)</span>
              </div>
              <div className="bg-cyan-950/30 p-2 rounded border border-cyan-500/30 text-cyan-300">
                <span className="text-cyan-400 block">int m_bonus</span>
                <span>500 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：コンパイラが静的生成する仮想関数テーブル (vtable) */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono font-bold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-4 bg-purple-400 rounded-sm" />
            <span>2. 静的メモリ上の仮想関数テーブル群（vtable）</span>
          </h4>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 font-mono text-xs sm:text-sm space-y-4">
            {/* NormalEnemy vtable */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-purple-300 font-bold mb-1.5 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>[vtable_NormalEnemy]</span>
                <span className="text-[11px] text-slate-500">関数ポインタ配列</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>[0] &amp;NormalEnemy::~NormalEnemy()</div>
                <div>[1] &amp;NormalEnemy::update() <span className="text-blue-400">/* 左右往復降下 */</span></div>
                <div>[2] &amp;NormalEnemy::draw()   <span className="text-slate-400">/* 'V' を描画 */</span></div>
              </div>
            </div>

            {/* ShieldEnemy vtable */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-purple-300 font-bold mb-1.5 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>[vtable_ShieldEnemy]</span>
                <span className="text-[11px] text-slate-500">関数ポインタ配列</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>[0] &amp;ShieldEnemy::~ShieldEnemy()</div>
                <div>[1] &amp;ShieldEnemy::update() <span className="text-emerald-400">/* 低速重装甲移動 */</span></div>
                <div>[2] &amp;ShieldEnemy::draw()   <span className="text-emerald-300">/* 'S' または 's' */</span></div>
              </div>
            </div>

            {/* UfoEnemy vtable */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-purple-300 font-bold mb-1.5 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>[vtable_UfoEnemy]</span>
                <span className="text-[11px] text-slate-500">関数ポインタ配列</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>[0] &amp;UfoEnemy::~UfoEnemy()</div>
                <div>[1] &amp;UfoEnemy::update() <span className="text-amber-400">/* 上空を高速直進 */</span></div>
                <div>[2] &amp;UfoEnemy::draw()   <span className="text-amber-300">/* 'U' (500pts) */</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 仮想デストラクタの絶対原則 */}
      <div className="mt-5 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs sm:text-sm text-purple-200 leading-relaxed font-sans flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-purple-300 font-mono block mb-1">
            【C++現場の鉄則：なぜ基底クラスのデストラクタは virtual でなければならないのか？】
          </strong>
          <p>
            基底クラスポインタ（<code className="text-purple-300 font-mono">Enemy* e = new ShieldEnemy(); delete e;</code>）経由でオブジェクトを破棄するとき、
            もし <code className="text-purple-300 font-mono">virtual ~Enemy()</code> にしていないと、コンパイラは基底クラスのデストラクタしか呼び出しません。
            その結果、派生クラス固有のメンバの破棄処理がスキップされ、目に見えないメモリリークが発生します！
          </p>
        </div>
      </div>
    </div>
  );
  }

  if (type === 'smart_pointer_ownership') {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-5 text-cyan-400 font-bold text-base sm:text-lg">
          <Sparkles className="w-6 h-6" />
          <span>【構造図解】第5章：スマートポインタの所有権（Ownership）とメモリ物理</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono">
          {/* 1. std::unique_ptr */}
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-cyan-300 font-bold text-sm sm:text-base">std::unique_ptr&lt;T&gt;</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[11px] border border-cyan-500/30">単独所有権</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-200">
                  <span className="text-slate-400 block mb-1">【オーバーヘッド】</span>
                  <span className="font-bold text-emerald-400">0バイト（生ポインタと同一）</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                  唯一の所有者。<strong>コピー禁止</strong>（コンパイルエラー）。所有権の移動は <code className="text-cyan-300 font-mono">std::move()</code> のみ許可。
                </div>
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">所有権の移動 (Move):</div>
                  <div className="text-cyan-300 font-bold">p1 ─── move ───► p2</div>
                  <div className="text-slate-500 text-[10px]">(p1は自動で nullptr になる)</div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-cyan-300/80 bg-cyan-950/20 p-2 rounded border border-cyan-500/20 font-sans">
              用途: 敵（Enemy）、アイテム（Item）、弾（Bullet）の管理。C++現場の9割はこれで完結！
            </div>
          </div>

          {/* 2. std::shared_ptr */}
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-emerald-300 font-bold text-sm sm:text-base">std::shared_ptr&lt;T&gt;</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[11px] border border-emerald-500/30">共有所有権</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                  <span className="text-slate-400 block mb-1">【内部物理構造】</span>
                  <span className="font-bold text-emerald-300">実体ポインタ + 管理ブロック</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>管理ブロック (Control Block):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-center">
                    <div className="p-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                      use_count: 2
                    </div>
                    <div className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      weak_count: 1
                    </div>
                  </div>
                  <p className="text-[11px] font-sans text-slate-300 mt-1">
                    コピーするたびに <code className="text-emerald-300">use_count++</code>。破棄で <code className="text-emerald-300">use_count--</code>。0になった瞬間に実体自動解放！
                  </p>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-300/80 bg-emerald-950/20 p-2 rounded border border-emerald-500/20 font-sans">
              用途: プレイヤーとステージが共有するビット護衛機（BitDrone）、共有サウンド。
            </div>
          </div>

          {/* 3. std::weak_ptr */}
          <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-amber-300 font-bold text-sm sm:text-base">std::weak_ptr&lt;T&gt;</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[11px] border border-amber-500/30">弱参照監視</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/20 text-amber-200">
                  <span className="text-slate-400 block mb-1">【循環参照の破壊者】</span>
                  <span className="font-bold text-amber-300">use_count を増やさない！</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                  実体を所有せず、ただ「見守る」だけ。実体が生きていれば <code className="text-amber-300 font-mono">lock()</code> で一時的な <code className="text-emerald-300 font-mono">shared_ptr</code> を安全取得。
                </div>
                <div className="p-2 rounded bg-red-950/30 border border-red-500/30 text-red-300 text-[11px] font-sans">
                  ⚠️ 相互参照（A⇄B）で shared_ptr を使うとカウントが永遠に0にならずリーク死！weak_ptr で片側を弱く繋ぐ。
                </div>
              </div>
            </div>
            <div className="text-[11px] text-amber-300/80 bg-amber-950/20 p-2 rounded border border-amber-500/20 font-sans">
              用途: 敵の追尾ターゲット監視、ビット機から親プレイヤーへの逆参照。
            </div>
          </div>
        </div>

        {/* 現場の鉄則 */}
        <div className="mt-5 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 leading-relaxed font-sans flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 font-mono block mb-1">
              【シロクマ指導官のアーキテクチャ原則：unique_ptr をデフォルトとせよ】
            </strong>
            <p>
              「とりあえず shared_ptr にしておけば安心」は初心者の最大の悪手じゃ！
              shared_ptr はスレッドセーフな参照カウント用管理ブロックのアトミック演算オーバーヘッドを持つ。
              <strong>設計の基本は 100% unique_ptr で組み立て、どうしても真の所有権共有が必要なときだけ shared_ptr を使え！</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 第6章：Stateパターン＆Observerパターン
  if (type === 'state_observer_pattern') {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-amber-500/35 shadow-xl backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base sm:text-lg">
          <Layers className="w-6 h-6" />
          <span>【構造図解】第6章：State パターンによる状態遷移 ＆ Observer パターンによるイベント疎結合</span>
        </div>

        {/* 1. State パターンの状態マシン */}
        <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
          <h4 className="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>1. State パターン：巨大 switch 文を追放する状態ポリモーフィズム</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            {/* TitleState */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 space-y-1">
              <div className="text-amber-400 font-bold pb-1 border-b border-slate-800">TitleState</div>
              <div className="text-slate-300">タイトル画面を描画</div>
              <div className="text-[11px] text-cyan-400">SPACE ──► PlayStateへ</div>
            </div>

            {/* PlayState */}
            <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/40 space-y-1">
              <div className="text-emerald-300 font-bold pb-1 border-b border-slate-800">PlayState</div>
              <div className="text-slate-300">通常のゲームループ</div>
              <div className="text-[11px] text-amber-400">Pキー ──► PauseStateへ</div>
              <div className="text-[11px] text-rose-400">撃沈 ──► GameOverへ</div>
            </div>

            {/* PauseState */}
            <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/40 space-y-1">
              <div className="text-cyan-300 font-bold pb-1 border-b border-slate-800">PauseState</div>
              <div className="text-slate-300">更新停止・暗転描画</div>
              <div className="text-[11px] text-emerald-400">Pキー ──► PlayState復帰</div>
            </div>

            {/* GameOverState */}
            <div className="p-3 rounded-lg bg-slate-900 border border-rose-500/40 space-y-1">
              <div className="text-rose-400 font-bold pb-1 border-b border-slate-800">GameOverState</div>
              <div className="text-slate-300">スコア結果発表</div>
              <div className="text-[11px] text-amber-400">Rキー ──► TitleStateへ</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
            呼び出し側の <code className="text-amber-300 font-mono">Game::update()</code> はただ <code className="text-amber-300 font-mono">m_currentState-&gt;update()</code> を呼ぶだけ！
            状態の分岐（switch文）がゼロになり、新しいシーン（設定画面やショップ画面）をクラスとして自由に追加できます。
          </div>
        </div>

        {/* 2. Observer パターンのイベント配信 */}
        <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
          <h4 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>2. Observer パターン：発行元（Subject）と受信側（Observer）の完全疎結合</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center font-mono text-xs">
            {/* Subject */}
            <div className="md:col-span-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2">
              <div className="text-cyan-300 font-bold text-sm">【Subject: 発行元】</div>
              <div className="text-white font-bold bg-slate-900 py-1 rounded">PlayState / Game</div>
              <div className="text-[11px] text-slate-400 font-sans">
                敵撃破やスコア加算時に <code className="text-cyan-300">notify(Event)</code> を呼ぶだけ！誰が購読しているか関知しない。
              </div>
            </div>

            {/* 矢印 */}
            <div className="md:col-span-2 text-center text-cyan-400 font-bold text-base hidden md:block">
              ──► 通知 ──►
            </div>

            {/* Observers */}
            <div className="md:col-span-6 space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">AchievementObserver: </span>
                  <span className="text-slate-300">撃破数カウント &amp; 実績解除トースト</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">購読中</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">ScoreObserver: </span>
                  <span className="text-slate-300">コンボ倍率計算 &amp; ハイスコア保存</span>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded">購読中</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-purple-400 font-bold">AudioObserver: </span>
                  <span className="text-slate-300">撃破SE・爆発BGMの再生トリガー</span>
                </div>
                <span className="text-[10px] text-purple-400 bg-purple-950 px-2 py-0.5 rounded">購読中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 第7章：ECS（Entity-Component-System）＆モダンテンプレート
  if (type === 'ecs_composition_template') {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/35 shadow-xl backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
          <Sparkles className="w-6 h-6" />
          <span>【構造図解】第7章：継承の限界突破！「継承より合成（Composition）」と型安全テンプレート</span>
        </div>

        {/* 継承ツリー vs コンポーネント合成 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
          {/* 左：継承の破綻 */}
          <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
              <span>⚠️ 継承（Inheritance）の限界：クラス爆発</span>
            </h4>
            <div className="space-y-2 text-xs text-red-200">
              <div className="p-2 bg-red-900/30 rounded border border-red-700/40">Enemy 基底クラス</div>
              <div className="pl-4 space-y-1">
                <div>├─ FlyingEnemy（飛行機能）</div>
                <div>├─ ShieldEnemy（装甲機能）</div>
                <div>└─ ShootingEnemy（弾幕機能）</div>
              </div>
              <div className="p-2.5 bg-red-950/60 rounded border border-red-500/40 text-[11px] text-red-300 font-sans">
                💥 「飛んで、シールドを持ち、弾幕を撃つボス敵」を作ろうとすると、多重継承でメンバが重複・衝突（菱形継承問題）し、クラス数が階乗的に爆発して設計が破綻する！
              </div>
            </div>
          </div>

          {/* 右：コンポーネント合成（ECS） */}
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <span>✨ 合成（Composition）：パーツ着脱による無限の表現力</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-emerald-900/30 rounded border border-emerald-700/40 text-emerald-200 font-bold">
                Entity（単なるID容器：ID=101 BossEnemy）
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-1.5 rounded bg-slate-900 border border-emerald-500/30 text-cyan-300">
                  + TransformComponent
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-emerald-500/30 text-emerald-300">
                  + HealthComponent(HP:10)
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-emerald-500/30 text-amber-300">
                  + ShooterComponent(3WAY)
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-emerald-500/30 text-purple-300">
                  + BossRenderComponent
                </div>
              </div>
              <div className="p-2.5 bg-emerald-950/60 rounded border border-emerald-500/40 text-[11px] text-emerald-200 font-sans">
                ✅ クラスを1つも増やさず、部品（Component）をブロックのように組み合わせるだけで、どんな新しい敵・プレイヤーも即座に誕生する！
              </div>
            </div>
          </div>
        </div>

        {/* テンプレートによる型安全なパーツ取得 */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2 font-mono text-xs">
          <div className="text-cyan-300 font-bold text-sm">
            【C++テンプレートの神髄：コンパイル時型安全な get&lt;T&gt;()】
          </div>
          <div className="p-3 rounded-lg bg-slate-900 text-slate-200">
            <code>
              auto* hp = entity.get&lt;HealthComponent&gt;();<br />
              if (hp) &#123; hp-&gt;takeDamage(1); &#125;
            </code>
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            C言語の <code className="text-red-400 font-mono">void*</code> やダウンキャストを一切使わず、コンパイラが型安全性を100%保証。
            メモリ上で連続配置されるため、CPUキャッシュ効率も極めて高いモダンゲームエンジンの標準アーキテクチャです。
          </p>
        </div>
      </div>
    );
  }

  return null;
};
