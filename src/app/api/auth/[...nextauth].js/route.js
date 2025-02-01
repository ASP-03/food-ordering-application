import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "../../../models/User";
import bcrypt from 'bcrypt';
import NextAuth from "next-auth"
import mongoose from "mongoose";

const handler = NextAuth({
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        id: 'credentials',
        credentials: {
          username: { label: "Email", type: "email", placeholder: "test@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
          const email = credentials?.email;
          const password = credentials?.password;
          await mongoose.connect(process.env.MONGO_URL);
          const user = User.findOne({email});

          const passwordOk = await user && bcrypt.compareSync(password, user.password); 

          if(passwordOk) {
            return user;
          }

          return null
        }
      })

  ]
})

export { handler as GET, handler as POST }