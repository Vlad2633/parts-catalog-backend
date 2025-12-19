import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    partId: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, default: "", maxlength: 1000 },
    status: { type: String, enum: ["VISIBLE", "HIDDEN"], default: "VISIBLE" }
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
