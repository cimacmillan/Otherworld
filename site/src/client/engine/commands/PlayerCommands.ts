import { ServiceLocator } from "../../services/ServiceLocator";
import { TurnDirection, WalkDirection } from "../events/TravelEvents";
import { TutorialServiceEvent } from "../scripting/TutorialService";
import { CommandCreator } from "./Command";

export const Walk: CommandCreator = (serviceLocator: ServiceLocator) => (
    walkDirection: WalkDirection
) => {
    serviceLocator.getScriptingService().getPlayer().walk(walkDirection);
    serviceLocator.getTutorialService().onEvent(TutorialServiceEvent.WALK);
};

export const Turn: CommandCreator = (serviceLocator: ServiceLocator) => (
    turnDirection: TurnDirection
) => {
    serviceLocator.getScriptingService().getPlayer().turn(turnDirection);
    serviceLocator.getTutorialService().onEvent(TutorialServiceEvent.TURN);
};

export const Interact: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => serviceLocator.getScriptingService().getPlayer().interact();
