import { check, param, query } from "express-validator";

const allowedPriceUnits = ["fijo", "mes", "día"];
const allowedKindListing = ["venta", "alquiler"];
const allowedStatus = ["habilitado", "inhabilitado"];

export const validateUserID = [
  param("id")
    .notEmpty()
    .withMessage("Ingresa el id del usuario")
    .isMongoId()
    .withMessage("Ingresa un id de mongo valido"),
];

export const validateCreateListing = [
  check("categoria").notEmpty().withMessage("La categoria es requerida"),

  check("tipo").notEmpty().withMessage("El tipo es requerido"),

  check("direccionCalle")
    .notEmpty()
    .withMessage("La direccion de la residencia es requerida")
    .isLength({ max: 50 })
    .withMessage("Direccion maximo 50 caracteres"),

  check("municipio")
    .notEmpty()
    .withMessage("El municipio es requerido")
    .isLength({ max: 25 })
    .withMessage("Municipio maximo 25 caracteres"),
  check("departamento")
    .notEmpty()
    .withMessage("El departamento es requerido")
    .isLength({ max: 25 })
    .withMessage("Departamento maximo 25 caracteres"),

  check("pais")
    .notEmpty()
    .withMessage("El pais es requerido")
    .isLength({ max: 25 })
    .withMessage("Pais maximo 25 caracteres"),

  check("cantidadHuespedes")
    .notEmpty()
    .withMessage("Cantidad de huespedes requerida")
    .isInt()
    .withMessage("Ingrese un valor numerico entero"),

  check("cantidadDormitorios")
    .notEmpty()
    .withMessage("Cantidad de dormitorios  requerida")
    .isInt()
    .withMessage("Ingrese un valor numerico entero"),

  check("cantidadCamas")
    .notEmpty()
    .withMessage("Cantidad de camas  requerida")
    .isInt()
    .withMessage("Ingrese un valor numerico entero"),

  check("cantidadBanos")
    .notEmpty()
    .withMessage("Cantidad de retretes  requerida")
    .isInt()
    .withMessage("Ingrese un valor numerico entero"),

  check("comodidades").custom((value, { req }) => {
    const comodidades = req.body.comodidades;
    if (!comodidades) {
      throw new Error("Las comodidades son requeridas");
    }

    if (!Array.isArray(comodidades)) {
      req.body.comodidades = [comodidades];
    }
    if (req.body.comodidades.length < 1) {
      throw new Error("Debes incluir al menos una comodidad");
    }
    return true;
  }),
  check("titulo")
    .notEmpty()
    .withMessage("El titulo es requerido")
    .isLength({ max: 35 })
    .withMessage("Titulo maximo 25 caracteres"),
  check("descripcion")
    .notEmpty()
    .withMessage("La descripcion es requerida")
    .isLength({ max: 500 })
    .withMessage("Descripcion maximo 500 caracteres"),

  check("destacado")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Destacados maximo 20 caracteres"),

  check("descripcionDestacado")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Describir destacados maximo 300 caracteres"),

  check("precio")
    .notEmpty()
    .withMessage("El precio es requerido")
    .isNumeric()
    .withMessage("Debes introducir el precio en valor numerico"),

  check("unidadPrecio")
    .notEmpty()
    .withMessage("Unidad de precio requerida")
    .isIn(Object.values(allowedPriceUnits))
    .withMessage("Unidad de precio invalida"),

  check("tipoPublicacion")
    .notEmpty()
    .withMessage("Tipo de publicacion requerida")
    .isIn(Object.values(allowedKindListing))
    .withMessage("Tipo de publicacion invalida"),
];

export const validateGetListingsByCategoy = [
  param("category")
    .notEmpty()
    .withMessage("Ingrese la categoria para iniciar la busqueda")
    .isString()
    .withMessage("Debe ser un string")
    .toString(),
];

export const validateListingID = [
  param("id")
    .notEmpty()
    .withMessage("Ingrese el ID de la publicacion para iniciar la busqueda")
    .isMongoId()
    .withMessage("Debe ser un ID valido de Mongo"),
];

export const validateSetStatus = [
  param("id")
    .notEmpty()
    .withMessage("Ingrese el ID de la publicacion para iniciar la busqueda")
    .isMongoId()
    .withMessage("Debe ser un ID valido de Mongo"),

  check("estado")
    .notEmpty()
    .withMessage("Estado requerido")
    .isString()
    .withMessage("Ingrese un strign")
    .isIn(Object.values(allowedStatus))
    .withMessage("Ingrese un estado valido"),
];

export const validateSearchListing = [
  query("titulo")
    .notEmpty()
    .withMessage("Ingrese query titulo")
    .isString()
    .withMessage("Debe ser un string"),

  query("categoria")
    .notEmpty()
    .withMessage("Ingrese query categoria")
    .isString()
    .withMessage("Debe ser un string"),
];

export const validateFilterListings = [
  query("titulo")
    .optional()
    .isString()
    .withMessage("El titulo debe ser una cadena de texto"),

  query("categoria")
    .optional()
    .isString()
    .withMessage("La categoria debe ser una cadena de texto"),

  query("tipo")
    .optional()
    .isIn(allowedKindListing)
    .withMessage("Tipo de publicacion invalido (venta o alquiler)"),

  query("minPrice")
    .optional()
    .isNumeric()
    .withMessage("El precio mínimo debe ser numérico"),

  query("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("El precio máximo debe ser numérico"),
];
