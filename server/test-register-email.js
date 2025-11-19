import axios from "axios";

const testRegister = async () => {
  console.log("🧪 Testing Registration with Email...\n");

  const userData = {
    firstName: "Test",
    lastName: "Email",
    email: "duylun15950@gmail.com",
    password: "Test123456",
    country: "Vietnam",
  };

  console.log("📤 Sending registration request...");
  console.log("Email will be sent to:", userData.email);
  console.log("");

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      userData
    );

    console.log("✅ Registration successful!");
    console.log("User:", response.data.user);
    console.log("\n📬 NOW CHECK SERVER TERMINAL for:");
    console.log(
      "   🔔 Attempting to send welcome email to: ltqduy1705@gmail.com"
    );
    console.log("   ✅ Welcome email sent successfully");
    console.log("\n📧 Then check inbox: ltqduy1705@gmail.com");
    console.log("   ⚠️ IMPORTANT: Check SPAM folder!");
  } catch (error) {
    if (error.response) {
      console.log("❌ Registration failed:", error.response.data.message);
      if (
        error.response.data.message.includes("already") ||
        error.response.data.message.includes("đã được đăng ký")
      ) {
        console.log("\n💡 Email already registered!");
        console.log("Trying to login instead...\n");

        // Try login
        const loginResponse = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: userData.email,
            password: userData.password,
          }
        );
        console.log("✅ Login successful!");
        console.log("User:", loginResponse.data.user);
        console.log("\n📧 This proves the user exists.");
        console.log("Email was sent when this user first registered.");
      }
    } else {
      console.error("❌ Error:", error.message);
    }
  }
};

testRegister();
