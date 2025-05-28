'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listings');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card
            key={listing.id}
            onClick={() => router.push(`/listings/${listing.id}`)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-0">
              <img
                src={listing.images[0] || '/placeholder.png'}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.png';
                }}
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold mt-2">{listing.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
