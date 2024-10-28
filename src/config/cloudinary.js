import { v2 as cloudinary } from "cloudinary";

const prodCloudinaryOptions = {
  cloudname: process.env.CLOUDINARY_CLOUD_NAME_PROD,
  apikey: process.env.CLOUDINARY_API_KEY_PROD,
  apisecret: process.env.CLOUDINARY_SECRET_KEY_PROD,
};

const devCloudinaryOptions = {
  cloudname: process.env.CLOUDINARY_CLOUD_NAME_DEV,
  apikey: process.env.CLOUDINARY_API_KEY_DEV,
  apisecret: process.env.CLOUDINARY_SECRET_KEY_DEV,
};

const cloudinaryOptions =
  process.env.NODE_ENV === "production"
    ? prodCloudinaryOptions
    : devCloudinaryOptions;

cloudinary.config(cloudinaryOptions);

export default cloudinary;
