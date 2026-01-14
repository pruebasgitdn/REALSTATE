import { Card, Button, Carousel, message, Tag, Flex, Avatar } from "antd";
import "../styles/TripListCard.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";
import { formatDate, formatPrice } from "../lib/functions.jsx";
import { addToFavo, removeFromFavo } from "../redux/slices/favoSlice.js";
import { IoMdEye, IoMdPin } from "react-icons/io";
import { BiCalendarEvent } from "react-icons/bi";
import { addToFavoThunk, deleteFromFavo } from "../redux/thunks/favoThunk.js";

const TripListCard = ({ item, anfitrion, booking_data }) => {
  const { _id, fotos, municipio, departamento, pais } = item;

  const { email, photo } = anfitrion;

  const { fechaInicio, fechaFin, precioTotal } = booking_data;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userstate = useSelector((state) => state?.user?.user) || null;

  const favoState = useSelector((state) => state?.favorites.favorites);

  const isFavorite = favoState?.some((item) => item.publicacionId._id === _id);

  return (
    <Card className="tripcardlist">
      <div className="rmt">
        <h3 id="placetrip" className="text_start">
          {municipio} en {departamento} - {pais}
          <IoMdPin size={20} color="#66BB6A" />
        </h3>
      </div>

      {fotos?.length > 0 ? (
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
        <div className="goet">
          <button
            type="button"
            id="noend"
            className="font_bold"
            onClick={() => {
              navigate(`/get_user/${anfitrion._id}`);
            }}
          >
            Propietario: {email}
            {photo?.url !== null ||
            photo?.url !== undefined ||
            photo?.url != [] ? (
              <Avatar
                src={photo?.url || "/assets/avatar.png"}
                size={30}
                onError={(e) => {
                  e.currentTarget.src = "/assets/avatar.png";
                }}
              />
            ) : (
              <></>
            )}
          </button>
        </div>
        <hr className="gvo" />
        <p className="f_normal text_start text_small ng">
          Fecha de inicio y fin de la reserva
        </p>

        <div className="dates">
          <p>
            <strong>Empieza: {formatDate(fechaInicio)}</strong>
            <BiCalendarEvent size={15} />
          </p>

          <p>
            <strong>Termina: {formatDate(fechaFin)}</strong>
            <BiCalendarEvent size={15} />
          </p>
        </div>
        <div>
          {/* <h4 id="preciopt"> */}
          <Flex wrap id="preciopt">
            <Tag color="#49d60cff">PAGO EFECTUADO</Tag>{" "}
            {formatPrice(precioTotal)}
          </Flex>
        </div>

        <hr />
        <div className="m_col">
          <Button
            block
            type="primary"
            size="small"
            iconPlacement="end"
            icon={<IoMdEye size={19} color=" #ffffffff" />}
            onClick={() => {
              navigate(`/property_id/${_id}`);
            }}
          >
            PUBLICACION
          </Button>

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
                        listingID: _id,
                        clientID: userstate._id,
                      })
                    ).unwrap();

                    message.info("Se removió de favoritos");

                    dispatch(removeFromFavo(_id));
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
                    await dispatch(
                      addToFavoThunk({
                        listingID: _id,
                        clientID: userstate._id,
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
              >
                AÑADIR A FAVORITOS
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripListCard;
