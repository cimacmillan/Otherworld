import { vec3 } from "gl-matrix";
import { GameItems } from "../../resources/manifests/Items";
import { VoxelGroupData, VoxelGroup3D } from "../../services/render/util/VoxelGroup3D";
import { ServiceLocator } from "../../services/ServiceLocator";
import { map3D, create3DArray, randomIntRange, forEach3D } from "../../util/math";
import { EquipableItem } from "../scripting/items/ItemTypes";

export class PlayerEquipmentRender {

    private weaponVoxelGroup?: VoxelGroup3D;

    constructor(private serviceLocator: ServiceLocator) {
        this.setWeapon(GameItems.WEAPON_WOOD_STICK as EquipableItem);
    }

    public onEquip(item: EquipableItem) {
       
    }

    public onUnequip(item: EquipableItem) {

    }

    private setWeapon(weapon: EquipableItem) {
        const data = map3D(create3DArray(50, 50, 50, 0), (val: number, x: number, y: number, z: number) => {
            if (Math.random() > 0.3) {
                return 0;
            }
            return randomIntRange(1, 4);
        });

        const colourMap: vec3[] =  [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        const voxelData: VoxelGroupData = {
            colourMap,
            data,
            sizePerVoxel: 0.005
        };

        const voxelGroup = new VoxelGroup3D(this.serviceLocator, voxelData);

        const x = 379.50 / 20;
        const y = (671.84 / 20) - 2;
        const h = 0.5;

        voxelGroup.setPosition([x, h, y]);
        voxelGroup.setCenter([2.5 * 0.05, 2.5 * 0.05, 2.5 * 0.05]);
        voxelGroup.attach();
        let rads = 0;
        setInterval(() => {
            rads += 0.01;
            voxelGroup.setAngle([rads, rads, rads]);
        }, 10);
        // setInterval(() => {
        //     colourMap.forEach((_, index) => {
        //         colourMap[index] = [Math.random(), Math.random(), Math.random()];
        //     })
        //     forEach3D(voxelData.data, (val: number, x: number, y: number, z: number) => {
        //         if (Math.random() > 0.3) {
        //             voxelData.data[x][y][z] = 0;
        //         } else {
        //             voxelData.data[x][y][z] = randomIntRange(1, 4);
        //         }
        //     });
        //     voxelGroup.onDataUpdate();
        // }, 200)
    }

}
