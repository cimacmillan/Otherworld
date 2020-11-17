import { Entity } from "../../engine/Entity";
import { BaseState } from "../../engine/state/State";
import { ServiceLocator } from "../../services/ServiceLocator";

export interface MapLayerGenerationArguments {
    serviceLocator: ServiceLocator;
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
    metadata?: object;
}

export type MapLayerConverter = (
    args: MapLayerGenerationArguments
) => Array<Entity<BaseState>>;
