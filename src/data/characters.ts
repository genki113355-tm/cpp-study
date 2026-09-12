import { CharacterId } from '../types/curriculum';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  role: string;
  avatarColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  callsign: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  shirokuma: {
    id: 'shirokuma',
    name: 'シロクマ先生 (Ben)',
    callsign: 'POLAR NAVY / ARCHITECT',
    role: '極地艦隊C++指導官',
    avatarColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    borderColor: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300 border border-cyan-500/30',
    description: 'ネイビーの制服を着た歴戦のC++アーキテクト。司令室のレーダーでスパゲティコードを探知し、オブジェクト指向の規律で宇宙インベーダーを迎撃する。'
  },
  penguin: {
    id: 'penguin',
    name: 'ペンギン生徒 (Pippin)',
    callsign: 'NAVY CREW / ROOKIE',
    role: '見習い通信プログラマー',
    avatarColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300 border border-amber-500/30',
    description: 'お揃いの制服と作業ベストを着た熱血クルー。「動けばヨシ！」精神でスパゲティを作ってはシロクマ先生にレーダーで探知され、ハイタッチで設計を体得していく。'
  }
};
