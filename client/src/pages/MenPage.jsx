import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CategoryBanner from "../components/CategoryBanner";
import "../assets/styles/home.css";

const MenPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy banner category
        const catRes = await axios.get("/api/categories/Men");
        setCategory(catRes.data);

        // Lấy sản phẩm của category
        const prodRes = await axios.get("/api/products/category/Men");
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Lỗi fetch MenPage:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Banner chính */}
      {category && (
        <CategoryBanner
          image={category.bannerUrl}
          subtitle={category.subtitle}
          title={category.name}
          buttonText="DISCOVER THE NEW FRAGRANCE"
        />
      )}

      {/* 3 sản phẩm đầu */}
      <section className="category-section">
        <div className="product-grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner phụ giống Chanel */}
      <div className="product-banner">
        <h2>NEW</h2>
        <h3>BLEU DE CHANEL L’EXCLUSIF</h3>
        <p>
          The ultimate, most mysterious expression of BLEU DE CHANEL, in a
          woody, ambery-aromatic scent with an intense trail.
        </p>
        <button>SHOP NOW</button>
        <div className="banner-media">
          {/* <img src="/images/chanel-banner.jpg" alt="Chanel Banner" /> */}

          <video controls>
            <source src="/videos/chanel.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* 6 sản phẩm tiếp theo */}
      <section className="category-section">
        <div className="product-grid">
          {products.slice(3, 9).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MenPage;
