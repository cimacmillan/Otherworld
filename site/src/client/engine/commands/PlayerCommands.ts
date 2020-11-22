import { ServiceLocator } from "../../services/ServiceLocator";
import {
    TravelEventType,
    TurnDirection,
    WalkDirection,
} from "../events/TravelEvents";
import { CommandCreator } from "./Command";

export const Walk: CommandCreator = (serviceLocator: ServiceLocator) => (
    walkDirection: WalkDirection
) =>
    serviceLocator.getScriptingService().getPlayer().onEvent({
        type: TravelEventType.WALK,
        payload: walkDirection,
    });

export const Turn: CommandCreator = (serviceLocator: ServiceLocator) => (
    turnDirection: TurnDirection
) =>
    serviceLocator.getScriptingService().getPlayer().onEvent({
        type: TravelEventType.TURN,
        payload: turnDirection,
    });

export const Interact: CommandCreator = (
    serviceLocator: ServiceLocator
) => () =>
    serviceLocator.getScriptingService().getPlayer().onEvent({
        type: "TEMP_INTERACT_COMMAND",
    });
