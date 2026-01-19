import {NextRequest, NextResponse} from 'next/server';
import {neon} from '@neondatabase/serverless';
import { createProtectedHandlers } from '@/lib/auth/api-protection';

const sql = neon(process.env.DATABASE_URL!);

async function handleGET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const year = searchParams.get('year');

    if (!year) {
        return NextResponse.json({success: false, error: 'Year parameter required'}, {status: 400});
    }

    const result = await sql`
        SELECT * FROM budget_plans
        WHERE "academicYear" = ${year}
        ORDER BY "isOfficial" DESC, "createdAt" DESC
    `;

    return NextResponse.json({success: true, data: result});
}

async function handlePOST(request: NextRequest) {
    const body = await request.json();
    const {name, academicYear, isOfficial} = body;

    if (isOfficial) {
        await sql`
            UPDATE budget_plans
            SET "isOfficial" = false
            WHERE "academicYear" = ${academicYear} AND "isOfficial" = true
        `;
    }

    const result = await sql`
        INSERT INTO budget_plans (name, "academicYear", "isOfficial")
        VALUES (${name}, ${academicYear}, ${isOfficial || false})
        RETURNING *
    `;

    return NextResponse.json({success: true, data: result[0]});
}

export const { GET, POST } = createProtectedHandlers({
    GET: handleGET,
    POST: handlePOST,
});