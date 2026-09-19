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

  // スクロール同期
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
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

  return (
    <div className={`rounded-2xl border border-slate-800 bg-[#050811] overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* エディタツールバー */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs font-mono text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            C++ (C++23)
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {lines.length} 行 / {value.length} 文字
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* フォントサイズ調整 */}
          <button
            type="button"
            onClick={() => setFontSizePx((p) => Math.max(11, p - 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="文字を小さく (A-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 w-6 text-center">{fontSizePx}px</span>
          <button
            type="button"
            onClick={() => setFontSizePx((p) => Math.min(20, p + 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="文字を大きく (A+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-slate-800 mx-1" />

          {/* コピーボタン */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
              title="初期コードに戻す"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">リセット</span>
            </button>
          )}
        </div>
      </div>

      {/* エディタ本体（行番号 ＋ テキストエリア） */}
      <div className="relative flex flex-1 overflow-hidden" style={{ minHeight }}>
        {/* 行番号カラム */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-10 sm:w-12 py-3.5 pl-2 pr-2 text-right bg-[#03060c] text-slate-600 select-none font-mono text-xs border-r border-slate-800/60 overflow-hidden"
          style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.5 }}
        >
          {lines.map((_, i) => (
            <div key={i} className="leading-normal">
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
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full h-full p-3.5 bg-transparent text-cyan-100 font-mono resize-none outline-none leading-normal overflow-auto whitespace-pre selection:bg-cyan-600/40 selection:text-white"
          style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.5 }}
          placeholder="// ここに C++ コードを入力してください..."
        />
      </div>

      {/* フッター小ヒント */}
      <div className="px-3 py-1.5 bg-[#03060c] border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="hidden sm:inline">💡 Tabキーで2文字インデント、Enterで自動インデント</span>
        <span className="ml-auto text-slate-400">GCC (gnu++2b / -O2 -Wall)</span>
      </div>
    </div>
  );
};
