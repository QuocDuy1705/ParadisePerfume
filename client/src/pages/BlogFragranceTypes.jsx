import React from "react";
import "../assets/styles/blog.css";

const BlogFragranceTypes = () => {
  const fragranceTypes = [
    {
      name: "Floral (Hương Hoa)",
      description:
        "Nhóm hương phổ biến nhất, chiếm hơn 30% thị trường nước hoa nữ",
      notes: "Hoa hồng, hoa nhài, hoa lily, hoa huệ, hoa violet",
      suitable:
        "Phụ nữ yêu thích sự nữ tính, lãng mạn. Phù hợp mọi dịp từ văn phòng đến dạ tiệc",
      examples: "Chanel Coco Mademoiselle, Dior Miss Dior, Gucci Bloom",
    },
    {
      name: "Woody (Hương Gỗ)",
      description: "Hương ấm áp, trầm mặc, thường xuất hiện trong nước hoa nam",
      notes: "Gỗ đàn hương, gỗ tuyết tùng, vetiver, gỗ oud",
      suitable:
        "Nam giới trưởng thành, phong cách lịch lãm. Thích hợp cho buổi tối, mùa thu đông",
      examples: "Tom Ford Oud Wood, Dior Sauvage, Hermès Terre d'Hermès",
    },
    {
      name: "Oriental (Hương Phương Đông)",
      description: "Hương nồng nàn, gợi cảm với gia vị và hổ phách",
      notes: "Vani, hổ phách, xạ hương, nhựa thơm, gia vị",
      suitable: "Người tự tin, quyến rũ. Thích hợp cho buổi tối, dạ tiệc",
      examples: "Yves Saint Laurent Opium, Tom Ford Black Orchid, Versace Eros",
    },
    {
      name: "Fresh (Hương Tươi Mát)",
      description: "Hương nhẹ nhàng, sảng khoái với cam quýt và nước biển",
      notes: "Cam bergamot, chanh, bạc hà, nước biển, trà xanh",
      suitable: "Mọi giới tính, đặc biệt phù hợp mùa hè và ban ngày",
      examples:
        "Chanel Allure Homme Sport, Acqua di Gio, Dolce & Gabbana Light Blue",
    },
    {
      name: "Gourmand (Hương Ngọt Ngào)",
      description: "Hương thơm ngọt như thức ăn với vani, caramel, chocolate",
      notes: "Vani, caramel, chocolate, coffee, mật ong",
      suitable: "Phụ nữ trẻ trung, ngọt ngào. Thích hợp mùa đông",
      examples:
        "Viktor & Rolf Flowerbomb, Prada Candy, Lancôme La Vie Est Belle",
    },
    {
      name: "Chypre (Hương Xanh Rêu)",
      description: "Hương thanh lịch kết hợp cam quýt, rêu sồi và gỗ",
      notes: "Cam bergamot, rêu sồi, gỗ, patchouli",
      suitable: "Người trưởng thành, phong cách cổ điển. Thích hợp mùa thu",
      examples: "Chanel Coco, Dior Miss Dior Cherie",
    },
  ];

  return (
    <div className="blog-article">
      <div className="article-hero">
        <h1>PHÂN LOẠI HƯƠNG THƠM NƯỚC HOA</h1>
        <p className="article-date">Cập nhật: November 2025</p>
      </div>

      <div className="article-container">
        <div className="article-intro">
          <p>
            Hiểu rõ các nhóm hương sẽ giúp bạn dễ dàng tìm được mùi hương phù
            hợp với phong cách và sở thích. Dưới đây là 6 nhóm hương chính trong
            thế giới nước hoa.
          </p>
        </div>

        {fragranceTypes.map((type, index) => (
          <div className="fragrance-section" key={index}>
            <h2>{type.name}</h2>
            <p className="fragrance-description">{type.description}</p>

            <div className="fragrance-info">
              <h3>Hương liệu chính:</h3>
              <p>{type.notes}</p>
            </div>

            <div className="fragrance-suitable">
              <h3>Phù hợp với:</h3>
              <p>{type.suitable}</p>
            </div>

            <div className="fragrance-examples">
              <h3>Ví dụ:</h3>
              <p>{type.examples}</p>
            </div>
          </div>
        ))}

        <div className="article-footer">
          <h3>Lời khuyên từ Paradise:</h3>
          <p>
            Đừng giới hạn bản thân trong một nhóm hương. Thử nghiệm các mùi
            hương khác nhau để tìm ra điều phù hợp nhất. Paradise có đầy đủ các
            dòng nước hoa từ fresh đến oriental, hãy ghé shop để được tư vấn và
            thử mùi miễn phí!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogFragranceTypes;
