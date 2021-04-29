const fs = require("fs");
const PNG = require("pngjs").PNG;


let inputDirectory = "res/graphics/";
let outputFile = "site/public/img/out.png";

function readPng(input) {
    const file = fs.readFileSync(input);
    const png = PNG.sync.read(file);
    return png;
}

function writePng(dir, png) {
    const buffer = PNG.sync.write(png);
    fs.writeFileSync(dir, buffer, { flag: "w" });
}


function main() {
    console.log("CompileArt");
    const inputFiles = fs.readdirSync(inputDirectory).map(file => inputDirectory + file);
    const pngFiles = inputFiles.map(readPng)

    console.log(inputFiles)
    console.log(pngFiles)

    writePng(outputFile, pngFiles[0]);
}


main();
