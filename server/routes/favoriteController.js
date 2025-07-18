import { Favorites } from "../models/Favorites.js";

export const addToFavoDB = async (req, res, next) => {
  try {
    const { listingID, clientID } = req.body;

    const responseFavorite = await Favorites.create({
      clienteId: clientID,
      publicacionId: listingID,
    });

    res.status(200).json({
      success: true,
      message: "Item registrado a favoritos",
      responseFavorite,
    });
  } catch (error) {
    console.log(error);
  }
};
