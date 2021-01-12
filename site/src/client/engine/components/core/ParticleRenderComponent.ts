import {
    ParticleRender,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import {
    SUFRACE_POSITION_STATE_DEFAULT,
    SurfacePosition,
} from "../../state/State";

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
        getInitialState: () => ({
            ...SUFRACE_POSITION_STATE_DEFAULT,
            particleWidth: 1,
            particleHeight: 1,
            r: 1,
            g: 1,
            b: 1,
        }),
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

function mapParticleStateToParticle(state: ParticleState): ParticleRender {
    return {
        position: [state.position.x, state.height, state.position.y],
        size: [state.particleWidth, state.particleHeight],
        r: state.r,
        g: state.g,
        b: state.b,
    };
}
