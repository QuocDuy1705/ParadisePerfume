import fetch from "node-fetch";

const testRegister = async () => {
  console.log("🧪 Testing Registration with Email...\n");

  const userData = {
    firstName: "Test",
    lastName: "Email",
    email: "duylun15950@gmail.com", // Send to yourself to test
    password: "Test123456",
    country: "Vietnam",
  };

  console.log("📤 Sending registration request...");
  console.log("Email will be sent to:", userData.email);
  console.log("");

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Registration successful!");
      console.log("User:", data.user);
      console.log("\n📬 Check server terminal for email logs:");
      console.log("   - 🔔 Attempting to send welcome email");
      console.log("   - ✅ Welcome email sent successfully");
      console.log("\n📧 Check inbox:", userData.email);
      console.log("   - Check Primary inbox");
      console.log("   - Check Spam/Junk folder");
      console.log("   - Check Promotions tab (if Gmail)");
    } else {
      console.log("❌ Registration failed:", data.message);
      if (
        data.message.includes("Email already registered") ||
        data.message.includes("Email đã được đăng ký")
      ) {
        console.log("\n💡 This email is already registered. Try:");
        console.log("   1. Use a different email");
        console.log("   2. Login instead of register");
        console.log("   3. Delete user from database and try again");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n🔧 Make sure:");
    console.log("   - Server is running (npm run dev in server folder)");
    console.log("   - Server is on port 5000");
  }
};

testRegister();
