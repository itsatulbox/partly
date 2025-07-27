'use client'

import {useParams, useRouter} from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function SearchPage() {
    const { vehicleID } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const router = useRouter();

    // Search items data
    const searchItems = [
        // Vehicle Sections
        { id: 'nose', name: 'Nose', category: 'Vehicle Section' },
        { id: 'front', name: 'Front', category: 'Vehicle Section' },
        { id: 'front-underbody', name: 'Front Underbody', category: 'Vehicle Section' },
        { id: 'engine', name: 'Engine Compartment', category: 'Vehicle Section' },
        { id: 'mid', name: 'Mid', category: 'Vehicle Section' },
        { id: 'cabin', name: 'Cabin Space', category: 'Vehicle Section' },
        { id: 'complete', name: 'Complete Chassis', category: 'Vehicle Section' },
        { id: 'rear-underbody', name: 'Rear Underbody', category: 'Vehicle Section' },
        { id: 'rear', name: 'Rear', category: 'Vehicle Section' },

        // Mid Section Parts
        { id: 'door-mirrors', name: 'Door Mirrors', category: 'Mid Section' },
        { id: 'front-doors', name: 'Front Doors', category: 'Mid Section' },
        { id: 'rear-doors', name: 'Rear Doors', category: 'Mid Section' },
        { id: 'side-structure', name: 'Side Structure & Body Pillar', category: 'Mid Section' },
        { id: 'rocker-panel', name: 'Rocker Panel Molding & Step', category: 'Mid Section' },
        { id: 'roof-cut', name: 'Roof Cut', category: 'Mid Section' },
        { id: 'body-floor', name: 'Body Floor Structure', category: 'Mid Section' },
        { id: 'undertray', name: 'Undertray', category: 'Mid Section' },
        { id: 'front-right-plug', name: 'Front Right Door Plug', category: 'Mid Section' },

        // Door Parts
        { id: 'door-panel-glass', name: 'Front Door Panel & Glass', category: 'Door Parts' },
        { id: 'window-regulator', name: 'Window Regulator', category: 'Door Parts' },
        { id: 'door-handle-interior', name: 'Door Handle Interior', category: 'Door Parts' },
        { id: 'door-handle-exterior', name: 'Door Handle Exterior', category: 'Door Parts' },
        { id: 'door-lock', name: 'Door Lock Mechanism', category: 'Door Parts' },
        { id: 'door-seal', name: 'Door Seal', category: 'Door Parts' },

        // Bumper Parts
        { id: 'bumper', name: 'Bumper', category: 'Bumper Parts' },
        { id: 'front-bumper', name: 'Front Bumper', category: 'Bumper Parts' },
        { id: 'rear-bumper', name: 'Rear Bumper', category: 'Bumper Parts' },
        { id: 'bumper-cover', name: 'Bumper Cover', category: 'Bumper Parts' },
        { id: 'bumper-reinforcement', name: 'Bumper Reinforcement', category: 'Bumper Parts' },
        { id: 'fog-light', name: 'Fog Light', category: 'Bumper Parts' },
        { id: 'bumper-trim', name: 'Bumper Trim', category: 'Bumper Parts' }
    ];

    // Filter items based on search term - show all items when search is empty
    const filteredItems = searchTerm.trim() === ''
        ? searchItems
        : searchItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Group filtered items by category
    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isDropdownOpen) {
            setIsDropdownOpen(true);
        }
    };

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    const handleItemSelect = (item) => {
        setSelectedItem(item);
        setSearchTerm(item.name);
        setIsDropdownOpen(false);
        console.log('Selected item:', item);
    };

    const handleNext = () => {
        console.log('Next clicked with:', { vehicleID, selectedItem });
        router.push(`/diagrams/${vehicleID}`)
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col items-center py-12 px-4 overflow-hidden">
            {/* Header Icon */}
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <span className="text-white text-2xl">🔍</span>
            </div>

            {/* Title and Subtitle */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Search Vehicle Parts</h1>
                <p className="text-gray-600 text-lg">Find the right parts for your {vehicleID}</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl flex-1 flex flex-col overflow-hidden">
                {/* Vehicle Info Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Vehicle</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl text-gray-600">🚗</span>
                        </div>
                        <div>
                            <p className="font-medium text-lg text-gray-900">Vehicle ID: {vehicleID}</p>
                            <p className="text-gray-600">Ready to search for parts</p>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">What part do you need?</h3>

                    {/* Search Input */}
                    <div className="relative flex-1 flex flex-col overflow-hidden">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={handleInputFocus}
                                placeholder="Search parts, categories, or components..."
                                className="w-full px-6 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500 text-lg"
                            />
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Dropdown Results */}
                        {isDropdownOpen && (
                            <div ref={dropdownRef} className="absolute z-30 w-full mt-2 flex-1">
                                <div className="border border-gray-200 rounded-2xl bg-white shadow-2xl max-h-80 overflow-y-auto">
                                    {Object.keys(groupedItems).length === 0 ? (
                                        <div className="p-6 text-center text-gray-600">
                                            No matching parts found. Try a different search term.
                                        </div>
                                    ) : (
                                        Object.entries(groupedItems).map(([category, items]) => (
                                            <div key={category}>
                                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        {category}
                                                    </h4>
                                                </div>
                                                {items.map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleItemSelect(item)}
                                                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-900 font-medium">{item.name}</span>
                                                            {selectedItem?.id === item.id && (
                                                                <span className="text-purple-600 font-bold">✓</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Item Display */}
                    {selectedItem && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-xl">{selectedItem.name}</h4>
                                    <p className="text-gray-600 mt-2">{selectedItem.category}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedItem(null);
                                        setSearchTerm('');
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-xl font-bold hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={!selectedItem}
                        className={`px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-200 ${
                            selectedItem
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Continue to Details →
                    </button>
                </div>
            </div>

            {/* Theme Toggle (Bottom Left) */}
            <div className="fixed bottom-6 left-6">
                <button className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors">
                    <span className="text-lg">N</span>
                </button>
            </div>
        </div>
    );
}