import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import mongoose from "mongoose";

// Efficient DB connection handling
async function connectDB() {
  if (mongoose.connections[0].readyState) return; // Already connected
  await mongoose.connect(process.env.MONGO_URL);
}

const handler = NextAuth({
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" }, // Changed 'username' to 'email'
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        await connectDB(); // Connect to DB

        const user = await User.findOne({ email }); // Await DB query

        if (!user) {
          throw new Error("No user found with this email."); // Better error handling
        }

        const passwordOk = await bcrypt.compare(password, user.password); // Compare password

        if (passwordOk) {
          return user; // Successful login
        } else {
          throw new Error("Invalid password."); // Clear error for debugging
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Optional: custom sign-in page
    error: "/auth/error",    // Redirect on auth errors
  },
});

export default handler;
