import {
  Col,
  Input,
  Button,
  Avatar,
  Menu,
  Dropdown,
  message,
  Space,
} from "antd";
import { IoLayers } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import React, { useEffect } from "react";
import { setLogout } from "../redux/userState.js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { clearFavo } from "../redux/favoState.js";

const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.persistedReducer.user);
  const dispatch = useDispatch();
  console.log(user);

  const menuItems = user?.user
    ? [
        {
          key: "1",
          label: (
            <a rel="noopener noreferrer" href="/create-listing">
              Publicar
            </a>
          ),
        },
        {
          key: "3",
          label: (
            <a rel="noopener noreferrer" className="back" href="/edit_profile">
              Editar perfil
            </a>
          ),
        },
        {
          key: "4",
          label: (
            <a rel="noopener noreferrer" href="/property_list">
              Mis propiedades
            </a>
          ),
        },
        {
          key: "45",
          label: (
            <a rel="noopener noreferrer" href="/my_sales">
              Compras / Historial
            </a>
          ),
        },

        {
          key: "25",
          label: (
            <a rel="noopener noreferrer" href="/trip_list">
              Reservas
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <a rel="noopener noreferrer" href="/wish_list">
              Favoritos
            </a>
          ),
        },
      ]
    : [
        {
          key: "6",
          label: (
            <a rel="noopener noreferrer" href="/login">
              Iniciar sesion
            </a>
          ),
        },
        {
          key: "7",
          label: (
            <a rel="noopener noreferrer" href="/register">
              Registrarse
            </a>
          ),
        },
      ];

  const menu = <Menu items={menuItems} />;

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/logout",
        {
          withCredentials: true, // Importante para incluir cookies
        }
      );
      if (response.status === 200) {
        message.info("Has salido de la sesion");
        dispatch(setLogout());
        dispatch(clearFavo());
        navigate("/");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSearch = async (value) => {
    if (value.trim()) {
      console.log(value);

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
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
                overlay={menu}
                trigger={["hover"]}
              >
                <Space>
                  <div className="nav_user">
                    <h4>{user?.user?.nombre}</h4>
                    <Avatar
                      size={35}
                      src={user?.user?.photo?.url || "/assets/avatar.png"}
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
          <>
            <div className="nav_flex">
              <Dropdown
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
                overlay={menu}
                trigger={["hover"]}
              >
                <Space>
                  <IoPersonCircle size={25} />
                  <IoLayers size={25} />
                </Space>
              </Dropdown>
            </div>
          </>
        )}
      </Col>
    </div>
  );
};

export default NavBar;
