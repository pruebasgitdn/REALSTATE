import React, { useState } from "react";
import "../styles/CreateListing.css";
import {
  Card,
  Col,
  Input,
  Row,
  Form,
  Button,
  Badge,
  Upload,
  InputNumber,
  message,
  Select,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { FaRegImages } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import {
  createAmenitiesList,
  createListingcategories,
  createTypePlace,
  labeltipoPublicacionOpciones,
  tipoPublicacionOpciones,
} from "../lib/constants.jsx";
import { useListingCounter } from "../hooks/useListingCounter.js";
import { createListing } from "../redux/thunks/listingThunk.js";
import { useDispatch, useSelector } from "react-redux";

const CreateListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Dragger } = Upload;
  // const { Group: Space.Compact } = Button;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const formData = new FormData();

  const [category, setCateogry] = useState("");

  const [amenities, setAmenities] = useState([]);
  const [typePlace, setTypePlace] = useState("");
  const [fileList, setFileList] = useState([]);

  const [saleOrRent, setSaleOrRent] = useState("");
  const [priceUnit, setPriceUnit] = useState("");

  const loading = useSelector((state) => state?.listings?.loading);

  // Foto de la publicacion
  const handleFileChange = ({ fileList }) => {
    // Extrae los archivos reales de cada entrada
    const files = fileList.map((file) => file.originFileObj);
    setFileList(files);
  };

  // Numero de
  const {
    increaseBaths,
    guestNumber,
    bathNumber,
    roomNumber,
    bedNumber,
    minusBaths,
    increaseGuest,
    minusGuest,
    increaseRoom,
    minusRoom,
    increaseBed,
    minusBed,
  } = useListingCounter();

  //COMODIDADES
  const handleClick = async (e) => {
    const amenityId = e.currentTarget.id;
    setAmenities((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((item) => item !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  //SELECT TIPO PUBLI
  const handleSelect = (e) => {
    setSaleOrRent(e);
  };

  //SELECT UNIDAD PRECIO
  const handleSelectTwo = (e) => {
    setPriceUnit(e);
  };

  //HANDLE FORM
  const handleForm = async (values) => {
    try {
      formData.append("categoria", category);
      formData.append("tipo", typePlace);
      formData.append("direccionCalle", values?.direccion);
      formData.append("aptoSuite", values?.apt);
      formData.append("municipio", values?.ciudad);
      formData.append("departamento", values?.departamento);
      formData.append("pais", values?.pais);

      if (
        guestNumber === 0 ||
        roomNumber == 0 ||
        bedNumber === 0 ||
        bathNumber === 0
      ) {
        message.error("Ingresa # de invitados, habitaciones y/o camas");
        return;
      }

      formData.append("cantidadHuespedes", guestNumber);
      formData.append("cantidadDormitorios", roomNumber);
      formData.append("cantidadCamas", bedNumber);
      formData.append("cantidadBanos", bathNumber);

      formData.append("comodidades", amenities);
      formData.append("titulo", values?.titulo);
      formData.append("descripcion", values?.descripcion);
      formData.append("destacado", values?.destacados);
      formData.append("descripcionDestacado", values?.describir_destacados);
      formData.append("precio", values?.precio);

      if (saleOrRent === "venta") {
        setPriceUnit("fijo");
      }

      formData.append("tipoPublicacion", saleOrRent);
      formData.append("unidadPrecio", values?.unidadPrecio);

      if (amenities.length > 0) {
        amenities.forEach((a) => {
          formData.append("comodidades", a);
        });
      } else {
        message.error("Debes describir al menos una comodidad.");
        return;
      }

      //Files
      if (!fileList || fileList.length === 0) {
        message.info("Debes subir al menos una imagen.");
        return;
      } else if (fileList.length > 3) {
        message.info("Solo puedes subir hasta 3 imágenes.");
        return;
      }
      if (category === "" || category === null) {
        message.error("Ingresa una categoria");
        return;
      }

      if (typePlace === "" || typePlace === null) {
        message.error("Ingresa el tipo de lugar");
        return;
      }

      fileList.forEach((file) => {
        formData.append("images", file);
      });

      await dispatch(createListing(formData)).unwrap();

      message.success("Se creo la publicacion exitosamente");
      navigate("/property_list");
    } catch (error) {
      console.error(error);
      console.error(error?.message);
      message.error(error?.message);
    }
  };

  return (
    <div className="center_zzz">
      <Form layout="vertical" form={form} onFinish={handleForm}>
        <h2 className="publy">Publica tú sitio.</h2>
        <Card size="small" id="card">
          <h3>Paso 1: Cuentanos sobre el sitio.</h3>
          <hr />
          <h4>Cual de estas categorías describe mejor el lugar?</h4>

          {/* //constnates y mapeo */}
          <div className="categories-wrapper">
            <Row gutter={[0, 10]} justify={"center"}>
              {createListingcategories.map((cat, i) => {
                return (
                  <Col key={i} xs={12} sm={12} md={8} lg={6}>
                    <button
                      type="button"
                      className={`iconcard ${
                        category === cat.id ? "selected" : ""
                      }`}
                      onClick={() => setCateogry(cat.id)}
                    >
                      {cat.icon}
                      <h5>{cat.label}</h5>
                    </button>
                  </Col>
                );
              })}
            </Row>
          </div>

          <h4>Que tipo de lugar van a tener los invitados?</h4>
          <Row>
            {createTypePlace.map((tp) => {
              return (
                <Col xs={24} key={tp.id}>
                  <Card
                    className={`naziz ${
                      typePlace === tp.id ? "place" : "naziz"
                    }`}
                    id={tp.id}
                    onClick={(e) => setTypePlace(e.currentTarget.id)}
                  >
                    <h3 className="infoplace">{tp.title}</h3>
                    <div className="infoplace">
                      <p>{tp.description}</p>
                      {tp.icon}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <h4>Donde esta ubicado el sitio?</h4>

          <Row>
            <Col span={12}>
              <Form.Item
                name="direccion"
                label="Direccion"
                className="inpform"
                rules={[
                  { required: true, message: "Requerido" },
                  {
                    max: 50,
                    message: "Maximo 50 caracteres",
                  },
                ]}
              >
                <Input placeholder="Direccion de la calle" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="ciudad"
                label="Ciudad"
                className="inpform"
                rules={[
                  { required: true, message: "Requerido" },
                  {
                    max: 25,
                    message: "Maximo 25 caracteres",
                  },
                ]}
              >
                <Input placeholder="Ciudad" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="departamento"
                label="Departamento"
                className="inpform"
                rules={[
                  { required: true, message: "Requerido" },
                  {
                    max: 25,
                    message: "Maximo 25 caracteres",
                  },
                ]}
              >
                <Input placeholder="Departamento" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pais"
                label="País"
                className="inpform"
                rules={[
                  { required: true, message: "Requerido" },
                  {
                    max: 25,
                    message: "Maximo 25 caracteres",
                  },
                ]}
              >
                <Input placeholder="País" />
              </Form.Item>
            </Col>
          </Row>

          <h4>Comparte algo de informacion del lugar.</h4>
          <Row className="container_more_minus">
            <Form.Item className="inpbadge">
              <Badge count={guestNumber} className="badge">
                Invitados
              </Badge>
              <br />
              <Space.Compact className="btngp">
                <Button icon={<FiMinus />} onClick={minusGuest} />
                <Button icon={<FiPlus />} onClick={increaseGuest} />
              </Space.Compact>
            </Form.Item>

            <Form.Item className="inpbadge">
              <Badge count={bathNumber} className="badge">
                Baños
              </Badge>
              <br />
              <Space.Compact className="btngp">
                <Button icon={<FiMinus />} onClick={minusBaths} />
                <Button icon={<FiPlus />} onClick={increaseBaths} />
              </Space.Compact>
            </Form.Item>

            <Form.Item className="inpbadge">
              <Badge count={roomNumber} className="badge">
                Habitaciones
              </Badge>
              <br />
              <Space.Compact className="btngp">
                <Button icon={<FiMinus />} onClick={minusRoom} />
                <Button icon={<FiPlus />} onClick={increaseRoom} />
              </Space.Compact>
            </Form.Item>

            <Form.Item className="inpbadge">
              <Badge count={bedNumber} className="badge">
                Camas
              </Badge>
              <br />
              <Space.Compact className="btngp">
                <Button icon={<FiMinus />} onClick={minusBed} />
                <Button icon={<FiPlus />} onClick={increaseBed} />
              </Space.Compact>
            </Form.Item>
          </Row>
        </Card>

        <br />

        {/* constantes y mapeo */}
        <Card size="small" id="card">
          <h3>Paso 2: Cuentanos sobre el sitio.</h3>
          <hr />
          <h4>Diles a los invitados las comodidades que puedes ofrecer</h4>
          <div className="categories-wrapper">
            <Row gutter={[0, 16]} justify={"center"}>
              {createAmenitiesList.map((am) => {
                return (
                  <Col xs={8} sm={6} md={4} key={am.label}>
                    <button
                      key={am.id}
                      className={`iconcard ${
                        amenities.includes(am.id) ? "selected" : ""
                      }`}
                      id={am.id}
                      onClick={handleClick}
                    >
                      {am.icon}
                      <h5>{am.label}</h5>
                    </button>
                  </Col>
                );
              })}
            </Row>
          </div>

          <hr />
          <h4>Añade algunas fotos del lugar.</h4>
          <div className="w_100">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Campo requerido",
                },
              ]}
            >
              <Dragger
                beforeUpload={() => false}
                multiple
                className="dragger_create"
                listType="picture"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
                maxCount={3}
                onRemove={() => setFileList([])}
                req
              >
                <Button icon={<FaRegImages size={20} />} block>
                  Sube o arrastra tus fotos
                </Button>
              </Dragger>
            </Form.Item>
          </div>
          <hr />

          <h4>Que hace diferente a tú lugar?</h4>

          <Row>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="titulo"
                label="Titulo"
                className="inpform"
                rules={[
                  { required: true, message: "Requerido" },
                  {
                    max: 35,
                    message: "Maximo 35 caracteres",
                  },
                ]}
              >
                <Input placeholder="..." />
              </Form.Item>
              <Form.Item
                name="descripcion"
                label="Descripcion"
                className="inpform"
                rules={[
                  { required: true, message: "Requerido" },
                  {
                    max: 500,
                    message: "Maximo 500 caracteres",
                  },
                ]}
              >
                <TextArea rows={5} placeholder="..." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="destacados"
                label="Destacados"
                className="inpform"
                rules={[
                  {
                    max: 20,
                    message: "Maximo 20 caracteres",
                  },
                ]}
              >
                <Input placeholder="..." />
              </Form.Item>

              <Form.Item
                name="describir_destacados"
                label="Describir destacados"
                className="inpform"
                rules={[
                  {
                    max: 250,
                    message: "Maximo 250 caracteres",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="..." />
              </Form.Item>
            </Col>
          </Row>
          <h4>Tipo de publicación y precios</h4>
          <Row>
            <div className="centero">
              <Form.Item
                label="Tipo de publicacion."
                name="tipoPublicacion"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Select
                  placeholder={"Seleccionar.."}
                  options={tipoPublicacionOpciones}
                  onChange={handleSelect}
                />
              </Form.Item>

              {saleOrRent === "alquiler" ? (
                <Form.Item
                  label="Precio por."
                  name="unidadPrecio"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Select
                    options={
                      saleOrRent === "alquiler"
                        ? labeltipoPublicacionOpciones.filter(
                            (p) => p.label !== "Fijo"
                          )
                        : labeltipoPublicacionOpciones
                    }
                    onChange={handleSelectTwo}
                  />
                </Form.Item>
              ) : (
                <></>
              )}

              {saleOrRent === "venta" ? (
                <Form.Item
                  label="Precio por."
                  name="unidadPrecio"
                  initialValue={"fijo"}
                  rules={
                    saleOrRent === "venta"
                      ? []
                      : [
                          {
                            required: true,
                            message: "Campo obligatorio",
                          },
                        ]
                  }
                >
                  <Select
                    options={labeltipoPublicacionOpciones}
                    defaultValue={saleOrRent === "venta" ? "Fijo" : ""}
                    value={"fijo"}
                    disabled={saleOrRent === "venta"}
                    onChange={handleSelectTwo}
                  />
                </Form.Item>
              ) : (
                <></>
              )}

              {saleOrRent !== "" ? (
                <Form.Item
                  label="Ahora, ponle el precio."
                  name="precio"
                  rules={[{ required: true, message: "Ingrese el precio" }]}
                >
                  <InputNumber
                    placeholder="$"
                    className="inputnumber"
                    size="large"
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value === null || value === void 0
                        ? void 0
                        : value.replace(/\$\s?|(,*)/g, "")
                    }
                  />
                </Form.Item>
              ) : (
                <></>
              )}
            </div>

            <Button htmlType="submit" loading={loading} block id="createbutton">
              Crear publicacion
            </Button>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

export default CreateListing;
