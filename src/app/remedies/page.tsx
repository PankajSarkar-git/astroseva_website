"use client";

import React from "react";
import Image from "next/image";
import PageWithNav from "@/components/common/page-with-nav";

const remedies = [
  {
    title: "Gemstone & Crystal",
    image: "/remedies/gemstones.jpg",
  },
  {
    title: "Rudraksha",
    image: "/remedies/rudraksha.jpg",
  },
  {
    title: "Palmistry",
    image: "/remedies/palmisty.jpg",
    badge: "Flat 10% OFF",
  },
  {
    title: "Feng Shui",
    image: "/remedies/feng_sui.jpg",
    badge: "Starts at ₹499",
  },
  {
    title: "Vastu",
    image: "/remedies/vastu.jpg",
    badge: "Starts at ₹1100",
  },
  {
    title: "Select Name",
    image: "/remedies/namkaran.jpg",
    badge: "7 Days Replacement",
  },
  {
    title: "Numerology",
    image: "/remedies/numerology.jpg",
    badge: "Starts at ₹1100",
  },
];

export default function RemediesPage() {
  return (
    <PageWithNav>
      <div className="min-h-screen mt-12 bg-white px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {remedies.map((item, idx) => (
            <button
              key={idx}
              className="relative rounded-xl overflow-hidden group w-full aspect-square shadow-sm"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end">
                <p className="text-white text-sm font-semibold px-3 py-2">
                  {item.title}
                </p>
              </div>

              {/* Badge */}
              {item.badge && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                  {item.badge}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </PageWithNav>
  );
}
