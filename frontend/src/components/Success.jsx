import { Result, Spin } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
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
      console.log(res?.data);
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
                <button
                  id="success_btn_two"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Comrar de nuevo
                </button>,
              ]}
            />
          </div>

          <h5 id="vmc">Ver mis compras.</h5>
        </div>
      )}
    </>
  );
};

export default Success;
