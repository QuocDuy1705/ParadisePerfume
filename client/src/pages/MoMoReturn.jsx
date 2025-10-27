import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const MoMoReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (resultCode === "0") {
      // Thanh toán thành công
      setStatus("success");

      // KHÔNG clearCart ở đây - sẽ clear ở trang OrderSuccess
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate("/order-success", {
          state: {
            orderId: orderId,
            paymentMethod: "MoMo",
            totalAmount: amount ? parseInt(amount) : null,
          },
        });
      }, 2000);
    } else {
      // Thanh toán thất bại
      setStatus("failed");

      setTimeout(() => {
        navigate(
          `/checkout?payment=failed&message=${encodeURIComponent(
            message || ""
          )}`
        );
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
            <div style={styles.iconSuccess}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M10 24L18 32L38 12"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 style={styles.title}>Thanh toán thành công!</h2>
            <p style={styles.message}>Cảm ơn bạn đã thanh toán qua MoMo</p>
            <p style={styles.subMessage}>
              Đang chuyển hướng đến trang xác nhận đơn hàng...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={styles.iconFailed}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M14 14L34 34M34 14L14 34"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
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
    borderTop: "4px solid #d82d8b",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },
  iconSuccess: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#4caf50",
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

export default MoMoReturn;
