import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  //Configutando el cloudinary con las credenciales
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;
//conectar app en el puerto 4000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente 🚀");
});
