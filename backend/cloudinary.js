
// import {v2 as cloudinary} from 'cloudinary';
// import cloudinary = require('cloudinary').v2;

import cloudinary from 'cloudinary';

          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;