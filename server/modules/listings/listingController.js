import { Listing } from "./Listings.js";
import cloudinary from "cloudinary";
import { User } from "../users/User.js";
import { Booking } from "../bookings/Booking.js";
import { validationResult } from "express-validator";
import { mapValidationErrors } from "../../utils/mappedValidationErrors.js";
import { ResponseSucces } from "../../utils/ResponseSucces.js";
import { AppError } from "../../utils/AppError.js";

export const ownListings = async (req, res, next) => {
  try {
    const userId = req.user.id; //user auth

    const listings = await Listing.find({
      creador: userId,
    });

    if (!listings || listings.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron publicaciones creadas.",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Publicaciones creadas",
      total: listings.length,
      listings,
    });
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

export const ListingsHomeByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const listings = await Listing.find({
      categoria: category,
      estado: "habilitado",
    }).populate("creador", "_id nombre apellido email photo");

    if (listings.length === 0) {
      return next(
        new AppError({
          message: `No hay publicaciones de: ${category}.`,
          statusCode: 404,
          success: false,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: `Publicaciones de ${category}`,
      total: listings.length,
      listings,
    });
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

export const AllPropertys = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      estado: "habilitado",
    }).populate("creador", "_id nombre apellido email photo");

    if (listings.length === 0) {
      return next(
        new AppError({
          message: "No se han creado publicaciones",
          statusCode: 500,
          success: false,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: `Todas las publicaciones`,
      total: listings.length,
      listings,
    });
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

export const GetLlistingById = async (req, res, next) => {
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
    const { id } = req.params;

    const listing = await Listing.findById(id).populate(
      "creador",
      "nombre apellido email photo"
    );

    if (!listing) {
      return next(
        new AppError({
          message: "Publicacion no encontrada",
          statusCode: 404,
          success: false,
        })
      );
    }

    res.status(200).json(new ResponseSucces("Publicacion encontrada", listing));
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
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

    const creador = req.user.id;
    const {
      categoria,
      tipo,
      direccionCalle,
      municipio,
      departamento,
      pais,
      cantidadHuespedes,
      cantidadDormitorios,
      cantidadCamas,
      cantidadBanos,
      comodidades,
      titulo,
      descripcion,
      destacado,
      descripcionDestacado,
      precio,
      tipoPublicacion,
    } = req.body;

    let { unidadPrecio } = req.body;

    let images = [];
    if (req.files && req.files.images) {
      images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
    }

    let px = "";
    if (tipoPublicacion === "venta") {
      px = "fijo";
      unidadPrecio = px;
    } else {
      unidadPrecio = unidadPrecio;
    }

    if (!images || images.length == 0) {
      return next(
        new AppError({
          message: "Debes subir al menos una (1) foto de la publicacion.",
          statusCode: 400,
          success: false,
        })
      );
    }

    if (images.length > 3) {
      return next(
        new AppError({
          message: "Maximo 3 fotos",
          statusCode: 400,
          success: false,
        })
      );
    }

    const uploadedImages = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath);

      if (!result) {
        console.error("Error en Cloudinary:", photoCloudinaryResponse);

        return next(
          new AppError({
            message: "Error al subir el archivo a Cloudinary",
            statusCode: 400,
            success: false,
          })
        );
      }

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const listing = await Listing.create({
      creador,
      categoria,
      tipo,
      direccionCalle,
      municipio,
      departamento,
      pais,
      cantidadHuespedes,
      cantidadDormitorios,
      cantidadCamas,
      cantidadBanos,
      comodidades,
      titulo,
      fotos: uploadedImages,
      descripcion,
      destacado,
      descripcionDestacado,
      precio,
      unidadPrecio,
      tipoPublicacion,
      estado: "habilitado",
    });

    const user = await User.findByIdAndUpdate(
      creador,
      { $push: { listaPropiedades: listing._id } },
      { new: true } //  usuario actualizado
    );

    if (!user) {
      return next(
        new AppError({
          message: "Usuario no encontrado.",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res
      .status(200)
      .json(new ResponseSucces("Se creo con exito la publicacion", listing));
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

export const setStatus = async (req, res, next) => {
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
    const { id } = req.params;
    const { estado } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        estado,
      },
      {
        new: true,
      }
    );

    if (!listing) {
      return next(
        new AppError({
          statusCode: 404,
          success: false,
          message: "No se econtro la publicacion.",
        })
      );
    }

    return res
      .status(200)
      .json(
        new ResponseSucces(`Publicación ${estado} correctamente.`, listing)
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

export const getMyReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const myListings = await Listing.find({ creador: userId });

    // recolectar ids de las publicacioens
    const listingIds = myListings.map((listing) => listing._id);

    //find => varios donde en ´publiccacion id sean igual a los mios del authtenticado
    const reservations = await Booking.find({
      publicacionId: { $in: listingIds },
    })
      .populate("clienteId", "nombre apellido email photo")
      .populate(
        "publicacionId",
        "titulo direccionCalle municipio departamento categoria fotos pais"
      );

    if (!reservations || reservations.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron reservas",
          statusCode: 404,
          success: false,
        })
      );
    }

    res.status(200).json({
      success: true,
      message: "Se econtraron reservas",
      total: reservations.length,
      reservations,
    });
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

export const searchListing = async (req, res, next) => {
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

    const { titulo, categoria } = req.query;

    const listings = await Listing.find(
      //o cualquiera de esatas buscquedas i=> insensible mayus y minusiclas , $regex busca por coincidencia de patrones
      {
        $and: [
          {
            $or: [
              { titulo: { $regex: titulo, $options: "i" } },
              { categoria: { $regex: categoria, $options: "i" } },
            ],
          },
          { estado: "habilitado" },
        ],
      }
    ).populate("creador", "nombre apellido photo");

    if (!listings || listings.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron publicaciones",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Se econtraron publicaciones",
      total: listings.length,
      listings,
    });
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

export const filterListings = async (req, res, next) => {
  try {
    const { titulo, categoria, tipo, minPrice, maxPrice } = req.query;

    const filtros = {
      estado: "habilitado",
    };

    if (titulo || categoria) {
      filtros.$or = [];

      if (titulo) {
        filtros.$or.push({ titulo: { $regex: titulo, $options: "i" } });
      }

      if (categoria) {
        filtros.$or.push({ categoria: { $regex: categoria, $options: "i" } });
      }
    }
    if (tipo) {
      filtros.tipoPublicacion = tipo;
    }

    if (minPrice && maxPrice) {
      filtros.precio = {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      };
    }
    const listings = await Listing.find(filtros).populate(
      "creador",
      "nombre apellido photo"
    );

    if (!listings || listings.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron publicaciones con los filtros",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Filtrado exitoso",
      total: listings.length,
      listings,
    });
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

export const getUserListingsByID = async (req, res, next) => {
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

    const { id } = req.params;

    const response = await Listing.find({
      creador: id,
    });

    if (!response || response.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron registros",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Busqueda exitosa",
      total: response.length,
      data: response,
    });
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
