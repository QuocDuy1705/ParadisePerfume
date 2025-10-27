import { Package, Truck, Clock, MapPin } from "lucide-react";
import "../assets/styles/info-pages.css";

export default function ShippingPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        {/* Header */}
        <div className="info-header">
          <h1 className="info-title">CHÍNH SÁCH GIAO HÀNG</h1>
          <p className="info-subtitle">
            Paradise cam kết giao hàng nhanh chóng, an toàn và đúng hẹn đến tay
            khách hàng trên toàn quốc.
          </p>
        </div>

        {/* Info Cards */}
        <div className="info-grid">
          <div className="info-card">
            <Truck className="card-icon" />
            <h3 className="card-title">MIỄN PHÍ VẬN CHUYỂN</h3>
            <p className="card-text">
              Miễn phí giao hàng cho đơn hàng từ 1,000,000₫ trở lên trên toàn
              quốc.
            </p>
          </div>

          <div className="info-card">
            <Clock className="card-icon" />
            <h3 className="card-title">GIAO HÀNG NHANH</h3>
            <p className="card-text">
              1-2 ngày cho nội thành TP.HCM, 3-5 ngày cho các tỉnh thành khác.
            </p>
          </div>

          <div className="info-card">
            <Package className="card-icon" />
            <h3 className="card-title">ĐÓNG GÓI CAO CẤP</h3>
            <p className="card-text">
              Sản phẩm được đóng gói cẩn thận với hộp sang trọng, kèm thiệp
              chúc.
            </p>
          </div>

          <div className="info-card">
            <MapPin className="card-icon" />
            <h3 className="card-title">THEO DÕI ĐƠN HÀNG</h3>
            <p className="card-text">
              Cập nhật trạng thái đơn hàng theo thời gian thực qua SMS và email.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">PHẠM VI GIAO HÀNG</h2>
            <p className="section-text">
              Paradise cung cấp dịch vụ giao hàng trên toàn quốc, bao gồm 63
              tỉnh thành. Chúng tôi hợp tác với các đơn vị vận chuyển uy tín để
              đảm bảo hàng hóa được giao đến tay khách hàng một cách an toàn và
              nhanh chóng nhất.
            </p>
            <ul className="info-list">
              <li>TP. Hồ Chí Minh và Hà Nội: Giao hàng trong 1-2 ngày</li>
              <li>Các thành phố lớn: Giao hàng trong 2-3 ngày</li>
              <li>Các tỉnh thành khác: Giao hàng trong 3-5 ngày</li>
              <li>Vùng xa, hải đảo: Giao hàng trong 5-7 ngày</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">PHÍ VẬN CHUYỂN</h2>
            <h3 className="section-subtitle">Phí vận chuyển tiêu chuẩn</h3>
            <ul className="info-list">
              <li>Đơn hàng dưới 1,000,000₫: Phí cố định 30,000₫</li>
              <li>Đơn hàng từ 1,000,000₫ trở lên: Miễn phí vận chuyển</li>
              <li>Áp dụng cho tất cả các tỉnh thành</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Giao hàng nhanh (Express)
            </h3>
            <p className="section-text">
              Dịch vụ giao hàng trong ngày hoặc giao hàng trong vòng 4 giờ tại
              TP.HCM với phí 50,000₫. Áp dụng cho đơn hàng đặt trước 14:00.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">QUY TRÌNH GIAO HÀNG</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">1. Xác nhận đơn hàng</h3>
                <p className="timeline-text">
                  Sau khi đặt hàng thành công, bạn sẽ nhận email/SMS xác nhận
                  trong vòng 30 phút. Đơn hàng sẽ được xử lý ngay lập tức.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">2. Đóng gói sản phẩm</h3>
                <p className="timeline-text">
                  Sản phẩm được kiểm tra kỹ lưỡng và đóng gói trong hộp cao cấp
                  của Paradise, kèm theo thiệp chúc và hướng dẫn sử dụng.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">3. Bàn giao vận chuyển</h3>
                <p className="timeline-text">
                  Đơn hàng được chuyển cho đơn vị vận chuyển. Bạn sẽ nhận được
                  mã vận đơn để theo dõi hành trình của gói hàng.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">4. Giao hàng & Nhận hàng</h3>
                <p className="timeline-text">
                  Nhân viên giao hàng sẽ liên hệ trước khi giao. Vui lòng kiểm
                  tra sản phẩm trước khi ký nhận và thanh toán (nếu COD).
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">LƯU Ý QUAN TRỌNG</h2>
            <ul className="info-list">
              <li>
                Vui lòng cung cấp địa chỉ giao hàng chính xác và số điện thoại
                liên lạc được
              </li>
              <li>
                Kiểm tra kỹ sản phẩm trước khi ký nhận. Từ chối nhận nếu phát
                hiện hàng hóa bị hư hỏng
              </li>
              <li>
                Giữ lại biên nhận giao hàng để đối chiếu trong trường hợp cần
                thiết
              </li>
              <li>
                Liên hệ hotline 1800 123 456 ngay nếu có vấn đề phát sinh trong
                quá trình giao hàng
              </li>
              <li>
                Thời gian giao hàng có thể chậm hơn trong các ngày lễ, tết hoặc
                thời tiết xấu
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">THEO DÕI ĐƠN HÀNG</h2>
            <p className="section-text">
              Bạn có thể theo dõi đơn hàng của mình bằng các cách sau:
            </p>
            <ul className="info-list">
              <li>
                Đăng nhập vào tài khoản Paradise và xem mục "Đơn hàng của tôi"
              </li>
              <li>
                Sử dụng mã vận đơn để tra cứu trên website của đơn vị vận chuyển
              </li>
              <li>Liên hệ hotline 1800 123 456 để được hỗ trợ trực tiếp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
