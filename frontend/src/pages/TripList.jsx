import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTripList, updateUser } from "../redux/state";
import { Spin, List, Row, Col, Pagination } from "antd";
import "../styles/TripList.css";
import TripListCard from "../components/TripListCard";

const TripList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [ss, setSs] = useState([]);

  const triplist = useSelector((state) => state?.user?.user?.listaViajes) || [];

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://realstate-g3bo.onrender.com/api/booking/triplist",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data.success);
        console.log(response.data.total);
        // dispatch(setTripList(response.data.data));
        // dispatch(updateUser({ listaViajes: response.data.data }));
        setSs(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  console.log(triplist);

  const formatFecha = (fecha) => {
    return new Date(fecha).toISOString().split("T")[0];
  };

  //Donde cambia la pagina por la cantidad de elementos de a 8
  const startIndex = (currentPage - 1) * pageSize;
  //del estado para mostrar por pagina cortamos desde el indice hasta indice mas 8 osea mostrar 8 elementos
  const currentTrips = ss.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Mis viajes</h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : ss.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {currentTrips.map((trip, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <TripListCard
                  id={trip.publicacionId._id}
                  categoria={trip.publicacionId.categoria}
                  tipo={trip.publicacionId.tipo}
                  direccionCalle={trip.publicacionId.direccionCalle}
                  fotos={trip.publicacionId.fotos}
                  fechaInicio={formatFecha(trip.fechaInicio)}
                  fechaFin={formatFecha(trip.fechaFin)}
                  precioTotal={trip.precioTotal}
                  pais={trip.publicacionId.pais}
                  departamento={trip.publicacionId.departamento}
                  municipio={trip.publicacionId.municipio}
                  anfitrionNombre={trip.anfitrionId.nombre}
                  anfitrionApellido={trip.anfitrionId.apellido}
                  anfitrionFoto={trip.anfitrionId.photo}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            align="center"
            pageSize={pageSize}
            total={ss.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <p>No hay viajes disponibles.</p>
      )}
    </div>
  );
};

export default TripList;
