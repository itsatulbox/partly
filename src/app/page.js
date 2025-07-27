'use client'

import { useState } from 'react';
import { Search, Car } from 'lucide-react';

import { useRouter } from "next/navigation";
import {getVehicleInformation} from "@/api/api";


export default function LicenseEnteringPage() {
  const [licensePlate, setLicensePlate] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleLicenseSubmit = () => {
    if (licensePlate.trim()) {
      setIsAnimating(true);
      getVehicleInformation(licensePlate).then(data => {
        // console.log(data)
        console.log(data.variants[0].id)
        router.push(`/search/${data.variants[0].id}`)
      });
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLicenseSubmit();
    }
  };



  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl mb-6 shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Garage
            </h1>
            <p className="text-gray-600 text-lg">
              Add your vehicles here to shop products that fit.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Let's start by adding your vehicle.
            </h2>

            <p className="text-gray-700 text-lg mb-8">
              Do you know the rego plate?
            </p>

            {/* License Plate Input */}
            <div className="mb-8">
              <div className="relative">
                <div className="bg-gray-900 rounded-2xl p-6 border-4 border-yellow-400 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    {/* Mounting holes */}
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>

                  <div className="flex items-center">
                    {/* REGO text */}
                    <div className="text-yellow-400 font-bold text-sm mr-4 writing-mode-vertical">
                      <div>R</div>
                      <div>E</div>
                      <div>G</div>
                      <div>O</div>
                    </div>

                    {/* Separator line */}
                    <div className="w-px h-16 bg-gray-600 mr-6"></div>

                    {/* License plate input */}
                    <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="ABC123"
                        className="bg-transparent text-white text-3xl font-bold placeholder-gray-500 outline-none flex-1 tracking-wider"
                        maxLength="8"
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Find button */}
              <button
                  onClick={handleLicenseSubmit}
                  disabled={!licensePlate.trim()}
                  className={`w-full mt-6 py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                      licensePlate.trim()
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } ${isAnimating ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Find
                </div>
              </button>
            </div>


          </div>
        </div>
      </div>
  );
}