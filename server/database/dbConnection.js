import mongoose from "mongoose";
import "../modules/checkout/Sales.js";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "REAL_STATE",
    });

    await mongoose.syncIndexes(); //fix del error del verifyPay => session_id repetidos

    console.log(
      `Conexion exitosa a la base de datos ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error("Ocurrió un error:", error);
    process.exit(1);
  }
};
