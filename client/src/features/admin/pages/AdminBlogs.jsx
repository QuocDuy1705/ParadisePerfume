import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaFileAlt as FileText,
  FaPlus as Plus,
  FaEdit as Edit2,
  FaTrash as Trash2,
  FaEye as Eye,
  FaEyeSlash as EyeOff,
} from "react-icons/fa";
import RichTextEditor from "../components/RichTextEditor";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogDetail, setLoadingBlogDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "general",
    excerpt: "",
    content: "",
    author: "Paradise Team",
    tags: "",
    published: false,
    metaDescription: "",
    metaKeywords: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    { value: "brands", label: "Nhãn Hiệu Nước Hoa" },
    { value: "fragrance-types", label: "Phân Loại Hương Thơm" },
    { value: "how-to-choose", label: "Cách Chọn Nước Hoa" },
    { value: "perfume-care", label: "Bảo Quản Nước Hoa" },
    { value: "luxury-brands", label: "Thương Hiệu Cao Cấp" },
    { value: "general", label: "Tổng Hợp" },
  ];

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/blogs", {
        params: { published: undefined }, // Get all blogs for admin
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📝 Admin blogs response:", res.data);
      setBlogs(res.data.blogs || res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Không thể tải danh sách blog");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === "title" && !editingBlog) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh không được vượt quá 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open modal for creating new blog
  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      category: "general",
      excerpt: "",
      content: "",
      author: "Paradise Team",
      tags: "",
      published: false,
      metaDescription: "",
      metaKeywords: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  // Open modal for editing blog
  // Open modal for editing blog
  const handleEdit = async (blog) => {
    try {
      setLoadingBlogDetail(true);

      // Fetch full blog details including content
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/blogs/id/${blog._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fullBlog = response.data;
      console.log("📝 Full blog data for editing:", fullBlog);

      setEditingBlog(fullBlog);
      setFormData({
        title: fullBlog.title || "",
        slug: fullBlog.slug || "",
        category: fullBlog.category || "general",
        excerpt: fullBlog.excerpt || "",
        content: fullBlog.content || "",
        author: fullBlog.author || "Paradise Team",
        tags: fullBlog.tags ? fullBlog.tags.join(", ") : "",
        published: fullBlog.published || false,
        metaDescription: fullBlog.metaDescription || "",
        metaKeywords: fullBlog.metaKeywords
          ? fullBlog.metaKeywords.join(", ")
          : "",
      });

      // Set image preview
      if (fullBlog.image) {
        // Đường dẫn đã là /images/blog/xxx.jpg, dùng trực tiếp
        setImagePreview(fullBlog.image);
      } else {
        setImagePreview(null);
      }

      setImageFile(null);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Không thể tải thông tin blog để chỉnh sửa");
    } finally {
      setLoadingBlogDetail(false);
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Submitting blog with data:", formData);
    console.log("🖼️ Image file:", imageFile);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingBlog) {
        // Update existing blog
        console.log("✏️ Updating blog:", editingBlog._id);
        const response = await axios.put(
          `http://localhost:5000/api/blogs/${editingBlog._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("✅ Update response:", response.data);
        toast.success("Cập nhật blog thành công");
      } else {
        // Create new blog
        console.log("➕ Creating new blog");
        const response = await axios.post(
          "http://localhost:5000/api/blogs",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("✅ Create response:", response.data);
        toast.success("Tạo blog mới thành công");
      }

      setShowModal(false);
      fetchBlogs();
    } catch (error) {
      console.error("❌ Error saving blog:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu blog"
      );
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa blog này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa blog thành công");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Không thể xóa blog");
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/blogs/${id}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cập nhật trạng thái thành công");
      fetchBlogs();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <div>
          <h2>
            <FileText size={24} />
            Quản Lý Blog
          </h2>
          <p>Quản lý bài viết blog trên website</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Thêm Blog Mới
        </button>
      </div>

      <div className="blogs-table">
        <table>
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>Tiêu Đề</th>
              <th>Danh Mục</th>
              <th>Tác Giả</th>
              <th>Lượt Xem</th>
              <th>Trạng Thái</th>
              <th>Ngày Tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Chưa có bài viết nào
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img
                      src={
                        blog.image
                          ? blog.image // Đường dẫn đã là /images/blog/xxx.jpg
                          : "/images/blog/brands.svg"
                      }
                      alt={blog.title}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td>
                    <strong>{blog.title}</strong>
                    <br />
                    <small style={{ color: "#666" }}>{blog.slug}</small>
                  </td>
                  <td>
                    {categories.find((c) => c.value === blog.category)?.label ||
                      blog.category}
                  </td>
                  <td>{blog.author}</td>
                  <td>{blog.views}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        blog.published ? "published" : "draft"
                      }`}
                    >
                      {blog.published ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </td>
                  <td>
                    {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleTogglePublish(blog._id)}
                        title={
                          blog.published ? "Ẩn bài viết" : "Xuất bản bài viết"
                        }
                      >
                        {blog.published ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(blog)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(blog._id)}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content blog-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{editingBlog ? "Chỉnh Sửa Blog" : "Thêm Blog Mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            {loadingBlogDetail ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <p>Đang tải thông tin blog...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Tiêu Đề *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tiêu đề bài viết"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="url-bai-viet"
                    />
                  </div>
                  <div className="form-group">
                    <label>Danh Mục *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Mô Tả Ngắn (Excerpt) *</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                      rows="2"
                      maxLength="200"
                      placeholder="Mô tả ngắn gọn về bài viết (tối đa 200 ký tự)"
                    />
                    <small>{formData.excerpt.length}/200 ký tự</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Nội Dung *</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) =>
                        setFormData({ ...formData, content })
                      }
                      height={500}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hình Ảnh</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          marginTop: "10px",
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label>Tác Giả</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Paradise Team"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tags (phân cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="nước hoa, chanel, tips"
                    />
                  </div>
                  <div className="form-group">
                    <label>Meta Keywords (SEO)</label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="keyword1, keyword2"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Meta Description (SEO)</label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      rows="2"
                      maxLength="160"
                      placeholder="Mô tả ngắn cho SEO (tối đa 160 ký tự)"
                    />
                    <small>{formData.metaDescription.length}/160 ký tự</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                      />
                      <span>Xuất bản ngay</span>
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingBlog ? "Cập Nhật" : "Tạo Mới"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
