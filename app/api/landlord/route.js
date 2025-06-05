import pool from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  try {
    const result = await pool.query(`
      SELECT l.*, u.email AS landlord_email
      FROM listings l
      JOIN users u ON l.landlord_id = u.id
      WHERE LOWER(u.email) = LOWER($1)
    `, [email]);

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error('DB error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch listings' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, price, location, description, landlordEmail, imageUrls } = body;

    const userResult = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [landlordEmail]
    );

    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Landlord not found' }), { status: 404 });
    }

    const landlordId = userResult.rows[0].id;

    const insertListing = await pool.query(
      `INSERT INTO listings (title, price, location, description, landlord_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title, price, location, description, landlordId]
    );

    const listingId = insertListing.rows[0].id;

    // Insert images
    for (const url of imageUrls) {
      await pool.query(
        'INSERT INTO listing_images (listing_id, image_url) VALUES ($1, $2)',
        [listingId, url]
      );
    }

    return new Response(JSON.stringify({ success: true, listingId }), { status: 201 });
  } catch (err) {
    console.error('Insert error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create listing' }), { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  const listingId = params.id;

  try {
    // First, delete related images
    await pool.query('DELETE FROM listing_images WHERE listing_id = $1', [listingId]);

    // Then delete the listing
    await pool.query('DELETE FROM listings WHERE id = $1', [listingId]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error deleting listing:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete listing' }), { status: 500 });
  }
}
