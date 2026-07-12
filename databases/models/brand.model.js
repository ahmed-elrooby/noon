import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Name must be unique"],
      minLength: [3, "Name must be at least 3 characters long"],
      required: true,
      trim: true,
    },

    logo: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
brandSchema.post("init", (doc) => {
  if (doc.logo && !doc.logo.startsWith("http")) {
    doc.logo = `${process.env.BASE_URL}/brands/${doc.logo}`;
  }
});
export const brandModel = mongoose.model("brand", brandSchema);
