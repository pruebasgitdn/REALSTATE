export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT(); //del modelo
  const cookieName = "userToken";

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  res
    .status(statusCode)
    .cookie(cookieName, token, cookieOptions)
    .cookie("isLoggedIn", "true", {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
