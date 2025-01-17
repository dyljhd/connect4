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

export const DIRECTIONS = {
  // [row, col]
  UP: [-1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  RIGHT_UP: [-1, 1],
  LEFT_UP: [-1, -1],
  RIGHT_DOWN: [1, 1],
  LEFT_DOWN: [1, -1],
} as const;

export const HORIZONTAL_DIRECTIONS = [
  DIRECTIONS.LEFT,
  DIRECTIONS.RIGHT,
] as const;
export const VERTICAL_DIRECTIONS = [DIRECTIONS.UP, DIRECTIONS.DOWN] as const;
export const DIAGONAL_RIGHT_DIRECTIONS = [
  DIRECTIONS.RIGHT_UP,
  DIRECTIONS.LEFT_DOWN,
] as const;
export const DIAGONAL_LEFT_DIRECTIONS = [
  DIRECTIONS.LEFT_UP,
  DIRECTIONS.RIGHT_DOWN,
] as const;
