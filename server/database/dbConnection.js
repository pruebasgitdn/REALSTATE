import mongoose from "mongoose";

export const dbConnection = () =>
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "REAL_STATE",
    })
    .then(({ connection }) => {
      console.log(
        `Conexion exitosa a la base de datos ${mongoose.connection.name}`
      );
    })
    .catch((error) => console.log(`Ocurrio algun error :${error}`));
