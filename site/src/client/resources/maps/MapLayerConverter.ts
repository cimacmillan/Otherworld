import { Entity } from "../../engine/Entity";
import {
    createSlime,
    getSlimeState,
} from "../../engine/scripting/factory/EnemyFactory";
import { BaseState } from "../../engine/state/State";
import { ServiceLocator } from "../../services/ServiceLocator";

export enum MapLayerConverterType {
    DEFAULT = "DEFAULT",
}

export interface MapLayerGenerationArguments {
    serviceLocator: ServiceLocator;
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    a: number;
    metadata?: object;
}

export type MapLayerConverter = (
    args: MapLayerGenerationArguments
) => Array<Entity<BaseState>>;

const MapLayerConverterDefault: MapLayerConverter = (
    args: MapLayerGenerationArguments
) => {
    const { serviceLocator, x, y, r, g, b, a } = args;

    if (r === 255) {
        return [
            createSlime(serviceLocator, getSlimeState(serviceLocator, x, y)),
        ];
    }

    return [];
};

type MapLayerConverterTypeMap = {
    [key in MapLayerConverterType]: MapLayerConverter;
};

export const mapLayerConverterTypeMap: MapLayerConverterTypeMap = {
    [MapLayerConverterType.DEFAULT]: MapLayerConverterDefault,
};
