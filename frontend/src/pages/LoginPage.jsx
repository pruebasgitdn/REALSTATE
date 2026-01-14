import React, { useEffect } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Col, Input, message } from "antd";
import { initSession } from "../redux/thunks/userThunk.js";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user);
  const loading = useSelector((state) => state?.user?.loading);

  const handleLogin = async (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append("email", values.email);
    formDataToSend.append("password", values.password);

    try {
      await dispatch(initSession(formDataToSend)).unwrap();

      //una vez isAuth true el App connecta el sockeThunk y ya esta global melo
      message.success("Inicio de sesion exitoso");
      await navigate("/");
    } catch (error) {
      console.log(error);
      message.error(String(error?.message) || "Credenciales incorrectass");
    }
  };

  useEffect(() => {
    if (user?._id || user !== null) {
      navigate("/");
    }
  }, [navigate, user]);

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
                  max: 10,
                  message: "La contraseña debe tener maximo 10 digitos ",
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
