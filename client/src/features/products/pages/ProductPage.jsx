// src/pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // lấy từ .env

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      }
    };

    fetchProducts();
  }, [API_URL]);

  return (
    <div className="px-10 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Fragrance</h1>

      {/* Filter */}
      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 border rounded">Filters</button>
      </div>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="text-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[300px] object-cover mb-4"
            />
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-500">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
