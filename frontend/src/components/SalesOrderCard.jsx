import React from "react";
import { formatDate } from "../lib/functions";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { IoDocument } from "react-icons/io5";

const SalesOrderCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div className="sales_order_card">
      <div className="j_btn">
        <h3>Informacion de compra</h3>
        <IoDocument size={20} color="rgb(0, 0, 0)" />
      </div>
      <hr id="koko" />
      <h4>Anterior propietario</h4>
      <div className="info_sso">
        <button
          type="button"
          id="noend"
          onClick={() => {
            navigate(`/get_user/${item?.antiguoPropID?._id}`);
          }}
        >
          <strong>Email:</strong>
          {item.antiguoPropID.email}
          {item.antiguoPropID?.photo?.url !== null ||
          item.antiguoPropID?.photo?.url !== undefined ||
          item.antiguoPropID?.photo?.url != [] ? (
            <Avatar
              src={item.antiguoPropID?.photo?.url || "/assets/avatar.png"}
              size={30}
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar.png";
              }}
            />
          ) : (
            <></>
          )}
        </button>
        <div className="sub_sso">
          <span>Nombre:</span> <p>{item.antiguoPropID.nombre}</p>
        </div>{" "}
      </div>
      <hr id="koko" />
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

export default SalesOrderCard;
