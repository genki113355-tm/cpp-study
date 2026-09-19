import React, { useState, useMemo, useEffect } from 'react';
import { Copy, Check, FileText, FileCode, Sparkles, AlertTriangle } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { CodeFile, CodeHighlightTarget } from '../../types/curriculum';

interface CodeViewerProps {
  files: CodeFile[];
  targetHighlight?: CodeHighlightTarget;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, targetHighlight }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [highlightCoreLines, setHighlightCoreLines] = useState<boolean>(true);
  const [blinkLineNumber, setBlinkLineNumber] = useState<number | null>(null);

  const currentFile = files[activeTab] || files[0];

  const isAntiPatternFile = useMemo(() => {
    if (!currentFile) return false;
    const name = currentFile.filename.toLowerCase();
    const desc = (currentFile.description || '').toLowerCase();
    const code = currentFile.code;
    return (
      name.includes('spaghetti') ||
      name.includes('legacy') ||
      name.includes('before') ||
      desc.includes('スパゲティ') ||
      desc.includes('アンチパターン') ||
      desc.includes('破綻') ||
      desc.includes('悪い例') ||
      code.includes('// ❌') ||
      code.includes('// 【アンチパターン】') ||
      code.includes('// ※悪い例')
    );
  }, [currentFile]);

  const handleCopy = async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const getFileBadgeColor = (filename: string) => {
    if (filename.endsWith('.h')) return 'bg-purple-950/70 text-purple-300 border-purple-500/40';
    if (filename === 'main.cpp') return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40';
    if (filename.endsWith('.cpp')) return 'bg-blue-950/70 text-blue-300 border-blue-500/40';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const getFileBadgeLabel = (filename: string) => {
    if (filename.endsWith('.h')) return 'ヘッダ (宣言)';
    if (filename === 'main.cpp') return 'エントリポイント';
    if (filename.endsWith('.cpp')) return '実装 (定義)';
    return 'ソース';
  };

  // C++設計の核心行判定
  const isKeyLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (trimmed.includes('// ★') || trimmed.includes('// 【核心】') || trimmed.includes('// [核心]')) return true;
    if (trimmed.startsWith('virtual ') || trimmed.includes(' override;') || trimmed.includes(' override = 0;')) return true;
    if (trimmed.includes('std::unique_ptr<') || trimmed.includes('std::make_unique<') || trimmed.includes('std::shared_ptr<')) return true;
    if (trimmed.includes('std::move(') || trimmed.includes('&&') && !trimmed.includes('&& ') && !trimmed.startsWith('if (')) return true;
    if (trimmed.startsWith('class ') && trimmed.includes(' : public ')) return true;
    if (trimmed.startsWith('private:') || trimmed.startsWith('protected:')) return true;
    if (trimmed.includes('addComponent<') || trimmed.includes('getComponent<')) return true;
    if (trimmed.includes('IObserver') || trimmed.includes('IState') || trimmed.includes('notify(')) return true;
    return false;
  };

  // 各行をPrismでハイライトしてキャッシュ
  const processedLines = useMemo(() => {
    if (!currentFile?.code) return [];
    const lines = currentFile.code.split('\n');
    return lines.map((line, index) => {
      let html = '';
      try {
        html = Prism.highlight(line || ' ', Prism.languages.cpp, 'cpp');
      } catch {
        html = line || ' ';
      }
      return {
        lineNumber: index + 1,
        rawText: line,
        html,
        isCore: isKeyLine(line),
      };
    });
  }, [currentFile]);

  const coreLineCount = processedLines.filter(l => l.isCore).length;

  // UMLなど外部からのハイライト要求に反応してタブ切り替え＆スクロール
  useEffect(() => {
    if (!targetHighlight) return;

    let targetTab = activeTab;
    if (targetHighlight.filename) {
      const foundIndex = files.findIndex(f => f.filename === targetHighlight.filename);
      if (foundIndex !== -1) {
        targetTab = foundIndex;
        setActiveTab(foundIndex);
      }
    }

    let targetLineNum = targetHighlight.line;
    if (!targetLineNum && targetHighlight.keyword && files[targetTab]) {
      const lines = files[targetTab].code.split('\n');
      const foundLineIdx = lines.findIndex(l => l.includes(targetHighlight.keyword!));
      if (foundLineIdx !== -1) {
        targetLineNum = foundLineIdx + 1;
      }
    }

    if (targetLineNum) {
      setBlinkLineNumber(targetLineNum);
      setTimeout(() => {
        const lineEl = document.getElementById(`code-line-${targetTab}-${targetLineNum}`);
        if (lineEl) {
          lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);

      const timer = setTimeout(() => {
        setBlinkLineNumber(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [targetHighlight, files]);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0c121e] shadow-2xl my-6">
      {/* 上部ヘッダー：タブバー */}
      <div className="flex items-center justify-between bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar select-none">
          {files.map((file, idx) => {
            const isActive = idx === activeTab;
            const isHeader = file.filename.endsWith('.h');
            return (
              <button
                key={file.filename}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono transition-all duration-150 flex-shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isHeader ? (
                  <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                ) : (
                  <FileCode className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                )}
                <span>{file.filename}</span>
                {file.isMain && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* コントロール群（核心行ハイライト ＆ コピーボタン） */}
        <div className="flex items-center gap-2 flex-wrap">
          {coreLineCount > 0 && (
            <button
              onClick={() => setHighlightCoreLines(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-mono transition border active:scale-95 ${
                highlightCoreLines
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-inner'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="設計の核心行をハイライト表示"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>核心行ハイライト</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-900/60 text-[10px] font-bold">
                {coreLineCount}
              </span>
            </button>
          )}

          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-lg border font-medium ${getFileBadgeColor(
              currentFile.filename
            )}`}
          >
            {getFileBadgeLabel(currentFile.filename)}
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition border border-slate-700 active:scale-95 shadow-sm font-mono font-medium"
            title="コードをクリップボードにコピー"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">コピー完了!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>コピー</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ファイルの簡易説明バー */}
      {currentFile.description && (
        <div className="px-5 py-2 bg-slate-900/40 border-b border-slate-800/60 text-xs sm:text-sm text-slate-300 flex items-center gap-2.5 font-sans">
          <span className="text-cyan-400 font-mono font-bold">▸</span>
          <span>{currentFile.description}</span>
        </div>
      )}

      {/* アンチパターン警告バナー（学習用コードの誤用・コピペ事故防止） */}
      {isAntiPatternFile && (
        <div className="px-5 py-2.5 bg-rose-950/80 border-b border-rose-500/50 text-xs text-rose-200 flex items-center justify-between gap-3 font-sans shadow-inner">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-rose-900 text-rose-100 font-mono font-bold text-[10px] flex items-center gap-1 border border-rose-600/50 shadow-sm">
              <AlertTriangle className="w-3 h-3 text-rose-300" />
              <span>学習用アンチパターン</span>
            </span>
            <span className="leading-relaxed">
              このファイルは設計の破綻・問題点（グローバル依存、生ポインタ、結合度過多など）を体感するための教材用コードです。<strong>実務プロダクション環境へのコピペ転用は避けてください。</strong>
            </span>
          </div>
        </div>
      )}

      {/* コード表示エリア（行番号 ＆ 核心行ハイライト付き） */}
      <div className="relative overflow-x-auto max-h-[700px] scrollbar-thin py-3">
        <pre className="!m-0 !p-0 !bg-transparent text-xs sm:text-sm md:text-base font-mono leading-relaxed">
          {processedLines.map((line) => {
            const isHighlighted = highlightCoreLines && line.isCore;
            const isBlinking = blinkLineNumber === line.lineNumber;
            return (
              <div
                id={`code-line-${activeTab}-${line.lineNumber}`}
                key={line.lineNumber}
                className={`flex items-stretch transition-all duration-300 ${
                  isBlinking
                    ? 'bg-amber-500/30 border-l-4 border-amber-400 pl-3 pr-4 shadow-lg shadow-amber-500/20'
                    : isHighlighted
                    ? 'bg-cyan-500/10 border-l-4 border-cyan-400 pl-3 pr-4'
                    : 'border-l-4 border-transparent pl-3 pr-4 hover:bg-slate-800/30'
                }`}
              >
                {/* 行番号 */}
                <span className={`w-10 text-right pr-4 select-none flex-shrink-0 text-xs sm:text-sm font-mono ${
                  isBlinking ? 'text-amber-400 font-black' : isHighlighted ? 'text-cyan-400 font-bold' : 'text-slate-600'
                }`}>
                  {line.lineNumber}
                </span>

                {/* コード本文 */}
                <code
                  className="flex-1 whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: line.html }}
                />
              </div>
            );
          })}
        </pre>
      </div>

      {/* 下部ステータス */}
      <div className="px-5 py-1.5 bg-slate-950 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-300">{currentFile.filename}</span>
          {highlightCoreLines && coreLineCount > 0 && (
            <span className="text-cyan-400 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>設計核心行: {coreLineCount} 行強調中</span>
            </span>
          )}
        </div>
        <span>{processedLines.length} 行</span>
      </div>
    </div>
  );
};
