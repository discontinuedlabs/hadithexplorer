import React from "react";
import { v4 as uuidv4 } from "uuid";
import HadithBox from "./HadithBox";

export default function HadithSearch(props) {
    const { language } = props;
    const [searchTerm, setSearchTerm] = React.useState("");
    const [ahadith, setAhadith] = React.useState([]);
    const [autoTranslate, setAutoTranslate] = React.useState(false);

    React.useEffect(() => {
        if (searchTerm) {
            fetch(`https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${searchTerm}`)
                .then((response) => response.json())
                .then((data) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data.ahadith.result, "text/html");
                    const hadithElements = Array.from(doc.querySelectorAll(".hadith"));
                    const hadithInfoElements = Array.from(doc.querySelectorAll(".hadith-info"));
                    const ahadithArray = hadithElements.map((hadith, i) => ({
                        hadith: hadith.innerHTML,
                        hadithInfo: hadithInfoElements[i]?.innerHTML || "",
                    }));
                    setAhadith(ahadithArray);
                })
                .catch((error) => console.error(error));
        }
    }, [searchTerm]);

    function handleSaveClick() {
        return;
    }

    return (
        <div className="hadith-search">
            <input type="text" onChange={(event) => setSearchTerm(event.target.value)} />
            <button
                onClick={() => {
                    document.querySelector("input").value = "";
                }}
            >
                Clear
            </button>
            {language !== "ar" && (
                <div>
                    <label htmlFor="translate">Translate</label>
                    <input
                        type="checkbox"
                        name="translate"
                        checked={autoTranslate}
                        onChange={() => setAutoTranslate((prevAutoTranslate) => !prevAutoTranslate)}
                    />
                </div>
            )}

            {ahadith.length > 0 &&
                ahadith.map((item) => (
                    <HadithBox
                        key={uuidv4()}
                        hadith={item.hadith}
                        hadithInfo={item.hadithInfo}
                        autoTranslate={autoTranslate}
                        language={language}
                        handleSaveClick={handleSaveClick}
                    />
                ))}
            {ahadith.length > 0 && (
                <button
                    onClick={() =>
                        window.open(`https://dorar.net/hadith/search?q=${searchTerm}`, "_blank")
                    }
                >
                    More
                </button>
            )}
        </div>
    );
}
