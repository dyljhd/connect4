import { END_CONDITIONS, DISCS, TURNS } from "./constants";

export type TDisc = (typeof DISCS)[keyof typeof DISCS];

export type TTurn = (typeof TURNS)[keyof typeof TURNS];

export type TEndCondition =
  (typeof END_CONDITIONS)[keyof typeof END_CONDITIONS];

export type TBoard = TDisc[][];
