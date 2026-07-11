import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema(
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
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const subcategoryModel = mongoose.model(
  "subCategory",
  subCategorySchema,
);
