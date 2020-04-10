import { ServiceLocator } from "../../services/ServiceLocator";
import { InteractionEventType } from "../events/InteractionEvents";
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

export const Attack: CommandCreator = (serviceLocator: ServiceLocator) => () =>
    serviceLocator.getScriptingService().getPlayer().emit({
        type: InteractionEventType.ATTACK,
    });
