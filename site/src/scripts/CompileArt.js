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

function writePng(dir, png) {
    const buffer = PNG.sync.write(png);
    fs.writeFileSync(dir, buffer, { flag: "w" });
}

function writeJson(dir, json) {
    const val = JSON.stringify(json);
    fs.writeFileSync(dir, val, { flag: "w" });
}

function insertPngFileIntoNewManifest(manifest, obj) {
    console.log(obj);
    return {
        ...manifest,
        [obj.fileName]: "test",
    }
}

function mapPngFilesToPngAndManifest(pngFiles) {
    const manifest = pngFiles.reduce((manifest, file) => insertPngFileIntoNewManifest(manifest, file), {})
    const pngDest = new PNG({
        width: 100,
        height: 100,
        filterType: -1
    });
    for (var y = 0; y < pngDest.height; y++) {
        for (var x = 0; x < pngDest.width; x++) {
            var idx = (pngDest.width * y + x) << 2;
            pngDest.data[idx  ] = Math.floor(Math.random() * 255); // red
            pngDest.data[idx+1] = Math.floor(Math.random() * 255);; // green
            pngDest.data[idx+2] = Math.floor(Math.random() * 255);; // blue
            pngDest.data[idx+3] = 255; // alpha (0 is transparent)
        }
    }
    return [pngDest, manifest]
}

function main() {
    console.log("CompileArt");
    const inputFiles = fs.readdirSync(inputDirectory).map(file => inputDirectory + file);
    const pngFiles = inputFiles.map(fileName => ({
        png: readPng(fileName),
        fileName: fileName.substring(inputDirectory.length, fileName.length - 4)
    }));

    const [pngDest, manifest] = mapPngFilesToPngAndManifest(pngFiles);

    writeJson(outputJSON, manifest);
    writePng(outputFile, pngDest);
}


main();
