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
            <div className="py-18">
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
              <div className="flex max-w-xs gap-4">
                <button className="bg-red-600 flex justify items-center gap-1 text-white px-6 py-2 round-full text-sm" onClick={handleOrderNow}> 
                 ORDER NOW
                 <Right/>
                </button>
                <button className="flex border-0 gap-1 items-center px-2 py-2 text-gray-600 font-semibold" onClick={handleLearnMore}>
                    Learn more
                    <Right />
                </button>

              </div>
            </div>
            <div className="relative">
            <Image 
              src="/pizza.jpg" 
              fill
              style={{ objectFit: "cover" }} 
              alt="Pizza"
            />
            </div>
        </section>
    )
}