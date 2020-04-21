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
                                font={TextFont.REGULAR}
                                size={TextSize.BIG}
                                colour={TextColour.LIGHT}
                            />

                            <GameButtonContainer
                                serviceLocator={this.props.game.getServiceLocator()}
                                width={256}
                                height={46}
                                style={{}}
                                childStyle={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                panelMapDefault={BUTTON_DEFAULT}
                                panelMapHover={BUTTON_HOVER}
                                panelMapPress={BUTTON_PRESS}
                                onSelect={() => console.log("Button select")}
                            >
                                <TextComponent
                                    text={"New Game"}
                                    style={{}}
                                    font={TextFont.REGULAR}
                                    size={TextSize.SMALL}
                                    colour={TextColour.LIGHT}
                                />
                            </GameButtonContainer>

                            <GameButtonContainer
                                serviceLocator={this.props.game.getServiceLocator()}
                                width={256}
                                height={46}
                                style={{}}
                                childStyle={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                panelMapDefault={BUTTON_DEFAULT}
                                panelMapHover={BUTTON_HOVER}
                                panelMapPress={BUTTON_PRESS}
                                onSelect={() => console.log("Button select")}
                            >
                                <TextComponent
                                    text={"Load Game"}
                                    style={{}}
                                    font={TextFont.REGULAR}
                                    size={TextSize.SMALL}
                                    colour={TextColour.LIGHT}
                                />
                            </GameButtonContainer>

                            <GameButtonContainer
                                serviceLocator={this.props.game.getServiceLocator()}
                                width={256}
                                height={46}
                                style={{}}
                                childStyle={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                panelMapDefault={BUTTON_DEFAULT}
                                panelMapHover={BUTTON_HOVER}
                                panelMapPress={BUTTON_PRESS}
                                onSelect={() => console.log("Button select")}
                            >
                                <TextComponent
                                    text={"Exit"}
                                    style={{}}
                                    font={TextFont.REGULAR}
                                    size={TextSize.SMALL}
                                    colour={TextColour.LIGHT}
                                />
                            </GameButtonContainer>
                        </GamePanelComponent>
                    </>
                ) : undefined}
            </div>
        );
    }
}

export default connect(mapStateToProps)(UIContainer);
