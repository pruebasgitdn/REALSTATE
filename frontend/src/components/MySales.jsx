import React, { useEffect, useState } from "react";
import { getUserPurchases, getUserSales } from "../lib/functions";
import { Col, Row, Pagination } from "antd";
import SalesOrderCard from "./SalesOrderCard";
import SaleInfo from "./SaleInfo";

const MySales = () => {
  const [purchaseResponse, setPurchasesResponse] = useState([]);
  const [salesResponse, setSalesResponse] = useState([]);

  const [purchasePage, setPurchasePage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);

  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const itemsPerPage = 4;

  const paginatedPurchases = purchaseResponse.slice(
    (purchasePage - 1) * itemsPerPage,
    purchasePage * itemsPerPage
  );

  const paginatedSales = salesResponse.slice(
    (salesPage - 1) * itemsPerPage,
    salesPage * itemsPerPage
  );

  const handlePurchaseRquest = async () => {
    try {
      const rquest = await getUserPurchases();
      setPurchasesResponse(rquest.data.response);
      setTotalPurchases(rquest.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSalesRquest = async () => {
    try {
      const rquest = await getUserSales();
      setSalesResponse(rquest.data.response);
      setTotalSales(rquest.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlePurchaseRquest();
  }, [purchasePage]);

  useEffect(() => {
    handleSalesRquest();
  }, [salesPage]);

  return (
    <div className="">
      <Row className="chp">
        {/* Compras hechas */}
        <Col className="col" xs={24} md={12} sm={24}>
          <h2>Compras hechas</h2>
          <div className="container_prop_hx">
            {purchaseResponse.length > 0 ? (
              <>
                {paginatedPurchases.map((res) => (
                  <SalesOrderCard key={res._id} item={res} />
                ))}
              </>
            ) : (
              <p>No hay registros asociados</p>
            )}
          </div>
          <Pagination
            current={purchasePage}
            pageSize={itemsPerPage}
            total={totalPurchases}
            className="pagination"
            onChange={(page) => setPurchasePage(page)}
          />
        </Col>

        {/* Propiedades vendidas */}
        <Col className="coll" xs={24} md={12} sm={24}>
          <h2>Propiedades vendidas</h2>
          <div className="container_prop_hx">
            {salesResponse.length > 0 ? (
              <>
                {paginatedSales.map((res) => (
                  <SaleInfo key={res._id} item={res} />
                ))}
              </>
            ) : (
              <p>No hay registros asociados</p>
            )}
          </div>
          <Pagination
            current={salesPage}
            pageSize={itemsPerPage}
            total={totalSales}
            onChange={(page) => setSalesPage(page)}
            className="pagination"
          />
        </Col>
      </Row>
    </div>
  );
};

export default MySales;
