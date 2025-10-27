import React, { useState } from "react";
import { Star } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import axios from "axios";
import "../assets/styles/reviews.css";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showError("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      showError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        showError("Vui lòng đăng nhập để đánh giá");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          productId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSuccess("Cảm ơn bạn đã đánh giá!");

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");

      // Callback to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showError(
        error.response?.data?.message ||
          "Không thể gửi đánh giá. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h3 className="review-form-title">ÉCRIRE UN AVIS</h3>

      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="form-group">
          <label className="form-label">Votre note *</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                className={`rating-star ${
                  star <= (hoverRating || rating) ? "filled" : ""
                }`}
                fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="review-title">
            Titre de l'avis *
          </label>
          <input
            type="text"
            id="review-title"
            className="form-input"
            placeholder="Résumez votre expérience..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <span className="char-count">{title.length}/100</span>
        </div>

        {/* Comment */}
        <div className="form-group">
          <label className="form-label" htmlFor="review-comment">
            Votre avis *
          </label>
          <textarea
            id="review-comment"
            className="form-textarea"
            placeholder="Partagez votre expérience avec ce parfum..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={5}
            required
          />
          <span className="char-count">{comment.length}/1000</span>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-review-btn" disabled={loading}>
          {loading ? "ENVOI EN COURS..." : "PUBLIER L'AVIS"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
