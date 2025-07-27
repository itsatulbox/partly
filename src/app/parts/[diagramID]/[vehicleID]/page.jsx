"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, Package } from 'lucide-react';
import Image from "next/image";

export default function DiagramPage() {
  const { diagramID, vehicleID } = useParams();
  
  const [data, setData] = useState(null);
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);
  const { cart, addPart, removePart, clearCart } = useCart();

  useEffect(() => {
    if (!diagramID || !vehicleID) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/assemblies.v2.search`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              oem_vehicle_id: vehicleID,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching API data:", err);
      }
    };

    fetchData();
  }, [diagramID, vehicleID]);

  const diagram = data?.diagrams?.[diagramID];
  const assemblies = data?.assemblies ?? {};

  if (!diagram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl mb-6 shadow-lg">
                <Package className="w-8 h-8 text-white animate-pulse" />
              </div>
              <p className="text-lg text-gray-600">Loading diagram...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onImageLoad = () => {
    if (imgRef.current) {
      setImgNaturalSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      });
    }
  };

  const assembliesWithHotspots = Object.values(assemblies).filter(
    (assembly) => assembly.hotspot?.diagram_id === diagramID
  );

  const DISPLAY_WIDTH = 600;
  const scaleX =
    imgNaturalSize.width > 0 ? DISPLAY_WIDTH / imgNaturalSize.width : 1;

  const handleIncreaseQuantity = (partId) => {
    const existingPart = cart.find(part => part.id === partId);
    if (existingPart) {
      addPart({
        ...existingPart,
        quantity: existingPart.quantity + 1
      });
    }
  };

  const handleDecreaseQuantity = (partId) => {
    const existingPart = cart.find(part => part.id === partId);
    if (existingPart) {
      if (existingPart.quantity > 1) {
        const updatedCart = cart.map(part => 
          part.id === partId 
            ? { ...part, quantity: part.quantity - 1 } 
            : part
        );
        addPart(updatedCart.find(part => part.id === partId));
      } else {
        removePart(partId);
      }
    }
  };

  const totalItems = cart.reduce((sum, part) => sum + part.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 justify-center ">

          <div className="flex justify-center">
    <Image
      src="/RepairIt_Image.webp"
      alt="Logo"
      className="w-80 h-40 object-contain mb-6"
      width={80}
      height={40}
    />
  </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Parts Diagram
          </h1>
          <p className="text-gray-600 text-lg">
            Click on the highlighted areas to add parts to your cart
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Diagram Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {diagram.name || 'Vehicle Diagram'}
              </h2>
              
              <div className="relative inline-block w-full">
                <div className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200">
                  <img
                    ref={imgRef}
                    src={diagram.url}
                    alt={diagram.name}
                    className="max-w-full h-auto rounded-xl shadow-md"
                    style={{ maxWidth: DISPLAY_WIDTH }}
                    onLoad={onImageLoad}
                  />

                  {assembliesWithHotspots.map((assembly) => {
                    const { top_left, bottom_right } = assembly.hotspot;
                    const padding = 4; // Add padding to make boxes bigger
                    const left = (top_left.x * scaleX) - padding;
                    const top = (top_left.y * scaleX) - (padding*0.5);
                    const width = ((bottom_right.x - top_left.x) * scaleX) + (padding * 3);
                    const height = ((bottom_right.y - top_left.y) * scaleX) + (padding * 2);

                    return (
                      <button
                        key={assembly.id}
                        className="absolute border-2 border-purple-500 hover:border-purple-600 bg-purple-500/20 hover:bg-purple-600/30 transition-all duration-200 hover:shadow-lg"
                        style={{
                          left: left + 16, // Offset for padding
                          top: top + 16,   // Offset for padding
                          width: width,
                          height: height,
                        }}
                        title={assembly.description}
                        onClick={() => {
                          addPart({
                            id: assembly.id,
                            description: assembly.description,
                            quantity: 1,
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Cart</h3>
                  {totalItems > 0 && (
                    <p className="text-sm text-gray-600">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No parts added yet</p>
                  <p className="text-gray-400 text-sm mt-2">Click on the highlighted areas in the diagram to add parts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((part) => (
                    <div key={part.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm leading-tight">
                        {part.description || "Unclassified Part" + " (ID: " + part.id + ")"}
                      </h4>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(part.id)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          <span className="bg-white px-3 py-1 rounded-lg font-semibold text-gray-900 min-w-[3rem] text-center border border-gray-200">
                            {part.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleIncreaseQuantity(part.id)}
                            className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removePart(part.id)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={clearCart}
                    className="w-full mt-6 py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}