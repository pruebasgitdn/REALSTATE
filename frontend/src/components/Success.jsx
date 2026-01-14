import { useEffect, useState } from "react";
import { Result, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayFunct } from "../lib/functions";

const Success = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [responseSessionId, setResponseSessionId] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const res = await verifyPayFunct({ id_session: sessionId });

      //thunk lo mismo de arriba para actualizar el creador ref user en el modelo listng con el nuevopropietarioid
      setResponseSessionId(res?.data.id_session);
      setLoading(false);
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, responseSessionId]);

  return (
    <>
      {loading ? (
        <div>
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        </div>
      ) : (
        <div id="container_success">
          <div id="card_succes">
            <Result
              status="success"
              title="Compra exitosa, protegida y supervisada por Cloud Server ECS!"
              subTitle={`Order number: ${sessionId}`}
              extra={[
                <button
                  id="success_btn_one"
                  onClick={() => {
                    navigate("/my_sales");
                  }}
                  key="console"
                >
                  Mis compras
                </button>,
              ]}
            />
          </div>

          <a id="vmc" href="/">
            Inicio
          </a>
        </div>
      )}
    </>
  );
};

export default Success;
