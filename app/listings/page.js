'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const router = useRouter();

  const [query, setQuery] = useState(search || '');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/listings${search ? `?search=${encodeURIComponent(search)}` : ''}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };

    fetchListings();
  }, [search]);

  const handleSearch = () => {
    if (query.trim() !== '') {
      router.push(`/listings?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/listings'); // clear search
    }
  };

  return (
    <div className="p-6">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">
          {search ? `Results for "${search}"` : 'Available Listings'}
        </h1>
        <div className="flex items-center gap-2 max-w-md w-full md:w-auto">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Find Your Next Home..."
            className="w-full"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Listing Cards */}
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
