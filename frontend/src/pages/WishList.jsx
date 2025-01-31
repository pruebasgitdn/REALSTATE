import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Row, Col, Pagination, message } from "antd"; // Asegúrate de importar Row y Col
import axios from "axios";
import FavoCard from "../components/FavoCard";
import { updateUser } from "../redux/state";

const WishList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  //Donde cambia la pagina por la cantidad de elementos de a 8
  const startIndex = (currentPage - 1) * pageSize;
  //del estado para mostrar por pagina cortamos desde el indice hasta indice mas 8 osea mostrar 8 elementos
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const user = useSelector((state) => state?.user?.user);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.listaDeseos?.length > 0) {
        // Resolver todas las promesas de la lista de deseos
        const responses = await Promise.all(
          user.listaDeseos.map((id) =>
            axios.get(`http://localhost:4000/api/listing/property_id/${id}`)
          )
        );
        const listingsData = responses.map((res) => res.data.listings); // Extraer las publicaciones
        setData(listingsData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching wish list:", error);
      setError("Hubo un problema al cargar la lista de deseos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    // Actualizar la lista en el frontend
    const updatedData = data.filter((item) => item._id !== id);
    setData(updatedData);

    try {
      const response = await axios.put(
        "http://localhost:4000/api/user/whishlist_add",
        { listingId: id },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedWishList = response.data.wishList;
        message.info(response.data.message);

        // await fetchList();
        dispatch(updateUser({ listaDeseos: updatedWishList }));
      }
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
      ) : error ? (
        <p>{error}</p>
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
