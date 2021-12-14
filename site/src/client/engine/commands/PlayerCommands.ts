import { Audios } from "../../resources/manifests/Audios";
import { ServiceLocator } from "../../services/ServiceLocator";
import { randomSelection } from "../../util/math";
import { TutorialServiceEvent } from "../scripting/TutorialService";
import { CommandCreator } from "./Command";

export enum WalkDirection {
    FORWARD = "FORWARD",
    BACK = "BACK",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum TurnDirection {
    CLOCKWISE = "CLOCKWISE",
    ANTICLOCKWISE = "ANTICLOCKWISE",
}

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

export const Attack = (
    serviceLocator: ServiceLocator
) => {
    serviceLocator.getScriptingService().getPlayer().attack();
    serviceLocator.getTutorialService().onEvent(TutorialServiceEvent.ATTACKED);
}
