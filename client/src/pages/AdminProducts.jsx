import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Package, Plus, Edit2, Trash2, X } from "lucide-react";
import "../assets/styles/admin.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      setLoading(true);
      const res = await api.get("/products?limit=100"); // Get all products for admin

      // Handle both old format (array) and new format (object with pagination)
      const productData = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];
      setProducts(productData);
    } catch (err) {
      console.error("Lỗi khi fetch sản phẩm:", err);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
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
      setLoading(true);
      await api.post("/products", form);

      setForm({
        name: "",
        price: "",
        image: "",
        description: "",
        type: "",
        category: "",
        detailUrl: "",
      });

      alert("Thêm sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi tạo sản phẩm:", err);
      alert(err.response?.data?.message || "Lỗi khi tạo sản phẩm");
    } finally {
      setLoading(false);
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
      setLoading(true);
      await api.put(`/products/${editingProduct}`, form);

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

      alert("Cập nhật sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi update sản phẩm:", err);
      alert(err.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    try {
      setLoading(true);
      await api.delete(`/products/${id}`);

      alert("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
      alert(err.response?.data?.message || "Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <div>
          <h2 className="admin-title">Quản lý sản phẩm</h2>
          <p className="section-subtitle">
            Danh sách sản phẩm và thông tin chi tiết
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
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
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-content luxury-form"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                className="btn-close-icon"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="admin-form"
              onSubmit={editingProduct ? handleUpdate : handleCreate}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="VD: BLEU DE CHANEL"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Giá (VND) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="VD: 3500000"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Loại</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="">Chọn loại</option>
                    <option value="EDP">Eau de Parfum (EDP)</option>
                    <option value="EDT">Eau de Toilette (EDT)</option>
                    <option value="EDC">Eau de Cologne (EDC)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Men">Pour Homme</option>
                    <option value="Women">Pour Femme</option>
                    <option value="Mini">Miniature</option>
                    <option value="Giftset">Coffret Cadeau</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={handleChange}
                />
                {form.image && (
                  <div className="image-preview">
                    <img src={form.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Link chi tiết sản phẩm</label>
                <input
                  type="text"
                  name="detailUrl"
                  placeholder="/product/detail-url"
                  value={form.detailUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="btn-group">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Đang xử lý..."
                    : editingProduct
                    ? "Cập nhật"
                    : "Thêm mới"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="products-grid">
        {loading && products.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={64} strokeWidth={1} />
            <h3>Chưa có sản phẩm nào</h3>
            <p>Bắt đầu thêm sản phẩm đầu tiên của bạn</p>
          </div>
        ) : (
          products.map((p) => (
            <div key={p._id} className="product-card-admin">
              <div className="product-image-admin">
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <div className="no-image">
                    <Package size={40} />
                  </div>
                )}
              </div>
              <div className="product-info-admin">
                <h3>{p.name}</h3>
                <div className="product-meta">
                  <span className="product-type">{p.type || "N/A"}</span>
                  <span className="product-category">
                    {p.category || "N/A"}
                  </span>
                </div>
                <p className="product-price">
                  {p.price?.toLocaleString("vi-VN")}₫
                </p>
                {p.description && (
                  <p className="product-description">
                    {p.description.substring(0, 100)}...
                  </p>
                )}
              </div>
              <div className="product-actions">
                <button
                  onClick={() => {
                    handleEdit(p);
                    setShowForm(true);
                  }}
                  className="btn-icon btn-edit"
                  disabled={loading}
                  title="Chỉnh sửa"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn-icon btn-delete"
                  disabled={loading}
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
