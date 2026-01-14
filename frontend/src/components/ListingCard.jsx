import React from "react";
import { Card, Button, message, Flex, Tag, Avatar } from "antd";
import "../styles/Listing.css";
import { category, categoryIcons } from "../lib/constants.jsx";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";
import { IoMdEye, IoMdPin } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addToFavo, removeFromFavo } from "../redux/slices/favoSlice.js";
import { useNavigate } from "react-router-dom";
import { addToFavoThunk, deleteFromFavo } from "../redux/thunks/favoThunk.js";
const ListingCard = ({ listing }) => {
  const {
    _id: id,
    categoria,
    municipio,
    departamento,
    pais,
    titulo,
    fotos,
    tipoPublicacion,
    creador,
  } = listing;

  const {
    _id: creadorID,
    nombre: nombrecreador,
    apellido: apellidocreador,
    photo,
  } = creador || {};

  const navigate = useNavigate();
  const { Meta } = Card;
  const favoState = useSelector((state) => state.favorites.favorites);
  const user = useSelector((state) => state.user?.user);

  const dispatch = useDispatch();
  const isFavorite = favoState?.some((item) => item.publicacionId._id === id);

  return (
    <Card className="listcard">
      <div id="nome">
        <Meta title={titulo} />
        <Flex wrap>
          <Tag id="kkk" color="#0961ddff">
            {tipoPublicacion}
          </Tag>
        </Flex>
      </div>

      <img src={fotos[0].url} alt="img" id="imglcard" />
      <div id="full_nene">
        <p>{municipio}</p> <p>{departamento}</p> - <p>{pais}</p>
        <IoMdPin size={20} color="#66BB6A" />
      </div>

      <div className="flex_center">
        <div className="block_content">
          <h4 className="bravito">
            <strong>{category[categoria]}</strong>
            <div>
              {categoryIcons[categoria] && (
                <span id="icntrip">{categoryIcons[categoria]}</span>
              )}
            </div>
          </h4>
        </div>

        <button
          id="btn_div"
          onClick={() => {
            navigate(`/get_user/${creadorID}`);
          }}
        >
          <p>
            Propietario: {nombrecreador} {apellidocreador}
          </p>

          <Avatar
            src={photo?.url || "/assets/avatar.png"}
            size={28}
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar.png";
            }}
            styles={{
              image: {
                objectFit: "cover",
              },
            }}
          />
        </button>
      </div>

      <div className="gp">
        <Button
          block
          type="primary"
          size="small"
          onClick={() => {
            navigate(`/property_id/${id}`);
          }}
          iconPlacement="end"
          icon={<IoMdEye size={19} color=" #ffffffff" />}
        >
          PUBLICACION
        </Button>

        {user ? (
          <div>
            {isFavorite ? (
              <Button
                size="small"
                block
                icon={
                  <FaHeartCircleCheck
                    id="icnlist_green"
                    title="Eliminar de favoritos"
                    size={25}
                  />
                }
                onClick={async () => {
                  try {
                    await dispatch(
                      deleteFromFavo({
                        listingID: id,
                        clientID: user._id,
                      })
                    ).unwrap();

                    message.info("Se removió de favoritos");

                    dispatch(removeFromFavo(id));
                  } catch (error) {
                    console.log(error);
                    message.error(error?.message || "Accion invalida");
                  }
                }}
              >
                ELIMINAR DE FAVORITOS
              </Button>
            ) : (
              <Button
                size="small"
                block
                icon={
                  <FaHeartCirclePlus
                    id="icnlist_red"
                    size={22}
                    title="Añadir a favoritos"
                  />
                }
                onClick={async () => {
                  try {
                    dispatch(
                      addToFavoThunk({
                        listingID: id,
                        clientID: user._id,
                      })
                    ).unwrap();

                    message.success("Se añadió a favoritos");

                    dispatch(
                      addToFavo({
                        publicacionId: listing,
                      })
                    );
                  } catch (error) {
                    console.log(error);
                    message.error(error?.message || "Accion invalida");
                  }
                }}
              >
                AÑADIR A FAVORITOS
              </Button>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};

export default ListingCard;
