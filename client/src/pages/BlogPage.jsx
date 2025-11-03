import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/styles/blog.css";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "brands", label: "Nhãn hiệu" },
    { value: "fragrance-types", label: "Phân loại hương" },
    { value: "how-to-choose", label: "Cách chọn" },
    { value: "perfume-care", label: "Bảo quản" },
    { value: "luxury-brands", label: "Thương hiệu cao cấp" },
    { value: "general", label: "Tổng hợp" },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("published", "true");
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const url = `http://localhost:5000/api/blogs?${params.toString()}`;
      console.log("🔍 Fetching blogs from:", url);

      const response = await axios.get(url);
      console.log("📝 Blogs response:", response.data);
      console.log("📊 Number of blogs:", response.data.blogs?.length || 0);

      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Không thể tải bài viết. Kiểm tra console để biết chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>BLOG PARADISE</h1>
        <p>Khám phá thế giới nước hoa cùng Paradise</p>
      </div>

      <div className="blog-container">
        {/* Category Filter */}
        <div className="blog-filters">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn ${
                selectedCategory === cat.value ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="blog-loading">Đang tải bài viết...</div>
        ) : blogs.length === 0 ? (
          <div className="blog-empty">
            <p>Chưa có bài viết nào được xuất bản</p>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <Link
                to={`/blog/${blog.slug}`}
                key={blog._id}
                className="blog-card"
              >
                <div className="blog-image">
                  <img
                    src={
                      blog.image
                        ? blog.image // Đường dẫn đã là /images/blog/xxx.jpg
                        : "/images/blog/default.jpg"
                    }
                    alt={blog.title}
                    onError={(e) => {
                      e.target.src = "/images/blog/default.jpg";
                    }}
                  />
                  <span className="blog-category">
                    {getCategoryLabel(blog.category)}
                  </span>
                </div>
                <div className="blog-content">
                  <h2>{blog.title}</h2>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-author">
                      {blog.author || "Paradise"}
                    </span>
                    <span className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <span className="read-more">Đọc thêm →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
