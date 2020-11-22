import { GameEventSource } from "../../services/EventRouter";
import { InputState } from "../../services/input/InputService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { PlayerEventType } from "../events/PlayerEvents";
import { CommandCreator } from "./Command";

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
