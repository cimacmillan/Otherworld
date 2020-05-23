import { ServiceLocator } from "../ServiceLocator";
import { ControlScheme } from "./ControlScheme";

export class MenuControlScheme implements ControlScheme {
    public constructor(private serviceLocator: ServiceLocator) {}

    public poll(keysDown: { [key: string]: boolean }) {}

    public onKeyDown(key: string, keysDown: { [key: string]: boolean }) {}

    public onKeyUp(key: string, keysDown: { [key: string]: boolean }) {}
}
