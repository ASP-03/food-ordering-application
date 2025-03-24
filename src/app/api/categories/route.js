import connectDB from "../../../utils/db";
import { Category } from "../../models/Category";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB(); 

    try {
        const { name } = await req.json();
        const categoryDoc = await Category.create({ name });
        return NextResponse.json(categoryDoc, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();

    try {
        const { _id, name } = await req.json();
        await Category.updateOne({ _id }, { name });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    await connectDB();

    try {
        const categories = await Category.find();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
