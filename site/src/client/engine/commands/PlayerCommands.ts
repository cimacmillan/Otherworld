import { ServiceLocator } from "../../services/ServiceLocator";
import {
    TurnDirection,
    WalkDirection,
} from "../events/TravelEvents";
import { CommandCreator } from "./Command";

export const Walk: CommandCreator = (serviceLocator: ServiceLocator) => (
    walkDirection: WalkDirection
) => serviceLocator.getScriptingService().getPlayer().walk(walkDirection);

export const Turn: CommandCreator = (serviceLocator: ServiceLocator) => (
    turnDirection: TurnDirection
) => serviceLocator.getScriptingService().getPlayer().turn(turnDirection);

export const Interact: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => serviceLocator.getScriptingService().getPlayer().interact();
