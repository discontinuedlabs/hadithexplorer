import { useState } from "react";
import HadithSearch from "./components/HadithSearch";
import Header from "./components/Header";

export default function App() {
    const [language, setLanguage] = useState("en");

    return (
        <main className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header language={language} setLanguage={setLanguage} />
            <HadithSearch language={language} setLanguage={setLanguage} />
        </main>
    );
}
