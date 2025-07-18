import React from "react";
import { Card, Button, message } from "antd";
import "../styles/Listing.css";
import { type_Place, category } from "../constants";
import {
  FaCircleArrowDown,
  FaHeartCircleCheck,
  FaHeartCirclePlus,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { addToFavo, removeFromFavo } from "../redux/favoState";
import { handleAddFavo, handleRemoveFavo } from "../lib/functions";
import { useNavigate } from "react-router-dom";

const ListingCard = ({
  id,
  nombrecreador,
  apellidocreador,
  categoria,
  tipo,
  titulo,
  descripcion,
  fotos,
  tipoPublicacion,
}) => {
  const navigate = useNavigate();
  const { Meta } = Card;
  const favoState = useSelector((state) => state.persistedReducer.favorites);
  const user = useSelector((state) => state.persistedReducer.user?.user);

  const fullFavoItems = favoState.favorites;
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const isFavo = fullFavoItems.some((item) => item.publicacionId === id);
    setIsFavorite(isFavo);
  }, [fullFavoItems, id]);

  return (
    <div className="center">
      <Card className="listcard">
        {/* //Comprobar antes si hay usuario */}
        {user ? (
          <>
            {isFavorite ? (
              <div className="p_absolute">
                <FaHeartCircleCheck
                  id="icnlist_green"
                  title="Eliminar de favoritos"
                  size={30}
                  onClick={async () => {
                    dispatch(removeFromFavo(id));
                    await handleRemoveFavo({
                      listingID: id,
                      clientID: user._id,
                    });
                    message.info("Se removió de favoritos");
                  }}
                />
              </div>
            ) : (
              <div className="p_absolute">
                <FaHeartCirclePlus
                  id="icnlist_red"
                  size={30}
                  title="Añadir a favoritos"
                  onClick={async () => {
                    dispatch(
                      addToFavo({
                        publicacionId: id,
                        clienteId: user._id,
                      })
                    );
                    await handleAddFavo({
                      listingID: id,
                      clientID: user._id,
                    });
                    message.success("Se añadió a favoritos");
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <></>
        )}
        <Meta title={titulo} description={descripcion} />
        <img src={fotos[0].url} alt="img" id="imglcard" />
        <div className="flex_center">
          <div className="block_content">
            <label htmlFor="">Categoría:</label>
            <h4>{category[categoria]}</h4>
          </div>
          <div className="block_content">
            <label htmlFor="">Tipo:</label>
            <h4>{type_Place[tipo]}</h4>
          </div>

          <div className="block_content">
            <label htmlFor="">Propietario:</label>{" "}
            <h4 className="text_start">
              {nombrecreador} {apellidocreador}
            </h4>
          </div>
          <div className="margin_y">
            <button id="tp_init">{tipoPublicacion}</button>
          </div>
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
          Ver más
        </Button>
      </Card>
    </div>
  );
};

export default ListingCard;
