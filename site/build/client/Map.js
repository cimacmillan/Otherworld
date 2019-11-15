"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initialiseMap(screen) {
    exports.wall_buffer = [];
    exports.wall_buffer.push({
        p0: { x: 0.0, y: 0.0 },
        p1: { x: 10.0, y: 0.0 },
        height0: 0.5,
        height1: 1,
        offset0: 0,
        offset1: 0
    });
    exports.wall_buffer.push({
        p0: { x: 10.0, y: 0.0 },
        p1: { x: 10.0, y: 10.0 },
        height0: 1,
        height1: 1,
        offset0: 0,
        offset1: 0.5
    });
    exports.wall_buffer.push({
        p0: { x: 10.0, y: 10.0 },
        p1: { x: 0.0, y: 10.0 },
        height0: 1,
        height1: 1,
        offset0: 0.5,
        offset1: 0
    });
    exports.wall_buffer.push({
        p0: { x: 0.0, y: 10.0 },
        p1: { x: 0.0, y: 0.0 },
        height0: 1,
        height1: 0.5,
        offset0: 0,
        offset1: 0
    });
    exports.map = { wall_buffer: exports.wall_buffer };
    let aspect_ratio = (screen.width / screen.height);
    let viewing_angle = 80;
    let radians = (viewing_angle / 180.0) * Math.PI;
    let focal_length = aspect_ratio / Math.tan(radians / 2);
    exports.camera = {
        position: { x: 5.0, y: 8.0 },
        angle: 0.0,
        focal_length,
        height: 0.5,
        x_view_window: aspect_ratio,
        y_view_window: 1.0,
        clip_depth: 0.1
    };
}
exports.initialiseMap = initialiseMap;
//# sourceMappingURL=Map.js.map