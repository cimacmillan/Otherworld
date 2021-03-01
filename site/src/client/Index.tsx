import * as React from "react";
import * as ReactDOM from "react-dom";
import { Game } from "./Game";
import { Actions } from "./Actions";
import { VERSION } from "./Config";
import { SiteContainer } from "./SiteContainer";
import { game, gameContext } from "./GameContext";
import { store } from "./ui/State";


// For viewing deployed version
console.log(VERSION);

const render = () => {
    ReactDOM.render(
        <gameContext.Provider value={game}>
            <SiteContainer store={store} />
        </gameContext.Provider>,
        document.getElementById("root")
    );
};

render();
