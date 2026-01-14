import { check, body, param } from "express-validator";

export const validateGetUserByID = [
  param("id")
    .notEmpty()
    .withMessage("Ingrese el ID de la publicacion para iniciar la busqueda")
    .isMongoId()
    .withMessage("Debe ser un ID valido de Mongo"),
];

export const registerValidation = [
  check("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido.")
    .isLength({ max: 15 })
    .withMessage("El nombre debe tener maximo 15 caracteres"),
  check("apellido")
    .notEmpty()
    .withMessage("El apellido es requerido.")
    .isLength({ max: 15 })
    .withMessage("El apellido debe tener maximo 15 caracteres"),
  check("email")
    .notEmpty()
    .withMessage("Debe ingresar email")
    .isEmail()
    .withMessage("Email invalido"),
  check("password")
    .notEmpty()
    .withMessage("Debe ingresar contraseña")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres")
    .isLength({ max: 10 })
    .withMessage("La contraseña debe tener maximo 10 caracteres"),
];

export const loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("Debe ingresar email")
    .isEmail()
    .withMessage("Email invalido"),
  check("password").notEmpty().withMessage("Debe ingresar contraseña"),
];

export const editProfileValidation = [
  check("nombre")
    .optional()
    .isLength({ max: 15 })
    .withMessage("El nombre debe tener maximo 15 caracteres"),
  check("apellido")
    .optional()
    .isLength({ max: 15 })
    .withMessage("El apellido debe tener maximo 15 caracteres"),
  check("email").optional().isEmail().withMessage("Email invalido"),
  check("password")
    .optional()
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres")
    .isLength({ max: 10 })
    .withMessage("La contraseña debe tener maximo 10 caracteres"),
];
