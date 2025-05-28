import pool from '../../../lib/db'; 
export async function GET() {
  try {
    // Step 1: Fetch all listings and landlord email
    const listingsResult = await pool.query(`
      SELECT l.*, u.email AS landlord_email
      FROM listings l
      JOIN users u ON l.landlord_id = u.id
    `);
    const listings = listingsResult.rows;

    // Step 2: Fetch related images
    const listingIds = listings.map((l) => l.id);
    const imagesResult = await pool.query(`
      SELECT listing_id, image_url
      FROM listing_images
      WHERE listing_id = ANY($1)
    `, [listingIds]);
    const images = imagesResult.rows;

    // Step 3: Group images by listing_id
    const imageMap = {};
    images.forEach((img) => {
      if (!imageMap[img.listing_id]) {
        imageMap[img.listing_id] = [];
      }
      imageMap[img.listing_id].push(img.image_url);
    });

    // Step 4: Attach images to listings
    const enrichedListings = listings.map((listing) => ({
      ...listing,
      images: imageMap[listing.id] || [],
    }));

    return new Response(JSON.stringify(enrichedListings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching listings:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch listings' }), {
      status: 500,
    });
  }
}
