import axios from "axios";

export const handleAddFavo = async ({ listingID, clientID }) => {
  try {
    const formdata = {
      clientID: clientID,
      listingID: listingID,
    };
    const response = await axios.post(
      "http://localhost:4000/api/user/addtofavo",
      formdata,
      {
        withCredentials: true,
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const handleRemoveFavo = async ({ listingID, clientID }) => {
  try {
    const formdata = {
      clientID: clientID,
      listingID: listingID,
    };
    const response = await axios.post(
      "http://localhost:4000/api/user/removefromfavo",
      formdata,
      {
        withCredentials: true,
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const verifyPayFunct = async ({ id_session }) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/checkout/verifypay?id_session=${id_session}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const syncFavosUser = async () => {
  try {
    const response = await axios.get(
      "http://localhost:4000/api/user/getusersfavo",
      {
        withCredentials: true,
        validateStatus: (status) => {
          return status >= 200 && status < 500;
        },
      }
    );

    if (response.status === 400) {
      console.log("No se encontraron items", response);
      return response.status;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPurchases = async () => {
  try {
    const response = await axios.get(
      "http://localhost:4000/api/checkout/user_purchases",
      {
        withCredentials: true,
        validateStatus: (status) => {
          return status >= 200 && status < 500;
        },
      }
    );

    if (response.status === 400) {
      console.log("No se encontraron items", response);
      return "No se encontraron items";
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUserSales = async () => {
  try {
    const response = await axios.get(
      "http://localhost:4000/api/checkout/user_sales",
      {
        withCredentials: true,
        validateStatus: (status) => {
          return status >= 200 && status < 500;
        },
      }
    );

    if (response.status === 400) {
      console.log("No se encontraron items", response);
      return "No se encontraron items";
    }

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

export const getUserFavoListing = async () => {
  try {
    const response = await axios.get(
      "http://localhost:4000/api/user/getusersfavoremix",
      {
        withCredentials: true,
        validateStatus: (status) => {
          return status >= 200 && status < 500;
        },
      }
    );

    if (response.status === 400) {
      console.log("No se encontraron items", response);
      return response.status;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};
