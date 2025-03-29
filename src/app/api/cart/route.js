import mongoose from "mongoose";
import { Cart } from "../../models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return Response.json({});
    }

    const { products } = data;
    const { email: userEmail } = session.user;

    // Update or create cart
    await Cart.findOneAndUpdate(
        { userEmail }, 
        { userEmail, products },
        { upsert: true }
    );

    return Response.json(true);
}

export async function GET(req) {
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return Response.json({});
    }

    const { email: userEmail } = session.user;
    const cart = await Cart.findOne({ userEmail });
    
    return Response.json(cart?.products || []);
} 