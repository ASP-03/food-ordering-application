import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import { MenuItem } from "../../models/MenuItem";
import mongoose from "mongoose";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();
        const menuItemDoc = await MenuItem.create(data);
        return NextResponse.json(menuItemDoc, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB(); // Ensure database is connected

        if (!await isAdmin(req)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { _id, category, ...data } = await req.json();

        if (!_id) {
            return NextResponse.json({ error: "Missing _id" }, { status: 400 });
        }

        // Validate ObjectId format for _id and category
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json({ error: "Invalid _id format" }, { status: 400 });
        }
        
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return NextResponse.json({ error: "Invalid category format" }, { status: 400 });
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            _id, 
            { ...data, category: category || null }, // Avoid empty string for category
            { new: true }
        );

        if (!updatedItem) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error("PUT Request Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    await connectDB();
    try {
        const menuItems = await MenuItem.find();
        return NextResponse.json(menuItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        // Use Next.js built-in searchParams
        const _id = req.nextUrl.searchParams.get("_id");

        if (!_id) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }

        const deletedMenuItem = await MenuItem.findByIdAndDelete(_id);

        if (!deletedMenuItem) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("Delete Item Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}