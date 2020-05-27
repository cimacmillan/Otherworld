import React = require("react");
import { Actions } from "./ui/actions/Actions";
import { Game } from "./Game";
import { GameComponent } from "./GameComponent";

export interface SiteContainerProps {
    game: Game;
    uiListener: (event: Actions) => void;
}

export const SiteContainer: React.FunctionComponent<SiteContainerProps> = (props) => {

    const [showGame, setShowGame] = React.useState(true);

    return (
        <>
            <button onClick={() => setShowGame(!showGame)}>Test</button>
            <GameComponent game={props.game} uiListener={props.uiListener} shouldShow={showGame}/>

        </>
    );
};
