import React from "react";
import { Carousel, Card, Button } from "antd";
import { category, categoryIcons, type_Place } from "../constants.js";
import { useNavigate } from "react-router-dom";
import { FaHeartCircleXmark } from "react-icons/fa6";

const FavoCard = ({
  id,
  fotos,
  municipio,
  categoria,
  tipo,
  departamento,
  pais,
  precio,
  handleRemove,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Card
        className="tripcardlist"
        onClick={() => {
          navigate(`/property_id/${id}`);
        }}
      >
        {fotos.length > 0 ? (
          <Carousel infinite={false} arrows className="werma">
            {fotos.map((foto, index) => (
              <div key={index}>
                <img src={foto.url} alt={`Foto`} className="trlstimg" />
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
            {municipio} {departamento} - {pais}
          </h3>
          <div className="categorydiv">
            <h4>{category[categoria]}</h4>
            {categoryIcons[categoria] && (
              <span id="icntrip">{categoryIcons[categoria]}</span>
            )}{" "}
          </div>
          <div className="categorydiv">
            <h4>{type_Place[tipo]}</h4>
          </div>
          <h3 id="placetrip">{precio} COP MENSUAL</h3>

          <div className="center">
            <Button
              danger
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(id);
              }}
            >
              <FaHeartCircleXmark size={20} id="icnlist_red" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default FavoCard;
