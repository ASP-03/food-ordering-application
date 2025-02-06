import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");

        if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const bucket = "asp-food-ordering";
        const region = "ap-southeast-2";
        const endpoint = `https://${bucket}.s3.${region}.amazonaws.com`;

        const s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });

        const ext = file.name.split(".").pop();
        const newFileName = `${uniqid()}.${ext}`;

        const chunks = [];
        for await (const chunk of file.stream()) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: newFileName,
                ACL: "public-read",
                ContentType: file.type,
                Body: buffer,
            })
        );

        const link = `${endpoint}/${newFileName}`;

        return new Response(JSON.stringify({ url: link }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        return new Response(JSON.stringify({ error: "File upload failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}