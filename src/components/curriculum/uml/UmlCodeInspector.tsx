import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  UmlClassMember,
  UmlClassItem,
  CodeFile,
  CodeHighlightTarget,
} from "../../../types/curriculum";
import { Copy, Check, FileCode, FileText, ArrowDownRight, Sparkles, X, Code2, ChevronDown, ChevronUp } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

interface UmlCodeInspectorProps {
  member: UmlClassMember | null;
  cls: UmlClassItem | null;
  codeFiles?: CodeFile[];
  onClose?: () => void;
  onJumpToEditor?: (target: CodeHighlightTarget) => void;
}

export const UmlCodeInspector: React.FC<UmlCodeInspectorProps> = ({
  member,
  cls,
  codeFiles = [],
  onClose,
  onJumpToEditor,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        `inspector-line-${targetLineNumber}`
      );
      if (targetElement && codeContainerRef.current) {
        const container = codeContainerRef.current;
        const targetTop = targetElement.offsetTop;
        const containerHeight = container.clientHeight;
        container.scrollTo({
          top: Math.max(0, targetTop - containerHeight / 2 + 20),
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

  if (!member || !cls) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-4 text-center text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>上のクラス図内の属性や操作をクリックすると、ここにC++コードが並んで表示されます</span>
      </div>
    );
  }

  const vis = getVisBadge(member.visibility);

  return (
    <div className="rounded-2xl border border-cyan-500/50 bg-[#090d18] shadow-2xl overflow-hidden transition-all duration-200">
      {/* インスペクタヘッダー */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="flex items-center gap-1.5 bg-cyan-950/80 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-xs font-mono font-bold">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>コード並列インスペクタ</span>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${vis.bg}`}
          >
            {vis.label}
          </span>

          <div className="flex items-baseline gap-1.5 font-mono text-xs sm:text-sm">
            <span className="text-cyan-400 font-bold">{cls.name}::</span>
            <span className="text-white font-bold">{member.name}</span>
            <span className="text-slate-400">:</span>
            <span className="text-emerald-300">{member.type}</span>
          </div>

          {member.codeLineRef?.line && (
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              L{member.codeLineRef.line}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono flex items-center gap-1"
            title={isCollapsed ? "展開する" : "折りたたむ"}
          >
            {isCollapsed ? (
              <>
                <span>展開</span>
                <ChevronDown className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>最小化</span>
                <ChevronUp className="w-4 h-4" />
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* ファイルタブバー */}
          {relevantFiles.length > 0 && (
            <div className="flex items-center justify-between bg-slate-950/90 border-b border-slate-800/90 px-3.5 py-1.5 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                {relevantFiles.map((file, idx) => {
                  const isActive = idx === activeFileIndex;
                  const isHeader = file.filename.endsWith(".h");
                  const isTarget = member.codeLineRef?.filename === file.filename;

                  return (
                    <button
                      key={file.filename}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        isActive
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      {isHeader ? (
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
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
                <span className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1 hidden sm:flex">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>該当コード（L{targetLineNumber}）へ自動フォーカス中</span>
                </span>
              )}
            </div>
          )}

          {/* ソースコード表示エリア */}
          <div
            ref={codeContainerRef}
            className="overflow-y-auto font-mono text-xs sm:text-[13px] bg-[#060911] p-3 sm:p-5"
            style={{ maxHeight: "320px", minHeight: "180px" }}
          >
            {currentFile ? (
              <pre className="!bg-transparent !p-0 !m-0">
                <code>
                  {highlightedLines.map((line) => (
                    <div
                      key={line.lineNum}
                      id={`inspector-line-${line.lineNum}`}
                      className={`flex items-start px-2 py-0.5 rounded transition-all ${
                        line.isTarget
                          ? "bg-cyan-950/70 border-l-4 border-cyan-400 text-white font-bold shadow-md shadow-cyan-950/40"
                          : "hover:bg-slate-900/60 text-slate-300"
                      }`}
                    >
                      {/* 行番号 */}
                      <span
                        className={`w-9 sm:w-11 shrink-0 select-none text-right pr-3.5 ${
                          line.isTarget
                            ? "text-cyan-400 font-bold"
                            : "text-slate-600"
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
              <div className="py-8 text-center text-slate-400 font-mono text-xs space-y-2">
                <p>このメンバのソースコードファイルは現在準備中です。</p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 inline-block text-left text-xs text-emerald-300 mt-1">
                  <code>
                    {member.visibility === "+" ? "public" : "private"}:
                    <br />
                    &nbsp;&nbsp;{member.type} {member.name};
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* インスペクタフッター */}
          <div className="p-2.5 sm:p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!currentFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>ファイルをコピー</span>
                  </>
                )}
              </button>

              {onJumpToEditor && currentFile && (
                <button
                  onClick={handleJumpToBottomEditor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 transition-all"
                  title="ページ下の全体エディタへスクロール移動します"
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>下の全体エディタで確認 ↓</span>
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              クラス図の別のメンバをクリックすると、即座にコードが切り替わります
            </span>
          </div>
        </>
      )}
    </div>
  );
};
