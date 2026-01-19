import Link from 'next/link';
import { FaMailBulk, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

interface UnauthorizedPageProps {
    searchParams: {
        email?: string;
        context?: string;
    };
}

export default function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
    const email = searchParams.email;
    const context = searchParams.context || 'this resource';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <FaShieldAlt className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-neutral-900 dark:text-neutral-50 mb-3">
                        Access Denied
                    </h1>

                    <div className="text-center text-neutral-600 dark:text-neutral-400 mb-6 space-y-3">
                        <p>
                            You don't have permission to access {context === 'finance' ? 'the Finance Dashboard' : context}.
                        </p>

                        {email && (
                            <div className="flex items-center justify-center gap-2 text-sm bg-neutral-100 dark:bg-neutral-900/50 rounded-lg p-3">
                                <FaMailBulk className="w-4 h-4" />
                                <span className="font-mono">{email}</span>
                            </div>
                        )}

                        <p className="text-sm">
                            This page is restricted to authorized SASE executive board members only.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-rhit-maroon hover:bg-rhit-maroon-dark text-white rounded-lg font-medium transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Return to Home
                        </Link>

                        <div className="text-center">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Need access?{' '}
                                <a
                                    href="mailto:lardnece@rose-hulman.edu"
                                    className="text-rhit-maroon dark:text-red-400 hover:underline font-medium"
                                >
                                    Contact your SASE Web Developer
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                            If you believe this is an error, please contact your SASE Web Developer
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}