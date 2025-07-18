import express from "express";
import { config } from "dotenv";
import cors from "cors"; //peticion a otros dominios
import { dbConnection } from "./database/dbConnection.js";
import userRouter from "./routes/userRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import listingRouter from "./routes/listingRouter.js";
import checkoutRouter from "./routes/checkoutRouter.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

config({ path: "./config.env" });

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["PUT", "DELETE", "POST", "GET"],
    credentials: true,
  })
);

app.use(cookieParser()); //Manejo de cookies (req.cookies =>etc)
app.use(express.json()); //Manejo de solicitudes JSON
app.use(express.urlencoded({ extended: true })); //Manejo de datos HTML(Forms)
app.use(express.static("public"));

app.use(
  fileUpload({
    useTempFiles: true, //archivos temporales
  })
);

app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/listing", listingRouter);
app.use("/api/checkout", checkoutRouter);

dbConnection();

export default app;
