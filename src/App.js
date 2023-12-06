import React from "react";
import HadithSearch from "./components/HadithSearch";

export default function App() {
    const [language, setLanguage] = React.useState("en");

    function handleLanguageChange(event) {
        setLanguage(event.target.value);
    }

    return (
        <div className="App">
            <header>
                <img src="" alt="Hadith Explorer logo" />
                <h2>
                    Hadith Explorer <small>beta</small>
                </h2>
                <select name="language-select" value={language} onChange={handleLanguageChange}>
                    <option value="en">ُEnglish</option>
                    <option value="ar">عربي</option>
                </select>
            </header>
            <HadithSearch language={language} setLanguage={setLanguage} />
        </div>
    );
}
