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
import { GamePanelComponent } from "./components/GamePanelComponent";
import { TextComponent } from "./components/TextComponent";
import { DARK_PANEL } from "../services/resources/manifests/DefaultManifest";
import { GameButtonContainer } from "./containers/GameButtonContainer";

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
                        <GamePanelComponent
                            serviceLocator={this.props.game.getServiceLocator()}
                            width={500}
                            height={300}
                            style={{
                                marginLeft: 400,
                                marginTop: 200,
                                position: "absolute",
                            }}
                            childStyle={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                            panelMap={DARK_PANEL}
                        >
                            <TextComponent
                                text={"Otherworld"}
                                style={{
                                    // position: "absolute",
                                    width: "100%",
                                    textAlign: "center",
                                    marginTop: 10,
                                }}
                            />

                            <GameButtonContainer
                                serviceLocator={this.props.game.getServiceLocator()}
                                width={300}
                                height={100}
                                style={{}}
                                childStyle={{}}
                                panelMapDefault={DARK_PANEL}
                                panelMapHover={DARK_PANEL}
                                panelMapPress={DARK_PANEL}
                                onSelect={() => console.log("Button select")}
                            />
                        </GamePanelComponent>
                    </>
                ) : undefined}
            </div>
        );
    }
}

export default connect(mapStateToProps)(UIContainer);
