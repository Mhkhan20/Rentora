'use client';

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/listings?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section
        className="h-screen bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: "url('/hero1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="z-10 text-center px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">
            Explore Rentals, Anytime, Anywhere.
          </h1>
          <p className="mt-4 text-lg">Find your next home with ease.</p>
        </div>
      </section>

      {/* Animated Search Section */}
      <motion.section
        className="bg-white py-20 px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-semibold text-gray-900 mb-6">
          Find listings near you
        </h2>

        <div className="relative max-w-md mx-auto">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="City, Neighborhood, or Postal Code"
            className="mb-6 pl-10 pr-4 py-3 rounded-lg bg-white text-black placeholder-gray-500"
          />
        </div>

        <a href="/listings"  className="text-gray-600 underline" >
          Get started by browsing available listings.
        </a>
      </motion.section>
    </main>
  );
}
