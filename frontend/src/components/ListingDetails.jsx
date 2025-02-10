import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Carousel,
  Spin,
  Row,
  Col,
  Card,
  Avatar,
  Form,
  message,
  Button,
  DatePicker,
} from "antd";
import "../styles/ListingDetails.css";
import { useNavigate } from "react-router-dom";
import { amenitiesIcons, type_Place, amenities } from "../constants";

import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";

import { useSelector } from "react-redux";

const ListingDetails = () => {
  const { id } = useParams(); // id del path donde las rutas de la app estan App.js

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [listing, setListings] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);

  const { RangePicker } = DatePicker;

  const handleDateChange = (dates) => {
    if (dates) {
      setSelectedDates(dates);

      const totalDias = dates[1].diff(dates[0], "days"); // Diferencia en dias
      const totalx = totalDias * (listing?.precio || 0);
      setPrecioTotal(totalx);
    } else {
      setSelectedDates([]);
    }
  };

  const user = useSelector((state) => state.user);
  const zz = useSelector((state) => state?.user?.user);

  const [isFavorite, setIsFavorite] = useState(zz?.listaDeseos.includes(id));

  const onFinish = async () => {
    try {
      setLoadingForm(true);
      const formData = new FormData();

      formData.append("clienteId", user.user._id);
      formData.append("anfitrionId", listing.creador._id);
      formData.append("publicacionId", id);
      formData.append("fechaInicio", selectedDates[0].format("YYYY-MM-DD"));
      formData.append("fechaFin", selectedDates[1].format("YYYY-MM-DD"));
      formData.append("precioTotal", precioTotal);

      const response = await axios.post(
        "https://realstate-g3bo.onrender.com/api/booking/createbooking",
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        message.success("Agenda exitosa");
        navigate("/");
      }

      // formData.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });
    } catch (error) {
      if (error.response.status === 409) {
        message.error(error.response.data?.message);
      } else {
        const errorMessage =
          error.response.data?.message || "Ocurrió un error inesperado.";
        message.error(errorMessage);
      }

      console.error(error);
    } finally {
      setLoadingForm(false);
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://realstate-g3bo.onrender.com/api/listing/property_id/${id}`,
        {
          withCredentials: true,
        }
      );
      setListings(response.data.listings);
      console.log(response.data.listings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    console.log(user);
    console.log(zz);
    setIsFavorite(zz?.listaDeseos.includes(id));
  }, [zz?.listaDeseos, id]);

  return (
    <>
      {loading ? (
        <div>
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        </div>
      ) : listing ? (
        <div className="divlistings">
          <Card id="card_item">
            <div className="header_list">
              <h1 className="titlelist">{listing.titulo}</h1>
              {user?.user ? (
                <div className="save_btn">
                  {isFavorite ? (
                    <>
                      <FaHeartCircleCheck id="icnlist_green" size={30} />
                    </>
                  ) : (
                    <>
                      <FaHeartCirclePlus id="icnlist_red" size={30} />
                    </>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>

            <>
              {listing.fotos && listing.fotos.length > 0 ? (
                <>
                  <Carousel infinite={false} arrows className="werma">
                    {listing.fotos.map((foto, index) => (
                      <div key={index}>
                        <Row>
                          <Col sm={24} md={24} lg={24}>
                            <img
                              src={foto.url}
                              alt={`Foto ${index + 1}`}
                              className="imgdetail"
                            />
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Carousel>
                  <h2>
                    {/* en t_place buscar por el valor del {listing.tipo} */}
                    {type_Place[listing.tipo]} en {listing.municipio} -{" "}
                    {listing.departamento}, {listing.pais}
                  </h2>
                  <div className="quantity_list">
                    <h3>Huespedes: {listing.cantidadHuespedes}</h3>
                    <h3>Dormitorios: {listing.cantidadDormitorios}</h3>
                    <h3>Camas: {listing.cantidadCamas}</h3>
                    <h3>Baños: {listing.cantidadBanos}</h3>
                  </div>
                  <hr />
                  <div className="quantity_list">
                    Creado por: {listing.creador.nombre}{" "}
                    {listing.creador.apellido}{" "}
                    <Avatar src={listing.creador.photo.url} size={30} />
                  </div>
                  <hr />
                  <div className="desc">
                    <h3>Descripcion</h3>
                    <p>{listing.descripcion}</p>
                  </div>
                  {listing.destacado &&
                  listing.descripcionDestacado === "undefined" ? (
                    <></>
                  ) : (
                    <>
                      <hr />
                      <div className="desc">
                        <h3>{listing.destacado}</h3>
                        <p>{listing.descripcionDestacado}</p>
                      </div>
                    </>
                  )}

                  <hr />
                  <div className="amenities">
                    <h2>Que ofrece el lugar?</h2>
                    <Row>
                      <Col xs={24} sm={24} md={12}>
                        {listing.comodidades ? (
                          <Row>
                            {String(listing.comodidades)
                              .split(",")
                              .map((amenity, index) => (
                                <Col xs={12} sm={12} md={12} key={index}>
                                  <div id="iconolistdt">
                                    <span>
                                      {amenitiesIcons[amenity] || "❓"}
                                    </span>
                                    <span>{amenities[amenity]}</span>
                                  </div>
                                </Col>
                              ))}
                          </Row>
                        ) : (
                          <p>No hay comodidades disponibles para mostrar.</p>
                        )}
                      </Col>

                      <Col xs={24} sm={24} md={12}>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                          <div className="div_calendar_details">
                            <RangePicker
                              disabled={!user || !user.user}
                              onChange={handleDateChange}
                              required
                            />
                            <h2>Precio total: ${precioTotal}</h2>
                            <p>
                              Fecha de inicio:{" "}
                              {selectedDates[0]
                                ? selectedDates[0].format("YYYY-MM-DD")
                                : "No seleccionada"}
                            </p>
                            <p>
                              Fecha de fin:{" "}
                              {selectedDates[1]
                                ? selectedDates[1].format("YYYY-MM-DD")
                                : "No seleccionada"}
                            </p>
                            <Button
                              loading={loadingForm}
                              className="green-btn"
                              size="small"
                              type="outlined"
                              htmlType="submit"
                              block
                              disabled={!user || !user.user}
                            >
                              AGENDAR
                            </Button>
                            {user && user.user ? (
                              <></>
                            ) : (
                              <p id="no_user">
                                Inicie sesión para poder agendar esta propiedad.
                              </p>
                            )}
                          </div>
                        </Form>
                      </Col>
                    </Row>
                  </div>
                </>
              ) : (
                <p>No hay fotos disponibles para esta propiedad.</p>
              )}
            </>
          </Card>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No se encontró la propiedad.</p>
      )}
    </>
  );
};

export default ListingDetails;
