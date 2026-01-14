import { Avatar, Card, Button, Modal, Input, message, Form } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { BiUserPin } from "react-icons/bi";
import { LuMessageSquareMore } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, unselectChat } from "../redux/slices/chatSlice";
import { getUsersMessages, sendMessageThunk } from "../redux/thunks/chatThunk";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getSocket, subscribeSocketNewMessageEvent } from "../lib/socket";

const UserInfoCard = ({ id, nombre, photo, apellido, email }) => {
  const [form] = Form.useForm();
  const bottomRef = useRef(null);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const dispatch = useDispatch();
  const messages = useSelector((state) => state?.chat?.messages);
  const user = useSelector((state) => state?.user?.user);

  const showModal = async () => {
    setIsModalOpen(true);
    dispatch(selectChat(id));
    dispatch(getUsersMessages(id));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    dispatch(unselectChat());
  };

  const st = {
    _id: id,
    email: email,
  };

  const handleInputForm = async () => {
    try {
      if (messageText === "") {
        message.error("Ingresa un mensaje a enviar");
      }

      dispatch(
        sendMessageThunk({
          user_id: id,
          payload: messageText,
        })
      ).unwrap();

      getSocket();

      subscribeSocketNewMessageEvent(dispatch, st);
    } catch (error) {
      console.log(error);
    } finally {
      setMessageText("");
      form.resetFields();
    }
  };

  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <Card className="user_info_kard">
      {photo != null || photo !== undefined || photo !== "" ? (
        <div id="div_willo_img">
          <Avatar src={photo?.url || "/assets/avatar.png"} size={88} />
        </div>
      ) : (
        //  "/assets/avatar.png"
        <div id="div_willo_img">
          <p>No se encontró la foto del usuario.</p>
        </div>
      )}
      <div id="willo">
        <p>
          {nombre} {apellido}
        </p>
        <BiUserPin size={20} color="#04793eff" />
      </div>
      <div id="willo">
        <p>{email}</p>
        <MdEmail size={20} color="#058545" />
      </div>

      <div id="lele">
        {user?._id !== id && (
          <Button
            onClick={() => {
              if (!user || user === null) {
                message.info(
                  "Inicia sesion para enviar mensajes a este usuario"
                );
                navigate("/login");
              }

              showModal();
            }}
            block
            disabled={!user || user == undefined}
            id="vvea"
            iconPlacement="end"
            icon={<LuMessageSquareMore size={25} color="#ffffffff" />}
          >
            Enviar mensaje
          </Button>
        )}
      </div>
      {(!user || user === null) && (
        <div id="dbloc">
          <a href="/login">Inicie sesión</a>
        </div>
      )}
      <Modal
        title={`${nombre} ${apellido}`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        styles={{
          body: {
            height: 400,
            display: "flex",
            flexDirection: "column",
            padding: 0,
          },
        }}
      >
        <div className="chat_messages">
          {messages?.length > 0 ? (
            messages.map((msg, index) => {
              const isMine = msg.senderId === user._id;

              return (
                <div
                  key={index}
                  ref={bottomRef}
                  className={`msg_row ${isMine ? "j_end" : "j_start"}`}
                >
                  <span className="msg_sender">
                    {isMine ? user?.nombre : `${nombre} ${apellido}`}
                  </span>

                  <div
                    className={`msg_bubble ${isMine ? "msg_me" : "msg_other"}`}
                  >
                    {msg.data.text}
                  </div>
                </div>
              );
            })
          ) : (
            <span>No hay mensajes entre estos 2 usuarios</span>
          )}
        </div>
        <hr className="hrchat" />
        <div className="chat_input">
          <Form className="f_cien" form={form} onFinish={handleInputForm}>
            <Form.Item rules={[{ required: true, message: "Requerido" }]}>
              <Input
                placeholder="Escribe algo"
                className="chpt"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />{" "}
            </Form.Item>

            <Button
              htmlType="submit"
              disabled={messageText === ""}
              icon={
                <IoMdSend
                  className="btn_send_input"
                  size={25}
                  color="#085CC9"
                />
              }
            />
          </Form>
        </div>
      </Modal>
    </Card>
  );
};

export default UserInfoCard;
