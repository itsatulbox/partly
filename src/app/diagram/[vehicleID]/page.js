"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Zap, Eye, Download, Filter, Grid3X3, List } from "lucide-react";
import { getDiagrams } from "@/api/api";
import Image from "next/image";

export default function Home() {
  const {vehicleID} = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const router = useRouter();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/assemblies.v2.search`,
    //       {
    //         method: "POST",
    //         headers: {
    //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           oem_vehicle_id: vehicleID,
    //         }),
    //       }
    //     );

    //     if (!res.ok) throw new Error("Failed to fetch data");

    //     const json = await res.json();
    //     setData(json);
    //   } catch (err) {
    //     console.error("Error fetching API data:", err);
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };


    getDiagrams(vehicleID).then(res => {
      setData(res);
      setLoading(false);
    })


    // fetchData();
  }, []);

    const handleClick = (diagramID) => () => {
        router.push(`/parts/${diagramID}/${vehicleID}`);
    };

  const formatName = (name) => {
    return name
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredDiagrams = data?.diagrams
    ? Object.values(data.diagrams).filter((diagram) =>
        diagram.name.includes("BUMPER") &&
        (searchTerm === "" || 
         diagram.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="group">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 shadow-lg">
            <div className="w-full h-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl mb-6 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg w-2/3 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const DiagramModal = ({ diagram, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">{formatName(diagram.name)}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <img
            src={diagram.url}
            alt={diagram.name}
            className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Bumper Diagrams
              </h1>
              <p className="text-gray-600">Explore automotive parts with stunning visual clarity</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search diagrams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none w-64 text-black"
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredDiagrams.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Filter className="w-4 h-4" />
                {filteredDiagrams.length} diagrams found
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredDiagrams.map((diagram, index) => (
                  <div
                    key={diagram.id}
                    className="group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={handleClick(diagram.id)}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-indigo-200 animate-in slide-in-from-bottom duration-700">
                      <div className="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={diagram.url}
                          alt={diagram.name}
                          className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {formatName(diagram.name)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4" onClick={handleClick}>
                {filteredDiagrams.map((diagram, index) => (
                  <div
                    key={diagram.id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-indigo-200 cursor-pointer animate-in slide-in-from-left"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={handleClick(diagram.id)}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={diagram.url}
                          alt={diagram.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {formatName(diagram.name)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No diagrams found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? `No bumper diagrams match "${searchTerm}". Try adjusting your search.`
                : "No bumper diagrams are currently available."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>


      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}