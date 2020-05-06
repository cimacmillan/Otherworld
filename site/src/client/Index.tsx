import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameComponent } from "./GameComponent";
import { Game } from "./Game";
import { dispatch } from "./ui/State";
import { Actions } from "./ui/actions/Actions";
import { VERSION } from "./Config";

// For viewing deployed version
console.log(VERSION);

const game = new Game();

const render = () => {
    ReactDOM.render(
        <GameComponent
            game={game}
            uiListener={(action: Actions) => dispatch.next(action)}
        />,
        document.getElementById("root")
    );
};

render();
