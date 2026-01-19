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
        SELECT * FROM planned_events
        WHERE "academicYear" = ${year}
        ORDER BY date ASC
    `;

    return NextResponse.json({success: true, data: result});
}

async function handlePOST(request: NextRequest) {
    const body = await request.json();
    const {
        title,
        date,
        quarter,
        academicYear,
        estimatedCost,
        category,
        sgaAmount,
        groupFundsAmount,
        expectedAttendees,
        notes,
    } = body;

    const result = await sql`
        INSERT INTO planned_events (
            title, date, quarter, "academicYear", "estimatedCost", category,
            "sgaAmount", "groupFundsAmount", "expectedAttendees", notes
        )
        VALUES (
                   ${title}, ${date}, ${quarter}, ${academicYear}, ${estimatedCost}, ${category},
                   ${sgaAmount}, ${groupFundsAmount}, ${expectedAttendees || null}, ${notes || null}
               )
            RETURNING *
    `;

    return NextResponse.json({success: true, data: result[0]});
}

export const { GET, POST } = createProtectedHandlers({
    GET: handleGET,
    POST: handlePOST,
});