import React, { useEffect, useState } from "react";
import { Col, Row, Carousel, Spin, Button } from "antd";
import "../styles/Listing.css";
import {
  GiModernCity,
  GiIsland,
  GiBoatFishing,
  GiCastle,
  GiCutDiamond,
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { PiSwimmingPool } from "react-icons/pi";
import { FaMountain, FaUmbrellaBeach } from "react-icons/fa";
import { RiCactusFill } from "react-icons/ri";
import { TbSnowflake } from "react-icons/tb";
import { BiWorld } from "react-icons/bi";
import { MdOutlineCabin } from "react-icons/md";
import axios from "axios";
import { AiOutlineGlobal } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/userState.js";
import ListingCard from "./ListingCard.jsx";

const Listings = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("todo");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const listings =
    useSelector((state) => state.persistedReducer.user?.listings) || []; //estdo global

  const onChangeCategory = async () => {
    console.log(category);
  };
  onChangeCategory();

  const feedListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        category !== "todo"
          ? ` http://localhost:4000/api/listing/propertys/${category}`
          : `http://localhost:4000/api/listing/propertys`,

        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(response.data);

        const filteredData = response.data.listings.filter(
          (listing) => listing.estado === "habilitado"
        );

        dispatch(setListings(filteredData));
      }
    } catch (error) {
      console.log(error);
      dispatch(setListings([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    feedListings();
    console.log(listings);
  }, [category]);

  return (
    <div className="listings">
      <div>
        <h2 className="title">Explora algunas de las categorías</h2>
        <hr className="hr" />
        <p>
          Diversifica tus gustos y planea una estadaía en alguno de estos
          lugares
        </p>
      </div>

      <Row>
        <Col xs={12} sm={8}>
          <div className="imgcontain">
            <div id="l1">Grandes ciudades</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="imgcontain">
            <div id="l2">Costeras</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="imgcontain">
            <div id="l3">Piscina</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="imgcontain">
            <div id="l4">Rurales</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="imgcontain">
            <div id="l5">Cabañas</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="imgcontain">
            <div id="l1">Todo</div>
          </div>
        </Col>
      </Row>
      <br />
      <Carousel arrows adaptiveHeight className="werma">
        <div id="caroua">
          <Row>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "isla" ? "selectedcategory" : ""
                }`}
                id="isla"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <GiIsland size={30} />
                <h5>Islas</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "lago" ? "selectedcategory" : ""
                }`}
                id="lago"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <GiBoatFishing size={30} id="iconardo" />
                <h5>Lago</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "arido" ? "selectedcategory" : ""
                }`}
                id="arido"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <RiCactusFill size={30} id="iconardo" />
                <h5>Arido</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "piscina" ? "selectedcategory" : ""
                }`}
                id="piscina"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <PiSwimmingPool size={30} id="iconardo" />
                <h5>Piscina</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "playa" ? "selectedcategory" : ""
                }`}
                id="playa"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <FaUmbrellaBeach size={30} id="iconardo" />
                <h5>Playa</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "ciudades" ? "selectedcategory" : ""
                }`}
                id="ciudades"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <GiModernCity size={30} id="iconardo" />
                <h5>Ciudades</h5>
              </div>
            </Col>
          </Row>
        </div>

        {/* ssssssssssssss */}
        <div id="caroua">
          <Row>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "helado" ? "selectedcategory" : ""
                }`}
                id="helado"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <TbSnowflake size={30} id="iconardo" />
                <h5>Helado</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "vieja" ? "selectedcategory" : ""
                }`}
                id="vieja"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <GiCastle size={30} id="iconardo" />
                <h5>Antiguas</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "lujo" ? "selectedcategory" : ""
                }`}
                id="lujo"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <GiCutDiamond size={30} id="iconardo" />
                <h5>De lujo</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "montana" ? "selectedcategory" : ""
                }`}
                id="montana"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <FaMountain size={30} id="iconardo" />
                <h5>Montaña</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "cabana" ? "selectedcategory" : ""
                }`}
                id="cabana"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <MdOutlineCabin size={30} id="iconardo" />
                <h5>Cabaña</h5>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div
                className={`iconcardlist ${
                  category === "todo" ? "selectedcategory" : ""
                }`}
                id="todo"
                onClick={(e) => setCategory(e.currentTarget.id)}
              >
                <BiWorld size={30} id="iconardo" />
                <h5>Todas</h5>
              </div>
            </Col>
          </Row>
        </div>
      </Carousel>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : listings?.length > 0 ? (
        <div className="ctlist">
          <br />

          <Row gutter={[16, 16]} justify="center" className="container_bvmas">
            {listings.slice(0, 3).map((nn) => (
              <Col key={nn._id} xs={24} sm={12} md={8}>
                <ListingCard
                  id={nn._id}
                  nombrecreador={nn.creador.nombre}
                  apellidocreador={nn.creador.apellido}
                  categoria={nn.categoria}
                  tipo={nn.tipo}
                  titulo={nn.titulo}
                  fotos={nn.fotos}
                  tipoPublicacion={nn.tipoPublicacion}
                />
              </Col>
            ))}
          </Row>
          <br />

          <div className="container_bvmas">
            <Button
              className="btn_vmas"
              size="medium"
              type="outlined"
              icon={<AiOutlineGlobal size={20} />}
              iconPosition="end"
            >
              Ver todas.
            </Button>
          </div>

          <br />
        </div>
      ) : (
        <p className="no_publys">No hay publicaciones disponibles.</p>
      )}
    </div>
  );
};

export default Listings;
