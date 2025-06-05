import pool from '../../../lib/db';


export async function POST(req) { 
    try { 
        const { email, role } = await req.json();
        
        await pool.query( 
            'INSERT INTO users (email, role) VALUES ($1, $2)',
            [email, role]
        );

        return new Response(JSON.stringify({success: true}), { status: 201});
    } catch (error) { 
        console.error('DB Error: ', error);
        return new Response(JSON.stringify({error: 'Failed to insert user'}), {status: 500});
    }
}


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  try {
    const result = await pool.query(
      'SELECT role FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    console.log('Fetched role for:', email, '→', result.rows[0].role);

    return new Response(JSON.stringify({ role: result.rows[0].role }), { status: 200 });
  } catch (err) {
    console.error('DB error: ', err);
    return new Response(JSON.stringify({ error: "Failed to fetch user from db" }), { status: 500 });
  }
}
