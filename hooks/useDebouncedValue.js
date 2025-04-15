'use client';

import { useEffect, useState } from 'react';

const useDebouncedValue = (initialValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(initialValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [initialValue, delay]);

    return debouncedValue;
};

export default useDebouncedValue;