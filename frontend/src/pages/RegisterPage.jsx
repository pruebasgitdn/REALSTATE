import React, { useState } from "react";
import "../App.css";
import { HiCloudArrowUp } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Button, Upload, message, Form, Input, Col, Avatar } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { registerUserThunk } from "../redux/thunks/userThunk";
import { useDispatch } from "react-redux";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const { Dragger } = Upload;

  const handlePasswordChange = () => {
    const password = form.getFieldValue("password");
    const confirmPassword = form.getFieldValue("password_confirm");
    setPasswordMatch(password === confirmPassword);
  };

  const itemRender = () => {
    if (!formData.photo) return null;

    return (
      <div className="containerimg">
        <Avatar size={80} src={URL.createObjectURL(formData.photo)}></Avatar>
        <Button
          size="medium"
          danger
          onClick={() => {
            setFormData({ ...formData, photo: null });
            setPhoto(null);
          }}
          icon={<AiFillDelete size={20} />}
        />
      </div>
    );
  };

  const handleUploadPhoto = (file) => {
    setPhoto(file);
    setFormData({
      ...formData,
      photo: file,
    });
    return false;
  };

  const handleRegister = async (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", values.nombre);
    formDataToSend.append("apellido", values.apellido);
    formDataToSend.append("email", values.email);
    formDataToSend.append("password", values.password);

    if (photo) {
      formDataToSend.append("photo", photo);
    }

    try {
      setLoading(true);

      await dispatch(registerUserThunk(formDataToSend)).unwrap();

      message.info("Cuenta registrada con exito, inicie sesion");
      navigate("/login");
    } catch (error) {
      if (error.response || error) {
        message.error(
          error?.message ||
            "Operacion invalida, verifique los datos antes de ingresar"
        );
        console.log(error);
      }

      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="content">
        <Form layout="vertical" form={form} onFinish={handleRegister}>
          {/* INPUT NOMBRE */}
          <Col>
            <Form.Item
              name="nombre"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu nombre!",
                },
                {
                  max: 15,
                  message: "¡El nombre deber tener maximo 15 digitos!",
                },
                {
                  min: 3,
                  message: "¡El nombre deber tener minimo 3 digitos!",
                },
              ]}
            >
              <Input
                className="form-input"
                placeholder="Nombre..."
                variant="borderless"
                color="#ffffff"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="apellido"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu apellido!",
                },
                {
                  min: 3,
                  message: "Al menos 3 digitos!",
                },
                {
                  max: 15,
                  message: "¡Apellido deber tener al maximo 15 digitos!",
                },
              ]}
            >
              <Input
                className="form-input"
                placeholder="Apellido..."
                variant="borderless"
                color="#ffffff"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="email"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu email!",
                },
                {
                  type: "email",
                  message: "El formato del email no es válido!",
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
                  message: "Ingresa contraseña",
                },
                {
                  max: 15,
                  message: "¡La contraseña debe tener maximo 8 digitos!",
                },
                {
                  min: 5,
                  message: "¡La contraseña debe tener al menos 5 digitos!",
                },
              ]}
            >
              <Input.Password
                className="form-input"
                id="passwordinp"
                placeholder="Contraseña..."
                variant="borderless"
                color="#ffffff"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="password_confirm"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Campo obligatorio",
                },
              ]}
            >
              <Input.Password
                onChange={handlePasswordChange}
                className="form-input"
                id="passwordinp"
                placeholder="Confirmar contraseña..."
                variant="borderless"
                color="#ffffff"
                width={100}
              />
            </Form.Item>
          </Col>

          {!passwordMatch && (
            <p id="passworerror">Las contraseñas deben coindicidir</p>
          )}

          <div className="center">
            <Dragger
              beforeUpload={handleUploadPhoto}
              name="photo"
              className="dragger"
              itemRender={itemRender}
              maxCount={1}
            >
              <Button
                size="small"
                id="uploadbtn"
                className="form-upload-btn"
                iconPlacement="end"
                icon={<HiCloudArrowUp size={30} />}
              >
                Sube tu foto
              </Button>
            </Dragger>
          </div>
          <div className="l01">
            <Button
              size="small"
              className="btn_isession"
              type="outlined"
              htmlType="submit"
              disabled={!passwordMatch}
              id="registerbtn"
              loading={loading}
            >
              Registrarse
            </Button>
            <a href="/login">Ya tiene cuenta? Inicie Sesión.</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
