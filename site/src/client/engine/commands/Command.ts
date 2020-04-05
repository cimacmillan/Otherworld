import { ServiceLocator } from "../../services/ServiceLocator";

export type Command = (...args: any[]) => void;
export type CommandCreator = (serviceLocator: ServiceLocator) => Command;
