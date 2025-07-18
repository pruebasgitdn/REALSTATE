import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Row,
  Spin,
  Col,
  Pagination,
  Result,
  Button,
  Select,
  Slider,
  message,
} from "antd";
import SearchCardResult from "../components/SearchCardResult";

const SearchResults = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [precioFiltro, setPrecioFiltro] = useState([0, 1500000000]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const titulo = queryParams.get("titulo");
  const categoria = queryParams.get("categoria");

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

  const applyFilters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/listing/filter",
        {
          params: {
            titulo,
            categoria,
            tipo: tipoFiltro,
            minPrice: precioFiltro[0],
            maxPrice: precioFiltro[1],
          },
        }
      );

      if (response.status === 200) {
        setList(response.data.listings);
        message.success("Filtros aplicados");
        setCurrentPage(1);
      } else if (response.success === false) {
        message.info("No se encontraron resultados aplicados");
      }
    } catch (error) {
      console.log(error);
      message.error("Error aplicando filtros o sin resultados");
    } finally {
      setLoading(false);
    }
  };

  const quitFilters = async () => {
    setLoading(true);
    try {
      setTipoFiltro(null);
      setPrecioFiltro([0, 1500000000]);

      const response = await axios.get(
        "http://localhost:4000/api/listing/filter"
      );

      if (response.data.success) {
        setList(response.data.listings);
        message.success("Se eliminaron los filtros");
        setCurrentPage(1);
      } else {
        setList([]);
        message.info(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error al quitar los filtros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (titulo && categoria) {
      fetchList();
    }
  }, [titulo, categoria]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentReservations = list.slice(startIndex, startIndex + pageSize);

  const { Option } = Select;

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Propiedades</h2>

      <div
        className="vivp"
        style={{ marginBottom: 20, gap: 16, display: "flex", flexWrap: "wrap" }}
      >
        <Select
          style={{ width: 180 }}
          placeholder="Tipo de publicación"
          allowClear
          onChange={(value) => setTipoFiltro(value)}
        >
          <Option value="alquiler">Alquiler</Option>
          <Option value="venta">Venta</Option>
        </Select>

        <div style={{ width: 300 }}>
          <span style={{ marginBottom: 8, display: "block" }}>
            Rango de precios
          </span>
          <Slider
            range
            min={0}
            max={1500000000}
            step={50000}
            value={precioFiltro}
            onChange={(value) => setPrecioFiltro(value)}
            tooltip={{
              formatter: (val) => `$${val.toLocaleString("es-CO")}`,
            }}
          />
        </div>

        <Button
          color="default"
          value="small"
          variant="solid"
          onClick={applyFilters}
        >
          Aplicar filtros
        </Button>
        <Button
          color="danger"
          value="small"
          variant="solid"
          onClick={quitFilters}
        >
          Eliminar filtros
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : list.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
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
        <Result
          status="404"
          title="Sin resultados"
          subTitle="Lo siento, no se encontró nada"
          extra={
            <Button type="primary" href="/">
              Inicio
            </Button>
          }
        />
      )}
    </div>
  );
};

export default SearchResults;
