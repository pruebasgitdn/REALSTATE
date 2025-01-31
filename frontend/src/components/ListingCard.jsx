import React from "react";
import { Card, Button } from "antd";
import "../styles/Listing.css";
import { type_Place, category } from "../constants";
import { FaCircleArrowDown } from "react-icons/fa6";

const ListingCard = ({
  nombrecreador,
  apellidocreador,
  categoria,
  tipo,
  titulo,
  descripcion,
  fotos,
}) => {
  const { Meta } = Card;
  return (
    <div className="center">
      <Card className="listcard">
        <Meta title={titulo} description={descripcion} />
        <img src={fotos[0].url} alt="img" id="imglcard" />
        <h4>{category[categoria]}</h4>
        <h4>{type_Place[tipo]}</h4>
        <h5>
          Creador: {nombrecreador} {apellidocreador}{" "}
        </h5>

        <Button
          className="green-btn"
          type="outlined"
          block
          size="small"
          icon={<FaCircleArrowDown size={15} />}
          iconPosition="end"
        >
          Ver más
        </Button>
      </Card>
    </div>
  );
};

export default ListingCard;
