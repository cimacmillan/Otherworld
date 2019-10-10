"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const Chalk = require("./Chalk");
Chalk.bigLog();
const PROCESS_DIRECTORY = process.cwd();
const INDEX_DIRECTORY = `${PROCESS_DIRECTORY}/site/public/`;
const STATIC_DIRECTORY = `${PROCESS_DIRECTORY}/site/public/static/`;
console.log("Process Directory: ", PROCESS_DIRECTORY);
console.log("Index Directory: ", INDEX_DIRECTORY);
console.log("Static Directory: ", STATIC_DIRECTORY);
const app = Express();
app.use(Express.static(STATIC_DIRECTORY));
app.get('/home', (req, res) => {
    try {
        res.sendFile(INDEX_DIRECTORY + 'home.html', INDEX_DIRECTORY);
    }
    catch (err) {
        console.log(err);
    }
});
app.use(function (err, req, res, next) {
    // * Unauthorised error
    if (401 == err.status) {
        res.redirect('/home');
    }
});
app.get('*', function (req, res) {
    res.redirect('/home');
});
let port = 80;
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}!`));
//# sourceMappingURL=Run.js.map