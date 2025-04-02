import { useContext, useState, useEffect } from "react";
import { CartContext } from "../AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import { createPortal } from 'react-dom';

export default function MenuItem({ image, name, description, basePrice, sizes, addToppingsPrice }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const handleAddToCartButtonClick = () => {
    const hasOptions = (sizes && sizes.length > 0) || (addToppingsPrice && addToppingsPrice.length > 0);
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(
      { image, name, basePrice, sizes, addToppingsPrice },
      selectedSize,
      selectedExtras
    );
    
    toast.success(`${name} added to cart!`, {
      duration: 2000,
      position: "top-right",
      style: { background: "#4CAF50", color: "#fff" },
    });

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
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  const hasCustomizations = (sizes && sizes.length > 0) || (addToppingsPrice && addToppingsPrice.length > 0);

  return (
    <>
      <div className="bg-white p-4 rounded-lg text-center flex flex-col h-full">
        <div className="relative w-full pt-[100%] mb-4">
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-contain absolute top-0 left-0 w-full h-full transform transition-all duration-300 hover:scale-105"
          />
        </div>
        <div className="flex-grow flex flex-col">
          <h4 className="font-semibold text-2xl mb-2">{name}</h4>
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{description}</p>
          <button
            onClick={hasCustomizations ? () => setShowPopup(true) : handleAddToCartButtonClick}
            className="w-full bg-red-500 text-white rounded-full py-3 px-6 font-semibold text-lg transition-all duration-300 hover:bg-red-600 active:scale-95"
          >
            Add to Cart Rs.{basePrice}
          </button>
        </div>
      </div>

      {showPopup && typeof window === 'object' && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div 
            className="bg-white p-6 rounded-2xl max-w-[400px] w-[90%] mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Add Item</h3>
            {sizes && sizes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-700 mb-2">Size</h3>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  value={selectedSize?.name || "Regular"}
                  onChange={(e) => {
                    const size = sizes.find(s => s.name === e.target.value);
                    setSelectedSize(size || null);
                  }}
                >
                  <option value="Regular">Regular</option>
                  {sizes.map(size => (
                    <option key={size._id} value={size.name}>
                      {size.name} (+Rs.{size.price})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {addToppingsPrice && addToppingsPrice.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-2">Extras</h3>
                <div className="space-y-2">
                  {addToppingsPrice.map(extra => (
                    <label key={extra._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extra)}
                        checked={selectedExtras.map(e => e._id).includes(extra._id)}
                        className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-gray-600">{extra.name} (+Rs.{extra.price})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="w-full p-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddToCartButtonClick}
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Add to Cart Rs.{selectedPrice}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}