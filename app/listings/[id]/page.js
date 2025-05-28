'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  if (!listing) return <div className="p-6">Loading...</div>;

  return (
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

        {/* Left arrow */}
        <button
          onClick={showPrevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 shadow transition"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={showNextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 shadow transition"
          aria-label="Next Image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail indicator */}
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

      {/* Details */}
      <p className="text-lg font-semibold mb-2">${listing.price} / month</p>
      <p className="text-gray-700 mb-4">{listing.description}</p>
      <p className="text-sm text-gray-500">Listed by: {listing.landlord_email}</p>
    </div>
  );
}
