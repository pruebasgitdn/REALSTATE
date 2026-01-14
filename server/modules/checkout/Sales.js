import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema({
  session_id: {
    type: String,
    unique: true,
    required: true,
  },
  antiguoPropID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nuevoPropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  publicacionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },
  precioVenta: { type: Number, required: true },
  fechaVenta: { type: Date, default: Date.now },
});

export const Sales = mongoose.model("Sales", SalesSchema);
