import React from "react";
import { formatDate } from "../lib/functions";
import { Avatar } from "antd";
import { IoDocument } from "react-icons/io5";

const SaleInfo = ({ item }) => {
  return (
    <div className="sales_order_card">
      <div className="j_btn">
        <h3>Informacion de la venta</h3>
        <IoDocument size={20} color="rgb(0, 0, 0)" />
      </div>
      <hr />
      <h4>Nuevo propietario</h4>
      <div className="info_sso">
        <a id="alinkpp" href={`/get_user/${item?.nuevoPropId?._id}`}>
          <strong>Email:</strong>
          {item.nuevoPropId?.email}
          {item.nuevoPropId?.photo?.url !== null ||
          item.nuevoPropId?.photo?.url !== undefined ||
          item.nuevoPropId?.photo?.url != [] ? (
            <Avatar
              src={item.nuevoPropId?.photo?.url || "/assets/avatar.png"}
              size={30}
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar.png";
              }}
            />
          ) : (
            <></>
          )}
        </a>
        <div className="sub_sso">
          <span>Nombre:</span> <p>{item.nuevoPropId.nombre}</p>
        </div>{" "}
      </div>
      <hr />
      <h4>Compra</h4>
      <div className="info_sso">
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
