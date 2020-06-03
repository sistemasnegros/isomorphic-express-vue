// Dependencies
import express from "express";
import webpack from "webpack";
import path from "path";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// Webpack Configuration
const webpackConfig = require("../../webpack.config.babel");

// Helpers
import * as hbsHelper from "./helpers/handlebars";

// Validate env
import { isDevelopment } from "./lib/utilsSys";

// Cors local
import cors from "./middlewares/cors";

// Server Port
import { PORT } from "../const";

// Express app
const app = express();

//http
import http from "http";

const server = http.createServer(app);

//Peticiones post
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
app.use(cookieParser());

// Public
app.use(express.static(path.join(__dirname, "../public")));

// Handlebars setup
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    helpers: hbsHelper
  })
);

// View Engine Setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", ".hbs");

// Webpack Compiler
const webpackCompiler = webpack(webpackConfig);

if (isDevelopment) {
  app.use(webpackDevMiddleware(webpackCompiler));
  app.use(webpackHotMiddleware(webpackCompiler));
} else {
  app.get("*.js.gz", (req, res, next) => {
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "text/javascript");
    next();
  });

  // enable dist
  app.use(express.static(path.join(__dirname, "../../dist")));
}

// dectect real ip client
app.use((req, res, next) => {
  const ip =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;

  if (typeof ip === "string" || ip instanceof String) {
    req.remoteAddress = ip.replace("::ffff:", "");
  }

  return next();
});

// enable cors
app.use(cors);

const template = isDevelopment ? "indexDev" : "indexPro";
// Sending all the traffic to React
app.get("*", (req, res) => {
  res.render(template, {
    layout: false
  });
});

// Disabling x-powered-by
app.disable("x-powered-by");

// Listen Express
server.listen(PORT, err => {
  if (!err) {
    console.log(`Express running port: ${PORT} `);
  }
});
