/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const extensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];



export const uploadImage = async images => {
    const imgExt = images.name.split('.').pop();
    if (extensions.includes(imgExt)) {
      const result = await cloudinary.uploader.upload(images.path);
      return result.url;
  }
  return null;
};

const uploadImages = async (images) => Promise.all(images.map(async (image) => {
  const imgExt = image.name.split('.').pop();
  if (extensions.includes(imgExt)) {
    const response = await cloudinary.uploader.upload(image.path);
    return response.url;
  }
  return null
}));

export const uploader = async (images) => {
  let res;
  if (!images.length) {
    res = await uploadImage(images)
    return res
  }

  const validTypes = images.every(image => {
    return extensions.includes(image.name.split('.').pop())
  })
  if(!validTypes) { return null }
  return await uploadImages(images);
  
}
