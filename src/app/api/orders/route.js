import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
    mongoose.connect(process.env.MONGO_URL);
    
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    
    if (!email) {
        return Response.json({});
    }

    const orders = await Order.find({ email }).sort({ createdAt: -1 }).lean();
    return Response.json(orders);
}

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);
    
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    
    if (!email) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orderData = await req.json();
        const order = await Order.create({
            ...orderData,
            email,
            status: 'pending'
        });
        return Response.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return Response.json({ error: 'Error creating order' }, { status: 500 });
    }
} 