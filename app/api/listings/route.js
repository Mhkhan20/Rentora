import pool from '../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim().toLowerCase();

    let listingsResult;

    if (search) {

      listingsResult = await pool.query(`
        SELECT l.*, u.email AS landlord_email
        FROM listings l
        JOIN users u ON l.landlord_id = u.id
        WHERE LOWER(l.title) ILIKE $1
           OR LOWER(l.description) ILIKE $1
           OR LOWER(l.location) ILIKE $1
      `, [`%${search}%`]);
    } else {
      listingsResult = await pool.query(`
        SELECT l.*, u.email AS landlord_email
        FROM listings l
        JOIN users u ON l.landlord_id = u.id
      `);
    }

    const listings = listingsResult.rows;

    // Fetch related images
    const listingIds = listings.map((l) => l.id);
    const imagesResult = await pool.query(`
      SELECT listing_id, image_url
      FROM listing_images
      WHERE listing_id = ANY($1)
    `, [listingIds]);
    const images = imagesResult.rows;

    // Group images by listing_id
    const imageMap = {};
    images.forEach((img) => {
      if (!imageMap[img.listing_id]) {
        imageMap[img.listing_id] = [];
      }
      imageMap[img.listing_id].push(img.image_url);
    });

    // Attach images
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
