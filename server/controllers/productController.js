import Product from "../models/Product.js";

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc   Thêm sản phẩm mới
export const addProduct = async (req, res) => {
  try {
    const { name, type, category, price, image, detailUrl, notes, rating } =
      req.body;

    // kiểm tra thiếu field nào không
    if (!name || !type || !category || !price || !image || !detailUrl) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin sản phẩm bắt buộc" });
    }

    const product = new Product({
      name,
      type,
      category,
      price,
      image,
      detailUrl,
      notes,
      rating,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy 1 sản phẩm theo id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const all = req.query.all === "true";
    const products = all
      ? await Product.find({ category })
      : await Product.find({ category }).limit(0);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/search
export const searchProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, notes, rating, sortBy } =
      req.query;

    const filter = {};

    //  lọc theo keyword (tìm trong name hoặc type)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
      ];
    }

    //  lọc theo category
    if (category) {
      filter.category = category;
    }

    //  lọc theo giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    //  lọc theo notes (chấp nhận array hoặc string)
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

    //  lọc theo rating
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    //  query db
    let query = Product.find(filter);

    // ⬇ sắp xếp
    if (sortBy === "price_asc") query = query.sort({ price: 1 });
    if (sortBy === "price_desc") query = query.sort({ price: -1 });
    if (sortBy === "rating_desc") query = query.sort({ rating: -1 });
    if (sortBy === "newest") query = query.sort({ createdAt: -1 });

    const products = await query.exec();

    res.json(products);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
