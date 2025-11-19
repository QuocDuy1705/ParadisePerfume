import { RotateCcw, ShieldCheck, Truck, Clock } from "lucide-react";
import "../../assets/styles/info-pages.css";

export default function ReturnsPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        {/* Header */}
        <div className="info-header">
          <h1 className="info-title">CHÍNH SÁCH ĐỔI TRẢ & HOÀN TIỀN</h1>
          <p className="info-subtitle">
            Paradise cam kết mang đến trải nghiệm mua sắm an tâm với chính sách
            đổi trả linh hoạt và minh bạch.
          </p>
        </div>

        {/* Info Cards */}
        <div className="info-grid">
          <div className="info-card">
            <RotateCcw className="card-icon" />
            <h3 className="card-title">30 NGÀY ĐỔI TRẢ</h3>
            <p className="card-text">
              Đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng.
            </p>
          </div>

          <div className="info-card">
            <ShieldCheck className="card-icon" />
            <h3 className="card-title">HOÀN TIỀN 100%</h3>
            <p className="card-text">
              Hoàn lại toàn bộ tiền nếu sản phẩm lỗi hoặc không đúng mô tả.
            </p>
          </div>

          <div className="info-card">
            <Truck className="card-icon" />
            <h3 className="card-title">MIỄN PHÍ VẬN CHUYỂN</h3>
            <p className="card-text">
              Paradise chịu phí vận chuyển cho sản phẩm lỗi hoặc giao sai.
            </p>
          </div>

          <div className="info-card">
            <Clock className="card-icon" />
            <h3 className="card-title">XỬ LÝ NHANH</h3>
            <p className="card-text">
              Đơn đổi trả được xử lý trong 2-3 ngày làm việc sau khi nhận hàng.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">ĐIỀU KIỆN ĐỔI TRẢ</h2>
            <p className="section-text">
              Sản phẩm được chấp nhận đổi trả khi đáp ứng các điều kiện sau:
            </p>
            <ul className="info-list">
              <li>Sản phẩm còn nguyên seal, chưa mở nắp, chưa sử dụng</li>
              <li>Sản phẩm còn đầy đủ hộp, bao bì, nhãn mác gốc</li>
              <li>Có hóa đơn mua hàng hoặc biên nhận giao hàng</li>
              <li>Trong thời hạn 30 ngày kể từ ngày nhận hàng</li>
              <li>
                Sản phẩm không thuộc danh mục không đổi trả (xem bên dưới)
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">CÁC TRƯỜNG HỢP ĐỔI TRẢ</h2>

            <h3 className="section-subtitle">
              1. Sản phẩm lỗi do nhà sản xuất
            </h3>
            <ul className="info-list">
              <li>Sản phẩm bị vỡ, rò rỉ, hư hỏng khi nhận hàng</li>
              <li>Sản phẩm có mùi lạ, màu sắc không đúng</li>
              <li>Sản phẩm hết hạn sử dụng hoặc gần hết hạn (dưới 6 tháng)</li>
              <li>
                Paradise chịu toàn bộ chi phí vận chuyển và hoàn tiền 100%
              </li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              2. Giao sai sản phẩm
            </h3>
            <ul className="info-list">
              <li>Nhận được sản phẩm không đúng với đơn hàng đã đặt</li>
              <li>Số lượng sản phẩm không khớp với hóa đơn</li>
              <li>Paradise sẽ giao đúng sản phẩm và chịu phí vận chuyển</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              3. Đổi trả do thay đổi ý kiến
            </h3>
            <ul className="info-list">
              <li>Không thích mùi hương, muốn đổi sang sản phẩm khác</li>
              <li>Đặt nhầm sản phẩm, size, phiên bản</li>
              <li>
                Khách hàng chịu phí vận chuyển đổi trả (30,000₫ - 50,000₫)
              </li>
              <li>Chỉ áp dụng cho sản phẩm còn nguyên seal, chưa sử dụng</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">SẢN PHẨM KHÔNG ÁP DỤNG ĐỔI TRẢ</h2>
            <ul className="info-list">
              <li>
                Sản phẩm đã mở seal, đã sử dụng (trừ trường hợp lỗi nhà sản
                xuất)
              </li>
              <li>Sản phẩm giảm giá trên 50%, sản phẩm khuyến mãi, quà tặng</li>
              <li>Sản phẩm đặt làm riêng theo yêu cầu (custom order)</li>
              <li>Sản phẩm mua trong các chương trình Flash Sale</li>
              <li>Sản phẩm không có hóa đơn hoặc biên nhận giao hàng</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">QUY TRÌNH ĐỔI TRẢ</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 1: Liên hệ Paradise</h3>
                <p className="timeline-text">
                  Gọi hotline 1800 123 456 hoặc email paradisesupport@gmail.com
                  với thông tin: Mã đơn hàng, lý do đổi trả, hình ảnh sản phẩm
                  (nếu có).
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 2: Xác nhận đổi trả</h3>
                <p className="timeline-text">
                  Bộ phận CSKH sẽ xác nhận yêu cầu trong vòng 24 giờ và hướng
                  dẫn bạn cách gửi hàng về Paradise.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 3: Gửi hàng về</h3>
                <p className="timeline-text">
                  Đóng gói sản phẩm cẩn thận, gửi về địa chỉ Paradise cung cấp.
                  Giữ lại mã vận đơn để theo dõi.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 4: Kiểm tra & Xử lý</h3>
                <p className="timeline-text">
                  Paradise kiểm tra sản phẩm trong 2-3 ngày. Nếu đủ điều kiện,
                  chúng tôi sẽ đổi sản phẩm mới hoặc hoàn tiền trong 5-7 ngày.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">CHÍNH SÁCH HOÀN TIỀN</h2>
            <ul className="info-list">
              <li>
                Thanh toán COD: Hoàn tiền qua chuyển khoản ngân hàng trong 5-7
                ngày
              </li>
              <li>
                Thanh toán VNPay/MoMo: Hoàn tiền về tài khoản gốc trong 7-10
                ngày
              </li>
              <li>
                Hoàn tiền 100% giá trị sản phẩm (không bao gồm phí vận chuyển
                nếu đổi trả do thay đổi ý kiến)
              </li>
              <li>
                Bạn sẽ nhận email thông báo khi tiền được hoàn lại thành công
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">LIÊN HỆ HỖ TRỢ</h2>
            <p className="section-text">
              Nếu bạn có bất kỳ thắc mắc nào về chính sách đổi trả, vui lòng
              liên hệ:
            </p>
            <ul className="info-list">
              <li>Hotline: 1800 123 456 (8:00 - 22:00 hàng ngày)</li>
              <li>Email: paradisesupport@gmail.com</li>
              <li>Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
