import { Category } from "../../models/Category"

export async function POST(req) {
    const {name} = await req.json()
    const categoryDoc = await Category.create({name})
    return Response.json(categoryDoc)
}