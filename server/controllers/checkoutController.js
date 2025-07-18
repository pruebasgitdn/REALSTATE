import express from "express";
import Stripe from "stripe";
import { Sales } from "../models/Sales.js";
import { Listing } from "../models/Listings.js";

const router = express.Router();

export const registerInDB = async (req, res, next) => {
  try {
    const { antiguoPropID, publicacionId, precioVenta } = req.body;
    const nuevoPropId = req.user.id;

    const response = await Sales.create({
      antiguoPropID,
      nuevoPropId,
      publicacionId,
      precioVenta,
    });

    if (!response || response.status === 400) {
      return res.status(400).json({
        success: false,
        message: "Error, no se puede crear el registro",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registros encontrados",
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

export const verifyPay = async (req, res, next) => {
  try {
    const { id_session } = req.query;
    if (!id_session) {
      return res.status(400).json({
        success: false,
        message: "No se obtuvo el session id",
      });
    }
    console.log(id_session);

    const insertedSessionID = await Sales.findOne({ session_id: id_session });
    if (insertedSessionID) {
      return res.status(200).json({
        success: true,
        message: "Venta ya procesada previamente",
        response: insertedSessionID,
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(id_session);

    const { pub_id, antiguoprop_id, nuevoprop_id, totalUSD } = session.metadata;

    //actualizar reemplazar creador ref user en models listng con nuevoPropId para que al populate tan si sabe

    const response = await Sales.create({
      session_id: id_session,
      publicacionId: pub_id,
      antiguoPropID: antiguoprop_id,
      nuevoPropId: nuevoprop_id,
      precioVenta: totalUSD,
    });

    // return res.status(200).json({
    //   success: true,
    //   message: "Melos",
    //   response,
    // });
    await Listing.findByIdAndUpdate(pub_id, {
      creador: nuevoprop_id,
    });

    return res.status(200).json({
      success: true,
      message: "Venta registrada y propiedad actualizada correctamente",
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

export const goToPay = async (req, res, next) => {
  try {
    const { item } = await req.body;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    //INICIALIZACION STRUIPE
    const stripe = new Stripe(stripeSecretKey);

    const items = Array.isArray(item) ? item : [item];

    const mapItems = items.map((s) => {
      return {
        titulo: s.titulo,
        descripcion: s.descripcion,
        precio: s.precio,
      };
    });

    let pub_id = "";
    let antiguoprop_id = "";
    let nuevoprop_id = req.user.id;
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

    //extraer pub_id,nuevoprop_id,antiguoprop_id para meterlos en metadata

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
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
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPurchases = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó el id de usuario",
      });
    }

    const response = await Sales.find({
      nuevoPropId: user_id,
    })
      .populate("nuevoPropId", "nombre email")
      .populate("antiguoPropID", "nombre email")
      .populate("publicacionId", "titulo categoria");

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
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
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
      .populate("nuevoPropId", "nombre email")
      .populate("antiguoPropID", "nombre email")
      .populate("publicacionId", "titulo categoria");

    if (!response || response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron ventas / registros para ese id",
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
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export default router;
