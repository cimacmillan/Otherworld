import React = require("react");
import { Actions } from "../ui/actions/Actions";
import { Game } from "../Game";

export interface SiteContainerProps {
    game: Game;
    uiListener: (event: Actions) => void;
}

export const SiteContainer: React.FunctionComponent = (props) => {
    return (
        <div
            style={{
                position: "absolute",
            }}
        ></div>
    );
};
