import { Store } from "@cimacmillan/refunc";
import React = require("react");
import * as ReactMarkdown from "react-markdown";
import { Actions } from "./Actions";
import { Game } from "./Game";
import { GameComponent } from "./GameComponent";
import { State } from "./ui/State";
import { WebContentContainer } from "./uisite/WebContentContainer";

export interface SiteContainerProps {
    store: Store<State, Actions>;
}

export const SiteContainer: React.FunctionComponent<SiteContainerProps> = (
    props
) => {
    const [showGame, setShowGame] = React.useState(true);

    return (
        <>
            <GameComponent
                store={props.store}
                shouldShow={showGame}
            />
            <WebContentContainer
                setShowGame={setShowGame}
                isGameShowing={showGame}
            />
        </>
    );
};
