import {NextRequest, NextResponse} from 'next/server';
import {neon} from '@neondatabase/serverless';
import { createProtectedHandlers } from '@/lib/auth/api-protection';

const sql = neon(process.env.DATABASE_URL!);

async function handlePUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const body = await request.json();
    const {
        title,
        date,
        quarter,
        estimatedCost,
        category,
        sgaAmount,
        groupFundsAmount,
        expectedAttendees,
        notes,
    } = body;

    const result = await sql`
      UPDATE planned_events
      SET
        title = ${title},
        date = ${date},
        quarter = ${quarter},
        "estimatedCost" = ${estimatedCost},
        category = ${category},
        "sgaAmount" = ${sgaAmount},
        "groupFundsAmount" = ${groupFundsAmount},
        "expectedAttendees" = ${expectedAttendees || null},
        notes = ${notes || null},
        "updatedAt" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (result.length === 0) {
        return NextResponse.json({success: false, error: 'Planned event not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data: result[0]});
}

async function handleDELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const result = await sql`
      DELETE FROM planned_events
      WHERE id = ${params.id}
      RETURNING id
    `;

    if (result.length === 0) {
        return NextResponse.json({success: false, error: 'Planned event not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data: null});
}

export const { PUT, DELETE } = createProtectedHandlers({
    PUT: handlePUT,
    DELETE: handleDELETE,
});