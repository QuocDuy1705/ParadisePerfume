import React from "react";
import "../assets/styles/loading.css";

const LoadingFallback = () => {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner-large"></div>
      <p className="loading-text">ĐANG TẢI...</p>
    </div>
  );
};

export default LoadingFallback;
