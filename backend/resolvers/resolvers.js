import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import mutations from "./mutations.js";
import queries from "./queries.js";

//! ==========================================================
//! Resolvers
//! ==========================================================
const resolvers = {
  Query: {
    ...queries.Query,
  },
  Mutation: {
    ...mutations.Mutation,
  },
};

export default resolvers;
