import React = require("react");
import { CanvasComponent } from "./services/render";
import { Game } from "./Game";
import { UIContainer } from "./ui/UIContainer";
import { GameEvent } from "./engine/events/Event";
import { DOM_WIDTH, DOM_HEIGHT, WIDTH, HEIGHT, RES_DIV } from "./Config";
import { Actions } from "./ui/actions/Actions";
import { SiteContainer } from "./uisite/SiteContainer";

export interface GameComponentProps {
    game: Game;
    uiListener: (event: Actions) => void;
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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 68,
                    }}
                >
                    <div>
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
                    </div>
                </div>
                <SiteContainer />
            </>
        );
    }
}
