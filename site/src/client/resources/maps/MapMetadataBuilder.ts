import { MapDestination } from "../../services/map/MapService";
import { LockpickGameConfiguration } from "../../ui/containers/minigame/LockPickContainer";
import { GameItem } from "../manifests/Items";
import { MapLayerMetadata, MapMetadataObject } from "./MapShema";

export class MapMetadataBuilder {
    private items: MapMetadataItemBuilder[] = [];

    public at(x: number, y: number): MapMetadataItemBuilder {
        const builder = new MapMetadataItemBuilder(x, y);
        this.items.push(builder);
        return builder;
    }

    public get(): MapLayerMetadata[] {
        return this.items.map((item) => item.get());
    }
}

export class MapMetadataItemBuilder {
    private data: MapMetadataObject = {};
    constructor(private x: number, private y: number) {}

    public get(): MapLayerMetadata {
        return {
            x: this.x,
            y: this.y,
            data: this.data,
        };
    }

    public withHorizontal(horizontal: boolean) {
        this.data = { ...this.data, horizontal };
        return this;
    }

    public withLockConfiguration(configuration: LockpickGameConfiguration) {
        this.data = { ...this.data, configuration };
        return this;
    }

    public withLockKey(keyId: GameItem) {
        this.data = { ...this.data, keyId };
        return this;
    }

    public withItem(id: GameItem) {
        this.data = { ...this.data, id };
        return this;
    }

    public withDestination(destination: MapDestination) {
        this.data = { ...this.data, destination };
        return this;
    }
}
