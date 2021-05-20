import { SpriteSheets } from "../../../resources/manifests";
import { map3D, create3DArray } from "../../../util/math";
import { ServiceLocator } from "../../ServiceLocator";
import { ColourMap } from "./ReferenceMap";
import { VoxelGroupData, VoxelGroup3D } from "./VoxelGroup3D";

export function getVoxelGroupFromSprite (serviceLocator: ServiceLocator, spriteIcon: string, sizePerVoxel: number) {
    const weaponColourMap = new ColourMap();
    const spriteSheet = serviceLocator.getResourceManager().manifest.spritesheets[SpriteSheets.SPRITE];
    const sprite = spriteSheet.getSprite(spriteIcon);
    const imageData = spriteSheet.imageData;

    const width = sprite.pixelCoordinate.textureWidth;
    const height = sprite.pixelCoordinate.textureHeight;
    const depth = 1;

    const data = map3D(create3DArray(width, height, depth, 0), (val: number, x: number, y: number, z: number) => {
        return 0;
    });

    for (let x = 0; x < width; x ++) {
        const spriteX = x + sprite.pixelCoordinate.textureX;
        for (let y = 0; y < height; y++) {
            const spriteY = (height - y - 1) + sprite.pixelCoordinate.textureY;

            const index = (spriteX + (spriteY * imageData.width) ) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3];
        
            if (r > 0 || g > 0 || b > 0 || a > 0) {
                data[x][y][0] = weaponColourMap.getID([
                    r / 255,
                    g / 255,
                    b / 255
                ]) + 1;
            }
        }
    }

    const voxelData: VoxelGroupData = {
        colourMap: weaponColourMap.getMap(),
        data,
        sizePerVoxel
    };

    const voxelGroup = new VoxelGroup3D(serviceLocator, voxelData);
    return voxelGroup;
}

