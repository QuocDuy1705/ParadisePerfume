import "../../assets/styles/info-pages.css";

export default function PaymentPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">PHƯƠNG THỨC THANH TOÁN</h1>
          <p className="info-subtitle">
            Paradise hỗ trợ nhiều phương thức thanh toán an toàn, tiện lợi để
            bạn có trải nghiệm mua sắm tốt nhất.
          </p>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">1. THANH TOÁN KHI NHẬN HÀNG (COD)</h2>
            <p className="section-text">
              Phương thức thanh toán phổ biến và an toàn nhất tại Paradise.
            </p>
            <h3 className="section-subtitle">Ưu điểm:</h3>
            <ul className="info-list">
              <li>Kiểm tra sản phẩm trước khi thanh toán</li>
              <li>Không cần tài khoản ngân hàng hoặc ví điện tử</li>
              <li>
                Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng
              </li>
              <li>An toàn, không lo bị lừa đảo</li>
            </ul>
            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Lưu ý:
            </h3>
            <ul className="info-list">
              <li>Vui lòng chuẩn bị đủ tiền mặt khi nhận hàng</li>
              <li>Kiểm tra kỹ sản phẩm trước khi ký nhận</li>
              <li>Từ chối nhận hàng nếu sản phẩm bị hư hỏng hoặc không đúng</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">2. THANH TOÁN QUA TPBANK</h2>
            <p className="section-text">
              TPBANK là cổng thanh toán trực tuyến uy tín, được liên kết với hơn
              40 ngân hàng tại Việt Nam.
            </p>
            <h3 className="section-subtitle">Các hình thức thanh toán:</h3>
            <ul className="info-list">
              <li>Thẻ ATM nội địa (có đăng ký Internet Banking)</li>
              <li>Tài khoản VNPay</li>
              <li>Thẻ quốc tế Visa, Mastercard, JCB</li>
            </ul>
            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Cách thanh toán:
            </h3>
            <ul className="info-list">
              <li>Chọn phương thức "TPBANK" khi thanh toán</li>
              <li>Chọn ngân hàng của bạn trong danh sách</li>
              <li>Đăng nhập Internet Banking và xác nhận thanh toán</li>
              <li>Nhận thông báo thanh toán thành công</li>
            </ul>
            <p className="section-text" style={{ marginTop: "20px" }}>
              <strong>Bảo mật:</strong> VNPay sử dụng công nghệ mã hóa SSL
              256-bit, đảm bảo an toàn thông tin thẻ và giao dịch.
            </p>
          </div>
          <div className="content-section">
            <h2 className="section-title">AN TOÀN & BẢO MẬT</h2>
            <p className="section-text">
              Paradise cam kết bảo vệ thông tin thanh toán của khách hàng:
            </p>
            <ul className="info-list">
              <li>Mã hóa SSL 256-bit cho tất cả giao dịch</li>
              <li>Không lưu trữ thông tin thẻ ngân hàng của khách hàng</li>
              <li>Tuân thủ chuẩn bảo mật PCI DSS</li>
              <li>Xác thực 2 lớp (2FA) cho giao dịch online</li>
              <li>Đối tác thanh toán được cấp phép bởi Ngân hàng Nhà nước</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">CÂU HỎI THƯỜNG GẶP</h2>
            <h3 className="section-subtitle">
              Tôi có thể thanh toán một phần COD, một phần online không?
            </h3>
            <p className="section-text">
              Hiện tại Paradise chưa hỗ trợ thanh toán kết hợp. Bạn vui lòng
              chọn 1 phương thức thanh toán cho toàn bộ đơn hàng.
            </p>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Thanh toán online có mất phí không?
            </h3>
            <p className="section-text">
              Không, Paradise không tính phí cho bất kỳ phương thức thanh toán
              nào. Tuy nhiên, ngân hàng có thể tính phí giao dịch theo quy định.
            </p>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Tôi đã thanh toán nhưng chưa nhận được xác nhận?
            </h3>
            <p className="section-text">
              Vui lòng chờ 5-10 phút để hệ thống cập nhật. Nếu sau 30 phút vẫn
              chưa nhận được email xác nhận, liên hệ hotline 1800 123 456.
            </p>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Tôi có thể đổi phương thức thanh toán sau khi đặt hàng không?
            </h3>
            <p className="section-text">
              Có, bạn có thể đổi phương thức thanh toán trong vòng 2 giờ sau khi
              đặt hàng bằng cách liên hệ hotline hoặc chat với CSKH.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
