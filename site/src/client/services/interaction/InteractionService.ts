import { Entity } from "../../engine/Entity";
import { InteractionStateType } from "../../engine/components/InteractionComponent";
import { InteractionType } from "./InteractionType";

export class InteractionService {

    public getInteractables(type: InteractionType): Entity<InteractionStateType>[] {

    }

    public getInteractable(type: InteractionType): Entity<InteractionStateType> {

    }

    public registerEntity(entity: Entity<InteractionStateType>, type: InteractionType) {

    }

    public unregisterEntity(entity: Entity<InteractionStateType>, type: InteractionType) {

    }

}


