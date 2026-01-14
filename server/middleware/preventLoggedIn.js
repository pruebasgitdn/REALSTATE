import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const preventIfLoggedIn = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    // no session -> dejar pasar
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return next(
      new AppError({
        message: "Ya tienes una sesión iniciada",
        statusCode: 401,
        success: false,
      })
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token expirado");
    } else if (err.name === "JsonWebTokenError") {
      console.log("Token inválido");
    }
    return next();
  }
};
