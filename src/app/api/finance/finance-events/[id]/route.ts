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
      UPDATE finance_events
      SET
        purchases = ${JSON.stringify(purchases)},
        "totalCost" = ${totalCost},
        category = ${category},
        "sgaAmount" = ${sgaAmount},
        "groupFundsAmount" = ${groupFundsAmount},
        "attendeeCount" = ${attendeeCount || null},
        "costPerPerson" = ${costPerPerson || null},
        notes = ${notes || null},
        "isPaid" = ${isPaid},
        "updatedAt" = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (result.length === 0) {
        return NextResponse.json({success: false, error: 'Finance event not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data: result[0]});
}

async function handleDELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const result = await sql`
      DELETE FROM finance_events
      WHERE id = ${params.id}
      RETURNING id
    `;

    if (result.length === 0) {
        return NextResponse.json({success: false, error: 'Finance event not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data: null});
}

export const { PUT, DELETE } = createProtectedHandlers({
    PUT: handlePUT,
    DELETE: handleDELETE,
});