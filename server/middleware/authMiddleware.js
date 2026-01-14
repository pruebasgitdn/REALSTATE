import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const verifyUserToken = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    return next(
      new AppError({
        message: "No se proporciona el token, autorización denegada.",
        statusCode: 403,
        success: false,
      })
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new AppError({
        message: "Token inválido",
        statusCode: 401,
        success: false,
        errors: error,
      })
    );
  }
};
