import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Calendar, User, Eye, Tag, ArrowLeft } from "lucide-react";
import "../../../assets/styles/blog.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/blogs/${slug}`
      );
      setBlog(response.data);

      // Fetch related blogs
      if (response.data.category) {
        fetchRelatedBlogs(response.data.category, response.data._id);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Không thể tải bài viết");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, currentBlogId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/blogs?category=${category}&published=true`
      );
      // Filter out current blog and limit to 3
      const filtered = response.data.blogs
        .filter((b) => b._id !== currentBlogId)
        .slice(0, 3);
      setRelatedBlogs(filtered);
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      brands: "Nhãn hiệu",
      "fragrance-types": "Phân loại hương",
      "how-to-choose": "Cách chọn",
      "perfume-care": "Bảo quản",
      "luxury-brands": "Thương hiệu cao cấp",
      general: "Tổng hợp",
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="spinner"></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-error">
        <h2>Không tìm thấy bài viết</h2>
        <Link to="/blog" className="back-to-blog">
          Quay lại trang blog
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Back Button */}
      <div className="blog-detail-container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={20} />
          Quay lại
        </Link>

        {/* Blog Header */}
        <header className="blog-detail-header">
          <div className="blog-detail-meta">
            <span className="blog-detail-category">
              {getCategoryLabel(blog.category)}
            </span>
            <div className="blog-detail-info">
              <span className="meta-item">
                <Calendar size={16} />
                {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="meta-item">
                <User size={16} />
                {blog.author || "Paradise"}
              </span>
              <span className="meta-item">
                <Eye size={16} />
                {blog.views || 0} lượt xem
              </span>
            </div>
          </div>

          <h1 className="blog-detail-title">{blog.title}</h1>

          {blog.excerpt && (
            <p className="blog-detail-excerpt">{blog.excerpt}</p>
          )}
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="blog-detail-image">
            <img
              src={blog.image}
              alt={blog.title}
              onError={(e) => {
                e.target.src = "/images/blog/default.jpg";
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="blog-detail-content">
          <div
            className="blog-content-html"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-detail-tags">
            <Tag size={18} />
            <div className="tags-list">
              {blog.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="related-blogs">
            <h2>Bài viết liên quan</h2>
            <div className="related-blogs-grid">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  to={`/blog/${relatedBlog.slug}`}
                  key={relatedBlog._id}
                  className="related-blog-card"
                >
                  <div className="related-blog-image">
                    <img
                      src={
                        relatedBlog.image
                          ? relatedBlog.image
                          : "/images/blog/default.jpg"
                      }
                      alt={relatedBlog.title}
                      onError={(e) => {
                        e.target.src = "/images/blog/default.jpg";
                      }}
                    />
                  </div>
                  <div className="related-blog-content">
                    <h3>{relatedBlog.title}</h3>
                    <p>{relatedBlog.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
