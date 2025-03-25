import { NextResponse } from "next/server";
import { MenuItem } from "../../models/MenuItem";
import connectDB from "../../../utils/db";

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
    await connectDB();

    try {
        const { _id, ...data } = await req.json();
        const updatedItem = await MenuItem.findByIdAndUpdate(_id, data, { new: true });

        if (!updatedItem) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
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
        await connectDB(); // Ensure DB connection

        const url = new URL(req.url);
        const _id = url.searchParams.get('_id');

        if (!_id) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }

        const deletedMenuItem = await MenuItem.findByIdAndDelete(_id);

        if (!deletedMenuItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("Delete Item Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}