/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./site/build/client/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./site/build/client/Game.js":
/*!***********************************!*\
  !*** ./site/build/client/Game.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Sound_1 = __webpack_require__(/*! ./Sound */ \"./site/build/client/Sound.js\");\nconst Graphics_1 = __webpack_require__(/*! ./Graphics */ \"./site/build/client/Graphics.js\");\nconst Input_1 = __webpack_require__(/*! ./Input */ \"./site/build/client/Input.js\");\nconst Map_1 = __webpack_require__(/*! ./Map */ \"./site/build/client/Map.js\");\nvar gameScreen;\nvar depth_buffer;\nvar current_frame;\nvar last_frame_time;\nvar fps;\nfunction bootstrap() {\n    console.log(\"Hello World\");\n    console.log(\"Game\");\n    var sound = new Sound_1.Sound();\n    var dogBarkingBuffer;\n    gameScreen = new Graphics_1.GameScreen(\"viewport\", 4);\n    depth_buffer = new Graphics_1.DepthBuffer(screen.width, screen.height);\n    // let mySound = new sound(\"audio/bassdrum.mp3\");\n    Sound_1.loadSound(\"audio/song.mp3\", (buffer) => {\n        dogBarkingBuffer = buffer;\n        setTimeout(function () {\n            sound.context.resume();\n            Sound_1.playSound(dogBarkingBuffer, sound);\n        }, 2000);\n    }, sound);\n    current_frame = 0;\n    init();\n    last_frame_time = Date.now();\n    fps = 0;\n    mainLoop(0);\n}\nexports.bootstrap = bootstrap;\nfunction init() {\n    Input_1.initialiseInput();\n    Map_1.initialiseMap(screen);\n}\nfunction update(tframe) {\n    Input_1.updateInput();\n    // Audio requires user interaction first\n    // sound.pan_node.pan.value = Math.sin(tframe / 1000);\n    // sound.gain_node.gain.value = Math.abs(sound.pan_node.pan.value)\n    // if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {\n    //     console.log(\"update - \", sound.pan_node.pan.value);\n    // }\n}\nfunction draw(tframe) {\n    // Create the image\n    Graphics_1.createImage(gameScreen, depth_buffer);\n    // Draw the image data to the canvas\n    gameScreen.render_to_canvas();\n}\nfunction mainLoop(tframe) {\n    let delta = Date.now() - last_frame_time;\n    if (delta >= 1000) {\n        console.log(\"FPS: \", fps);\n        fps = 0;\n        last_frame_time = Date.now();\n    }\n    else {\n        fps++;\n    }\n    update(tframe);\n    draw(tframe);\n    requestAnimationFrame(mainLoop);\n    current_frame += 1;\n}\n//# sourceMappingURL=Game.js.map\n\n//# sourceURL=webpack:///./site/build/client/Game.js?");

/***/ }),

/***/ "./site/build/client/Graphics.js":
/*!***************************************!*\
  !*** ./site/build/client/Graphics.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Map_1 = __webpack_require__(/*! ./Map */ \"./site/build/client/Map.js\");\nclass DepthBuffer {\n    constructor(width, height) {\n        this.data = Array(width * height).fill(0);\n        this.width = width;\n        this.height = height;\n    }\n    isCloser(x, y, distance) {\n        let index = (y * this.width) + x;\n        return 1.0 / distance > this.data[index];\n    }\n    setDistance(x, y, distance) {\n        let index = (y * this.width) + x;\n        this.data[index] = 1.0 / distance;\n    }\n    reset() {\n        this.data = Array(this.width * this.height).fill(0);\n    }\n}\nexports.DepthBuffer = DepthBuffer;\nclass GameScreen {\n    constructor(canvas_element_name, resolution_divisor) {\n        this.canvas = document.getElementById(canvas_element_name);\n        this.canvas_context = this.canvas.getContext(\"2d\");\n        this.canvas_context.imageSmoothingEnabled = false;\n        this.resolution_divisor = resolution_divisor;\n        this.width = this.canvas.width / resolution_divisor;\n        this.height = this.canvas.height / resolution_divisor;\n        this.image_data = this.canvas_context.createImageData(this.width, this.height);\n    }\n    putPixel(x, y, red, green, blue, alpha) {\n        var pixelindex = (y * this.width + x) * 4;\n        this.image_data.data[pixelindex] = red;\n        this.image_data.data[pixelindex + 1] = green;\n        this.image_data.data[pixelindex + 2] = blue;\n        this.image_data.data[pixelindex + 3] = alpha;\n    }\n    render_to_canvas() {\n        this.canvas_context.putImageData(this.image_data, 0, 0);\n        this.canvas_context.drawImage(this.canvas, 0, 0, this.resolution_divisor * this.canvas.width, this.resolution_divisor * this.canvas.height);\n    }\n}\nexports.GameScreen = GameScreen;\nfunction vec_cross(a, b) {\n    return (a.x * b.y) - (a.y * b.x);\n}\nfunction vec_sub(a, b) {\n    return {\n        x: a.x - b.x,\n        y: a.y - b.y\n    };\n}\nfunction vec_add(a, b) {\n    return {\n        x: a.x + b.x,\n        y: a.y + b.y\n    };\n}\nexports.vec_add = vec_add;\nfunction vec_divide(a, b) {\n    return {\n        x: a.x / b.x,\n        y: a.y / b.y\n    };\n}\nfunction vec_rotate(a, theta) {\n    return {\n        x: a.x * Math.cos(theta) - a.y * Math.sin(theta),\n        y: a.y * Math.cos(theta) + a.x * Math.sin(theta)\n    };\n}\nexports.vec_rotate = vec_rotate;\nfunction interpolate(alpha, a, b) {\n    return (a * (1 - alpha)) + (b * alpha);\n}\nfunction convert_unit(x, range, a, b) {\n    let grad = x / range;\n    return interpolate(grad, a, b);\n}\nfunction fire_ray(origin, direction) {\n    let intersecting_rays = [];\n    Map_1.map.wall_buffer.forEach((wall) => {\n        let wall_direction = vec_sub(wall.p1, wall.p0);\n        //Funky maths\n        let wall_interpolation = (vec_cross(origin, direction) - vec_cross(wall.p0, direction)) / vec_cross(wall_direction, direction);\n        let ray_interpolation = (vec_cross(wall.p0, wall_direction) - vec_cross(origin, wall_direction)) / vec_cross(direction, wall_direction);\n        if (wall_interpolation >= 0 && wall_interpolation <= 1 && ray_interpolation > Map_1.camera.clip_depth) {\n            let intersection = { x: origin.x + ray_interpolation * direction.x, y: origin.y + ray_interpolation * direction.y };\n            let length = Math.sqrt(Math.pow(intersection.x - origin.x, 2) + Math.pow(intersection.y - origin.y, 2));\n            intersecting_rays.push({\n                wall: wall,\n                wall_interpolation: wall_interpolation,\n                ray_interpolation: ray_interpolation,\n                origin: origin,\n                direction: direction,\n                intersection: intersection,\n                length: length\n            });\n        }\n    });\n    return intersecting_rays;\n}\nfunction drawWall(x, ray, screen, theta, camera, depth_buffer) {\n    let upper_wall_z = -interpolate(ray.wall_interpolation, ray.wall.height0 + ray.wall.offset0 - camera.height, ray.wall.height1 + ray.wall.offset1 - camera.height);\n    let lower_wall_z = -interpolate(ray.wall_interpolation, ray.wall.offset0 - camera.height, ray.wall.offset1 - camera.height);\n    let distance = ray.length * Math.cos(theta);\n    let upper_pixel = ((upper_wall_z / distance) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;\n    let lower_pixel = ((lower_wall_z / distance) * camera.focal_length * camera.y_view_window + 0.5) * screen.height;\n    let temp = upper_pixel;\n    upper_pixel = Math.min(upper_pixel, lower_pixel);\n    lower_pixel = Math.max(temp, lower_pixel);\n    upper_pixel = Math.max(0, upper_pixel);\n    lower_pixel = Math.min(screen.height - 1, lower_pixel);\n    for (var y = Math.floor(upper_pixel); y < Math.floor(lower_pixel); y++) {\n        if (depth_buffer.isCloser(x, y, ray.length)) {\n            depth_buffer.setDistance(x, y, ray.length);\n            screen.putPixel(x, y, 255, ((ray.intersection.x % 2) / 2) * 255, ((ray.intersection.y % 2) / 2) * 255, 255);\n        }\n    }\n}\nfunction createImage(screen, depth_buffer) {\n    depth_buffer.reset();\n    // Loop over all of the pixels\n    for (var x = 0; x < screen.width; x++) {\n        for (var y = 0; y < screen.height; y++) {\n            screen.putPixel(x, y, 0, 0, 0, 255);\n        }\n        // Proper focal length and viewing angle\n        let x_grad = convert_unit(x, screen.width, -Map_1.camera.x_view_window, Map_1.camera.x_view_window);\n        let direction = vec_rotate({ x: x_grad, y: -Map_1.camera.focal_length }, Map_1.camera.angle);\n        let origin = Map_1.camera.position;\n        let theta = Math.atan(x_grad / -Map_1.camera.focal_length);\n        let intersecting_rays = fire_ray(origin, direction);\n        intersecting_rays.forEach((ray) => drawWall(x, ray, screen, theta, Map_1.camera, depth_buffer));\n    }\n}\nexports.createImage = createImage;\n//# sourceMappingURL=Graphics.js.map\n\n//# sourceURL=webpack:///./site/build/client/Graphics.js?");

/***/ }),

/***/ "./site/build/client/Input.js":
/*!************************************!*\
  !*** ./site/build/client/Input.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Graphics_1 = __webpack_require__(/*! ./Graphics */ \"./site/build/client/Graphics.js\");\nconst Map_1 = __webpack_require__(/*! ./Map */ \"./site/build/client/Map.js\");\nvar keys_down_set = {};\nfunction initialiseInput() {\n    window.addEventListener('keydown', keyboardInput);\n    window.addEventListener('keyup', keyboardInput);\n}\nexports.initialiseInput = initialiseInput;\nfunction isKeyDown(key) {\n    return keys_down_set[key] == true;\n}\nfunction keyboardInput(e) {\n    keys_down_set[e.code] = (e.type == \"keydown\") ? true : false;\n}\nfunction updateInput() {\n    let speed = 0.1;\n    if (isKeyDown(\"KeyW\")) {\n        let camera_add = Graphics_1.vec_rotate({ x: 0, y: -speed }, Map_1.camera.angle);\n        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);\n    }\n    if (isKeyDown(\"KeyS\")) {\n        let camera_add = Graphics_1.vec_rotate({ x: 0, y: speed }, Map_1.camera.angle);\n        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);\n    }\n    if (isKeyDown(\"KeyA\")) {\n        let camera_add = Graphics_1.vec_rotate({ x: -speed, y: 0 }, Map_1.camera.angle);\n        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);\n    }\n    if (isKeyDown(\"KeyD\")) {\n        let camera_add = Graphics_1.vec_rotate({ x: speed, y: 0 }, Map_1.camera.angle);\n        Map_1.camera.position = Graphics_1.vec_add(Map_1.camera.position, camera_add);\n    }\n    if (isKeyDown(\"Space\")) {\n        Map_1.camera.height += speed;\n    }\n    if (isKeyDown(\"ShiftLeft\")) {\n        Map_1.camera.height -= speed;\n    }\n    if (isKeyDown(\"ArrowLeft\")) {\n        Map_1.camera.angle -= speed / 3;\n    }\n    if (isKeyDown(\"ArrowRight\")) {\n        Map_1.camera.angle += speed / 3;\n    }\n}\nexports.updateInput = updateInput;\n//# sourceMappingURL=Input.js.map\n\n//# sourceURL=webpack:///./site/build/client/Input.js?");

/***/ }),

/***/ "./site/build/client/Map.js":
/*!**********************************!*\
  !*** ./site/build/client/Map.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction initialiseMap(screen) {\n    exports.wall_buffer = [];\n    exports.wall_buffer.push({\n        p0: { x: 0.0, y: 0.0 },\n        p1: { x: 10.0, y: 0.0 },\n        height0: 0.5,\n        height1: 1,\n        offset0: 0,\n        offset1: 0\n    });\n    exports.wall_buffer.push({\n        p0: { x: 10.0, y: 0.0 },\n        p1: { x: 10.0, y: 10.0 },\n        height0: 1,\n        height1: 1,\n        offset0: 0,\n        offset1: 0.5\n    });\n    exports.wall_buffer.push({\n        p0: { x: 10.0, y: 10.0 },\n        p1: { x: 0.0, y: 10.0 },\n        height0: 1,\n        height1: 1,\n        offset0: 0.5,\n        offset1: 0\n    });\n    exports.wall_buffer.push({\n        p0: { x: 0.0, y: 10.0 },\n        p1: { x: 0.0, y: 0.0 },\n        height0: 1,\n        height1: 0.5,\n        offset0: 0,\n        offset1: 0\n    });\n    exports.map = { wall_buffer: exports.wall_buffer };\n    let aspect_ratio = (screen.width / screen.height);\n    let viewing_angle = 80;\n    let radians = (viewing_angle / 180.0) * Math.PI;\n    let focal_length = aspect_ratio / Math.tan(radians / 2);\n    exports.camera = {\n        position: { x: 5.0, y: 8.0 },\n        angle: 0.0,\n        focal_length,\n        height: 0.5,\n        x_view_window: aspect_ratio,\n        y_view_window: 1.0,\n        clip_depth: 0.1\n    };\n}\nexports.initialiseMap = initialiseMap;\n//# sourceMappingURL=Map.js.map\n\n//# sourceURL=webpack:///./site/build/client/Map.js?");

/***/ }),

/***/ "./site/build/client/Sound.js":
/*!************************************!*\
  !*** ./site/build/client/Sound.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass Sound {\n    constructor() {\n        window.AudioContext = window.AudioContext;\n        this.context = new AudioContext();\n        this.pan_node = new StereoPannerNode(this.context, { pan: 0 });\n        this.gain_node = this.context.createGain();\n    }\n}\nexports.Sound = Sound;\nfunction loadSound(url, callback, sound) {\n    var request = new XMLHttpRequest();\n    request.open('GET', url, true);\n    request.responseType = 'arraybuffer';\n    // Decode asynchronously\n    request.onload = function () {\n        sound.context.decodeAudioData(request.response, callback, (e) => console.log(e));\n    };\n    request.send();\n}\nexports.loadSound = loadSound;\nfunction playSound(buffer, sound) {\n    var source = sound.context.createBufferSource(); // creates a sound source\n    source.buffer = buffer; // tell the source which sound to play\n    source.connect(sound.pan_node).connect(sound.gain_node).connect(sound.context.destination); // connect the source to the context's destination (the speakers)\n    source.start(0); // play the source now\n}\nexports.playSound = playSound;\n//# sourceMappingURL=Sound.js.map\n\n//# sourceURL=webpack:///./site/build/client/Sound.js?");

/***/ }),

/***/ "./site/build/client/index.js":
/*!************************************!*\
  !*** ./site/build/client/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Game = __webpack_require__(/*! ./Game */ \"./site/build/client/Game.js\");\nconsole.log(\"!!\");\n// const render = () => ReactDOM.render(<h1> Hello World! React Etc</h1>, document.getElementById(\"root\"))\n// render();\nGame.bootstrap();\n//# sourceMappingURL=Index.js.map\n\n//# sourceURL=webpack:///./site/build/client/index.js?");

/***/ })

/******/ });