const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./Config/db");

dotenv.config();

const app = express();

db();

app.use((req, res, next) => {
  res.locals.errors = [];
  next();
});

app.use(express.json({ limit: "3mb" })); // ? Json verileri alabilmek icin Limit ile

app.use(express.urlencoded({ limit: "3mb", extended: true })); // ? Formdaki verileri alabilmek icin

app.use(
  cors({
    origin: ["https://restaurant-frontend-dun.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    maxAge: 20000,
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const imageRouter = require("./Routers/image");
const userRouter = require("./Routers/user");
const foodRouter = require("./Routers/food");
const orderRouter = require("./Routers/order");

app.use("/api/v1/all", imageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/order", orderRouter);

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
