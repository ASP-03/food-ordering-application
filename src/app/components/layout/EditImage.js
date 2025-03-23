import toast from "react-hot-toast";
import Image from 'next/image';
import { useState } from 'react';

export default function EditImage({ link, setLink }) {
    const [loading, setLoading] = useState(false);

    async function handleFileChange(ev) {
        const files = ev.target.files;
        if (files?.length === 1) {
            const file = files[0];

            if (!file.type.startsWith("image/")) {
                toast.error("Only .jpg and .png files are allowed!");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB!");
                return;
            }

            const data = new FormData();
            data.append('file', file);
            setLoading(true);

            const uploadPromise = new Promise(async (resolve, reject) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);

                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: data,
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);
                    setLoading(false);

                    if (!response.ok) {
                        reject(new Error('Upload failed: Server error'));
                        return;
                    }

                    const result = await response.json();
                    if (!result.url) {
                        reject(new Error('Invalid response: No image URL returned'));
                        return;
                    }

                    setLink(result.url); 
                    resolve();
                } catch (error) {
                    setLoading(false);
                    if (error.name === 'AbortError') {
                        reject(new Error('Upload timeout: Try again.'));
                    } else {
                        reject(error);
                    }
                }
            });

            await toast.promise(uploadPromise, {
                loading: 'Uploading...',
                success: 'Upload successful!',
                error: (err) => err.message || 'Upload failed',
            });
        }
    }

    return (
        <>
            {link ? (
                <Image className="rounded-lg w-full h-full mb-1" src={link} width={250} height={250} alt="avatar" />
            ) : (
                <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
                    No image selected
                </div>
            )}
            <label>
                <input type="file" className="hidden" onChange={handleFileChange} />
                <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
                    {loading ? "Uploading..." : "Edit"}
                </span>
            </label>
        </>
    );
}
