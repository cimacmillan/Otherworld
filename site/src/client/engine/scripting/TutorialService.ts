import { ServiceLocator } from "../../services/ServiceLocator";
import { DeregisterKeyHint, RegisterKeyHint } from "../commands/UICommands";

interface TutorialSerialisation {}

export enum TutorialServiceEvent {
    WALK,
    TURN,
    OPEN_INVENTORY,
    CLOSE_INVENTORY,
    PICKED_UP_ITEM,
}

interface KeyHint {
    code: string[];
    hint: string;
}

const HINTS = {
    walk: {
        code: ["W", "A", "S", "D"],
        hint: "Walk",
    },
    turn: {
        code: ["\u2190", "\u2192"],
        hint: "Turn",
    },
    inventory: {
        code: ["I"],
        hint: "Open Inventory",
    },
    closeInventory: {
        code: ["I"],
        hint: "Close Inventory",
    },
};

export class TutorialService {
    private serviceLocator: ServiceLocator;
    private walk: number = undefined;
    private turn: number = undefined;

    private hasUsedInventory = false;
    private inventory: number = undefined;
    private closeInventory: number = undefined;

    public constructor() {}

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public onStart(serial?: TutorialSerialisation) {
        this.walk = this.register(HINTS.walk);
    }

    public onEvent(event: TutorialServiceEvent) {
        switch (event) {
            case TutorialServiceEvent.WALK:
                if (this.walk) {
                    this.deregister(this.walk);
                    this.turn = this.register(HINTS.turn);
                    this.walk = undefined;
                }
                break;
            case TutorialServiceEvent.TURN:
                if (this.turn) {
                    this.deregister(this.turn);
                    this.turn = undefined;
                }
                break;
            case TutorialServiceEvent.PICKED_UP_ITEM:
                if (this.hasUsedInventory === false) {
                    this.inventory = this.register(HINTS.inventory);
                }
                break;
            case TutorialServiceEvent.OPEN_INVENTORY:
                if (this.inventory) {
                    this.hasUsedInventory = true;
                    this.deregister(this.inventory);
                    this.inventory = undefined;
                    this.closeInventory = this.register(HINTS.closeInventory);
                }
                break;
            case TutorialServiceEvent.CLOSE_INVENTORY:
                if (this.closeInventory) {
                    this.deregister(this.closeInventory);
                    this.closeInventory = undefined;
                }
                break;
        }
    }

    public deserialise(): TutorialSerialisation {
        return {};
    }

    public destroy() {
        this.deregister(this.walk);
        this.deregister(this.turn);
        this.deregister(this.inventory);
        this.deregister(this.closeInventory);
    }

    private register(hint: KeyHint) {
        return RegisterKeyHint(this.serviceLocator)(hint);
    }

    private deregister(id: number) {
        DeregisterKeyHint(this.serviceLocator)(id);
    }
}
