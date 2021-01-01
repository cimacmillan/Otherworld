import React = require("react");
import { gameContext } from "../../GameContext";

export const useGame = () => {
    return React.useContext(gameContext);
};

export const useServiceLocator = () => {
    return React.useContext(gameContext).getServiceLocator();
};
