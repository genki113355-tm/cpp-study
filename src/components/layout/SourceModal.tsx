import React from 'react';
import { X, Folder, Terminal, Check, Copy, Download } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const buildCmd = `cd cpp-projects/chapter5
g++ -std=c++17 main.cpp Game.cpp Player.cpp Item.cpp BitDrone.cpp Bullet.cpp Particle.cpp -o invader_ch5.exe
./invader_ch5.exe`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(buildCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c121e] border border-slate-700 shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-3">
          <Terminal className="w-6 h-6" />
          <h2 className="text-xl font-bold font-mono text-white">ローカル実行用 C++ プロジェクト一式</h2>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed font-sans">
          本教材のC++コードは、実際のコンパイルおよびローカル実行が可能なソースコード一式として配布しています。以下のボタンからZIPファイルをダウンロードしてご自由にお使いいただけます。
        </p>

        {/* ダウンロードCTAカード */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/40 mb-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-base">📦</span>
              <span>全7章のC++実機ソースコード一式</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                ZIP形式 (約55KB)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              各章のCMakeLists.txt、ヘッダー、実装、Windows用起動バッチ（run.bat）を完全収録。
            </p>
          </div>
          <a
            href="/downloads/cpp-projects.zip"
            download="cpp-projects.zip"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold font-mono text-sm transition shadow-lg shadow-cyan-500/30 active:scale-95 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>ZIPをダウンロード</span>
          </a>
        </div>

        {/* ファイルツリー */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-slate-300 space-y-2 mb-5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>cpp-projects/</span>
          </div>
          <div className="pl-5 space-y-1.5">
            <div className="text-amber-300 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter1/ (スパゲティ版: main.cpp, CMakeLists.txt, run.bat)</span>
            </div>
            <div className="text-blue-300 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter2/ (クラス分割版: Player, Invader, Bullet, main, run.bat)</span>
            </div>
            <div className="text-emerald-300 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter3/ (動的生成 &amp; パーティクル版: Particle, Game, etc.)</span>
            </div>
            <div className="text-purple-300 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter4/ (継承 &amp; ポリモーフィズム版: Enemy, Normal, Shield, Ufo, etc.)</span>
            </div>
            <div className="text-cyan-300 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter5/ (スマートポインタ &amp; RAII版: Item, BitDrone, Player, Game, etc.)</span>
            </div>
            <div className="text-amber-400 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter6/ (デザインパターン版: State, Observer, Achievement, Game, etc.)</span>
            </div>
            <div className="text-emerald-400 font-semibold flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>chapter7/ (モダンECS完結版: Entity, Components, Systems, Game, etc.)</span>
            </div>
          </div>
        </div>

        {/* ワンクリックコンパイルコマンド */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400">
            <span>第5章（スマートポインタ＆RAII版）のワンライナーコンパイルコマンド:</span>
            <button
              onClick={handleCopyCmd}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-sans font-medium"
            >
              {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedCmd ? 'コピー完了' : 'コピー'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-emerald-400 whitespace-pre overflow-x-auto">
            {buildCmd}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <a
            href="/downloads/cpp-projects.zip"
            download="cpp-projects.zip"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-mono font-bold transition"
          >
            <Download className="w-4 h-4" />
            <span>cpp-projects.zip を直接ダウンロード</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-mono font-bold transition ml-auto"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
