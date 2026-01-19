import {NextRequest, NextResponse} from 'next/server';
import {neon} from '@neondatabase/serverless';
import { createProtectedHandlers } from '@/lib/auth/api-protection';
import type { FinanceEvent } from '@/app/finance/types/finance';

const sql = neon(process.env.DATABASE_URL!);

function normalizeFinanceEvent(event: any): FinanceEvent {
    return {
        ...event,
        totalCost: Number(event.totalCost || 0),
        sgaAmount: Number(event.sgaAmount || 0),
        groupFundsAmount: Number(event.groupFundsAmount || 0),
        attendeeCount: event.attendeeCount ? Number(event.attendeeCount) : undefined,
        costPerPerson: event.costPerPerson ? Number(event.costPerPerson) : undefined,
        purchases: typeof event.purchases === 'string'
            ? JSON.parse(event.purchases)
            : event.purchases || [],
    };
}

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

    const normalizedEvents = result.map(normalizeFinanceEvent);

    return NextResponse.json({success: true, data: normalizedEvents});
}

async function handlePOST(request: NextRequest) {
    try {
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

        if (!eventId || !category) {
            return NextResponse.json(
                {success: false, error: 'Missing required fields: eventId, category'},
                {status: 400}
            );
        }

        const normalizedTotalCost = Number(totalCost || 0);
        const normalizedSgaAmount = Number(sgaAmount || 0);
        const normalizedGroupFundsAmount = Number(groupFundsAmount || 0);

        const result = await sql`
            INSERT INTO finance_events (
                "eventId", purchases, "totalCost", category, "sgaAmount", "groupFundsAmount",
                "attendeeCount", "costPerPerson", notes, "isPaid"
            )
            VALUES (
                ${eventId}, 
                ${JSON.stringify(purchases || [])}, 
                ${normalizedTotalCost}, 
                ${category},
                ${normalizedSgaAmount}, 
                ${normalizedGroupFundsAmount}, 
                ${attendeeCount || null},
                ${costPerPerson || null}, 
                ${notes || null}, 
                ${isPaid || false}
            )
            RETURNING *
        `;

        const normalizedEvent = normalizeFinanceEvent(result[0]);
        return NextResponse.json({success: true, data: normalizedEvent});
    } catch (error: any) {
        console.error('Error creating finance event:', error);
        return NextResponse.json(
            {success: false, error: error.message || 'Failed to create finance event'},
            {status: 500}
        );
    }
}

export const { GET, POST } = createProtectedHandlers({
    GET: handleGET,
    POST: handlePOST,
});