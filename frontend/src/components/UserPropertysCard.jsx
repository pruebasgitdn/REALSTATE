import React from "react";
import { formatPrice } from "../lib/functions";
import { Card, Carousel, Button, Flex, Tag, message } from "antd";
import { category, categoryIcons, type_Place } from "../lib/constants.jsx";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdPin } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";
import { addToFavoThunk, deleteFromFavo } from "../redux/thunks/favoThunk.js";
import { addToFavo, removeFromFavo } from "../redux/slices/favoSlice.js";

const UserPropertysCard = ({ item }) => {
  const {
    _id,
    fotos,
    departamento,
    municipio,
    categoria,
    pais,
    tipo,
    precio,
    tipoPublicacion,
    unidadPrecio,
  } = item;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoState = useSelector((state) => state?.favorites.favorites);
  const user = useSelector((state) => state?.user.user);

  const isFavorite = favoState?.some((item) => item.publicacionId?._id === _id);

  return (
    <Card className="tripcardlist">
      <div className="saopp">
        <h3 id="placetrip">
          <p>
            {" "}
            {municipio} {departamento} - {pais}
          </p>
          <IoMdPin size={24} color="#66BB6A" />
        </h3>
        {user &&
          (isFavorite ? (
            <FaHeartCircleCheck
              id="icnlist_green"
              title="Eliminar de favoritos"
              size={22}
              onClick={async () => {
                try {
                  await dispatch(
                    deleteFromFavo({
                      listingID: _id,
                      clientID: user._id,
                    })
                  ).unwrap();

                  message.info("Se removió de favoritos");
                  dispatch(removeFromFavo(_id));
                } catch (error) {
                  console.log(error);
                  message.error(error?.message || "Accion invalida");
                }
              }}
            />
          ) : (
            <FaHeartCirclePlus
              id="icnlist_red"
              size={22}
              title="Añadir a favoritos"
              onClick={async () => {
                try {
                  await dispatch(
                    addToFavoThunk({
                      listingID: _id,
                      clientID: user._id,
                    })
                  ).unwrap();

                  message.success("Se añadió a favoritos");
                  dispatch(
                    addToFavo({
                      publicacionId: item,
                    })
                  );
                } catch (error) {
                  console.log(error);
                  message.error(error?.message || "Accion invalida");
                }
              }}
            />
          ))}
      </div>

      {fotos?.length > 0 ? (
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
        <div className="morir_con_estilo">
          <div className="pecheras_g">
            <h4>{category[categoria]}</h4>
            {categoryIcons[categoria] && (
              <span id="icntrip">{categoryIcons[categoria]}</span>
            )}
          </div>
          <h4>{type_Place[tipo]}</h4>
        </div>

        {tipoPublicacion === "venta" ? (
          <div className="flex_center">
            <h3 id="th_w">
              {formatPrice(precio)} {unidadPrecio}
            </h3>
            {/* <button id="nini">{tipoPublicacion}</button> */}
            <Flex wrap>
              <Tag color="#55c724ff">VENTA</Tag>
            </Flex>
          </div>
        ) : (
          <div className="flex_center">
            <h3 id="th_w">
              {formatPrice(precio)} X {unidadPrecio}
            </h3>
            {/* <button id="nini">{tipoPublicacion}</button> */}
            <Flex wrap>
              <Tag color="#c64408ff">ALQUILER</Tag>
            </Flex>
          </div>
        )}

        <div id="bbt">
          <hr />
          <Button
            block
            type="primary"
            size="small"
            iconPlacement="end"
            icon={<IoMdEye size={19} />}
            onClick={() => {
              navigate(`/property_id/${_id}`);
            }}
          >
            PUBLICACION
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserPropertysCard;
