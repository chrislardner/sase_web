'use client';

import {SessionProvider} from 'next-auth/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import React from 'react';

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
            </NextThemesProvider>
        </SessionProvider>
    );
}
