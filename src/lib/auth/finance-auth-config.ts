export const AUTHORIZED_FINANCE_EMAILS = [
    'chrislardnercl@gmail.com'
] as const;

export type AuthorizedEmail = typeof AUTHORIZED_FINANCE_EMAILS[number];

export function isAuthorizedForFinance(email: string | null | undefined): boolean {
    if (!email) return false;

    const normalizedEmail = email.toLowerCase().trim();

    return AUTHORIZED_FINANCE_EMAILS.some(
        authorizedEmail => authorizedEmail.toLowerCase() === normalizedEmail
    );
}

export function getUnauthorizedMessage(email?: string): string {
    if (!email) {
        return 'You must be signed in to access the finance dashboard.';
    }

    return `Access denied. The email "${email}" is not authorized to access the finance dashboard. Contact the SASE Web Developer if you believe this is an error.`;
}