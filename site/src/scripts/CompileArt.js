const fs = require("fs");
const PNG = require("pngjs").PNG;


let inputDirectory = "res/graphics/";
let outputFile = "site/public/img/out.png";
let outputJSON = "site/public/img/out.json";

function readPng(input) {
    const file = fs.readFileSync(input);
    const png = PNG.sync.read(file);
    return png;
}

function readJson(input) {
    const file = fs.readFileSync(input);
    return JSON.parse(file);
}

function writePng(dir, png) {
    const buffer = PNG.sync.write(png);
    fs.writeFileSync(dir, buffer, { flag: "w" });
}

function writeJson(dir, json) {
    const val = JSON.stringify(json);
    fs.writeFileSync(dir, val, { flag: "w" });
}

function getManifestSize(manifest) {
    let width = 0;
    let height = 0;

    Object.entries(manifest).forEach(([key, value]) => {
        width = Math.max(value.x + value.width, width);
        height = Math.max(value.y + value.height, height);
    });

    return [width, height];
}

function getDoRectanglesOverlap(recA, recB) {
    if (recA.x + recA.width <= recB.x) {
        return false;
    }
    if (recA.x >= recB.x + recB.width) {
        return false;
    }
    if (recA.y + recA.height <= recB.y) {
        return false;
    }
    if (recA.y >= recB.y + recB.height) {
        return false;
    }
    return true;
}

function getIsManifestValid(manifest) {
    let isValid = true;
    Object.entries(manifest).forEach(([key, value]) => {
        Object.entries(manifest).forEach(([compareKey, compareValue]) => {
            if (key === compareKey) {
                return;
            }
            if (getDoRectanglesOverlap(value, compareValue)) {
                isValid = false;
            }
        });
    });
    return isValid;
}

function insertPngFileIntoNewManifest(manifest, obj) {
    const [ manifestWidth, manifestHeight ] = getManifestSize(manifest);

    let smallestSize = undefined;
    let bestManifest = undefined;

    for (let x = 0; x < manifestWidth + 1; x++) {
        for (let y = 0; y < manifestHeight + 1; y++) {
            const newManifest = {
                ...manifest,
                [obj.fileName]: {
                    x,
                    y,
                    width: obj.png.width,
                    height: obj.png.height
                }
            };

            if (!getIsManifestValid(newManifest)) {
                continue;
            }

            const [ newWidth, newHeight ] = getManifestSize(newManifest);
            const size = newWidth * newWidth + newHeight * newHeight;
            if (smallestSize === undefined || size < smallestSize) {
                smallestSize = size;
                bestManifest = newManifest;
            }
        }
    }

    return bestManifest;
}

function convertManifestAndPngFilesToPng(manifest, pngFiles) {
    const [ width, height ] = getManifestSize(manifest);
    const pngDest = new PNG({
        width,
        height,
        filterType: -1
    });

    Object.entries(manifest).forEach(([key, value]) => {
        const { x, y, width, height } = value;
        const png = pngFiles.find(file => file.fileName === key);
        for (var yPix = 0; yPix < png.png.height; yPix++) {
            for (var xPix = 0; xPix < png.png.width; xPix++) {

                const destX = x + xPix;
                const destY = y + yPix;
                const writeIndex = (pngDest.width * destY + destX) << 2;
                const readIndex = (png.png.width * yPix + xPix) << 2;
                pngDest.data[writeIndex] = png.png.data[readIndex] 
                pngDest.data[writeIndex + 1] = png.png.data[readIndex + 1]
                pngDest.data[writeIndex + 2] = png.png.data[readIndex + 2]
                pngDest.data[writeIndex + 3] = png.png.data[readIndex + 3]
            }
        }
    })
    return pngDest;
}

function mapPngFilesToPngAndManifest(pngFiles) {
    const manifest = pngFiles.reduce((manifest, file) => insertPngFileIntoNewManifest(manifest, file), {})
    const pngDest = convertManifestAndPngFilesToPng(manifest, pngFiles);
    return [pngDest, manifest]
}

function getManifestKeyFromFilename(fileName, ending) {
    return fileName.substring(inputDirectory.length, fileName.length - (ending.length + 1));
}

function getFrameCountFromJsonFile(jsonFile) {
    return Object.keys(jsonFile.json.frames).length
}

function getManifestWithFrameCounts(manifest, jsonFiles) {
    let newManifest = {...manifest};
    jsonFiles.forEach(jsonFile => {
        const frames = getFrameCountFromJsonFile(jsonFile);
        newManifest[getManifestKeyFromFilename(jsonFile.fileName, "json")].frames = frames
    });
    return newManifest;
}

function main() {
    console.log("CompileArt");
    const inputFiles = fs.readdirSync(inputDirectory).map(file => inputDirectory + file);
    const pngFiles = inputFiles.filter(fileName => fileName.substring(fileName.length - 3, fileName.length) === "png").map(fileName => ({
        png: readPng(fileName),
        fileName: getManifestKeyFromFilename(fileName, "png")
    }));
    const jsonFiles = inputFiles.filter(fileName => fileName.substring(fileName.length - 4, fileName.length) === "json").map((fileName) => ({
        json: readJson(fileName),
        fileName
    }));
    const [pngDest, manifest] = mapPngFilesToPngAndManifest(pngFiles);
    const [ width, height ] = getManifestSize(manifest);
    if (width > 2048 || height > 2048) {
        console.log("Warning, filesize getting big (", width, ", ", height, ")");
    }
    const manifestWithFrames = getManifestWithFrameCounts(manifest, jsonFiles);
    writeJson(outputJSON, manifestWithFrames);
    writePng(outputFile, pngDest);
}


main();
