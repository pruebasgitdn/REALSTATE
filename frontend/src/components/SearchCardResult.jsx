import React from "react";
import { Card, Button, Avatar, Carousel } from "antd";
import "../styles/Listing.css";
import { type_Place, category } from "../constants";
import { FaCircleArrowDown } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { categoryIcons } from "../constants.js";
import "../styles/ResultCard.css";
const SearchCardResult = ({
  creadorNombre,
  creadorApellido,
  creadorFoto,
  id,
  categoria,
  tipo,
  titulo,
  descripcion,
  fotos,
  precio,
}) => {
  const { Meta } = Card;

  const navigate = useNavigate();
  return (
    <>
      <div className="card-container">
        <Card className="resultcard">
          {fotos.length > 0 ? (
            <Carousel infinite={false} arrows className="werma">
              {fotos.map((foto, index) => (
                <div key={index}>
                  <img src={foto.url} alt={`Foto`} className="imgcarou" />
                </div>
              ))}
            </Carousel>
          ) : (
            <div>
              <h2>No imagen disponible.</h2>
            </div>
          )}

          <div className="infocardsearch">
            <h3>{titulo}</h3>
            <br />
            <p>{descripcion}</p>
          </div>
          <div className="categorydiv">
            <h4>{type_Place[tipo]}</h4>
            <h4>{category[categoria]}</h4>
            {categoryIcons[categoria] && (
              <span id="icntrip">{categoryIcons[categoria]}</span>
            )}{" "}
          </div>
          <hr />
          <div className="categorydiv">
            <h4>
              Creador: {creadorNombre} {creadorApellido}{" "}
            </h4>
            <Avatar className="avatarfill" src={creadorFoto.url} size={30} />
          </div>
          <hr />
          <div className="infocardsearch">
            <h3>$ {precio} COP</h3>
          </div>
          <Button
            className="green-btn"
            type="outlined"
            block
            size="small"
            icon={<FaCircleArrowDown size={15} />}
            iconPosition="end"
            onClick={() => navigate(`/property_id/${id}`)}
          >
            Ir a la publicación.
          </Button>
        </Card>
      </div>
    </>
  );
};

export default SearchCardResult;
