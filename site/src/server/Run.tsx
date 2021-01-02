import * as Express from "express";
import HttpException from "./errors/HttpException";

const PROCESS_DIRECTORY: string = process.cwd();
const INDEX_DIRECTORY: string = `${PROCESS_DIRECTORY}/site/public/`;

console.log("Process Directory: ", PROCESS_DIRECTORY);
console.log("Index Directory: ", INDEX_DIRECTORY);

const app = Express();

app.use(Express.static(INDEX_DIRECTORY));

// app.get("/", (req: Express.Request, res: Express.Response) => {
//     try {
//         res.sendFile(INDEX_DIRECTORY + "index.html", INDEX_DIRECTORY);
//     } catch (err) {
//         console.log(err);
//     }
// });

app.use(function (
    err: HttpException,
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) {
    // * Unauthorised error
    if (401 == err.status) {
        res.redirect("/home");
    }
});

app.get("*", function (req, res) {
    res.redirect("/");
});

const port = 80;
app.listen(port, () => console.log(`Listening on port ${port}!`));
