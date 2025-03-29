import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../lib/mongodb";  // Ensure this connects to MongoDB

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const { db } = await connectToDatabase();

    if (req.method === "GET") {
        // Fetch user's cart from the database
        const cart = await db.collection("carts").findOne({ userId }) || { products: [] };
        return res.status(200).json(cart.products);
    }

    if (req.method === "PUT") {
        const { products } = req.body;

        await db.collection("carts").updateOne(
            { userId },
            { $set: { products } },
            { upsert: true }
        );

        return res.status(200).json({ message: "Cart updated" });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
