import { check, query, body, param } from "express-validator";

export const validateAddToFavo = [
  check("listingID")
    .notEmpty()
    .withMessage("El ID de la publicacion es requerido.")
    .isMongoId()
    .withMessage(
      "El ID de la publicacion proporcionado, debe ser un ID de MongoDB"
    ),
  check("clientID")
    .notEmpty()
    .withMessage("El ID del cliente es requerido.")
    .isMongoId()
    .withMessage("El ID del cliente proporcionado, debe ser un ID de MongoDB"),
];

export const validateRemoveFromFavo = [
  body("listingID")
    .notEmpty()
    .withMessage("El ID de la publicacion es requerido.")
    .isMongoId()
    .withMessage(
      "El ID de la publicacion proporcionado, debe ser un ID de MongoDB"
    ),
  body("clientID")
    .notEmpty()
    .withMessage("El ID del cliente es requerido.")
    .isMongoId()
    .withMessage("El ID del cliente proporcionado, debe ser un ID de MongoDB"),
];
