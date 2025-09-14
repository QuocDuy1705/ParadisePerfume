import bcrypt from "bcryptjs";
import User from "./models/User.js";

async function createAdmin() {
  const adminExists = await User.findOne({ email: "admin@gmail.com" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await User.create({
      firstName: "Admin",
      lastName: "Paradise",
      email: "admin@gmail.com",
      password: 1,
      country: "VN",
      isAdmin: true, //  quyền admin
    });
    console.log("Admin account created: admin@gmail.com / 1");
  }
}
createAdmin();
