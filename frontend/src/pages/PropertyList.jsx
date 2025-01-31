import { Spin, Row, Col, Select, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard.jsx";
import "../styles/TripList.css";

const PropertyList = () => {
  const [loading, setLoading] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("habilitado");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const fetchList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:4000/api/listing/mylistings",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setPropertyList(response.data.listings);
        console.log(response.data.listings);
      }
    } catch (error) {
      console.log(error);
      setError("No se encontraron publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  //FIltar por estado
  const filteredProperties = propertyList.filter(
    (item) => item.estado === status
  );

  //total items por pagina
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Lista de Propiedades</h2>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : error ? (
        <p>{error}</p>
      ) : filteredProperties.length > 0 ? (
        <>
          <Select
            className="select_pplist"
            placeholder="Estado"
            onChange={(value) => setStatus(value)}
            defaultValue={"habilitado"}
            options={[
              {
                value: "habilitado",
                label: "Habilitada",
              },
              {
                value: "inhabilitado",
                label: "Inhabilitada",
              },
            ]}
          />
          <Row gutter={[16, 16]}>
            {paginatedProperties.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <PropertyCard
                  id={item._id}
                  fotos={item.fotos}
                  departamento={item.departamento}
                  municipio={item.municipio}
                  categoria={item.categoria}
                  pais={item.pais}
                  tipo={item.tipo}
                  precio={item.precio}
                  estado={item.estado}
                  refreshList={fetchList}
                />
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
          <Select
            className="select_pplist"
            placeholder="Estado"
            onChange={(value) => setStatus(value)}
            defaultValue={"habilitado"}
            options={[
              {
                value: "habilitado",
                label: "Habilitada",
              },
              {
                value: "inhabilitado",
                label: "Inhabilitada",
              },
            ]}
          />
          <p>No se encontraron publicaciones.</p>
        </>
      )}
    </div>
  );
};

export default PropertyList;
