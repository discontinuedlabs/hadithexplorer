import React from "react";
// import { v4 as uuidv4 } from "uuid";
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
        setAutoTranslate(language === "ar");
    }, []);

    async function handleSearch(event) {
        event.preventDefault();
        const _searchTerm = event.target[0].value;
        setSearchTerm(_searchTerm);
        if (_searchTerm) {
            if (language === "ar") fetchAhadith(_searchTerm);
            else {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${language}&tl=ar&dt=t&q=${_searchTerm}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    const translatedText = data[0][0][0];
                    fetchAhadith(translatedText);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    function fetchAhadith(term) {
        fetch(
            `https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${term}`
        )
            .then((response) => response.json())
            .then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    data.ahadith.result,
                    "text/html"
                );
                const hadithElements = Array.from(
                    doc.querySelectorAll(".hadith")
                );
                const hadithInfoElements = Array.from(
                    doc.querySelectorAll(".hadith-info")
                );
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
            <form id="search-form" onSubmit={handleSearch}>
                <input type="text" name="search-bar" id="search-bar" />
                <button
                    id="clear-button"
                    name="clear-button"
                    onClick={() => {
                        document.querySelector("input").value = "";
                    }}
                >
                    C
                </button>
                <input
                    type="submit"
                    value="Search"
                    id="search-button"
                    name="search-button"
                />
                {language !== "ar" && (
                    <div>
                        <label htmlFor="translate" id="translate-label">
                            Translate
                        </label>
                        <input
                            type="checkbox"
                            name="translate"
                            id="translate"
                            checked={autoTranslate}
                            onChange={() =>
                                setAutoTranslate(
                                    (prevAutoTranslate) => !prevAutoTranslate
                                )
                            }
                        />
                    </div>
                )}
            </form>

            {ahadith.length > 0 &&
                ahadith.map((item) => (
                    <HadithBox
                        key={item.hadithInfo} // hadithInfo is always unique because it has hadith number with more text
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
                        window.open(
                            `https://dorar.net/hadith/search?q=${searchTerm}`,
                            "_blank"
                        )
                    }
                >
                    <b>More</b>
                </button>
            )}
        </div>
    );
}
