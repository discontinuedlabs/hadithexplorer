import { useState } from "react";

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        const item = localStorage.getItem(key);
        return item ? parseJSON(item) : initialValue;
    });

    function parseJSON(data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }

    function setValue(value) {
        try {
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    }

    return [storedValue, setValue];
}
