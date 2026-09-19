import React, { useState, useRef, useMemo } from 'react';
import { Copy, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onReset?: () => void;
  readOnly?: boolean;
  minHeight?: string;
  className?: string;
}

export const InteractiveCodeEditor: React.FC<InteractiveCodeEditorProps> = ({
  value,
  onChange,
  onReset,
  readOnly = false,
  minHeight = '320px',
  className = '',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [fontSizePx, setFontSizePx] = useState<number>(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => value.split('\n'), [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };


  // Tabキー、Enterキーによるインテリジェントインデント処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    // Tab キー: 2文字のスペース挿入
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab: 行頭の2スペース削除
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const currentLine = value.substring(lineStart, selectionStart);
        if (currentLine.startsWith('  ')) {
          const newValue = value.substring(0, lineStart) + value.substring(lineStart + 2);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, selectionStart - 2);
          }, 0);
        }
      } else {
        // 通常のTab: 2スペース挿入
        const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
        }, 0);
      }
    }

    // Enter キー: 前の行のインデントを自動引き継ぎ
    if (e.key === 'Enter') {
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(lineStart, selectionStart);
      const match = currentLine.match(/^(\s*)/);
      let indent = match ? match[1] : '';

      // { で終わる行ならさらに2スペース追加
      if (currentLine.trim().endsWith('{')) {
        indent += '  ';
      }

      if (indent.length > 0) {
        e.preventDefault();
        const insertText = '\n' + indent;
        const newValue = value.substring(0, selectionStart) + insertText + value.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + insertText.length;
        }, 0);
      }
    }
  };

  const parsedMinHeight = parseInt(minHeight) || 320;
  const rowHeight = Math.round(fontSizePx * 1.6);
  const totalContentHeight = Math.max(lines.length + 2, 12) * rowHeight + 24;
  const containerHeight = Math.min(520, Math.max(parsedMinHeight, totalContentHeight));

  return (
    <div
      onClick={() => textareaRef.current?.focus()}
      className={`rounded-2xl border border-slate-800 focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#050811] overflow-hidden shadow-2xl flex flex-col transition-all cursor-text ${className}`}
    >
      {/* エディタツールバー */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs font-mono text-slate-400 select-none cursor-default"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            C++ (C++23)
          </span>

          {!readOnly ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold animate-pulse">
              <span>✏️ 直接入力・編集できます</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
              <span>閲覧専用</span>
            </span>
          )}

          <span className="text-[11px] text-slate-500 hidden md:inline">
            {lines.length} 行 / {value.length} 文字
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* フォントサイズ調整 */}
          <button
            type="button"
            onClick={() => setFontSizePx((p) => Math.max(11, p - 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            title="文字を小さく (A-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 w-6 text-center">{fontSizePx}px</span>
          <button
            type="button"
            onClick={() => setFontSizePx((p) => Math.min(20, p + 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            title="文字を大きく (A+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-slate-800 mx-1" />

          {/* コピーボタン */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="コードをコピー"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'コピー完了' : 'コピー'}</span>
          </button>

          {/* 初期化リセット */}
          {onReset && !readOnly && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition cursor-pointer"
              title="初期コードに戻す"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">リセット</span>
            </button>
          )}
        </div>
      </div>

      {/* 入力促進の親切バー */}
      {!readOnly && (
        <div 
          onClick={() => textareaRef.current?.focus()}
          className="px-3 py-1.5 bg-cyan-950/40 border-b border-cyan-500/20 text-cyan-300 text-[11px] font-mono flex items-center justify-between gap-2 select-none cursor-text"
        >
          <span className="flex items-center gap-1.5">
            <span>👇</span>
            <span className="font-semibold">ここをクリックするとカーソルが入り、キーボードでコードを書き換えられます</span>
          </span>
          <span className="text-cyan-400/80 text-[10px] hidden sm:inline">（Tabキーでインデント・Enter自動補完）</span>
        </div>
      )}

      {/* エディタ本体（行番号 ＋ テキストエリアの一体スクロールコンテナ） */}
      <div 
        className="relative flex overflow-auto bg-[#040711]" 
        style={{ height: `${containerHeight}px` }}
      >
        {/* 行番号カラム（stickyで横スクロール時も左端固定） */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          onClick={() => textareaRef.current?.focus()}
          className="w-10 sm:w-12 pt-3 pb-6 pl-2 pr-2 text-right bg-[#03060c] text-slate-600 select-none font-mono text-xs border-r border-slate-800/60 flex-shrink-0 cursor-text sticky left-0 z-10"
          style={{ fontSize: `${fontSizePx}px`, minHeight: `${totalContentHeight}px` }}
        >
          {lines.map((_, i) => (
            <div key={i} style={{ height: `${rowHeight}px`, lineHeight: `${rowHeight}px` }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* 編集テキストエリア */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          rows={Math.max(12, lines.length + 2)}
          className="flex-1 min-w-[500px] w-full pt-3 pb-6 px-3.5 bg-transparent text-cyan-100 font-mono resize-none outline-none whitespace-pre selection:bg-cyan-600/40 selection:text-white caret-cyan-400 focus:caret-cyan-300 border-none leading-none"
          style={{ 
            fontSize: `${fontSizePx}px`, 
            lineHeight: `${rowHeight}px`,
            height: `${totalContentHeight}px`,
          }}
          placeholder="// ここに C++ コードを入力してください..."
        />
      </div>

      {/* フッター小ヒント */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="px-3 py-1.5 bg-[#03060c] border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 cursor-default"
      >
        <span className="hidden sm:inline">💡 コードを修正したら、下の「▶ コードをテスト実行する」ボタンを押してください</span>
        <span className="ml-auto text-slate-400">GCC (gnu++2b / -O2 -Wall)</span>
      </div>
    </div>
  );
};
