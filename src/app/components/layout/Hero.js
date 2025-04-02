'use client';
import { useRouter } from "next/navigation";
import Right from "../../components/icons/Right";
import Image from "next/image";

export default function Hero({ aboutRef }) {

  const router = useRouter();

  const handleOrderNow = () => {
      router.push('/menu'); // Redirect to the menu page
  };

  const handleLearnMore = () => {
      const offset = 400; // Reduced offset value for less scrolling
      const top = aboutRef.current.offsetTop - offset; // Use offsetTop for accurate positioning
      window.scrollTo({ top, behavior: 'smooth' }); // Scroll to the adjusted position
  };

    return (
        <section className="hero mt-4">
            <div className="py-18 animate-fade-in">
              <h1 className="text-4xl font-semibold transform transition-all duration-300 hover:scale-105">
                Everything<br />
                 is amazing<br />
                 with a&nbsp;
                <span className="text-red-600 hover:text-red-700 transition-colors duration-200">
                  Pizza
                </span>
              </h1>
              <p className="my-6 text-gray-500 text-sm transform transition-all duration-300 hover:scale-105">
                Pizza makes everything better—whether it's solving problems or celebrating victories. 
                Do you have a favorite pizza topping, or are you just vibing with the pizza energy?
              </p>
              <div className="flex max-w-xs gap-4">
                <button 
                    className="bg-red-600 flex items-center gap-2 text-white px-6 py-2 rounded-full text-sm font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95 group" 
                    onClick={handleOrderNow}
                > 
                    ORDER NOW
                    <Right className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1"/>
                </button>
                <button 
                    className="flex items-center gap-2 px-5 py-2 text-gray-600 font-semibold border border-gray-300 rounded-full transform transition-all duration-300 hover:scale-105 hover:border-red-600 hover:text-red-600 group" 
                    onClick={handleLearnMore}
                >
                    Learn more
                    <Right className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1"/>
                </button>
              </div>
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
                <Image 
                    src="/pizza.jpg" 
                    fill
                    style={{ objectFit: "cover" }} 
                    alt="Pizza"
                    className="transform transition-all duration-500 group-hover:scale-105 rounded-lg"
                />
            </div>
        </section>
    )
}
