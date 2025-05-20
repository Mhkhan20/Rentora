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