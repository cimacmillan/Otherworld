import { Game } from "../Game";
import React = require("react");
import { connect } from "react-redux";
import { State } from "./State";
import HealthBarComponent from "./components/HealthBarComponent";
import GameStartContainer from "./containers/GameStartContainer";
import WeaponComponent from "./components/WeaponComponent";
import GameFadeContainer from "./containers/GameFadeContainer";

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
                        <GameFadeContainer
                            serviceLocator={this.props.game.getServiceLocator()}
                        />
                        <GameStartContainer
                            serviceLocator={this.props.game.getServiceLocator()}
                        />
                    </>
                ) : undefined}
            </div>
        );
    }
}

export default connect(mapStateToProps)(UIContainer);
