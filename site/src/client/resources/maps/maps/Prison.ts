import { MapLayerConverterType } from "../MapLayerConverters";
import { MapSchema } from "../MapShema";

export const MapPrison: MapSchema = {
    layers: [
        {
            imageUrl: "map/prison/block.png",
            mapLayerConverter: MapLayerConverterType.DEFAULT,
            mapMetadata: [
                {
                    x: 25,
                    y: 28,
                    data: {
                        configuration: {
                            width: 1,
                            height: 1,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 27,
                    y: 28,
                    data: {
                        configuration: {
                            width: 2,
                            height: 1,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 29,
                    y: 28,
                    data: {
                        configuration: {
                            width: 2,
                            height: 2,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 31,
                    y: 28,
                    data: {
                        configuration: {
                            width: 3,
                            height: 2,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 33,
                    y: 28,
                    data: {
                        configuration: {
                            width: 3,
                            height: 3,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 35,
                    y: 28,
                    data: {
                        configuration: {
                            width: 4,
                            height: 4,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 37,
                    y: 28,
                    data: {
                        configuration: {
                            width: 5,
                            height: 5,
                            shouldReset: true,
                        },
                    },
                },
                {
                    x: 39,
                    y: 28,
                    data: {
                        configuration: {
                            width: 6,
                            height: 6,
                            shouldReset: true,
                        },
                    },
                },
            ],
        },
    ],
};
