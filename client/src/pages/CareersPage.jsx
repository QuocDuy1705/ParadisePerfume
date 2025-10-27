import { Briefcase, Heart, TrendingUp, Users } from "lucide-react";
import "../assets/styles/info-pages.css";

export default function CareersPage() {
  const positions = [
    {
      title: "Chuyên Viên Tư Vấn Nước Hoa",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
    },
    {
      title: "Marketing Manager",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
    },
    {
      title: "E-Commerce Specialist",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
    },
    {
      title: "Nhân Viên Kho",
      location: "Hà Nội",
      type: "Full-time",
    },
  ];

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">TUYỂN DỤNG</h1>
          <p className="info-subtitle">
            Gia nhập đội ngũ Paradise - Nơi đam mê được thăng hoa và tài năng
            được tôn vinh. Cùng chúng tôi tạo nên những trải nghiệm mua sắm đẳng
            cấp cho khách hàng.
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <Heart className="card-icon" />
            <h3 className="card-title">MÔI TRƯỜNG SÁNG TẠO</h3>
            <p className="card-text">
              Làm việc trong không gian hiện đại, chuyên nghiệp với văn hóa
              doanh nghiệp cởi mở và khuyến khích sáng tạo.
            </p>
          </div>

          <div className="info-card">
            <TrendingUp className="card-icon" />
            <h3 className="card-title">PHÁT TRIỂN SỰ NGHIỆP</h3>
            <p className="card-text">
              Lộ trình thăng tiến rõ ràng, đào tạo bài bản và cơ hội học hỏi từ
              các chuyên gia hàng đầu trong ngành.
            </p>
          </div>

          <div className="info-card">
            <Users className="card-icon" />
            <h3 className="card-title">ĐỒI NGŨ TÀI NĂNG</h3>
            <p className="card-text">
              Làm việc cùng những người đồng nghiệp tài năng, nhiệt huyết và
              luôn sẵn sàng hỗ trợ lẫn nhau.
            </p>
          </div>

          <div className="info-card">
            <Briefcase className="card-icon" />
            <h3 className="card-title">QUYỀN LỢI HẤP DẪN</h3>
            <p className="card-text">
              Lương cạnh tranh, thưởng hiệu suất, bảo hiểm đầy đủ, và nhiều phúc
              lợi khác dành cho nhân viên.
            </p>
          </div>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">VỊ TRÍ ĐANG TUYỂN DỤNG</h2>
            {positions.map((position, index) => (
              <div
                key={index}
                style={{
                  padding: "25px",
                  border: "1px solid #e5e5e5",
                  marginBottom: "20px",
                  backgroundColor: "#fafafa",
                }}
              >
                <h3
                  className="section-subtitle"
                  style={{ marginBottom: "10px" }}
                >
                  {position.title}
                </h3>
                <p className="section-text" style={{ margin: 0 }}>
                  📍 {position.location} • {position.type}
                </p>
                <a
                  href="/contact"
                  style={{
                    display: "inline-block",
                    marginTop: "15px",
                    padding: "12px 30px",
                    backgroundColor: "#000",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    border: "1px solid #000",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.color = "#000";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#000";
                    e.target.style.color = "#fff";
                  }}
                >
                  Ứng tuyển ngay
                </a>
              </div>
            ))}
          </div>

          <div className="content-section">
            <h2 className="section-title">QUYỀN LỢI NHÂN VIÊN</h2>
            <ul className="info-list">
              <li>Lương cơ bản cạnh tranh + Thưởng doanh số + KPI</li>
              <li>Thưởng tháng 13, thưởng lễ Tết, thưởng hiệu suất</li>
              <li>Bảo hiểm xã hội, y tế, thất nghiệp theo quy định</li>
              <li>Chế độ nghỉ phép 12 ngày/năm + nghỉ lễ, Tết theo quy định</li>
              <li>Giảm giá 30-50% khi mua sản phẩm Paradise</li>
              <li>Đào tạo kiến thức sản phẩm, kỹ năng bán hàng định kỳ</li>
              <li>Team building, du lịch hàng năm</li>
              <li>Môi trường làm việc chuyên nghiệp, hiện đại</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">QUY TRÌNH TUYỂN DỤNG</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">1. Nộp hồ sơ</h3>
                <p className="timeline-text">
                  Gửi CV (tiếng Việt hoặc tiếng Anh) kèm thư xin việc về email
                  careers@paradise.vn hoặc qua form tuyển dụng trên website.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">2. Sơ tuyển hồ sơ</h3>
                <p className="timeline-text">
                  Bộ phận HR sẽ xem xét hồ sơ và liên hệ với ứng viên phù hợp
                  trong vòng 5-7 ngày làm việc.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">3. Phỏng vấn</h3>
                <p className="timeline-text">
                  Phỏng vấn 1-2 vòng với HR và trưởng bộ phận. Có thể bao gồm
                  test chuyên môn tùy vị trí.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">4. Nhận việc</h3>
                <p className="timeline-text">
                  Nhận thông báo kết quả và ký hợp đồng lao động. Onboarding và
                  bắt đầu làm việc.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section" style={{ textAlign: "center" }}>
            <h2 className="section-subtitle">Sẵn sàng gia nhập Paradise?</h2>
            <p className="section-text" style={{ marginBottom: "30px" }}>
              Gửi CV của bạn về careers@paradise.vn hoặc liên hệ hotline 1800
              123 456 để biết thêm chi tiết.
            </p>
            <a href="mailto:careers@paradise.vn" className="submit-btn">
              GỬI CV NGAY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
