'use client';
import Hero from "./components/layout/Hero";
import { useRef } from 'react';
import HomeMenu from "./components/layout/HomeMenu"
import SectionHeaders from "./components/layout/SectionHeaders";

export default function Home() {
  const aboutRef = useRef(null);
  return (
    <>
      <Hero aboutRef={aboutRef}/>
      <HomeMenu />
      <section ref={aboutRef} className="text-center my-16" id="about">
         <SectionHeaders
             subHeader={''}
             mainHeader={'About Us'} 
          />
          <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
             <p className="text-lg text-gray-500 mb-4 mt-4">
                Welcome to Rominos Pizza, where we believe that great food brings people together. 
                Our passion for pizza is evident in every slice we serve. We use only the freshest ingredients 
                and traditional recipes to create mouth-watering pizzas that cater to every taste.
            </p>
            <p className="text-lg text-gray-500 mb-4">
                At Rominos, we are committed to providing our customers with an exceptional dining experience. 
                Whether you're dining in, taking out, or ordering delivery, our friendly staff is here to ensure 
                you enjoy every moment with us. 
            </p>
            <p className="text-lg text-gray-500 mb-4">
            Join us for a meal, and discover why we are the go-to pizza place in town. 
            We look forward to serving you!
            </p>
          
          </div>
      </section>
      <section className="text-center my-8" id="contact">
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