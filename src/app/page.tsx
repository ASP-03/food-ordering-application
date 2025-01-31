import Hero from "./components/layout/Hero";
import HomeMenu from "./components/layout/HomeMenu"
import SectionHeaders from "./components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16">
         <SectionHeaders
             subHeader={'Our Journey'}
             mainHeader={'About Us'} 
          />
          <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
             <p>
               Your function syntax is incorrect. The parameters subHeader and mainHeader should be inside parentheses after SectionHeaders, not inside curly braces
            </p>
            <p className="mx-auto">
               Your function syntax is incorrect. The parameters subHeader and mainHeader should be inside parentheses after SectionHeaders.
            </p>
            <p>
              be inside parentheses after SectionHeaders, not inside curly braces
            </p>
          
          </div>
      </section>
      <section className="text-center my-8">
        <SectionHeaders 
            subHeader={'Facing an Issue?'}
            mainHeader={'Contact Us'}
        />
        <div className="mt-8 underline text-gray-500">
           <a className="text-4xl" href="Phone:+915555444422">
            +91 5555 4444 22
           </a>
         </div>
      </section>
    </>
  )
}