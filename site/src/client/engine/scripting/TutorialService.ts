import { ServiceLocator } from "../../services/ServiceLocator";
import { DeregisterKeyHint, RegisterKeyHint } from "../commands/UICommands";

export interface TutorialSerialisation {
    movement: "WALKING" | "TURNING" | "DONE";
    inventory: "NONE" | "OPENED" | "CLOSED" | "DONE";
    weapon: "NONE" | "DONE";
    equip: "NONE" | "PICKED_UP" | "DONE";
}

const DEFAULT_STATE: TutorialSerialisation = {
    movement: "WALKING",
    inventory: "NONE",
    weapon: "NONE",
    equip: "NONE",
};

export enum TutorialServiceEvent {
    START,
    WALK,
    TURN,
    OPEN_INVENTORY,
    CLOSE_INVENTORY,
    PICKED_UP_ITEM,
    EQUIPED_WEAPON,
    UNEQUIPED_WEAPON,
    ATTACKED
}

interface KeyHint {
    code: string[];
    hint: string;
    id?: number;
}

const HINTS: Record<string, KeyHint> = {
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
    attack: {
        code: ["Space"],
        hint: "Attack"
    }
};

export class TutorialService {
    private serviceLocator: ServiceLocator;
    private state: TutorialSerialisation = DEFAULT_STATE;

    public constructor() {}

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public onStart(serial?: TutorialSerialisation) {
        this.state = serial || DEFAULT_STATE;
        this.onEvent(TutorialServiceEvent.START);
        // this.walk = this.register(HINTS.walk);
    }

    public onEvent(event: TutorialServiceEvent) {
        switch (event) {
            case TutorialServiceEvent.START:
                if (this.state.movement === "WALKING") {
                    this.register(HINTS.walk);
                }
                if (this.state.movement === "TURNING") {
                    this.register(HINTS.turn);
                }
                if (this.state.inventory === "OPENED") {
                    this.register(HINTS.inventory);
                }
                if (this.state.inventory === "CLOSED") {
                    this.state.inventory = "OPENED";
                    this.register(HINTS.inventory);
                }
                break;
            case TutorialServiceEvent.WALK:
                if (this.state.movement === "WALKING") {
                    this.deregister(HINTS.walk);
                    this.register(HINTS.turn);
                    this.state.movement = "TURNING";
                }
                break;
            case TutorialServiceEvent.TURN:
                if (this.state.movement === "TURNING") {
                    this.deregister(HINTS.turn);
                    this.state.movement = "DONE";
                }
                break;
            case TutorialServiceEvent.PICKED_UP_ITEM:
                if (this.state.inventory === "NONE") {
                    this.register(HINTS.inventory);
                    this.state.inventory = "OPENED";
                }
                if (this.state.equip === "NONE") {
                    this.state.equip = "PICKED_UP";
                }
                break;
            case TutorialServiceEvent.OPEN_INVENTORY:
                if (this.state.inventory === "OPENED") {
                    this.deregister(HINTS.inventory);
                    this.register(HINTS.closeInventory);
                    this.state.inventory = "CLOSED";
                }
                break;
            case TutorialServiceEvent.CLOSE_INVENTORY:
                if (this.state.inventory === "CLOSED") {
                    this.deregister(HINTS.closeInventory);
                    this.state.inventory = "DONE";
                }
                break;
            case TutorialServiceEvent.EQUIPED_WEAPON:
                if (this.state.weapon === "NONE") {
                    this.register(HINTS.attack)
                }
                if (this.state.equip === "PICKED_UP") {
                    this.state.equip = "DONE";
                }
                break;
            case TutorialServiceEvent.UNEQUIPED_WEAPON:
                this.deregister(HINTS.attack);
                break;
            case TutorialServiceEvent.ATTACKED:
                this.deregister(HINTS.attack);
                this.state.weapon = "DONE";
                break;
        }
    }

    public serialise(): TutorialSerialisation {
        return this.state;
    }

    public destroy() {
        for (const key in HINTS) {
            this.deregister(HINTS[key]);
        }
    }

    public shouldShowEquipHint(): boolean {
        return this.state.equip === "PICKED_UP";
    }

    private register(hint: KeyHint) {
        if (hint.id) {
            return;
        }
        hint.id = RegisterKeyHint(this.serviceLocator)(hint);
    }

    private deregister(hint: KeyHint) {
        if (!hint.id) {
            return;
        }
        DeregisterKeyHint(this.serviceLocator)(hint.id);
        hint.id = undefined;
    }
}
