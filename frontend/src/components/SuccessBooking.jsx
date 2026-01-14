import { Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayBooking } from "../redux/thunks/checkoutThunk";
import { addBooking } from "../redux/slices/bookingSlice";

const SuccessBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await dispatch(verifyPayBooking(sessionId)).unwrap();

        dispatch(
          addBooking({
            publicacion: res.publicacionId,
            anfitrion: res.anfitrionId,
            booking_data: {
              fechaInicio: res.fechaInicio,
              fechaFin: res.fechaFin,
              precioTotal: res.precioTotal,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    if (sessionId) {
      fetchSession();
    }
  }, [dispatch, sessionId]);

  if (loading) {
    return (
      <div>
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      </div>
    );
  }
  return (
    <div id="container_success">
      <div id="card_succes">
        <Result
          status="success"
          title="Reserva exitosa, protegida y supervisada por Cloud Server ECS!"
          subTitle={`Order number: ${sessionId}`}
          extra={[
            <button
              key={sessionId}
              id="success_btn_two"
              onClick={() => {
                navigate("/trip_list");
              }}
            >
              Mis reservas
            </button>,
          ]}
        />
      </div>

      <a id="vmc" href="/">
        Inicio
      </a>
    </div>
  );
};

export default SuccessBooking;
