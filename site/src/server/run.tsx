import * as Database from "./Database";
import * as Express from "express";
import HttpException from "./errors/HttpException"

const PROCESS_DIRECTORY: string = process.cwd();
const INDEX_DIRECTORY: string = `${PROCESS_DIRECTORY}/site/public/`;
const STATIC_DIRECTORY: string = `${PROCESS_DIRECTORY}/site/public/static/`;

console.log("Process Directory: ", PROCESS_DIRECTORY);
console.log("Index Directory: ", INDEX_DIRECTORY);
console.log("Static Directory: ", STATIC_DIRECTORY);

const app = Express()

app.use(Express.static(STATIC_DIRECTORY))

app.get('/home', (req: Express.Request, res: Express.Response) => {
    try {
        res.sendFile(INDEX_DIRECTORY + 'home.html', INDEX_DIRECTORY);
    } catch (err) {
        console.log(err);
    }
})

app.use(function (err: HttpException, req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    // * Unauthorised error
    if (401 == err.status) {
        res.redirect('/home')
    }
});

app.get('*', function (req, res) {
    res.redirect('/home');
});

let port = 80;
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}!`))

