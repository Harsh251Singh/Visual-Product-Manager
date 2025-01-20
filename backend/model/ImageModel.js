import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  uploadedImage: { type: String, required: true }, 
  uploadedImageName: { type: String, required: true }, 
  similarImages: [
    {
      filename: { type: String, required: true }, 
      similarity: { type: Number, required: true }, 
    },
  ],
  createdAt: { type: Date, default: Date.now }, 
});

const ImageModel = mongoose.model("Image", ImageSchema);
export default ImageModel;
