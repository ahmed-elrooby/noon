import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [1, "Name must be at least 1 characters long"],
      required: true,
      trim: true,
    },
    email: {
      type: String,
      minlength: [1, "email must be at least 1 characters long"],
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "password must be at least 6 characters long"],
      required: true,
    },
    profilePice: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      // active or not
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        city: String,
        street: String,
        phone: String,
      },
    ],
  },

  {
    timestamps: true,
  },
);
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(
    this.password,
    parseInt(process.env.SALT_ROUNDS),
  );
});
userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(
      this._update.password,
      parseInt(process.env.SALT_ROUNDS),
    );
});

export const userModel = mongoose.model("user", userSchema);
