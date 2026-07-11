import mongoose from "mongoose";

const copounSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    discount: {
      type: Number,
      min: 0,
      required: true,
    },

    expireAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const copounModel = mongoose.model("copoun", copounSchema);
