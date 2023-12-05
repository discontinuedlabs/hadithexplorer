import React from "react";
import HadithSearch from "./components/HadithSearch";

export default function App() {
    const [language, setLangauge] = React.useState("en");

    function handleLanguageChange(event) {
        setLangauge(event.target.value);
    }

    return (
        <div className="App">
            <header>
                <img src="" alt="Hadith Explorer logo" />
                <h1>
                    Hadith Explorer <small>beta</small>
                </h1>
                <label htmlFor="language-select">Language</label>
                <select name="language-select" value={language} onChange={handleLanguageChange}>
                    <option value="en">ُEnglish</option>
                    <option value="ar">عربي</option>
                </select>
            </header>
            <HadithSearch language={language} />
        </div>
    );
}
