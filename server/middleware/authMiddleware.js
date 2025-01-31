import jwt from "jsonwebtoken";

export const verifyUserToken = (req, res, next) => {
  //Extraemos cookies (previamente generadas si se inicio sesion o creo nuevo user)
  const token = req.cookies.userToken;

  if (!token) {
    return next(
      res.status(403).json({
        success: false,
        message: "No se proporciona el token, autorizacion denegada.",
      })
    );
  }

  try {
    //verificamos y desencriptamos el token en decoded para ser pasado a req.user que lo pasa al controlador
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded user token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      res.status(401).json({
        success: false,
        message: "Token Invalido",
      })
    );
  }
};
