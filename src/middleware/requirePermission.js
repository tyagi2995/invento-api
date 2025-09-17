module.exports = (permission) => {
  return (req, res, next) => {
    try {
      const userPermissions = req.user.permissions || [];

      if (req.user.role === "Super Admin") {
        // Super Admin has access to everything
        return next();
      }

      if (!userPermissions.includes(permission)) {
        return res
          .status(403)
          .json({ status: "error", message: "Forbidden: Permission denied" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  };
};
