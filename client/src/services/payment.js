import API from "./api"; // system axios instance
export const payWithVNPay = () => API.post("/payment/vnpay");
export const payWithMoMo = () => API.post("/payment/momo");
