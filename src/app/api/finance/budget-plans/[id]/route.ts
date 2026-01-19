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
    const {name, actualEventIds, plannedEventIds} = body;

    const result = await sql`
        UPDATE budget_plans
        SET
            name = COALESCE(${name}, name),
            "actualEventIds" = COALESCE(${actualEventIds ? JSON.stringify(actualEventIds) : null}, "actualEventIds"),
            "plannedEventIds" = COALESCE(${plannedEventIds ? JSON.stringify(plannedEventIds) : null}, "plannedEventIds"),
            "updatedAt" = NOW()
        WHERE id = ${params.id}
        RETURNING *
    `;

    if (result.length === 0) {
        return NextResponse.json({success: false, error: 'Budget plan not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data: result[0]});
}

async function handleDELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const check = await sql`
        SELECT "isOfficial" FROM budget_plans WHERE id = ${params.id}
    `;

    if (check.length > 0 && check[0].isOfficial) {
        return NextResponse.json(
            {success: false, error: 'Cannot delete official plan'},
            {status: 403}
        );
    }

    const result = await sql`
        DELETE FROM budget_plans
        WHERE id = ${params.id}
            RETURNING id
    `;

    if (result.length === 0) {
        return NextResponse.json({success: false, error: 'Budget plan not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data: null});
}

export const { PUT, DELETE } = createProtectedHandlers({
    PUT: handlePUT,
    DELETE: handleDELETE,
});