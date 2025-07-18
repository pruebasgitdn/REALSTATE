import React, { useState, useEffect } from "react";
import { Card, Button, Carousel, message, Avatar } from "antd";
import "../styles/TripListCard.css";
import { category, categoryIcons } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser } from "../redux/userState.js";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/functions.js";

const ReservationCard = ({
  id,
  categoria,
  fotos,
  municipio,
  departamento,
  pais,
  fechaInicio,
  fechaFin,
  precioTotal,
  clienteNombre,
  clienteApellido,
  clienteFoto,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Card className="tripcardlist">
        {fotos.length > 0 ? (
          <Carousel infinite={false} arrows className="werma">
            {fotos.map((foto, index) => (
              <div key={index}>
                <img src={foto?.url} alt={`Foto`} className="trlstimg" />
              </div>
            ))}
          </Carousel>
        ) : (
          <div>
            <h2>No imagen disponible.</h2>
          </div>
        )}
        <div className="infocardtrip">
          <h3 id="placetrip">
            {municipio} en {departamento} - {pais}
          </h3>
          <div className="bbt">
            <h4>{category[categoria]}</h4>
            {categoryIcons[categoria] && (
              <span id="icntrip">{categoryIcons[categoria]}</span>
            )}
          </div>

          <div className="space_btwn">
            <p>{fechaInicio}</p>-<p>{fechaFin}</p>
          </div>

          <div className="categorydiv">
            <h4>
              Reservado por: {clienteNombre} {clienteApellido} {}
            </h4>
            <Avatar src={clienteFoto?.url} size={30} />
          </div>

          <div>
            <Button
              block
              type="primary"
              size="small"
              onClick={() => {
                navigate(`/property_id/${id}`);
              }}
            >
              PUBLICACION
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ReservationCard;
