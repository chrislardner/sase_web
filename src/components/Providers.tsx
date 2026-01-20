'use client';

import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {SessionProvider} from 'next-auth/react';
import React from 'react';

export function Providers({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SessionProvider>
            <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
            </NextThemesProvider>
        </SessionProvider>
    );
}