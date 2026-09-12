import React from 'react';
import { CharacterId, CharacterEmotion } from '../../types/curriculum';

interface AvatarProps {
  character: CharacterId;
  emotion?: CharacterEmotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  character,
  emotion = 'normal',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  // 表情による画像ソースとクリッピング位置の決定
  // 画像1: /images/characters_mission.jpg (真剣・指差し・探検)
  // 画像2: /images/characters_victory.png (満面の笑顔・ハイタッチ・制帽)
  const isVictoryMood = emotion === 'happy' || emotion === 'smug';

  let bgImage = isVictoryMood ? '/images/characters_victory.png' : '/images/characters_mission.jpg';
  let bgSize = '320%';
  let bgPos = '0% 0%';

  if (character === 'shirokuma') {
    if (isVictoryMood) {
      // Victory: シロクマの笑顔と制帽
      bgSize = '340%';
      bgPos = '26% 42%';
    } else {
      // Mission: シロクマのつぶらな瞳とセーラー襟
      bgSize = '330%';
      bgPos = '20% 32%';
    }
  } else {
    // ペンギン生徒
    if (isVictoryMood) {
      // Victory: ペンギンのハイタッチ大笑顔
      bgSize = '360%';
      bgPos = '77% 48%';
    } else {
      // Mission: ペンギンの元気な笑顔とニット帽
      bgSize = '370%';
      bgPos = '86% 54%';
    }
  }

  // 表情エモートアイコン
  const getEmoteIcon = () => {
    switch (emotion) {
      case 'happy':
      case 'smug':
        return '✨';
      case 'shocked':
        return '⚡';
      case 'sweating':
        return '💦';
      case 'question':
        return '❓';
      case 'teaching':
        return '💡';
      case 'thinking':
        return '💭';
      default:
        return null;
    }
  };

  const emote = getEmoteIcon();

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${sizeClasses} ${className}`}>
      {/* 司令室ネオングロー枠 */}
      <div
        className={`w-full h-full rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-200 ${
          character === 'shirokuma'
            ? 'border-cyan-400 shadow-cyan-900/60 ring-2 ring-cyan-500/20'
            : 'border-amber-400 shadow-amber-900/60 ring-2 ring-amber-500/20'
        }`}
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 役職バッジ（右下） */}
      <span
        className={`absolute -bottom-1 -right-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shadow border z-10 ${
          character === 'shirokuma'
            ? 'bg-cyan-500 text-slate-950 border-cyan-300'
            : 'bg-amber-500 text-slate-950 border-amber-300'
        }`}
      >
        {character === 'shirokuma' ? '指導官' : 'クルー'}
      </span>

      {/* 表情エモートバッジ（左上） */}
      {emote && (
        <span className="absolute -top-1.5 -left-1.5 text-xs bg-slate-900/90 rounded-full w-5 h-5 flex items-center justify-center shadow border border-slate-700 animate-bounce">
          {emote}
        </span>
      )}
    </div>
  );
};
