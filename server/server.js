import app from "./app.js";
import http from "http";
import cloudinary from "cloudinary";
import { initSocket } from "./socket.js";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";

config({ path: "./config.env" });

const server = http.createServer(app);

initSocket(server);

//Config  cloudinary credenciales
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente 🚀");
});
dbConnection();
