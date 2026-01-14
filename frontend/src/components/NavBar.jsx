import { Col, Input, Button, Avatar, Dropdown, Space, message } from "antd";
import { IoPersonCircle, IoLayers } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutSession } from "../redux/thunks/userThunk.js";
import { disconnectSocket } from "../lib/socket.jsx";

const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const menuItems = user?.user
    ? [
        {
          key: "1",
          label: <Link to="/create-listing">Publicar</Link>,
        },
        {
          key: "3",
          label: (
            <Link className="back" to="/edit_profile">
              Editar perfil
            </Link>
          ),
        },
        {
          key: "4",
          label: <Link to="/property_list">Mis propiedades</Link>,
        },
        {
          key: "45",
          label: <Link to="/my_sales">Compras / Historial</Link>,
        },

        {
          key: "25",
          label: <Link to="/trip_list">Reservas</Link>,
        },
        {
          key: "2",
          label: <Link to="/wish_list">Favoritos</Link>,
        },
      ]
    : [
        {
          key: "6",
          label: <Link to="/login">Iniciar sesion</Link>,
        },
        {
          key: "7",
          label: <Link to="/register">Registrarse</Link>,
        },
      ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutSession());

      disconnectSocket();

      message.info("Has salido de tu perfil");

      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSearch = async (value) => {
    if (value.trim()) {
      const encondedValue = encodeURIComponent(value);
      //encodeURI.. codifica la url acondicionando caractetres especiales y espacios para la busqueda
      navigate(`/search?titulo=${encondedValue}&categoria=${encondedValue}`);
    }
  };

  return (
    <div className="naza">
      <Col className="">
        <Link to="/">
          <img src="/assets/logo.png" id="logo" alt="Melos" />
        </Link>
      </Col>
      <Col className="" id="searchbar">
        <Input.Search onSearch={handleSearch} placeholder="Buscar.." />
      </Col>

      <Col className="">
        {user?.user ? (
          <div className="container_nav_user">
            <div className="">
              <Dropdown
                menu={{
                  items: menuItems,
                }}
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
                trigger={["hover"]}
              >
                <Space>
                  <div className="nav_user">
                    <h4>{user?.user?.nombre}</h4>
                    <Avatar
                      size={35}
                      styles={{
                        image: {
                          objectFit: "cover",
                        },
                      }}
                      src={user?.user?.photo?.url || "/assets/avatar.png"}
                      onError={(e) => {
                        e.currentTarget.src = "public/assets/avatar.png";
                      }}
                    />
                  </div>
                </Space>
              </Dropdown>
            </div>
            <Button size="small" danger onClick={() => handleLogout()}>
              Salir
            </Button>
          </div>
        ) : (
          <div className="nav_flex">
            <Dropdown
              menu={{
                items: menuItems,
              }}
              placement="bottomRight"
              arrow={{
                pointAtCenter: true,
              }}
              trigger={["hover"]}
            >
              <Space>
                <div id="nome">
                  <IoPersonCircle size={25} />
                  <IoLayers size={25} />
                </div>
              </Space>
            </Dropdown>
          </div>
        )}
      </Col>
    </div>
  );
};

export default NavBar;
