"use client";

import {signIn, useSession} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function ProtectedPage() {
    const {status} = useSession();
    useRouter();
    useEffect(() => {
        if (status === "unauthenticated") {
            signIn().then(() => console.log("sign in happens?"));
        }
    }, [status]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return <div>Protected Content</div>;
}
