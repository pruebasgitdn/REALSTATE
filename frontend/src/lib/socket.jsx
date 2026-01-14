import { io } from "socket.io-client";
import { addMessage } from "../redux/slices/chatSlice.js";
import { notification } from "antd";
import { formatDate } from "./functions.jsx";
import {
  addListing,
  removeMyListingById,
} from "../redux/slices/listingSlice.js";
import { API_BASE_URL } from "../env.js";
const BASE_URL = API_BASE_URL;
let socket = null;

// CONEXION
export const connectSocket = (user_id, dispatch) => {
  console.log(user_id);
  if (!socket) {
    socket = io(BASE_URL, {
      query: {
        user_id: user_id,
      },
    });

    console.log(socket);

    socket.on("notificacion", (ppmsg) => {
      console.log(ppmsg);
      notification.info({
        message: "Nuevo mensaje",
        description: `Nuevo mensaje de: ${
          ppmsg.senderId.email || ppmsg.senderId.nombre
        }`,
        onClick: () => {
          globalThis.location.href = `/get_user/${ppmsg.senderId._id}`;
        },
      });
    });

    socket.on("notifyBookingOnMyProperty", (ppmsg) => {
      console.log(ppmsg);
      notification.info({
        message: "Nuevo mensaje",
        description: `Tú propiedad ha sido agendada por: ${
          ppmsg.clienteId.email || ppmsg.clienteId.nombre
        } , en las fechas ${formatDate(ppmsg.fechaInicio)} - ${formatDate(
          ppmsg.fechaFin
        )} `,
        onClick: () => {
          globalThis.location.href = "/reservation_list";
        },
      });
    });

    socket.on("notifyMyListingPurchased", (ppmsg) => {
      console.log("listened ppclient", ppmsg);
      dispatch(removeMyListingById(ppmsg.publicacionId._id));
      notification.success({
        message: "Nuevo mensaje",
        description: `Tú propiedad ha sido comprada por: ${
          ppmsg.nuevoPropId.email || ppmsg.nuevoPropId.nombre
        } `,
        onClick: () => {
          globalThis.location.href = "/my_sales";
        },
      });
    });

    socket.on("listingPurchased", (ppmsg) => {
      console.log("lp nuevo prop", ppmsg);
      dispatch(addListing(ppmsg.publicacionId));
    });
  }

  console.log(socket);
  return socket;
};

// OBTNER SOCKET CONECTADO
export const getSocket = () => {
  return socket;
};

export const subscribeSocketNewMessageEvent = (dispatch, selectedUser) => {
  if (!socket) {
    console.log("No socket");
    return;
  }

  socket.off("newMessage");

  socket.on("newMessage", (message) => {
    console.log(
      "Enviado por: " +
        message.senderId +
        "---" +
        "User seleccionado: " +
        selectedUser._id +
        selectedUser.email
    );

    //Solo renderizar los del user seleccionado ahi mismo
    if (String(message.senderId) !== String(selectedUser._id)) {
      return;
    }
    console.log(message);
    let obj = {
      receiverId: message.receiverId,
      senderId: message.senderId,
      data: {
        text: message.text,
      },
    };

    dispatch(addMessage(obj));
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
