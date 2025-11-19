import { Leaf, Recycle, Heart, Award } from "lucide-react";
import "../../assets/styles/info-pages.css";

export default function SustainabilityPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">PHÁT TRIỂN BỀN VỮNG</h1>
          <p className="info-subtitle">
            Paradise cam kết bảo vệ môi trường và phát triển bền vững, mang đến
            những sản phẩm chất lượng đồng thời tôn trọng thiên nhiên và cộng
            đồng.
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <Leaf className="card-icon" />
            <h3 className="card-title">THÀNH PHẦN TỰ NHIÊN</h3>
            <p className="card-text">
              Ưu tiên sử dụng nguyên liệu thiên nhiên, chiết xuất từ thực vật,
              an toàn cho sức khỏe và môi trường.
            </p>
          </div>

          <div className="info-card">
            <Recycle className="card-icon" />
            <h3 className="card-title">BAO BÌ TÁI CHẾ</h3>
            <p className="card-text">
              Sử dụng vật liệu tái chế, có thể tái sử dụng, giảm thiểu rác thải
              nhựa và ô nhiễm môi trường.
            </p>
          </div>

          <div className="info-card">
            <Heart className="card-icon" />
            <h3 className="card-title">TRÁCH NHIỆM XÃ HỘI</h3>
            <p className="card-text">
              Đóng góp cho cộng đồng qua các chương trình từ thiện, hỗ trợ giáo
              dục và chăm sóc sức khỏe.
            </p>
          </div>

          <div className="info-card">
            <Award className="card-icon" />
            <h3 className="card-title">CHỨNG NHẬN QUỐC TẾ</h3>
            <p className="card-text">
              Sản phẩm đạt các chứng nhận về an toàn, chất lượng và thân thiện
              với môi trường.
            </p>
          </div>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">CAM KẾT CỦA PARADISE</h2>
            <p className="section-text">
              Chúng tôi tin rằng vẻ đẹp không nên đánh đổi bằng sự hủy hoại môi
              trường. Vì vậy, Paradise cam kết:
            </p>
            <ul className="info-list">
              <li>
                Chọn lọc sản phẩm từ các thương hiệu có trách nhiệm với môi
                trường
              </li>
              <li>Sử dụng bao bì tái chế, phân hủy sinh học</li>
              <li>Giảm thiểu rác thải nhựa trong vận chuyển và đóng gói</li>
              <li>Hỗ trợ các dự án trồng cây, bảo vệ rừng</li>
              <li>Không kinh doanh sản phẩm thử nghiệm trên động vật</li>
              <li>Đóng góp 1% doanh thu cho các tổ chức môi trường</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">CHƯƠNG TRÌNH TÁI CHẾ</h2>
            <h3 className="section-subtitle">Đổi chai cũ lấy quà</h3>
            <p className="section-text">
              Mang chai nước hoa đã sử dụng hết đến cửa hàng Paradise, bạn sẽ
              nhận được:
            </p>
            <ul className="info-list">
              <li>Voucher giảm 50,000₫ cho đơn hàng tiếp theo</li>
              <li>Sample nước hoa miễn phí</li>
              <li>Tích điểm thành viên Paradise Club</li>
            </ul>
            <p className="section-text" style={{ marginTop: "20px" }}>
              Các chai này sẽ được Paradise thu gom và gửi đến trung tâm tái chế
              chuyên nghiệp, tránh gây ô nhiễm môi trường.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">HOẠT ĐỘNG CỘNG ĐỒNG</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Trồng cây xanh</h3>
                <p className="timeline-text">
                  Mỗi đơn hàng bán ra, Paradise đóng góp tiền trồng 1 cây xanh.
                  Đến nay, chúng tôi đã trồng hơn 10,000 cây trên khắp Việt Nam.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Hỗ trợ giáo dục</h3>
                <p className="timeline-text">
                  Tài trợ học bổng cho học sinh, sinh viên vùng khó khăn và xây
                  dựng thư viện cho các trường học vùng sâu vùng xa.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Chăm sóc sức khỏe</h3>
                <p className="timeline-text">
                  Tổ chức các chương trình khám bệnh miễn phí, tặng quà cho
                  người cao tuổi và trẻ em có hoàn cảnh khó khăn.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">MỤC TIÊU 2030</h2>
            <ul className="info-list">
              <li>
                100% bao bì sử dụng vật liệu tái chế hoặc phân hủy sinh học
              </li>
              <li>Giảm 50% lượng khí thải carbon trong vận chuyển</li>
              <li>Hợp tác với 100% thương hiệu có cam kết bền vững</li>
              <li>Trồng 100,000 cây xanh trên toàn quốc</li>
              <li>Hỗ trợ giáo dục cho 1,000 học sinh vùng khó khăn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
