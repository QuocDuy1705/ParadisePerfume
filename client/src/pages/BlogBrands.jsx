import React from "react";
import "../assets/styles/blog.css";

const BlogBrands = () => {
  const brands = [
    {
      name: "Chanel",
      description:
        "Biểu tượng của sự sang trọng và thanh lịch Pháp, nổi tiếng với Chanel No.5",
      signature: "Chanel No.5, Coco Mademoiselle, Bleu de Chanel",
      history:
        "Được thành lập năm 1910 bởi Coco Chanel, thương hiệu đã tạo nên cuộc cách mạng trong ngành nước hoa với Chanel No.5 - mùi hương mang tính biểu tượng nhất mọi thời đại.",
    },
    {
      name: "Dior",
      description: "Tinh hoa của thời trang và nước hoa cao cấp Pháp",
      signature: "Sauvage, Miss Dior, J'adore",
      history:
        "Christian Dior ra mắt nước hoa đầu tiên Miss Dior vào năm 1947, đánh dấu sự khởi đầu của một đế chế nước hoa xa xỉ.",
    },
    {
      name: "Versace",
      description: "Phong cách Ý táo bạo, quyến rũ và đầy cá tính",
      signature: "Eros, Dylan Blue, Bright Crystal",
      history:
        "Gianni Versace mang đến những mùi hương gợi cảm, mạnh mẽ phản ánh triết lý thiết kế táo bạo của thương hiệu.",
    },
    {
      name: "Tom Ford",
      description: "Nước hoa hiện đại, sang trọng với hương thơm độc đáo",
      signature: "Black Orchid, Oud Wood, Tobacco Vanille",
      history:
        "Tom Ford Private Blend Collection được ra mắt năm 2006, tạo nên chuẩn mực mới cho nước hoa niche cao cấp.",
    },
    {
      name: "Gucci",
      description: "Sự kết hợp giữa truyền thống Ý và phong cách đương đại",
      signature: "Gucci Bloom, Guilty, Flora",
      history:
        "Từ năm 1974, Gucci đã tạo ra những mùi hương iconic phản ánh sự sang trọng và phong cách đặc trưng của thương hiệu.",
    },
    {
      name: "Hermès",
      description: "Nghệ thuật chế tác nước hoa tinh tế của Pháp",
      signature: "Terre d'Hermès, Twilly, Un Jardin sur le Nil",
      history:
        "Hermès mang triết lý nghệ thuật thủ công vào nước hoa, tạo nên những mùi hương tinh tế, thanh lịch.",
    },
  ];

  return (
    <div className="blog-article">
      <div className="article-hero">
        <h1>NHÃN HIỆU NƯỚC HOA NỔI TIẾNG</h1>
        <p className="article-date">Cập nhật: November 2025</p>
      </div>

      <div className="article-container">
        <div className="article-intro">
          <p>
            Thế giới nước hoa được định hình bởi những thương hiệu xa xỉ với
            lịch sử lâu đời và những sáng tạo hương thơm đỉnh cao. Cùng khám phá
            các nhãn hiệu nước hoa mà Paradise đang phân phối.
          </p>
        </div>

        {brands.map((brand, index) => (
          <div className="brand-section" key={index}>
            <h2>{brand.name}</h2>
            <p className="brand-description">{brand.description}</p>

            <div className="brand-info">
              <h3>Dòng sản phẩm nổi bật:</h3>
              <p>{brand.signature}</p>
            </div>

            <div className="brand-history">
              <h3>Lịch sử:</h3>
              <p>{brand.history}</p>
            </div>
          </div>
        ))}

        <div className="article-footer">
          <p>
            Tất cả các thương hiệu trên đều có mặt tại Paradise với giá cả cạnh
            tranh và cam kết 100% chính hãng. Liên hệ ngay để được tư vấn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogBrands;
