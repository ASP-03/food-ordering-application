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

export async function GET(req) {
    await connectDB();

    try {
        const menuItems = await MenuItem.find();
        return NextResponse.json(menuItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
