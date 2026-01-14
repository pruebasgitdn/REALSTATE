import React, { useState } from "react";
import { Card, Button, Avatar, Carousel, Flex, Tag } from "antd";
import "../styles/Listing.css";
import "../styles/ResultCard.css";
import { FaCircleArrowDown } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { categoryIcons, type_Place, category } from "../lib/constants.jsx";
import { formatPrice } from "../lib/functions.jsx";
import { IoMdPin } from "react-icons/io";

const SearchCardResult = ({
  creadorNombre,
  creadorApellido,
  creadorFoto,
  creadorID,
  id,
  categoria,
  tipo,
  pais,
  departamento,
  municipio,
  titulo,
  descripcion,
  fotos,
  precio,
  tipoPublicacion,
  unidadPrecio,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedDescription =
    descripcion.length > 200 ? descripcion.slice(0, 200) + "..." : descripcion;

  const navigate = useNavigate();
  return (
    <div className="card-container">
      <Card className="resultcard">
        <h3 id="placetrip" className="text_small">
          <p>
            {municipio} {departamento} - {pais}{" "}
          </p>
          <IoMdPin size={24} color="#66BB6A" />
        </h3>
        {fotos?.length > 0 ? (
          <Carousel infinite={false} arrows className="werma">
            {fotos.map((foto, index) => (
              <div key={index}>
                <img src={foto?.url} alt={`Foto`} className="imgcarou" />
              </div>
            ))}
          </Carousel>
        ) : (
          <div>
            <h2>No imagen disponible.</h2>
          </div>
        )}

        <h3 id="vtlalv">{titulo}</h3>

        <p className="text_small f_normal text_start" id="auc">
          {isExpanded ? descripcion : truncatedDescription}
          {descripcion?.length > 200 && (
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? " Ver menos" : " Ver más..."}
            </span>
          )}
        </p>
        <div className="plac">
          <div>
            <h4>{type_Place[tipo]}</h4>
          </div>
          <div className="calvo">
            <h4>{category[categoria]}</h4>
            {categoryIcons[categoria] && (
              <span id="icntrip">{categoryIcons[categoria]}</span>
            )}
          </div>
        </div>
        <hr />
        <a id="alinkpp" href={`/get_user/${creadorID}`}>
          Propietario: {creadorNombre} {creadorApellido}
          <Avatar
            className="avatarfill"
            src={creadorFoto?.url || "/assets/avatar.png"}
            size={30}
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar.png";
            }}
          />
        </a>
        <hr />

        {tipoPublicacion === "venta" ? (
          <div className="tt_tag">
            <h3>Total: {formatPrice(precio)}</h3>
            <Flex wrap>
              <Tag color="#87d068">VENTA</Tag>
            </Flex>
          </div>
        ) : (
          <div className="tt_tag">
            <h3>
              {formatPrice(precio)} x {unidadPrecio}
            </h3>
            <Flex wrap>
              <Tag color="#c64408ff">ALQUILER</Tag>
            </Flex>
          </div>
        )}
        {/* <div className="infocardsearch">
          <h3>{formatPrice(precio)}</h3>
        </div> */}
        <Button
          className="green-btn"
          type="outlined"
          block
          size="small"
          icon={<FaCircleArrowDown size={15} />}
          iconPlacement="end"
          onClick={() => navigate(`/property_id/${id}`)}
        >
          Ver publicación.
        </Button>
      </Card>
    </div>
  );
};

export default SearchCardResult;
