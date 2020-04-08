import { Game } from "../Game";
import React = require("react");
import { State, UIState } from "./reducers/UIReducer";
import { connect } from "react-redux";
import { Entity } from "../engine/Entity";
import { SpriteRenderComponent } from "../engine/components/SpriteRenderComponent";
import { SpriteLogicComponent } from "../engine/components/SpriteLogicComponent";
import { BallEventType } from "../engine/events/BallEvents";
import { GameEventSource } from "../services/EventRouter";
import { WeaponComponent } from "./components/WeaponComponent";

export interface OwnProps {
    game: Game;
}

export interface StateProps {
    count: number;
    canAccessGame: boolean;
}

function mapStateToProps(state: State) {
    return {
        count: state.uiState.bounceCount,
        canAccessGame: state.uiState.canAccessGame,
    };
}

type UIContainerProps = OwnProps & StateProps;

class UIContainer extends React.Component<UIContainerProps> {
    public render() {
        return (
            <div style={{ position: "absolute" }}>
                <h1 style={{ color: "white" }}> {this.props.count} </h1>
                <button onClick={this.createBall}>Create Ball</button>
                <button onClick={this.bounceBalls}>Bounce</button>
                {/* {this.getGameImage()} */}
                <WeaponComponent />
            </div>
        );
    }

    private getGameImage = () => {
        if (this.props.canAccessGame) {
            return (
                <img
                    src={
                        this.props.game.getServiceLocator().getResourceManager()
                            .uiSword
                    }
                />
            );
        } else {
            return <p>Loading</p>;
        }
    };

    private createBall = () => {
        const sprite = new Entity(
            this.props.game.getServiceLocator(),
            new SpriteRenderComponent(),
            new SpriteLogicComponent()
        );
        this.props.game.getServiceLocator().getWorld().addEntity(sprite);
    };

    private bounceBalls = () => {
        this.props.game
            .getServiceLocator()
            .getEventRouter()
            .routeEvent(GameEventSource.UI, {
                type: BallEventType.FORCE_BOUNCE,
            });
    };
}

export default connect(mapStateToProps)(UIContainer);
