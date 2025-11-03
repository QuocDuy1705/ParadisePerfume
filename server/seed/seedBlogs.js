import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";
import connectDB from "../config/db.js";

dotenv.config();

// Sample blogs based on perfume products
const blogs = [
  {
    title: "Chanel No. 5 - Biểu Tượng Nước Hoa Huyền Thoại",
    slug: "chanel-no-5-bieu-tuong-nuoc-hoa-huyen-thoai",
    category: "luxury-brands",
    excerpt:
      "Khám phá câu chuyện đằng sau chai nước hoa huyền thoại Chanel No. 5, biểu tượng của sự sang trọng và quyến rũ vượt thời gian.",
    content: `
      <h2>Lịch Sử Hình Thành</h2>
      <p>Chanel No. 5 ra đời năm 1921, được tạo ra bởi nhà chế tác nước hoa Ernest Beaux theo yêu cầu của Coco Chanel. Đây là chai nước hoa đầu tiên mang tên một con số, thể hiện sự đột phá và hiện đại.</p>

      <h2>Hương Thơm Đặc Trưng</h2>
      <p>Chanel No. 5 là một kiệt tác của nhóm hương Floral Aldehyde với:</p>
      <ul>
        <li><strong>Hương đầu:</strong> Aldehyde, Neroli, Ylang-Ylang</li>
        <li><strong>Hương giữa:</strong> Hoa hồng, Hoa nhài, Hoa huệ</li>
        <li><strong>Hương cuối:</strong> Xạ hương, Gỗ đàn hương, Vani</li>
      </ul>

      <h2>Ai Nên Sử Dụng?</h2>
      <p>Chanel No. 5 phù hợp với:</p>
      <ul>
        <li>Phụ nữ trưởng thành, tự tin và quyền lực</li>
        <li>Những dịp quan trọng, sự kiện trang trọng</li>
        <li>Mùa thu đông, tạo cảm giác ấm áp và sang trọng</li>
      </ul>

      <h2>Cách Sử Dụng</h2>
      <p>Xịt nước hoa lên các điểm mạch: cổ tay, sau tai, khuỷu tay. Hương thơm sẽ phát tán từ từ và lưu hương cực lâu (8-12 giờ).</p>

      <blockquote>
        "A woman who doesn't wear perfume has no future." - Coco Chanel
      </blockquote>

      <h2>Giá Cả & Mua Ở Đâu?</h2>
      <p>Chanel No. 5 có giá từ 2.5 triệu - 8 triệu VNĐ tùy dung tích. Mua tại Paradise Perfume để đảm bảo chính hãng 100%.</p>
    `,
    image: "uploads/blog/chanel-no5.jpg",
    author: "Paradise Team",
    tags: ["Chanel", "Luxury", "Women", "Classic", "Floral"],
    published: true,
    metaDescription:
      "Tìm hiểu về Chanel No. 5 - chai nước hoa huyền thoại với hương thơm Floral Aldehyde đặc trưng, biểu tượng của sự sang trọng.",
    metaKeywords:
      "Chanel No 5, nước hoa Chanel, perfume luxury, hương hoa cổ điển",
  },

  {
    title: "Dior Sauvage - Hương Thơm Nam Tính Mạnh Mẽ",
    slug: "dior-sauvage-huong-thom-nam-tinh-manh-me",
    category: "brands",
    excerpt:
      "Dior Sauvage - Hương thơm nam tính, mạnh mẽ và quyến rũ. Tìm hiểu tại sao Sauvage trở thành best-seller toàn cầu.",
    content: `
      <h2>Giới Thiệu Dior Sauvage</h2>
      <p>Ra mắt năm 2015, Dior Sauvage nhanh chóng trở thành một trong những dòng nước hoa nam bán chạy nhất thế giới. Được sáng tạo bởi François Demachy, Sauvage thể hiện sự hoang dã, tự do và nam tính.</p>

      <h2>Phân Tích Hương Thơm</h2>
      <p>Dior Sauvage thuộc nhóm hương Aromatic Fougere:</p>
      <ul>
        <li><strong>Hương đầu:</strong> Bergamot Calabria tươi mát</li>
        <li><strong>Hương giữa:</strong> Tiêu Sichuan cay nồng, Hoa oải hương</li>
        <li><strong>Hương cuối:</strong> Ambroxan ấm áp, Vani, Gỗ tuyết tùng</li>
      </ul>

      <h2>Đặc Điểm Nổi Bật</h2>
      <ul>
        <li>✨ Hương thơm tươi mát nhưng vẫn ấm áp, nam tính</li>
        <li>⏰ Lưu hương 6-8 giờ, tỏa hương tốt</li>
        <li>🌍 Phù hợp mọi mùa, đặc biệt mùa hè</li>
        <li>👔 Dùng hàng ngày, đi làm hoặc dạo phố</li>
      </ul>

      <h2>Phiên Bản Nào Phù Hợp?</h2>
      <p>Dòng Sauvage có 3 phiên bản chính:</p>
      <ul>
        <li><strong>Sauvage EDT:</strong> Tươi mát, nhẹ nhàng - phù hợp mùa hè</li>
        <li><strong>Sauvage EDP:</strong> Đậm đà hơn, có thêm vani - đa năng nhất</li>
        <li><strong>Sauvage Parfum:</strong> Sang trọng, ấm áp - dành cho mùa đông</li>
      </ul>

      <h2>Lời Khuyên Từ Paradise</h2>
      <p>Nếu bạn mới bắt đầu tìm hiểu về nước hoa nam, Dior Sauvage EDP là lựa chọn an toàn. Hương thơm dễ chịu, được nhiều người yêu thích và phù hợp mọi lứa tuổi từ 20-50.</p>
    `,
    image: "uploads/blog/dior-sauvage.jpg",
    author: "Paradise Team",
    tags: ["Dior", "Men", "Aromatic", "Best Seller", "Fresh"],
    published: true,
    metaDescription:
      "Review chi tiết Dior Sauvage - nước hoa nam bán chạy nhất. Phân tích hương thơm, độ lưu hương và cách chọn phiên bản phù hợp.",
    metaKeywords:
      "Dior Sauvage, nước hoa nam, perfume for men, aromatic fougere",
  },

  {
    title: "Cách Chọn Nước Hoa Phù Hợp Với Từng Mùa",
    slug: "cach-chon-nuoc-hoa-phu-hop-voi-tung-mua",
    category: "how-to-choose",
    excerpt:
      "Hướng dẫn chi tiết cách lựa chọn nước hoa phù hợp với từng mùa trong năm để tối ưu hương thơm và sự thoải mái.",
    content: `
      <h2>Tại Sao Phải Chọn Nước Hoa Theo Mùa?</h2>
      <p>Nhiệt độ và độ ẩm ảnh hưởng lớn đến cách hương thơm phát tán. Chọn đúng nước hoa theo mùa giúp bạn:</p>
      <ul>
        <li>Tránh cảm giác nặng mùi, ngộp thở</li>
        <li>Tối ưu độ lưu hương và tỏa hương</li>
        <li>Phù hợp với không khí và hoạt động</li>
      </ul>

      <h2>Mùa Xuân (Tháng 2-4)</h2>
      <p><strong>Đặc điểm:</strong> Thời tiết dịu mát, hoa nở rộ</p>
      <p><strong>Nên chọn:</strong></p>
      <ul>
        <li>Hương hoa tươi mát: Hoa nhài, hoa huệ, hoa hồng</li>
        <li>Nhóm Floral, Green, Light Citrus</li>
        <li>Ví dụ: Chanel Chance Eau Tendre, Gucci Flora</li>
      </ul>

      <h2>Mùa Hè (Tháng 5-8)</h2>
      <p><strong>Đặc điểm:</strong> Nóng, ẩm, nhiều mồ hôi</p>
      <p><strong>Nên chọn:</strong></p>
      <ul>
        <li>Hương tươi mát, nhẹ nhàng</li>
        <li>Citrus (cam, chanh), Aquatic (biển cả), Fruity</li>
        <li>EDT hoặc Cologne (nồng độ nhẹ)</li>
        <li>Ví dụ: Versace Dylan Blue, Dolce & Gabbana Light Blue</li>
      </ul>

      <h2>Mùa Thu (Tháng 9-11)</h2>
      <p><strong>Đặc điểm:</strong> Mát mẻ, khô ráo</p>
      <p><strong>Nên chọn:</strong></p>
      <ul>
        <li>Hương ấm áp, mùi gỗ</li>
        <li>Woody, Spicy, Amber</li>
        <li>EDP hoặc Parfum</li>
        <li>Ví dụ: Tom Ford Oud Wood, Dior Homme Intense</li>
      </ul>

      <h2>Mùa Đông (Tháng 12-1)</h2>
      <p><strong>Đặc điểm:</strong> Lạnh, khô, cần sự ấm áp</p>
      <p><strong>Nên chọn:</strong></p>
      <ul>
        <li>Hương nồng, ngọt ngào, ấm áp</li>
        <li>Oriental, Gourmand, Heavy Floral</li>
        <li>EDP hoặc Parfum (lưu hương lâu)</li>
        <li>Ví dụ: Yves Saint Laurent Black Opium, Viktor&Rolf Flowerbomb</li>
      </ul>

      <h2>Bảng Tóm Tắt</h2>
      <table>
        <tr>
          <th>Mùa</th>
          <th>Nhóm Hương</th>
          <th>Nồng Độ</th>
        </tr>
        <tr>
          <td>Xuân</td>
          <td>Floral, Green</td>
          <td>EDT</td>
        </tr>
        <tr>
          <td>Hè</td>
          <td>Citrus, Aquatic</td>
          <td>EDT, Cologne</td>
        </tr>
        <tr>
          <td>Thu</td>
          <td>Woody, Spicy</td>
          <td>EDP</td>
        </tr>
        <tr>
          <td>Đông</td>
          <td>Oriental, Gourmand</td>
          <td>EDP, Parfum</td>
        </tr>
      </table>

      <h2>Lời Khuyên Từ Paradise</h2>
      <p>Đừng quá khắt khe với quy tắc! Nếu bạn yêu thích một mùi hương, hãy dùng quanh năm nhưng điều chỉnh số lần xịt:</p>
      <ul>
        <li>Mùa hè: 2-3 lần xịt</li>
        <li>Mùa đông: 4-5 lần xịt</li>
      </ul>
    `,
    image: "uploads/blog/seasonal-perfume.jpg",
    author: "Paradise Expert",
    tags: ["Hướng dẫn", "Mùa", "Tips", "Beginner"],
    published: true,
    metaDescription:
      "Hướng dẫn chọn nước hoa theo 4 mùa: xuân hè thu đông. Phân tích nhóm hương, nồng độ phù hợp cho từng thời điểm trong năm.",
    metaKeywords:
      "chọn nước hoa theo mùa, perfume seasonal guide, hương thơm mùa hè",
  },

  {
    title: "Bí Quyết Bảo Quản Nước Hoa Để Giữ Hương Thơm Lâu Dài",
    slug: "bi-quyet-bao-quan-nuoc-hoa-de-giu-huong-thom-lau-dai",
    category: "perfume-care",
    excerpt:
      "10 bí quyết bảo quản nước hoa đúng cách giúp chai nước hoa yêu thích của bạn giữ được chất lượng và hương thơm lâu nhất.",
    content: `
      <h2>Tại Sao Cần Bảo Quản Nước Hoa?</h2>
      <p>Nước hoa là hỗn hợp phức tạp của các tinh dầu, cồn và nước. Nếu bảo quản sai cách, hương thơm có thể:</p>
      <ul>
        <li>❌ Biến đổi, mất mùi ban đầu</li>
        <li>❌ Màu sắc đổi sang vàng sẫm, nâu</li>
        <li>❌ Giảm độ lưu hương và tỏa hương</li>
        <li>❌ Gây kích ứng da</li>
      </ul>

      <h2>10 Bí Quyết Bảo Quản Nước Hoa</h2>

      <h3>1. Tránh Ánh Sáng Trực Tiếp</h3>
      <p>☀️ <strong>Vấn đề:</strong> Tia UV phá hủy cấu trúc phân tử hương thơm</p>
      <p>✅ <strong>Giải pháp:</strong> Cất trong tủ, hộp hoặc nơi tối</p>

      <h3>2. Nhiệt Độ Ổn Định</h3>
      <p>🌡️ <strong>Nhiệt độ lý tưởng:</strong> 15-20°C</p>
      <p>❌ <strong>Tránh:</strong> Gần cửa sổ, điều hòa, sưởi ấm</p>
      <p>✅ <strong>Nơi tốt:</strong> Ngăn kéo, tủ quần áo</p>

      <h3>3. Độ Ẩm Thấp</h3>
      <p>💧 <strong>Tránh:</strong> Phòng tắm (độ ẩm cao)</p>
      <p>✅ <strong>Lý tưởng:</strong> Phòng ngủ, tủ kín</p>

      <h3>4. Giữ Nguyên Chai</h3>
      <p>🍾 Không nên chuyển sang chai nhỏ hơn vì:</p>
      <ul>
        <li>Tiếp xúc không khí nhiều hơn</li>
        <li>Mất tính thẩm mỹ của chai gốc</li>
        <li>Dễ bị oxy hóa</li>
      </ul>

      <h3>5. Đậy Nắp Kín</h3>
      <p>🔒 Sau khi xịt, luôn đậy nắp ngay để:</p>
      <ul>
        <li>Tránh cồn bay hơi</li>
        <li>Giảm tiếp xúc với không khí</li>
        <li>Bảo vệ vòi xịt</li>
      </ul>

      <h3>6. Tránh Lắc Chai</h3>
      <p>⚠️ Lắc mạnh sẽ tạo bọt khí, làm oxy hóa nước hoa nhanh hơn</p>

      <h3>7. Không Để Gần Nước Hoa Khác</h3>
      <p>👃 Các mùi hương mạnh có thể "lây nhiễm" qua không khí</p>

      <h3>8. Kiểm Tra Hạn Sử Dụng</h3>
      <p>📅 Nước hoa thường có tuổi thọ:</p>
      <ul>
        <li><strong>Đã mở:</strong> 1-3 năm</li>
        <li><strong>Chưa mở:</strong> 3-5 năm</li>
        <li><strong>Nước hoa tự nhiên:</strong> 6-12 tháng</li>
      </ul>

      <h3>9. Bảo Quản Hộp Carton</h3>
      <p>📦 Hộp carton gốc:</p>
      <ul>
        <li>Chống ánh sáng tốt</li>
        <li>Giữ nhiệt độ ổn định</li>
        <li>Bảo vệ chai khỏi va đập</li>
      </ul>

      <h3>10. Dùng Thường Xuyên</h3>
      <p>💪 Nước hoa để quá lâu cũng dễ hỏng. Hãy sử dụng đều đặn!</p>

      <h2>Dấu Hiệu Nước Hoa Hỏng</h2>
      <ul>
        <li>🎨 Màu sắc đổi sang vàng đậm hoặc nâu</li>
        <li>👃 Mùi hương thay đổi, xuất hiện mùi chua hoặc tanh</li>
        <li>💧 Kết tủa, đục</li>
        <li>⏰ Độ lưu hương giảm rõ rệt</li>
      </ul>

      <h2>Checklist Bảo Quản</h2>
      <ul>
        <li>✅ Cất trong tủ tối, khô ráo</li>
        <li>✅ Nhiệt độ 15-20°C</li>
        <li>✅ Đậy nắp kín sau khi dùng</li>
        <li>✅ Giữ nguyên hộp carton</li>
        <li>✅ Tránh phòng tắm</li>
        <li>✅ Kiểm tra định kỳ</li>
      </ul>

      <blockquote>
        "Một chai nước hoa được bảo quản tốt có thể giữ nguyên chất lượng đến 5 năm!" - Paradise Expert
      </blockquote>
    `,
    image: "uploads/blog/perfume-storage.jpg",
    author: "Paradise Expert",
    tags: ["Bảo quản", "Tips", "Chăm sóc", "Hướng dẫn"],
    published: true,
    metaDescription:
      "10 bí quyết bảo quản nước hoa đúng cách: tránh ánh sáng, nhiệt độ ổn định, giữ nguyên chai. Hướng dẫn chi tiết từ chuyên gia.",
    metaKeywords: "bảo quản nước hoa, cách giữ nước hoa, perfume storage tips",
  },

  {
    title: "Top 5 Nước Hoa Mini Size Đáng Mua Nhất 2024",
    slug: "top-5-nuoc-hoa-mini-size-dang-mua-nhat-2024",
    category: "general",
    excerpt:
      "Khám phá 5 chai nước hoa mini size bán chạy nhất tại Paradise - hoàn hảo cho việc thử hương, du lịch hoặc làm quà tặng.",
    content: `
      <h2>Tại Sao Nên Chọn Nước Hoa Mini?</h2>
      <p>Nước hoa mini (5-15ml) đang trở thành xu hướng hot vì:</p>
      <ul>
        <li>💰 <strong>Tiết kiệm:</strong> Giá chỉ 300k-800k</li>
        <li>👜 <strong>Tiện lợi:</strong> Bỏ túi, mang đi du lịch</li>
        <li>🎁 <strong>Quà tặng:</strong> Sang trọng, ý nghĩa</li>
        <li>👃 <strong>Thử hương:</strong> Test trước khi mua chai lớn</li>
        <li>🔄 <strong>Đa dạng:</strong> Sở hữu nhiều mùi khác nhau</li>
      </ul>

      <h2>Top 5 Nước Hoa Mini Bán Chạy</h2>

      <h3>1. Dior Sauvage EDT (10ml) - 450,000đ</h3>
      <p><strong>Phù hợp:</strong> Nam, mọi lứa tuổi</p>
      <p><strong>Hương thơm:</strong> Tươi mát, cay nồng, nam tính</p>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>✨ Best-seller toàn cầu</li>
        <li>⏰ Lưu hương 6-8h</li>
        <li>🌞 Dùng hàng ngày, mọi mùa</li>
      </ul>

      <h3>2. Chanel Coco Mademoiselle EDP (7.5ml) - 680,000đ</h3>
      <p><strong>Phù hợp:</strong> Nữ 20-40 tuổi</p>
      <p><strong>Hương thơm:</strong> Hoa cam, hoa hồng, vani</p>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>👗 Sang trọng, quyến rũ</li>
        <li>💼 Đi làm, dự tiệc</li>
        <li>⏰ Lưu hương 10-12h</li>
      </ul>

      <h3>3. Versace Eros (5ml) - 350,000đ</h3>
      <p><strong>Phù hợp:</strong> Nam trẻ, năng động</p>
      <p><strong>Hương thơm:</strong> Bạc hà, vani, gỗ tuyết tùng</p>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>💪 Mạnh mẽ, quyến rũ</li>
        <li>🌙 Đi chơi tối, hẹn hò</li>
        <li>💙 Chai xanh dương đẹp mắt</li>
      </ul>

      <h3>4. YSL Black Opium (7.5ml) - 620,000đ</h3>
      <p><strong>Phù hợp:</strong> Nữ cá tính, hiện đại</p>
      <p><strong>Hương thơm:</strong> Cà phê, vani, hoa cam</p>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>☕ Hương cà phê độc đáo</li>
        <li>🌙 Phù hợp buổi tối</li>
        <li>🔥 Gợi cảm, ấm áp</li>
      </ul>

      <h3>5. Tom Ford Oud Wood (10ml) - 850,000đ</h3>
      <p><strong>Phù hợp:</strong> Nam/nữ yêu hương gỗ</p>
      <p><strong>Hương thơm:</strong> Trầm hương, gỗ đàn, vani</p>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>👑 Cao cấp, sang trọng</li>
        <li>❄️ Mùa thu đông</li>
        <li>💼 Doanh nhân, sự kiện quan trọng</li>
      </ul>

      <h2>Bảng So Sánh</h2>
      <table>
        <tr>
          <th>Tên</th>
          <th>Giá</th>
          <th>Size</th>
          <th>Dành cho</th>
        </tr>
        <tr>
          <td>Dior Sauvage</td>
          <td>450k</td>
          <td>10ml</td>
          <td>Nam</td>
        </tr>
        <tr>
          <td>Chanel Coco</td>
          <td>680k</td>
          <td>7.5ml</td>
          <td>Nữ</td>
        </tr>
        <tr>
          <td>Versace Eros</td>
          <td>350k</td>
          <td>5ml</td>
          <td>Nam</td>
        </tr>
        <tr>
          <td>YSL Black Opium</td>
          <td>620k</td>
          <td>7.5ml</td>
          <td>Nữ</td>
        </tr>
        <tr>
          <td>Tom Ford Oud</td>
          <td>850k</td>
          <td>10ml</td>
          <td>Unisex</td>
        </tr>
      </table>

      <h2>Lời Khuyên Từ Paradise</h2>
      <p>🎁 <strong>Combo quà tặng:</strong> Mua 3 chai mini (1 nam + 2 nữ) giảm 15%, chỉ còn 1.5 triệu!</p>
      <p>💼 <strong>Set du lịch:</strong> 5 chai mini đa dạng mùi hương, túi đựng sang trọng - 2.2 triệu</p>

      <blockquote>
        "Nước hoa mini là cách tốt nhất để khám phá phong cách của bạn mà không tốn kém!" - Paradise Team
      </blockquote>
    `,
    image: "uploads/blog/mini-perfumes.jpg",
    author: "Paradise Team",
    tags: ["Mini", "Top 5", "Best Seller", "Gift"],
    published: true,
    metaDescription:
      "Top 5 nước hoa mini đáng mua: Dior Sauvage, Chanel Coco, Versace Eros, YSL Black Opium, Tom Ford Oud Wood. Giá từ 350k-850k.",
    metaKeywords:
      "nước hoa mini, perfume mini size, nước hoa du lịch, quà tặng",
  },
];

const seedBlogs = async () => {
  try {
    await connectDB();

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("✅ Đã xóa blogs cũ");

    // Insert new blogs
    const createdBlogs = await Blog.insertMany(blogs);
    console.log(`✅ Đã tạo ${createdBlogs.length} blogs mới`);

    console.log("\n📝 Danh sách blogs:");
    createdBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} (${blog.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

seedBlogs();
