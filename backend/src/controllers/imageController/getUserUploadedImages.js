import ImageModel from "../../../model/ImageModel.js";
import UserModel from "../../../model/UserModel.js";

export const getUserUploadedImages = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userImages = await ImageModel.find({ userId: user._id });

    if (!userImages.length) {
      return res
        .status(404)
        .json({ message: "No images found for this user." });
    }

    res.status(200).json({ userImages });
  } catch (error) {
    console.error("Error in getUserUploadedImages:", error.message);
    res.status(500).json({ error: error.message });
  }
};
