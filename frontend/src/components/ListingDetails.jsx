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
import dayjs from "dayjs";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";

import { useDispatch, useSelector } from "react-redux";
import { handleAddFavo, handleRemoveFavo } from "../lib/functions.js";
import { addToFavo, removeFromFavo } from "../redux/favoState.js";
import { PaymentButton } from "./PaymentButton.jsx";

const ListingDetails = () => {
  const { id } = useParams(); // id del path donde las rutas de la app estan App.js

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [listing, setListings] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { RangePicker } = DatePicker;

  const user = useSelector((state) => state?.persistedReducer?.user);

  const favoState = useSelector((state) => state?.persistedReducer?.favorites);
  const fullFavoItems = favoState.favorites;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleDateChange = (dates) => {
    if (!dates || dates.length !== 2) {
      setSelectedDates([]);
      setPrecioTotal(0);
      return;
    }

    const [start, end] = dates;
    setSelectedDates(dates);

    if (!listing) return;

    const precio = listing.precio;
    const unidad = (listing.unidadPrecio || "").trim().toLowerCase();

    let total = 0;

    if (unidad === "día") {
      const dias = end.diff(start, "days");
      if (dias <= 0) {
        message.warning("La fecha de fin debe ser posterior a la de inicio.");
        setPrecioTotal(0);
        return;
      }
      total = precio * dias;
    } else if (unidad === "mes") {
      const dias = end.diff(start, "days");

      if (dias < 28) {
        message.warning("Debes seleccionar al menos 1 mes completo (28 días).");
        setBtnDisabled(true);
        setPrecioTotal(0);
        return;
      }

      const meses = end.diff(start, "month", true);
      const mesesRedondeados = Math.ceil(meses);

      console.log("Meses calculados:", meses);
      console.log("Meses redondeados:", mesesRedondeados);
      console.log(start.toString() + " ---- " + end.toString());

      total = precio * mesesRedondeados;
    } else if (unidad === "fijo") {
      total = precio;
    }
    setBtnDisabled(false);
    setPrecioTotal(total);
  };

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
        "http://localhost:4000/api/booking/createbooking",
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
      if (error.response.status === 400) {
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
        `http://localhost:4000/api/listing/property_id/${id}`,
        {
          withCredentials: true,
        }
      );
      setListings(response.data.listings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  useEffect(() => {
    if (listing && fullFavoItems.length > 0) {
      const isFavo = fullFavoItems.some(
        (item) => item.publicacionId === listing._id
      );
      setIsFavorite(isFavo);
    }
  }, [fullFavoItems, listing]);
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
                      <FaHeartCircleCheck
                        id="icnlist_green"
                        title="Eliminar de favoritos"
                        size={30}
                        onClick={async () => {
                          dispatch(removeFromFavo(listing._id));
                          await handleRemoveFavo({
                            listingID: listing._id,
                            clientID: user.user._id,
                          });
                          message.info("Se removió de favoritos");
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <FaHeartCirclePlus
                        id="icnlist_red"
                        size={30}
                        title="Añadir a favoritos"
                        onClick={async () => {
                          dispatch(
                            addToFavo({
                              publicacionId: listing._id,
                              clienteId: user.user._id,
                            })
                          );

                          await handleAddFavo({
                            listingID: listing._id,
                            clientID: user.user._id,
                          });
                          message.success("Se añadió a favoritos");
                        }}
                      />
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
                    {listing.creador?.photo?.url !== null ? (
                      <Avatar src={listing.creador?.photo?.url} size={30} />
                    ) : null}
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
                        {listing.tipoPublicacion === "alquiler" ? (
                          <div className="div_calendar_details">
                            <Form
                              form={form}
                              onFinish={onFinish}
                              layout="vertical"
                            >
                              <RangePicker
                                disabled={!user || !user.user}
                                onChange={handleDateChange}
                                required
                                className="jaja"
                              />
                              <h2>Precio total: ${precioTotal}</h2>
                              <p>Para alquiler por: {listing.unidadPrecio}</p>
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
                                disabled={
                                  !user || !user.user || btnDisabled === true
                                }
                              >
                                AGENDAR
                              </Button>
                              {!user?.user && (
                                <p id="no_user">
                                  Inicie sesión para poder agendar esta
                                  propiedad.
                                </p>
                              )}
                            </Form>
                          </div>
                        ) : (
                          <div id="venta_div">
                            <h3>Publicación para venta</h3>
                            <PaymentButton listing={listing} />
                          </div>
                        )}
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
