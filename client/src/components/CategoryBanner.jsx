import React from "react";
import "../assets/styles/categoryBanner.css";

const CategoryBanner = ({
  image,
  subtitle,
  title,
  buttonText,
  description,
}) => {
  return (
    <div className="category-banner-wrapper">
      {/* Banner */}
      <div className="category-banner">
        <img src={image} alt={title} className="banner-img" />
        <div className="banner-overlay">
          {subtitle && <h3>{subtitle}</h3>}
          {title && <h1>{title}</h1>}
          {buttonText && <button>{buttonText}</button>}
        </div>
      </div>

      {/* Description dưới banner */}
      {description && (
        <div className="banner-description">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBanner;
