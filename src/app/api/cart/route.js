import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "../../../utils/db";
import { Cart } from "../../models/Cart";

export async function GET(req) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const cart = await Cart.findOne({ userEmail }) || { products: [] };

    return Response.json(cart.products, { status: 200 });
}

export async function PUT(req) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const data = await req.json();
    const { products } = data;

    await Cart.findOneAndUpdate(
        { userEmail },
        { userEmail, products },
        { upsert: true }
    );

    return Response.json({ message: "Cart updated" }, { status: 200 });
}
