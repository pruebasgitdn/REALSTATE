import { validationResult } from "express-validator";
import { Favorites } from "./Favorites.js";
import { ResponseSucces } from "../../utils/ResponseSucces.js";
import { AppError } from "../../utils/AppError.js";
import { mapValidationErrors } from "../../utils/mappedValidationErrors.js";

export const addToFavoDB = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const mappedErrors = mapValidationErrors(errors);
      return next(
        new AppError({
          message: "Error de validación",
          errors: mappedErrors,
          statusCode: 400,
          success: false,
        })
      );
    }

    const { listingID, clientID } = req.body;

    const alreadyExists = await Favorites.findOne({
      clienteId: clientID,
      publicacionId: listingID,
    });

    if (alreadyExists) {
      return next(
        new AppError({
          message: "Esta publicación ya está en tus favoritos",
          statusCode: 409,
          success: false,
        })
      );
    }

    const responseFavorite = await Favorites.create({
      clienteId: clientID,
      publicacionId: listingID,
    });

    res
      .status(200)
      .json(
        new ResponseSucces("Item registrado a favoritos", responseFavorite)
      );
  } catch (error) {
    console.log(error);
    return next(
      new AppError({
        message: "ERROR INTERNO DEL SERVIDOR",
        statusCode: 500,
        success: false,
      })
    );
  }
};

export const removeFromFavoDB = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const mappedErrors = mapValidationErrors(errors);
      return next(
        new AppError({
          statusCode: 404,
          success: false,
          errors: mappedErrors,
          message: "Errores de validacion",
        })
      );
    }

    const { clientID, listingID } = req.body;

    //verificar si ya esta
    const isIn = await Favorites.findOne({
      clienteId: clientID,
      publicacionId: listingID,
    });

    if (!isIn || isIn.length == 0) {
      return next(
        new AppError({
          message: "Esta publicación no está en tus favoritos",
          statusCode: 409,
          success: false,
        })
      );
    }

    const deletedItem = await Favorites.findOneAndDelete({
      clienteId: clientID,
      publicacionId: listingID,
    });

    if (
      !deletedItem ||
      deletedItem.length === 0 ||
      deletedItem === null ||
      deletedItem == []
    ) {
      return next(
        new AppError({
          statusCode: 404,
          success: false,
          message: "No se encontro el favorito para eliminar",
        })
      );
    }

    res
      .status(200)
      .json(
        new ResponseSucces("Favorito eliminado correctamente", deletedItem)
      );
  } catch (error) {
    console.log(error);
    return next(
      new AppError({
        message: "ERROR INTERNO DEL SERVIDOR",
        statusCode: 500,
        success: false,
      })
    );
  }
};

export const getUsersFavo = async (req, res, next) => {
  try {
    const idc = req.user.id;
    const response = await Favorites.find({
      clienteId: idc,
    })
      .select("publicacionId -_id")
      .populate("publicacionId");
    if (!response || response.length === 0) {
      return next(
        new AppError({
          statusCode: 404,
          success: false,
          message: "No se encontraron elementos",
        })
      );
    }

    res.status(200).json(new ResponseSucces("Items encontrados", response));
  } catch (error) {
    console.log(error);
    return next(
      new AppError({
        message: "ERROR INTERNO DEL SERVIDOR",
        statusCode: 500,
        success: false,
      })
    );
  }
};

export const getUsersFavoTT = async (req, res, next) => {
  try {
    const userID = req.user.id;

    if (!userID) {
      return res.status(500).json({
        success: false,
        message: "Proporcione userID",
        error: error.message,
      });
    }

    const response = await Favorites.find({
      clienteId: userID,
    }).populate(
      "publicacionId",
      "titulo fotos creador categoria tipo direccionCalle municipio departamento pais "
    );

    if (!response || response.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No se encontraron publicaciones",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Melos",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};
