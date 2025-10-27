import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc   Lấy tất cả sản phẩm với pagination
// @route  GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc   Thêm sản phẩm mới
export const addProduct = asyncHandler(async (req, res) => {
  const { name, type, category, price, image, detailUrl, notes, rating } =
    req.body;

  // Validation
  if (!name || !type || !category || !price || !image || !detailUrl) {
    throw new AppError("Thiếu thông tin sản phẩm bắt buộc", 400);
  }

  if (price <= 0) {
    throw new AppError("Giá sản phẩm phải lớn hơn 0", 400);
  }

  const product = new Product({
    name,
    type,
    category,
    price,
    image,
    detailUrl,
    notes,
    rating: rating || 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc   Cập nhật sản phẩm
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new AppError("Không tìm thấy sản phẩm", 404);
  }

  res.json(updated);
});

// @desc   Xóa sản phẩm
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    throw new AppError("Không tìm thấy sản phẩm", 404);
  }

  res.json({ message: "Đã xóa sản phẩm thành công", product: deleted });
});

// @desc   Lấy 1 sản phẩm theo id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Không tìm thấy sản phẩm", 404);
  }

  res.json(product);
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const all = req.query.all === "true";
  const limit = parseInt(req.query.limit) || 20; // Default 20 sản phẩm

  const products = all
    ? await Product.find({ category }).sort({ createdAt: -1 })
    : await Product.find({ category }).sort({ createdAt: -1 }).limit(limit);

  res.json(products);
});

// @desc   Search và filter sản phẩm với pagination
// @route  GET /api/products/search
export const searchProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    notes,
    rating,
    sortBy,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};

  // Lọc theo keyword (tìm trong name hoặc type)
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { type: { $regex: keyword, $options: "i" } },
    ];
  }

  // Lọc theo category
  if (category) {
    filter.category = category;
  }

  // Lọc theo giá
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Lọc theo notes (chấp nhận array hoặc string)
  if (notes) {
    let noteArray = [];
    if (Array.isArray(notes)) {
      noteArray = notes.filter((n) => n && n.trim() !== "");
    } else if (typeof notes === "string") {
      noteArray = notes
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
    }
    if (noteArray.length > 0) {
      filter.notes = { $in: noteArray };
    }
  }

  // Lọc theo rating
  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  // Tạo query với pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  let query = Product.find(filter).skip(skip).limit(parseInt(limit));

  // Sắp xếp
  if (sortBy === "price_asc") query = query.sort({ price: 1 });
  else if (sortBy === "price_desc") query = query.sort({ price: -1 });
  else if (sortBy === "rating_desc") query = query.sort({ rating: -1 });
  else if (sortBy === "newest") query = query.sort({ createdAt: -1 });
  else query = query.sort({ createdAt: -1 }); // Default sort

  const products = await query.exec();
  const total = await Product.countDocuments(filter);

  res.json({
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});
