import { useLocalStorage } from "./utils";
import HadithSearch from "./components/HadithSearch";
import Header from "./components/Header";
import { useEffect, useState } from "react";

export default function App() {
    const [language, setLanguage] = useLocalStorage("language", "en");
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        function handleNetworkChange() {
            setOffline(!navigator.onLine);
        }
        window.addEventListener("load", () => {
            window.addEventListener("online", handleNetworkChange);
            window.addEventListener("offline", handleNetworkChange);
        });
        return () => {
            window.removeEventListener("load", handleNetworkChange);
            window.removeEventListener("online", handleNetworkChange);
            window.removeEventListener("offline", handleNetworkChange);
        };
    });

    return (
        <main className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header language={language} setLanguage={setLanguage} />
            <HadithSearch language={language} setLanguage={setLanguage} />
            <h1>{offline}</h1>
        </main>
    );
}
