import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import mustacheExpress from 'mustache-express';

// controllers
import * as apiController from "./api";

// express
const app = express();

// port
app.set("port", process.env.PORT || 3000);

// compression middleware
app.use(compression());

// template
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// json middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", apiController.getRandomAnime);

app.listen(app.get("port"), () => {
  console.log("server is running at http://localhost:%d in %s mode.", app.get("port"), app.get("env"));
  console.log("Press CTRL-C to stop.");
});
