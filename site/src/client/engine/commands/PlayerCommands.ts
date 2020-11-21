import { GameEventSource } from "../../services/EventRouter";
import { InputState } from "../../services/input/InputService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { PlayerEventType } from "../events/PlayerEvents";
import {
    TravelEventType,
    TurnDirection,
    WalkDirection,
} from "../events/TravelEvents";
import { CommandCreator } from "./Command";

export const Walk: CommandCreator = (serviceLocator: ServiceLocator) => (
    walkDirection: WalkDirection
) =>
    serviceLocator.getScriptingService().getPlayer().emit({
        type: TravelEventType.WALK,
        payload: walkDirection,
    });

export const Turn: CommandCreator = (serviceLocator: ServiceLocator) => (
    turnDirection: TurnDirection
) =>
    serviceLocator.getScriptingService().getPlayer().emit({
        type: TravelEventType.TURN,
        payload: turnDirection,
    });

export const Interact: CommandCreator = (
    serviceLocator: ServiceLocator
) => () =>
    serviceLocator.getScriptingService().getPlayer().emit({
        type: "TEMP_INTERACT_COMMAND",
    });

export const OpenInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator.getGame().setUpdateWorld(false);
    serviceLocator.getInputService().setInputState(InputState.INVENTORY);
    serviceLocator.getEventRouter().routeEvent(GameEventSource.INPUT, {
        type: PlayerEventType.PLAYER_INVENTORY_OPENED,
    });
};

export const CloseInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator.getGame().setUpdateWorld(true);
    serviceLocator.getInputService().setInputState(InputState.DEFAULT);
    serviceLocator.getEventRouter().routeEvent(GameEventSource.INPUT, {
        type: PlayerEventType.PLAYER_INVENTORY_CLOSED,
    });
};
