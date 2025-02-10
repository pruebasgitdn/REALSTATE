import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Row, Col, Pagination } from "antd";
import ReservationCard from "../components/ReservationCard";

const ReservationList = () => {
  const [loading, setLoading] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const feedList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://realstate-g3bo.onrender.com/api/listing/my_reservations",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData(response.data.reservations);
        console.log(response.data.reservations);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    feedList();
  }, []);

  const formatFecha = (fecha) => {
    return new Date(fecha).toISOString().split("T")[0];
  };

  // Paginación en el frontend
  const startIndex = (currentPage - 1) * pageSize;
  const currentReservations = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Reservas</h2>
      {loading ? (
        <div>
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        </div>
      ) : data.length > 0 ? (
        <>
          <Row>
            {currentReservations.map((info, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <ReservationCard
                  id={info.publicacionId._id}
                  categoria={info.publicacionId.categoria}
                  fotos={info.publicacionId.fotos}
                  fechaInicio={formatFecha(info.fechaInicio)}
                  fechaFin={formatFecha(info.fechaFin)}
                  precioTotal={info.precioTotal}
                  pais={info.publicacionId.pais}
                  departamento={info.publicacionId.departamento}
                  municipio={info.publicacionId.municipio}
                  clienteNombre={info.clienteId.nombre}
                  clienteApellido={info.clienteId.apellido}
                  clienteFoto={info.clienteId.photo}
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
        <>
          <p>No se encontraron agendas en tus publicaciones</p>
        </>
      )}
    </div>
  );
};

export default ReservationList;
