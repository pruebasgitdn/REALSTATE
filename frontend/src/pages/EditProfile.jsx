import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Input, Upload, message } from "antd";
import "../styles/EditProfile.css";
import { HiCloudArrowUp } from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser } from "../redux/state";

const EditProfile = () => {
  const [form] = Form.useForm();
  const { Dragger } = Upload;
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [photo, setPhoto] = useState(false);
  const dispatch = useDispatch();

  const handlePhoto = (file) => {
    setPhoto(file);
    return false;
  };

  const handleForm = async (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", values.nombre);
    formDataToSend.append("apellido", values.apellido);
    formDataToSend.append("email", values.email);
    formDataToSend.append("password", values.password);

    if (photo) {
      formDataToSend.append("photo", photo);
    }

    try {
      setLoadingBtn(true);

      const response = await axios.put(
        "http://localhost:4000/api/user/edit_profile",
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const userData = await response.data.user;
        console.log("Registro exitoso", userData);
        dispatch(updateUser(response.data.user));
      }
      // formDataToSend.forEach((index, values) => {
      //   console.log(index, values);
      // });
    } catch (error) {
      if (error.response || error.response.data) {
        message.error(error.response.data.message);
      }
    } finally {
      setLoadingBtn(false);
      console.log(values);
    }
  };

  const user = useSelector((state) => state?.user?.user);
  console.log(user);

  useEffect(() => {
    form.setFieldValue("nombre", user?.nombre);
    form.setFieldValue("apellido", user?.apellido);
    form.setFieldValue("email", user?.email);
  }, [user]);

  return (
    <div className="container_tplist">
      <h2>Editar Perfil</h2>

      <Form form={form} onFinish={handleForm}>
        <Card className="editprocard">
          <br />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                className="form-item"
                name="nombre"
                rules={[
                  {
                    required: true,
                    message: "Si desea actualizar, nombre es obligatorio!",
                  },
                  {
                    min: 3,
                    message: "¡El nombre deber tener al menos 3 digitos!",
                  },
                ]}
              >
                <Input placeholder="Nuevo nombre" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                className="form-item"
                name="apellido"
                rules={[
                  {
                    required: true,
                    message: "Si desea actualizar, apellido es obligatorio!",
                  },
                  {
                    min: 3,
                    message: "¡Apellido deber tener al menos 3 digitos!",
                  },
                ]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                className="form-item"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Si desea actualizar, email es obligatorio!",
                  },
                  {
                    type: "email",
                    message: "El formato del email no es válido!",
                  },
                ]}
              >
                <Input placeholder="Nuevo email" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                className="form-item"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Si desea actualizar, contraseña obligatoria!",
                  },
                  {
                    min: 8,
                    message: "¡La contraseña deber tener al menos 8 digitos!",
                  },
                ]}
              >
                <Input.Password placeholder="Nueva contraseña" />
              </Form.Item>
            </Col>

            <div className="center">
              <Upload
                beforeUpload={handlePhoto}
                maxCount={1}
                listType="picture"
                accept=".jpg, .jpeg, .png"
              >
                <Button
                  iconPosition="end"
                  block
                  size="middle"
                  icon={<HiCloudArrowUp size={30} />}
                >
                  Sube tu foto
                </Button>
              </Upload>
            </div>

            <Col span={24}>
              <Button
                block
                size="small"
                type="outlined"
                className="green-btn"
                htmlType="submit"
                loading={loadingBtn}
              >
                Guardar cambios
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

export default EditProfile;
