import { ServiceLocator } from "../../services/ServiceLocator";
import { TravelEventType } from "../events/TravelEvents";
import { CommandCreator } from "./Command";

export const WalkForward: CommandCreator = (
    serviceLocator: ServiceLocator
) => () =>
    serviceLocator.getScriptingService().getPlayer().emit({
        type: TravelEventType.WALK_FORWARD,
    });
