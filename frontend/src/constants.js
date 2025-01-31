import {
  FaBath,
  FaFireExtinguisher,
  FaFirstAid,
  FaMountain,
  FaUmbrellaBeach,
} from "react-icons/fa";
import {
  MdOutlineKitchen,
  MdSevereCold,
  MdSoap,
  MdOutlineCabin,
} from "react-icons/md";
import {
  GiBarbecue,
  GiCctvCamera,
  GiGasStove,
  GiHeatHaze,
  GiKitchenTap,
  GiShower,
  GiCastle,
  GiCutDiamond,
  GiBoatFishing,
  GiModernCity,
  GiIsland,
} from "react-icons/gi";
import { BiSolidDryer, BiSolidWasher } from "react-icons/bi";
import {
  PiCoatHangerLight,
  PiPicnicTable,
  PiSwimmingPool,
} from "react-icons/pi";
import { TbIroning3, TbMicrowaveFilled, TbSnowflake } from "react-icons/tb";
import { IoTvOutline, IoWifiOutline } from "react-icons/io5";
import { BsPersonWorkspace } from "react-icons/bs";
import { RiCactusFill } from "react-icons/ri";

export const amenitiesIcons = {
  baño: <FaBath />,
  hygiene: <MdSoap />,
  ducha: <GiShower />,
  lavadora: <BiSolidWasher />,
  secadora: <BiSolidDryer />,
  ganchos: <PiCoatHangerLight />,
  plancha: <TbIroning3 />,
  tv: <IoTvOutline />,
  workstation: <BsPersonWorkspace />,
  aire: <MdSevereCold />,
  calefaccion: <GiHeatHaze />,
  camaras: <GiCctvCamera />,
  extintor: <FaFireExtinguisher />,
  asistencia_medic: <FaFirstAid />,
  wifi: <IoWifiOutline />,
  cocina: <GiKitchenTap />,
  refrigerador: <MdOutlineKitchen />,
  microondas: <TbMicrowaveFilled />,
  estufa: <GiGasStove />,
  barbacoa: <GiBarbecue />,
  comedor: <PiPicnicTable />,
};

export const categoryIcons = {
  playa: <FaUmbrellaBeach />,
  ciudades: <GiModernCity />,
  piscina: <PiSwimmingPool />,
  isla: <GiIsland />,
  lago: <GiBoatFishing />,
  arido: <RiCactusFill />,
  helado: <TbSnowflake />,
  montana: <FaMountain />,
  cabana: <MdOutlineCabin />,
  vieja: <GiCastle />,
  lujo: <GiCutDiamond />,
};

//clave valor ti_lugar
export const type_Place = {
  lugar_entero: "Lugar Entero",
  habitaciones: "Habitaciones",
  habitacion_compartida: "Habitacion Compártida",
};

export const category = {
  playa: "Playa",
  ciudades: "Ciudad",
  piscina: "Con piscina",
  isla: "Islas",
  lago: "Con lago",
  arido: "Arido",
  helado: "Helado",
  montana: "Montaña",
  cabana: "Cabaña",
  vieja: "Antigua",
  lujo: "Lujosas",
};

//clave valor comodidaes
export const amenities = {
  baño: "Baño",
  hygiene: "Higiene",
  ducha: "Ducha",
  lavadora: "Lavadora",
  secadora: "Secadora",
  ganchos: "Ganchos",
  plancha: "Plancha",
  tv: "TV",
  workstation: "Estacion de trabajo",
  cocina: "Cocina",
  aire: "Aire condicionado",
  calefaccion: "Calefaccion",
  camaras: "Camaras",
  extintor: "Extintor",
  asistencia_medic: "Primeros Auxilios",
  wifi: "Wi-Fi",
  refrigerador: "Refrigerador",
  microondas: "Microondas",
  estufa: "Estufa",
  barbacoa: "Barbacoa",
  comedor: "Comedor",
};

// export const statusProperty = {
//   habilitado: "Habilitar",
//   inhabilitado: "Inhabilitar",
// };
