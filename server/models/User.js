import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      minLength: [3, "El nombre debe tener al menos 3 caracteres"],
    },
    apellido: {
      type: String,
      required: true,
      minLength: [3, "El apellido debe tener al menos 3 caracteres"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    listaViajes: {
      type: Array,
      default: [],
    },
    listaDeseos: {
      type: Array,
      default: [],
    },
    listaPropiedades: {
      type: Array,
      default: [],
    },
    listaReservas: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

//HASHEAR passwordS
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparar passwords hasheadas
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generar JSONTOKEN
UserSchema.methods.generateJWT = function () {
  //Firma el token con el _id
  return jwt.sign(
    {
      id: this._id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

export const User = mongoose.model("User", UserSchema);
