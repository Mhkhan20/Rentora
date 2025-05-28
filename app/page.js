'use client';

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function Home() {
  const router = useRouter();

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

      {/* Scroll Section */}
      <section className="bg-white py-20 px-6 text-center">
        <h2 className="text-4xl font-semibold text-gray-900 mb-6">
          Find listings near you
        </h2>

        <div className="relative max-w-md mx-auto">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => router.push('/listings')}
          />
          <Input
            type="text"
            placeholder="City, Neighborhood, or Postal Code"
            className="pl-10 pr-4 py-3 rounded-lg bg-white text-black placeholder-gray-500"
          />
        </div>

        <p className="text-gray-600 mt-6">
          Get started by browsing available listings.
        </p>
      </section>
    </main>
  );
}
