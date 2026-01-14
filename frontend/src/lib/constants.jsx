import {
  FaBath,
  FaFireExtinguisher,
  FaFirstAid,
  FaMountain,
  FaRestroom,
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
import { BiSolidDryer, BiSolidWasher, BiWorld } from "react-icons/bi";
import {
  PiCoatHangerLight,
  PiPicnicTable,
  PiSwimmingPool,
} from "react-icons/pi";
import { TbIroning3, TbMicrowaveFilled, TbSnowflake } from "react-icons/tb";
import { IoTvOutline, IoWifiOutline } from "react-icons/io5";
import { BsDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { RiCactusFill } from "react-icons/ri";
import { IoIosHome } from "react-icons/io";

export const amenitiesIcons = {
  // baño: <FaBath />,
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

export const createListingcategories = [
  { id: "playa", label: "Playa", icon: <FaUmbrellaBeach size={30} /> },
  { id: "ciudades", label: "Ciudades", icon: <GiModernCity size={30} /> },
  { id: "piscina", label: "Con piscina", icon: <PiSwimmingPool size={30} /> },
  { id: "isla", label: "Islas", icon: <GiIsland size={30} /> },
  { id: "lago", label: "Con lago", icon: <GiBoatFishing size={30} /> },
  { id: "arido", label: "Árido", icon: <RiCactusFill size={30} /> },
  { id: "helado", label: "Helado", icon: <TbSnowflake size={30} /> },
  { id: "montana", label: "Montaña", icon: <FaMountain size={30} /> },
  { id: "cabana", label: "Cabaña", icon: <MdOutlineCabin size={30} /> },
  { id: "vieja", label: "Antiguas", icon: <GiCastle size={30} /> },
  { id: "lujo", label: "De lujo", icon: <GiCutDiamond size={30} /> },
  { id: "todo", label: "Todas", icon: <BiWorld size={30} /> },
];

export const createTypePlace = [
  {
    id: "lugar_entero",
    title: "Un lugar entero",
    description: "Los invitados tendran un lugar entero para ellos solos.",
    icon: <IoIosHome size={25} />,
  },
  {
    id: "habitaciones",
    title: "Habitaciones",
    description:
      "Los invitados tendran su propia habitacion, ademas de servicios adicionales compartidos.",
    icon: <BsDoorOpenFill size={25} />,
  },
  {
    id: "habitacion_compartida",
    title: "Habitacion compartida",
    description: "Los invitados duermen en una misma habitacion compartida.",
    icon: <FaRestroom size={25} />,
  },
];

export const createAmenitiesList = [
  { id: "baño", label: "Bañera", icon: <FaBath size={30} /> },
  { id: "hygiene", label: "Productos de Higiene", icon: <MdSoap size={30} /> },
  { id: "ducha", label: "Ducha al aire libre", icon: <GiShower size={30} /> },
  { id: "lavadora", label: "Lavadora", icon: <BiSolidWasher size={30} /> },
  { id: "secadora", label: "Secadora", icon: <BiSolidDryer size={30} /> },
  { id: "ganchos", label: "Ganchos", icon: <PiCoatHangerLight size={30} /> },
  { id: "plancha", label: "Plancha", icon: <TbIroning3 size={30} /> },
  { id: "tv", label: "TV", icon: <IoTvOutline size={30} /> },
  {
    id: "workstation",
    label: "Estación de trabajo",
    icon: <BsPersonWorkspace size={30} />,
  },
  { id: "aire", label: "Aire Acondicionado", icon: <MdSevereCold size={30} /> },
  { id: "calefaccion", label: "Calefacción", icon: <GiHeatHaze size={30} /> },
  {
    id: "camaras",
    label: "Cámara de Seguridad",
    icon: <GiCctvCamera size={30} />,
  },
  { id: "extintor", label: "Extintor", icon: <FaFireExtinguisher size={30} /> },
  {
    id: "asistencia_medic",
    label: "Primeros Auxilios",
    icon: <FaFirstAid size={30} />,
  },
  { id: "wifi", label: "Wi-Fi", icon: <IoWifiOutline size={30} /> },
  { id: "cocina", label: "Cocina", icon: <GiKitchenTap size={30} /> },
  {
    id: "refrigerador",
    label: "Refrigerador",
    icon: <MdOutlineKitchen size={30} />,
  },
  {
    id: "microondas",
    label: "Microondas",
    icon: <TbMicrowaveFilled size={30} />,
  },
  { id: "estufa", label: "Estufa", icon: <GiGasStove size={30} /> },
  { id: "barbacoa", label: "Barbacoa", icon: <GiBarbecue size={30} /> },
  {
    id: "comedor",
    label: "Comedor al aire",
    icon: <PiPicnicTable size={30} />,
  },
];

export const tipoPublicacionOpciones = [
  { label: "Venta", value: "venta", className: "label-2" },
  { label: "Alquiler", value: "alquiler", className: "label-3" },
];

export const labeltipoPublicacionOpciones = [
  { label: "Mes", value: "mes", className: "label-2" },
  { label: "Día", value: "día", className: "label-3" },
  { label: "Fijo", value: "fijo", className: "label-3" },
];
