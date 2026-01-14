import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Spin, Row, Col, Pagination, Result, Select } from "antd";
import "../styles/TripList.css";
import TripListCard from "../components/TripListCard";

const TripList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const bookings = useSelector((state) => state?.booking.bookings);
  const loading = useSelector((state) => state?.booking.loading);
  const [order, setOrder] = useState("");

  const sortedReservations = useMemo(() => {
    const sorted = [...bookings];

    if (order === "asc") {
      sorted.sort(
        (a, b) =>
          new Date(a.booking_data.fechaInicio) -
          new Date(b.booking_data.fechaInicio)
      );
    }

    if (order === "desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.booking_data.fechaInicio) -
          new Date(a.booking_data.fechaInicio)
      );
    }

    return sorted;
  }, [bookings, order]);

  //paginacion
  const startIndex = (currentPage - 1) * pageSize;
  const currentTrips = sortedReservations.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Mis viajes</h2>
      <p className="f_normal">
        Lista de reservas (con las fechas) que has hecho
      </p>
      <hr />
      {loading && (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      )}{" "}
      {bookings?.length > 0 ? (
        <>
          <div className="gbale">
            <Select
              className="select_pplist"
              placeholder="Ordenar por"
              allowClear
              style={{ width: "180px" }}
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
          <Row gutter={[16, 16]}>
            {currentTrips.map((item) => (
              <Col key={item.publicacion._id} xs={12} md={8} lg={6}>
                <TripListCard
                  item={item.publicacion}
                  anfitrion={item.anfitrion}
                  booking_data={item.booking_data}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentTrips}
            align="center"
            pageSize={pageSize}
            total={sortedReservations.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <div className="shinny">
          <p className="">No has hecho reservas de momento.</p>
          <Result
            status="404"
            title="Sin resultados"
            subTitle="No has reservado una propiedad, por el momento."
          />
        </div>
      )}
    </div>
  );
};

export default TripList;
