import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserInfoCard from "../components/UserInfoCard";
import {
  Col,
  Select,
  Input,
  message,
  Pagination,
  Row,
  Spin,
  Result,
} from "antd";
import UserPropertysCard from "../components/UserPropertysCard";
import { getUserByIdThunk } from "../redux/thunks/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { getUserListingsByIdThunk } from "../redux/thunks/listingThunk";
import { FaHouseUser } from "react-icons/fa";
import { getSocket, subscribeSocketNewMessageEvent } from "../lib/socket.jsx";

const UserPage = () => {
  const { id } = useParams();

  //estados
  const [userInfo, setUserInfo] = useState([""]);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kindaListing, setKindaListing] = useState("");

  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const filteredProperties = userListings.filter((item) => {
    // filtro  select
    const matchesKind = !kindaListing || item.tipoPublicacion === kindaListing;

    // filtro  input
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      item.departamento?.toLowerCase().includes(search) ||
      item.municipio?.toLowerCase().includes(search) ||
      item.pais?.toLowerCase().includes(search) ||
      item.categoria?.toLowerCase().includes(search) ||
      item.titulo?.toLowerCase().includes(search);

    return matchesKind && matchesSearch;
  });

  const paginatedListings = filteredProperties.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await dispatch(getUserByIdThunk(id)).unwrap();
        setUserInfo(response);
      } catch (error) {
        console.error(error);
        message.error(error?.message || "No se pudo obtener la informacion");
      }
    };

    const fetchUserListings = async () => {
      try {
        setLoading(true);

        const response = await dispatch(getUserListingsByIdThunk(id)).unwrap();

        console.log(response);

        setUserListings(response);
      } catch (error) {
        message.error(error?.message || "No se pudo obtener la informacion");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
    fetchUserListings();
  }, [id, dispatch]);

  if (user) {
    getSocket();
    subscribeSocketNewMessageEvent(dispatch, userInfo);
  }

  if (loading) {
    return (
      <div className="center_div">
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      </div>
    );
  }

  return (
    <div className="container_tplist">
      <h2>Informacion del Usuario</h2>
      <div>
        <Col xs={24} md={24} lg={24}>
          <UserInfoCard
            nombre={userInfo.nombre}
            id={userInfo._id}
            apellido={userInfo.apellido}
            email={userInfo.email}
            photo={userInfo.photo}
          />
        </Col>
        <hr />
        {filteredProperties && filteredProperties.length > 0 ? (
          <>
            <div className="gbale">
              <div className="flex_center">
                <h2 className="text_start f_normal">Propiedades</h2>
                <FaHouseUser size={20} color="#06a006ff" />
              </div>

              <h4>Buscar por</h4>
              <Select
                style={{ width: 150 }}
                defaultValue={"Tipo de publicacion"}
                allowClear
                value={kindaListing || ""}
                onChange={(value) => {
                  setKindaListing(value);
                  setCurrentPage(1);
                }}
              >
                <Select.Option value="venta">VENTA</Select.Option>
                <Select.Option value="alquiler">ALQUILER</Select.Option>
              </Select>
              <Input.Search
                className="gfen"
                placeholder="Buscar..."
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <hr />
            <Row justify="start" gutter={[16, 16]}>
              {paginatedListings.map((mp) => (
                <Col xs={12} md={8} lg={6} key={mp._id}>
                  <UserPropertysCard item={mp} />
                </Col>
              ))}
            </Row>

            <Pagination
              current={currentPage}
              align="center"
              pageSize={pageSize}
              total={filteredProperties.length}
              onChange={(page) => setCurrentPage(page)}
              className="pagination"
            />
          </>
        ) : (
          <>
            <div className="gbale">
              <Select
                style={{ width: 150 }}
                defaultValue={"Tipo de publicacion"}
                allowClear
                value={kindaListing || ""}
                onChange={(value) => {
                  setKindaListing(value);
                  setCurrentPage(1);
                }}
              >
                <Option value="venta">VENTA</Option>
                <Option value="alquiler">ALQUILER</Option>
              </Select>
              <Input.Search
                className="gfen"
                placeholder="Buscar..."
                allowClear
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Result
              status="404"
              title="Sin resultados"
              subTitle={`El usuario ${userInfo.email} no tiene propiedades publicadas por el momento`}
            />
            {paginatedListings.length === 0 ||
              filteredProperties.length === 0 ||
              (userListings.length === 0 && (
                <Result
                  status="404"
                  title="Sin resultados"
                  subTitle={`El usuario ${userInfo.email} no tiene propiedades publicadas por el momento`}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
