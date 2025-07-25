import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { setLogin } from "../redux/userState.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Col, Input, message } from "antd";
import { syncFavosUser } from "../lib/functions.js";
import { syncUserFavo } from "../redux/favoState.js";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state?.persistedReducer?.user?.user);

  const handleLogin = async (values) => {
    console.log(values);
    const formDataToSend = new FormData();
    formDataToSend.append("email", values.email);
    formDataToSend.append("password", values.password);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        formDataToSend,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setLoading(true);
        message.success("Login exitoso!");

        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );

        //Sincronizar con bd
        const xzz = await syncFavosUser();
        if (xzz.status === 200) {
          dispatch(syncUserFavo(xzz.data.response));
        }

        await navigate("/");
      }

      setLoading(false);
    } catch (error) {
      setLoading(true);
      if (error.response || error.response.data) {
        message.error(error.response.data.message);
      }

      setLoading(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="login">
      <div className="content">
        <Form layout="vertical" form={form} onFinish={handleLogin}>
          <Col>
            <Form.Item
              name="email"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu email!",
                },
              ]}
            >
              <Input
                className="form-input"
                placeholder="Email..."
                variant="borderless"
                color="#ffffff"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="password"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu contraseña!",
                },
                {
                  max: 8,
                  message: "La contraseña debe tener maximo 8 digitos ",
                },
              ]}
            >
              <Input.Password
                className="form-input"
                placeholder="Contraseña..."
                variant="borderless"
                color="#ffffff"
                id="passwordinp"
              />
            </Form.Item>
          </Col>

          <br />
          <div className="cont_btn_isession">
            <Button
              className="btn_isession"
              size="small"
              type="outlined"
              htmlType="submit"
              loading={loading}
              id="registerbtn"
            >
              Ingresar
            </Button>
            <a href="/register">No tiene cuenta? Registrarse.</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
