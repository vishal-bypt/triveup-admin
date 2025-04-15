'use client';

// This hook is used to redirect user to login page if it is not logged-in
import { useEffect, useState } from "react";
import { getAuthToken } from "../components/utils/authToken";
import { useRouter } from "next/navigation";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const tokens = getAuthToken();
        if (!tokens) {
            router.push('/authentication/sign-in');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    return { isAuthenticated };
};

export default useAuth;