import { Listing } from "../listings/Listings.js";
import { User } from "./User.js";
import { generateToken } from "../../middleware/jwtToken.js";
import cloudinary from "cloudinary";
import { validationResult } from "express-validator";
import { mapValidationErrors } from "../../utils/mappedValidationErrors.js";
import { AppError } from "../../utils/AppError.js";
import { ResponseSucces } from "../../utils/ResponseSucces.js";

export const userRegister = async (req, res, next) => {
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

    const { nombre, apellido, email, password } = req.body;
    const { photo } = req.files || {};

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(
        new AppError({
          message: "Este usuario (con ese email) ya se encuentra registrado",
          statusCode: 404,
          success: false,
        })
      );
    }

    const allowedFormats = ["image/png", "image/jpeg"];
    let fotoData = null;
    if (photo) {
      if (!allowedFormats.includes(photo.mimetype)) {
        return next(
          new AppError("Formato de archivo de la foto no soportado", 400, false)
        );
      }

      // Subida de foto a cloudinary
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse) {
        console.error("Error en Cloudinary:", photoCloudinaryResponse);

        return next(
          new AppError("Error al subir el archivo a Cloudinary", 400, false)
        );
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
    res
      .status(200)
      .json(new ResponseSucces("Usuario registrado con éxito", user));
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

export const userLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const mappedErrors = mapValidationErrors(errors);
      return next(
        new AppError({
          message: "Errores de validación",
          errors: mappedErrors,
          statusCode: 400,
          success: false,
        })
      );
    }

    const { email, password } = req.body;

    // Verificar  registrado
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError({
          message: "Usuario no encontrado",
          statusCode: 400,
          success: false,
        })
      );
    }

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      return next(
        new AppError({
          message: "Credenciales incorrectas",
          statusCode: 400,
          success: false,
        })
      );
    }

    user.password = undefined;

    generateToken(
      user,
      "Inicio de sesion exitoso, credenciales melas",
      200,
      res
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

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .cookie("isLoggedIn", "", {
      httpOnly: false,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  console.log("Sesion cerrada!");
};

export const me = async (req, res, next) => {
  try {
    const user = req.user;

    const verifyUser = await User.findById(req.user.id);

    if (!verifyUser) {
      return next(
        new AppError({
          message: "Usuario no encontrado",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res
      .status(200)
      .json(new ResponseSucces("Usuario encontrado con éxito", verifyUser));
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

export const editProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const mappedErrors = mapValidationErrors(errors);
      return next(
        new AppError({
          message: "Errores de validación",
          errors: mappedErrors,
          statusCode: 400,
          success: false,
        })
      );
    }

    const id = req.user.id;
    console.log(req.user.id);
    const { nombre, apellido, email, password } = req.body;
    const { photo } = req.files || [];

    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(
        new AppError({
          message: "Usuario no encontrado",
          statusCode: 404,
          success: false,
        })
      );
    }

    if (email !== user.email) {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return next(
          new AppError({
            message: "Email ya se encuentra en uso / Registrado",
            statusCode: 405,
            success: false,
          })
        );
      }
    }

    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (email) user.email = email;

    if (password && password.trim() !== "") {
      if (password !== user.password) {
        user.password = password;
        user.markModified("password");
      }
    }

    if (photo) {
      //Eliminar foto actual
      if (user.photo?.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id);
      }

      // Subida la nueva foto a cloudinary
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse) {
        return next(
          new AppError({
            message: "Error al subir la nueva foto a Cloudinary",
            statusCode: 403,
            success: false,
          })
        );
      }

      user.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    await user.save();

    res
      .status(200)
      .json(new ResponseSucces("Perfil actualizado correctamente", user));
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
    const { id } = req.params;

    const listings = await Listing.findById(id).populate(
      "creador",
      "nombre apellido email photo"
    );

    if (!listings) {
      return next(
        new AppError({
          message: "Publicacion no encontrada",
          statusCode: 404,
          success: false,
        })
      );
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

export const getUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(
        new AppError({
          message: "Proporcione el id",
          statusCode: 400,
          success: false,
        })
      );
    }

    const user = await User.findById(id);

    if (!user || user.length == 0 || user == null) {
      return next(
        new AppError({
          message: `No se encontro usuario por el id: ${id}`,
          statusCode: 500,
          success: false,
        })
      );
    }

    res.status(200).json(new ResponseSucces("Busqueda exitosa", user));
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

export const AllUsers = async (req, res, next) => {
  try {
    const response = await User.find();

    if (!response || response.lenght < 0) {
      return next(
        new AppError({
          message: "No hay registros",
          statusCode: 404,
          success: false,
        })
      );
    }

    res.status(200).json({
      success: true,
      message: "Busqueda exitosa",
      response,
      total: response.length,
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
