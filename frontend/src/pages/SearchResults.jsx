import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Spin, Col, Pagination } from "antd";
import SearchCardResult from "../components/SearchCardResult";

const SearchResults = () => {
  /*
    useLocation hook q me permite acceder a la ubicacion de la URL q es /search y cadena de consula => ?query=Casa(ejm) 

    location.search => ?query=Casa(ejm)

    const query = queryParams.get("query"); => devuelve el query de location => Casa
    
    */

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const titulo = queryParams.get("titulo");
  const categoria = queryParams.get("categoria");

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:4000/api/listing/search",
          {
            params: { titulo, categoria },
          }
        );

        if (response.status === 200) {
          setList(response.data.listings);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (titulo && categoria) {
      fetchList();
    }
  }, [titulo, categoria]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentReservations = list.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Propiedades</h2>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : list.length > 0 ? (
        <>
          <Row>
            {currentReservations.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <SearchCardResult
                  creadorNombre={item.creador.nombre}
                  creadorApellido={item.creador.apellido}
                  creadorFoto={item.creador.photo}
                  id={item._id}
                  categoria={item.categoria}
                  tipo={item.tipo}
                  titulo={item.titulo}
                  descripcion={item.descripcion}
                  fotos={item.fotos}
                  precio={item.precio}
                />
              </Col>
            ))}
          </Row>

          <Pagination
            current={currentPage}
            align="center"
            pageSize={pageSize}
            total={list.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <>
          <p>No se encontró nada</p>
        </>
      )}
    </div>
  );
};

export default SearchResults;
