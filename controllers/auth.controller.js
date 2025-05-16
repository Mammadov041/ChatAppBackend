import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateTokens.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "User not found by provided username" });
  const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  if (!isPasswordCorrect)
    res
      .status(400)
      .json({ success: false, message: "Password is not correct" });
  const { accessToken, refreshToken } = generateTokens(res, user);
  res.status(200).json({ accessToken, refreshToken });
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    const { accessToken, refreshToken } = generateTokens(res, newUser);
    res.status(201).json({
      success: true,
      message: "User registered with success .",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out succesfully" });
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    const id = user._id;
    const newAccessToken = jwt.sign(
      { id: id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", newAccessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: false, // set to the true in production
      sameSite: "strict",
    });
    res.status(200).json({
      success: true,
      message: "Access token has been refreshed",
      accessToken: newAccessToken,
    });
  });
};
