import express from "express";
import { config } from "dotenv";
import cors from "cors";
import userRouter from "./modules/users/userRouter.js";
import bookingRouter from "./modules/bookings/bookingRouter.js";
import listingRouter from "./modules/listings/listingRouter.js";
import checkoutRouter from "./modules/checkout/checkoutRouter.js";
import favoRouter from "./modules/favorites/favoritesRouter.js";
import messageRouter from "./modules/message/messageRouter.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMessage } from "./middleware/handleErrorMessage.js";

const app = express();

config({ path: "./config.env" });

const isDev = process.env.NODE_ENV !== "production";
const clientOrigin = isDev
  ? process.env.FRONTEND_URI_DEV
  : process.env.FRONTEND_URI;
console.log(clientOrigin);
app.use(
  cors({
    origin: clientOrigin,
    methods: ["PUT", "DELETE", "POST", "GET"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser()); //Manejo de cookies
app.use(express.json()); //JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  fileUpload({
    useTempFiles: true, //archivos temporales
  }),
);

app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/listing", listingRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/favo", favoRouter);
app.use("/api/messages", messageRouter);

app.use(errorMessage);

export default app;
