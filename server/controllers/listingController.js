import { Listing } from "../models/Listings.js";
import cloudinary from "cloudinary";
import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";

export const ownListings = async (req, res, next) => {
  try {
    const userId = req.user.id; //user auth

    const listings = await Listing.find({
      creador: userId,
    });

    if (!listings) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron publicaciones creadas.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Publicaciones encontradas",
      total: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const ListingsHomeByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const listings = await Listing.find({
      categoria: category,
    }).populate("creador", "_id nombre apellido email photo");

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No hay publicaciones de: ${category}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Publicaciones de ${category}`,
      total: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const AllPropertys = async (req, res, next) => {
  try {
    const listings = await Listing.find().populate(
      "creador",
      "_id nombre apellido email photo"
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se han creado publicaciones`,
        total: listings.length,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Todas las publicaciones`,
      total: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const GetLlistingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listings = await Listing.findById(id).populate(
      "creador",
      "nombre apellido email photo"
    );

    if (!listings) {
      return res.status(404).json({
        success: false,
        message: `Publicacion no encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Publicacion encontrada`,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
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
      unidadPrecio,
      tipoPublicacion,
    } = req.body;

    let images = [];
    if (req.files && req.files.images) {
      images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
    }

    if (!images || images.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Debes subir al menos una (1) foto de la publicacion.",
      });
    }

    if (images.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Maximo 3 fotos.",
      });
    }

    const uploadedImages = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath);

      if (!result) {
        console.error("Error en Cloudinary:", photoCloudinaryResponse);
        return res.status(400).json({
          success: false,
          message: "Error al subir el archivo a Cloudinary",
        });
      }

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    if (
      !categoria ||
      !tipo ||
      !direccionCalle ||
      !municipio ||
      !departamento ||
      !pais ||
      !comodidades ||
      !titulo ||
      !descripcion ||
      !destacado ||
      !descripcionDestacado ||
      !precio ||
      !unidadPrecio ||
      !tipoPublicacion
    ) {
      return res.status(400).json({
        success: false,
        message: "Llene todos los campos",
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
      { new: true } // Devuelve el usuario actualizado
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Se creo la publicacion",
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const setStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (estado !== "habilitado" && estado !== "inhabilitado") {
      return res.status(400).json({
        success: false,
        message: "Estado invalido",
      });
    }
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
      return res.status(404).json({
        success: false,
        message: "No se econtro la publicacion.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Publicación ${estado} correctamente.`,
      listing,
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id; //auth

    //mis publicaciones
    const myListings = await Listing.find({ creador: userId });

    // recolectar ids de las publicacioens
    const listingIds = myListings.map((listing) => listing._id);

    //-find => varios donde en ´publiccacion id sean igual a los mios del authtenticado
    const reservations = await Booking.find({
      publicacionId: { $in: listingIds },
    })
      .populate("clienteId", "nombre apellido email photo")
      .populate(
        "publicacionId",
        "titulo direccionCalle municipio departamento categoria fotos pais"
      );

    if (!reservations) {
      return res.status(400).json({
        succes: false,
        message: "No se encontraron reservas",
      });
    }

    res.status(200).json({
      succes: true,
      message: "Se econtraron reservas",
      total: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Error obteniendo reservas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const searchListing = async (req, res, next) => {
  try {
    const { titulo, categoria } = req.query;

    if (!titulo || !categoria) {
      return res.status(400).json({
        succes: false,
        message: "Ingresa todos los campos",
      });
    }

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
      return res.status(404).json({
        succes: false,
        message: "No se econtraron publicaciones",
      });
    }

    return res.status(200).json({
      succes: true,
      message: "Se econtraron publicaciones",
      total: listings.length,
      listings,
    });
  } catch (error) {
    console.log(error);
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
      return res.status(404).json({
        success: false,
        message: "No se encontraron publicaciones con los filtros",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Filtrado exitoso",
      total: listings.length,
      listings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "No se econtraron publicaciones",
      error,
    });
  }
};
