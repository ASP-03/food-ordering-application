import { useContext, useState, useEffect } from "react";
import { CartContext } from "../AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Tile from "../../components/menu/Tile";
import { motion } from "framer-motion";

export default function MenuItem({ image, name, description, basePrice, sizes, addToppingsPrice }) {
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Prevent scrolling when popup is open
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  async function handleAddToCartButtonClick() {
    console.log("add to cart");
    const hasOptions = sizes.length > 0 || addToppingsPrice.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart({ image, name, basePrice, sizes, addToppingsPrice }, selectedSize, selectedExtras);
    
    // Show toast notification
    toast.success(`${name} added to cart!`, {
      duration: 2000, // Toast disappears after 2 seconds
      position: "top-right", // Position at top-right
      style: {
        background: "#4CAF50", // Green background
        color: "#fff", // White text
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("hiding popup");
    setShowPopup(false);
  }

  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => prev.filter((e) => e.name !== extraThing.name));
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) selectedPrice += selectedSize.price;
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div onClick={() => setShowPopup(false)} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div onClick={(ev) => ev.stopPropagation()} className="my-8 bg-white p-4 rounded-lg max-w-md z-50">
            <div className="overflow-y-scroll p-2" style={{ maxHeight: "calc(100vh - 100px)" }}>
              <Image src={image} alt={name} width={300} height={200} className="mx-auto" />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">{description}</p>

              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map((size) => (
                    <label key={size._id} className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"
                      />
                      {size.name} Rs.{basePrice + size.price}
                    </label>
                  ))}
                </div>
              )}

              {addToppingsPrice?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Any extras?</h3>
                  {addToppingsPrice.map((extraThing) => (
                    <label key={extraThing._id} className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="checkbox"
                        onChange={(ev) => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.map((e) => e._id).includes(extraThing._id)}
                        name={extraThing.name}
                      />
                      {extraThing.name} +Rs.{extraThing.price}
                    </label>
                  ))}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCartButtonClick}
                className="mt-4 bg-red-600 text-white rounded-full px-8 py-2"
              >
                Add to cart Rs.{selectedPrice}
              </motion.button>  

              <button className="mt-2 block mx-auto text-gray-500" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Tile onAddToCart={handleAddToCartButtonClick} image={image} name={name} description={description} basePrice={basePrice} />
    </>
  );
}
