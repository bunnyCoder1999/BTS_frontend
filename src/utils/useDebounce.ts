import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, time: number, callback?: (v: T) => void) {
    const [debouncedValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const changeValue = () => {
            clearTimeout(timeout);
            setDebounceValue(value);
            callback?.(value);
        };
        const timeout = setTimeout(changeValue, time);

        return () => clearTimeout(timeout);
    }, [value, time]);

    return debouncedValue;
}
