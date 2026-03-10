export interface Sticker {
  id: string;
  number: number;
  name: string;
  team: string;
  type: 'player' | 'team' | 'special' | 'legend';
  imageUrl?: string;
  isOwned: boolean;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  stage: 'group' | 'round16' | 'quarter' | 'semi' | 'final';
  isCompleted: boolean;
}

export interface UserProgress {
  ownedStickers: string[];
  totalStickers: number;
  lastUpdated: string;
}
