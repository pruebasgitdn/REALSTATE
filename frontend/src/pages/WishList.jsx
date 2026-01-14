import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Spin, Row, Col, Pagination, Result } from "antd";
import FavoCard from "../components/FavoCard";

const WishList = () => {
  const favorites = useSelector((state) => state?.favorites?.favorites);
  const loading = useSelector((state) => state?.favorites?.loading);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const ppp = favorites.map((fav) => fav.publicacionId);

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = ppp.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Lista de Favoritos</h2>
      <p className="f_normal">
        Publicaciones que has añadido a favoritos o que consideras que te gustan
      </p>
      <hr />
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : ppp.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {currentData.map((item) => (
              <Col key={item._id} xs={12} md={8} lg={6}>
                <FavoCard
                  id={item._id}
                  fotos={item.fotos}
                  departamento={item.departamento}
                  municipio={item.municipio}
                  categoria={item.categoria}
                  pais={item.pais}
                  tipo={item.tipo}
                  precio={item.precio}
                  direccionCalle={item.direccionCalle}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            align="center"
            pageSize={pageSize}
            total={ppp.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <div className="shinny">
          <p>No se han encontrado registros.</p>
          <Result
            status="404"
            title="Sin favoritos"
            subTitle="No tienes favoritos, por el momento."
          />
        </div>
      )}
    </div>
  );
};

export default WishList;
