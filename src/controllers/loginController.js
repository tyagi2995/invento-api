const jwt = require("jsonwebtoken");
const { User, Role, Office } = require("../models/index");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user with role and office
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, attributes: ["name"] },
        { model: Office, attributes: ["id", "name"] },
      ],
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Compare password
    const isMatch = await user.validPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. Sign JWT with role and office
    const token = jwt.sign(
      { id: user.id, roleId: user.roleId, officeId: user.officeId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        office: user.office.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
