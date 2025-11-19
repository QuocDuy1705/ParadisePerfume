import React, { useState, useEffect } from "react";
import axios from "axios";
import Rating from "./Rating";
import { ThumbsUp, CheckCircle } from "lucide-react";
import { showSuccess, showError } from "../../../core/utils/toast";
import "../../../assets/styles/reviews.css";

const ReviewList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/reviews/product/${productId}?page=${page}&limit=10&sort=${sortBy}`
      );

      setReviews(response.data.reviews);
      setStats(response.data.stats);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, page, sortBy, refreshTrigger]);

  const handleMarkHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Vui lòng đăng nhập");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/reviews/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess("Cảm ơn phản hồi của bạn!");
      fetchReviews(); // Refresh to show updated count
    } catch (error) {
      console.error("Error marking helpful:", error);
      showError("Không thể đánh dấu hữu ích");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (loading && page === 1) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải đánh giá...</p>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* Reviews Header with Stats */}
      {stats && (
        <div className="reviews-header">
          <div className="reviews-summary">
            <div className="average-rating">
              <div className="rating-number">
                {stats.averageRating.toFixed(1)}
              </div>
              <Rating
                rating={stats.averageRating}
                numReviews={stats.totalReviews}
                size={20}
              />
            </div>

            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  stats[
                    `${["one", "two", "three", "four", "five"][star - 1]}Star${
                      star === 1 ? "" : "s"
                    }`
                  ] || 0;
                const percentage =
                  stats.totalReviews > 0
                    ? (count / stats.totalReviews) * 100
                    : 0;

                return (
                  <div key={star} className="rating-bar-row">
                    <span className="star-label">{star} sao</span>
                    <div className="rating-bar">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="rating-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div className="reviews-controls">
            <label htmlFor="sort-select" className="sort-label">
              SẮP XẾP THEO:
            </label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Đánh giá cao nhất</option>
              <option value="lowest">Đánh giá thấp nhất</option>
              <option value="helpful">Hữu ích nhất</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
        </div>
      ) : (
        <>
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.user?.firstName?.[0] || "U"}
                    </div>
                    <div>
                      <div className="reviewer-name">
                        {review.user?.firstName} {review.user?.lastName?.[0]}.
                        {review.verified && (
                          <CheckCircle
                            size={16}
                            className="verified-badge"
                            title="Đã mua hàng"
                          />
                        )}
                      </div>
                      <div className="review-date">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Rating rating={review.rating} showCount={false} size={18} />
                </div>

                <h4 className="review-title">{review.title}</h4>
                <p className="review-comment">{review.comment}</p>

                <div className="review-footer">
                  <button
                    className="helpful-btn"
                    onClick={() => handleMarkHelpful(review._id)}
                  >
                    <ThumbsUp size={16} />
                    Hữu ích ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="reviews-pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Trang trước
              </button>
              <span className="page-info">
                Trang {page} / {totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
