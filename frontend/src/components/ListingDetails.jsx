import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Result,
} from "antd";
import { IoMdPin } from "react-icons/io";
import "../styles/ListingDetails.css";
import { amenitiesIcons, type_Place, amenities } from "../lib/constants.jsx";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToFavo, removeFromFavo } from "../redux/slices/favoSlice.js";
import { PaymentButton } from "./PaymentButton.jsx";
import { addToFavoThunk, deleteFromFavo } from "../redux/thunks/favoThunk.js";
import { payBookingThunk } from "../redux/thunks/checkoutThunk.js";
import { formatPrice } from "../lib/functions.jsx";
import { API_BASE_URL } from "../env.js";

const ListingDetails = () => {
  const { id } = useParams(); // App.js /:id/

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [listing, setlisting] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { RangePicker } = DatePicker;

  const user = useSelector((state) => state?.user);

  const favoState = useSelector((state) => state?.favorites.favorites);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/listing/property_id/${id}`,
        {
          withCredentials: true,
        }
      );
      setlisting(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

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

      const checkoutUrl = await dispatch(
        payBookingThunk({
          item: listing,
          owner_id: listing.creador._id,
          fechaInicio: selectedDates[0],
          fechaFin: selectedDates[1],
          precioTotal: precioTotal,
        })
      ).unwrap();

      globalThis.location.href = checkoutUrl;

      //reserva, hacer la simulacion de pago para tan, redirigir a sucessboking y melo (no registra nada en Sales)
    } catch (error) {
      const errorMessage = error?.message || "Ocurrió un error inesperado.";
      message.error(errorMessage);

      console.error(error);
    } finally {
      setLoadingForm(false);
    }
  };

  const isFavorite = favoState?.some((item) => item.publicacionId._id === id);

  console.log(listing);

  if (listing?.estado == "inhabilitado") {
    return (
      <Result
        status="404"
        title="Esta propiedad no existe o esta inhabilitada"
        subTitle="Lo siento, no se encontro la propiedad."
        extra={
          <Button
            type="primary"
            onClick={() =>
              navigate("/search", { state: { clearFilters: true } })
            }
          >
            TODAS LAS PROPIEDADES
          </Button>
        }
      />
    );
  }
  return (
    <>
      {loading && (
        <div>
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        </div>
      )}

      {listing ? (
        <div className="divlistings">
          <Card id="card_item">
            <div className="header_list">
              <h1 className="titlelist">{listing.titulo}</h1>
              {user?.user && (
                <div className="save_btn">
                  {isFavorite ? (
                    <FaHeartCircleCheck
                      id="icnlist_green"
                      title="Eliminar de favoritos"
                      size={30}
                      onClick={async () => {
                        try {
                          await dispatch(
                            deleteFromFavo({
                              listingID: listing._id,
                              clientID: user.user._id,
                            })
                          ).unwrap();

                          message.info("Se removió de favoritos");

                          dispatch(removeFromFavo(listing._id));
                        } catch (error) {
                          console.log(error);
                          message.error(error?.message || "Accion invalida");
                        }
                      }}
                    />
                  ) : (
                    <FaHeartCirclePlus
                      id="icnlist_red"
                      size={30}
                      title="Añadir a favoritos"
                      onClick={async () => {
                        try {
                          await dispatch(
                            addToFavoThunk({
                              listingID: listing._id,
                              clientID: user.user._id,
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
                    />
                  )}
                </div>
              )}
            </div>

            <>
              {listing.fotos && listing.fotos.length > 0 ? (
                <>
                  <Carousel infinite={false} arrows className="werma">
                    {listing.fotos.map((foto, index) => (
                      <div key={foto?.url}>
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
                  <div id="suelaroja">
                    <h2>
                      {/* en t_place buscar por el valor del {listing.tipo} */}
                      {type_Place[listing.tipo]} en {listing.municipio} -{" "}
                      {listing.departamento}, {listing.pais}
                      <IoMdPin size={24} color="#66BB6A" />
                    </h2>
                  </div>
                  <div className="quantity_list">
                    <h3>Huespedes: {listing.cantidadHuespedes}</h3>
                    <h3>Dormitorios: {listing.cantidadDormitorios}</h3>
                    <h3>Camas: {listing.cantidadCamas}</h3>
                    <h3>Baños: {listing.cantidadBanos}</h3>
                  </div>
                  <hr />
                  <a id="alinkpp" href={`/get_user/${listing?.creador?._id}`}>
                    Propietario: {listing.creador.nombre}{" "}
                    {listing.creador.apellido}{" "}
                    <Avatar
                      src={listing.creador?.photo?.url || "/assets/avatar.png"}
                      size={30}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/avatar.png";
                      }}
                    />
                  </a>
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
                              .map((amenity) => (
                                <Col xs={12} sm={12} md={12} key={amenity}>
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
                        <hr />
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
                              <h2>Precio total: {formatPrice(precioTotal)}</h2>
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

                              {user.user?._id !== listing.creador._id ? (
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
                              ) : (
                                <p className="f_normal">
                                  {" "}
                                  Ya eres dueño de esta propiedad.{" "}
                                  <Button
                                    loading={loadingForm}
                                    className="green-btn"
                                    size="small"
                                    type="outlined"
                                    htmlType="submit"
                                    block
                                    disabled={true}
                                  >
                                    AGENDAR
                                  </Button>
                                </p>
                              )}

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

                            {user.user?._id !== listing.creador._id ? (
                              <PaymentButton listing={listing} />
                            ) : (
                              <p className="f_normal">
                                {" "}
                                Ya eres dueño de esta propiedad.{" "}
                              </p>
                            )}
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
