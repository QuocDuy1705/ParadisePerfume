/**
 * TEST SCRIPT - Payment Integration
 *
 * Script này giúp test các chức năng thanh toán
 * Chạy: node test-payment.js
 */

import axios from "axios";

const API_URL = "http://localhost:5000/api";
const TEST_TOKEN = "YOUR_TEST_TOKEN_HERE"; // Lấy từ localStorage sau khi login

// Test data
const testOrderData = {
  items: [
    {
      productId: "6761e3da03bb5bcd65a73f55", // Thay bằng ID sản phẩm thật
      quantity: 1,
    },
  ],
  shippingAddress: {
    fullName: "Nguyễn Văn A",
    email: "test@example.com",
    phone: "0901234567",
    address: "123 Test Street",
    city: "Hồ Chí Minh",
    district: "Quận 1",
  },
  note: "Test payment integration",
  totalPrice: 1500000,
  shippingFee: 30000,
};

// Test VNPay Payment
async function testVNPayPayment() {
  console.log("\n🧪 Testing VNPay Payment...\n");

  try {
    const response = await axios.post(
      `${API_URL}/payment/vnpay`,
      testOrderData,
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ VNPay Payment URL created successfully!");
    console.log("Payment URL:", response.data.payUrl);
    console.log("Order ID:", response.data.orderId);
    console.log("\n📝 Open this URL in browser to complete payment:\n");
    console.log(response.data.payUrl);
  } catch (error) {
    console.error("❌ VNPay Payment failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Error:", error.response?.data?.error);
  }
}

// Test MoMo Payment
async function testMoMoPayment() {
  console.log("\n🧪 Testing MoMo Payment...\n");

  try {
    const response = await axios.post(
      `${API_URL}/payment/momo`,
      testOrderData,
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ MoMo Payment URL created successfully!");
    console.log("Payment URL:", response.data.payUrl);
    console.log("Order ID:", response.data.orderId);
    console.log("Message:", response.data.message);
    console.log("\n📝 Open this URL in browser to complete payment:\n");
    console.log(response.data.payUrl);
  } catch (error) {
    console.error("❌ MoMo Payment failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Error:", error.response?.data?.error);
  }
}

// Test COD Order
async function testCODOrder() {
  console.log("\n🧪 Testing COD Order...\n");

  try {
    const response = await axios.post(
      `${API_URL}/orders`,
      {
        ...testOrderData,
        paymentMethod: "cod",
      },
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ COD Order created successfully!");
    console.log("Order:", response.data.order);
  } catch (error) {
    console.error("❌ COD Order failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Error:", error.response?.data?.error);
  }
}

// Main test runner
async function runTests() {
  console.log("=".repeat(60));
  console.log("🚀 PAYMENT INTEGRATION TEST SUITE");
  console.log("=".repeat(60));

  if (TEST_TOKEN === "YOUR_TEST_TOKEN_HERE") {
    console.log("\n⚠️  WARNING: Please update TEST_TOKEN in this file first!");
    console.log("\nHow to get token:");
    console.log("1. Login to the app");
    console.log("2. Open DevTools → Application → Local Storage");
    console.log('3. Copy the "token" value');
    console.log("4. Paste it into TEST_TOKEN variable in this file\n");
    return;
  }

  // Chọn test nào chạy
  const testType = process.argv[2] || "all";

  switch (testType) {
    case "vnpay":
      await testVNPayPayment();
      break;
    case "momo":
      await testMoMoPayment();
      break;
    case "cod":
      await testCODOrder();
      break;
    case "all":
    default:
      await testCODOrder();
      await new Promise((r) => setTimeout(r, 1000));
      await testVNPayPayment();
      await new Promise((r) => setTimeout(r, 1000));
      await testMoMoPayment();
      break;
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test suite completed!");
  console.log("=".repeat(60) + "\n");
}

// Run tests
runTests();

// Export for use in other scripts
export { testVNPayPayment, testMoMoPayment, testCODOrder };
