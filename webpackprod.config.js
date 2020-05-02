const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, "site/build/client/Index.js");

module.exports = {
    entry: APP_DIR,
    mode: "production"
}