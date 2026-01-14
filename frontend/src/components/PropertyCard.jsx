import { Carousel, Card, Button, Popconfirm, Flex, Tag, message } from "antd";
import { category, categoryIcons, type_Place } from "../lib/constants.jsx";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/functions.jsx";
import { IoMdEye, IoMdPin } from "react-icons/io";
import { setStatusListing } from "../redux/thunks/listingThunk.js";
import { useDispatch } from "react-redux";
const PropertyCard = ({
  id,
  fotos,
  municipio,
  categoria,
  tipo,
  departamento,
  pais,
  precio,
  estado,
  tipoPublicacion,
  unidadPrecio,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStatus = async () => {
    try {
      const newStatus = estado === "habilitado" ? "inhabilitado" : "habilitado";

      await dispatch(setStatusListing({ id, estado: newStatus })).unwrap();

      message.info("Se cambio el estatus de la propiedad");
    } catch (error) {
      if (error) {
        message.error(error.message || "Accion Invalida");
      }
    }
  };

  return (
    <Card className="propertycardlist">
      <h3 id="placetrip">
        <p>
          {" "}
          {municipio} {departamento} - {pais}{" "}
        </p>
        <IoMdPin size={24} color="#39b43fff" />
      </h3>

      {fotos?.length > 0 ? (
        <Carousel infinite={false} arrows className="werma">
          {fotos?.map((foto, index) => (
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
          <Button
            className="w_aut"
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

          <Popconfirm
            title={estado === "habilitado" ? "¿DESHABILITAR?" : "HABILITAR"}
            description={`¿Estás seguro de que quieres ${
              estado === "habilitado" ? "inhabilitar" : "habilitar"
            } esta publicación?`}
            okText="Sí"
            onConfirm={handleStatus}
            cancelText="No"
          >
            <p
              className={estado === "inhabilitado" ? "p_enable " : "p_disable "}
              // loading={loading}
              // danger={estado === "habilitado"}
            >
              {estado === "habilitado" ? "¿DESHABILITAR?" : "¿HABILITAR?"}
            </p>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
