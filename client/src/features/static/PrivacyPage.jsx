import "../../assets/styles/info-pages.css";

export default function PrivacyPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">CHÍNH SÁCH BẢO MẬT</h1>
          <p className="info-subtitle">
            Paradise cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
            khách hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và
            bảo vệ dữ liệu của bạn.
          </p>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">1. THU THẬP THÔNG TIN</h2>
            <h3 className="section-subtitle">Thông tin chúng tôi thu thập:</h3>
            <ul className="info-list">
              <li>
                <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện
                thoại, địa chỉ giao hàng
              </li>
              <li>
                <strong>Thông tin tài khoản:</strong> Tên đăng nhập, mật khẩu
                (được mã hóa)
              </li>
              <li>
                <strong>Thông tin đơn hàng:</strong> Lịch sử mua hàng, giỏ hàng,
                wishlist
              </li>
              <li>
                <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình
                duyệt, thiết bị
              </li>
              <li>
                <strong>Cookie:</strong> Dữ liệu về cách bạn sử dụng website
              </li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Cách chúng tôi thu thập:
            </h3>
            <ul className="info-list">
              <li>Khi bạn đăng ký tài khoản trên Paradise</li>
              <li>Khi bạn đặt hàng hoặc liên hệ với chúng tôi</li>
              <li>Khi bạn đăng ký nhận bản tin</li>
              <li>Thông qua cookie và công nghệ theo dõi tương tự</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">2. SỬ DỤNG THÔNG TIN</h2>
            <p className="section-text">
              Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
            </p>
            <ul className="info-list">
              <li>Xử lý và giao hàng cho đơn hàng của bạn</li>
              <li>Gửi thông báo về trạng thái đơn hàng</li>
              <li>Cung cấp dịch vụ chăm sóc khách hàng</li>
              <li>Gửi thông tin khuyến mãi, ưu đãi (nếu bạn đồng ý)</li>
              <li>Cải thiện trải nghiệm mua sắm và chất lượng dịch vụ</li>
              <li>Phân tích hành vi người dùng để tối ưu website</li>
              <li>Phát hiện và ngăn chặn gian lận</li>
              <li>Tuân thủ yêu cầu pháp lý</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">3. BẢO VỆ THÔNG TIN</h2>
            <p className="section-text">
              Paradise áp dụng các biện pháp bảo mật để bảo vệ thông tin của
              bạn:
            </p>
            <ul className="info-list">
              <li>Mã hóa SSL 256-bit cho tất cả dữ liệu truyền tải</li>
              <li>Mật khẩu được mã hóa bằng thuật toán bcrypt</li>
              <li>Tường lửa (firewall) bảo vệ hệ thống</li>
              <li>Sao lưu dữ liệu định kỳ</li>
              <li>Giới hạn quyền truy cập chỉ cho nhân viên được ủy quyền</li>
              <li>Kiểm tra bảo mật định kỳ</li>
              <li>Tuân thủ chuẩn PCI DSS cho thanh toán online</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">4. CHIA SẺ THÔNG TIN</h2>
            <p className="section-text">
              Paradise không bán hoặc cho thuê thông tin cá nhân của bạn. Chúng
              tôi chỉ chia sẻ thông tin với:
            </p>
            <ul className="info-list">
              <li>
                <strong>Đơn vị vận chuyển:</strong> Để giao hàng đến bạn
              </li>
              <li>
                <strong>Cổng thanh toán:</strong> VNPay, MoMo để xử lý thanh
                toán
              </li>
              <li>
                <strong>Nhà cung cấp dịch vụ:</strong> Email marketing, phân
                tích dữ liệu
              </li>
              <li>
                <strong>Cơ quan pháp luật:</strong> Khi có yêu cầu hợp pháp
              </li>
            </ul>
            <p className="section-text" style={{ marginTop: "20px" }}>
              Tất cả các bên thứ ba đều phải tuân thủ nghiêm ngặt các quy định
              về bảo mật và chỉ sử dụng thông tin cho mục đích cụ thể.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">5. COOKIE VÀ CÔNG NGHỆ THEO DÕI</h2>
            <p className="section-text">
              Paradise sử dụng cookie và các công nghệ tương tự để:
            </p>
            <ul className="info-list">
              <li>Ghi nhớ thông tin đăng nhập của bạn</li>
              <li>Lưu giỏ hàng và sở thích mua sắm</li>
              <li>Phân tích lưu lượng truy cập website</li>
              <li>Cá nhân hóa nội dung và quảng cáo</li>
            </ul>
            <p className="section-text" style={{ marginTop: "20px" }}>
              Bạn có thể từ chối cookie thông qua cài đặt trình duyệt, nhưng một
              số chức năng của website có thể bị ảnh hưởng.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">6. QUYỀN CỦA KHÁCH HÀNG</h2>
            <p className="section-text">Bạn có quyền:</p>
            <ul className="info-list">
              <li>
                <strong>Truy cập:</strong> Xem thông tin cá nhân chúng tôi lưu
                trữ
              </li>
              <li>
                <strong>Chỉnh sửa:</strong> Cập nhật thông tin cá nhân bất kỳ
                lúc nào
              </li>
              <li>
                <strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu
              </li>
              <li>
                <strong>Từ chối:</strong> Hủy đăng ký nhận email marketing
              </li>
              <li>
                <strong>Khiếu nại:</strong> Gửi khiếu nại nếu bạn cho rằng quyền
                riêng tư bị vi phạm
              </li>
            </ul>
            <p className="section-text" style={{ marginTop: "20px" }}>
              Để thực hiện các quyền trên, vui lòng liên hệ: privacy@paradise.vn
              hoặc hotline 1800 123 456.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">7. LƯU TRỮ DỮ LIỆU</h2>
            <p className="section-text">Chúng tôi lưu trữ thông tin của bạn:</p>
            <ul className="info-list">
              <li>Cho đến khi bạn yêu cầu xóa tài khoản</li>
              <li>
                Theo thời hạn quy định pháp luật (tối thiểu 3 năm cho hóa đơn)
              </li>
              <li>Dữ liệu thanh toán: Không lưu trữ (do đối tác xử lý)</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">8. LIÊN HỆ</h2>
            <p className="section-text">
              Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
            </p>
            <ul className="info-list">
              <li>Email: privacy@paradise.vn</li>
              <li>Hotline: 1800 123 456</li>
              <li>Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </div>

          <div className="content-section">
            <p className="section-text" style={{ fontStyle: "italic" }}>
              <strong>Cập nhật lần cuối:</strong> Tháng 1, 2025
            </p>
            <p className="section-text" style={{ fontStyle: "italic" }}>
              Paradise có quyền cập nhật chính sách này bất kỳ lúc nào. Mọi thay
              đổi sẽ được thông báo qua email hoặc trên website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
