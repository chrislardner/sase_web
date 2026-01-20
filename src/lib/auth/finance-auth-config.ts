function getAuthorizedEmails(): string[] {
    const emailsString = process.env.AUTHORIZED_FINANCE_EMAILS;

    if (!emailsString) {
        console.warn('⚠️  AUTHORIZED_FINANCE_EMAILS environment variable is not set!');
        return [];
    }

    return emailsString
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(email => email.length > 0);
}

export function isAuthorizedForFinance(email: string | null | undefined): boolean {
    if (!email) return false;

    const normalizedEmail = email.toLowerCase().trim();
    const authorizedEmails = getAuthorizedEmails();

    return authorizedEmails.includes(normalizedEmail);
}

export function getUnauthorizedMessage(email?: string): string {
    if (!email) {
        return 'You must be signed in to access the finance dashboard.';
    }

    return `Access denied. The email "${email}" is not authorized to access the finance dashboard. Contact the SASE Web Developer if you believe this is an error.`;
}