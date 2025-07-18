import { Listing } from "../models/Listings.js";
import { Favorites } from "../models/Favorites.js";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const userRegister = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const { photo } = req.files || {};

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Llena todos los campos",
      });
    }

    // Verificar si ya está registrado
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(409).json({
        success: false,
        message: "Usuario con este email ya registrado",
      });
    }

    const allowedFormats = ["image/png", "image/jpeg"];
    let fotoData = null;
    if (photo) {
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Formato de archivo de la foto no soportado",
        });
      }

      // Subir la foto a Cloudinary
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse) {
        console.error("Error en Cloudinary:", photoCloudinaryResponse);
        return res.status(400).json({
          success: false,
          message: "Error al subir el archivo a Cloudinary",
        });
      }

      fotoData = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    const user = await User.create({
      nombre,
      apellido,
      email,
      password,
      photo: fotoData,
    });

    res.status(200).json({
      success: true,
      message: "Usuario registrado con éxito",
      user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Por favor, llenar todos los campos",
      });
    }

    // Verificar si ya esta registrado
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    generateToken(
      user,
      "Inicio de sesion exitoso, credenciales melas",
      200,
      res
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      succes: true,
      message: "Sesion cerrada correctamente!!",
    });
  console.log("Sesion cerrada!");
};

export const me = async (req, res, next) => {
  try {
    //Req.user del middleware previamante en la ruta en el router del admin
    const user = req.user;
    console.log(user.id);

    const verifyUser = await User.findById(req.user.id);

    if (!verifyUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      details: [verifyUser.nombre, verifyUser.email, verifyUser._id],
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

export const editProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { nombre, apellido, email, password } = req.body;
    const { photo } = req.files || [];

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (email !== user.email) {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res
          .status(404)
          .json({ message: "Email ya se encuentra en uso / Registrado" });
      }
    }

    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (email) user.email = email;
    if (password) user.password = password;

    if (photo) {
      //eliminar foto actual
      if (user.photo?.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id);
      }

      // Subir la nueva foto a Cloudinary
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse) {
        return res.status(400).json({
          success: false,
          message: "Error al subir la nueva foto a Cloudinary",
        });
      }

      user.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      user,
    });
  } catch (error) {
    console.error("Error al editar el perfil:", error);
    next(error);
  }
};

export const nazi = async (req, res, next) => {
  try {
    const nuevoUsuario = new User({
      nombre: "Tony",
      apellido: "Krooz",
      email: "tony@correo.com",
      password: "123456",
    });

    await nuevoUsuario.save();
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const pp = await User.find();

    if (pp.length <= 0) {
      res.status(404).json({
        success: false,
        message: "No nada",
      });
    }
    res.status(200).json({
      success: true,
      message: "Melos tio",
      pp,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addToFavoDB = async (req, res, next) => {
  try {
    const { clientID, listingID } = req.body;

    const newItem = new Favorites({
      clienteId: clientID,
      publicacionId: listingID,
    });

    const response = await newItem.save();

    return res.status(200).json({
      success: true,
      message: "Melos tio",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error al añadir a favoritos",
      error: error.message,
    });
  }
};

export const removeFromFavoDB = async (req, res, next) => {
  try {
    const { clientID, listingID } = req.body;

    const deletedItem = await Favorites.findOneAndDelete({
      clienteId: clientID,
      publicacionId: listingID,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "No se encontro el favorito para eliminar",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Favorito eliminado correctamente",
      data: deletedItem,
    });
  } catch (error) {
    console.error("Error eliminando favorito:", error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

export const getUsersFavo = async (req, res, next) => {
  try {
    const idc = req.user.id;
    const response = await Favorites.find({
      clienteId: idc,
    }).select("clienteId publicacionId -_id");
    // .populate(
    //   "publicacionId",
    //   "titulo creador categoria departamento municipio pais"
    // );
    if (!response || response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron elementos",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Items encontrados",
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

// export const
