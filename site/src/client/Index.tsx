import * as React from "react";
import * as ReactDOM from "react-dom";
import { Game } from "./Game";
import { dispatch } from "./ui/State";
import { Actions } from "./ui/actions/Actions";
import { VERSION } from "./Config";
import { SiteContainer } from "./SiteContainer";
import { game, gameContext } from "./GameContext";

// For viewing deployed version
console.log(VERSION);

const render = () => {
    ReactDOM.render(
        <gameContext.Provider value={game}>
            <SiteContainer
                uiListener={(action: Actions) => dispatch.next(action)}
            />
        </gameContext.Provider>,
        document.getElementById("root")
    );
};

render();
