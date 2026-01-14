import { check } from "express-validator";

export const validateCreateBooking = [
  check("anfitrionId")
    .notEmpty()
    .withMessage("Se requiere el ID del anfitrion")
    .isMongoId()
    .withMessage("Ingrese un ID de Mongo valido"),

  check("publicacionId")
    .notEmpty()
    .withMessage("Se requiere el ID de la publicacion")
    .isMongoId()
    .withMessage("Ingrese un ID de Mongo valido"),

  check("fechaInicio")
    .notEmpty()
    .withMessage("Se requiere la fecha de inicio")
    .isDate()
    .withMessage("Ingrese un formato de fecha valido"),

  check("fechaFin")
    .notEmpty()
    .withMessage("Se requiere la fecha de fin")
    .isDate()
    .withMessage("Ingrese un formato de fecha valido"),

  check("precioTotal")
    .notEmpty()
    .withMessage("Se requiere el precio de la publicacion")
    .isNumeric()
    .withMessage("Ingrese un formato de precio valido"),
];
