import jwt from "jsonwebtoken";

export const getTokenContent = (res, accessToken) => {
  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "No access token provided" });
  }

  const tokenContent = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid access token" });
      }

      return user;
    }
  );

  return tokenContent;
};
