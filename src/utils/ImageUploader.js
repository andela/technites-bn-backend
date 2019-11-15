/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const extensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

export const uploadImage = async (image) => {
  const imgExt = image.split('.').pop();
  if (extensions.includes(imgExt)) {
    const result = await cloudinary.uploader.upload(image);
    return result.url;
  }
  return null;
};

export const uploadImages = async (images) => Promise.all(images.map(async (item) => {
  const image = item.path;
  const imgExt = image.split('.').pop();
  if (extensions.includes(imgExt)) {
    const response = await cloudinary.uploader.upload(image);
    return response.url;
  }
}));
