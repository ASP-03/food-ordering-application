'use client';
import { useSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";

export default function profilePage() {
    const session = useSession();
    const {status} = session;

    if(status === 'loading') {
        return 'Loading...'
    }

    if(status === 'unauthenticated') {
        return redirect('/login');
    }

    const userImage = session.data.user.image;

    return (
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
            Profile
            </h1>
            <form className="max-w-md mx-auto">
                <div className="flex gap-4 items-center">
                   <div>
                      <div className="bg-gray-300 p-2 rounded-lg relative">
                         <Image className="rounded-lg w-full h-full mb-1" src={userImage}
                         width={50} height={50} alt={'avatar'} />
                         <button type="button">Edit</button>
                      </div>
                   </div>
                   <div className="grow">
                      <input type="text" placeholder="first and last name" />
                      <button type="submit">Save</button>
                   </div>
                </div>

            </form>
        </section>
        

    ) 

}