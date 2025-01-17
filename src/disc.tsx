import clsx from "clsx";
import { TDisc } from "./types";
import { checkPlayerDisc, checkOpponentDisc, checkEmptyDisc } from "./utils";

export const Disc = ({ disc }: { disc: TDisc }) => {
  const isPlayerDisc = checkPlayerDisc({ disc });
  const isOpponentDisc = checkOpponentDisc({ disc });
  const isEmptyDisc = checkEmptyDisc({ disc });

  return (
    <div
      className={clsx(
        "w-16 h-16 border border-blue-700 rounded-full",
        isPlayerDisc && "bg-green-500",
        isOpponentDisc && "bg-red-500",
        isEmptyDisc && "bg-gray-100"
      )}
    />
  );
};
