import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import mongoose from "mongoose";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  secret: process.env.SECRET,
  providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        await mongoose.connect(process.env.MONGO_URL);
        const user = await User.findOne({ email }); // Add `await` here to fetch the user

        if (user && bcrypt.compareSync(password, user.password)) {
          return user; // Authentication successful
        }

        return null; // Authentication failed
      },
    }),
  ],
};

const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
