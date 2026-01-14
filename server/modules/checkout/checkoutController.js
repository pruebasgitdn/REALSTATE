import express from "express";
import Stripe from "stripe";
import { Sales } from "../checkout/Sales.js";
import { Listing } from "../listings/Listings.js";
import { AppError } from "../../utils/AppError.js";
import { ResponseSucces } from "../../utils/ResponseSucces.js";
import { getReceiverSocketId, io } from "../../socket.js";
import { Booking } from "../bookings/Booking.js";
import { createBookingService } from "../bookings/bookingController.js";

const router = express.Router();

const isDev = process.env.NODE_ENV !== "production";
const clientOrigin = isDev
  ? process.env.FRONTEND_URI_DEV
  : process.env.FRONTEND_URI;

export const goToPay = async (req, res, next) => {
  try {
    const { item } = await req.body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    //INICIALIZACION STRUIPE
    const stripe = new Stripe(stripeSecretKey);

    const items = Array.isArray(item) ? item : [item];

    let pub_id = "";
    let antiguoprop_id = "";
    let nuevoprop_id = req.user.id;

    items.forEach((s) => {
      pub_id = s._id;
      antiguoprop_id = s.creador._id;
    });

    if (antiguoprop_id.toString() === nuevoprop_id.toString()) {
      return res.status(400).json({
        success: false,
        message: "No puedes comprar tu propia publicación.",
      });
    }

    const mapItems = items.map((s) => {
      return {
        titulo: s.titulo,
        descripcion: s.descripcion,
        precio: s.precio,
      };
    });

    const totalUSD = items.reduce((sum, s) => sum + s.precio / 4347.448, 0);

    const extractMetada = items.map((s) => {
      (pub_id = s._id), (antiguoprop_id = s.creador._id);
    });

    //ITEMS
    const extractingItems = mapItems.map((item, index) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round((item.precio / 4347.448) * 100),
        product_data: {
          name: item.titulo,
          description: item.descripcion,
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url: `${clientOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientOrigin}/cancel`,
      metadata: {
        pub_id,
        antiguoprop_id,
        nuevoprop_id,
        totalUSD: totalUSD.toFixed(2),
      },
    });

    res.json({
      message: "Server is connected",
      success: true,
      item,
      id: session.id,
      url: session.url,
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

export const verifyPay = async (req, res, next) => {
  try {
    const { id_session } = req.query;
    if (!id_session) {
      console.log(error);
      return next(
        new AppError({
          message: "No se obtuvo el session id",
          statusCode: 400,
          success: false,
        })
      );
    }
    console.log(id_session);

    const insertedSessionID = await Sales.findOne({ session_id: id_session });
    if (insertedSessionID) {
      return res
        .status(200)
        .json(
          new ResponseSucces(
            "Venta ya procesada previamente",
            insertedSessionID
          )
        );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(id_session);

    const { pub_id, antiguoprop_id, nuevoprop_id, totalUSD } = session.metadata;

    let response;

    try {
      response = await Sales.create({
        session_id: id_session,
        publicacionId: pub_id,
        antiguoPropID: antiguoprop_id,
        nuevoPropId: nuevoprop_id,
        precioVenta: Number(totalUSD),
      });
    } catch (error) {
      if (error.code === 11000) {
        const existingSale = await Sales.findOne({ session_id: id_session });

        return res
          .status(200)
          .json(
            new ResponseSucces("Venta ya procesada previamente", existingSale)
          );
      }
      throw error;
    }

    const petx = await Listing.findByIdAndUpdate(pub_id, {
      creador: nuevoprop_id,
    });

    if (!petx) {
      return next(
        new AppError({
          message: "No se pudo actualizar el registro del propietario",
          statusCode: 404,
          success: false,
        })
      );
    }

    const ppListing = await Sales.findById(response._id)
      .populate("nuevoPropId", "email nombre")
      .populate("publicacionId");

    console.log("pplated", ppListing);

    //emitir
    const receiverSocketId = getReceiverSocketId(antiguoprop_id);
    //emitir
    const receiverNewProperty = getReceiverSocketId(nuevoprop_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notifyMyListingPurchased", ppListing);
    }

    if (receiverNewProperty) {
      io.to(receiverNewProperty).emit("listingPurchased", ppListing);
    }

    res
      .status(200)
      .json(
        new ResponseSucces(
          "Venta registrada y propiedad actualizada correctamente",
          response
        )
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

export const gotoPayBooking = async (req, res, next) => {
  try {
    const { item, owner_id, fechaInicio, fechaFin, precioTotal } =
      await req.body;

    const idP = item._id || item.id;

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    const existingBooking = await Booking.findOne({
      publicacionId: idP,
      $and: [
        { fechaInicio: { $lte: endDate } },
        { fechaFin: { $gte: startDate } },
      ],
    });

    if (existingBooking) {
      console.log("nashed no enter");
      return next(
        new AppError({
          message: "El listado ya esta reserved en esas fechas",
          statusCode: 409,
          success: false,
        })
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    //INICIALIZACION STRUIPE
    const stripe = new Stripe(stripeSecretKey);

    //ITEMS => ITEM 1
    const extractingItems = {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: precioTotal,
        product_data: {
          name: item.titulo,
          description: item.descripcion,
        },
      },
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [extractingItems],
      mode: "payment",
      success_url: `${clientOrigin}/successbooking?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientOrigin}/cancel`,
      metadata: {
        publicacionId: item._id || item.id,
        owner_id,
        clienteId: req.user.id,
        fechaInicio,
        fechaFin,
        precioTotal,
      },
    });

    res.json({
      message: "Server is connected",
      success: true,
      item,
      owner_id,
      id: session.id,
      url: session.url,
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

export const verifyBookingPay = async (req, res, next) => {
  try {
    const { id_session } = req.query;

    if (!id_session) {
      return next(
        new AppError({
          message: "No se obtuvo el session id",
          statusCode: 400,
          success: false,
        })
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(id_session);

    if (session.payment_status !== "paid") {
      return next(
        new AppError({
          message: "Pago no confirmado",
          statusCode: 400,
          success: false,
        })
      );
    }

    const {
      publicacionId,
      owner_id,
      clienteId,
      fechaInicio,
      fechaFin,
      precioTotal,
    } = session.metadata;

    const booking = await createBookingService({
      clienteId,
      anfitrionId: owner_id,
      publicacionId,
      fechaInicio,
      fechaFin,
      precioTotal,
    });

    console.log("bc 191 controll", booking);
    res
      .status(200)
      .json(new ResponseSucces("Reserva creada correctamente", booking));
  } catch (error) {
    console.error(error);
    return next(
      new AppError({
        message: error.message || "ERROR INTERNO DEL SERVIDOR",
        statusCode: 500,
        success: false,
      })
    );
  }
};

export const getUserPurchases = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return next(
        new AppError({
          message: "No se proporcionó el id de usuario",
          statusCode: 400,
          success: false,
        })
      );
    }

    const response = await Sales.find({
      nuevoPropId: user_id,
    })
      .populate("nuevoPropId", "nombre email photo")
      .populate("antiguoPropID", "nombre email photo")
      .populate("publicacionId", "titulo categoria _id");

    if (!response || response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron compras / registros para ese id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Se encontraron registros para ese id",
      total: response.length,
      response,
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

export const getUserSales = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó el id de usuario",
      });
    }

    const response = await Sales.find({
      antiguoPropID: user_id,
    })
      .populate("nuevoPropId", "nombre email photo")
      .populate("antiguoPropID", "nombre email photo")
      .populate("publicacionId", "titulo categoria _id");

    if (!response || response.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron ventas / registros para ese id",
          statusCode: 404,
          success: false,
        })
      );
    }
    return res.status(200).json({
      success: true,
      message: "Se encontraron registros para ese id",
      total: response.length,
      response,
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

export default router;
