const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/loginModel");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // 2. Validate password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // 3. Create token with user info
    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.role_id,
        officeId: user.office_id,
        permissions: user.permissions ? user.permissions.split(",") : [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        officeId: user.office_id,
        permissions: user.permissions ? user.permissions.split(",") : [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
