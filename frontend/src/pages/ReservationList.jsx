import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Spin, Row, Col, Pagination, Result, Select } from "antd";
import ReservationCard from "../components/ReservationCard";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../env.js";

const ReservationList = () => {
  const [loading, setLoading] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [order, setOrder] = useState("");
  const navigate = useNavigate();

  const feedList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/listing/my_reservations`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData(response.data.reservations);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(data);

  useEffect(() => {
    feedList();
  }, []);

  const formatFecha = (fecha) => {
    return new Date(fecha).toISOString().split("T")[0];
  };

  const sortedReservations = useMemo(() => {
    const sorted = [...data];

    if (order === "asc") {
      sorted.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    }

    if (order === "desc") {
      sorted.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
    }

    return sorted;
  }, [data, order]);

  // Paginacion
  const startIndex = (currentPage - 1) * pageSize;
  const currentReservations = sortedReservations.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Reservas en mis propiedades</h2>
      <p className="f_normal">
        Reservas de otros usuarios en nuestras propiedades habilitadas para el
        alquiler
      </p>
      <div className="napoli">
        <FaArrowAltCircleLeft
          className="hover"
          size={22}
          title="Voler"
          color="rgb(0, 0, 0)"
          onClick={() => {
            navigate("/property_list");
          }}
        />
      </div>
      <hr />
      {loading ? (
        <div>
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        </div>
      ) : data.length > 0 ? (
        <>
          <div className="gbale">
            <Select
              className="select_pplist"
              placeholder="Ordenar por"
              allowClear
              style={{ width: "180px" }}
              value={order || undefined}
              onChange={(value) => {
                setOrder(value || "");
                setCurrentPage(1);
              }}
              options={[
                {
                  value: "asc",
                  label: "Fecha ascendente",
                },
                {
                  value: "desc",
                  label: "Fecha descendente",
                },
              ]}
            />
          </div>
          <Row justify="start" gutter={[16, 16]}>
            {currentReservations.map((info, index) => (
              <Col key={index} xs={12} md={8} lg={6}>
                <ReservationCard
                  id={info.publicacionId._id}
                  fotos={info.publicacionId.fotos}
                  fechaInicio={formatFecha(info.fechaInicio)}
                  fechaFin={formatFecha(info.fechaFin)}
                  pais={info.publicacionId.pais}
                  departamento={info.publicacionId.departamento}
                  municipio={info.publicacionId.municipio}
                  clienteNombre={info.clienteId.nombre}
                  clienteApellido={info.clienteId.apellido}
                  clienteFoto={info.clienteId.photo}
                  clienteID={info.clienteId._id}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            align="center"
            pageSize={pageSize}
            total={sortedReservations.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <div className="shinny">
          <p className="f_normal">
            No se econtraron reservas en tus propiedades
          </p>
          <Result
            status="404"
            title="Sin resultados"
            subTitle="No hay resultados de la busqueda."
          />
        </div>
      )}
    </div>
  );
};

export default ReservationList;
