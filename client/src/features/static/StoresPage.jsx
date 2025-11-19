import { MapPin, Store, Phone, Clock } from "lucide-react";
import "../../assets/styles/info-pages.css";

export default function StoresPage() {
  const stores = [
    {
      name: "Paradise Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      phone: "(028) 3822 xxxx",
      hours: "8:00 - 22:00 (Hàng ngày)",
      isMain: true,
    },
    {
      name: "Paradise Vincom Đồng Khởi",
      address: "72 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh",
      phone: "(028) 3914 xxxx",
      hours: "9:00 - 21:30 (Hàng ngày)",
    },
    {
      name: "Paradise Crescent Mall",
      address: "101 Tôn Dật Tiên, Quận 7, TP. Hồ Chí Minh",
      phone: "(028) 5413 xxxx",
      hours: "9:30 - 21:30 (Hàng ngày)",
    },
    {
      name: "Paradise Hà Nội",
      address: "45 Tràng Tiền, Hoàn Kiếm, Hà Nội",
      phone: "(024) 3936 xxxx",
      hours: "8:30 - 21:00 (Hàng ngày)",
    },
  ];

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">HỆ THỐNG CỬA HÀNG</h1>
          <p className="info-subtitle">
            Ghé thăm Paradise để trải nghiệm không gian mua sắm sang trọng và
            tận hưởng dịch vụ tư vấn chuyên nghiệp từ đội ngũ chuyên gia nước
            hoa.
          </p>
        </div>

        <div className="info-content">
          {stores.map((store, index) => (
            <div key={index} className="content-section">
              <h2 className="section-title">
                {store.name}
                {store.isMain && (
                  <span style={{ marginLeft: "10px", fontSize: "14px" }}>
                    (Flagship Store)
                  </span>
                )}
              </h2>
              <div
                className="info-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <MapPin
                      size={20}
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <p className="section-text" style={{ margin: 0 }}>
                      {store.address}
                    </p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <Phone size={20} style={{ flexShrink: 0 }} />
                    <p className="section-text" style={{ margin: 0 }}>
                      {store.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <Clock size={20} style={{ flexShrink: 0 }} />
                    <p className="section-text" style={{ margin: 0 }}>
                      {store.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">DỊCH VỤ TẠI CỬA HÀNG</h2>
            <div className="info-grid">
              <div className="info-card">
                <Store className="card-icon" />
                <h3 className="card-title">TƯ VẤN CHUYÊN SÂU</h3>
                <p className="card-text">
                  Đội ngũ chuyên gia nước hoa giàu kinh nghiệm sẽ giúp bạn tìm
                  ra mùi hương phù hợp nhất với phong cách và cá tính riêng.
                </p>
              </div>

              <div className="info-card">
                <Store className="card-icon" />
                <h3 className="card-title">THỬ MÙI MIỄN PHÍ</h3>
                <p className="card-text">
                  Trải nghiệm hàng trăm mùi hương từ các thương hiệu nổi tiếng
                  thế giới trong không gian sang trọng và thoải mái.
                </p>
              </div>

              <div className="info-card">
                <Store className="card-icon" />
                <h3 className="card-title">SAMPLE MIỄN PHÍ</h3>
                <p className="card-text">
                  Nhận sample nước hoa miễn phí để thử nghiệm tại nhà trước khi
                  quyết định mua sản phẩm full size.
                </p>
              </div>

              <div className="info-card">
                <Store className="card-icon" />
                <h3 className="card-title">QUÀ TẶNG CAO CẤP</h3>
                <p className="card-text">
                  Dịch vụ gói quà sang trọng miễn phí, hoàn hảo cho những dịp
                  đặc biệt và tặng quà người thân, bạn bè.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">ĐẶT HẸN TRƯỚC</h2>
            <p className="section-text">
              Để được phục vụ tốt nhất, bạn có thể đặt lịch hẹn trước khi đến
              cửa hàng:
            </p>
            <ul className="info-list">
              <li>Gọi hotline: 1800 123 456</li>
              <li>Inbox fanpage Paradise Perfume</li>
              <li>Email: stores@paradise.vn</li>
            </ul>
            <p className="section-text" style={{ marginTop: "20px" }}>
              Bạn sẽ được ưu tiên phục vụ và có thể yêu cầu tư vấn từ chuyên gia
              cụ thể theo sở thích.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
