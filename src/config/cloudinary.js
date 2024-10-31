import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDERS = {
  COVER: "bookCoverPics",
  FILES: "books",
};

export const DEFAULT_COVER =
  "https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg";

const prodCloudinaryOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME_PROD,
  api_key: process.env.CLOUDINARY_API_KEY_PROD,
  api_secret: process.env.CLOUDINARY_SECRET_KEY_PROD,
};

const devCloudinaryOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME_DEV,
  api_key: process.env.CLOUDINARY_API_KEY_DEV,
  api_secret: process.env.CLOUDINARY_SECRET_KEY_DEV,
};

const cloudinaryOptions =
  process.env.NODE_ENV === "prod"
    ? prodCloudinaryOptions
    : devCloudinaryOptions;

cloudinary.config(cloudinaryOptions);

export default cloudinary;
