import React from "react";
import { formatDate } from "../lib/functions";

const SaleInfo = ({ item }) => {
  return (
    <div className="sales_order_card">
      <h3>Informacion de la venta</h3>
      <hr />
      <h4>Nuevo propietario</h4>
      <div className="info_sso">
        <div className="sub_sso">
          <span>Email:</span>
          <p>{item.nuevoPropId.email}</p>
        </div>
        <div className="sub_sso">
          <span>Nombre:</span> <p>{item.nuevoPropId.nombre}</p>
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

export default SaleInfo;
