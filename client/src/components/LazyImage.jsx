import React, { useState, useEffect } from "react";

const LazyImage = ({ src, alt, className, style, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(
    placeholder ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3C/svg%3E"
  );
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                setIsLoaded(true);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: "75px",
          }
        );
        observer.observe(imageRef);
      } else {
        // Fallback without IntersectionObserver
        setImageSrc(src);
        setIsLoaded(true);
      }
    }

    return () => {
      didCancel = true;
      if (observer && observer.unobserve && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className || ""} ${
        isLoaded ? "lazy-loaded" : "lazy-loading"
      }`}
      style={style}
      loading="lazy"
    />
  );
};

export default LazyImage;
