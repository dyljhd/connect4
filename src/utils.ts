import { END_CONDITIONS, DISCS, TURNS } from "./constants";
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
}: {
  board: TBoard;
}): TEndCondition | null => {
  const maxRowsIdx = board.length - 1; // 6 - 1 = 5 (as index starts from 0)
  const maxColsIdx = board[0].length - 1; // 7 - 1 = 6 (as index starts from 0)

  // Directions [rowIdx, colIdx]
  const directions = [
    [0, 1], // Right
    [1, 0], // Down
    [1, 1], // Right-Down
    [1, -1], // Left-Down
  ];

  const inBounds = ({ rowIdx, colIdx }: { rowIdx: number; colIdx: number }) => {
    return (
      rowIdx >= 0 && rowIdx <= maxRowsIdx && colIdx >= 0 && colIdx <= maxColsIdx
    );
  };

  // Check a direction for a streak of 4
  const checkDirection = ({
    rowIdx,
    colIdx,
    dirRowIdx,
    dirColIdx,
    disc,
  }: {
    rowIdx: number;
    colIdx: number;
    dirRowIdx: number;
    dirColIdx: number;
    disc: TDisc;
  }) => {
    let count = 0;

    for (let i = 0; i < 4; i++) {
      const newRowIdx = rowIdx + i * dirRowIdx;
      const newColIdx = colIdx + i * dirColIdx;

      // Check if we have gone out of bounds
      if (!inBounds({ rowIdx: newRowIdx, colIdx: newColIdx })) {
        break;
      }

      // Check if the disc matches the current player's disc and if it's not an empty disc
      if (board[newRowIdx][newColIdx] !== disc) {
        break;
      }

      count++;
    }

    return count === 4;
  };

  let isEmptyDisc = false;

  // Iterate through each cell in the grid
  for (let rowIdx = 0; rowIdx <= maxRowsIdx; rowIdx++) {
    for (let colIdx = 0; colIdx <= maxColsIdx; colIdx++) {
      const disc = board[rowIdx][colIdx];

      if (disc !== DISCS.EMPTY) {
        for (const [dirRowIdx, dirColIdx] of directions) {
          const isWinner = checkDirection({
            rowIdx,
            colIdx,
            dirRowIdx,
            dirColIdx,
            disc,
          });

          if (isWinner) return disc;
        }
      }

      isEmptyDisc = true;
    }
  }

  return isEmptyDisc ? null : 0;
};
