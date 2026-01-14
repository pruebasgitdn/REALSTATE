import { Message } from "./Message.js";
import { validationResult } from "express-validator";
import { mapValidationErrors } from "../../utils/mappedValidationErrors.js";
import { AppError } from "../../utils/AppError.js";
import { ResponseSucces } from "../../utils/ResponseSucces.js";
import { getReceiverSocketId, io } from "../../socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "email nombre"
    );

    //emitir
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("notificacion", populatedMessage);
    }

    res
      .status(201)
      .json(
        new ResponseSucces("Mensaje enviado y registrado con exito", newMessage)
      );
  } catch (error) {
    console.log(error);
    return next(
      new ErrorResponse(`ERROR interno del servidor`, 500, null, false)
    );
  }
};

export const getMessages = async (req, res, next) => {
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

    const { id: userId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    });

    if (!messages || messages.length === 0) {
      return next(
        new AppError({
          message: "No se encontraron mensajes entre estos 2 usuarios",
          errors: null,
          statusCode: 400,
          success: false,
        })
      );
    }

    res
      .status(200)
      .json(new ResponseSucces("Mensajes encontrados con éxito", messages));
  } catch (error) {
    console.log(error);
    return next(
      new ErrorResponse(`ERROR interno del servidor`, 500, null, false)
    );
  }
};
