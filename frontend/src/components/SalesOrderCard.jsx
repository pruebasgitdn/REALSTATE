import React from "react";
import { formatDate } from "../lib/functions";

const SalesOrderCard = ({ item }) => {
  return (
    <div className="sales_order_card">
      <h3>Informacion de la compra</h3>
      <hr />
      <h4>Anterior dueño</h4>
      <div className="info_sso">
        <div className="sub_sso">
          <span>Email:</span>
          <p>{item.antiguoPropID.email}</p>
        </div>
        <div className="sub_sso">
          <span>Nombre:</span> <p>{item.antiguoPropID.nombre}</p>
        </div>{" "}
      </div>
      <hr />
      <h4>Compra</h4>
      <div className="info_sso">
        <div className="sub_sso">
          <span>Categoria:</span>
          <p>{item.publicacionId.categoria}</p>
        </div>
        <div className="sub_sso">
          <span>Titulo:</span>
          <p>{item.publicacionId.titulo}</p>
        </div>
        <div className="sub_sso">
          <span>Fecha:</span>
          <p>{formatDate(item.fechaVenta)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderCard;
