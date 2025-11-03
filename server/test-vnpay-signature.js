import crypto from "crypto";

// Sử dụng data từ log của bạn
const secretKey = "AJ57CUKLGZBXAYN8RUSM3FXRIWY00VAI";

const params = {
  vnp_Amount: "523000000",
  vnp_Command: "pay",
  vnp_CreateDate: "20251028092308",
  vnp_CurrCode: "VND",
  vnp_IpAddr: "127.0.0.1",
  vnp_Locale: "vn",
  vnp_OrderInfo: "Thanh toan don hang VNP68c55df47ee2fc7352bab2ac1761618188513",
  vnp_OrderType: "other",
  vnp_ReturnUrl: "http://localhost:5000/api/payment/vnpay-return",
  vnp_TmnCode: "5XSNTFQU",
  vnp_TxnRef: "VNP68c55df47ee2fc7352bab2ac1761618188513",
  vnp_Version: "2.1.0",
};

// Sắp xếp theo alphabet
const sortedKeys = Object.keys(params).sort();
console.log("🔑 Sorted keys:", sortedKeys);

// Tạo signData
const signDataParts = sortedKeys.map((key) => {
  return `${key}=${params[key]}`;
});
const signData = signDataParts.join("&");

console.log("\n📝 SignData:");
console.log(signData);

// Tạo chữ ký SHA512
const hmac = crypto.createHmac("sha512", secretKey);
const signature = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

console.log("\n🔐 Signature (SHA512):");
console.log(signature);

// Test với dấu cách trong OrderInfo
console.log("\n🧪 Testing with URL-encoded OrderInfo:");
const paramsEncoded = { ...params };
paramsEncoded.vnp_OrderInfo =
  "Thanh%20toan%20don%20hang%20VNP68c55df47ee2fc7352bab2ac1761618188513";

const signDataEncoded = Object.keys(paramsEncoded)
  .sort()
  .map((key) => {
    return `${key}=${paramsEncoded[key]}`;
  })
  .join("&");

const hmacEncoded = crypto.createHmac("sha512", secretKey);
const signatureEncoded = hmacEncoded
  .update(Buffer.from(signDataEncoded, "utf-8"))
  .digest("hex");

console.log("SignData (encoded):", signDataEncoded);
console.log("Signature (encoded):", signatureEncoded);

// Test thử không có OrderType
console.log("\n🧪 Testing WITHOUT vnp_OrderType:");
const paramsNoOrderType = { ...params };
delete paramsNoOrderType.vnp_OrderType;

const signDataNoType = Object.keys(paramsNoOrderType)
  .sort()
  .map((key) => {
    return `${key}=${paramsNoOrderType[key]}`;
  })
  .join("&");

const hmacNoType = crypto.createHmac("sha512", secretKey);
const signatureNoType = hmacNoType
  .update(Buffer.from(signDataNoType, "utf-8"))
  .digest("hex");

console.log("SignData (no OrderType):", signDataNoType);
console.log("Signature (no OrderType):", signatureNoType);
