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
import { API_BASE_URL } from "../env.js";

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

  useEffect(() => {
    if (location.state?.clearFilters) {
      quitFilters();

      globalThis.history.replaceState({}, document.title); // limpiar  estado
    }
  }, [location.state]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}
/api/listing/search`,
        {
          params: { titulo, categoria },
        }
      );

      if (response.status === 200) {
        let filteredData = [];
        filteredData = response.data.listings;

        filteredData = filteredData.filter(
          (listing) => listing.estado === "habilitado"
        );

        setList(filteredData);
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
        `${API_BASE_URL}
/api/listing/filter`,
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
        let filteredData = [];
        filteredData = response.data.listings;

        filteredData = filteredData.filter(
          (listing) => listing.estado === "habilitado"
        );

        setList(filteredData);
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

      const response = await axios.get(`${API_BASE_URL}/api/listing/filter`);

      if (response.data.success || response.status === 200) {
        let filteredData = [];
        filteredData = response.data.listings;

        filteredData = filteredData.filter(
          (listing) => listing.estado === "habilitado"
        );

        setList(filteredData);

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

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Lista de propiedades</h2>
      <hr />
      <div
        className="vivp"
        style={{
          marginBottom: 20,
          gap: 15,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
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
          color="green"
          value="small"
          size="small"
          variant="solid"
          onClick={applyFilters}
        >
          Aplicar filtros
        </Button>
        <Button
          color="danger"
          value="small"
          size="small"
          variant="solid"
          onClick={quitFilters}
        >
          Eliminar filtros
        </Button>
      </div>
      <hr />

      {list?.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {currentReservations.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <SearchCardResult
                  creadorNombre={item.creador.nombre}
                  creadorApellido={item.creador.apellido}
                  creadorFoto={item.creador.photo}
                  creadorID={item.creador._id}
                  id={item._id}
                  categoria={item.categoria}
                  tipo={item.tipo}
                  municipio={item.municipio}
                  departamento={item.departamento}
                  pais={item.pais}
                  titulo={item.titulo}
                  descripcion={item.descripcion}
                  fotos={item.fotos}
                  precio={item.precio}
                  tipoPublicacion={item.tipoPublicacion}
                  unidadPrecio={item.unidadPrecio}
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
