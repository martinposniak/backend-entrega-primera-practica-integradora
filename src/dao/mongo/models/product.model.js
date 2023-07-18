import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: {
    type: String,
    unique: true,
  },
  price: Number,
  status: {
    type: Boolean,
    default: true,
    unique: false,
  },
  stock: Number,
  category: String,
});

export const productModel = mongoose.model("Products", productSchema);
