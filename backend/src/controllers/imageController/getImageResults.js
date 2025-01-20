import mongoose from "mongoose";
import ImageModel from "../../../model/ImageModel.js";

let gfsBucket;


const initializeGridFSBucket = () => {
  if (!gfsBucket) {
    const db = mongoose.connection.db;
    gfsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "images",
    });
  }
};


export const getSimilarImages = async (req, res) => {
  try {
    const { fileId } = req.params;

    
    const uploadedImage = await ImageModel.findById(fileId);

    if (!uploadedImage) {
      return res.status(404).json({ message: "Uploaded image not found." });
    }

    initializeGridFSBucket();

    
    const similarImages = await Promise.all(
      uploadedImage.similarImages.map(async (image) => {
        const imageStream = gfsBucket.openDownloadStreamByName(image.filename);

        const imageChunks = [];
        imageStream.on("data", (chunk) => imageChunks.push(chunk));
        await new Promise((resolve) => imageStream.on("end", resolve));

        const imageBuffer = Buffer.concat(imageChunks);
        const imageBase64 = imageBuffer.toString("base64");

        return {
          filename: image.filename,
          similarity: image.similarity,
          base64: `data:image/jpeg;base64,${imageBase64}`,
        };
      })
    );


    res.status(200).json({
      uploadedImage: {
        url: uploadedImage.uploadedImage, 
        name: uploadedImage.uploadedImageName,
      },
      similarImages,
    });
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Failed to fetch images from GridFS." });
  }
};
