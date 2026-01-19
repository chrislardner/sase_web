'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';

function SignInForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn('resend', {
                email,
                callbackUrl,
                redirect: false,
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <FaEnvelope className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-center text-neutral-900 dark:text-neutral-50 mb-3">
                            Check Your Email
                        </h1>

                        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
                            We've sent a magic link to <strong className="text-neutral-900 dark:text-neutral-50">{email}</strong>
                        </p>

                        <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">
                            Click the link in the email to sign in. The link will expire in 24 hours.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                            SASE Finance
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Sign in to access the finance dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@rose-hulman.edu"
                                required
                                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhit-maroon dark:bg-neutral-900 dark:text-neutral-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rhit-maroon hover:bg-rhit-maroon-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                'Sending...'
                            ) : (
                                <>
                                    Send Magic Link
                                    <FaArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                            We'll send you a secure link to sign in without a password. Only authorized SASE members can access the finance dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-neutral-600 dark:text-neutral-400">Loading...</div>
            </div>
        }>
            <SignInForm />
        </Suspense>
    );
}