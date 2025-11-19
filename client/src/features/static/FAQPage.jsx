import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "../../assets/styles/info-pages.css";

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      category: "ĐẶT HÀNG & THANH TOÁN",
      items: [
        {
          question: "Làm thế nào để đặt hàng trên Paradise?",
          answer:
            "Bạn có thể đặt hàng bằng cách: 1) Chọn sản phẩm và thêm vào giỏ hàng, 2) Điền thông tin giao hàng, 3) Chọn phương thức thanh toán (COD/VNPay/MoMo), 4) Xác nhận đơn hàng. Bạn sẽ nhận được email xác nhận sau khi đặt hàng thành công.",
        },
        {
          question: "Paradise hỗ trợ những phương thức thanh toán nào?",
          answer:
            "Chúng tôi chấp nhận: Thanh toán khi nhận hàng (COD), VNPay (thẻ ATM/tài khoản ngân hàng), và MoMo. Tất cả giao dịch đều được mã hóa bảo mật.",
        },
        {
          question: "Tôi có thể hủy hoặc thay đổi đơn hàng không?",
          answer:
            "Bạn có thể hủy hoặc thay đổi đơn hàng trong vòng 2 giờ sau khi đặt bằng cách liên hệ hotline 1800 123 456. Sau thời gian này, đơn hàng sẽ được xử lý và không thể thay đổi.",
        },
      ],
    },
    {
      category: "GIAO HÀNG",
      items: [
        {
          question: "Thời gian giao hàng là bao lâu?",
          answer:
            "Thời gian giao hàng tiêu chuẩn: Nội thành TP.HCM: 1-2 ngày làm việc. Tỉnh thành khác: 3-5 ngày làm việc. Bạn sẽ nhận được mã vận đơn để theo dõi đơn hàng.",
        },
        {
          question: "Phí vận chuyển là bao nhiêu?",
          answer:
            "Phí vận chuyển cố định 30,000₫ cho tất cả đơn hàng. Miễn phí vận chuyển cho đơn hàng từ 1,000,000₫ trở lên.",
        },
        {
          question: "Tôi có thể thay đổi địa chỉ giao hàng không?",
          answer:
            "Bạn có thể thay đổi địa chỉ giao hàng trước khi đơn hàng được giao cho đơn vị vận chuyển. Vui lòng liên hệ ngay hotline để được hỗ trợ.",
        },
      ],
    },
    {
      category: "ĐỔI TRẢ & HOÀN TIỀN",
      items: [
        {
          question: "Chính sách đổi trả của Paradise như thế nào?",
          answer:
            "Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện: Sản phẩm còn nguyên seal, chưa sử dụng, có đầy đủ hóa đơn và bao bì. Sản phẩm giảm giá/khuyến mãi không áp dụng đổi trả.",
        },
        {
          question: "Tôi sẽ được hoàn tiền sau bao lâu?",
          answer:
            "Sau khi chúng tôi nhận và kiểm tra sản phẩm đổi trả (2-3 ngày làm việc), tiền sẽ được hoàn lại trong vòng 5-7 ngày làm việc tùy theo phương thức thanh toán ban đầu.",
        },
        {
          question: "Chi phí đổi trả do ai chịu?",
          answer:
            "Nếu lỗi do nhà sản xuất hoặc giao sai hàng, Paradise sẽ chịu toàn bộ chi phí. Nếu đổi trả do thay đổi ý kiến, khách hàng vui lòng chịu phí vận chuyển.",
        },
      ],
    },
    {
      category: "SẢN PHẨM & BẢO HÀNH",
      items: [
        {
          question: "Sản phẩm của Paradise có chính hãng không?",
          answer:
            "Paradise cam kết 100% sản phẩm chính hãng, nhập khẩu từ các nhà phân phối ủy quyền chính thức. Mỗi sản phẩm đều có tem chống hàng giả và giấy tờ đầy đủ.",
        },
        {
          question: "Nước hoa có bảo hành không?",
          answer:
            "Nước hoa được bảo hành chất lượng trong vòng 6 tháng kể từ ngày mua. Nếu phát hiện sản phẩm lỗi, hàng giả hoặc không đúng mô tả, chúng tôi sẽ đổi mới hoặc hoàn tiền 100%.",
        },
        {
          question: "Làm sao để bảo quản nước hoa đúng cách?",
          answer:
            "Nên bảo quản nước hoa ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao. Đậy nắp kín sau khi sử dụng để giữ hương thơm lâu hơn.",
        },
      ],
    },
    {
      category: "TÀI KHOẢN & THÀNH VIÊN",
      items: [
        {
          question: "Lợi ích khi đăng ký tài khoản Paradise?",
          answer:
            "Thành viên Paradise được: Theo dõi đơn hàng dễ dàng, lưu địa chỉ giao hàng, nhận thông báo ưu đãi độc quyền, tích điểm đổi quà, và trải nghiệm mua sắm nhanh hơn.",
        },
        {
          question: "Tôi quên mật khẩu, phải làm sao?",
          answer:
            'Tại trang đăng nhập, click vào "Quên mật khẩu" và nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn.',
        },
        {
          question: "Làm sao để cập nhật thông tin cá nhân?",
          answer:
            "Đăng nhập vào tài khoản, vào phần Trang cá nhân, chọn tab Thông tin cá nhân để chỉnh sửa họ tên, email, số điện thoại và địa chỉ.",
        },
      ],
    },
  ];

  const toggleAccordion = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setActiveIndex(activeIndex === key ? null : key);
  };

  return (
    <div className="info-page">
      <div className="info-container">
        {/* Header */}
        <div className="info-header">
          <h1 className="info-title">CÂU HỎI THƯỜNG GẶP</h1>
          <p className="info-subtitle">
            Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về mua sắm tại
            Paradise. Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng
            tôi.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="info-content">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="content-section">
              <h2 className="section-title">{category.category}</h2>
              {category.items.map((faq, itemIndex) => {
                const key = `${categoryIndex}-${itemIndex}`;
                const isActive = activeIndex === key;

                return (
                  <div key={itemIndex} className="accordion">
                    <button
                      className={`accordion-header ${isActive ? "active" : ""}`}
                      onClick={() => toggleAccordion(categoryIndex, itemIndex)}
                    >
                      <h3 className="accordion-title">{faq.question}</h3>
                      <ChevronDown className="accordion-icon" />
                    </button>
                    <div
                      className={`accordion-content ${
                        isActive ? "active" : ""
                      }`}
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="info-content" style={{ textAlign: "center" }}>
          <h2 className="section-subtitle">Vẫn cần hỗ trợ?</h2>
          <p className="section-text" style={{ marginBottom: "30px" }}>
            Đội ngũ chăm sóc khách hàng Paradise luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
          <a href="/contact" className="submit-btn">
            LIÊN HỆ NGAY
          </a>
        </div>
      </div>
    </div>
  );
}
