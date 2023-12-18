import { useState } from "react";
import HadithSearch from "./components/HadithSearch";

export default function App() {
    const [language, setLanguage] = useState("en");

    return (
        <div className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <header>
                <h2>
                    {/* <img
                        src={
                            process.env.PUBLIC_URL +
                            "/images/favicons/android-chrome-512x512.png"
                        }
                        alt="Hadith Explorer logo"
                        width="50px"
                    /> */}
                    Hadith Explorer <small>beta</small>
                </h2>
                <select
                    name="language-select"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                >
                    <option value="en">English</option>
                    <option value="ar">عربي</option>
                </select>
            </header>
            <HadithSearch language={language} setLanguage={setLanguage} />
        </div>
    );
}
