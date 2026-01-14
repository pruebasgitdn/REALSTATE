import { Card, Button, Carousel, Avatar } from "antd";
import "../styles/TripListCard.css";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdPin } from "react-icons/io";
import { BiCalendarEvent } from "react-icons/bi";

const ReservationCard = ({
  id,
  fotos,
  municipio,
  departamento,
  pais,
  fechaInicio,
  fechaFin,
  clienteNombre,
  clienteApellido,
  clienteFoto,
  clienteID,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="tripcardlist">
      <h3 className="text_start">
        {municipio} en {departamento} - {pais}{" "}
        <IoMdPin size={24} color="#66BB6A" />
      </h3>

      {fotos.length > 0 ? (
        <Carousel infinite={false} arrows className="werma">
          {fotos.map((foto, index) => (
            <div key={index}>
              <img src={foto?.url} alt={`Foto`} className="trlstimg" />
            </div>
          ))}
        </Carousel>
      ) : (
        <div>
          <h2>No imagen disponible.</h2>
        </div>
      )}
      <div className="infocardtrip">
        <button
          type="button"
          id="noend"
          className="btn_nobtn"
          onClick={() => {
            navigate(`/get_user/${clienteID}`);
          }}
        >
          Reservado por: {clienteNombre} {clienteApellido} {}
          <Avatar
            src={clienteFoto?.url || "/assets/avatar.png"}
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar.png";
            }}
            size={30}
          />
        </button>

        <hr id="lnln" />
        <p className="f_normal text_start text_small ng">
          Fecha de inicio y fin de la reserva
        </p>

        <div className="dates">
          <p>
            <strong>Empieza: {fechaInicio}</strong>
            <BiCalendarEvent size={15} />
          </p>

          <p>
            <strong>Termina: {fechaFin}</strong>
            <BiCalendarEvent size={15} />
          </p>
        </div>
        <hr id="lnln" />
        <div>
          <Button
            block
            type="primary"
            size="small"
            iconPlacement="end"
            icon={<IoMdEye color="#ffffffff" size={19} />}
            onClick={() => {
              navigate(`/property_id/${id}`);
            }}
          >
            PUBLICACION
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;
