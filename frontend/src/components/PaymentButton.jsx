import { message, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { payThunkActivos } from "../redux/thunks/checkoutThunk";
import { BiDoorOpen } from "react-icons/bi";
import { MdPayments } from "react-icons/md";

export const PaymentButton = ({ listing }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);

  const handlePayment = async () => {
    try {
      const checkoutUrl = await dispatch(payThunkActivos(listing)).unwrap();

      //dispatch(addListing(listings));
      //Eso pasa a hacerse en success => una vez procesado el pago => populata o retornar la listing (completa) y añadirla a my_listings de nuevo prop => ademas emitir al antiguoPropID el _id de la propiedad para lo saque de my_listings
      console.log(checkoutUrl);

      //globalThis por window
      globalThis.location.href = checkoutUrl;
    } catch (error) {
      message.error(error?.message || "Accion invalida");
      console.log(error);
    }
  };

  return (
    <div className="container_pay_button">
      {user?.user ? (
        <Button
          id="paybutton"
          onClick={() => handlePayment()}
          icon={<MdPayments size={15} color="#ffffffff" />}
        >
          Proceder al pago
        </Button>
      ) : (
        <div>
          <Button
            id="paybutton"
            disabled={!user?.user}
            icon={<MdPayments size={15} color="#ffffffff" />}
          >
            Proceder al pago
          </Button>
          <p id="no_user" className="f_normal text_small">
            Debes iniciar sesion para proceder al pago
          </p>
          <Button
            role="button"
            type="link"
            size="small"
            id="cckt"
            icon={<BiDoorOpen size={15} color="#1151ffff" />}
            onClick={() => {
              navigate("/login");
            }}
          >
            Iniciar sesion
          </Button>
        </div>
      )}
    </div>
  );
};
