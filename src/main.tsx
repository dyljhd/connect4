import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { Connect4Game } from "./connect4Game.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Connect4Game />
  </StrictMode>
);
