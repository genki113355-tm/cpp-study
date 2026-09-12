import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  UmlClassMember,
  UmlClassItem,
  CodeFile,
  CodeHighlightTarget,
} from "../../../types/curriculum";
import { X, Copy, Check, FileCode, FileText, ArrowDownRight, Sparkles } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

interface MemberCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: UmlClassMember | null;
  cls: UmlClassItem | null;
  codeFiles?: CodeFile[];
  onJumpToEditor?: (target: CodeHighlightTarget) => void;
}

export const MemberCodeModal: React.FC<MemberCodeModalProps> = ({
  isOpen,
  onClose,
  member,
  cls,
  codeFiles = [],
  onJumpToEditor,
}) => {
  const [copied, setCopied] = useState(false);
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

    // ファイル名が一致していて行番号が指定されている場合
    if (
      member.codeLineRef?.filename === currentFile.filename &&
      member.codeLineRef.line
    ) {
      return member.codeLineRef.line;
    }

    // キーワードまたは関数名での行特定
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

  // モーダルオープン時に対象行へモーダル内スクロール
  useEffect(() => {
    if (!isOpen || !targetLineNumber || !codeContainerRef.current) return;

    const timer = setTimeout(() => {
      const targetElement = document.getElementById(
        `modal-line-${targetLineNumber}`
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
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, targetLineNumber, activeFileIndex]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !member || !cls) return null;

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
    if (onJumpToEditor && currentFile) {
      onJumpToEditor({
        filename: currentFile.filename,
        line: targetLineNumber || undefined,
        keyword: member.name,
        timestamp: Date.now(),
      });
      onClose();
    }
  };

  // 可視性バッジのカラー
  const getVisBadge = () => {
    switch (member.visibility) {
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

  const vis = getVisBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* 背景クリックで閉じる */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* モーダルカード本体 */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090d16] border border-cyan-500/40 shadow-2xl overflow-hidden z-10 animate-scaleUp">
        {/* モーダルヘッダー */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${vis.bg}`}
              >
                {vis.label}
              </span>
              <span className="text-xs font-mono text-slate-400">
                クラス: <strong className="text-white">{cls.name}</strong>
              </span>
              {member.codeLineRef?.line && (
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  行: L{member.codeLineRef.line}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold font-mono text-white tracking-tight break-all">
                <span className="text-cyan-400">{cls.name}::</span>
                <span>{member.name}</span>
              </h3>
              <span className="text-xs sm:text-sm font-mono text-slate-400">
                : <span className="text-emerald-300">{member.type}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="閉じる (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ファイルタブバー（複数ファイルがある場合） */}
        {relevantFiles.length > 0 ? (
          <div className="flex items-center justify-between bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex-wrap gap-2">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full">
              {relevantFiles.map((file, idx) => {
                const isActive = idx === activeFileIndex;
                const isHeader = file.filename.endsWith(".h");
                const isMatchingTarget =
                  member.codeLineRef?.filename === file.filename;

                return (
                  <button
                    key={file.filename}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      isActive
                        ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold shadow"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {isHeader ? (
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>{file.filename}</span>
                    {isMatchingTarget && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {targetLineNumber && (
              <span className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>該当コード行（L{targetLineNumber}）へ自動フォーカス中</span>
              </span>
            )}
          </div>
        ) : null}

        {/* ソースコード表示エリア */}
        <div
          ref={codeContainerRef}
          className="flex-1 overflow-y-auto font-mono text-xs sm:text-[13px] bg-[#070b14] p-4 sm:p-6"
          style={{ minHeight: "220px", maxHeight: "480px" }}
        >
          {currentFile ? (
            <pre className="!bg-transparent !p-0 !m-0">
              <code>
                {highlightedLines.map((line) => (
                  <div
                    key={line.lineNum}
                    id={`modal-line-${line.lineNum}`}
                    className={`flex items-start px-2 py-0.5 rounded transition-all ${
                      line.isTarget
                        ? "bg-cyan-950/70 border-l-4 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-950/40"
                        : "hover:bg-slate-900/60 text-slate-300"
                    }`}
                  >
                    {/* 行番号 */}
                    <span
                      className={`w-10 sm:w-12 shrink-0 select-none text-right pr-4 ${
                        line.isTarget
                          ? "text-cyan-400 font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      {line.lineNum}
                    </span>

                    {/* コードテキスト（Prismシンタックスハイライト適用） */}
                    <span
                      className="flex-1 overflow-x-auto whitespace-pre leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: line.html }}
                    />
                  </div>
                ))}
              </code>
            </pre>
          ) : (
            <div className="py-12 text-center text-slate-400 font-mono text-sm space-y-2">
              <p>このメンバのソースコードファイルは現在準備中です。</p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 inline-block text-left text-xs text-emerald-300 mt-2">
                <code>
                  {member.visibility === "+" ? "public" : "private"}:
                  <br />
                  &nbsp;&nbsp;{member.type} {member.name};
                </code>
              </div>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!currentFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all disabled:opacity-50"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-cyan-100 transition-all"
                title="ページ下の全体エディタへ移動して確認します"
              >
                <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>全体エディタで開く ↓</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
