import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 2000 },
    sku: { type: String, required: true, trim: true, maxlength: 50 }, // артикул
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    inStock: { type: Boolean, default: true },

    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },

    compatibility: { type: String, default: "" }, // сумісність одним рядком
    images: [{ type: String }]
  },
  { timestamps: true }
);

partSchema.pre("save", function () {
  this.inStock = this.stock > 0;
});

export const Part = mongoose.model("Part", partSchema);
