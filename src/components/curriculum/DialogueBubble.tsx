import React from 'react';
import { DialogueItem } from '../../types/curriculum';
import { CHARACTERS } from '../../data/characters';
import { Avatar } from '../common/Avatar';

interface DialogueBubbleProps {
  dialogue: DialogueItem;
}

export const DialogueBubble: React.FC<DialogueBubbleProps> = ({ dialogue }) => {
  const speaker = CHARACTERS[dialogue.speaker];
  const isShirokuma = dialogue.speaker === 'shirokuma';

  return (
    <div
      className={`flex items-start gap-3 my-4 transition-all duration-200 ${
        isShirokuma ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* アバター */}
      <div className="flex flex-col items-center">
        <Avatar
          character={dialogue.speaker}
          emotion={dialogue.emotion}
          size="md"
        />
        <span
          className={`text-xs font-semibold mt-1.5 px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
            isShirokuma
              ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
              : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
          }`}
        >
          {speaker.name}
        </span>
      </div>

      {/* 吹き出し本体（広々とした最大幅） */}
      <div
        className={`relative max-w-3xl lg:max-w-4xl rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md border ${
          isShirokuma
            ? 'bg-gradient-to-br from-[#0c1424] to-[#080d18] text-slate-100 border-cyan-500/40 rounded-tl-sm shadow-cyan-950/20'
            : 'bg-gradient-to-br from-[#16121f] to-[#0d0a14] text-slate-100 border-amber-500/40 rounded-tr-sm shadow-amber-950/20'
        }`}
      >
        {/* 会話テキスト */}
        <p className="text-base sm:text-lg lg:text-[19px] leading-relaxed tracking-normal whitespace-pre-line font-sans font-normal text-slate-100">
          {dialogue.text}
        </p>

        {/* 心の声 / 状況メモ */}
        {dialogue.sideNote && (
          <div
            className={`mt-3.5 pt-3 border-t text-xs sm:text-sm flex items-center gap-2.5 font-sans ${
              isShirokuma
                ? 'border-cyan-500/20 text-cyan-300/90 bg-cyan-950/20 px-3.5 py-2 rounded-xl'
                : 'border-amber-500/20 text-amber-300/90 bg-amber-950/20 px-3.5 py-2 rounded-xl'
            }`}
          >
            <span className="text-base">💭</span>
            <span className="italic">{dialogue.sideNote}</span>
          </div>
        )}
      </div>
    </div>
  );
};

