import { TBoard } from "./types";
import { checkPlayableColumn } from "./utils";

// TODO: Implement a minimax algorithm for the opponent
export const minimax = ({ board }: { board: TBoard }): number => {
  // TODO: Delete the placeholder code below
  console.log("Board", board);
  // This will cause the opponent to always play in the first column that is 'playable' (has empty discs)
  const maxColIdx = board[0].length - 1;
  for (let colIdx = 0; colIdx <= maxColIdx; colIdx++) {
    const isPlayableColumn = checkPlayableColumn({ board, colIdx });
    if (isPlayableColumn) {
      return colIdx;
    }
  }
  return 0;
};
