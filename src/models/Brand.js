import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
