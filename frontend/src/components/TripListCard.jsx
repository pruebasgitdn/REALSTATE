import React, { useState, useEffect } from "react";
import { Card, Button, Carousel, message } from "antd";
import "../styles/TripListCard.css";
import { category, categoryIcons } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";
import {
  formatPrice,
  handleAddFavo,
  handleRemoveFavo,
} from "../lib/functions.js";
import { addToFavo, removeFromFavo } from "../redux/favoState.js";

const TripListCard = ({
  id,
  categoria,
  tipo,
  fotos,
  aptoSuite,
  municipio,
  departamento,
  pais,
  direccionCalle,
  fechaInicio,
  fechaFin,
  precioTotal,
  anfitrionNombre,
  anfitrionApellido,
  anfitrionFoto,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userstate =
    useSelector((state) => state?.persistedReducer?.user?.user) || null;

  const favoState = useSelector((state) => state?.persistedReducer?.favorites);
  const fullFavoItems = favoState.favorites;
  console.log(userstate._id);
  console.log(id);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (fullFavoItems.length > 0) {
      const isFavo = fullFavoItems.some((item) => item.publicacionId === id);
      setIsFavorite(isFavo);
    }
  }, [fullFavoItems, id]);

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
          <div className="goet">
            <div className="carralhoo">
              <h4>{category[categoria]}</h4>
              {categoryIcons[categoria] && (
                <span id="icntrip">{categoryIcons[categoria]}</span>
              )}
            </div>
            <div>
              <h4>
                Propietario: {anfitrionNombre} {anfitrionApellido}
              </h4>
            </div>
          </div>

          <div className="space_btwn">
            <p>{fechaInicio}</p>-<p>{fechaFin}</p>
          </div>
          <div className="pricediv">
            <h4 id="preciopt">{formatPrice(precioTotal)}</h4>

            {isFavorite ? (
              <>
                <FaHeartCircleCheck
                  id="icnlist_green"
                  title="Eliminar de favoritos"
                  size={22}
                  onClick={async () => {
                    dispatch(removeFromFavo(id));
                    await handleRemoveFavo({
                      listingID: id,
                      clientID: userstate?._id,
                    });
                    setIsFavorite(false);
                    message.info("Se removió de favoritos");
                  }}
                />
              </>
            ) : (
              <>
                <FaHeartCirclePlus
                  id="icnlist_red"
                  title="Añadir a favoritos"
                  size={22}
                  onClick={async () => {
                    dispatch(
                      addToFavo({
                        publicacionId: id,
                        clienteId: userstate?._id,
                      })
                    );
                    await handleAddFavo({
                      listingID: id,
                      clientID: userstate?._id,
                    });
                    setIsFavorite(true);
                    message.success("Se añadió a favoritos");
                  }}
                />
              </>
            )}
          </div>
          <div>
            <hr />
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

export default TripListCard;
