import React from "react";
import "../../../assets/styles/blog.css";

const BlogLuxuryBrands = () => {
  const luxuryBrands = [
    {
      name: "Creed",
      origin: "Anh Quốc",
      founded: "1760",
      description:
        "Thương hiệu nước hoa hoàng gia lâu đời nhất thế giới, được yêu thích bởi Napoleon III, Queen Victoria và nhiều hoàng gia châu Âu.",
      signature: "Aventus, Green Irish Tweed, Silver Mountain Water",
      priceRange: "8,000,000 - 15,000,000 VNĐ",
      specialty:
        "Sử dụng nguyên liệu thiên nhiên cao cấp nhất, chiết xuất thủ công theo công thức gia truyền 260 năm.",
    },
    {
      name: "Clive Christian",
      origin: "Anh Quốc",
      founded: "1999",
      description:
        "Được Guinness công nhận là nước hoa đắt nhất thế giới với phiên bản No.1 Imperial Majesty có chai nạm kim cương.",
      signature: "No.1, X, 1872",
      priceRange: "12,000,000 - 70,000,000 VNĐ",
      specialty:
        "Chai nước hoa đính vương miện 24K, sử dụng nguyên liệu quý hiếm nhất. Mỗi chai là một tác phẩm nghệ thuật.",
    },
    {
      name: "Roja Parfums",
      origin: "Anh Quốc",
      founded: "2011",
      description:
        "Được tạo ra bởi Roja Dove - 'Vua của nước hoa', người có khứu giác được bảo hiểm 5 triệu bảng.",
      signature: "Enigma, Elysium, Scandal",
      priceRange: "15,000,000 - 50,000,000 VNĐ",
      specialty:
        "Sử dụng tỷ lệ tinh dầu cao nhất (40-50%), nguyên liệu quý hiếm như oud tự nhiên, hoa nhài Grasse.",
    },
    {
      name: "Amouage",
      origin: "Oman",
      founded: "1983",
      description:
        "Thương hiệu nước hoa của hoàng gia Oman, được mệnh danh là 'Hermès của nước hoa'.",
      signature: "Interlude, Reflection, Jubilation XXV",
      priceRange: "8,000,000 - 25,000,000 VNĐ",
      specialty:
        "Kết hợp hương phương Đông truyền thống với kỹ thuật châu Âu hiện đại. Chai đựng là tác phẩm nghệ thuật Lalique.",
    },
    {
      name: "Maison Francis Kurkdjian",
      origin: "Pháp",
      founded: "2009",
      description:
        "Được tạo ra bởi Francis Kurkdjian - 'thiên tài nước hoa' đứng sau hàng trăm best-seller như Le Male, Narciso Rodriguez.",
      signature: "Baccarat Rouge 540, Aqua Universalis, Grand Soir",
      priceRange: "6,000,000 - 20,000,000 VNĐ",
      specialty:
        "Nghệ thuật pha trộn hoàn hảo, chai đựng sang trọng. Baccarat Rouge 540 là must-have của giới thượng lưu.",
    },
    {
      name: "Xerjoff",
      origin: "Ý",
      founded: "2003",
      description:
        "Thương hiệu niche cao cấp kết hợp nghệ thuật, thời trang và nước hoa. Sử dụng nguyên liệu quý hiếm nhất.",
      signature: "Naxos, Alexandria II, Erba Pura",
      priceRange: "7,000,000 - 30,000,000 VNĐ",
      specialty:
        "Bộ sưu tập Oud Stars với oud tự nhiên 30 năm tuổi. Chai đựng đá quý và vàng 24K.",
    },
    {
      name: "Parfums de Marly",
      origin: "Pháp",
      founded: "2009",
      description:
        "Lấy cảm hứng từ thời kỳ hoàng gia Pháp thế kỷ 18 dưới triều đại Louis XV - thời kỳ hoàng kim của nước hoa.",
      signature: "Layton, Delina, Percival",
      priceRange: "6,000,000 - 15,000,000 VNĐ",
      specialty:
        "Phong cách hoàng gia thanh lịch, chai đựng in hình ngựa chiến - biểu tượng của sức mạnh và quý tộc.",
    },
    {
      name: "Byredo",
      origin: "Thụy Điển",
      founded: "2006",
      description:
        "Thương hiệu niche hiện đại được yêu thích bởi celebrities. Mỗi mùi hương kể một câu chuyện, một ký ức.",
      signature: "Gypsy Water, Bal d'Afrique, Mojave Ghost",
      priceRange: "5,500,000 - 12,000,000 VNĐ",
      specialty:
        "Minimalist Scandinavia, hương thơm độc đáo khó quên. Packaging đơn giản nhưng sang trọng tối đa.",
    },
    {
      name: "Le Labo",
      origin: "Mỹ",
      founded: "2006",
      description:
        "Thương hiệu artisan với triết lý 'Hand-made, soul crafted'. Mỗi chai được pha chế tươi khi khách đặt hàng.",
      signature: "Santal 33, Another 13, Rose 31",
      priceRange: "5,000,000 - 18,000,000 VNĐ",
      specialty:
        "Nhãn chai ghi tên khách hàng và ngày pha chế. Mỗi chai là duy nhất, không chai nào giống chai nào.",
    },
    {
      name: "Frederic Malle",
      origin: "Pháp",
      founded: "2000",
      description:
        "Nhà xuất bản nước hoa (Editions de Parfums), mời các 'master perfumer' tạo ra kiệt tác không giới hạn chi phí.",
      signature: "Portrait of a Lady, Musc Ravageur, Carnal Flower",
      priceRange: "7,000,000 - 25,000,000 VNĐ",
      specialty:
        "Mỗi mùi hương là tác phẩm nghệ thuật độc lập. Không có ngân sách, không có giới hạn sáng tạo.",
    },
  ];

  return (
    <div className="blog-article">
      <div className="article-hero">
        <h1>THƯƠNG HIỆU NƯỚC HOA CAO CẤP</h1>
        <p className="article-date">Cập nhật: November 2025</p>
      </div>

      <div className="article-container">
        <div className="article-intro">
          <p>
            Ngoài các thương hiệu designer như Chanel, Dior, thế giới nước hoa
            còn có một tầng lớp cao cấp hơn - "Niche Perfume" và "Haute
            Parfumerie". Đây là những thương hiệu dành cho giới sành điệu, tìm
            kiếm sự độc đáo và đẳng cấp.
          </p>
          <p className="luxury-intro">
            <strong>Tại sao gọi là "Cao cấp"?</strong>
          </p>
          <ul className="luxury-reasons">
            <li>Sử dụng nguyên liệu quý hiếm nhất thế giới</li>
            <li>Tỷ lệ tinh dầu cao (20-50% thay vì 10-20%)</li>
            <li>Sản xuất số lượng giới hạn, không bán đại trà</li>
            <li>Giá từ 5-70 triệu VNĐ/chai</li>
            <li>Hương thơm độc đáo, không bị 'đụng hàng'</li>
          </ul>
        </div>

        {luxuryBrands.map((brand, index) => (
          <div className="luxury-brand-section" key={index}>
            <div className="luxury-brand-header">
              <h2>{brand.name}</h2>
              <div className="brand-meta">
                <span className="brand-origin">{brand.origin}</span>
                <span className="brand-founded">Est. {brand.founded}</span>
              </div>
            </div>

            <p className="luxury-description">{brand.description}</p>

            <div className="luxury-info-grid">
              <div className="luxury-info-item">
                <h3>Dòng Sản Phẩm Nổi Bật</h3>
                <p>{brand.signature}</p>
              </div>

              <div className="luxury-info-item">
                <h3>Phân Khúc Giá</h3>
                <p className="price-range">{brand.priceRange}</p>
              </div>
            </div>

            <div className="luxury-specialty">
              <h3>Điểm Đặc Biệt</h3>
              <p>{brand.specialty}</p>
            </div>
          </div>
        ))}

        <div className="luxury-tips-section">
          <h2>Cách Nhận Biết Nước Hoa Cao Cấp Chính Hãng</h2>

          <div className="authenticity-tips">
            <div className="auth-tip">
              <h3>1. Packaging Sang Trọng</h3>
              <p>
                Hộp carton dày, in sắc nét, không lỗi chính tả. Có certificate
                of authenticity, booklet giới thiệu.
              </p>
            </div>

            <div className="auth-tip">
              <h3>2. Chai Đựng Cao Cấp</h3>
              <p>
                Thủy tinh nặng, chắc tay, nắp đóng khít. Một số thương hiệu dùng
                pha lê Baccarat, Lalique. Nhãn dán hoàn hảo, không bong tróc.
              </p>
            </div>

            <div className="auth-tip">
              <h3>3. Batch Code Và Barcode</h3>
              <p>
                Check batch code trên checkfresh.com hoặc checkcosmetic.net.
                Barcode khớp với xuất xứ thương hiệu.
              </p>
            </div>

            <div className="auth-tip">
              <h3>4. Hương Thơm Phức Tạp</h3>
              <p>
                Nước hoa cao cấp có nhiều tầng hương, thay đổi theo thời gian.
                Không chỉ ngọt hay thơm đơn giản.
              </p>
            </div>

            <div className="auth-tip">
              <h3>5. Độ Bền Vượt Trội</h3>
              <p>
                Giữ hương 8-12 giờ, để lại sillage (vệt hương) rõ rệt. Hương
                cuối vẫn sang trọng, không chỉ còn mùi cồn.
              </p>
            </div>
          </div>
        </div>

        <div className="investment-section">
          <h2>Nước Hoa Cao Cấp - Khoản Đầu Tư Xứng Đáng?</h2>

          <div className="investment-pros-cons">
            <div className="pros">
              <h3>✓ Đáng Mua Nếu:</h3>
              <ul>
                <li>Bạn là người sành nước hoa, đã thử nhiều designer brand</li>
                <li>Muốn có mùi hương độc đáo, ít người dùng</li>
                <li>Trân trọng nghệ thuật và nguyên liệu cao cấp</li>
                <li>Tìm kiếm hương giữ lâu, projection mạnh</li>
                <li>Sưu tập nước hoa như một sở thích</li>
              </ul>
            </div>

            <div className="cons">
              <h3>✗ Chưa Cần Thiết Nếu:</h3>
              <ul>
                <li>Mới bắt đầu tìm hiểu nước hoa</li>
                <li>Chưa phân biệt được các nhóm hương cơ bản</li>
                <li>Ngân sách hạn chế (nên bắt đầu với designer)</li>
                <li>Môi trường làm việc yêu cầu hương nhẹ</li>
                <li>Chỉ dùng nước hoa thỉnh thoảng</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="article-footer">
          <h3>Paradise - Đại Lý Ủy Quyền Chính Thức</h3>
          <p>
            Paradise tự hào là đại lý ủy quyền của các thương hiệu niche cao cấp
            tại Việt Nam. Chúng tôi cam kết:
          </p>
          <ul>
            <li>✓ 100% chính hãng, nhập khẩu chính ngạch</li>
            <li>✓ Bảo quản trong kho lạnh chuyên dụng 18°C</li>
            <li>✓ Đổi trả trong 7 ngày nếu phát hiện hàng fake</li>
            <li>✓ Tư vấn chuyên sâu bởi perfume consultant</li>
            <li>✓ Decant mẫu thử miễn phí trước khi mua fullsize</li>
          </ul>
          <p className="contact-info">
            <strong>Liên hệ:</strong>
            Đặt lịch hẹn tư vấn riêng tại Paradise Showroom - Không gian nước
            hoa cao cấp với hơn 300 SKU niche perfume.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogLuxuryBrands;
