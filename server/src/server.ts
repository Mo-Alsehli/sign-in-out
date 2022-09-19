import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { user_routes } from "./handlers/user";
import cors from "cors";

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.get("/", function (req: Request, res: Response) {
  res.send("<h1>Hello World!</h1>");
});

user_routes(app);
app.listen(port, function () {
  console.log(`App listening on port ${port}...`);
});
