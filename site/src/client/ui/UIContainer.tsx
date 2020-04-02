import { Game } from "../Game";
import React = require("react");
import { State, UIState } from "./reducers/UIReducer";
import { connect } from "react-redux";
import { Entity } from "../engine/Entity";
import { SpriteRenderComponent } from "../engine/components/SpriteRenderComponent";
import { SpriteLogicComponent } from "../engine/components/SpriteLogicComponent";
import { BallEventType } from "../engine/events/BallEvents";
import { GameEventSource } from "../engine/EventRouter";

export interface OwnProps {
    game: Game;
}

export interface StateProps {
    count: number;
}

function mapStateToProps(state: State) {
    return {
        count: state.uiState.bounceCount,
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
                {this.getGameImage()}
            </div>
        );
    }

    private getGameImage = () => {
        return this.props.game.isInitialised() ? (
            <img
                src={
                    this.props.game.getServiceLocator().getResourceManager()
                        .uiImage.src
                }
            />
        ) : (
            <p>Missing</p>
        );
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
