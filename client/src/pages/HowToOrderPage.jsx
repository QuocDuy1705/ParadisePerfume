import "../assets/styles/info-pages.css";

export default function HowToOrderPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">HƯỚNG DẪN ĐẶT HÀNG</h1>
          <p className="info-subtitle">
            Mua sắm tại Paradise rất đơn giản và nhanh chóng. Làm theo 4 bước
            dưới đây để hoàn tất đơn hàng của bạn.
          </p>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">QUY TRÌNH ĐẶT HÀNG</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 1: Chọn sản phẩm</h3>
                <p className="timeline-text">
                  Duyệt qua danh mục sản phẩm, chọn nước hoa yêu thích và click
                  "Thêm vào giỏ hàng". Bạn có thể tiếp tục mua sắm hoặc xem giỏ
                  hàng.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 2: Xem giỏ hàng</h3>
                <p className="timeline-text">
                  Kiểm tra lại sản phẩm, số lượng và tổng tiền trong giỏ hàng.
                  Bạn có thể điều chỉnh số lượng hoặc xóa sản phẩm không cần.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 3: Điền thông tin</h3>
                <p className="timeline-text">
                  Nhập thông tin giao hàng (họ tên, địa chỉ, số điện thoại) và
                  chọn phương thức thanh toán (COD, VNPay, MoMo).
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 4: Xác nhận đặt hàng</h3>
                <p className="timeline-text">
                  Kiểm tra lại toàn bộ thông tin và click "Hoàn tất đặt hàng".
                  Bạn sẽ nhận email xác nhận và mã đơn hàng ngay sau đó.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">PHƯƠNG THỨC THANH TOÁN</h2>
            <h3 className="section-subtitle">
              1. Thanh toán khi nhận hàng (COD)
            </h3>
            <ul className="info-list">
              <li>Thanh toán bằng tiền mặt khi nhận hàng</li>
              <li>Kiểm tra sản phẩm trước khi thanh toán</li>
              <li>Phù hợp cho khách hàng muốn xem hàng trước</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              2. Thanh toán qua VNPay
            </h3>
            <ul className="info-list">
              <li>Thanh toán bằng thẻ ATM, tài khoản ngân hàng</li>
              <li>An toàn, bảo mật, giao dịch nhanh chóng</li>
              <li>Nhận ưu đãi từ các ngân hàng liên kết</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              3. Thanh toán qua MoMo
            </h3>
            <ul className="info-list">
              <li>Thanh toán qua ví điện tử MoMo</li>
              <li>Quét mã QR hoặc nhập số điện thoại</li>
              <li>Tích điểm, nhận hoàn tiền từ MoMo</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">THEO DÕI ĐƠN HÀNG</h2>
            <p className="section-text">
              Sau khi đặt hàng thành công, bạn có thể theo dõi đơn hàng bằng
              cách:
            </p>
            <ul className="info-list">
              <li>
                Đăng nhập vào tài khoản Paradise → Trang cá nhân → Đơn hàng
              </li>
              <li>Kiểm tra email xác nhận đơn hàng (có mã vận đơn)</li>
              <li>Liên hệ hotline 1800 123 456 để được hỗ trợ</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">CÂU HỎI THƯỜNG GẶP</h2>
            <h3 className="section-subtitle">
              Tôi có cần đăng ký tài khoản không?
            </h3>
            <p className="section-text">
              Không bắt buộc, nhưng đăng ký tài khoản sẽ giúp bạn theo dõi đơn
              hàng dễ dàng hơn, lưu địa chỉ giao hàng và nhận ưu đãi thành viên.
            </p>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Tôi có thể hủy đơn hàng không?
            </h3>
            <p className="section-text">
              Có, bạn có thể hủy đơn hàng trong vòng 2 giờ sau khi đặt bằng cách
              liên hệ hotline. Sau 2 giờ, đơn hàng sẽ được xử lý và không thể
              hủy.
            </p>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Tôi có thể đổi địa chỉ giao hàng không?
            </h3>
            <p className="section-text">
              Có, bạn có thể đổi địa chỉ trước khi đơn hàng được giao cho đơn vị
              vận chuyển. Vui lòng liên hệ hotline ngay để được hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
