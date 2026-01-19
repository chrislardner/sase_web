'use client';

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
                    <h1 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-50 mb-4">
                        Oops!
                    </h1>
                    <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
                        Something went wrong. Please try again later.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/"
                            className="px-4 py-2 bg-rhit-maroon text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}