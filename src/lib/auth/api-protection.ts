import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { isAuthorizedForFinance } from './finance-auth-config';

export interface AuthenticatedRequest extends NextRequest {
    userId: string;
    email: string;
}

type ApiHandler = (
    request: AuthenticatedRequest,
    context?: any
) => Promise<NextResponse> | NextResponse;

export function withFinanceAuth(handler: ApiHandler) {
    return async (request: NextRequest, context?: any) => {
        try {
            const session = await auth();

            if (!session || !session.user) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Unauthorized - You must be signed in to access this endpoint',
                    },
                    { status: 401 }
                );
            }

            const email = session.user.email;
            const userId = session.user.id;

            if (!isAuthorizedForFinance(email)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Forbidden - You do not have permission to access finance data',
                        email: email || 'unknown',
                    },
                    { status: 403 }
                );
            }

            const authenticatedRequest = request as AuthenticatedRequest;
            authenticatedRequest.userId = userId!;
            authenticatedRequest.email = email!;

            return await handler(authenticatedRequest, context);
        } catch (error) {
            console.error('Finance auth middleware error:', error);

            return NextResponse.json(
                {
                    success: false,
                    error: 'Internal server error during authorization',
                },
                { status: 500 }
            );
        }
    };
}

export function createProtectedHandlers(handlers: {
    GET?: ApiHandler;
    POST?: ApiHandler;
    PUT?: ApiHandler;
    DELETE?: ApiHandler;
    PATCH?: ApiHandler;
}) {
    const protected_handlers: Record<string, any> = {};

    if (handlers.GET) protected_handlers.GET = withFinanceAuth(handlers.GET);
    if (handlers.POST) protected_handlers.POST = withFinanceAuth(handlers.POST);
    if (handlers.PUT) protected_handlers.PUT = withFinanceAuth(handlers.PUT);
    if (handlers.DELETE) protected_handlers.DELETE = withFinanceAuth(handlers.DELETE);
    if (handlers.PATCH) protected_handlers.PATCH = withFinanceAuth(handlers.PATCH);

    return protected_handlers;
}