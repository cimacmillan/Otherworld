import { MapLayerConverterDefault } from "./converter/DefaultLayerConverter";
import { MapLayerConverter } from "./MapLayerConverterType";

export enum MapLayerConverterType {
    DEFAULT = "DEFAULT",
}

type MapLayerConverterTypeMap = {
    [key in MapLayerConverterType]: MapLayerConverter;
};

export const mapLayerConverterTypeMap: MapLayerConverterTypeMap = {
    [MapLayerConverterType.DEFAULT]: MapLayerConverterDefault,
};
