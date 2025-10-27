import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_Amount = searchParams.get("vnp_Amount");

    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      setStatus("success");

      // KHÔNG clearCart ở đây - sẽ clear ở trang OrderSuccess
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        const orderId = searchParams.get("orderId") || vnp_TxnRef;
        const amount = vnp_Amount ? parseInt(vnp_Amount) / 100 : null;

        navigate("/order-success", {
          state: {
            orderId: orderId,
            paymentMethod: "VNPay",
            totalAmount: amount,
          },
        });
      }, 2000);
    } else {
      // Thanh toán thất bại
      setStatus("failed");

      setTimeout(() => {
        navigate("/checkout?payment=failed");
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "processing" && (
          <>
            <div style={styles.spinner}></div>
            <h2 style={styles.title}>Đang xử lý thanh toán...</h2>
            <p style={styles.message}>Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={styles.iconSuccess}>✓</div>
            <h2 style={styles.title}>Thanh toán thành công!</h2>
            <p style={styles.message}>Cảm ơn bạn đã thanh toán qua VNPay</p>
            <p style={styles.subMessage}>
              Đang chuyển hướng đến trang xác nhận đơn hàng...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={styles.iconFailed}>✕</div>
            <h2 style={styles.title}>Thanh toán thất bại</h2>
            <p style={styles.message}>
              Giao dịch không thành công. Vui lòng thử lại!
            </p>
            <p style={styles.subMessage}>Đang chuyển về trang thanh toán...</p>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "60px 40px",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #000",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },
  iconSuccess: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#4caf50",
    color: "white",
    fontSize: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  iconFailed: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#f44336",
    color: "white",
    fontSize: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "300",
    marginBottom: "12px",
    letterSpacing: "0.5px",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "8px",
  },
  subMessage: {
    fontSize: "14px",
    color: "#999",
  },
};

export default VNPayReturn;
