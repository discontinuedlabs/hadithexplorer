import { useEffect, useState } from "react";
import HadithSearch from "./components/HadithSearch";
import Header from "./components/Header";

export default function App() {
    const [language, setLanguage] = useState(() => {
        return JSON.parse(localStorage.getItem("language")) || "en";
    });

    useEffect(() => {
        localStorage.setItem("language", JSON.stringify(language));
    }, [language]);

    return (
        <main className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header language={language} setLanguage={setLanguage} />
            <HadithSearch language={language} setLanguage={setLanguage} />
        </main>
    );
}
