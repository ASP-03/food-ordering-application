import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import mongoose from "mongoose";
import GoogleProvider from "next-auth/providers/google";
import { adapter } from "next/dist/server/web/adapter";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "../../../components/lib/mongoConnect";


const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(client),
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

        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGO_URL);
        }

        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
          return { id: user._id, name: user.name, email: user.email };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",  // Optional: custom error page
  },
};

const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
