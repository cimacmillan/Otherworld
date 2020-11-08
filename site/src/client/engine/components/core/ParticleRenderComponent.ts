import {
    Particle,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState, SurfacePositionState } from "../../state/State";

export type ParticleState = BaseState &
    SurfacePositionState & {
        particleWidth: number;
        particleHeight: number;
        r: number;
        g: number;
        b: number;
    };

export const ParticleRenderComponent = (): EntityComponent<ParticleState> => {
    let renderItem: RenderItem | undefined;

    return {
        onCreate: (entity: Entity<ParticleState>) => {
            renderItem = entity
                .getServiceLocator()
                .getRenderService()
                .particleRenderService.createItem(
                    mapParticleStateToParticle(entity.getState())
                );
        },
        update: (entity: Entity<ParticleState>) => {
            entity
                .getServiceLocator()
                .getRenderService()
                .particleRenderService.updateItem(
                    renderItem,
                    mapParticleStateToParticle(entity.getState())
                );
        },
        onDestroy: (entity: Entity<ParticleState>) => {
            entity
                .getServiceLocator()
                .getRenderService()
                .particleRenderService.freeItem(renderItem);
        },
    };
};

function mapParticleStateToParticle(state: ParticleState): Particle {
    return {
        position: [state.position.x, state.position.y],
        size: [state.particleWidth, state.particleHeight],
        height: state.height,
        r: state.r,
        g: state.g,
        b: state.b,
    };
}