import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Row, Col, Pagination, message } from "antd";
import FavoCard from "../components/FavoCard";
import { getUserFavoListing, handleRemoveFavo } from "../lib/functions.js";
import { removeFromFavo } from "../redux/favoState.js";

const WishList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  //Donde cambia la pagina por la cantidad de elementos de a 8
  const startIndex = (currentPage - 1) * pageSize;
  //del estado para mostrar por pagina cortamos desde el indice hasta indice mas 8 osea mostrar 8 elementos
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const user = useSelector((state) => state?.persistedReducer?.user?.user);

  const fetchList = async () => {
    try {
      setLoading(true);
      const rr_try = await getUserFavoListing();
      // setRquest(rr_try.data.response);
      const extractedPublicaciones = rr_try.data.response.map(
        (item) => item.publicacionId
      );
      console.log(rr_try);
      setData(extractedPublicaciones);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    // Actualizar la lista en el frontend
    const updatedData = data.filter((item) => item._id !== id);
    setData(updatedData);

    try {
      dispatch(removeFromFavo(id));
      await handleRemoveFavo({
        listingID: id,
        clientID: user._id,
      });
      message.info("Se removió de favoritos");
    } catch (error) {
      console.log(error);
      message.error("Error");
    } finally {
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Lista de Favoritos</h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : data.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {currentData.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
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
                  handleRemove={handleRemove}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            align="center"
            pageSize={pageSize}
            total={data.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <p style={{ textAlign: "center" }}>
          No hay publicaciones en tu lista de deseos.
        </p>
      )}
    </div>
  );
};

export default WishList;
