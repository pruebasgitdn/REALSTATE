export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT(); //del modelo

  const cookieName = "userToken";

  /*
   Se manda el codigo de estado, mas la cookie con su bombre y configuracion, que de respuesta es el succes mensaje usuario y token del usuario
    */
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE)),
    })
    .json({
      succes: true,
      message,
      user,
      token,
    });
};
