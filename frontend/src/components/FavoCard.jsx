import React from "react";
import { Carousel, Card, Button, message } from "antd";
import { category, categoryIcons, type_Place } from "../lib/constants.jsx";
import { useNavigate } from "react-router-dom";
import { FaHeartCircleXmark } from "react-icons/fa6";
import { IoMdEye, IoMdPin } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { removeFromFavo } from "../redux/slices/favoSlice.js";
import { deleteFromFavo } from "../redux/thunks/favoThunk.js";

const FavoCard = ({
  id,
  fotos,
  municipio,
  categoria,
  tipo,
  departamento,
  pais,
  direccionCalle,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  const handleRemove = async (id) => {
    try {
      dispatch(removeFromFavo(id));
      dispatch(
        deleteFromFavo({
          listingID: id,
          clientID: user._id,
        })
      ).unwrap();

      message.info("Se removió de favoritos");
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Accion invalida.");
    }
  };

  return (
    <div className="">
      <Card className="tripcardlist">
        <h3 id="placetrip">
          <p className="text_center">
            {" "}
            {municipio} {departamento} - {pais}{" "}
          </p>
          <IoMdPin size={24} color="#39b43fff" />
        </h3>

        {fotos?.length > 0 ? (
          <Carousel infinite={false} arrows className="werma">
            {fotos.map((foto, index) => (
              <div key={id}>
                <img
                  src={foto.url}
                  alt={`Foto ${index}`}
                  className="trlstimg"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div>
            <h2>No imagen disponible.</h2>
          </div>
        )}

        <div className="favo_card_address">
          <p id="kk">{direccionCalle}</p> <IoMdPin size={20} color="#66BB6A" />
        </div>
        <div className="infocardtrip">
          <div className="plac">
            <div className="calvo">
              <h4>{category[categoria]}</h4>
              {categoryIcons[categoria] && (
                <span id="icntrip">{categoryIcons[categoria]}</span>
              )}
            </div>
            <div>
              <h4>{type_Place[tipo]}</h4>
            </div>
          </div>
          <div className="center">
            <Button
              danger
              title="Remover de favoritos"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(id);
              }}
            >
              <FaHeartCircleXmark size={20} id="icnlist_red" />
            </Button>

            <Button
              size="small"
              className="pavo"
              title="Ver publicacion"
              onClick={() => {
                navigate(`/property_id/${id}`);
              }}
            >
              <IoMdEye size={20} id="icnlist_green" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FavoCard;
