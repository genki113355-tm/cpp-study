import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

interface RichExplanationProps {
  content: string;
}

export const RichExplanation: React.FC<RichExplanationProps> = ({ content }) => {
  // 簡易マークダウンパーサー（見出し、箇条書き、太字、インラインコードを美しく整形）
  const lines = content.split('\n');

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#060a14] border border-cyan-500/25 shadow-xl p-6 md:p-7 my-6">
      <div className="flex items-center gap-2.5 text-cyan-400 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 pb-3 border-b border-cyan-500/20">
        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        <span>設計意図 &amp; アーキテクチャ解説ノート</span>
      </div>

      <div className="space-y-4 font-sans text-base sm:text-lg text-slate-200 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // 空行
          if (!trimmed) return <div key={idx} className="h-2" />;

          // 見出し ###
          if (trimmed.startsWith('###')) {
            const headingText = trimmed.replace(/^###\s*/, '').replace(/^[■\s]*/, '');
            return (
              <h4 key={idx} className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 font-mono pt-5 pb-2 border-b border-slate-800/80 flex items-center gap-3">
                <span className="w-2.5 h-5 bg-cyan-400 rounded-sm" />
                <span>{headingText}</span>
              </h4>
            );
          }

          // リスト項目 - または *
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const itemContent = trimmed.slice(2);
            return (
              <div key={idx} className="flex items-start gap-3 pl-2">
                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div className="flex-1 text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
                  {renderFormattedText(itemContent)}
                </div>
              </div>
            );
          }

          // 番号付きリスト 1. 2. 3.
          const orderedMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
          if (orderedMatch) {
            return (
              <div key={idx} className="flex items-start gap-3 pl-2">
                <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs sm:text-sm font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {orderedMatch[1]}
                </span>
                <div className="flex-1 text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
                  {renderFormattedText(orderedMatch[2])}
                </div>
              </div>
            );
          }

          // 通常段落
          return (
            <p key={idx} className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
              {renderFormattedText(trimmed)}
            </p>
          );
        })}
      </div>
    </div>
  );
};

// **太字** と `インラインコード` のレンダリングヘルパー
function renderFormattedText(text: string) {
  // **bold** の分割
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-cyan-200">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs sm:text-sm border border-slate-800 mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

