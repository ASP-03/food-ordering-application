import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import NextAuth, {getServerSession} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../../../components/lib/mongoConnect";
import * as mongoose from "mongoose";
import { UserInfo } from "../../../models/UserInfo";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email });
        if (user && bcrypt.compare(password, user.password)) {
          return { 
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name, 
            email: user.email,
            image: user.image
          }; 
        }
        return null;
      },
    }),
  ],
}
  export async function isAdmin() {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    const userInfo = await UserInfo.findOne({email:userEmail});
    if (!userInfo) {
      return false;
    }
    return userInfo.admin;
  }

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
