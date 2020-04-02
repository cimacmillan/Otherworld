import { ScreenBuffer } from "../../render";
import { Camera } from "../../types";
import { toRadians } from "../math";

const VIEWING_ANGLE = toRadians(110.0);

export function initialiseCamera(screen: ScreenBuffer): Camera {
	const aspect_ratio = screen.width / screen.height;
	const x_view_window = aspect_ratio;
	const y_view_window = 1.0;
	const focal_length = x_view_window / 2 / Math.tan(VIEWING_ANGLE / 2);

	return {
		position: { x: 0.0, y: 2.0 },
		angle: 0,
		focal_length,
		height: 1,
		x_view_window,
		y_view_window,
		clip_depth: 0.1,
		far_clip_depth: 10.0,
	};
}
