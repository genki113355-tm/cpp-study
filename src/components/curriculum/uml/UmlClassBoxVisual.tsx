import React from "react";
import { Sparkles } from "lucide-react";

export const UmlClassBoxVisual: React.FC = () => {
  return (
    <div className="my-8 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Standard Class Compartment Visual
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            UMLクラスボックス「標準3段構造」の完全解剖
          </h3>
        </div>
        <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-500/30 hidden sm:inline">
          UML 2.5 規格準拠
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
        UMLクラス図は、世界共通で**「クラス名」「属性（メンバ変数）」「操作（メンバ関数）」**の3つのコンパートメント（部屋）に分かれています。
      </p>

      {/* 視覚的ダイアグラム ＆ 解説アノテーション */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 左側：精密なクラス図ボックス (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border-2 border-cyan-500/60 shadow-2xl overflow-hidden">
          {/* 1段目：クラス名ヘッダー */}
          <div className="p-4 bg-slate-800 text-center border-b-2 border-cyan-500/50 relative">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold block uppercase tracking-widest">
              &laquo;Entity&raquo;
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white font-mono">
              Player
            </h4>
            <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
              第1段：クラス名
            </span>
          </div>

          {/* 2段目：属性コンパートメント (Attributes) */}
          <div className="p-4 bg-slate-950/70 border-b-2 border-cyan-500/50 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Attributes (属性 / メンバ変数)
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                第2段：属性
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              <div className="p-1.5 rounded bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-950 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-xs">
                    -
                  </span>
                  <span className="text-slate-100 font-semibold">m_hp</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">int</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                  private HP残量
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-950 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-xs">
                    -
                  </span>
                  <span className="text-slate-100 font-semibold">m_pos</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">Vec2D</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                  private 現在座標
                </span>
              </div>
            </div>
          </div>

          {/* 3段目：操作コンパートメント (Operations) */}
          <div className="p-4 bg-slate-950/40 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Operations (操作 / メンバ関数)
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                第3段：操作
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              <div className="p-1.5 rounded bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                    +
                  </span>
                  <span className="text-slate-100 font-semibold">takeDamage(amount: int)</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">void</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-sans hidden sm:inline">
                  public 被弾処理
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                    +
                  </span>
                  <span className="text-slate-100 font-semibold">move(dir: Vec2D)</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">void</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-sans hidden sm:inline">
                  public 移動命令
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：C++との対応解説 (5 cols) */}
        <div className="lg:col-span-5 space-y-3 font-sans text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>表記順の違い（C++と逆）</span>
            </h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              C++は <code className="text-cyan-300 font-mono">型 変数名;</code> ですが、UMLは <code className="text-emerald-300 font-mono">変数名: 型</code> で書きます。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>アクセス可視性記号</span>
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold">+</span> : public
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-red-400 font-bold">-</span> : private
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold">#</span> : protected
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-purple-400 font-bold">~</span> : package
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>ステレオタイプ &laquo;...&raquo;</span>
            </h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              クラスの役割や性質（&laquo;abstract&raquo;, &laquo;interface&raquo;, &laquo;singleton&raquo; 等）を山かっこ二重で表記します。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

