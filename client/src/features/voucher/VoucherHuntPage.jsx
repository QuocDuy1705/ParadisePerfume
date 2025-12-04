import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Sparkles, Copy, Check, Bookmark, Award, Clock } from "lucide-react";
import { toast } from "react-toastify";
import "../../assets/styles/voucher.css";

// Countdown Component
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      <Clock size={16} />
      <span className="countdown-label">Kích hoạt sau:</span>
      <div className="countdown-numbers">
        {timeLeft.days > 0 && (
          <span className="countdown-unit">{timeLeft.days}d</span>
        )}
        <span className="countdown-unit">
          {String(timeLeft.hours).padStart(2, "0")}h
        </span>
        <span className="countdown-separator">:</span>
        <span className="countdown-unit">
          {String(timeLeft.minutes).padStart(2, "0")}m
        </span>
        <span className="countdown-separator">:</span>
        <span className="countdown-unit">
          {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
};

const VoucherHuntPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [savedCoupons, setSavedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const token = localStorage.getItem("token");

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/coupons/active"
      );
      setCoupons(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Không thể tải danh sách voucher");
      setLoading(false);
    }
  };

  const fetchSavedCoupons = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/coupons/saved",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedCoupons(response.data.map((c) => c._id));
    } catch (error) {
      console.error("Error fetching saved coupons:", error);
    }
  }, [token]);

  // Scroll to top only on initial mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Fetch data
  useEffect(() => {
    fetchCoupons();
    if (token) {
      fetchSavedCoupons();
    }
  }, [token, fetchSavedCoupons]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã copy mã: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveCoupon = async (couponId) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để lưu voucher");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/coupons/save",
        { couponId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedCoupons([...savedCoupons, couponId]);
      toast.success("Đã lưu voucher vào tài khoản");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể lưu voucher");
    }
  };

  const handleUnsaveCoupon = async (couponId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/coupons/unsave/${couponId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedCoupons(savedCoupons.filter((id) => id !== couponId));
      toast.success("Đã bỏ lưu voucher");
    } catch (error) {
      toast.error("Không thể bỏ lưu voucher");
    }
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }
    return `${coupon.discountValue.toLocaleString()}đ`;
  };

  const formatDate = (date) => {
    if (!date) return "Không giới hạn";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="voucher-loading">
        <div className="luxury-spinner"></div>
        <p className="loading-text">ĐANG TẢI</p>
      </div>
    );
  }

  return (
    <div className="voucher-hunt-page">
      {/* Header Banner - giống style các trang khác */}
      <div className="category-banner">
        <div className="banner-overlay"></div>
      </div>

      {/* Coupons Grid */}
      <div className="voucher-container">
        <div className="voucher-header-section">
          <h2 className="section-title">MÃ GIẢM GIÁ</h2>
          <div className="title-underline"></div>
        </div>

        <div className="voucher-stats">
          <div className="stat-card">
            <Award size={20} />
            <div className="stat-content">
              <h3>{coupons.length}</h3>
              <p>Khả dụng</p>
            </div>
          </div>
          {token && (
            <div className="stat-card">
              <Bookmark size={20} />
              <div className="stat-content">
                <h3>{savedCoupons.length}</h3>
                <p>Đã lưu</p>
              </div>
            </div>
          )}
        </div>

        {coupons.length === 0 ? (
          <div className="no-vouchers">
            <Sparkles size={60} strokeWidth={1.5} />
            <h2>ĐANG CẬP NHẬT</h2>
            <p>Các ưu đãi đặc biệt sẽ sớm được công bố</p>
          </div>
        ) : (
          <div className="voucher-grid">
            {coupons.map((coupon) => {
              const isSaved = savedCoupons.includes(coupon._id);
              const isUpcoming = coupon.isUpcoming;

              return (
                <div
                  key={coupon._id || coupon.code}
                  className={`voucher-card ${isUpcoming ? "upcoming" : ""}`}
                >
                  {isUpcoming && (
                    <div className="upcoming-badge">
                      <Sparkles size={14} />
                      <span>SẮP RA MẮT</span>
                    </div>
                  )}

                  <div className="voucher-content">
                    <div className="voucher-discount-section">
                      <div className="discount-badge">
                        <span className="discount-value">
                          {formatDiscount(coupon)}
                        </span>
                      </div>
                      <span className="discount-label">GIẢM GIÁ</span>
                    </div>

                    <div className="voucher-divider"></div>

                    <h3 className="voucher-description">
                      {coupon.description}
                    </h3>

                    {isUpcoming && <Countdown targetDate={coupon.startDate} />}

                    <div className="voucher-details">
                      {coupon.minOrderAmount > 0 && (
                        <div className="detail-row">
                          <span className="detail-label">Đơn tối thiểu</span>
                          <span className="detail-value">
                            {coupon.minOrderAmount.toLocaleString()}₫
                          </span>
                        </div>
                      )}

                      {coupon.maxDiscountAmount && (
                        <div className="detail-row">
                          <span className="detail-label">Giảm tối đa</span>
                          <span className="detail-value">
                            {coupon.maxDiscountAmount.toLocaleString()}₫
                          </span>
                        </div>
                      )}

                      <div className="detail-row">
                        <span className="detail-label">
                          {isUpcoming ? "Kích hoạt từ" : "Hạn sử dụng"}
                        </span>
                        <span className="detail-value">
                          {isUpcoming
                            ? formatDate(coupon.startDate)
                            : formatDate(coupon.endDate)}
                        </span>
                      </div>
                    </div>

                    <div className="voucher-code-section">
                      <div className="code-display">
                        <code>{coupon.code}</code>
                      </div>
                      <button
                        className={`copy-btn ${isUpcoming ? "disabled" : ""}`}
                        onClick={() =>
                          !isUpcoming && handleCopyCode(coupon.code)
                        }
                        disabled={isUpcoming}
                        title={isUpcoming ? "Voucher chưa kích hoạt" : ""}
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check size={14} strokeWidth={2} />
                            <span>ĐÃ SAO CHÉP</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} strokeWidth={2} />
                            <span>
                              {isUpcoming ? "CHƯA KH HOẠT" : "SAO CHÉP MÃ"}
                            </span>
                          </>
                        )}
                      </button>
                      <button
                        className={`save-voucher-btn ${isSaved ? "saved" : ""}`}
                        onClick={() =>
                          isSaved
                            ? handleUnsaveCoupon(coupon._id)
                            : handleSaveCoupon(coupon._id)
                        }
                      >
                        {isSaved ? (
                          <>
                            <Bookmark
                              size={14}
                              fill="currentColor"
                              strokeWidth={2}
                            />
                            <span>ĐÃ LƯU</span>
                          </>
                        ) : (
                          <>
                            <Bookmark size={14} strokeWidth={2} />
                            <span>LƯU VOUCHER</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="voucher-tips">
        <h2 className="tips-title">HƯỚNG DẪN SỬ DỤNG</h2>
        <div className="tips-divider"></div>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-number">01</div>
            <h3>LƯU MÃ</h3>
            <p>
              Nhấn biểu tượng bookmark để lưu voucher yêu thích vào tài khoản
              của bạn
            </p>
          </div>
          <div className="tip-card">
            <div className="tip-number">02</div>
            <h3>SAO CHÉP</h3>
            <p>
              Click "Sao chép mã" để copy mã giảm giá khi thanh toán đơn hàng
            </p>
          </div>
          <div className="tip-card">
            <div className="tip-number">03</div>
            <h3>ÁP DỤNG</h3>
            <p>Nhập mã vào ô coupon khi thanh toán để nhận ưu đãi đặc biệt</p>
          </div>
        </div>
      </div>

      {/* Article Section - Bài viết săn voucher chuyên nghiệp */}
      <div className="voucher-articles">
        <div className="articles-header">
          <h2 className="articles-title">NGHỆ THUẬT SĂN VOUCHER</h2>
          <div className="articles-divider"></div>
          <p className="articles-subtitle">
            Khám phá bí quyết tối ưu hóa chi tiêu thông minh
          </p>
        </div>

        <div className="articles-grid">
          {/* Article 1 */}
          <article className="article-card">
            <div className="article-number">01</div>
            <h3 className="article-title">THỜI ĐIỂM VÀNG ĐỂ SĂN VOUCHER</h3>
            <div className="article-line"></div>
            <p className="article-excerpt">
              Những khung giờ đặc biệt trong ngày thường mang đến nhiều ưu đãi
              hấp dẫn nhất. Theo dõi Paradise vào các dịp lễ lớn, đầu tháng,
              cuối tuần để không bỏ lỡ cơ hội tiết kiệm tối đa.
            </p>
            <ul className="article-highlights">
              <li>Flash Sale: 00:00 - 02:00, 12:00 - 14:00</li>
              <li>Happy Hour: Thứ 6 hàng tuần</li>
              <li>Mega Sale: Đầu tháng & các ngày lễ</li>
            </ul>
          </article>

          {/* Article 2 */}
          <article className="article-card">
            <div className="article-number">02</div>
            <h3 className="article-title">KẾT HỢP VOUCHER HIỆU QUẢ</h3>
            <div className="article-line"></div>
            <p className="article-excerpt">
              Nghệ thuật stack voucher - Kết hợp nhiều mã giảm giá cùng lúc để
              tối đa hóa lợi ích. Sử dụng voucher miễn phí ship kết hợp voucher
              giảm giá sản phẩm để trải nghiệm mua sắm tối ưu nhất.
            </p>
            <ul className="article-highlights">
              <li>Voucher giảm % + Voucher giảm cố định</li>
              <li>Voucher sản phẩm + Free shipping</li>
              <li>Coupon thành viên + Voucher đặc biệt</li>
            </ul>
          </article>

          {/* Article 3 */}
          <article className="article-card">
            <div className="article-number">03</div>
            <h3 className="article-title">BÍ QUYẾT LƯU TRỮ THÔNG MINH</h3>
            <div className="article-line"></div>
            <p className="article-excerpt">
              Tổ chức bộ sưu tập voucher của bạn một cách khoa học. Phân loại
              theo giá trị, thời hạn sử dụng và loại sản phẩm áp dụng để luôn
              sẵn sàng cho mọi dịp mua sắm.
            </p>
            <ul className="article-highlights">
              <li>Ưu tiên voucher sắp hết hạn</li>
              <li>Nhóm theo mức giảm giá</li>
              <li>Lưu voucher đặc biệt cho sự kiện lớn</li>
            </ul>
          </article>

          {/* Article 4 */}
          <article className="article-card">
            <div className="article-number">04</div>
            <h3 className="article-title">MUA SẮM ĐÚNG THỜI ĐIỂM</h3>
            <div className="article-line"></div>
            <p className="article-excerpt">
              Kế hoạch mua sắm thông minh giúp bạn tận dụng tối đa giá trị
              voucher. Theo dõi lịch khuyến mãi, kết hợp voucher với giảm giá
              sản phẩm để đạt hiệu quả tốt nhất.
            </p>
            <ul className="article-highlights">
              <li>Black Friday - Giảm đến 70%</li>
              <li>Sinh nhật thương hiệu - Ưu đãi độc quyền</li>
              <li>Cuối mùa - Thanh lý bộ sưu tập</li>
            </ul>
          </article>

          {/* Article 5 */}
          <article className="article-card">
            <div className="article-number">05</div>
            <h3 className="article-title">THÀNH VIÊN VIP - ƯU ĐÃI ĐẶC QUYỀN</h3>
            <div className="article-line"></div>
            <p className="article-excerpt">
              Nâng cấp trải nghiệm với chương trình thành viên Paradise. Nhận
              voucher độc quyền, ưu tiên mua sắm và nhiều đặc quyền cao cấp dành
              riêng cho khách hàng thân thiết.
            </p>
            <ul className="article-highlights">
              <li>Voucher sinh nhật - Giảm 20%</li>
              <li>Early access - Mua trước người khác</li>
              <li>Points tích lũy đổi voucher</li>
            </ul>
          </article>

          {/* Article 6 */}
          <article className="article-card">
            <div className="article-number">06</div>
            <h3 className="article-title">CHIA SẺ ĐỂ NHẬN THÊM</h3>
            <div className="article-line"></div>
            <p className="article-excerpt">
              Chương trình giới thiệu bạn bè - Cả hai cùng được hưởng lợi. Mỗi
              lần giới thiệu thành công, bạn và người bạn đều nhận voucher giảm
              giá hấp dẫn cho lần mua tiếp theo.
            </p>
            <ul className="article-highlights">
              <li>Tặng 100k cho người giới thiệu</li>
              <li>Người mới nhận 150k voucher chào mừng</li>
              <li>Không giới hạn số lượng giới thiệu</li>
            </ul>
          </article>
        </div>
      </div>

      {/* Premium Benefits Section */}
      <div className="premium-benefits">
        <div className="benefits-content">
          <h2 className="benefits-title">PARADISE PRIVILEGE</h2>
          <div className="benefits-divider"></div>
          <p className="benefits-description">
            Đăng ký nhận thông báo để không bỏ lỡ các ưu đãi độc quyền
          </p>
          <div className="benefits-features">
            <div className="benefit-item">
              <div className="benefit-icon">✦</div>
              <h4>Voucher Độc Quyền</h4>
              <p>Mã giảm giá chỉ dành cho thành viên</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✦</div>
              <h4>Ưu Tiên Mua Sắm</h4>
              <p>Truy cập sớm vào các chương trình sale</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✦</div>
              <h4>Tích Điểm Thưởng</h4>
              <p>Đổi điểm lấy voucher giá trị cao</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherHuntPage;
