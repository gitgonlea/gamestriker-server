// src/modules/gameserver/interfaces/server-info.interface.ts
export interface ServerInfo {
  name: string;
  map: string;
  maxplayers: number;
  players: number;
  bots?: number;
  password?: boolean;
  version?: string;
  ping?: number;
  connect?: string;
  raw?: any;
}