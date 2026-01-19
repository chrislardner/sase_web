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

async function handleGET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;

        const result = await sql`
            SELECT * FROM finance_events
            WHERE id = ${params.id}
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {success: false, error: 'Finance event not found'},
                {status: 404}
            );
        }

        const normalizedEvent = normalizeFinanceEvent(result[0]);
        return NextResponse.json({success: true, data: normalizedEvent});
    } catch (error: any) {
        console.error('Error fetching finance event:', error);
        return NextResponse.json(
            {success: false, error: error.message || 'Failed to fetch finance event'},
            {status: 500}
        );
    }
}

async function handlePUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
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

        const normalizedTotalCost = Number(totalCost || 0);
        const normalizedSgaAmount = Number(sgaAmount || 0);
        const normalizedGroupFundsAmount = Number(groupFundsAmount || 0);

        const result = await sql`
            UPDATE finance_events
            SET
                purchases = ${JSON.stringify(purchases || [])},
                "totalCost" = ${normalizedTotalCost},
                category = ${category},
                "sgaAmount" = ${normalizedSgaAmount},
                "groupFundsAmount" = ${normalizedGroupFundsAmount},
                "attendeeCount" = ${attendeeCount || null},
                "costPerPerson" = ${costPerPerson || null},
                notes = ${notes || null},
                "isPaid" = ${isPaid || false},
                "updatedAt" = NOW()
            WHERE id = ${params.id}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {success: false, error: 'Finance event not found'},
                {status: 404}
            );
        }

        const normalizedEvent = normalizeFinanceEvent(result[0]);
        return NextResponse.json({success: true, data: normalizedEvent});
    } catch (error: any) {
        console.error('Error updating finance event:', error);
        return NextResponse.json(
            {success: false, error: error.message || 'Failed to update finance event'},
            {status: 500}
        );
    }
}

async function handleDELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;

        const result = await sql`
            DELETE FROM finance_events
            WHERE id = ${params.id}
            RETURNING id
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {success: false, error: 'Finance event not found'},
                {status: 404}
            );
        }

        return NextResponse.json({success: true, data: null});
    } catch (error: any) {
        console.error('Error deleting finance event:', error);
        return NextResponse.json(
            {success: false, error: error.message || 'Failed to delete finance event'},
            {status: 500}
        );
    }
}

export const { GET, PUT, DELETE } = createProtectedHandlers({
    GET: handleGET,
    PUT: handlePUT,
    DELETE: handleDELETE,
});