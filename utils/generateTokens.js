import jwt from "jsonwebtoken";

export const generateTokens = (res, user) => {
  const id = user._id;
  const accessToken = jwt.sign(
    { id: id, email: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    secure: false, // set to the true in production
    sameSite: "strict",
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: false, // set to the true in production
    sameSite: "strict",
  });
  return { accessToken, refreshToken };
};
