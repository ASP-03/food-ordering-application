import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        
        if (!email) {
            return Response.json({});
        }

        // First update all orders to have confirmed status
        await Order.updateMany(
            { email },
            { 
                $set: { 
                    paymentStatus: 'confirmed',
                    status: 'confirmed',
                    paymentMethod: 'Paytm',
                    paymentDate: new Date()
                }
            }
        );

        // Then fetch the updated orders
        const orders = await Order.find({ email }).sort({ createdAt: -1 }).lean();
        return Response.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return Response.json({ error: 'Error fetching orders' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        
        if (!email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orderData = await req.json();
        console.log('Received order data:', orderData);

        // Validate required fields
        if (!orderData.items || !orderData.total || !orderData.address || !orderData.phone) {
            return Response.json({ 
                error: 'Missing required fields',
                details: {
                    items: !orderData.items,
                    total: !orderData.total,
                    address: !orderData.address,
                    phone: !orderData.phone
                }
            }, { status: 400 });
        }

        // Create order with confirmed status
        const order = await Order.create({
            ...orderData,
            email,
            status: 'confirmed',
            paymentStatus: 'confirmed',
            paymentMethod: 'Paytm',
            paymentDate: new Date()
        });

        console.log('Order created successfully:', order);
        return Response.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return Response.json({ 
            error: 'Error creating order',
            details: error.message
        }, { status: 500 });
    }
} 