import {
    ParticleRender,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { SurfacePosition } from "../../state/State";

export type ParticleState = SurfacePosition & {
    particleWidth: number;
    particleHeight: number;
    r: number;
    g: number;
    b: number;
};

export const ParticleRenderComponent = (): EntityComponent<ParticleState> => {
    let renderItem: RenderItem | undefined;

    return {
        getActions: (entity: Entity<ParticleState>) => ({
            onEntityCreated: () => {
                renderItem = entity
                    .getServiceLocator()
                    .getRenderService()
                    .particleRenderService.createItem(
                        mapParticleStateToParticle(entity.getState())
                    );
            },
            onEntityDeleted: () => {
                entity
                    .getServiceLocator()
                    .getRenderService()
                    .particleRenderService.freeItem(renderItem);
            },
        }),
        update: (entity: Entity<ParticleState>) => {
            entity
                .getServiceLocator()
                .getRenderService()
                .particleRenderService.updateItem(
                    renderItem,
                    mapParticleStateToParticle(entity.getState())
                );
        },
    };
};

function mapParticleStateToParticle(state: ParticleState): ParticleRender {
    return {
        position: [state.position.x, state.height, state.position.y],
        size: [state.particleWidth, state.particleHeight],
        r: state.r,
        g: state.g,
        b: state.b,
    };
}
