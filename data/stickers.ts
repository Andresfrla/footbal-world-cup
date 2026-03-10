import { Sticker, Match } from '../types';

export const STICKERS: Sticker[] = [
  { id: '1', number: 1, name: 'Goalkeeper 1', team: 'Team A', type: 'player', isOwned: false },
  { id: '2', number: 2, name: 'Defender 1', team: 'Team A', type: 'player', isOwned: false },
  { id: '3', number: 3, name: 'Midfielder 1', team: 'Team A', type: 'player', isOwned: false },
  { id: '4', number: 4, name: 'Forward 1', team: 'Team A', type: 'player', isOwned: false },
  { id: '5', number: 5, name: 'Team Logo A', team: 'Team A', type: 'team', isOwned: false },
];

export const MATCHES: Match[] = [
  {
    id: '1',
    date: '2026-06-11',
    time: '17:00',
    homeTeam: 'USA',
    awayTeam: 'Canada',
    stage: 'group',
    isCompleted: false,
  },
  {
    id: '2',
    date: '2026-06-12',
    time: '20:00',
    homeTeam: 'Mexico',
    awayTeam: 'Brazil',
    stage: 'group',
    isCompleted: false,
  },
];

export const TOTAL_STICKERS_COUNT = 680;
