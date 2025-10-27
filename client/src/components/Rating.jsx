import React from "react";
import { Star } from "lucide-react";
import "../assets/styles/rating.css";

const Rating = ({
  rating,
  numReviews,
  size = 16,
  showCount = true,
  interactive = false,
  onRatingChange,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="rating-container">
      <div className="rating-stars">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <Star
            key={`full-${index}`}
            size={size}
            fill="currentColor"
            className={`star star-filled ${
              interactive ? "star-interactive" : ""
            }`}
            onClick={() => handleStarClick(index + 1)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="star-half-wrapper" key="half">
            <Star
              size={size}
              className={`star star-empty ${
                interactive ? "star-interactive" : ""
              }`}
              onClick={() => handleStarClick(fullStars + 1)}
              style={{ cursor: interactive ? "pointer" : "default" }}
            />
            <Star
              size={size}
              fill="currentColor"
              className={`star star-half ${
                interactive ? "star-interactive" : ""
              }`}
              onClick={() => handleStarClick(fullStars + 1)}
              style={{ cursor: interactive ? "pointer" : "default" }}
            />
          </div>
        )}

        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <Star
            key={`empty-${index}`}
            size={size}
            className={`star star-empty ${
              interactive ? "star-interactive" : ""
            }`}
            onClick={() =>
              handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + index + 1)
            }
            style={{ cursor: interactive ? "pointer" : "default" }}
          />
        ))}
      </div>

      {showCount && numReviews !== undefined && (
        <span className="rating-count">
          ({numReviews} {numReviews === 1 ? "avis" : "avis"})
        </span>
      )}
    </div>
  );
};

export default Rating;
