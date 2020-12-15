import React = require("react");
import { Game } from "./Game";

export const game = new Game();
export const gameContext = React.createContext(game);
