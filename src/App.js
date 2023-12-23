import { useLocalStorage } from "./utils";
import HadithSearch from "./components/HadithSearch";
import Header from "./components/Header";

export default function App() {
    const [language, setLanguage] = useLocalStorage("language", "en");

    return (
        <main className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header language={language} setLanguage={setLanguage} />
            <HadithSearch language={language} setLanguage={setLanguage} />
        </main>
    );
}
