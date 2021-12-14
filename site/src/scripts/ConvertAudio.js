const { exec } = require("child_process");
const fs = require("fs");

const directory = "/Users/callum/Downloads/kenney_rpgaudio/Audio";
const outputDirectory = "./site/public/audio/kenney_rpgaudio/"

if (!fs.existsSync(outputDirectory)){
    fs.mkdirSync(outputDirectory, { recursive: true });
}

const audioFiles = fs.readdirSync(directory);

audioFiles.forEach(file => {
    const filePath = directory + "/" + file;
    const outputFilePath = outputDirectory + file.substring(0, file.length - 4) + ".mp3";

    console.log("Converting", filePath, "to", outputFilePath);

    exec(`ffmpeg -i ${filePath} -acodec mp3 ${outputFilePath}`);
});
