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
    const yearSuffix = year.slice(2, 4);

    const result = await sql`
        SELECT * FROM finance_events
        WHERE "eventId" LIKE ${'%' + yearSuffix + '-%'}
        ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({success: true, data: result});
}

async function handlePOST(request: NextRequest) {
    const body = await request.json();
    const {
        eventId,
        purchases,
        totalCost,
        category,
        sgaAmount,
        groupFundsAmount,
        attendeeCount,
        costPerPerson,
        notes,
        isPaid,
    } = body;

    const result = await sql`
        INSERT INTO finance_events (
            "eventId", purchases, "totalCost", category, "sgaAmount", "groupFundsAmount",
            "attendeeCount", "costPerPerson", notes, "isPaid"
        )
        VALUES (
                   ${eventId}, ${JSON.stringify(purchases)}, ${totalCost}, ${category},
                   ${sgaAmount}, ${groupFundsAmount}, ${attendeeCount || null},
                   ${costPerPerson || null}, ${notes || null}, ${isPaid}
               )
            RETURNING *
    `;

    return NextResponse.json({success: true, data: result[0]});
}

export const { GET, POST } = createProtectedHandlers({
    GET: handleGET,
    POST: handlePOST,
});