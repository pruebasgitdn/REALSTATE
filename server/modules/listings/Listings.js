import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    categoria: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    direccionCalle: {
      type: String,
      required: true,
    },
    municipio: {
      type: String,
      required: true,
    },
    departamento: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    cantidadHuespedes: {
      type: Number,
      required: true,
    },
    cantidadDormitorios: {
      type: Number,
      required: true,
    },
    cantidadCamas: {
      type: Number,
      required: true,
    },
    cantidadBanos: {
      type: Number,
      required: true,
    },
    comodidades: {
      type: Array,
      default: [],
    },
    fotos: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    destacado: {
      type: String,
      required: false,
    },
    descripcionDestacado: {
      type: String,
      required: false,
    },
    precio: {
      type: Number,
      required: true,
    },
    unidadPrecio: {
      type: String,
      enum: ["fijo", "mes", "día"],
      required: true,
    },
    tipoPublicacion: {
      type: String,
      enum: ["venta", "alquiler"],
      required: true,
    },
    estado: {
      type: String,
      enum: ["habilitado", "inhabilitado"],
      default: "habilitado",
    },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", ListingSchema);
