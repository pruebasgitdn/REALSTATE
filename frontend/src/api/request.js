import api from "./axiosInstance";

export const request = async ({
  method = "get",
  url,
  data = null,
  params = null,
}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    const message =
      error.response?.data?.message || error.message || "Error desconocido";
    throw new Error(message);
  }
};
