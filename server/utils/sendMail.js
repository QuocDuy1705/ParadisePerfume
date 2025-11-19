import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Email Template Styles
const emailStyles = `
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
    .content { padding: 30px; }
    .order-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .order-item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; justify-content: space-between; }
    .order-item:last-child { border-bottom: none; }
    .total { background: #000; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold; margin-top: 20px; border-radius: 8px; }
    .footer { background: #f4f4f4; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-confirmed { background: #d1ecf1; color: #0c5460; }
    .status-shipping { background: #d4edda; color: #155724; }
    .status-delivered { background: #d4edda; color: #155724; }
  </style>
`;

// Order Confirmation Email
export const sendOrderConfirmation = async (to, order, userInfo) => {
  const orderItems = order.items
    .map(
      (item) => `
    <div class="order-item">
      <div>
        <strong>${item.productId?.name || "Sản phẩm"}</strong><br>
        <span style="color: #666;">Số lượng: ${item.quantity}</span>
      </div>
      <div style="font-weight: bold;">
        ${(item.productId?.price * item.quantity).toLocaleString()}₫
      </div>
    </div>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PARADISE PERFUME</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">LUXURY FRAGRANCE</p>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">✅ Đơn hàng đã được xác nhận!</h2>
          <p>Xin chào <strong>${
            userInfo?.firstName || "Quý khách"
          }</strong>,</p>
          <p>Cảm ơn bạn đã đặt hàng tại Paradise Perfume. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
          
          <div class="order-info">
            <h3 style="margin-top: 0;">Thông tin đơn hàng</h3>
            <p><strong>Mã đơn hàng:</strong> #${order._id
              .toString()
              .slice(-8)
              .toUpperCase()}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString("vi-VN")}</p>
            <p><strong>Trạng thái:</strong> <span class="status-badge status-${
              order.status
            }">${getStatusText(order.status)}</span></p>
            <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(
              order.paymentMethod
            )}</p>
          </div>

          <h3>Chi tiết đơn hàng</h3>
          ${orderItems}
          
          <div class="total">
            TỔNG CỘNG: ${order.totalAmount.toLocaleString()}₫
          </div>

          <div style="text-align: center;">
            <a href="${
              process.env.FRONTEND_URL
            }/orders" class="button">Xem đơn hàng</a>
          </div>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            📦 Đơn hàng sẽ được giao trong vòng 3-5 ngày làm việc.<br>
            💬 Nếu có thắc mắc, vui lòng liên hệ: <strong>hotro@paradiseperfume.com</strong>
          </p>
        </div>

        <div class="footer">
          <p>Paradise Perfume - Luxury Fragrance Experience</p>
          <p>Email: contact@paradiseperfume.com | Hotline: 1900 xxxx</p>
          <p style="margin-top: 10px;">
            <a href="${
              process.env.FRONTEND_URL
            }" style="color: #000; text-decoration: none; margin: 0 10px;">Trang chủ</a> |
            <a href="${
              process.env.FRONTEND_URL
            }/products" style="color: #000; text-decoration: none; margin: 0 10px;">Sản phẩm</a> |
            <a href="${
              process.env.FRONTEND_URL
            }/contact" style="color: #000; text-decoration: none; margin: 0 10px;">Liên hệ</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Paradise Perfume" <${process.env.EMAIL_USER}>`,
    to,
    subject: `✅ Xác nhận đơn hàng #${order._id
      .toString()
      .slice(-8)
      .toUpperCase()} - Paradise Perfume`,
    html,
  });
};

// Welcome Email for New Users
export const sendWelcomeEmail = async (to, userInfo) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PARADISE PERFUME</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">LUXURY FRAGRANCE</p>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">🎉 Chào mừng đến với Paradise!</h2>
          <p>Xin chào <strong>${userInfo.firstName} ${userInfo.lastName}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Paradise Perfume - nơi mang đến những mùi hương sang trọng và đẳng cấp.</p>
          
          <div class="order-info">
            <h3 style="margin-top: 0;">🎁 Ưu đãi dành cho thành viên mới</h3>
            <p>✨ Giảm <strong>10%</strong> cho đơn hàng đầu tiên</p>
            <p>🚚 Miễn phí vận chuyển cho đơn từ 500.000₫</p>
            <p>💝 Tích điểm với mỗi đơn hàng</p>
            <p>🎂 Quà tặng sinh nhật đặc biệt</p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/products" class="button">Khám phá sản phẩm</a>
          </div>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Hãy khám phá bộ sưu tập nước hoa cao cấp của chúng tôi và tìm ra mùi hương hoàn hảo cho bạn!
          </p>
        </div>

        <div class="footer">
          <p>Paradise Perfume - Luxury Fragrance Experience</p>
          <p>Email: contact@paradiseperfume.com | Hotline: 1900 xxxx</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Paradise Perfume" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Chào mừng bạn đến với Paradise Perfume!",
    html,
  });
};

// Order Status Update Email
export const sendOrderStatusEmail = async (to, order, userInfo) => {
  const statusMessages = {
    pending: {
      icon: "⏳",
      title: "Đơn hàng đang chờ xác nhận",
      message: "Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.",
    },
    confirmed: {
      icon: "✅",
      title: "Đơn hàng đã được xác nhận",
      message: "Đơn hàng của bạn đã được xác nhận và sẽ sớm được giao.",
    },
    shipping: {
      icon: "🚚",
      title: "Đơn hàng đang được giao",
      message: "Đơn hàng đang trên đường đến bạn!",
    },
    delivered: {
      icon: "📦",
      title: "Đơn hàng đã được giao thành công",
      message: "Đơn hàng đã được giao đến bạn. Cảm ơn bạn đã mua hàng!",
    },
    cancelled: {
      icon: "❌",
      title: "Đơn hàng đã bị hủy",
      message: "Đơn hàng của bạn đã bị hủy.",
    },
  };

  const statusInfo = statusMessages[order.status] || statusMessages.pending;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PARADISE PERFUME</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">${statusInfo.icon} ${statusInfo.title}</h2>
          <p>Xin chào <strong>${
            userInfo?.firstName || "Quý khách"
          }</strong>,</p>
          <p>${statusInfo.message}</p>
          
          <div class="order-info">
            <p><strong>Mã đơn hàng:</strong> #${order._id
              .toString()
              .slice(-8)
              .toUpperCase()}</p>
            <p><strong>Trạng thái:</strong> <span class="status-badge status-${
              order.status
            }">${getStatusText(order.status)}</span></p>
            <p><strong>Tổng tiền:</strong> ${order.totalAmount.toLocaleString()}₫</p>
          </div>

          <div style="text-align: center;">
            <a href="${
              process.env.FRONTEND_URL
            }/orders" class="button">Xem chi tiết</a>
          </div>
        </div>

        <div class="footer">
          <p>Paradise Perfume - Luxury Fragrance Experience</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Paradise Perfume" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${statusInfo.icon} Cập nhật đơn hàng #${order._id
      .toString()
      .slice(-8)
      .toUpperCase()}`,
    html,
  });
};

// Password Reset Email
export const sendPasswordResetEmail = async (to, resetToken, userInfo) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PARADISE PERFUME</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">🔐 Yêu cầu đặt lại mật khẩu</h2>
          <p>Xin chào <strong>${
            userInfo?.firstName || "Quý khách"
          }</strong>,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
          </div>

          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            ⚠️ Link này sẽ hết hạn sau 1 giờ.<br>
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>

        <div class="footer">
          <p>Paradise Perfume - Luxury Fragrance Experience</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Paradise Perfume" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Đặt lại mật khẩu - Paradise Perfume",
    html,
  });
};

// Helper Functions
function getStatusText(status) {
  const statusMap = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

function getPaymentMethodText(method) {
  const methodMap = {
    cod: "Thanh toán khi nhận hàng (COD)",
    bank_transfer: "Chuyển khoản ngân hàng",
    vnpay: "VNPay",
    momo: "Ví MoMo",
  };
  return methodMap[method] || method;
}
