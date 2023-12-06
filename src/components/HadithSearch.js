import React from "react";
import { v4 as uuidv4 } from "uuid";
import HadithBox from "./HadithBox";

export default function HadithSearch(props) {
    const { language, setLanguage } = props;
    const [searchTerm, setSearchTerm] = React.useState("");
    const [ahadith, setAhadith] = React.useState([]);
    const [autoTranslate, setAutoTranslate] = React.useState(false);

    /* This function is mainly made for PrayTimePro adhkar reference, it searches based on the q param in the link
    example: http://discontinuedlabs.github.io/hadithexplorer/?q=search-term&lang=ar */
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";
        const lang = params.get("lang") || "ar";
        setSearchTerm(query);
        setLanguage(lang);
        setAutoTranslate(language === "ar" ? false : true);
    }, []);

    // On searchTerm changed
    React.useEffect(() => {
        const fetchData = async () => {
            if (searchTerm) {
                if (language === "ar") {
                    await fetchAhadith(searchTerm);
                } else {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${language}&tl=ar&dt=t&q=${searchTerm}`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        const translatedText = data[0][0][0];
                        await fetchAhadith(translatedText);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        };
        fetchData();
    }, [searchTerm, language]);

    function fetchAhadith(_searchTerm) {
        fetch(`https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${_searchTerm}`)
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

    function handleSaveClick() {
        return;
    }

    return (
        <div className="hadith-search">
            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    name="search-bar"
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button
                    onClick={() => {
                        document.querySelector("input").value = "";
                    }}
                >
                    C
                </button>
            </div>
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
                    className="more-button"
                    onClick={() =>
                        window.open(`https://dorar.net/hadith/search?q=${searchTerm}`, "_blank")
                    }
                >
                    <b>More</b>
                </button>
            )}
        </div>
    );
}
