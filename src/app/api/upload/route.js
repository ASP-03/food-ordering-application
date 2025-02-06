import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
    const data = await req.formData();
    if(data.get('file')) {
        const file = data.get('file');

        const s3Client = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            }
        })

        const ext = file.name.split('.').slice(-1)[0];

        const newFileName = uniqid() + '.' + ext;

        s3Client.send(new PutObjectCommand({
            Bucket: 'asp-food-ordering',
            Key

        }))
    }
    return Response.json(true);
}