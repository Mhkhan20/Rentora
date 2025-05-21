

import { Input } from "@/components/ui/input";

export default function Home() {



  return (
    <main className="w-full px-6 py-4 flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-black mb-6">Explore Rentals, Anytime, Anywhere.</h1>
      <div className="max-w-md w-full">

        <Input placeholder="City, Neighborhood, or Postal Code"/>
      </div>

      <p className="text-gray-600 mt-5">Get started by browsing available listings.</p>
    </main>
  );
}
