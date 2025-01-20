import UserModel from "../../../model/UserModel.js";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Error registering user", error: err });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    req.session.user = user;
    res
      .status(200)
      .json({ success: true, message: "Login successful", data: user });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Error logging in", error: err });
  }
};
