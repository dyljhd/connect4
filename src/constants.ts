import { TBoard, TDisc } from "./types";

export const DISCS = {
  EMPTY: 0,
  PLAYER: 1,
  OPPONENT: -1,
} as const;

export const TURNS = {
  PLAYER: 1,
  OPPONENT: -1,
} as const;

export const END_CONDITIONS = {
  PLAYER: 1,
  OPPONENT: -1,
  DRAW: 0,
} as const;

export const INITIAL_BOARD: TBoard = [];
for (let r = 0; r < 6; r++) {
  const row: TDisc[] = [];
  for (let c = 0; c < 7; c++) {
    row.push(DISCS.EMPTY);
  }
  INITIAL_BOARD.push(row);
}
