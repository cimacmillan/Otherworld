import React = require("react");
import * as ReactMarkdown from "react-markdown";
import { Actions } from "./ui/actions/Actions";
import { Game } from "./Game";
import { GameComponent } from "./GameComponent";
import { WebContentContainer } from "./uisite/WebContentContainer";

export interface SiteContainerProps {
    game: Game;
    uiListener: (event: Actions) => void;
}

export const SiteContainer: React.FunctionComponent<SiteContainerProps> = (
    props
) => {
    const [showGame, setShowGame] = React.useState(true);

    return (
        <>
            <GameComponent
                game={props.game}
                uiListener={props.uiListener}
                shouldShow={showGame}
            />
            <WebContentContainer
                setShowGame={setShowGame}
                isGameShowing={showGame}
            />
        </>
    );
};
