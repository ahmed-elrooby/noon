import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      minLength: [3, "title must be at least 3 characters long"],
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    imgCover: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceAfterDiscount: {
      type: Number,
      min: 0,
    },

    ratingAverage: {
      type: Number,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      minLength: [10, "description must be at least 10 characters long"],
      maxLength: [300, "description must be at most 300 characters long"],
      required: true,
      trim: true,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "productId",
  localField: "_id",
});
productSchema.post("init", (doc) => {
  if (doc.imgCover && !doc.imgCover.startsWith("http")) {
    doc.imgCover = `${process.env.BASE_URL}/products/${doc.imgCover}`;
  }

  if (doc.images?.length) {
    doc.images = doc.images.map((img) =>
      img.startsWith("http") ? img : `${process.env.BASE_URL}/products/${img}`,
    );
  }
});
productSchema.pre(/^find/, function () {
  this.populate("reviews");
});
export const productModel = mongoose.model("product", productSchema);
