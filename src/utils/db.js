import { Cart } from "../../models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDb from "../../utils/connectDb"; // Ensure correct path

export async function PUT(req) {
    await connectDb(); // Use centralized DB connection
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
    await connectDb(); // Use centralized DB connection
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return Response.json({});
    }

    const { email: userEmail } = session.user;
    const cart = await Cart.findOne({ userEmail });
    
    return Response.json(cart?.products || []);
}
