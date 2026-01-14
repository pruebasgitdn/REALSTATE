import React, { useEffect, useState } from "react";
import { sortByDate } from "../lib/functions.jsx";
import { Col, Row, Pagination, Result, Select } from "antd";
import SalesOrderCard from "./SalesOrderCard";
import SaleInfo from "./SaleInfo";
import { GiCardboardBox } from "react-icons/gi";
import {
  getUserPurchasesThunk,
  getUserSalesThunk,
} from "../redux/thunks/checkoutThunk.js";
import { useDispatch } from "react-redux";

const MySales = () => {
  const [purchaseResponse, setPurchasesResponse] = useState([]);
  const [salesResponse, setSalesResponse] = useState([]);

  const [purchasePage, setPurchasePage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);

  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [salesOrder, setSalesOrder] = useState(null);

  const itemsPerPage = 4;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserPurchasesThunk())
      .unwrap()
      .then((purchases) => {
        setPurchasesResponse(purchases.response);
        setTotalPurchases(purchases.total);
      })
      .catch(console.log);

    dispatch(getUserSalesThunk())
      .unwrap()
      .then((sales) => {
        setSalesResponse(sales.response);
        setTotalSales(sales.total);
      })
      .catch(console.log);
  }, [dispatch]);

  const sortedPurchases = sortByDate(purchaseResponse, purchaseOrder);
  const sortedSales = sortByDate(salesResponse, salesOrder);

  const paginatedPurchases = sortedPurchases?.slice(
    (purchasePage - 1) * itemsPerPage,
    purchasePage * itemsPerPage
  );

  const paginatedSales = sortedSales?.slice(
    (salesPage - 1) * itemsPerPage,
    salesPage * itemsPerPage
  );

  return (
    <div className="chp">
      <Row className="">
        {/* Compras hechas */}
        <Col className="col" xs={24} md={12} sm={24}>
          <h2>Propiedades COMPRADAS</h2>
          <div className="container_prop_hx">
            {purchaseResponse?.length > 0 ? (
              <>
                <Select
                  className="select_pplist"
                  placeholder="Ordenar por"
                  allowClear
                  style={{ width: "180px" }}
                  value={purchaseOrder || undefined}
                  onChange={(value) => {
                    setPurchaseOrder(value || null);
                    setPurchasePage(1);
                  }}
                  options={[
                    { value: "asc", label: "Fecha ascendente" },
                    { value: "desc", label: "Fecha descendente" },
                  ]}
                />

                {paginatedPurchases.map((res) => (
                  <SalesOrderCard key={res._id} item={res} />
                ))}
              </>
            ) : (
              <Result
                icon={<GiCardboardBox size={60} />}
                title="Sin resultados asociados"
                subTitle="Propiedades sin comprar"
              />
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
          <h2>Propiedades VENDIDAS</h2>
          <div className="container_prop_hx">
            {salesResponse?.length > 0 ? (
              <>
                <Select
                  className="select_pplist"
                  placeholder="Ordenar por"
                  allowClear
                  style={{ width: "180px" }}
                  value={salesOrder || undefined}
                  onChange={(value) => {
                    setSalesOrder(value || null);
                    setSalesPage(1);
                  }}
                  options={[
                    { value: "asc", label: "Fecha ascendente" },
                    { value: "desc", label: "Fecha descendente" },
                  ]}
                />

                {paginatedSales.map((res) => (
                  <SaleInfo key={res._id} item={res} />
                ))}
              </>
            ) : (
              <Result
                icon={<GiCardboardBox size={60} />}
                title="Sin resultados asociados"
                subTitle="Propiedades sin vender"
              />
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
