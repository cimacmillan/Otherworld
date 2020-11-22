import { OpenInventory } from "../../engine/commands/InventoryCommands";
import { Interact, Turn, Walk } from "../../engine/commands/PlayerCommands";
import { TurnDirection, WalkDirection } from "../../engine/events/TravelEvents";
import { ServiceLocator } from "../ServiceLocator";
import { ControlScheme } from "./ControlScheme";

export class DefaultControlScheme implements ControlScheme {
    public constructor(private serviceLocator: ServiceLocator) {}

    public poll(keysDown: { [key: string]: boolean }) {
        if (keysDown.KeyW) {
            Walk(this.serviceLocator)(WalkDirection.FORWARD);
        }
        if (keysDown.KeyS) {
            Walk(this.serviceLocator)(WalkDirection.BACK);
        }
        if (keysDown.KeyA) {
            Walk(this.serviceLocator)(WalkDirection.LEFT);
        }
        if (keysDown.KeyD) {
            Walk(this.serviceLocator)(WalkDirection.RIGHT);
        }

        if (keysDown.ArrowLeft) {
            Turn(this.serviceLocator)(TurnDirection.ANTICLOCKWISE);
        }
        if (keysDown.ArrowRight) {
            Turn(this.serviceLocator)(TurnDirection.CLOCKWISE);
        }

        if (keysDown.KeyE) {
            Interact(this.serviceLocator)();
        }
    }

    public onKeyDown(key: string, keysDown: { [key: string]: boolean }) {
        if (key == "KeyI") {
            OpenInventory(this.serviceLocator)();
        }

        if (key == "KeyQ") {
            console.log("attempting to serialise");
            const serialised = this.serviceLocator
                .getSerialisationService()
                .serialise();
            console.log(serialised);
            this.serviceLocator
                .getSerialisationService()
                .deserialise(serialised);
        }
    }

    public onKeyUp(key: string, keysDown: { [key: string]: boolean }) {}
}
