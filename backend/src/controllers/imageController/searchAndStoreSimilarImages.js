import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { Readable } from "stream";
import ImageModel from "../../../model/ImageModel.js";
import UserModel from "../../../model/UserModel.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};


const calculateSimilarity = (vector1, vector2) => {
  const dotProduct = vector1.reduce(
    (sum, val, idx) => sum + val * vector2[idx],
    0
  );
  const magnitude1 = Math.sqrt(
    vector1.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitude2 = Math.sqrt(
    vector2.reduce((sum, val) => sum + val * val, 0)
  );
  return dotProduct / (magnitude1 * magnitude2);
};

export const searchAndStoreSimilarImages = async (req, res) => {
  try {
    const { email, fileName } = req.body; 
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imageBuffer = req.file.buffer;

    
    const vectorsJsonUrl = process.env.VECTORS_JSON_URL;
    if (!vectorsJsonUrl) {
      throw new Error(
        "VECTORS_JSON_URL is not defined in the environment variables."
      );
    }

    
    const vectorsResponse = await axios.get(vectorsJsonUrl);
    const vectorsData = vectorsResponse.data;

    
    const imageVector = await sharp(imageBuffer)
      .resize(64, 64)
      .raw()
      .toBuffer();

    const uploadedVector = [];
    for (let i = 0; i < imageVector.length; i += 4) {
      uploadedVector.push(
        (imageVector[i] + imageVector[i + 1] + imageVector[i + 2]) / 3
      );
    }

    
    const imagesWithSimilarity = vectorsData.map(({ filename, vector }) => ({
      filename,
      similarity: calculateSimilarity(uploadedVector, vector),
    }));

    
    imagesWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "user_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferToStream(imageBuffer).pipe(uploadStream); 
    });

    const newImage = new ImageModel({
      userId: user._id,
      uploadedImage: uploadResponse.secure_url,
      uploadedImageName: fileName,
      similarImages: imagesWithSimilarity.map((img) => ({
        filename: img.filename,
        similarity: img.similarity,
      })), 
    });
    await newImage.save();

    res.status(200).json({
      message: "Image uploaded and all similarities calculated.",
      data: newImage,
    });
  } catch (error) {
    console.error("Error in searchAndStoreSimilarImages:", error.message);
    res.status(500).json({ error: error.message });
  }
};
