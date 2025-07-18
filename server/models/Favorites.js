import mongoose from "mongoose";

const FavoritesSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publicacionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  },
  { timestamps: true }
);

export const Favorites = mongoose.model("Favorites", FavoritesSchema);
