/**
 * Validation Utilities
 * Các hàm validate input cho forms
 */

// ==================== PASSWORD VALIDATION ====================

/**
 * Kiểm tra độ mạnh của password
 * @param {string} password
 * @returns {object} { isValid, strength, message, score }
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return {
      isValid: false,
      strength: "weak",
      message: "Vui lòng nhập mật khẩu",
      score: 0,
    };
  }

  let score = 0;
  const feedback = [];

  // Check length
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push("Ít nhất 8 ký tự");
  }

  if (password.length >= 12) {
    score += 10;
  }

  // Check uppercase
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Ít nhất 1 chữ hoa");
  }

  // Check lowercase
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Ít nhất 1 chữ thường");
  }

  // Check numbers
  if (/\d/.test(password)) {
    score += 20;
  } else {
    feedback.push("Ít nhất 1 số");
  }

  // Check special characters
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 10;
  } else {
    feedback.push("Ít nhất 1 ký tự đặc biệt");
  }

  // Determine strength
  let strength = "weak";
  let message = "";
  let isValid = false;

  if (score >= 80) {
    strength = "strong";
    message = "Mật khẩu mạnh";
    isValid = true;
  } else if (score >= 60) {
    strength = "medium";
    message = "Mật khẩu trung bình";
    isValid = true;
  } else if (score >= 40) {
    strength = "weak";
    message = "Mật khẩu yếu: " + feedback.join(", ");
    isValid = false;
  } else {
    strength = "very-weak";
    message = "Mật khẩu rất yếu: " + feedback.join(", ");
    isValid = false;
  }

  return {
    isValid,
    strength,
    message,
    score,
    feedback,
  };
};

// ==================== EMAIL VALIDATION ====================

/**
 * Validate email format
 * @param {string} email
 * @returns {object} { isValid, message }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Vui lòng nhập email" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không hợp lệ" };
  }

  // Check common typos
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];
  const domain = email.split("@")[1];

  if (domain && !commonDomains.includes(domain)) {
    // Just a warning, not invalid
    return {
      isValid: true,
      message: "",
      warning: `Bạn có chắc email là ${domain}?`,
    };
  }

  return { isValid: true, message: "" };
};

// ==================== PHONE VALIDATION ====================

/**
 * Validate Vietnamese phone number
 * @param {string} phone
 * @returns {object} { isValid, message }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: "Vui lòng nhập số điện thoại" };
  }

  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");

  // Vietnamese phone format: 10-11 digits, starts with 0
  const phoneRegex = /^0\d{9,10}$/;

  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      message: "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)",
    };
  }

  return { isValid: true, message: "" };
};

// ==================== NAME VALIDATION ====================

/**
 * Validate full name
 * @param {string} name
 * @returns {object} { isValid, message }
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: "Vui lòng nhập họ tên" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: "Tên quá ngắn" };
  }

  if (name.trim().length > 100) {
    return { isValid: false, message: "Tên quá dài" };
  }

  // Check for invalid characters (only letters, spaces, Vietnamese characters)
  const nameRegex =
    /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;

  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: "Tên chỉ được chứa chữ cái và khoảng trắng",
    };
  }

  return { isValid: true, message: "" };
};

// ==================== ADDRESS VALIDATION ====================

/**
 * Validate address
 * @param {string} address
 * @returns {object} { isValid, message }
 */
export const validateAddress = (address) => {
  if (!address) {
    return { isValid: false, message: "Vui lòng nhập địa chỉ" };
  }

  if (address.trim().length < 10) {
    return { isValid: false, message: "Địa chỉ quá ngắn (tối thiểu 10 ký tự)" };
  }

  if (address.trim().length > 200) {
    return { isValid: false, message: "Địa chỉ quá dài (tối đa 200 ký tự)" };
  }

  return { isValid: true, message: "" };
};

// ==================== CREDIT CARD VALIDATION ====================

/**
 * Validate credit card number (Luhn algorithm)
 * @param {string} cardNumber
 * @returns {object} { isValid, message, cardType }
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { isValid: false, message: "Vui lòng nhập số thẻ" };
  }

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, "");

  // Check if only digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, message: "Số thẻ chỉ được chứa số" };
  }

  // Detect card type
  let cardType = "unknown";
  if (/^4/.test(cleaned)) cardType = "Visa";
  else if (/^5[1-5]/.test(cleaned)) cardType = "MasterCard";
  else if (/^3[47]/.test(cleaned)) cardType = "American Express";

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0;

  return {
    isValid,
    message: isValid ? "" : "Số thẻ không hợp lệ",
    cardType,
  };
};

// ==================== GENERAL VALIDATORS ====================

/**
 * Validate required field
 * @param {any} value
 * @param {string} fieldName
 * @returns {object} { isValid, message }
 */
export const validateRequired = (value, fieldName = "Trường này") => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return { isValid: false, message: `${fieldName} là bắt buộc` };
  }
  return { isValid: true, message: "" };
};

/**
 * Validate minimum length
 * @param {string} value
 * @param {number} minLength
 * @param {string} fieldName
 * @returns {object} { isValid, message }
 */
export const validateMinLength = (
  value,
  minLength,
  fieldName = "Trường này"
) => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} phải có ít nhất ${minLength} ký tự`,
    };
  }
  return { isValid: true, message: "" };
};

/**
 * Validate maximum length
 * @param {string} value
 * @param {number} maxLength
 * @param {string} fieldName
 * @returns {object} { isValid, message }
 */
export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "Trường này"
) => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} không được vượt quá ${maxLength} ký tự`,
    };
  }
  return { isValid: true, message: "" };
};

/**
 * Validate number range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {string} fieldName
 * @returns {object} { isValid, message }
 */
export const validateRange = (value, min, max, fieldName = "Giá trị") => {
  const num = Number(value);

  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} phải là số` };
  }

  if (num < min || num > max) {
    return {
      isValid: false,
      message: `${fieldName} phải từ ${min} đến ${max}`,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Sanitize HTML input (prevent XSS)
 * @param {string} input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input) return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
