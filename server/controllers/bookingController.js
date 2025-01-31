import { Booking } from "../models/Booking.js";
import { Listing } from "../models/Listings.js";
import { User } from "../models/User.js";

export const createBooking = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const { anfitrionId, publicacionId, fechaInicio, fechaFin, precioTotal } =
      req.body;

    if (
      !anfitrionId ||
      !publicacionId ||
      !fechaInicio ||
      !fechaFin ||
      !precioTotal
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos.", success: false });
    }

    if (isNaN(new Date(fechaInicio)) || isNaN(new Date(fechaFin))) {
      return res.status(400).json({
        message: "Las fechas proporcionadas no son válidas.",
        success: false,
      });
    }

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    if (startDate >= endDate) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin.",
        success: false,
      });
    }

    const existingBooking = await Booking.findOne({
      publicacionId: publicacionId,
      $and: [
        { fechaInicio: { $lte: endDate } },
        { fechaFin: { $gte: startDate } },
      ],
    });
    if (existingBooking) {
      return res.status(409).json({
        message: "El listado ya está reservado en estas fechas.",
        success: false,
      });
    }

    const newBooking = new Booking({
      clienteId,
      anfitrionId,
      publicacionId,
      fechaInicio,
      fechaFin,
      precioTotal,
    });

    const user = await User.findByIdAndUpdate(
      clienteId,
      { $push: { listaViajes: newBooking._id } },
      { new: true } // Devuelve el usuario actualizado
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    // AGREGAR RESERVA AL LA LISTA DEL ANFITRON
    const anfitrion = await User.findByIdAndUpdate(
      anfitrionId,
      { $push: { listaReservas: newBooking._id } },
      { new: true }
    );

    if (!anfitrion) {
      return res
        .status(404)
        .json({ success: false, message: "Anfitrión no encontrado." });
    }

    await newBooking.save();

    return res.status(200).json({
      message: "Reserva creada exitosamente.",
      booking: newBooking,
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
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
        "categoria tipo direccionCalle aptoSuite municipio departamento pais fotos"
      )
      .populate("anfitrionId", "nombre apellido photo email");

    if (searchUser.length === 0) {
      return res.status(404).json({
        message: "No se encontraron registros de agenda",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Registros encontrados",
      success: true,
      total: searchUser.length,
      data: searchUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//cancelar booking

export const ss = async (req, res, next) => {
  try {
    const clienteId = req.user;

    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: "No se encontro",
      });
    }
    return res.status(200).json({
      success: true,
      message: "se encontro",
      clienteId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
