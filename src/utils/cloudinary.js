import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const upload = async (file) => {
  const image = await cloudinary.uploader.upload(file)
    .then((result) => result)
    .catch((error) => null);
  return image;
};
export default upload;
