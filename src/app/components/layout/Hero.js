'use client';
import { useRouter } from "next/navigation";
import Right from "../../components/icons/Right";
import Image from "next/image";

export default function Hero({ aboutRef }) {
  const router = useRouter();

  const handleOrderNow = () => {
      router.push('/menu');
  };

  const handleLearnMore = () => {
      const offset = 400;
      const top = aboutRef.current.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
  };

    return (
        <section className="hero mt-4 px-4 max-w-6xl mx-auto overflow-hidden">
            <div className="py-12 animate-fade-in">
              <h1 className="text-4xl font-semibold">
                Everything<br />
                is amazing<br />
                with a&nbsp;
                <span className="text-red-600">
                  Pizza
                </span>
              </h1>
              <p className="my-6 text-gray-500 text-sm">
                Pizza makes everything better—whether it's solving problems or celebrating victories. 
                Do you have a favorite pizza topping, or are you just vibing with the pizza energy?
              </p>
              <div className="flex gap-4 flex-wrap">
                <button 
                    className="bg-red-600 flex items-center gap-2 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 hover:shadow-lg" 
                    onClick={handleOrderNow}
                > 
                    ORDER NOW
                    <Right className="w-3.5 h-3.5"/>
                </button>
                <button 
                    className="flex items-center gap-2 px-5 py-2 text-gray-600 font-semibold border border-gray-300 rounded-full hover:border-red-600 hover:text-red-600" 
                    onClick={handleLearnMore}
                >
                    Learn more
                    <Right className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
            <div className="relative w-full h-[300px] md:h-[400px]">
                <Image 
                    src="/pizza.jpg" 
                    fill
                    style={{ objectFit: "cover" }} 
                    alt="Pizza"
                    className="rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>
        </section>
    )
}
