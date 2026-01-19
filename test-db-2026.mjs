import {neon} from '@neondatabase/serverless';
import {config} from 'dotenv';

config({path: '.env.local'});

console.log(' Testing Neon Postgres connection...\n');

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in .env.local');
    console.log('Run: vercel env pull .env.local');
    process.exit(1);
}

console.log('DATABASE_URL found');

const sql = neon(process.env.DATABASE_URL);

try {
    console.log('Attempting connection...');
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;

    console.log(' Connection successful!\n');
    console.log(' Database info:');
    console.log('   Time:', result[0].current_time);
    console.log('   Version:', result[0].pg_version.split(' ')[1]);

    console.log('\n Checking tables...');
    const tables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    `;

    if (tables.length === 0) {
        console.log('No tables found!');
        console.log('Run creation script');
    } else {
        console.log(' Found tables:');
        tables.forEach(row => {
            console.log('   -', row.table_name);
        });
    }

    console.log('\n Everything looks good!');
    process.exit(0);
} catch (error) {
    console.error('\n Connection failed!');
    console.error('Error:', error.message);

    if (error.message.includes('getaddrinfo')) {
        console.log('\n Fix: Your DATABASE_URL hostname is invalid');
        console.log('   Make sure you created a Neon database in Vercel (not old Vercel Postgres)');
    } else if (error.message.includes('password')) {
        console.log('\n Fix: Check your DATABASE_URL password');
    }

    process.exit(1);
}
