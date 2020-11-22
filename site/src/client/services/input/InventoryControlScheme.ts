import { CloseInventory } from "../../engine/commands/InventoryCommands";
import { ServiceLocator } from "../ServiceLocator";
import { ControlScheme } from "./ControlScheme";

export class InventoryControlScheme implements ControlScheme {
    public constructor(private serviceLocator: ServiceLocator) {}

    public poll(keysDown: { [key: string]: boolean }) {}

    public onKeyDown(key: string, keysDown: { [key: string]: boolean }) {
        if (key == "KeyI") {
            CloseInventory(this.serviceLocator)();
        }
    }

    public onKeyUp(key: string, keysDown: { [key: string]: boolean }) {}
}
