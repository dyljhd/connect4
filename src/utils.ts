import {
  END_CONDITIONS,
  DISCS,
  TURNS,
  HORIZONTAL_DIRECTIONS,
  VERTICAL_DIRECTIONS,
  DIAGONAL_LEFT_DIRECTIONS,
  DIAGONAL_RIGHT_DIRECTIONS,
} from "./constants";
import { TBoard, TDisc, TTurn, TEndCondition } from "./types";

export const checkPlayerDisc = ({ disc }: { disc: TDisc }) => {
  return disc === DISCS.PLAYER;
};

export const checkOpponentDisc = ({ disc }: { disc: TDisc }) => {
  return disc === DISCS.OPPONENT;
};

export const checkEmptyDisc = ({ disc }: { disc: TDisc }) => {
  return disc === DISCS.EMPTY;
};

export const checkPlayerTurn = ({ turn }: { turn: TTurn }) => {
  return turn === TURNS.PLAYER;
};

export const checkOpponentTurn = ({ turn }: { turn: TTurn }) => {
  return turn === TURNS.OPPONENT;
};

export const checkPlayerWinner = ({
  endCondition,
}: {
  endCondition: TEndCondition | null;
}) => {
  return endCondition !== null && endCondition === END_CONDITIONS.PLAYER;
};

export const checkOpponentWinner = ({
  endCondition,
}: {
  endCondition: TEndCondition | null;
}) => {
  return endCondition !== null && endCondition === END_CONDITIONS.OPPONENT;
};

export const checkDraw = ({
  endCondition,
}: {
  endCondition: TEndCondition | null;
}) => {
  return endCondition !== null && endCondition === END_CONDITIONS.DRAW;
};

export const getColumnLowestPlayableRowIdx = ({
  board,
  colIdx,
}: {
  board: TBoard;
  colIdx: number;
}) => {
  for (let r = board.length - 1; r >= 0; r--) {
    if (board[r][colIdx] === DISCS.EMPTY) {
      return r;
    }
  }
  return null;
};

export const checkPlayableColumn = ({
  board,
  colIdx,
}: {
  board: TBoard;
  colIdx: number;
}) => {
  return board[0][colIdx] === DISCS.EMPTY;
};

export const getEndCondition = ({
  board,
  rowIdx,
  colIdx,
}: {
  board: TBoard;
  rowIdx: number;
  colIdx: number;
}): TEndCondition | null => {
  const maxRowsIdx = board.length - 1; // 6 - 1 = 5 (as index starts from 0)
  const maxColsIdx = board[0].length - 1; // 7 - 1 = 6 (as index starts from 0)

  const inBounds = ({ rowIdx, colIdx }: { rowIdx: number; colIdx: number }) => {
    return (
      rowIdx >= 0 && rowIdx <= maxRowsIdx && colIdx >= 0 && colIdx <= maxColsIdx
    );
  };

  const disc = board[rowIdx][colIdx];

  for (const directions of [
    HORIZONTAL_DIRECTIONS,
    VERTICAL_DIRECTIONS,
    DIAGONAL_LEFT_DIRECTIONS,
    DIAGONAL_RIGHT_DIRECTIONS,
  ]) {
    const [[dir1RowIdx, dir1ColIdx], [dir2RowIdx, dir2ColIdx]] = directions;

    // Include the current disc as excluding it in calculations below
    let count = 1;

    const checkDirection = ({
      dirRowIdx,
      dirColIdx,
    }: {
      dirRowIdx: number;
      dirColIdx: number;
    }) => {
      // Check for a four streak in a particular direction (excluding the current disc)
      for (let i = 1; i < 4; i++) {
        if (count === 4) break;

        const newRowIdx = rowIdx + i * dirRowIdx;
        const newColIdx = colIdx + i * dirColIdx;

        // Check if we have gone out of bounds
        // Check if the disc matches the current player's disc and if it's not an empty disc
        if (
          !inBounds({ rowIdx: newRowIdx, colIdx: newColIdx }) ||
          board[newRowIdx][newColIdx] !== disc
        ) {
          break;
        }

        count++;
      }
    };

    checkDirection({ dirRowIdx: dir1RowIdx, dirColIdx: dir1ColIdx });
    checkDirection({ dirRowIdx: dir2RowIdx, dirColIdx: dir2ColIdx });

    if (count !== 4) continue;

    return disc;
  }

  const isPlayable = board.flat().some((disc) => disc === DISCS.EMPTY);

  return isPlayable ? null : 0;
};
