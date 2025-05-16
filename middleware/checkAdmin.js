export const checkAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming req.user is set by the protectRoute middleware

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }

  next();
};
