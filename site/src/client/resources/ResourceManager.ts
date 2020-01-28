import { Texture, FastTexture } from "../types";
import { loadTextureFromURL, convertToFastTexture } from "../util/loader/TextureLoader";

export class ResourceManager {

    public sprite: FastTexture;
    public wall: FastTexture;
    public floor: FastTexture;

    public async load() {
        this.sprite = convertToFastTexture(await loadTextureFromURL("img/sprite.png"));
        this.wall = convertToFastTexture(await loadTextureFromURL("img/wall.png"));
        this.floor = convertToFastTexture(await loadTextureFromURL("img/floor.png"));
    }
    
}


