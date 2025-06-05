'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';


export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch('/api/listings');
        const data = await res.json();
        const match = data.find((l) => l.id === parseInt(id));

        if (!match) {
          router.push('/listings');
        } else {
          // Attach 3 other listings (excluding current)
          const others = data.filter((l) => l.id !== parseInt(id));
          match.otherListings = others.slice(0, 3);

          setListing(match);
        }
      } catch (error) {
        console.error('Failed to load listing:', error);
      }
    };

    fetchListing();
  }, [id, router]);

  const showPrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  if (!listing) {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
    </div>
  );
}


  return (
            <motion.div
        className="p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      > 

        <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-500 mb-4">{listing.location}</p>

      {/* Image Carousel */}
      <div className="relative w-full h-80 rounded-xl overflow-hidden mb-4">
        <img
          src={listing.images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          className="object-cover w-full h-full transition duration-300"
        />
        <button
          onClick={showPrevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 shadow transition"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={showNextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 shadow transition"
          aria-label="Next Image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 justify-center mb-6">
        {listing.images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-16 h-16 border-2 rounded overflow-hidden cursor-pointer ${
              index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Listing Details */}
      <p className="text-lg font-semibold mb-2">${listing.price} / month</p>
      <p className="text-gray-700 mb-4">{listing.description}</p>
      <p className="text-sm text-gray-500">Listed by: {listing.landlord_email}</p>

      {/* View More Listings Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">View More Listings</h2>
          <button
            onClick={() => router.push('/listings')}
            className="text-blue-600 hover:underline text-sm"
          >
            Browse All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listing.otherListings.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/listings/${item.id}`)}
              className="cursor-pointer border rounded-lg overflow-hidden hover:shadow transition"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.location}</p>
                <p className="text-sm font-semibold text-gray-800">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      </motion.div>
    
  );
}
