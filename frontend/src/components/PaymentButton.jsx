import axios from "axios";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

export const PaymentButton = ({ listing }) => {
  const publicKey =
    "pk_test_51RgBmyFSg3Kakc3j17RfwomIRvSwLby8R8JBhTkX2f8XzKAmCBTir4HlAIsSWqn56tG3CKiEs9fuTom8NKH5pKvo00HEJfpDDm";

  const stripePromise = loadStripe(publicKey);

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const endpoint = `http://localhost:4000/api/checkout/activos`;

      const response = await axios.post(
        endpoint,
        {
          item: [listing],
        },
        {
          withCredentials: true,
        }
      );

      const { id } = await response.data;

      if (stripe != null) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: id,
        });
        if (error) {
          console.log("Error en Stripe Checkout:", error.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Item", listing);

  return (
    <button id="paybutton" onClick={() => handlePayment()}>
      Proceder al pago
    </button>
  );
};
