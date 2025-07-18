import React, { useState, useEffect } from "react";
import "../styles/CreateListing.css";
import axios from "axios";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  FaUmbrellaBeach,
  FaBath,
  FaFireExtinguisher,
  FaRegImages,
} from "react-icons/fa";
import {
  GiModernCity,
  GiShower,
  GiIsland,
  GiCctvCamera,
  GiBoatFishing,
  GiHeatHaze,
  GiCastle,
  GiCutDiamond,
  GiKitchenTap,
  GiGasStove,
  GiBarbecue,
} from "react-icons/gi";
import {
  PiSwimmingPool,
  PiCoatHangerLight,
  PiPicnicTable,
} from "react-icons/pi";
import { RiCactusFill } from "react-icons/ri";
import { TbSnowflake, TbIroning3, TbMicrowaveFilled } from "react-icons/tb";
import { FaMountain, FaFirstAid } from "react-icons/fa";
import {
  MdOutlineCabin,
  MdSoap,
  MdSevereCold,
  MdOutlineKitchen,
} from "react-icons/md";
import { BiWorld, BiSolidWasher, BiSolidDryer } from "react-icons/bi";
import { IoTvOutline, IoWifiOutline } from "react-icons/io5";
import { IoIosHome } from "react-icons/io";
import { BsDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { FaRestroom } from "react-icons/fa6";
import { FiMinus, FiPlus } from "react-icons/fi";
import {
  labeltipoPublicacionOpciones,
  tipoPublicacionOpciones,
} from "../lib/index_constants";
import { formatPrice, parseValue } from "../lib/functions";

const CreateListing = () => {
  const navigate = useNavigate();
  const { Dragger } = Upload;
  const ButtonGroup = Button.Group;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [category, setCateogry] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [typePlace, setTypePlace] = useState("");
  const [fileList, setFileList] = useState([]);
  const formData = new FormData();
  const [bathNumber, setBathNumber] = useState(0);
  const [guestNumber, setGuestNumber] = useState(0);
  const [roomNumber, setRoomNumber] = useState(0);
  const [bedNumber, setBedNumber] = useState(0);
  const [saleOrRent, setSaleOrRent] = useState("");
  const [priceUnit, setPriceUnit] = useState("");

  const handleFileChange = ({ fileList }) => {
    // Extrae los archivos reales de cada entrada
    const files = fileList.map((file) => file.originFileObj);
    setFileList(files);
  };

  const increaseBaths = async () => {
    setBathNumber(bathNumber + 1);
  };

  const minusBaths = async () => {
    let count = bathNumber - 1;
    if (count < 0) {
      count = 0;
    }
    setBathNumber(count);
  };

  const increaseGuest = async () => {
    setGuestNumber(guestNumber + 1);
  };

  const minusGuest = async () => {
    let count = guestNumber - 1;
    if (count < 0) {
      count = 0;
    }
    setGuestNumber(count);
  };

  const increaseRoom = async () => {
    setRoomNumber(roomNumber + 1);
  };

  const minusRoom = async () => {
    let count = roomNumber - 1;
    if (count < 0) {
      count = 0;
    }
    setRoomNumber(count);
  };

  const minusBed = async () => {
    let count = bedNumber - 1;
    if (count < 0) {
      count = 0;
    }
    setBedNumber(count);
  };

  const increaseBed = async () => {
    setBedNumber(bedNumber + 1);
  };

  const onChangeCategory = async () => {
    console.log(category);
  };

  const onChangeTplace = async () => {
    console.log(typePlace);
  };

  onChangeCategory(); // categoria
  onChangeTplace(); //tipo de lugar
  useEffect(() => {
    //comodidades
    console.log("Estado actualizado:", amenities);
  }, [amenities]);

  //inputs
  const handleForm = async (values) => {
    try {
      setLoading(true);
      formData.append("categoria", category);
      formData.append("tipo", typePlace);
      formData.append("direccionCalle", values?.direccion);
      formData.append("aptoSuite", values?.apt);
      formData.append("municipio", values?.ciudad);
      formData.append("departamento", values?.departamento);
      formData.append("pais", values?.pais);
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

      //unidadprecio
      //tipoPublicacion
      if (saleOrRent === "venta") {
        setPriceUnit("fijo");
      }
      formData.append("unidadPrecio", priceUnit);
      formData.append("tipoPublicacion", saleOrRent);

      //Files
      if (!fileList || fileList.length === 0) {
        message.error("Debes subir al menos una imagen.");
        return;
      }
      if (fileList.length > 3) {
        message.error("Solo puedes subir hasta 3 imágenes.");
        return;
      }
      fileList.forEach((file) => {
        formData.append("images", file);
      });

      //Formdata
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axios.post(
        "http://localhost:4000/api/listing/createlisting",
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Publicacion creada con exito!!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      message.error("Operacion invalida");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (e) => {
    const amenityId = e.currentTarget.id;
    setAmenities((prev) => {
      if (prev.includes(amenityId)) {
        //filter me retorna los tan de la condicion
        return prev.filter((item) => item !== amenityId);
      } else {
        // Si no esta seleccionado lo agregamos
        return [...prev, amenityId];
      }
    });
  };

  const handleSelect = async (e) => {
    setSaleOrRent(e);
    console.log(e);
  };

  const handleSelectTwo = async (e) => {
    setPriceUnit(e);
    console.log(e);
  };

  return (
    <>
      <div className="center_zzz">
        <Form layout="vertical" form={form} onFinish={handleForm}>
          <h2 className="publy">Publica tú sitio.</h2>
          <Card size="small" id="card">
            <h3>Paso 1: Cuentanos sobre el sitio.</h3>
            <hr />
            <h4>Cual de estas categorías describe mejor el lugar?</h4>

            <div className="centero">
              <Row gutter={[0, 16]}>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "playa" ? "selected" : ""
                    }`}
                    id="playa"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <FaUmbrellaBeach size={30} />
                    <h5>Playa</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "ciudades" ? "selected" : ""
                    }`}
                    id="ciudades"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <GiModernCity size={30} />
                    <h5>Ciudades</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "piscina" ? "selected" : ""
                    }`}
                    id="piscina"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <PiSwimmingPool size={30} />
                    <h5>Con piscina</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "isla" ? "selected" : ""
                    }`}
                    id="isla"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <GiIsland size={30} />
                    <h5>Islas</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "lago" ? "selected" : ""
                    }`}
                    id="lago"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <GiBoatFishing size={30} />
                    <h5>Con lago</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "arido" ? "selected" : ""
                    }`}
                    id="arido"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <RiCactusFill size={30} />
                    <h5>Arido</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "helado" ? "selected" : ""
                    }`}
                    id="helado"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <TbSnowflake size={30} />
                    <h5>Helado</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "montana" ? "selected" : ""
                    }`}
                    id="montana"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <FaMountain size={30} />
                    <h5>Montaña</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "cabana" ? "selected" : ""
                    }`}
                    id="cabana"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <MdOutlineCabin size={30} />
                    <h5>Cabaña</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "vieja" ? "selected" : ""
                    }`}
                    id="vieja"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <GiCastle size={30} />
                    <h5>Antiguas</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "lujo" ? "selected" : ""
                    }`}
                    id="lujo"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <GiCutDiamond size={30} />
                    <h5>De lujo</h5>
                  </div>
                </Col>
                <Col xs={12} sm={8} md={4}>
                  <div
                    className={`iconcard ${
                      category === "todo" ? "selected" : ""
                    }`}
                    id="todo"
                    onClick={(e) => setCateogry(e.currentTarget.id)}
                  >
                    <BiWorld size={30} />
                    <h5>Todas</h5>
                  </div>
                </Col>
              </Row>
            </div>
            <h4>Que tipo de lugar van a tener los invitados?</h4>
            <Row>
              <Col xs={24}>
                <Card
                  className={`naziz ${
                    typePlace === "lugar_entero" ? "place" : "naziz"
                  }`}
                  bordered={false}
                  id="lugar_entero"
                  onClick={(e) => setTypePlace(e.currentTarget.id)}
                >
                  <h3 className={`infoplace`}>Un lugar entero</h3>
                  <div className={`infoplace`}>
                    <p>
                      Los invitados tendran un lugar entero para ellos solos.
                    </p>
                    <IoIosHome size={25} />
                  </div>
                </Card>
              </Col>
              <Col xs={24}>
                <Card
                  className={`naziz ${
                    typePlace === "habitaciones" ? "place" : "naziz"
                  }`}
                  id="habitaciones"
                  onClick={(e) => setTypePlace(e.currentTarget.id)}
                  bordered={false}
                >
                  <h3 className={`infoplace`}>Habitaciones</h3>
                  <div className={`infoplace`}>
                    <p>
                      Los invitados tendran su propia habitacion, ademas de
                      servicios adicionales compartidos.
                    </p>
                    <BsDoorOpenFill size={25} />
                  </div>
                </Card>
              </Col>
              <Col xs={24}>
                <Card
                  className={`naziz ${
                    typePlace === "habitacion_compartida" ? "place" : "naziz"
                  }`}
                  id="habitacion_compartida"
                  onClick={(e) => setTypePlace(e.currentTarget.id)}
                  bordered={false}
                >
                  <h3 className={`infoplace`}>Habitacion compartida </h3>
                  <div className={`infoplace`}>
                    <p>
                      Los invitados duermen en una misma habitacion compartida.
                    </p>
                    <FaRestroom size={25} />
                  </div>
                </Card>
              </Col>
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
                <ButtonGroup className="btngp">
                  <Button icon={<FiMinus />} onClick={() => minusGuest()} />
                  <Button icon={<FiPlus />} onClick={() => increaseGuest()} />
                </ButtonGroup>
              </Form.Item>

              <Form.Item className="inpbadge">
                <Badge count={bathNumber} className="badge">
                  Baños
                </Badge>
                <br />
                <ButtonGroup className="btngp">
                  <Button icon={<FiMinus />} onClick={() => minusBaths()} />
                  <Button icon={<FiPlus />} onClick={() => increaseBaths()} />
                </ButtonGroup>
              </Form.Item>

              <Form.Item className="inpbadge">
                <Badge count={roomNumber} className="badge">
                  Habitaciones
                </Badge>
                <br />
                <ButtonGroup className="btngp">
                  <Button icon={<FiMinus />} onClick={() => minusRoom()} />
                  <Button icon={<FiPlus />} onClick={() => increaseRoom()} />
                </ButtonGroup>
              </Form.Item>

              <Form.Item className="inpbadge">
                <Badge count={bedNumber} className="badge">
                  Camas
                </Badge>
                <br />
                <ButtonGroup className="btngp">
                  <Button icon={<FiMinus />} onClick={() => minusBed()} />
                  <Button icon={<FiPlus />} onClick={() => increaseBed()} />
                </ButtonGroup>
              </Form.Item>
            </Row>
          </Card>

          <br />
          <Card size="small" id="card">
            <h3>Paso 2: Cuentanos sobre el sitio.</h3>
            <hr />
            <h4>Diles a los invitados las comodidades que puedes ofrecer</h4>
            <Row gutter={[0, 16]}>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("baño") ? "selected" : ""
                  }`}
                  id="baño"
                  onClick={handleClick}
                >
                  <FaBath size={30} />
                  <h5>Bañera</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("hygiene") ? "selected" : ""
                  }`}
                  id="hygiene"
                  onClick={handleClick}
                >
                  <MdSoap size={30} />
                  <h5>Productos de Higiene</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("ducha") ? "selected" : ""
                  }`}
                  id="ducha"
                  onClick={handleClick}
                >
                  <GiShower size={30} />
                  <h5>Ducha al aire libre</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("lavadora") ? "selected" : ""
                  }`}
                  id="lavadora"
                  onClick={handleClick}
                >
                  <BiSolidWasher size={30} />
                  <h5>Lavadora</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("secadora") ? "selected" : ""
                  }`}
                  id="secadora"
                  onClick={handleClick}
                >
                  <BiSolidDryer size={30} />
                  <h5>Secadora</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("ganchos") ? "selected" : ""
                  }`}
                  id="ganchos"
                  onClick={handleClick}
                >
                  <PiCoatHangerLight size={30} />
                  <h5>Ganchos</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("plancha") ? "selected" : ""
                  }`}
                  id="plancha"
                  onClick={handleClick}
                >
                  <TbIroning3 size={30} />
                  <h5>Plancha</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("tv") ? "selected" : ""
                  }`}
                  id="tv"
                  onClick={handleClick}
                >
                  <IoTvOutline size={30} />
                  <h5>TV</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("workstation") ? "selected" : ""
                  }`}
                  id="workstation"
                  onClick={handleClick}
                >
                  <BsPersonWorkspace size={30} />
                  <h5>Estacion de trabajo</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("aire") ? "selected" : ""
                  }`}
                  id="aire"
                  onClick={handleClick}
                >
                  <MdSevereCold size={30} />
                  <h5>Aire Acondicionado</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("calefaccion") ? "selected" : ""
                  }`}
                  id="calefaccion"
                  onClick={handleClick}
                >
                  <GiHeatHaze size={30} />
                  <h5>Calefaccion</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("camaras") ? "selected" : ""
                  }`}
                  id="camaras"
                  onClick={handleClick}
                >
                  <GiCctvCamera size={30} />
                  <h5>Camara de Seguridad</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("extintor") ? "selected" : ""
                  }`}
                  id="extintor"
                  onClick={handleClick}
                >
                  <FaFireExtinguisher size={30} />
                  <h5>Extintor</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("asistencia_medic") ? "selected" : ""
                  }`}
                  id="asistencia_medic"
                  onClick={handleClick}
                >
                  <FaFirstAid size={30} />
                  <h5>Primeros Auxilios</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("wifi") ? "selected" : ""
                  }`}
                  id="wifi"
                  onClick={handleClick}
                >
                  <IoWifiOutline size={30} />
                  <h5>Wi-Fi</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("cocina") ? "selected" : ""
                  }`}
                  id="cocina"
                  onClick={handleClick}
                >
                  <GiKitchenTap size={30} />
                  <h5>Cocina</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("refrigerador") ? "selected" : ""
                  }`}
                  id="refrigerador"
                  onClick={handleClick}
                >
                  <MdOutlineKitchen size={30} />
                  <h5>Refrigerador</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("microondas") ? "selected" : ""
                  }`}
                  id="microondas"
                  onClick={handleClick}
                >
                  <TbMicrowaveFilled size={30} />
                  <h5>Microondas</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("estufa") ? "selected" : ""
                  }`}
                  id="estufa"
                  onClick={handleClick}
                >
                  <GiGasStove size={30} />
                  <h5>Estufa</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("barbacoa") ? "selected" : ""
                  }`}
                  id="barbacoa"
                  onClick={handleClick}
                >
                  <GiBarbecue size={30} />
                  <h5>Barbacoa</h5>
                </div>
              </Col>
              <Col xs={8} sm={6} md={4}>
                <div
                  className={`iconcard ${
                    amenities.includes("comedor") ? "selected" : ""
                  }`}
                  id="comedor"
                  onClick={handleClick}
                >
                  <PiPicnicTable size={30} />
                  <h5>Comedor al aire</h5>
                </div>
              </Col>
            </Row>

            <h4>Añade algunas fotos del lugar.</h4>
            <div className="center">
              <Dragger
                beforeUpload={() => false}
                multiple
                className="dragger_create"
                listType="picture"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
                maxCount={3}
              >
                <Button icon={<FaRegImages size={20} />} block>
                  Sube o arrastra tus fotos
                </Button>
              </Dragger>
            </div>

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
                      max: 300,
                      message: "Maximo 300 caracteres",
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
                    defaultValue={""}
                    options={tipoPublicacionOpciones}
                    onChange={handleSelect}
                  />
                </Form.Item>

                {saleOrRent === "alquiler" ? (
                  <>
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
                  </>
                ) : (
                  <></>
                )}

                {saleOrRent === "venta" ? (
                  <>
                    <Form.Item
                      label="Precio por."
                      name="unidadPrecio"
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
                        value={"Fijo"}
                        disabled={saleOrRent === "venta"}
                        onChange={handleSelectTwo}
                      />
                    </Form.Item>
                  </>
                ) : (
                  <></>
                )}

                {saleOrRent !== "" ? (
                  <>
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
                  </>
                ) : (
                  <></>
                )}
              </div>

              <Button
                htmlType="submit"
                loading={loading}
                block
                id="createbutton"
              >
                Crear publicacion
              </Button>
            </Row>
          </Card>
        </Form>
      </div>
    </>
  );
};

export default CreateListing;
