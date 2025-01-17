import { useReducer, useState } from "react";
import { produce } from "immer";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { ChevronDown, RotateCcw } from "lucide-react";
import { INITIAL_BOARD, DISCS, TURNS } from "./constants";
import { Disc } from "./disc";
import { TBoard, TEndCondition, TTurn } from "./types";
import {
  getColumnLowestPlayableRowIdx,
  getEndCondition,
  checkDraw,
  checkOpponentTurn,
  checkOpponentWinner,
  checkPlayableColumn,
  checkPlayerTurn,
  checkPlayerWinner,
} from "./utils";
import { minimax } from "./minimax";

type State = {
  board: TBoard;
  turn: TTurn;
  endCondition: TEndCondition | null;
  isTwoPlayer: boolean;
};

type Actions =
  | { type: "toggle_two_player" }
  | {
      type: "player_move";
      payload: {
        colIdx: number;
      };
    }
  | {
      type: "opponent_move";
      payload: {
        colIdx: number;
      };
    }
  | { type: "restart" };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "toggle_two_player": {
      return {
        ...state,
        isTwoPlayer: !state.isTwoPlayer,
      };
    }
    case "player_move": {
      const { colIdx } = action.payload;

      const rowIdx = getColumnLowestPlayableRowIdx({
        board: state.board,
        colIdx,
      });
      if (rowIdx === null) return state;

      const newBoard = produce(state.board, (boardDraft) => {
        boardDraft[rowIdx][colIdx] = DISCS.PLAYER;
      });

      const newEndCondition = getEndCondition({
        board: newBoard,
        rowIdx,
        colIdx,
      });

      return {
        ...state,
        board: newBoard,
        turn: TURNS.OPPONENT,
        endCondition: newEndCondition,
      };
    }
    case "opponent_move": {
      const { colIdx } = action.payload;

      const rowIdx = getColumnLowestPlayableRowIdx({
        board: state.board,
        colIdx,
      });
      if (rowIdx === null) return state;

      const newBoard = produce(state.board, (boardDraft) => {
        boardDraft[rowIdx][colIdx] = DISCS.OPPONENT;
      });

      const newEndCondition = getEndCondition({
        board: newBoard,
        rowIdx,
        colIdx,
      });

      return {
        ...state,
        board: newBoard,
        turn: TURNS.PLAYER,
        endCondition: newEndCondition,
      };
    }
    case "restart": {
      return {
        ...state,
        board: INITIAL_BOARD,
        turn: TURNS.PLAYER,
        endCondition: null,
      };
    }
    default:
      return state;
  }
};

const initialGameState: State = {
  board: INITIAL_BOARD,
  turn: TURNS.PLAYER,
  endCondition: null,
  isTwoPlayer: false,
};

export const Connect4Game = () => {
  const { width, height } = useWindowSize();

  const [gameState, dispatch] = useReducer(reducer, initialGameState);
  const { board, turn, endCondition, isTwoPlayer } = gameState;
  const [prevTurn, setPrevTurn] = useState<TTurn>(turn);

  const isEndCondition = endCondition !== null;
  const isPlayerTurn = checkPlayerTurn({ turn });
  const isOpponentTurn = checkOpponentTurn({ turn });
  const isPlayerWinner = checkPlayerWinner({ endCondition });
  const isOpponentWinner = checkOpponentWinner({ endCondition });
  const isDraw = checkDraw({ endCondition });

  const handleToggleTwoPlayer = () => {
    dispatch({ type: "toggle_two_player" });
  };

  const handleManualMove = ({ colIdx }: { colIdx: number }) => {
    if (isTwoPlayer) {
      dispatch({
        type: isPlayerTurn ? "player_move" : "opponent_move",
        payload: { colIdx },
      });
      return;
    }

    dispatch({
      type: "player_move",
      payload: { colIdx },
    });
  };

  const handleAutomatedOpponentMove = () => {
    const colIdx = minimax({ board });
    dispatch({ type: "opponent_move", payload: { colIdx } });
  };

  const restartGame = () => {
    dispatch({ type: "restart" });
    setPrevTurn(initialGameState.turn);
  };

  // Handling the automated opponent move
  if (turn !== prevTurn) {
    if (!isTwoPlayer && !isEndCondition && isOpponentTurn) {
      handleAutomatedOpponentMove();
    }
    setPrevTurn(turn);
  }

  return (
    <>
      {isPlayerWinner && <Confetti width={width} height={height} />}
      <div className="flex flex-col items-center p-8 gap-10">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl font-rubik">Connect 4</h1>
          <div className="flex items-center gap-2">
            <label
              htmlFor="two-player-checkbox"
              className="font-rubik text-2xl"
            >
              Two Player Mode
            </label>
            <input
              id="two-player-checkbox"
              type="checkbox"
              className="w-6 h-6"
              onClick={handleToggleTwoPlayer}
            />
          </div>
          {!isEndCondition && (
            <p className="text-3xl font-rubik">
              Turn:{" "}
              {isPlayerTurn ? (
                <span className="text-green-600">Player</span>
              ) : isOpponentTurn ? (
                <span className="text-red-600">Opponent</span>
              ) : (
                <span className="text-red-600">Invalid</span>
              )}
            </p>
          )}
          {isEndCondition &&
            (isPlayerWinner ? (
              <p className="text-3xl font-rubik">
                Winner: <span className="text-green-600">Player</span>
              </p>
            ) : isOpponentWinner ? (
              <p className="text-3xl font-rubik">
                Winner: <span className="text-red-600">Opponent</span>
              </p>
            ) : isDraw ? (
              <p className="text-3xl font-rubik text-yellow-600">Draw</p>
            ) : (
              <p className="text-3xl font-rubik text-red-600">
                Invalid End Condition
              </p>
            ))}
          {isEndCondition && (
            <button
              className="flex items-center gap-2 font-rubik border border-blue-700 rounded-lg px-4 py-2 text-blue-600 bg-blue-50"
              onClick={restartGame}
            >
              <RotateCcw size={24} />
              <span>Restart</span>
            </button>
          )}
        </div>
        <div>
          {!isEndCondition && (
            <div className="flex gap-3 px-8 pb-4 h-16">
              {(isPlayerTurn || isTwoPlayer) &&
                board[0].map((_, colIdx) => {
                  const isPlayableColumn = checkPlayableColumn({
                    board,
                    colIdx,
                  });

                  return (
                    <div
                      key={colIdx}
                      className="flex justify-center items-center w-16"
                    >
                      {isPlayableColumn && (
                        <button
                          className="border border-blue-600 rounded-full p-2"
                          aria-label={`Take move in column ${colIdx + 1}`}
                          onClick={() => handleManualMove({ colIdx })}
                        >
                          <ChevronDown size={24} className="text-blue-600" />
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          <div className="flex flex-col gap-6 bg-blue-400 w-max border border-blue-700 rounded-lg px-8 py-4">
            {board.map((row, rowIdx) => {
              return (
                <div key={rowIdx} className="flex gap-3">
                  {row.map((col, colIdx) => {
                    return <Disc key={colIdx} disc={col} />;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
