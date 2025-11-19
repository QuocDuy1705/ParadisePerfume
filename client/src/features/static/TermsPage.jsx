import "../../assets/styles/info-pages.css";

export default function TermsPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">ĐIỀU KHOẢN SỬ DỤNG</h1>
          <p className="info-subtitle">
            Bằng việc truy cập và sử dụng website Paradise, bạn đồng ý với các
            điều khoản và điều kiện được quy định dưới đây. Vui lòng đọc kỹ
            trước khi sử dụng dịch vụ.
          </p>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">1. ĐIỀU KHOẢN CHUNG</h2>
            <ul className="info-list">
              <li>
                Website Paradise thuộc quyền sở hữu của Công ty TNHH Paradise
                Perfume Vietnam
              </li>
              <li>
                Các điều khoản này có hiệu lực kể từ khi bạn truy cập website
              </li>
              <li>
                Paradise có quyền thay đổi, chỉnh sửa điều khoản bất kỳ lúc nào
              </li>
              <li>Bạn có trách nhiệm kiểm tra cập nhật điều khoản định kỳ</li>
              <li>
                Tiếp tục sử dụng website sau khi có thay đổi đồng nghĩa với việc
                bạn chấp nhận điều khoản mới
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">2. TÀI KHOẢN NGƯỜI DÙNG</h2>
            <h3 className="section-subtitle">Đăng ký tài khoản:</h3>
            <ul className="info-list">
              <li>Bạn phải cung cấp thông tin chính xác, đầy đủ</li>
              <li>Bạn phải từ đủ 18 tuổi trở lên để tạo tài khoản</li>
              <li>Mỗi người chỉ được tạo một tài khoản</li>
              <li>Bạn chịu trách nhiệm bảo mật mật khẩu của mình</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Trách nhiệm người dùng:
            </h3>
            <ul className="info-list">
              <li>Không chia sẻ tài khoản cho người khác</li>
              <li>
                Thông báo ngay cho Paradise nếu phát hiện tài khoản bị xâm nhập
              </li>
              <li>Không sử dụng tài khoản cho mục đích bất hợp pháp</li>
              <li>Cập nhật thông tin chính xác khi có thay đổi</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Đình chỉ/Xóa tài khoản:
            </h3>
            <ul className="info-list">
              <li>Paradise có quyền đình chỉ tài khoản vi phạm điều khoản</li>
              <li>Bạn có thể yêu cầu xóa tài khoản bất kỳ lúc nào</li>
              <li>Dữ liệu đơn hàng vẫn được lưu theo quy định pháp luật</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">3. ĐẶT HÀNG VÀ THANH TOÁN</h2>
            <h3 className="section-subtitle">Đơn hàng:</h3>
            <ul className="info-list">
              <li>
                Đơn hàng chỉ được xác nhận sau khi Paradise gửi email xác nhận
              </li>
              <li>
                Paradise có quyền từ chối đơn hàng bất thường hoặc nghi ngờ gian
                lận
              </li>
              <li>Giá sản phẩm có thể thay đổi mà không cần báo trước</li>
              <li>Khuyến mãi chỉ áp dụng trong thời gian quy định</li>
            </ul>

            <h3 className="section-subtitle" style={{ marginTop: "20px" }}>
              Thanh toán:
            </h3>
            <ul className="info-list">
              <li>Bạn phải thanh toán đầy đủ theo giá trị đơn hàng</li>
              <li>
                Thanh toán online: Giao dịch được xử lý qua đối tác bảo mật
              </li>
              <li>
                COD: Thanh toán khi nhận hàng, có thể từ chối nếu hàng hư hỏng
              </li>
              <li>
                Paradise không chịu trách nhiệm về phí giao dịch ngân hàng
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">4. GIAO HÀNG</h2>
            <ul className="info-list">
              <li>
                Thời gian giao hàng chỉ là ước tính, không phải cam kết chính
                thức
              </li>
              <li>
                Paradise không chịu trách nhiệm về chậm trễ do bất khả kháng
                (thời tiết, thiên tai, dịch bệnh)
              </li>
              <li>
                Khách hàng có trách nhiệm cung cấp địa chỉ giao hàng chính xác
              </li>
              <li>
                Kiểm tra sản phẩm trước khi ký nhận, từ chối nếu hàng bị hư hỏng
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">5. ĐỔI TRẢ VÀ HOÀN TIỀN</h2>
            <ul className="info-list">
              <li>Áp dụng trong vòng 30 ngày kể từ ngày nhận hàng</li>
              <li>Sản phẩm phải còn nguyên seal, chưa sử dụng</li>
              <li>Phải có hóa đơn và đầy đủ bao bì</li>
              <li>Sản phẩm giảm giá trên 50% không áp dụng đổi trả</li>
              <li>Xem chi tiết tại Chính sách đổi trả & Hoàn tiền</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">6. SỞ HỮU TRÍ TUỆ</h2>
            <ul className="info-list">
              <li>
                Tất cả nội dung trên website (logo, hình ảnh, văn bản) thuộc
                quyền sở hữu của Paradise
              </li>
              <li>
                Không được sao chép, phân phối, sử dụng cho mục đích thương mại
                khi chưa có sự đồng ý
              </li>
              <li>
                Vi phạm sở hữu trí tuệ sẽ bị xử lý theo quy định pháp luật
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">7. GIỚI HẠN TRÁCH NHIỆM</h2>
            <ul className="info-list">
              <li>
                Paradise không chịu trách nhiệm về thiệt hại gián tiếp, ngẫu
                nhiên do sử dụng website
              </li>
              <li>
                Website có thể gián đoạn do bảo trì, nâng cấp hoặc sự cố kỹ
                thuật
              </li>
              <li>
                Paradise không đảm bảo website hoàn toàn không có lỗi hoặc virus
              </li>
              <li>
                Trách nhiệm của Paradise giới hạn ở giá trị đơn hàng khách hàng
                đã thanh toán
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">8. HÀNH VI CẤM</h2>
            <p className="section-text">
              Khi sử dụng website Paradise, bạn không được:
            </p>
            <ul className="info-list">
              <li>Sử dụng cho mục đích bất hợp pháp hoặc gian lận</li>
              <li>Tấn công, hack, phá hoại hệ thống</li>
              <li>Spam, gửi thư rác, quảng cáo trái phép</li>
              <li>Giả mạo danh tính, tài khoản</li>
              <li>Thu thập thông tin người dùng khác</li>
              <li>Đăng tải nội dung vi phạm pháp luật, đạo đức</li>
              <li>Sử dụng robot, bot để truy cập tự động</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">9. LUẬT ÁP DỤNG</h2>
            <ul className="info-list">
              <li>
                Điều khoản này tuân theo pháp luật nước Cộng hòa Xã hội Chủ
                nghĩa Việt Nam
              </li>
              <li>
                Mọi tranh chấp sẽ được giải quyết thông qua thương lượng, hòa
                giải
              </li>
              <li>
                Nếu không thỏa thuận được, tranh chấp sẽ được đưa ra Tòa án có
                thẩm quyền tại TP. Hồ Chí Minh
              </li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">10. THÔNG TIN LIÊN HỆ</h2>
            <p className="section-text">
              Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ:
            </p>
            <ul className="info-list">
              <li>
                <strong>Công ty:</strong> TNHH Paradise Perfume Vietnam
              </li>
              <li>
                <strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí
                Minh
              </li>
              <li>
                <strong>Hotline:</strong> 1800 123 456
              </li>
              <li>
                <strong>Email:</strong> legal@paradise.vn
              </li>
            </ul>
          </div>

          <div className="content-section">
            <p className="section-text" style={{ fontStyle: "italic" }}>
              <strong>Cập nhật lần cuối:</strong> Tháng 1, 2025
            </p>
            <p className="section-text" style={{ fontStyle: "italic" }}>
              Bằng việc sử dụng website Paradise, bạn xác nhận rằng đã đọc, hiểu
              và đồng ý với toàn bộ Điều khoản sử dụng này.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
