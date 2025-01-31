import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    anfitrionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publicacionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    precioTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", BookingSchema);
