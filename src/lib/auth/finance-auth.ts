import { auth } from './auth';
import { redirect } from 'next/navigation';
import { isAuthorizedForFinance, getUnauthorizedMessage } from './finance-auth-config';

export interface FinanceAuthResult {
    userId: string;
    email: string;
    isAuthorized: true;
}

export async function requireFinanceAccess(): Promise<FinanceAuthResult> {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/auth/signin?callbackUrl=/finance');
    }

    const email = session.user.email;
    const userId = session.user.id;

    if (!isAuthorizedForFinance(email)) {
        redirect(`/unauthorized?email=${encodeURIComponent(email || '')}&context=finance`);
    }

    return {
        userId: userId!,
        email: email!,
        isAuthorized: true,
    };
}

export async function checkFinanceAccess(): Promise<FinanceAuthResult | null> {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return null;
        }

        const email = session.user.email;
        const userId = session.user.id;

        if (!isAuthorizedForFinance(email)) {
            return null;
        }

        return {
            userId: userId!,
            email: email!,
            isAuthorized: true,
        };
    } catch (error) {
        console.error('Error checking finance access:', error);
        return null;
    }
}

export async function getFinanceAuthStatus(): Promise<{
    isAuthenticated: boolean;
    isAuthorized: boolean;
    email?: string;
    userId?: string;
    message?: string;
}> {
    const session = await auth();

    if (!session || !session.user) {
        return {
            isAuthenticated: false,
            isAuthorized: false,
            message: getUnauthorizedMessage(),
        };
    }

    const email = session.user.email;
    const userId = session.user.id;

    const isAuthorized = isAuthorizedForFinance(email);

    return {
        isAuthenticated: true,
        isAuthorized,
        email: email || undefined,
        userId: userId || undefined,
        message: isAuthorized ? undefined : getUnauthorizedMessage(email || undefined),
    };
}