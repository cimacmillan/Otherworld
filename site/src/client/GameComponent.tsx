import React = require("react");
import { CanvasComponent } from "./services/render";
import { Game } from "./Game";
import UIContainer from "./ui/UIContainer";
import { GameEvent } from "./engine/events/Event";

const DOM_WIDTH = 1280;
const DOM_HEIGHT = 720;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;

export interface GameComponentProps {
    game: Game;
    uiListener: (event: GameEvent) => void;
}

export class GameComponent extends React.Component<GameComponentProps> {
    public async componentDidMount() {
        this.props.game.init(
            (this.refs.main_canvas as CanvasComponent).getOpenGL(),
            this.props.uiListener
        );
    }

    public render() {
        return (
            <>
                <UIContainer game={this.props.game} />
                <CanvasComponent
                    ref="main_canvas"
                    id={"main_canvas"}
                    dom_width={DOM_WIDTH}
                    dom_height={DOM_HEIGHT}
                    width={WIDTH}
                    height={HEIGHT}
                    resolution={RES_DIV}
                />
            </>
        );
    }
}
