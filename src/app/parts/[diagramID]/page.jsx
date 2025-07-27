"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function DiagramPage() {
  const { diagramID } = useParams();
  const [data, setData] = useState(null);
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);
  const { cart, addPart, removePart, clearCart } = useCart();

  useEffect(() => {
    if (!diagramID) return;

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
              oem_vehicle_id: "dG95b3RhOjE6SlROS0UzQkUyMDM1MTQyMjI6MA",
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
  }, [diagramID]);

  const diagram = data?.diagrams?.[diagramID];
  const assemblies = data?.assemblies ?? {};

  if (!diagram) {
    return <p>Loading diagram or diagram not found...</p>;
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

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      {/* Diagram and buttons */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          ref={imgRef}
          src={diagram.url}
          alt={diagram.name}
          style={{ maxWidth: DISPLAY_WIDTH, height: "auto", display: "block" }}
          onLoad={onImageLoad}
        />

        {assembliesWithHotspots.map((assembly) => {
          const { top_left, bottom_right } = assembly.hotspot;
          const left = (top_left.x + bottom_right.x) / 2;
          const top = (top_left.y + bottom_right.y) / 2;
          const leftPos = left * scaleX;
          const topPos = top * scaleX;

          return (
            <button
              key={assembly.id}
              style={{
                position: "absolute",
                left: leftPos,
                top: topPos,
                width: 16,
                height: 16,
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                border: "2px solid white",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
              }}
              title={assembly.description}
              onClick={() => {
                addPart({
                  id: assembly.id,
                  description: assembly.description,
                  quantity: assembly.quantity ?? 1,
                });
              }}
            />
          );
        })}
      </div>

      {/* Cart display */}
      <div
        style={{
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          minWidth: "250px",
          maxWidth: "300px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>🛒 Cart</h3>
        {cart.length === 0 ? (
          <p>No parts added yet.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {cart.map((part) => (
              <li key={part.id} style={{ marginBottom: "0.5rem" }}>
                <strong>{part.description}</strong>
                <div style={{ fontSize: "0.85rem" }}>Qty: {part.quantity}</div>
                <button
                  onClick={() => removePart(part.id)}
                  style={{
                    marginTop: "4px",
                    padding: "2px 6px",
                    fontSize: "0.8rem",
                    backgroundColor: "#ff6666",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              marginTop: "1rem",
              padding: "6px 10px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Cart
          </button>
        )}
      </div>
    </div>
  );
}
