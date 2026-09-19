import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { UmlArrowGuideVisual } from "./uml/UmlArrowGuideVisual";
import { UmlClassBoxVisual } from "./uml/UmlClassBoxVisual";
import { UmlSequenceSvgDiagram } from "./uml/UmlSequenceSvgDiagram";
import { UmlStateSvgDiagram } from "./uml/UmlStateSvgDiagram";

interface RichExplanationProps {
  content: string;
}

export const RichExplanation: React.FC<RichExplanationProps> = ({ content }) => {
  // コンテンツを行単位および特殊ブロック単位で分割してパース
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  let inTable = false;
  let tableRows: string[][] = [];

  const flushCodeBlock = (key: string) => {
    if (codeBuffer.length > 0) {
      const codeText = codeBuffer.join("\n");
      renderedElements.push(
        <div key={key} className="my-4 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
          {codeLang && (
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 border-b border-slate-800 pb-1">
              {codeLang}
            </div>
          )}
          <pre className="whitespace-pre">{codeText}</pre>
        </div>
      );
      codeBuffer = [];
      codeLang = "";
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      const [headerRow, ...bodyRows] = tableRows;
      renderedElements.push(
        <div key={key} className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-md">
          <table className="w-full text-left font-sans text-xs sm:text-sm">
            <thead className="bg-slate-900 text-cyan-300 font-mono border-b border-slate-800">
              <tr>
                {headerRow.map((h, i) => (
                  <th key={i} className="p-3 font-bold align-top whitespace-nowrap sm:whitespace-normal">
                    {renderFormattedText(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 align-top leading-relaxed">
                      {renderFormattedText(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. コードブロック (```) の開始・終了判定
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCodeBlock(`code-${i}`);
      } else {
        if (inTable) {
          inTable = false;
          flushTable(`table-${i}`);
        }
        inCodeBlock = true;
        codeLang = trimmed.replace("```", "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. テーブル行 (| ... |) の判定
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // 区切り行 (| :--- | 等) はスキップ
      if (/^\|[\s\-:]+(\|[\s\-:]+)+\|$/.test(trimmed)) {
        continue;
      }
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable(`table-${i}`);
    }

    // 3. 特殊ダイアグラムコンポーネントタグの検知
    if (trimmed === "::uml-class-box::") {
      renderedElements.push(<UmlClassBoxVisual key={`diag-class-${i}`} />);
      continue;
    }
    if (trimmed === "::uml-arrow-guide::") {
      renderedElements.push(<UmlArrowGuideVisual key={`diag-arrows-${i}`} />);
      continue;
    }
    if (trimmed === "::uml-sequence-sample::") {
      renderedElements.push(
        <UmlSequenceSvgDiagram
          key={`diag-seq-${i}`}
          title="1フレーム更新処理のシーケンス図（SVG幾何ベクトル）"
          subtitle="時間軸に沿った同期メッセージ・戻り値・アクティベーション区間"
          participants={["MainLoop", "Player", "Bullet"]}
          messages={[
            {
              from: "MainLoop",
              to: "Player",
              message: "update(dt)",
              cppCodeSnippet: "player->update(dt);",
            },
            {
              from: "Player",
              to: "Bullet",
              message: "shoot()",
              cppCodeSnippet: "bullet->fire(m_pos);",
            },
            {
              from: "Bullet",
              to: "Player",
              message: "return isFired",
              isReturn: true,
              cppCodeSnippet: "return true;",
            },
            {
              from: "Player",
              to: "MainLoop",
              message: "return void",
              isReturn: true,
            },
          ]}
        />
      );
      continue;
    }
    if (trimmed === "::uml-state-sample::") {
      renderedElements.push(
        <UmlStateSvgDiagram
          key={`diag-state-${i}`}
          title="インベーダーゲームの状態遷移図（SVG幾何ベクトル）"
          subtitle="各状態ノードと、キー入力・被弾・リトライによる双方向遷移パス"
          transitions={[
            { from: "Title", to: "Playing", event: "スペースキー押下" },
            { from: "Playing", to: "Pause", event: "Pキー押下" },
            { from: "Pause", to: "Playing", event: "Pキー再開" },
            { from: "Playing", to: "GameOver", event: "被弾時", guard: "m_hp <= 0" },
            { from: "GameOver", to: "Title", event: "Rキー押下 (リトライ)" },
          ]}
        />
      );
      continue;
    }

    // 空行
    if (!trimmed) {
      renderedElements.push(<div key={`gap-${i}`} className="h-2" />);
      continue;
    }

    // 見出し #### (小見出し)
    if (trimmed.startsWith("####")) {
      const headingText = trimmed.replace(/^####\s*/, "").replace(/^[■\s]*/, "");
      renderedElements.push(
        <h5
          key={`h5-${i}`}
          className="text-base sm:text-lg font-bold text-slate-100 font-mono pt-4 pb-1 flex items-center gap-2.5 text-cyan-200"
        >
          <span className="w-1.5 h-4 bg-cyan-400/80 rounded-sm flex-shrink-0" />
          <span>{renderFormattedText(headingText, true)}</span>
        </h5>
      );
      continue;
    }

    // 見出し ### (大見出し)
    if (trimmed.startsWith("###")) {
      const headingText = trimmed.replace(/^###\s*/, "").replace(/^[■\s]*/, "");
      renderedElements.push(
        <h4
          key={`h4-${i}`}
          className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 font-mono pt-5 pb-2 border-b border-slate-800/80 flex items-center gap-3"
        >
          <span className="w-2.5 h-5 bg-cyan-400 rounded-sm flex-shrink-0" />
          <span>{renderFormattedText(headingText, true)}</span>
        </h4>
      );
      continue;
    }

    // 区切り線 ---
    if (trimmed === "---") {
      renderedElements.push(
        <hr key={`hr-${i}`} className="border-slate-800/80 my-4" />
      );
      continue;
    }

    // リスト項目 - または *
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemContent = trimmed.slice(2);
      renderedElements.push(
        <div key={`li-${i}`} className="flex items-start gap-3 pl-2">
          <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
          <div className="flex-1 text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
            {renderFormattedText(itemContent)}
          </div>
        </div>
      );
      continue;
    }

    // 番号付きリスト 1. 2. 3.
    const orderedMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
    if (orderedMatch) {
      renderedElements.push(
        <div key={`ol-${i}`} className="flex items-start gap-3 pl-2">
          <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs sm:text-sm font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {orderedMatch[1]}
          </span>
          <div className="flex-1 text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
            {renderFormattedText(orderedMatch[2])}
          </div>
        </div>
      );
      continue;
    }

    // 通常段落
    renderedElements.push(
      <p key={`p-${i}`} className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
        {renderFormattedText(trimmed)}
      </p>
    );
  }

  if (inCodeBlock) {
    flushCodeBlock("code-end");
  }
  if (inTable) {
    flushTable("table-end");
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#060a14] border border-cyan-500/25 shadow-xl p-6 md:p-7 my-6">
      <div className="flex items-center gap-2.5 text-cyan-400 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 pb-3 border-b border-cyan-500/20">
        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        <span>設計意図 &amp; アーキテクチャ解説ノート</span>
      </div>

      <div className="space-y-4 font-sans text-base sm:text-lg text-slate-200 leading-relaxed">
        {renderedElements}
      </div>
    </div>
  );
};

// **太字**、`インラインコード`、*イタリック*、および <br> 改行タグのレンダリングヘルパー
function renderFormattedText(text: string, isHeading: boolean = false): React.ReactNode {
  // 1. <br> または <br/> または <br /> で分割
  const brSegments = text.split(/<br\s*\/?>/gi);

  return brSegments.map((segment, segIdx) => {
    // 2. **太字**、`コード`、*斜体* で分割
    const parts = segment.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    const content = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-cyan-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className={
              isHeading
                ? "px-2 py-0.5 rounded bg-slate-950/80 text-cyan-200 font-mono text-[0.9em] border border-cyan-800/60 mx-1 align-baseline inline-block font-bold shadow-sm"
                : "px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-[0.88em] border border-slate-800 mx-0.5 align-baseline inline-block font-medium"
            }
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
        return (
          <em key={i} className="italic text-slate-400">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });

    return (
      <React.Fragment key={segIdx}>
        {segIdx > 0 && <br />}
        {content}
      </React.Fragment>
    );
  });
}

