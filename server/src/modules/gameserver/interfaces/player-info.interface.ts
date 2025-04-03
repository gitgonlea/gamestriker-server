// src/modules/gameserver/interfaces/player-info.interface.ts
export interface PlayerInfo {
  name: string;
  score: number;
  online: number; // Time in seconds
  raw?: any;
}