import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Input,
  Upload,
  message,
  Avatar,
} from "antd";
import "../styles/EditProfile.css";
import { HiCloudArrowUp } from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import { editProfile } from "../redux/thunks/userThunk";

const EditProfile = () => {
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const uploadProps = {
    maxCount: 1,
    style: { width: "100%" },
    listType: "picture",
    accept: ".jpg, .jpeg, .png",
    beforeUpload: (file) => {
      // Validar tipo
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Solo puedes subir archivos de imagen");
        return Upload.LIST_IGNORE;
      }

      // Validar tamaño 5mb
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("La imagen debe ser menor a 5MB");
        return Upload.LIST_IGNORE;
      }

      setPhoto(file);
      return false;
    },
    onRemove: () => {
      setPhoto(null);
    },
  };

  const handleForm = async (values) => {
    const formDataToSend = new FormData();

    const cleanValues = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    //  FormData lleno con valores limpios
    for (const key in cleanValues) {
      formDataToSend.append(key, cleanValues[key]);
    }
    if (photo) {
      formDataToSend.append("photo", photo);
    }

    try {
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const dataObject = Object.fromEntries(formDataToSend.entries());
      console.log(dataObject);

      await dispatch(editProfile(formDataToSend)).unwrap();

      message.info("Solicitud procesada");
    } catch (error) {
      console.log(error);
      message.error(String(error) || "Solicitud denegada");
    } finally {
      setPhoto(null);
      uploadProps.onRemove();
    }
  };

  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    form.setFieldValue("nombre", user?.nombre);
    form.setFieldValue("apellido", user?.apellido);
    form.setFieldValue("email", user?.email);
  }, [user, form]);

  return (
    <div className="container_tplist">
      <h2>Editar Perfil</h2>

      <Form form={form} onFinish={handleForm}>
        <Card className="editprocard">
          <br />
          {user.photo?.url ? (
            <div className="edpimg">
              <Avatar src={user.photo.url} size={88} />
            </div>
          ) : (
            <div className="edpimg">
              <Avatar src="/assets/avatar.png" size={88} />
            </div>
          )}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                className="form-item"
                name="nombre"
                rules={[
                  {
                    max: 15,
                    message: "Nombre deber tener  maximo 15 digitos!",
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
                    max: 15,
                    message: "¡Apellido deber tener al maximo 15 digitos!",
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
                    min: 5,
                    message: "¡La contraseña deber tener al menos 5 digitos!",
                  },
                  {
                    max: 15,
                    message: "¡La contraseña deber tener maximo 15 digitos!",
                  },
                ]}
              >
                <Input.Password placeholder="Nueva contraseña" />
              </Form.Item>
            </Col>

            <div className="ppp">
              <Upload {...uploadProps} className="btn_upload">
                <Button
                  block
                  iconPlacement="end"
                  size="small"
                  className="btn_nb"
                  icon={<HiCloudArrowUp size={30} />}
                >
                  Sube tu foto
                </Button>
              </Upload>
            </div>

            <Col span={24}>
              <Button
                block
                loading={loading}
                size="small"
                type="outlined"
                id="btn_submit"
                htmlType="submit"
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
