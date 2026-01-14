import { Spin, Row, Col, Select, Pagination, Result, Input } from "antd";
import { useState } from "react";
import PropertyCard from "../components/PropertyCard.jsx";
import "../styles/TripList.css";
import { useSelector } from "react-redux";
import { CiSquareRemove } from "react-icons/ci";

const PropertyList = () => {
  const [status, setStatus] = useState("habilitado");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");

  const my_listings = useSelector((state) => state.listings.my_listings) || [];
  const loading = useSelector((state) => state.listings.loading);

  const filteredProperties = my_listings.filter((item) => {
    const matchesStatus = item.estado === status;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      item.departamento?.toLowerCase().includes(search) ||
      item.municipio?.toLowerCase().includes(search) ||
      item.pais?.toLowerCase().includes(search) ||
      item.categoria?.toLowerCase().includes(search) ||
      item.titulo?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  //total items por pagina
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container_tplist">
      <h2 className="tptitle">Lista de Propiedades</h2>
      <p className="f_normal">Propiedades que has publicado en el sitio web</p>
      {loading && (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      )}
      {filteredProperties.length > 0 ? (
        <>
          <div className="flex_center">
            <div className="napoli">
              <Select
                className="select_pplist"
                placeholder="Estado"
                onChange={(value) => setStatus(value)}
                defaultValue={"habilitado"}
                options={[
                  {
                    value: "habilitado",
                    label: "Habilitada",
                  },
                  {
                    value: "inhabilitado",
                    label: "Inhabilitada",
                  },
                ]}
              />
              <Input.Search
                className="gfen"
                placeholder="Buscar..."
                allowClear
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <CiSquareRemove
                color="#CF0808"
                size={25}
                className="hover"
                title="Remover filtro"
                onClick={() => setSearchTerm("")}
              />
            </div>
            <div>
              <a href="/reservation_list">Reservas en mis propiedades.</a>
            </div>
          </div>
          <hr />
          <p className="text_start f_normal">Total: {my_listings?.length} </p>
          <hr />
          <Row gutter={[16, 16]}>
            {paginatedProperties.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <PropertyCard
                  id={item._id}
                  fotos={item.fotos}
                  departamento={item.departamento}
                  municipio={item.municipio}
                  categoria={item.categoria}
                  pais={item.pais}
                  tipo={item.tipo}
                  precio={item.precio}
                  estado={item.estado}
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
            total={filteredProperties.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </>
      ) : (
        <>
          <div className="napoli">
            <Select
              className="select_pplist"
              placeholder="Estado"
              onChange={(value) => setStatus(value)}
              options={[
                {
                  value: "habilitado",
                  label: "Habilitada",
                },
                {
                  value: "inhabilitado",
                  label: "Inhabilitada",
                },
              ]}
            />
            <Input.Search
              className="gfen"
              placeholder="Buscar..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <CiSquareRemove
              color="#CF0808"
              className="hover"
              title="Remover filtro"
              size={25}
              onClick={() => setSearchTerm("")}
            />
          </div>

          <hr />

          <div className="shinny">
            <p>
              No se encontraron publicaciones. Si tienes alguna propiedad
              publicala.{" "}
              <a href="/create-listing" id="gordona">
                Publicar algo
              </a>
            </p>

            <div className="center_div">
              <Result
                status="404"
                title="Sin resultados"
                subTitle="No hay resultados de la busqueda."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyList;
