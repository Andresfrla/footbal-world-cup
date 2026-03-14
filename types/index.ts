export type StickerStatus = 'missing' | 'owned' | 'duplicate';

export interface Sticker {
  id: string;
  number: number;
  name: string;
  team: string;
  type: 'player' | 'team' | 'special' | 'legend';
  imageUrl?: string;
  status: StickerStatus;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  stage: string;
  isCompleted: boolean;
  stadium?: string;
  group?: string;
}

export interface UserProgress {
  ownedStickers: string[];
  totalStickers: number;
  lastUpdated: string;
}
