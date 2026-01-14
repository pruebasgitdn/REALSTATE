import { useEffect, useState } from "react";
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
import { AiOutlineGlobal } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "./ListingCard.jsx";
import {
  getAllListingsThunk,
  getListingsByCategorie,
} from "../redux/thunks/listingThunk.js";

const Listings = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("todo");
  const navigate = useNavigate();

  const listings = useSelector((state) => state.listings?.listings) || [];
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.listings?.loading);

  const feedListings = async () => {
    try {
      if (category === "todo") {
        dispatch(getAllListingsThunk());
      } else {
        dispatch(getListingsByCategorie(category));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    feedListings();
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
      <Carousel arrows className="werma">
        <div>
          <div className="slide_listing">
            <button
              className={`iconcardlist ${
                category === "isla" ? "selectedcategory" : ""
              }`}
              id="isla"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <GiIsland size={30} />
              <h5>Islas</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "lago" ? "selectedcategory" : ""
              }`}
              id="lago"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <GiBoatFishing size={30} />
              <h5>Lago</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "arido" ? "selectedcategory" : ""
              }`}
              id="arido"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <RiCactusFill size={30} />
              <h5>Arido</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "piscina" ? "selectedcategory" : ""
              }`}
              id="piscina"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <PiSwimmingPool size={30} />
              <h5>Piscina</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "playa" ? "selectedcategory" : ""
              }`}
              id="playa"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <FaUmbrellaBeach size={30} />
              <h5>Playa</h5>
            </button>
            <button
              className={`iconcardlist ${
                category === "ciudades" ? "selectedcategory" : ""
              }`}
              id="ciudades"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <GiModernCity size={30} />
              <h5>Ciudades</h5>
            </button>
          </div>
        </div>

        <div>
          <div className="slide_listing">
            <button
              className={`iconcardlist ${
                category === "helado" ? "selectedcategory" : ""
              }`}
              id="helado"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <TbSnowflake size={30} />
              <h5>Helado</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "vieja" ? "selectedcategory" : ""
              }`}
              id="vieja"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <GiCastle size={30} />
              <h5>Antiguas</h5>
            </button>
            <button
              className={`iconcardlist ${
                category === "lujo" ? "selectedcategory" : ""
              }`}
              id="lujo"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <GiCutDiamond size={30} />
              <h5>De lujo</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "montana" ? "selectedcategory" : ""
              }`}
              id="montana"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <FaMountain size={30} />
              <h5>Montaña</h5>
            </button>
            <button
              className={`iconcardlist ${
                category === "cabana" ? "selectedcategory" : ""
              }`}
              id="cabana"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <MdOutlineCabin size={30} />
              <h5>Cabaña</h5>
            </button>

            <button
              className={`iconcardlist ${
                category === "todo" ? "selectedcategory" : ""
              }`}
              id="todo"
              onClick={(e) => setCategory(e.currentTarget.id)}
            >
              <BiWorld size={30} />
              <h5>Todas</h5>
            </button>
          </div>
        </div>
      </Carousel>

      {loading && (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      )}

      {listings?.length > 0 ? (
        <div className="ctlist">
          <Row gutter={[16, 16]} justify="center">
            {listings.slice(0, 3).map((nn) => (
              <Col key={nn._id}>
                <ListingCard listing={nn} />
              </Col>
            ))}
          </Row>

          <div className="container_bvmas">
            <Button
              className="btn_vmas"
              size="medium"
              type="outlined"
              icon={<AiOutlineGlobal size={20} />}
              iconPlacement="end"
              onClick={() => {
                navigate("/search", { state: { clearFilters: true } });
              }}
            >
              Ver todas.
            </Button>
          </div>

          <br />
        </div>
      ) : (
        <>
          <p className="no_publys">
            No hay publicaciones disponibles. Sé el primero en
          </p>{" "}
          <Button
            onClick={() => {
              if (!user || user == null) {
                navigate("/login");
              } else {
                navigate("/create-listing");
              }
            }}
            className="lacobra"
            role="button"
          >
            Publicar algo.
          </Button>
        </>
      )}
    </div>
  );
};

export default Listings;
