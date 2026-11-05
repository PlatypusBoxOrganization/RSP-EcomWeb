import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).setOptions({ includeInactive: true });
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).setOptions({ includeInactive: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, image, brand, category, description, price, countInStock, color, discount } = req.body;
  const product = await Product.create({
    user: req.user._id,
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    image,
    brand,
    category,
    description,
    price,
    countInStock,
    color,
    discount
  });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.softDelete();
  res.json({ message: 'Product removed' });
});