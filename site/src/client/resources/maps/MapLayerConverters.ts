import { Entity } from "../../engine/Entity";
import { BaseState } from "../../engine/state/State";
import { ServiceLocator } from "../../services/ServiceLocator";
import { MapLayerConverterDefault } from "./converter/DefaultLayerConverter";
import { MapMetadataObject } from "./MapShema";

export enum MapLayerConverterType {
    DEFAULT = "DEFAULT",
}

type MapLayerConverterTypeMap = {
    [key in MapLayerConverterType]: MapLayerConverter;
};

export const mapLayerConverterTypeMap: MapLayerConverterTypeMap = {
    [MapLayerConverterType.DEFAULT]: MapLayerConverterDefault,
};

export interface MapLayerGenerationArguments {
    serviceLocator: ServiceLocator;
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
    metadata: MapMetadataObject;
}

export type MapLayerConverter = (
    args: MapLayerGenerationArguments
) => Array<Entity<BaseState>>;
