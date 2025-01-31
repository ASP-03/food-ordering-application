import Right from "../../components/icons/Right";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="hero mt-4">
            <div className="py-12">
              <h1 className="text-4xl font-semibold">
                Everything<br />
                 is amazing<br />
                 with a&nbsp;
                <span className="text-red-600">
                  Pizza
                </span>
              </h1>
              <p className="my-6 text-gray-500 text-sm">Pizza makes everything better—whether it's solving problems or celebrating victories. Do you have a favorite pizza topping, or are you just vibing with the pizza energy?
              </p>
              <div className="flex">
                <button className="bg-red-600 flex items-center text-white px-6 py-2 round-full text-sm"> 
                 ORDER NOW
                 <Right/>
                </button>
                <button className="flex gap-1 items-center px-2 py-2 text-gray-600 font-semibold">
                    Learn more
                    <Right />
                </button>

              </div>
            </div>
            <div className="relative">
                <Image src={'/pizza.jpg'} layout={'fill'} objectFit={'contain'} alt={'Pizza'} />
            </div>
        </section>
    )
}