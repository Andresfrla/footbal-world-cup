export type StickerStatus = "missing" | "owned";

export interface Sticker {
  id: number;
  team: string;
  number: number;
  status: StickerStatus;
  duplicates: number;
}

export interface Team {
  code: string;
  name: string;
  totalStickers: number;
}

export interface AlbumState {
  teams: Team[];
  stickers: Sticker[];
}
