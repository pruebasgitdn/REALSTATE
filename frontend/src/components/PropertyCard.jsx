import React, { useState } from "react";
import { Carousel, Card, Button, Popconfirm, Select, message } from "antd";
import { category, categoryIcons, type_Place } from "../constants.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/functions.js";

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
  refreshList,
  tipoPublicacion,
  unidadPrecio,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = estado === "habilitado" ? "inhabilitado" : "habilitado";

      const response = await axios.put(
        `http://localhost:4000/api/listing/property_setstatus/${id}`,
        {
          estado: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Publicacion inhabilitada correctamente");
        refreshList();
      }
    } catch (error) {
      if (error) {
        message.error(error.message);
      }

      console.log(error);
    } finally {
      setLoading(false);
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
            {municipio} {departamento} - {pais}
          </h3>
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
              <button id="nini">{tipoPublicacion}</button>
            </div>
          ) : (
            <div className="flex_center">
              <h3 id="th_w">
                {formatPrice(precio)} X {unidadPrecio}
              </h3>
              <button id="nini">{tipoPublicacion}</button>
            </div>
          )}

          <div id="bbt">
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

            <Popconfirm
              title={estado === "habilitado" ? "DESHABILITAR" : "HABILITAR"}
              description={`¿Estás seguro de que quieres ${
                estado === "habilitado" ? "inhabilitar" : "habilitar"
              } esta publicación?`}
              okText="Sí"
              onConfirm={handleStatus}
              cancelText="No"
            >
              <Button
                block
                type="primary"
                size="small"
                className={estado === "inhabilitado" ? "green-btn" : ""}
                loading={loading}
                danger={estado === "habilitado"}
              >
                {estado === "habilitado" ? "DESHABILITAR" : "HABILITAR"}
              </Button>
            </Popconfirm>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PropertyCard;
