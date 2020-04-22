import { Game } from "../Game";
import React = require("react");
import { connect } from "react-redux";
import { Entity } from "../engine/Entity";
import { SpriteRenderComponent } from "../engine/components/SpriteRenderComponent";
import { BallEventType } from "../engine/events/BallEvents";
import { GameEventSource } from "../services/EventRouter";
import { State } from "./State";
import HealthBarComponent from "./components/HealthBarComponent";
import { GamePanelComponent } from "./components/GamePanelComponent";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "./components/TextComponent";
import { GameButtonContainer } from "./containers/GameButtonContainer";
import { DARK_PANEL } from "../services/resources/manifests/DarkPanel";
import { BUTTON_DEFAULT } from "../services/resources/manifests/ButtonDefault";
import { BUTTON_HOVER } from "../services/resources/manifests/ButtonHover";
import {
    BUTTON_PRESS,
    BUTTON_PRESS_SPRITES,
} from "../services/resources/manifests/ButtonPress";
import GameStartContainer from "./containers/GameStartContainer";
import WeaponComponent from "./components/WeaponComponent";

export interface OwnProps {
    game: Game;
}

export interface StateProps {
    canAccessGame: boolean;
}

function mapStateToProps(state: State) {
    return {
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
                        <GameStartContainer game={this.props.game} />
                    </>
                ) : undefined}
            </div>
        );
    }
}

export default connect(mapStateToProps)(UIContainer);
