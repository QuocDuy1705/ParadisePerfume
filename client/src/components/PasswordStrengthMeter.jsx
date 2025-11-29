import React from "react";
import "../assets/styles/passwordStrength.css";

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  let score = 0;
  const feedback = [];

  // Check length
  if (password.length >= 8) score += 20;
  else feedback.push("Ít nhất 8 ký tự");

  if (password.length >= 12) score += 10;

  // Check uppercase
  if (/[A-Z]/.test(password)) score += 20;
  else feedback.push("Ít nhất 1 chữ hoa");

  // Check lowercase
  if (/[a-z]/.test(password)) score += 20;
  else feedback.push("Ít nhất 1 chữ thường");

  // Check numbers
  if (/\d/.test(password)) score += 20;
  else feedback.push("Ít nhất 1 số");

  // Check special characters
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 10;
  else feedback.push("Ít nhất 1 ký tự đặc biệt");

  // Determine strength
  let strength = "very-weak";
  let label = "Rất yếu";
  let color = "#d32f2f";

  if (score >= 80) {
    strength = "strong";
    label = "Mạnh";
    color = "#388e3c";
  } else if (score >= 60) {
    strength = "medium";
    label = "Trung bình";
    color = "#f57c00";
  } else if (score >= 40) {
    strength = "weak";
    label = "Yếu";
    color = "#fbc02d";
  }

  return (
    <div className="password-strength-meter">
      <div className="strength-bar-container">
        <div
          className={`strength-bar ${strength}`}
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className="strength-info">
        <span className="strength-label" style={{ color }}>
          {label}
        </span>
        {feedback.length > 0 && (
          <span className="strength-feedback">{feedback.join(", ")}</span>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
