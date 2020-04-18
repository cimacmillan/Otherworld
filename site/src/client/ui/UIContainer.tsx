import { Game } from "../Game";
import React = require("react");
import { connect } from "react-redux";
import { Entity } from "../engine/Entity";
import { SpriteRenderComponent } from "../engine/components/SpriteRenderComponent";
import { BallEventType } from "../engine/events/BallEvents";
import { GameEventSource } from "../services/EventRouter";
import { WeaponComponent } from "./components/WeaponComponent";
import { State } from "./State";
import { HealthBarComponent } from "./components/HealthBarComponent";

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
                {this.props.canAccessGame ? (
                    <>
                        <HealthBarComponent
                            serviceLocator={this.props.game.getServiceLocator()}
                        />
                        <WeaponComponent
                            serviceLocator={this.props.game.getServiceLocator()}
                        />
                    </>
                ) : undefined}
            </div>
        );
    }
}

export default connect(mapStateToProps)(UIContainer);
