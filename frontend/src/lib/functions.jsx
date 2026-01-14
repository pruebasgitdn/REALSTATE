import axios from "axios";
import { API_BASE_URL } from "../env.js";

export const verifyPayFunct = async ({ id_session }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}
/api/checkout/verifypay?id_session=${id_session}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const formatPrice = (number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (date) => {
  const pp = date.split("T")[0];
  return pp;
};

export const sortByDate = (data, order) => {
  if (!order) return data;

  return [...data].sort((a, b) => {
    const dateA = new Date(a.fechaVenta);
    const dateB = new Date(b.fechaVenta);

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};
