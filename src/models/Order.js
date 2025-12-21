import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    partId: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    comment: { type: String, default: "" },
    items: { type: [OrderItemSchema], required: true },
    totalSum: { type: Number, required: true },
    status: { type: String, default: "NEW" }, // NEW / PROCESSING / DONE
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
