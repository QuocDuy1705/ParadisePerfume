import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmation = async (to, order) => {
  const html = `
    <h3>Cảm ơn bạn đã đặt hàng!</h3>
    <p>Mã đơn: ${order._id}</p>
    <p>Tổng tiền: ${order.totalAmount.toLocaleString()}₫</p>
  `;

  await transporter.sendMail({
    from: `"Perfume Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Xác nhận đơn hàng từ Perfume Shop",
    html,
  });
};
