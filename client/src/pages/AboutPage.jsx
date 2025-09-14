// AboutPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/about.css";

const AboutPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        {categories[0] && (
          <>
            <img
              src={categories[0].bannerUrl}
              alt={categories[0].name}
              className="hero-image"
            />
            <div className="hero-overlay">
              <h1 className="hero-title">Paradise Parfum</h1>
              <p className="hero-subtitle">
                {categories[0].subtitle ||
                  "The Art of Timeless Elegance & Modern Luxury"}
              </p>
            </div>
          </>
        )}
      </section>

      {/* Story Section */}
      <section className="about-section">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Paradise Parfum ra đời từ khát vọng tạo nên những mùi hương vượt
            thời gian – sang trọng, tinh tế và hiện đại. Chúng tôi tin rằng một
            hương thơm đích thực không chỉ là phụ kiện, mà là ngôn ngữ để kể câu
            chuyện của bạn.
          </p>
        </div>
        <div className="about-image">
          {categories[1] && (
            <img src={categories[1].bannerUrl} alt={categories[1].name} />
          )}
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="about-section reverse">
        <div className="about-image">
          {categories[2] && (
            <img src={categories[2].bannerUrl} alt={categories[2].name} />
          )}
        </div>
        <div className="about-text">
          <h2>Craftsmanship</h2>
          <p>
            Mỗi sản phẩm Paradise được chế tác tỉ mỉ bởi những nghệ nhân nước
            hoa bậc thầy, kết hợp tinh hoa văn hóa và nghệ thuật hiện đại. Từng
            nốt hương, từng chi tiết thiết kế đều phản chiếu sự hoàn hảo và đẳng
            cấp.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-section">
        <div className="about-text">
          <h2>Philosophy</h2>
          <p>
            Chúng tôi tin rằng hương thơm là một phần bản sắc cá nhân, là sự kết
            nối vô hình nhưng bền chặt. Paradise Parfum không chỉ mang lại mùi
            hương, mà còn là sự tự tin, phong thái và dấu ấn riêng biệt của bạn.
          </p>
        </div>
        <div className="about-image">
          {categories[3] && (
            <img src={categories[3].bannerUrl} alt={categories[3].name} />
          )}
        </div>
      </section>

      {/* Lifestyle */}
      <section className="about-lifestyle">
        <h2>The Essence of Luxury</h2>
        <p>
          Paradise Parfum là lựa chọn của những ai yêu sự tối giản, nhưng vẫn
          khát khao sự khác biệt. Một giọt hương, một dấu ấn – khẳng định phong
          cách sống đẳng cấp và tinh tế.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
