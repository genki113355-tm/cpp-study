import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  UmlClassMember,
  UmlClassItem,
  CodeFile,
  CodeHighlightTarget,
} from "../../../types/curriculum";
import {
  Copy,
  Check,
  FileCode,
  FileText,
  ArrowDownRight,
  Sparkles,
  X,
  ArrowLeftRight,
  Minus,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

interface UmlCodeInspectorProps {
  member: UmlClassMember | null;
  cls: UmlClassItem | null;
  codeFiles?: CodeFile[];
  position?: { left: number; top: number; width: number } | null;
  onClose?: () => void;
  onFlipPosition?: () => void;
  onJumpToEditor?: (target: CodeHighlightTarget) => void;
}

export const UmlCodeInspector: React.FC<UmlCodeInspectorProps> = ({
  member,
  cls,
  codeFiles = [],
  position,
  onClose,
  onFlipPosition,
  onJumpToEditor,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // 対象クラスに関連するファイル群を抽出（例: Playerなら Player.h, Player.cpp）
  const relevantFiles = useMemo(() => {
    if (!cls || codeFiles.length === 0) return [];
    const clsLower = cls.name.toLowerCase();
    const matches = codeFiles.filter((f) =>
      f.filename.toLowerCase().includes(clsLower)
    );
    return matches.length > 0 ? matches : codeFiles;
  }, [cls, codeFiles]);

  // アクティブなファイルインデックス
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // member または cls が変わったときに最適な初期ファイルを選択
  useEffect(() => {
    if (!member || relevantFiles.length === 0) return;

    if (member.codeLineRef?.filename) {
      const idx = relevantFiles.findIndex(
        (f) => f.filename === member.codeLineRef?.filename
      );
      if (idx !== -1) {
        setActiveFileIndex(idx);
        return;
      }
    }

    // デフォルトで実装 (.cpp) またはヘッダ (.h)
    const cppIdx = relevantFiles.findIndex((f) => f.filename.endsWith(".cpp"));
    if (cppIdx !== -1) {
      setActiveFileIndex(cppIdx);
    } else {
      setActiveFileIndex(0);
    }
  }, [member, relevantFiles]);

  const currentFile = relevantFiles[activeFileIndex];

  // 対象行番号の特定
  const targetLineNumber = useMemo(() => {
    if (!member || !currentFile) return null;

    if (
      member.codeLineRef?.filename === currentFile.filename &&
      member.codeLineRef.line
    ) {
      return member.codeLineRef.line;
    }

    const lines = currentFile.code.split("\n");
    const keyword = member.codeLineRef?.keyword || member.name.replace(/\(.*\)/, "").trim();
    if (keyword) {
      const foundIdx = lines.findIndex((l) => l.includes(keyword));
      if (foundIdx !== -1) {
        return foundIdx + 1;
      }
    }

    return member.codeLineRef?.line || null;
  }, [member, currentFile]);

  // Prismによるシンタックスハイライト行リストの生成
  const highlightedLines = useMemo(() => {
    if (!currentFile?.code) return [];
    const lines = currentFile.code.split("\n");
    return lines.map((line, index) => {
      let html = "";
      try {
        html = Prism.highlight(line || " ", Prism.languages.cpp, "cpp");
      } catch {
        html = line || " ";
      }
      return {
        lineNum: index + 1,
        raw: line,
        html,
        isTarget: targetLineNumber === index + 1,
      };
    });
  }, [currentFile, targetLineNumber]);

  // 選択変更時に対象行へコードブロック内スクロール
  useEffect(() => {
    if (!targetLineNumber || !codeContainerRef.current) return;

    const timer = setTimeout(() => {
      const targetElement = document.getElementById(
        `popover-line-${targetLineNumber}`
      );
      if (targetElement && codeContainerRef.current) {
        const container = codeContainerRef.current;
        const targetTop = targetElement.offsetTop;
        const containerHeight = container.clientHeight;
        container.scrollTo({
          top: Math.max(0, targetTop - containerHeight / 2 + 15),
          behavior: "smooth",
        });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [targetLineNumber, activeFileIndex, member]);

  const handleCopy = async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJumpToBottomEditor = () => {
    if (onJumpToEditor && currentFile && member) {
      onJumpToEditor({
        filename: currentFile.filename,
        line: targetLineNumber || undefined,
        keyword: member.name,
        timestamp: Date.now(),
      });
    }
  };

  // 可視性バッジのカラー
  const getVisBadge = (vis?: string) => {
    switch (vis) {
      case "+":
        return {
          label: "public (+)",
          bg: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
        };
      case "-":
        return {
          label: "private (-)",
          bg: "bg-red-950 text-red-300 border-red-500/40",
        };
      case "#":
      default:
        return {
          label: "protected (#)",
          bg: "bg-amber-950 text-amber-300 border-amber-500/40",
        };
    }
  };

  if (!member || !cls) return null;

  const vis = getVisBadge(member.visibility);

  // 最小化状態のピル表示
  if (isMinimized) {
    return (
      <div
        className="absolute z-40 rounded-xl bg-slate-900/95 border border-cyan-500/60 shadow-xl px-3 py-1.5 flex items-center gap-2 font-mono text-xs text-white"
        style={{
          left: position ? position.left : 40,
          top: position ? position.top : 40,
        }}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-cyan-300 font-bold">{cls.name}::{member.name}</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-[11px] text-cyan-200 ml-1"
        >
          展開 ⤢
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5"
            title="閉じる"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="absolute z-40 rounded-2xl border border-cyan-500/60 bg-[#090e1a]/95 backdrop-blur-md shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-all duration-200"
      style={{
        left: position ? position.left : 40,
        top: position ? position.top : 40,
        width: position ? position.width : 460,
        maxHeight: "380px",
      }}
    >
      {/* ポップアップヘッダー */}
      <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${vis.bg}`}
          >
            {vis.label}
          </span>

          <div className="flex items-baseline gap-1 font-mono text-xs">
            <span className="text-cyan-400 font-bold">{cls.name}::</span>
            <span className="text-white font-bold truncate">{member.name}</span>
            <span className="text-slate-500">:</span>
            <span className="text-emerald-300 text-[11px]">{member.type}</span>
          </div>

          {member.codeLineRef?.line && (
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40 shrink-0">
              L{member.codeLineRef.line}
            </span>
          )}
        </div>

        {/* コントロールボタン群 */}
        <div className="flex items-center gap-1 shrink-0">
          {onFlipPosition && (
            <button
              onClick={onFlipPosition}
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              title="ポップアップの位置を反対側へ反転"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="最小化"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="閉じる"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ファイルタブバー */}
      {relevantFiles.length > 0 && (
        <div className="flex items-center justify-between bg-slate-950/90 border-b border-slate-800/90 px-3 py-1 flex-wrap gap-1.5 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            {relevantFiles.map((file, idx) => {
              const isActive = idx === activeFileIndex;
              const isHeader = file.filename.endsWith(".h");
              const isTarget = member.codeLineRef?.filename === file.filename;

              return (
                <button
                  key={file.filename}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    isActive
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  {isHeader ? (
                    <FileText className="w-3 h-3 text-purple-400" />
                  ) : (
                    <FileCode className="w-3 h-3 text-cyan-400" />
                  )}
                  <span>{file.filename}</span>
                  {isTarget && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {targetLineNumber && (
            <span className="text-[10px] font-mono text-cyan-400/90 flex items-center gap-1 hidden sm:flex">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>L{targetLineNumber} 該当行</span>
            </span>
          )}
        </div>
      )}

      {/* ソースコード表示エリア */}
      <div
        ref={codeContainerRef}
        className="flex-1 overflow-y-auto font-mono text-xs bg-[#060911] p-3"
        style={{ minHeight: "150px", maxHeight: "230px" }}
      >
        {currentFile ? (
          <pre className="!bg-transparent !p-0 !m-0">
            <code>
              {highlightedLines.map((line) => (
                <div
                  key={line.lineNum}
                  id={`popover-line-${line.lineNum}`}
                  className={`flex items-start px-1.5 py-0.5 rounded transition-all ${
                    line.isTarget
                      ? "bg-cyan-950/80 border-l-4 border-cyan-400 text-white font-bold shadow-md shadow-cyan-950/40"
                      : "hover:bg-slate-900/60 text-slate-300"
                  }`}
                >
                  {/* 行番号 */}
                  <span
                    className={`w-8 shrink-0 select-none text-right pr-2.5 ${
                      line.isTarget ? "text-cyan-400 font-bold" : "text-slate-600"
                    }`}
                  >
                    {line.lineNum}
                  </span>

                  {/* コード行 */}
                  <span
                    className="flex-1 overflow-x-auto whitespace-pre leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line.html }}
                  />
                </div>
              ))}
            </code>
          </pre>
        ) : (
          <div className="py-6 text-center text-slate-400 font-mono text-xs space-y-1">
            <p>このメンバのソースコードファイルは現在準備中です。</p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 inline-block text-left text-xs text-emerald-300 mt-1">
              <code>
                {member.visibility === "+" ? "public" : "private"}:
                <br />
                &nbsp;&nbsp;{member.type} {member.name};
              </code>
            </div>
          </div>
        )}
      </div>

      {/* ポップアップフッター */}
      <div className="p-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between flex-wrap gap-1.5 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            disabled={!currentFile}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>コピー</span>
              </>
            )}
          </button>

          {onJumpToEditor && currentFile && (
            <button
              onClick={handleJumpToBottomEditor}
              className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 transition-all"
              title="ページ下の全体エディタへ移動します"
            >
              <ArrowDownRight className="w-3 h-3 text-cyan-400" />
              <span>エディタで確認 ↓</span>
            </button>
          )}
        </div>

        <span className="text-[10px] text-slate-500">
          別のメンバをクリックで切替
        </span>
      </div>
    </div>
  );
};
