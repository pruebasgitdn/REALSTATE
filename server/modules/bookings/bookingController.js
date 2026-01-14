import { Booking } from "./Booking.js";
import { User } from "../users/User.js";
import { validationResult } from "express-validator";
import { mapValidationErrors } from "../../utils/mappedValidationErrors.js";
import { AppError } from "../../utils/AppError.js";
import { ResponseSucces } from "../../utils/ResponseSucces.js";
import { getReceiverSocketId, io } from "../../socket.js";

export const createBookingService = async ({
  clienteId,
  anfitrionId,
  publicacionId,
  fechaInicio,
  fechaFin,
  precioTotal,
}) => {
  const startDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);

  const existingBooking = await Booking.findOne({
    publicacionId: publicacionId,
    $and: [
      { fechaInicio: { $lte: endDate } },
      { fechaFin: { $gte: startDate } },
    ],
  });

  if (existingBooking) {
    throw new Error("El listado ya esta reservado en estas fechas");
  }

  const booking = new Booking({
    clienteId,
    anfitrionId,
    publicacionId,
    fechaInicio,
    fechaFin,
    precioTotal,
  });

  await booking.save();

  console.log(booking);

  const populatedBooking = await Booking.findById(booking._id)
    .populate("clienteId", "email nombre photo apellido")
    .populate("anfitrionId", "email nombre photo apellido")
    .populate(
      "publicacionId",
      "categoria tipo direccionCalle aptoSuite municipio departamento pais fotos unidadPrecio"
    );

  //emitir
  const receiverSocketId = getReceiverSocketId(anfitrionId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notifyBookingOnMyProperty", populatedBooking);
  }
  return populatedBooking;
};

export const createBooking = async (req, res, next) => {
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

    const clienteId = req.user.id;
    const { anfitrionId, publicacionId, fechaInicio, fechaFin, precioTotal } =
      req.body;

    if (clienteId === anfitrionId) {
      return next(
        new AppError({
          statusCode: 400,
          success: false,
          message: "No puedes agendar la propiedad de la que eres dueño.",
        })
      );
    }

    if (isNaN(new Date(fechaInicio)) || isNaN(new Date(fechaFin))) {
      return next(
        new AppError({
          statusCode: 404,
          success: false,
          message: "Las fechas proporcionadas no son válidas.",
        })
      );
    }

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    if (startDate >= endDate) {
      return next(
        new AppError({
          statusCode: 400,
          success: false,
          message: "La fecha de inicio debe ser anterior a la fecha de fin.",
        })
      );
    }

    const existingBooking = await Booking.findOne({
      publicacionId: publicacionId,
      $and: [
        { fechaInicio: { $lte: endDate } },
        { fechaFin: { $gte: startDate } },
      ],
    });
    if (existingBooking) {
      return next(
        new AppError({
          statusCode: 400,
          success: false,
          message: "El listado ya está reservado en estas fechas",
        })
      );
    }

    const newBooking = new Booking({
      clienteId,
      anfitrionId,
      publicacionId,
      fechaInicio,
      fechaFin,
      precioTotal,
    });

    await newBooking.save();

    res
      .status(200)
      .json(new ResponseSucces("Reserva creada exitosamente.", newBooking));
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

//lista de viaje en agendas buscar por cliente
export const getTripList = async (req, res, next) => {
  try {
    const user = req.user.id;

    const searchUser = await Booking.find({
      clienteId: user,
    })
      .populate(
        "publicacionId",
        "categoria tipo direccionCalle aptoSuite municipio departamento pais fotos unidadPrecio"
      )
      .populate("anfitrionId", "nombre apellido photo email");

    if (!searchUser || searchUser.length === 0 || searchUser == null) {
      return next(
        new AppError({
          message: "No se encontraron registros de agenda",
          statusCode: 404,
          success: false,
        })
      );
    }

    return res.status(200).json({
      message: "Registros encontrados",
      success: true,
      total: searchUser.length,
      data: searchUser,
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
