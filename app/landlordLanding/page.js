'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LandlordPage() {
  const router = useRouter();
  const { user, getEmail, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    imageUrls: [''], // still here for backend structure
  });
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyAccess = async () => {
      if (loading) return;

      if (!user) {
        router.push('/signin');
        return;
      }

      const email = await getEmail();
      setEmail(email);

      if (!email) {
        router.push('/signin');
        return;
      }

      try {
        const res = await fetch(`/api/users?email=${email}`);
        const data = await res.json();

        if (data.role?.toLowerCase() === 'landlord') {
          setAuthorized(true);
          await loadListings(email);
        } else {
          router.push('/listings');
        }
      } catch (error) {
        console.error('Error checking role:', error);
        router.push('/signin');
      } finally {
        setPageLoading(false);
      }
    };

    verifyAccess();
  }, [user, loading]);

  const loadListings = async (email) => {
    try {
      const res = await fetch(`/api/landlord?email=${email}`);
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    }
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...form.imageUrls];
    newUrls[index] = value;
    setForm((prev) => ({ ...prev, imageUrls: newUrls }));
  };

  const handleCreateListing = async () => {
    try {
      const res = await fetch('/api/landlord', {
        method: 'POST',
        body: JSON.stringify({ ...form, landlordEmail: email }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setForm({
          title: '',
          price: '',
          location: '',
          description: '',
          imageUrls: [''],
        });
        await loadListings(email);
      }
    } catch (err) {
      console.error('Failed to create listing:', err);
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
      </div>
    );
  }

  if (!authorized) return null;

  return (


    
  <div className="border-t border-gray-300 pt-8  m-4">

    {/* View Listings */}
        <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Your Listings</h2>

        {listings.length === 0 ? (
            <p className="text-gray-500">You haven’t created any listings yet.</p>
        ) : (
            <ul className="space-y-4">
            {listings.map((listing) => (
                <li
                key={listing.id}
                className="border border-gray-300 rounded-lg p-4 shadow-sm"
                >
                <h3 className="text-xl font-bold text-gray-800">{listing.title}</h3>
                <p className="text-gray-600">{listing.location}</p>
                <p className="text-gray-700 font-medium">${listing.price} / month</p>
                <p className="text-sm text-gray-500 mt-1">{listing.description}</p>
                </li>
            ))}
            </ul>
        )}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8 mt-12 border border-gray-200 max-w-3xl mx-auto ">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Listing</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div className="relative">
      <input
        name="title"
        value={form.title}
        onChange={handleInputChange}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-xl px-4 py-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
        Title
      </label>
    </div>

    <div className="relative">
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleInputChange}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-xl px-4 py-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
        Price (Monthly)
      </label>
    </div>

    <div className="relative">
      <input
        name="location"
        value={form.location}
        onChange={handleInputChange}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-xl px-4 py-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
        Location
      </label>
    </div>

    <div className="relative">
      <input
        name="description"
        value={form.description}
        onChange={handleInputChange}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-xl px-4 py-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
        Description
      </label>
    </div>
  </div>

  {/* Image URLs */}
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
    <label className="text-sm font-medium text-gray-700 block mb-2">Image Links</label>
    <div className="space-y-3">
      {form.imageUrls.map((url, index) => (
        <input
          key={index}
          type="text"
          value={url}
          onChange={(e) => updateImageUrl(index, e.target.value)}
          placeholder={`Image URL ${index + 1}`}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
      <button
        type="button"
        className="text-blue-600 text-sm underline mt-2"
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ''],
          }))
        }
      >
        + Add another image link
      </button>
    </div>
  </div>

  {/* Submit Button */}
  <div className="flex justify-center">
    <button
      onClick={handleCreateListing}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Create Listing
    </button>
  </div>
</div>



  

</div>

  );
}
