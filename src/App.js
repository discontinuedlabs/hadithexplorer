import React from "react";
import HadithSearch from "./components/HadithSearch";

export default function App() {
    const [language, setLangauge] = React.useState("en");

    return (
        <div className="App">
            <HadithSearch language={language} />
        </div>
    );
}
