import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <div id="container_success">
      <Result
        className="cjng"
        status="403"
        title="Pago Cancelado"
        subTitle="Lo siento, has cancelado el pago."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            INICIO
          </Button>
        }
      />
    </div>
  );
};

export default Cancel;
