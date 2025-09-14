import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/admin.css";

const API_URL = "http://localhost:5000/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    type: "",
    category: "",
    detailUrl: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi fetch sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/products`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: "",
        price: "",
        image: "",
        description: "",
        type: "",
        category: "",
        detailUrl: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi tạo sản phẩm:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      type: product.type,
      category: product.category,
      detailUrl: product.detailUrl,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/products/${editingProduct}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProduct(null);
      setForm({
        name: "",
        price: "",
        image: "",
        description: "",
        type: "",
        category: "",
        detailUrl: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi update sản phẩm:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
    }
  };

  return (
    <div className="admin-section">
      <h2 className="admin-title">Quản lý sản phẩm</h2>

      {/* FORM */}
      <div className="admin-card">
        <form
          className="admin-form"
          onSubmit={editingProduct ? handleUpdate : handleCreate}
        >
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="URL hình ảnh"
            value={form.image}
            onChange={handleChange}
          />
          <input
            type="text"
            name="type"
            placeholder="Loại (EDP, EDT...)"
            value={form.type}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Danh mục (Men, Women, Mini, Giftset)"
            value={form.category}
            onChange={handleChange}
          />
          <input
            type="text"
            name="detailUrl"
            placeholder="Link chi tiết sản phẩm"
            value={form.detailUrl}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
          />
          <div className="btn-group">
            <button type="submit" className="btn-primary">
              {editingProduct ? "Cập nhật" : "Thêm mới"}
            </button>
            {editingProduct && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditingProduct(null);
                  setForm({
                    name: "",
                    price: "",
                    image: "",
                    description: "",
                    type: "",
                    category: "",
                    detailUrl: "",
                  });
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Giá</th>
              <th>Ảnh</th>
              <th>Loại</th>
              <th>Danh mục</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Chưa có sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: "50px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </td>
                  <td>{p.type}</td>
                  <td>{p.category}</td>
                  <td className="desc-col">{p.description}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} className="btn-edit">
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
