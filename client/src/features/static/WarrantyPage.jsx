import { Shield, CheckCircle, Award, Clock } from "lucide-react";
import "../../assets/styles/info-pages.css";

export default function WarrantyPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">CHÍNH SÁCH BẢO HÀNH</h1>
          <p className="info-subtitle">
            Paradise cam kết bảo vệ quyền lợi khách hàng với chính sách bảo hành
            chất lượng sản phẩm rõ ràng và minh bạch.
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <Shield className="card-icon" />
            <h3 className="card-title">BẢO HÀNH 6 THÁNG</h3>
            <p className="card-text">
              Bảo hành chất lượng sản phẩm trong vòng 6 tháng kể từ ngày mua.
            </p>
          </div>

          <div className="info-card">
            <CheckCircle className="card-icon" />
            <h3 className="card-title">HÀNG CHÍNH HÃNG</h3>
            <p className="card-text">
              Cam kết 100% sản phẩm chính hãng, nhập khẩu từ nhà phân phối ủy
              quyền.
            </p>
          </div>

          <div className="info-card">
            <Award className="card-icon" />
            <h3 className="card-title">ĐỔI HÀNG MỚI</h3>
            <p className="card-text">
              Đổi sản phẩm mới tương đương nếu phát hiện lỗi nhà sản xuất.
            </p>
          </div>

          <div className="info-card">
            <Clock className="card-icon" />
            <h3 className="card-title">HỖ TRỢ NHANH</h3>
            <p className="card-text">
              Xử lý yêu cầu bảo hành trong vòng 24-48 giờ làm việc.
            </p>
          </div>
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">ĐIỀU KIỆN BẢO HÀNH</h2>
            <p className="section-text">
              Sản phẩm được bảo hành khi đáp ứng đầy đủ các điều kiện sau:
            </p>
            <ul className="info-list">
              <li>
                Sản phẩm còn trong thời hạn bảo hành (6 tháng từ ngày mua)
              </li>
              <li>Có hóa đơn mua hàng hoặc biên nhận giao hàng</li>
              <li>Sản phẩm có tem bảo hành chính hãng của Paradise</li>
              <li>Lỗi do nhà sản xuất, không phải do người sử dụng</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">CÁC TRƯỜNG HỢP ĐƯỢC BẢO HÀNH</h2>
            <ul className="info-list">
              <li>Sản phẩm bị rò rỉ, chảy nước hoa mà không do va đập</li>
              <li>Chai nước hoa bị nứt vỡ do lỗi kỹ thuật</li>
              <li>Vòi xịt không hoạt động hoặc bị hỏng do lỗi nhà sản xuất</li>
              <li>Mùi hương thay đổi bất thường (không do bảo quản)</li>
              <li>Sản phẩm bị lỗi tem, nhãn mác gây nghi ngờ về chất lượng</li>
              <li>Hàng giả, hàng nhái (Paradise đổi mới và bồi thường)</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">TRƯỜNG HỢP KHÔNG BẢO HÀNH</h2>
            <ul className="info-list">
              <li>Sản phẩm hết thời hạn bảo hành (sau 6 tháng)</li>
              <li>Không có hóa đơn, tem bảo hành hoặc đã rách, mờ</li>
              <li>Sản phẩm bị vỡ, hư hỏng do va đập, rơi rớt</li>
              <li>Bảo quản không đúng cách (phơi nắng, nhiệt độ cao)</li>
              <li>Tự ý sửa chữa, thay đổi, can thiệp vào sản phẩm</li>
              <li>Sử dụng sai mục đích, lạm dụng sản phẩm</li>
              <li>Mua từ nguồn không chính thức (không phải Paradise)</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">QUY TRÌNH BẢO HÀNH</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 1: Liên hệ bảo hành</h3>
                <p className="timeline-text">
                  Gọi hotline 1800 123 456 hoặc mang sản phẩm đến cửa hàng
                  Paradise gần nhất. Chuẩn bị hóa đơn và sản phẩm cần bảo hành.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 2: Kiểm tra sản phẩm</h3>
                <p className="timeline-text">
                  Nhân viên Paradise sẽ kiểm tra tình trạng sản phẩm, xác minh
                  tem bảo hành và hóa đơn để xác định nguyên nhân lỗi.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 3: Xử lý bảo hành</h3>
                <p className="timeline-text">
                  Nếu đủ điều kiện, Paradise sẽ đổi sản phẩm mới tương đương
                  hoặc hoàn tiền trong vòng 24-48 giờ làm việc.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3 className="timeline-title">Bước 4: Nhận sản phẩm</h3>
                <p className="timeline-text">
                  Khách hàng nhận sản phẩm mới kèm tem bảo hành mới. Thời gian
                  bảo hành được tính lại từ ngày nhận sản phẩm thay thế.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">CAM KẾT CHẤT LƯỢNG</h2>
            <p className="section-text">Paradise cam kết với khách hàng:</p>
            <ul className="info-list">
              <li>100% sản phẩm chính hãng, có nguồn gốc xuất xứ rõ ràng</li>
              <li>
                Nhập khẩu trực tiếp từ các thương hiệu và nhà phân phối ủy quyền
              </li>
              <li>Mỗi sản phẩm đều có tem chống hàng giả và số serial riêng</li>
              <li>
                Kiểm tra chất lượng kỹ lưỡng trước khi giao đến khách hàng
              </li>
              <li>Hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">LIÊN HỆ BẢO HÀNH</h2>
            <p className="section-text">
              Để được hỗ trợ bảo hành nhanh chóng, vui lòng liên hệ:
            </p>
            <ul className="info-list">
              <li>Hotline bảo hành: 1800 123 456</li>
              <li>Email: warranty@paradise.vn</li>
              <li>Hoặc đến trực tiếp tại các cửa hàng Paradise toàn quốc</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
