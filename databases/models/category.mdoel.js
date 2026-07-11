import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      minLngth: [3, "Name must be at least 3 characters long"],
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const categoryModel = mongoose.model("Category", categorySchema);
