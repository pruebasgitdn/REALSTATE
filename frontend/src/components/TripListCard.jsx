import React, { useState, useEffect } from "react";
import { Card, Button, Carousel, message, Avatar } from "antd";
import "../styles/TripListCard.css";
import { category, categoryIcons } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser } from "../redux/state.js";
import { useNavigate } from "react-router-dom";

import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";

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
  const userstate = useSelector((state) => state?.user?.user) || null;
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(
    userstate?.listaDeseos?.includes(id)
  ); // Establece el estado local

  const dispatch = useDispatch();

  useEffect(() => {
    setIsFavorite(userstate?.listaDeseos?.includes(id));
  }, []);

  const handleFavo = async () => {
    try {
      setLoadingBtn(true);

      const response = await axios.put(
        "https://realstate-g3bo.onrender.com/api/user/whishlist_add",
        { listingId: id },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedWishList = response.data.wishList;
        console.log(response.data.wishList);
        dispatch(updateUser({ listaDeseos: updatedWishList }));
        setIsFavorite(!isFavorite);

        message.info(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <>
      <Card className="tripcardlist">
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
            {municipio} en {departamento} - {pais}
          </h3>
          <div className="categorydiv">
            <h4>{category[categoria]}</h4>
            {categoryIcons[categoria] && (
              <span id="icntrip">{categoryIcons[categoria]}</span>
            )}{" "}
            <hr />
          </div>

          <div className="categorydiv">
            <h4>
              Anfitrion : {anfitrionNombre} {anfitrionApellido} {}
            </h4>
            <Avatar src={anfitrionFoto.url} size={30} />
          </div>

          <h4 id="fechapt">
            {fechaInicio} - {fechaFin}
          </h4>
          <div className="pricediv">
            <h4 id="preciopt">$ {precioTotal} Total</h4>
            <Button
              type="text"
              size="small"
              onClick={handleFavo}
              loading={loadingBtn}
            >
              {isFavorite ? (
                <>
                  <FaHeartCircleCheck id="icnlist_green" size={22} />
                </>
              ) : (
                <>
                  <FaHeartCirclePlus id="icnlist_red" size={22} />
                </>
              )}
            </Button>
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
