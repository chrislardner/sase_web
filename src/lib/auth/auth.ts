import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const authConfig: NextAuthConfig = {
    adapter: PostgresAdapter(pool),
    providers: [
        Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    session: {
        strategy: "database",
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);