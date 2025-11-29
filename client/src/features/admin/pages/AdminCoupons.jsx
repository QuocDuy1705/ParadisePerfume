import React, { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Check,
  X,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { showSuccess, showError, showWarning } from "../../../core/utils/toast";
import "../../../assets/styles/admin.css";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.discountValue) {
      showWarning("Vui lòng điền mã coupon và giá trị giảm giá!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const couponData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount
          ? Number(formData.minOrderAmount)
          : 0,
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      };

      if (editingCoupon) {
        await axios.put(
          `${API_URL}/api/coupons/${editingCoupon._id}`,
          couponData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSuccess("Cập nhật coupon thành công!");
      } else {
        await axios.post(`${API_URL}/api/coupons`, couponData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSuccess("Tạo coupon thành công!");
      }

      fetchCoupons();
      closeModal();
    } catch (error) {
      console.error("Error saving coupon:", error);
      showError(
        error.response?.data?.message || "Lỗi khi lưu coupon. Vui lòng thử lại!"
      );
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || "",
      maxDiscountAmount: coupon.maxDiscountAmount || "",
      startDate: coupon.startDate
        ? new Date(coupon.startDate).toISOString().split("T")[0]
        : "",
      endDate: coupon.endDate
        ? new Date(coupon.endDate).toISOString().split("T")[0]
        : "",
      usageLimit: coupon.usageLimit || "",
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa coupon này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Xóa coupon thành công!");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      showError("Lỗi khi xóa coupon!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      isActive: true,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    } else {
      return formatCurrency(coupon.discountValue);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>ĐANG TẢI COUPON...</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <div>
          <h2>QUẢN LÝ COUPON</h2>
          <p className="section-subtitle">
            Tạo và quản lý mã giảm giá cho khách hàng
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> TẠO COUPON
        </button>
      </div>

      {/* Coupon Stats */}
      <div
        className="stats-grid"
        style={{ marginBottom: "40px", gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Ticket size={24} />
          </div>
          <div className="stat-content">
            <h3>TỔNG COUPON</h3>
            <div className="stat-value">{coupons.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Check size={24} />
          </div>
          <div className="stat-content">
            <h3>ĐANG HOẠT ĐỘNG</h3>
            <div className="stat-value">
              {coupons.filter((c) => c.isActive).length}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>ĐÃ SỬ DỤNG</h3>
            <div className="stat-value">
              {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>MÃ COUPON</th>
              <th>MÔ TẢ</th>
              <th>GIẢM GIÁ</th>
              <th>ĐƠN TỐI THIỂU</th>
              <th>GIỚI HẠN</th>
              <th>ĐÃ DÙNG</th>
              <th>HẾT HẠN</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="empty-state">
                    <Ticket
                      size={48}
                      style={{ opacity: 0.2, marginBottom: "16px" }}
                    />
                    <h3>CHƯA CÓ COUPON</h3>
                    <p>Tạo coupon đầu tiên để bắt đầu</p>
                  </div>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <strong
                      style={{
                        letterSpacing: "2px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {coupon.code}
                    </strong>
                  </td>
                  <td className="desc-col">{coupon.description || "—"}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        borderRadius: "2px",
                        background:
                          coupon.discountType === "percentage"
                            ? "#000"
                            : "#fafafa",
                        color:
                          coupon.discountType === "percentage"
                            ? "#fff"
                            : "#000",
                        fontSize: "12px",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        border: "1px solid #e5e5e5",
                      }}
                    >
                      {formatDiscount(coupon)}
                    </span>
                  </td>
                  <td>
                    {coupon.minOrderAmount > 0
                      ? formatCurrency(coupon.minOrderAmount)
                      : "—"}
                  </td>
                  <td>{coupon.usageLimit || "∞"}</td>
                  <td>
                    <strong>{coupon.usedCount || 0}</strong>
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </td>
                  <td>
                    {coupon.endDate ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Calendar size={14} />
                        {new Date(coupon.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        coupon.isActive ? "published" : "draft"
                      }`}
                    >
                      {coupon.isActive ? "HOẠT ĐỘNG" : "TẠM DỪNG"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(coupon)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(coupon._id)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create/Edit Coupon */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content luxury-form"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{editingCoupon ? "CHỈNH SỬA COUPON" : "TẠO COUPON MỚI"}</h3>
              <button className="btn-close-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>MÃ COUPON *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="VD: SUMMER2024"
                    required
                    style={{ textTransform: "uppercase" }}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>MÔ TẢ</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả về chương trình khuyến mãi..."
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>LOẠI GIẢM GIÁ *</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>GIÁ TRỊ GIẢM *</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={
                      formData.discountType === "percentage"
                        ? "VD: 10"
                        : "VD: 50000"
                    }
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>ĐƠN HÀNG TỐI THIỂU (VNĐ)</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleInputChange}
                    placeholder="VD: 500000"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>GIẢM TỐI ĐA (VNĐ)</label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    value={formData.maxDiscountAmount}
                    onChange={handleInputChange}
                    placeholder="VD: 100000"
                    min="0"
                  />
                  <small
                    style={{
                      color: "#666",
                      fontSize: "11px",
                      marginTop: "4px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Chỉ áp dụng cho giảm theo %
                  </small>
                </div>

                <div className="form-group">
                  <label>NGÀY BẮT ĐẦU</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>NGÀY KẾT THÚC</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>GIỚI HẠN SỐ LẦN SỬ DỤNG</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Để trống nếu không giới hạn"
                    min="1"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textTransform: "none",
                      fontWeight: "400",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      style={{ width: "auto", margin: 0 }}
                    />
                    Kích hoạt coupon ngay
                  </label>
                </div>
              </div>

              <div className="btn-group">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                >
                  HỦY
                </button>
                <button type="submit" className="btn-primary">
                  {editingCoupon ? "CẬP NHẬT" : "TẠO COUPON"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
